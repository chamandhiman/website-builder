import React from "react";

export interface TextControlProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function TextControl({ label = "Text", value = "", placeholder = "Enter value", onChange }: TextControlProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#000000]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#000000] font-bold">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-9 w-full rounded border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] focus:ring-2 focus:ring-[#7137D8]/20"
      />
    </label>
  );
}
