import type { OverlayVisibility } from '../../types'
import { ToggleChip } from '../shared'

type OverlayToolbarProps = {
  visibility: OverlayVisibility
  onToggle: (key: keyof OverlayVisibility) => void
}

export function OverlayToolbar({ visibility, onToggle }: OverlayToolbarProps) {
  return (
    <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
      <ToggleChip
        active={visibility.controlPanel}
        label="Panel"
        onClick={() => onToggle('controlPanel')}
      />
      <ToggleChip
        active={visibility.statusHud}
        label="HUD"
        onClick={() => onToggle('statusHud')}
      />
      <ToggleChip
        active={visibility.settings}
        label="Settings"
        onClick={() => onToggle('settings')}
      />
    </div>
  )
}
