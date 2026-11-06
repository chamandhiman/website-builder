import React from "react";

export interface IconControlProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function IconControl({ label = "Icon", value = "sparkles", onChange }: IconControlProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#000000]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">{label}</span>
      <input
        value={value}
        placeholder="Icon name"
        onChange={(event) => onChange?.(event.target.value)}
        className="rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#000000] placeholder:text-[#606060] focus:border-[#7137D8] focus:outline-none"
      />
    </label>
  );
}
