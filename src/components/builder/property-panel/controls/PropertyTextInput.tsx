import type { ChangeEvent } from "react";

export interface PropertyTextInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: string;
}

export function PropertyTextInput({ value = "", placeholder, onChange, onBlur, type = "text" }: PropertyTextInputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value)}
      onBlur={onBlur}
      className="h-10 w-full rounded border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#000000] placeholder:text-[#000000] font-bold outline-none transition focus:border-[#7137D8] focus:ring-2 focus:ring-[#7137D8]/20 shadow-sm"
    />
  );
}
