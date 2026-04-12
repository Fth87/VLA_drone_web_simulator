import type {
  DroneAction,
  OverlayVisibility,
  SimulatorSettings,
  Telemetry,
} from './types'

export const DRONE_MODEL_URL = '/drone%20model/drone_model.glb'

export const DRONE_BOUNDS = {
  x: 28,
  yMin: 0.35,
  yMax: 12,
  z: 28,
}

export const TARGET_SIZE = 1.2
export const VLA_REQUEST_TIMEOUT_MS = 10_000
export const VLA_INFERENCE_INTERVAL_MS = 100
export const VLA_JPEG_QUALITY = 0.8
export const VLA_IMAGE_SIZE = 224
export const VLA_IMAGE_FILENAME = 'fpv_frame.jpg'
export const VLA_HEALTH_STALE_TIME_MS = 30_000
export const VLA_PROMPT_MAX_LENGTH = 160

export const ACTION_GAIN = {
  vx: 1.8,
  vy: 1.4,
  vz: 2.1,
  yaw: 0.9,
}

export const DEFAULT_SIMULATOR_SETTINGS: SimulatorSettings = {
  gainVx: ACTION_GAIN.vx,
  gainVy: ACTION_GAIN.vy,
  gainVz: ACTION_GAIN.vz,
  gainYaw: ACTION_GAIN.yaw,
  boundX: DRONE_BOUNDS.x,
  boundYMin: DRONE_BOUNDS.yMin,
  boundYMax: DRONE_BOUNDS.yMax,
  boundZ: DRONE_BOUNDS.z,
  fpvForward: 0.8,
  fpvHeight: 0.34,
  fpvLookDistance: 12,
  thirdDistance: 7.8,
  thirdHeight: 3.1,
  fourthX: -18,
  fourthY: 13,
  fourthZ: 18,
}

export const DEFAULT_OVERLAY_VISIBILITY: OverlayVisibility = {
  controlPanel: true,
  statusHud: true,
  position: true,
  heading: true,
  action: true,
  promptTarget: true,
  settings: false,
}

export const INITIAL_ACTION: DroneAction = {
  vx: 0,
  vy: 0,
  vz: 0,
  yaw: 0,
}

export const INITIAL_TELEMETRY: Telemetry = {
  x: 0,
  y: 1.2,
  z: 10,
  yaw: Math.PI,
  distanceToTarget: 0,
}
