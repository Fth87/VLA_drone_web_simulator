type ActionSliderProps = {
  label: string
  value: number
  disabled?: boolean
  onChange: (value: number) => void
}

export function ActionSlider({
  label,
  value,
  disabled = false,
  onChange,
}: ActionSliderProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-[0.72rem] font-semibold tracking-[0.22em] text-white/72 uppercase">
        <span>{label}</span>
        <span className="font-mono text-white">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={-1}
        max={1}
        step={0.01}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="pointer-events-auto w-full accent-white disabled:cursor-not-allowed disabled:opacity-55"
      />
    </label>
  )
}
