"use client";

/** Slider paired with a number input; the slider covers the common range, the input goes beyond it. */
export function SliderField({
  id,
  label,
  value,
  min = 0,
  max,
  step,
  unit,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max: number;
  step: number;
  unit: string;
  display: string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`${id}-range`} className="text-[0.82rem] font-medium">
          {label}
        </label>
        <span className="text-[0.9rem] font-bold tabular-nums" aria-hidden="true">
          {display}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-3">
        <input
          id={`${id}-range`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(value, max)}
          aria-valuetext={display}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 cursor-pointer accent-brand-600"
        />
        <label htmlFor={`${id}-number`} className="sr-only">
          {label} ({unit})
        </label>
        <input
          id={`${id}-number`}
          type="number"
          inputMode="numeric"
          min={min}
          step={step}
          value={value}
          onChange={(e) => {
            const n = e.target.valueAsNumber;
            onChange(Number.isFinite(n) ? Math.max(min, n) : min);
          }}
          className="h-8 w-[5.5rem] rounded-lg border border-slate-200 px-2 text-right text-[0.8rem] font-semibold tabular-nums focus:border-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
