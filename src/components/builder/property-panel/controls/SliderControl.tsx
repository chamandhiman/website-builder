import React from "react";

export interface SliderControlProps {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export function SliderControl({ label = "Slider", value = 50, min = 0, max = 100, onChange }: SliderControlProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#D0D0D0]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#707070]">{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange?.(Number(event.target.value))} className="w-full accent-[#FACC15]" />
      <span className="text-xs text-[#969696]">{value}</span>
    </label>
  );
}
