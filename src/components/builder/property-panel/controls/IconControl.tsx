import React from "react";

export interface IconControlProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function IconControl({ label = "Icon", value = "sparkles", onChange }: IconControlProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#D0D0D0]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#707070]">{label}</span>
      <input
        value={value}
        placeholder="Icon name"
        onChange={(event) => onChange?.(event.target.value)}
        className="rounded-md border border-[#363636] bg-[#171717] px-3 py-2 text-sm text-[#F5F5F5] placeholder:text-[#606060] focus:border-[#FACC15] focus:outline-none"
      />
    </label>
  );
}
