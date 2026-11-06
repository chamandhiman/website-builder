import React from "react";

export interface TypographyControlProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function TypographyControl({ label = "Typography", value = "Inter", onChange }: TypographyControlProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[#000000]">
      <span className="font-medium">{label}</span>
      <input value={value} placeholder="Font family" onChange={(event) => onChange?.(event.target.value)} className="rounded border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#000000]" />
    </label>
  );
}
