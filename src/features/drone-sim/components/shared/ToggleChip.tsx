type ToggleChipProps = {
  active: boolean
  label: string
  onClick: () => void
}

export function ToggleChip({ active, label, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pointer-events-auto rounded-full border px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition ${
        active
          ? 'border-white/65 bg-white text-black/70'
          : 'border-white/30 bg-white/10 text-white hover:bg-white/16'
      }`}
    >
      {label}
    </button>
  )
}
