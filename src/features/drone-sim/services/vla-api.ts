import { mutationOptions, queryOptions } from '@tanstack/react-query'
import {
  VLA_HEALTH_STALE_TIME_MS,
  VLA_IMAGE_FILENAME,
  VLA_REQUEST_TIMEOUT_MS,
} from '../constants'
import type {
  InferApiResponse,
  InferenceResponse,
  PredictVlaActionInput,
} from '../types'

const BASE_URL =
  import.meta.env.VITE_VLA_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:8000'
const VLA_QUERY_KEYS = {
  all: ['vla'] as const,
  health: () => [...VLA_QUERY_KEYS.all, 'health'] as const,
}

/**
 * Check API health.
 * Returns `true` if the API is reachable and healthy.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      signal: AbortSignal.timeout(VLA_REQUEST_TIMEOUT_MS),
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Send an FPV frame + language instruction to the VLA model.
 * Returns the predicted action (vx, vy, vz, yaw).
 */
export async function predict(
  input: PredictVlaActionInput,
): Promise<InferenceResponse> {
  const formData = new FormData()
  formData.append('image_input', input.image, VLA_IMAGE_FILENAME)
  formData.append('task_input', input.languageInstruction)
  formData.append('state_input', input.stateInput ?? '')

  const response = await fetch(`${BASE_URL}/infer`, {
    method: 'POST',
    body: formData,
    signal: input.signal ?? AbortSignal.timeout(VLA_REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Predict failed (${response.status}): ${errorText}`)
  }

  const payload = (await response.json()) as InferApiResponse

  if (!payload.success) {
    throw new Error(payload.error || 'Inference failed')
  }

  if (!Array.isArray(payload.first_action) || payload.first_action.length < 4) {
    throw new Error('Inference response missing first_action with 4 values')
  }

  const [vxRaw, vyRaw, vzRaw, yawRaw] = payload.first_action
  const vx = Number(vxRaw)
  const vy = Number(vyRaw)
  const vz = Number(vzRaw)
  const yaw = Number(yawRaw)

  if (![vx, vy, vz, yaw].every(Number.isFinite)) {
    throw new Error('Inference response contains non-numeric action values')
  }

  return {
    action: { vx, vy, vz, yaw },
    timestamp: new Date().toISOString(),
  }
}

export function vlaHealthQueryOptions() {
  return queryOptions({
    queryKey: VLA_QUERY_KEYS.health(),
    queryFn: checkHealth,
    staleTime: VLA_HEALTH_STALE_TIME_MS,
    retry: 1,
  })
}

export function vlaPredictMutationOptions() {
  return mutationOptions({
    mutationFn: predict,
  })
}
