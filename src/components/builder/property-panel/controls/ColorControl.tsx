import React from "react";

export interface ColorControlProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function ColorControl({ label = "Color", value = "#2563eb", onChange }: ColorControlProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#D0D0D0]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#707070]">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(event) => onChange?.(event.target.value)} className="h-9 w-14 cursor-pointer rounded border border-[#363636] bg-[#1F1F1F] p-1" />
        <span className="text-[13px] text-[#A0A0A0]">{value}</span>
      </div>
    </label>
  );
}
