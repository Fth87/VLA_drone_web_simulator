import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { signOut } from '../../../auth'
import type { OverlayVisibility, SimulatorSettings } from '../../types'
import { ToggleChip } from '../shared'

type SettingsPanelProps = {
  settings: SimulatorSettings
  visibility: OverlayVisibility
  onSettingChange: <K extends keyof SimulatorSettings>(
    key: K,
    value: SimulatorSettings[K],
  ) => void
  onResetSettings: () => void
  onVisibilityToggle: (key: keyof OverlayVisibility) => void
}

type NumericFieldProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function NumericField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: NumericFieldProps) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-[0.18em] text-white/78 uppercase">
        <span>{label}</span>
        <span className="font-mono text-white">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="pointer-events-auto h-2 w-full cursor-pointer appearance-none rounded-full bg-white/14 accent-white"
      />
    </label>
  )
}

export function SettingsPanel({
  settings,
  visibility,
  onSettingChange,
  onResetSettings,
  onVisibilityToggle,
}: SettingsPanelProps) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await signOut()
      navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
    }
  }

  if (!visibility.settings) {
    return null
  }

  return (
    <div className="absolute right-4 top-16 z-40 max-h-[calc(100vh-6rem)] w-90 overflow-y-auto rounded-[1.6rem] border border-white/28 bg-[rgba(20,39,47,0.42)] px-4 py-4 text-xs text-white shadow-[0_18px_48px_rgba(8,18,22,0.22)] backdrop-blur-md">
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
              Settings
            </p>
            <p className="mb-0 mt-2 leading-6 text-white/90">
              Atur speed, batas arena, dan offset kamera langsung dari UI.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetSettings}
            className="pointer-events-auto shrink-0 rounded-full border border-white/35 bg-white/10 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-white/18"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <NumericField
          label="Speed Vx"
          value={settings.gainVx}
          min={0.2}
          max={8}
          step={0.1}
          onChange={(value) => onSettingChange('gainVx', value)}
        />
        <NumericField
          label="Speed Vy"
          value={settings.gainVy}
          min={0.2}
          max={8}
          step={0.1}
          onChange={(value) => onSettingChange('gainVy', value)}
        />
        <NumericField
          label="Speed Vz"
          value={settings.gainVz}
          min={0.2}
          max={8}
          step={0.1}
          onChange={(value) => onSettingChange('gainVz', value)}
        />
        <NumericField
          label="Speed Yaw"
          value={settings.gainYaw}
          min={0.1}
          max={4}
          step={0.05}
          onChange={(value) => onSettingChange('gainYaw', value)}
        />
        <NumericField
          label="Bound X"
          value={settings.boundX}
          min={5}
          max={120}
          step={1}
          onChange={(value) => onSettingChange('boundX', value)}
        />
        <NumericField
          label="Bound Y Min"
          value={settings.boundYMin}
          min={0}
          max={4}
          step={0.05}
          onChange={(value) => onSettingChange('boundYMin', value)}
        />
        <NumericField
          label="Bound Y Max"
          value={settings.boundYMax}
          min={2}
          max={40}
          step={0.5}
          onChange={(value) => onSettingChange('boundYMax', value)}
        />
        <NumericField
          label="Bound Z"
          value={settings.boundZ}
          min={5}
          max={120}
          step={1}
          onChange={(value) => onSettingChange('boundZ', value)}
        />
        <NumericField
          label="FPV Forward"
          value={settings.fpvForward}
          min={0}
          max={3}
          step={0.05}
          onChange={(value) => onSettingChange('fpvForward', value)}
        />
        <NumericField
          label="FPV Height"
          value={settings.fpvHeight}
          min={0}
          max={2}
          step={0.05}
          onChange={(value) => onSettingChange('fpvHeight', value)}
        />
        <NumericField
          label="FPV Look"
          value={settings.fpvLookDistance}
          min={2}
          max={30}
          step={0.5}
          onChange={(value) => onSettingChange('fpvLookDistance', value)}
        />
        <NumericField
          label="3rd Distance"
          value={settings.thirdDistance}
          min={2}
          max={20}
          step={0.2}
          onChange={(value) => onSettingChange('thirdDistance', value)}
        />
        <NumericField
          label="3rd Height"
          value={settings.thirdHeight}
          min={0.5}
          max={10}
          step={0.1}
          onChange={(value) => onSettingChange('thirdHeight', value)}
        />
        <NumericField
          label="4th X"
          value={settings.fourthX}
          min={-40}
          max={40}
          step={0.5}
          onChange={(value) => onSettingChange('fourthX', value)}
        />
        <NumericField
          label="4th Y"
          value={settings.fourthY}
          min={1}
          max={40}
          step={0.5}
          onChange={(value) => onSettingChange('fourthY', value)}
        />
        <NumericField
          label="4th Z"
          value={settings.fourthZ}
          min={-40}
          max={40}
          step={0.5}
          onChange={(value) => onSettingChange('fourthZ', value)}
        />
      </div>

      <div className="mt-5">
        <p className="m-0 text-[0.72rem] font-semibold tracking-[0.28em] text-white/78 uppercase">
          Overlay
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ToggleChip
            active={visibility.controlPanel}
            label="Panel"
            onClick={() => onVisibilityToggle('controlPanel')}
          />
          <ToggleChip
            active={visibility.statusHud}
            label="HUD"
            onClick={() => onVisibilityToggle('statusHud')}
          />
          <ToggleChip
            active={visibility.position}
            label="Posisi"
            onClick={() => onVisibilityToggle('position')}
          />
          <ToggleChip
            active={visibility.heading}
            label="Heading"
            onClick={() => onVisibilityToggle('heading')}
          />
          <ToggleChip
            active={visibility.action}
            label="Action"
            onClick={() => onVisibilityToggle('action')}
          />
          <ToggleChip
            active={visibility.promptTarget}
            label="Prompt"
            onClick={() => onVisibilityToggle('promptTarget')}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-white/14 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="pointer-events-auto w-full rounded-lg border border-red-400/40 bg-red-500/12 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:border-red-400/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
