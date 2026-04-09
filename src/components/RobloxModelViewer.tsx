import { useEffect, useState } from 'react'
import {
  DEFAULT_OVERLAY_VISIBILITY,
  DEFAULT_SIMULATOR_SETTINGS,
  INITIAL_ACTION,
  INITIAL_TELEMETRY,
} from '../features/drone-sim/constants'
import {
  ControlPanel,
  OverlayToolbar,
  SettingsPanel,
  SimulatorScene,
  StatusHud,
} from '../features/drone-sim/components'
import { useDroneActionBridge } from '../features/drone-sim/hooks/useDroneActionBridge'
import type {
  CameraMode,
  OverlayVisibility,
  SimulatorSettings,
} from '../features/drone-sim/types'

const SIMULATOR_SETTINGS_STORAGE_KEY = 'drone-sim:settings'

function sanitizeSimulatorSettings(value: unknown): SimulatorSettings {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SIMULATOR_SETTINGS
  }

  const candidate = value as Partial<Record<keyof SimulatorSettings, unknown>>
  const mergedSettings: SimulatorSettings = { ...DEFAULT_SIMULATOR_SETTINGS }

  for (const key of Object.keys(DEFAULT_SIMULATOR_SETTINGS) as Array<
    keyof SimulatorSettings
  >) {
    const nextValue = candidate[key]

    if (typeof nextValue === 'number' && Number.isFinite(nextValue)) {
      mergedSettings[key] = nextValue
    }
  }

  if (mergedSettings.boundYMin > mergedSettings.boundYMax) {
    mergedSettings.boundYMax = mergedSettings.boundYMin
  }

  return mergedSettings
}

function loadStoredSimulatorSettings(): SimulatorSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SIMULATOR_SETTINGS
  }

  const rawSettings = window.localStorage.getItem(SIMULATOR_SETTINGS_STORAGE_KEY)

  if (!rawSettings) {
    return DEFAULT_SIMULATOR_SETTINGS
  }

  try {
    return sanitizeSimulatorSettings(JSON.parse(rawSettings))
  } catch {
    return DEFAULT_SIMULATOR_SETTINGS
  }
}

function ViewerFallback() {
  return (
    <div className="viewer-shell flex h-full min-h-screen items-center justify-center px-6 py-10 text-center text-sm text-[var(--sea-ink-soft)]">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.24em] text-[var(--kicker)] uppercase">
          Drone Simulator
        </p>
        <p className="m-0">Menyiapkan arena uji dan drone model...</p>
      </div>
    </div>
  )
}

export default function RobloxModelViewer() {
  const [mounted, setMounted] = useState(false)
  const [cameraMode, setCameraMode] = useState<CameraMode>('third')
  const { action, setModelAction, setKeyboardAction } =
    useDroneActionBridge(setCameraMode)
  const [resetSignal, setResetSignal] = useState(0)
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY)
  const [prompt, setPrompt] = useState('')
  const [settings, setSettings] = useState<SimulatorSettings>(
    loadStoredSimulatorSettings,
  )
  const [visibility, setVisibility] = useState(DEFAULT_OVERLAY_VISIBILITY)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    window.setDronePrompt = (nextPrompt: string) => {
      setPrompt(nextPrompt)
    }

    return () => {
      delete window.setDronePrompt
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      SIMULATOR_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings),
    )
  }, [settings])

  if (!mounted) {
    return <ViewerFallback />
  }

  const handleSettingChange = <K extends keyof SimulatorSettings>(
    key: K,
    value: SimulatorSettings[K],
  ) => {
    setSettings((current) => {
      const nextSettings = {
        ...current,
        [key]: value,
      }

      if (
        key === 'boundYMin' &&
        nextSettings.boundYMin > nextSettings.boundYMax
      ) {
        nextSettings.boundYMax = nextSettings.boundYMin
      }

      if (
        key === 'boundYMax' &&
        nextSettings.boundYMax < nextSettings.boundYMin
      ) {
        nextSettings.boundYMin = nextSettings.boundYMax
      }

      return nextSettings
    })
  }

  const toggleVisibility = (key: keyof OverlayVisibility) => {
    setVisibility((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="viewer-shell relative h-full min-h-screen w-full overflow-hidden">
      <SimulatorScene
        action={action}
        resetSignal={resetSignal}
        cameraMode={cameraMode}
        settings={settings}
        onTelemetry={setTelemetry}
      />

      <OverlayToolbar visibility={visibility} onToggle={toggleVisibility} />

      {visibility.controlPanel ? (
        <ControlPanel
          action={action}
          cameraMode={cameraMode}
          prompt={prompt}
          onActionChange={setModelAction}
          onPromptChange={setPrompt}
          onCameraModeChange={setCameraMode}
          onReset={() => {
            setModelAction(INITIAL_ACTION)
            setKeyboardAction(INITIAL_ACTION)
            setResetSignal((current) => current + 1)
          }}
        />
      ) : null}

      <SettingsPanel
        settings={settings}
        visibility={visibility}
        onSettingChange={handleSettingChange}
        onResetSettings={() => setSettings(DEFAULT_SIMULATOR_SETTINGS)}
        onVisibilityToggle={toggleVisibility}
      />

      <StatusHud
        telemetry={telemetry}
        action={action}
        prompt={prompt}
        cameraMode={cameraMode}
        visibility={visibility}
      />
    </div>
  )
}
