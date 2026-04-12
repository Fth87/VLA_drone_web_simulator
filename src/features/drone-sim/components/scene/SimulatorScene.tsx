import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { VSMShadowMap } from 'three'
import type {
  CameraMode,
  DroneAction,
  SimulatorSettings,
  Telemetry,
} from '../../types'
import { Ground } from './Ground'
import { DroneRig } from './DroneRig'

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
      <color attach="background" args={['#87c8f8']} />
      <fog attach="fog" args={['#a7d9fb', 85, 240]} />
      <hemisphereLight intensity={1.45} color="#f3fbff" groundColor="#9ca6af" />
      <directionalLight
        castShadow
        intensity={2.7}
        position={[16, 22, 8]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
      />
      <Ground />
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
