import React from "react";

export interface TextAreaControlProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function TextAreaControl({ label = "Text area", value = "", placeholder = "Enter content", onChange }: TextAreaControlProps) {
  return (
    <label className="flex flex-col gap-1 text-[#000000]">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#000000] font-bold">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="min-h-16 rounded-[8px] border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] focus:ring-2 focus:ring-[#7137D8]/60"
        style={{ resize: "vertical" }}
      />
    </label>
  );
}
