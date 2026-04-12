import type {
  InferenceMetrics,
  InferenceResponse,
  InferenceState,
} from '../types'

export const EMPTY_INFERENCE_METRICS: InferenceMetrics = {
  captureMs: null,
  requestMs: null,
  totalMs: null,
  payloadBytes: null,
}

export const INITIAL_INFERENCE_STATE: InferenceState = {
  status: 'idle',
  latencyMs: null,
  error: null,
  lastTimestamp: null,
  metrics: EMPTY_INFERENCE_METRICS,
}

export function createConnectingState(): InferenceState {
  return {
    ...INITIAL_INFERENCE_STATE,
    status: 'connecting',
  }
}

export function createErrorState(error: string): InferenceState {
  return {
    status: 'error',
    latencyMs: null,
    error,
    lastTimestamp: null,
    metrics: EMPTY_INFERENCE_METRICS,
  }
}

export function createRunningState(
  response: InferenceResponse,
  metrics: InferenceMetrics,
): InferenceState {
  return {
    status: 'running',
    latencyMs: metrics.totalMs,
    error: null,
    lastTimestamp: response.timestamp,
    metrics,
  }
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}
