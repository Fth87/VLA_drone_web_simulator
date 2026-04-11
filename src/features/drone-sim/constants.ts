import type {
  DroneAction,
  OverlayVisibility,
  SimulatorSettings,
  Telemetry,
} from './types'

export const DRONE_MODEL_URL = '/drone%20model/drone_model.glb'
export const MAP_MODEL_URL = '/maps/maps_roblox.glb'

export const DRONE_BOUNDS = {
  x: 28,
  yMin: 0.35,
  yMax: 12,
  z: 28,
}

export const MAP_FOOTPRINT_SIZE = 128

export const SCENE_BACKGROUND_COLOR = '#8ecdf7'
export const SCENE_FOG_COLOR = '#b6def6'
export const SCENE_FOG_NEAR = 110
export const SCENE_FOG_FAR = 280

export const HEMISPHERE_LIGHT = {
  intensity: 0.85,
  skyColor: '#f5fbff',
  groundColor: '#b7c4d1',
} as const

export const SUN_LIGHT = {
  intensity: 1.6,
  position: [18, 24, 12] as const,
  shadowBias: -0.00012,
  shadowNormalBias: 0.025,
  shadowMapSize: 2048,
  shadowCameraNear: 1,
  shadowCameraFar: 110,
  shadowCameraLeft: -56,
  shadowCameraRight: 56,
  shadowCameraTop: 56,
  shadowCameraBottom: -56,
} as const

export const TONE_MAPPING_EXPOSURE = 1

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
