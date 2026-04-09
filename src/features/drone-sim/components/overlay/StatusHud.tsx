import type {
  CameraMode,
  DroneAction,
  OverlayVisibility,
  Telemetry,
} from '../../types'
import { normalizeHeadingDegrees } from '../../utils'

type StatusHudProps = {
  telemetry: Telemetry
  action: DroneAction
  prompt: string
  cameraMode: CameraMode
  visibility: OverlayVisibility
}

export function StatusHud({
  telemetry,
  action,
  prompt,
  cameraMode,
  visibility,
}: StatusHudProps) {
  if (!visibility.statusHud) {
    return null
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-4">
      {visibility.position ? (
        <div className="rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-3 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
          <p className="m-0 text-[0.7rem] font-semibold tracking-[0.24em] text-white/70 uppercase">
            Posisi
          </p>
          <p className="mb-0 mt-2 font-mono text-white">
            x {telemetry.x.toFixed(2)} | y {telemetry.y.toFixed(2)} | z{' '}
            {telemetry.z.toFixed(2)}
          </p>
        </div>
      ) : null}
      {visibility.heading ? (
        <div className="rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-3 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
          <p className="m-0 text-[0.7rem] font-semibold tracking-[0.24em] text-white/70 uppercase">
            Heading
          </p>
          <p className="mb-0 mt-2 font-mono text-white">
            {normalizeHeadingDegrees(telemetry.yaw).toFixed(1)} deg
          </p>
        </div>
      ) : null}
      {visibility.action ? (
        <div className="rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-3 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
          <p className="m-0 text-[0.7rem] font-semibold tracking-[0.24em] text-white/70 uppercase">
            Action
          </p>
          <p className="mb-0 mt-2 font-mono text-white">
            vx {action.vx.toFixed(2)} | vy {action.vy.toFixed(2)} | vz{' '}
            {action.vz.toFixed(2)}
          </p>
        </div>
      ) : null}
      {visibility.promptTarget ? (
        <div className="rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-3 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
          <p className="m-0 text-[0.7rem] font-semibold tracking-[0.24em] text-white/70 uppercase">
            Prompt / Target
          </p>
          <p className="mb-0 mt-2 font-mono text-white">
            {prompt.trim() ? 'prompt ready' : 'no prompt'} |{' '}
            {telemetry.distanceToTarget.toFixed(2)} m
          </p>
          <p className="mb-0 mt-2 font-mono text-white/70">{cameraMode}</p>
        </div>
      ) : null}
    </div>
  )
}
