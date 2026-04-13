import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { VSMShadowMap } from 'three'
import {
  HEMISPHERE_LIGHT,
  SCENE_BACKGROUND_COLOR,
  SCENE_FOG_COLOR,
  SCENE_FOG_FAR,
  SCENE_FOG_NEAR,
  SUN_LIGHT,
} from '../../constants'
import type {
  CameraMode,
  DroneAction,
  SimulatorSettings,
  Telemetry,
} from '../../types'
import { DroneRig } from './DroneRig'
import { EnvironmentMap } from './EnvironmentMap'
import { SceneEnvironment } from './SceneEnvironment'

type SimulatorSceneProps = {
  action: DroneAction
  resetSignal: number
  cameraMode: CameraMode
  settings: SimulatorSettings
  onTelemetry: (telemetry: Telemetry) => void
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
}

export function SimulatorScene({
  action,
  resetSignal,
  cameraMode,
  settings,
  onTelemetry,
  canvasRef,
}: SimulatorSceneProps) {
  const internalRef = useRef<HTMLCanvasElement | null>(null)

  // Sync internal canvas ref to parent's ref
  useEffect(() => {
    if (canvasRef && internalRef.current) {
      ;(canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
        internalRef.current
    }
  })

  return (
    <Canvas
      ref={internalRef}
      shadows={{
        type: VSMShadowMap,
      }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      camera={{ position: [0, 3, 14], fov: 58 }}
    >
      <SceneEnvironment />
      <color attach="background" args={[SCENE_BACKGROUND_COLOR]} />
      <fog
        attach="fog"
        args={[SCENE_FOG_COLOR, SCENE_FOG_NEAR, SCENE_FOG_FAR]}
      />
      <hemisphereLight
        intensity={HEMISPHERE_LIGHT.intensity}
        color={HEMISPHERE_LIGHT.skyColor}
        groundColor={HEMISPHERE_LIGHT.groundColor}
      />
      <directionalLight
        castShadow
        intensity={SUN_LIGHT.intensity}
        position={SUN_LIGHT.position}
        shadow-bias={SUN_LIGHT.shadowBias}
        shadow-normalBias={SUN_LIGHT.shadowNormalBias}
        shadow-mapSize-width={SUN_LIGHT.shadowMapSize}
        shadow-mapSize-height={SUN_LIGHT.shadowMapSize}
        shadow-camera-near={SUN_LIGHT.shadowCameraNear}
        shadow-camera-far={SUN_LIGHT.shadowCameraFar}
        shadow-camera-left={SUN_LIGHT.shadowCameraLeft}
        shadow-camera-right={SUN_LIGHT.shadowCameraRight}
        shadow-camera-top={SUN_LIGHT.shadowCameraTop}
        shadow-camera-bottom={SUN_LIGHT.shadowCameraBottom}
      />
      <Suspense fallback={null}>
        <EnvironmentMap />
      </Suspense>
      <DroneRig
        action={action}
        resetSignal={resetSignal}
        cameraMode={cameraMode}
        settings={settings}
        onTelemetry={onTelemetry}
      />
    </Canvas>
  )
}
