import { MathUtils } from 'three'

export function clampActionValue(value: number) {
  return MathUtils.clamp(value, -1, 1)
}

export function normalizeHeadingDegrees(radians: number) {
  const degrees = MathUtils.radToDeg(radians)
  return ((degrees % 360) + 360) % 360
}

export { captureCanvasFrame, captureVideoFrame } from './utils/capture-frame'
export {
  createConnectingState,
  createErrorState,
  createRunningState,
  EMPTY_INFERENCE_METRICS,
  INITIAL_INFERENCE_STATE,
  isAbortError,
} from './utils/inference-state'
