import type { CameraMode, DroneAction, InferenceState } from '../../types'
import { ActionSlider } from './ActionSlider'
import { ViewModeButton } from './ViewModeButton'

type ControlPanelProps = {
  action: DroneAction
  cameraMode: CameraMode
  prompt: string
  inferenceState: InferenceState
  isInferenceRunning: boolean
  latestPayloadUrl: string | null
  onActionChange: React.Dispatch<React.SetStateAction<DroneAction>>
  onPromptChange: (prompt: string) => void
  onCameraModeChange: (mode: CameraMode) => void
  onReset: () => void
  onStartInference: () => void
  onStopInference: () => void
}

function InferenceStatusBadge({ state }: { state: InferenceState }) {
  if (state.status === 'idle') return null

  const statusConfig = {
    connecting: {
      label: 'Connecting…',
      className:
        'border-amber-400/40 bg-amber-400/15 text-amber-300',
    },
    running: {
      label: `Running${state.latencyMs != null ? ` · ${state.latencyMs}ms` : ''}`,
      className:
        'border-emerald-400/40 bg-emerald-400/15 text-emerald-300',
    },
    error: {
      label: 'Error',
      className: 'border-red-400/40 bg-red-400/15 text-red-300',
    },
  } as const

  const config = statusConfig[state.status]

  return (
    <div className="grid gap-1">
      <div
        className={`inline-flex items-center gap-1.5 self-start rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${config.className}`}
      >
        {state.status === 'running' ? (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        ) : null}
        {config.label}
      </div>
      {state.error ? (
        <p className="m-0 text-[10px] leading-snug text-red-300/80">
          {state.error}
        </p>
      ) : null}
      {state.status === 'running' && state.metrics.totalMs != null ? (
        <p className="m-0 text-[10px] leading-snug text-white/65">
          cap {state.metrics.captureMs ?? '-'}ms | req {state.metrics.requestMs ?? '-'}ms | total {state.metrics.totalMs}ms | payload{' '}
          {state.metrics.payloadBytes != null
            ? `${(state.metrics.payloadBytes / 1024).toFixed(1)}KB`
            : '-'}
        </p>
      ) : null}
    </div>
  )
}

export function ControlPanel({
  action,
  cameraMode,
  prompt,
  inferenceState,
  isInferenceRunning,
  latestPayloadUrl,
  onActionChange,
  onPromptChange,
  onCameraModeChange,
  onReset,
  onStartInference,
  onStopInference,
}: ControlPanelProps) {
  const canStartInference =
    prompt.trim().length > 0 && !isInferenceRunning && inferenceState.status !== 'connecting'

  return (
    <div className="absolute left-4 top-4 flex max-w-90 flex-col gap-4 rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-4 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
      <div>
        <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          VLA Action
        </p>
        <p className="mb-0 mt-2 leading-6 text-white/90">
          Isi <code>vx</code>, <code>vy</code>, <code>vz</code>, dan{' '}
          <code>yaw</code> dalam rentang <code>-1</code> sampai <code>1</code>.
          Keyboard juga aktif: <code>W/S</code>, <code>Q/E</code>,{' '}
          <code>←/→</code>, <code>A/D</code>.
        </p>
      </div>

      <div className="grid gap-3">
        <ActionSlider
          label="Vx"
          value={action.vx}
          disabled={isInferenceRunning}
          onChange={(vx) => onActionChange((current) => ({ ...current, vx }))}
        />
        <ActionSlider
          label="Vy"
          value={action.vy}
          disabled={isInferenceRunning}
          onChange={(vy) => onActionChange((current) => ({ ...current, vy }))}
        />
        <ActionSlider
          label="Vz"
          value={action.vz}
          disabled={isInferenceRunning}
          onChange={(vz) => onActionChange((current) => ({ ...current, vz }))}
        />
        <ActionSlider
          label="Yaw"
          value={action.yaw}
          disabled={isInferenceRunning}
          onChange={(yaw) =>
            onActionChange((current) => ({ ...current, yaw }))
          }
        />
      </div>

      <label className="block">
        <div className="mb-2 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          Prompt
        </div>
        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          disabled={isInferenceRunning}
          rows={3}
          placeholder="Contoh: Look at red box"
          className="pointer-events-auto w-full rounded-2xl border border-white/20 bg-black/15 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/45 disabled:opacity-50"
        />
      </label>

      {/* Inference Controls */}
      <div className="grid gap-2.5">
        <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          VLA Inference
        </p>

        {isInferenceRunning ? (
          <button
            type="button"
            onClick={onStopInference}
            className="pointer-events-auto flex items-center justify-center gap-2 rounded-full border border-red-400/35 bg-red-500/20 px-3 py-2.5 text-[11px] font-semibold tracking-[0.18em] text-red-200 uppercase transition hover:bg-red-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
            >
              <rect x="3" y="3" width="10" height="10" rx="1.5" />
            </svg>
            Stop Inference
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartInference}
            disabled={!canStartInference}
            className="pointer-events-auto flex items-center justify-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/20 px-3 py-2.5 text-[11px] font-semibold tracking-[0.18em] text-emerald-200 uppercase transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-3 w-3"
            >
              <path d="M4.5 2.5l9 5.5-9 5.5z" />
            </svg>
            {inferenceState.status === 'connecting'
              ? 'Connecting…'
              : 'Start Inference'}
          </button>
        )}

        <InferenceStatusBadge state={inferenceState} />
      </div>

      {latestPayloadUrl ? (
        <div className="grid gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
              Payload Image
            </p>
            <a
              href={latestPayloadUrl}
              download="fpv-payload-224.jpg"
              className="pointer-events-auto text-[10px] font-semibold tracking-[0.18em] text-sky-200 uppercase underline decoration-white/30 underline-offset-3"
            >
              Download
            </a>
          </div>
          <img
            src={latestPayloadUrl}
            alt="Last payload frame sent to the VLA backend"
            className="h-32 w-32 rounded-2xl border border-white/20 object-cover shadow-[0_10px_30px_rgba(8,18,22,0.24)]"
          />
        </div>
      ) : null}

      <div>
        <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          Camera
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ViewModeButton
            active={cameraMode === 'fpv'}
            label="1 FPV"
            onClick={() => onCameraModeChange('fpv')}
          />
          <ViewModeButton
            active={cameraMode === 'third'}
            label="3 3rd"
            onClick={() => onCameraModeChange('third')}
          />
          <ViewModeButton
            active={cameraMode === 'fourth'}
            label="4 4th"
            onClick={() => onCameraModeChange('fourth')}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={isInferenceRunning}
        className="pointer-events-auto rounded-full border border-white/35 bg-white/10 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset Drone
      </button>
    </div>
  )
}
