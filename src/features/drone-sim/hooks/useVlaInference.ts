import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { INITIAL_ACTION, VLA_INFERENCE_INTERVAL_MS } from '../constants'
import {
  sanitizeLanguageInstruction,
  validateLanguageInstruction,
} from '../schema'
import {
  vlaHealthQueryOptions,
  vlaPredictMutationOptions,
} from '../services/vla-api'
import type { DroneAction, InferenceMetrics } from '../types'
import {
  captureCanvasFrame,
  createConnectingState,
  createErrorState,
  createRunningState,
  INITIAL_INFERENCE_STATE,
  isAbortError,
} from '../utils'

type UseVlaInferenceOptions = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  prompt: string
  onAction: React.Dispatch<React.SetStateAction<DroneAction>>
  onForceFpv: () => void
}

export function useVlaInference({
  canvasRef,
  prompt,
  onAction,
  onForceFpv,
}: UseVlaInferenceOptions) {
  const queryClient = useQueryClient()
  const predictMutation = useMutation(vlaPredictMutationOptions())
  const [state, setState] = useState(INITIAL_INFERENCE_STATE)
  const [latestPayloadUrl, setLatestPayloadUrl] = useState<string | null>(null)
  const runningRef = useRef(false)
  const inflightRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const payloadUrlRef = useRef<string | null>(null)

  const clearNextRun = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const isRunning = useCallback(() => runningRef.current, [])

  const clearPayloadPreview = useCallback(() => {
    if (payloadUrlRef.current) {
      URL.revokeObjectURL(payloadUrlRef.current)
      payloadUrlRef.current = null
    }
  }, [])

  const updatePayloadPreview = useCallback(
    (frame: Blob) => {
      clearPayloadPreview()

      const nextPayloadUrl = URL.createObjectURL(frame)
      payloadUrlRef.current = nextPayloadUrl
      setLatestPayloadUrl(nextPayloadUrl)
    },
    [clearPayloadPreview],
  )

  const stopRuntime = useCallback(() => {
    runningRef.current = false
    abortRef.current?.abort()
    abortRef.current = null
    clearNextRun()
  }, [clearNextRun])

  const stop = useCallback(() => {
    stopRuntime()
    predictMutation.reset()
    onAction(INITIAL_ACTION)
    setState(INITIAL_INFERENCE_STATE)
  }, [onAction, predictMutation, stopRuntime])

  const scheduleNextRun = useCallback(
    (callback: () => void) => {
      clearNextRun()
      timeoutRef.current = setTimeout(callback, VLA_INFERENCE_INTERVAL_MS)
    },
    [clearNextRun],
  )

  const runSingleInference = useCallback(async () => {
    if (inflightRef.current || !runningRef.current) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      stop()
      setState(createErrorState('Canvas FPV belum siap.'))
      return
    }

    inflightRef.current = true
    const totalStartTime = performance.now()

    try {
      const captureStartTime = performance.now()
      const frame = await captureCanvasFrame(canvas)
      const captureMs = Math.round(performance.now() - captureStartTime)

      if (!frame || !isRunning()) {
        return
      }

      updatePayloadPreview(frame)

      const abortController = new AbortController()
      abortRef.current = abortController

      const requestStartTime = performance.now()
      const response = await predictMutation.mutateAsync({
        image: frame,
        languageInstruction: sanitizeLanguageInstruction(prompt),
        signal: abortController.signal,
      })
      const requestMs = Math.round(performance.now() - requestStartTime)

      if (!isRunning()) {
        return
      }

      const metrics: InferenceMetrics = {
        captureMs,
        requestMs,
        totalMs: Math.round(performance.now() - totalStartTime),
        payloadBytes: frame.size,
      }

      onAction(response.action)
      setState(createRunningState(response, metrics))
    } catch (error) {
      if (!isAbortError(error) && isRunning()) {
        setState(
          createErrorState(
            error instanceof Error ? error.message : 'Unknown error',
          ),
        )
      }
    } finally {
      abortRef.current = null
      inflightRef.current = false

      if (isRunning()) {
        scheduleNextRun(() => {
          void runSingleInference()
        })
      }
    }
  }, [
    canvasRef,
    onAction,
    predictMutation,
    prompt,
    scheduleNextRun,
    isRunning,
    stop,
    updatePayloadPreview,
  ])

  const start = useCallback(async () => {
    if (runningRef.current) {
      return
    }

    const sanitizedPrompt = sanitizeLanguageInstruction(prompt)
    const validationError = validateLanguageInstruction(sanitizedPrompt)
    if (validationError) {
      setState(createErrorState(validationError))
      return
    }

    setState(createConnectingState())
    onForceFpv()

    const isApiHealthy = await queryClient.fetchQuery(vlaHealthQueryOptions())
    if (!isApiHealthy) {
      setState(createErrorState('API unreachable — is the backend running?'))
      return
    }

    runningRef.current = true
    void runSingleInference()
  }, [onForceFpv, prompt, queryClient, runSingleInference])

  useEffect(() => {
    return () => {
      stopRuntime()
      clearPayloadPreview()
    }
  }, [clearPayloadPreview, stopRuntime])

  return {
    latestPayloadUrl,
    state,
    start,
    stop,
    isRunning: state.status === 'connecting' || state.status === 'running',
  }
}
