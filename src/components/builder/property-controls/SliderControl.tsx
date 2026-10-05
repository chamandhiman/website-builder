import { useEffect, useState } from "react";

interface SliderControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SliderControl({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
}: SliderControlProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const pct = max > min ? ((localValue - min) / (max - min)) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-medium text-[#969696]">{label}</label>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLocalValue(v);
            onChange(v);
          }}
          className="w-16 rounded-md border border-[#363636] bg-[#171717] px-2 py-1 text-right text-[12px] text-[#F5F5F5] outline-none focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLocalValue(v);
              onChange(v);
            }}
            className="slider-dark h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none"
            style={{
              background: `linear-gradient(to right, #FACC15 ${pct}%, #2E2E2E ${pct}%)`,
            }}
          />
        </div>
        {unit ? (
          <span className="w-8 shrink-0 text-right text-[11px] text-[#707070]">{unit}</span>
        ) : null}
      </div>
    </div>
  );
}