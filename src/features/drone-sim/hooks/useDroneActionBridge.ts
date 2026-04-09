import { useEffect, useMemo, useState } from 'react'
import { INITIAL_ACTION } from '../constants'
import type { CameraMode, DroneAction } from '../types'
import { clampActionValue } from '../utils'

type DroneActionBridge = {
  action: DroneAction
  setModelAction: React.Dispatch<React.SetStateAction<DroneAction>>
  setKeyboardAction: React.Dispatch<React.SetStateAction<DroneAction>>
}

const movementAxisMap: Record<string, keyof DroneAction | undefined> = {
  w: 'vz',
  arrowup: 'vz',
  s: 'vz',
  arrowdown: 'vz',
  e: 'vy',
  q: 'vy',
  a: 'yaw',
  d: 'yaw',
  arrowleft: 'vx',
  arrowright: 'vx',
}

function movementValue(key: string) {
  switch (key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      return 1
    case 's':
    case 'arrowdown':
      return -1
    case 'e':
      return 1
    case 'q':
      return -1
    case 'a':
      return -1
    case 'd':
      return 1
    case 'arrowleft':
      return 1
    case 'arrowright':
      return -1
    default:
      return 0
  }
}

export function useDroneActionBridge(
  setCameraMode: (mode: CameraMode) => void,
): DroneActionBridge {
  const [modelAction, setModelAction] = useState(INITIAL_ACTION)
  const [keyboardAction, setKeyboardAction] = useState(INITIAL_ACTION)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') {
        setCameraMode('fpv')
      }
      if (event.key === '3') {
        setCameraMode('third')
      }
      if (event.key === '4') {
        setCameraMode('fourth')
      }

      const axis = movementAxisMap[event.key.toLowerCase()]
      if (!axis) {
        return
      }

      setKeyboardAction((current) => ({
        ...current,
        [axis]: movementValue(event.key),
      }))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const axis = movementAxisMap[event.key.toLowerCase()]
      if (!axis) {
        return
      }

      setKeyboardAction((current) => ({
        ...current,
        [axis]: 0,
      }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [setCameraMode])

  useEffect(() => {
    window.setDroneAction = (nextAction) => {
      setModelAction((current) => ({
        vx: clampActionValue(nextAction.vx ?? current.vx),
        vy: clampActionValue(nextAction.vy ?? current.vy),
        vz: clampActionValue(nextAction.vz ?? current.vz),
        yaw: clampActionValue(nextAction.yaw ?? current.yaw),
      }))
    }

    return () => {
      delete window.setDroneAction
    }
  }, [])

  const action = useMemo(
    () => ({
      vx: clampActionValue(modelAction.vx + keyboardAction.vx),
      vy: clampActionValue(modelAction.vy + keyboardAction.vy),
      vz: clampActionValue(modelAction.vz + keyboardAction.vz),
      yaw: clampActionValue(modelAction.yaw + keyboardAction.yaw),
    }),
    [keyboardAction, modelAction],
  )

  return { action, setModelAction, setKeyboardAction }
}
