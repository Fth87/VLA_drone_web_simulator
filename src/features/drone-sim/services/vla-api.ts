import { mutationOptions, queryOptions } from '@tanstack/react-query'
import {
  VLA_HEALTH_STALE_TIME_MS,
  VLA_IMAGE_FILENAME,
  VLA_REQUEST_TIMEOUT_MS,
} from '../constants'
import type { InferenceResponse, PredictVlaActionInput } from '../types'

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
  formData.append('image', input.image, VLA_IMAGE_FILENAME)
  formData.append('language_instruction', input.languageInstruction)

  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
    signal: input.signal ?? AbortSignal.timeout(VLA_REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Predict failed (${response.status}): ${errorText}`)
  }

  return response.json() as Promise<InferenceResponse>
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
