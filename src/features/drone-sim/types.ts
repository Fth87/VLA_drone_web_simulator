export type CameraMode = 'fpv' | 'third' | 'fourth'

export type DroneAction = {
  vx: number
  vy: number
  vz: number
  yaw: number
}

export type Telemetry = {
  x: number
  y: number
  z: number
  yaw: number
  distanceToTarget: number
}

export type SimulatorSettings = {
  gainVx: number
  gainVy: number
  gainVz: number
  gainYaw: number
  boundX: number
  boundYMin: number
  boundYMax: number
  boundZ: number
  fpvForward: number
  fpvHeight: number
  fpvLookDistance: number
  thirdDistance: number
  thirdHeight: number
  fourthX: number
  fourthY: number
  fourthZ: number
}

export type OverlayVisibility = {
  controlPanel: boolean
  statusHud: boolean
  position: boolean
  heading: boolean
  action: boolean
  promptTarget: boolean
  settings: boolean
}

export type InferenceStatus = 'idle' | 'connecting' | 'running' | 'error'

export type InferenceResponse = {
  action: DroneAction
  timestamp: string
}

export type PredictVlaActionInput = {
  image: Blob
  languageInstruction: string
  signal?: AbortSignal
}

export type InferenceMetrics = {
  captureMs: number | null
  requestMs: number | null
  totalMs: number | null
  payloadBytes: number | null
}

export type InferenceState = {
  status: InferenceStatus
  latencyMs: number | null
  error: string | null
  lastTimestamp: string | null
  metrics: InferenceMetrics
}

declare global {
  interface Window {
    setDroneAction?: (action: Partial<DroneAction>) => void
    setDronePrompt?: (prompt: string) => void
  }
}
