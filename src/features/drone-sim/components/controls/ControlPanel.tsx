import type { CameraMode, DroneAction } from '../../types'
import { ActionSlider } from './ActionSlider'
import { ViewModeButton } from './ViewModeButton'

type ControlPanelProps = {
  action: DroneAction
  cameraMode: CameraMode
  prompt: string
  onActionChange: React.Dispatch<React.SetStateAction<DroneAction>>
  onPromptChange: (prompt: string) => void
  onCameraModeChange: (mode: CameraMode) => void
  onReset: () => void
}

export function ControlPanel({
  action,
  cameraMode,
  prompt,
  onActionChange,
  onPromptChange,
  onCameraModeChange,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="absolute left-4 top-4 flex max-w-[360px] flex-col gap-4 rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-4 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
      <div>
        <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          VLA Action
        </p>
        <p className="mb-0 mt-2 leading-6 text-white/90">
          Isi <code>vx</code>, <code>vy</code>, <code>vz</code>, dan{' '}
          <code>yaw</code> dalam rentang <code>-1</code> sampai <code>1</code>.
          Keyboard juga aktif: <code>W/S</code>, <code>Q/E</code>,{' '}
          <code>←/→</code>, <code>A/D</code>. Prompt bisa dikirim lewat{' '}
          <code>window.setDronePrompt(...)</code>.
        </p>
      </div>

      <div className="grid gap-3">
        <ActionSlider
          label="Vx"
          value={action.vx}
          onChange={(vx) => onActionChange((current) => ({ ...current, vx }))}
        />
        <ActionSlider
          label="Vy"
          value={action.vy}
          onChange={(vy) => onActionChange((current) => ({ ...current, vy }))}
        />
        <ActionSlider
          label="Vz"
          value={action.vz}
          onChange={(vz) => onActionChange((current) => ({ ...current, vz }))}
        />
        <ActionSlider
          label="Yaw"
          value={action.yaw}
          onChange={(yaw) => onActionChange((current) => ({ ...current, yaw }))}
        />
      </div>

      <label className="block">
        <div className="mb-2 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          Prompt
        </div>
        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={3}
          placeholder="Contoh: Look at red box"
          className="pointer-events-auto w-full rounded-2xl border border-white/20 bg-black/15 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/45"
        />
      </label>

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
        className="pointer-events-auto rounded-full border border-white/35 bg-white/10 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-white/18"
      >
        Reset Drone
      </button>
    </div>
  )
}
