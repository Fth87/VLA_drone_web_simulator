type ViewModeButtonProps = {
  active: boolean
  label: string
  onClick: () => void
}

export function ViewModeButton({
  active,
  label,
  onClick,
}: ViewModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pointer-events-auto rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase transition ${
        active
          ? 'border-white/80 bg-white text-[#18353b]'
          : 'border-white/35 bg-white/10 text-white hover:bg-white/18'
      }`}
    >
      {label}
    </button>
  )
}
