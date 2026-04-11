import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera, Vector3, type Group } from 'three'
import type {
  CameraMode,
  DroneAction,
  SimulatorSettings,
  Telemetry,
} from '../../types'
import { DroneVisual } from './DroneVisual'

type DroneRigProps = {
  action: DroneAction
  resetSignal: number
  cameraMode: CameraMode
  settings: SimulatorSettings
  onTelemetry: (telemetry: Telemetry) => void
}

export function DroneRig({
  action,
  resetSignal,
  cameraMode,
  settings,
  onTelemetry,
}: DroneRigProps) {
  const droneRef = useRef<Group>(null)
  const targetPosition = useMemo(() => new Vector3(9, 0.6, -8), [])
  const direction = useMemo(() => new Vector3(), [])
  const lateral = useMemo(() => new Vector3(), [])
  const desiredCameraPosition = useMemo(() => new Vector3(), [])
  const lookAtPosition = useMemo(() => new Vector3(), [])
  const worldUp = useMemo(() => new Vector3(0, 1, 0), [])
  const fpvOffset = useMemo(() => new Vector3(), [])
  const smoothLookAt = useRef(new Vector3(0, 0, 0))
  const fixedCornerPosition = useMemo(() => new Vector3(), [])

  useEffect(() => {
    if (!droneRef.current) {
      return
    }

    droneRef.current.position.set(0, 1.2, 10)
    droneRef.current.rotation.set(0, Math.PI, 0)
    smoothLookAt.current.set(0, 0, 0)
  }, [resetSignal])

  useFrame(({ camera }, delta) => {
    if (!droneRef.current) {
      return
    }

    fpvOffset.set(0, settings.fpvHeight, 0)
    fixedCornerPosition.set(
      settings.fourthX,
      settings.fourthY,
      settings.fourthZ,
    )

    droneRef.current.rotation.y -= action.yaw * settings.gainYaw * delta

    droneRef.current.getWorldDirection(direction)
    direction.y = 0
    direction.normalize().multiplyScalar(-1)
    lateral.set(direction.z, 0, -direction.x).normalize()

    droneRef.current.position.addScaledVector(
      direction,
      action.vz * settings.gainVz * delta,
    )
    droneRef.current.position.addScaledVector(
      lateral,
      action.vx * settings.gainVx * delta,
    )
    droneRef.current.position.y += action.vy * settings.gainVy * delta

    droneRef.current.position.x = MathUtils.clamp(
      droneRef.current.position.x,
      -settings.boundX,
      settings.boundX,
    )
    droneRef.current.position.y = MathUtils.clamp(
      droneRef.current.position.y,
      settings.boundYMin,
      settings.boundYMax,
    )
    droneRef.current.position.z = MathUtils.clamp(
      droneRef.current.position.z,
      -settings.boundZ,
      settings.boundZ,
    )

    if (camera instanceof PerspectiveCamera) {
      if (cameraMode === 'fpv') {
        desiredCameraPosition
          .copy(droneRef.current.position)
          .addScaledVector(direction, settings.fpvForward)
          .add(fpvOffset)
        camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-delta * 10))
        lookAtPosition
          .copy(droneRef.current.position)
          .addScaledVector(direction, settings.fpvLookDistance)
          .add(new Vector3(0, 0.32, 0))
        smoothLookAt.current.lerp(lookAtPosition, 1 - Math.exp(-delta * 7))
        camera.lookAt(smoothLookAt.current)
      }

      if (cameraMode === 'third') {
        desiredCameraPosition
          .copy(droneRef.current.position)
          .addScaledVector(direction, -settings.thirdDistance)
          .addScaledVector(worldUp, settings.thirdHeight)
        camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-delta * 4))
        lookAtPosition
          .copy(droneRef.current.position)
          .add(new Vector3(0, 0.45, 0))
        camera.lookAt(lookAtPosition)
      }

      if (cameraMode === 'fourth') {
        camera.position.lerp(fixedCornerPosition, 1 - Math.exp(-delta * 3))
        lookAtPosition
          .copy(droneRef.current.position)
          .add(new Vector3(0, 0.3, 0))
        camera.lookAt(lookAtPosition)
      }
    }

    onTelemetry({
      x: droneRef.current.position.x,
      y: droneRef.current.position.y,
      z: droneRef.current.position.z,
      yaw: droneRef.current.rotation.y,
      distanceToTarget: droneRef.current.position.distanceTo(targetPosition),
    })
  })

  return (
    <group ref={droneRef} position={[0, 1.2, 10]} rotation={[0, Math.PI, 0]}>
      <Suspense fallback={null}>
        <DroneVisual visible={cameraMode !== 'fpv'} />
      </Suspense>
    </group>
  )
}
