import type { ChangeEvent } from "react";

export interface PropertySelectOption {
  label: string;
  value: string;
}

export interface PropertySelectProps {
  value?: string;
  options?: PropertySelectOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export function PropertySelect({ value = "", options = [], onChange, onBlur }: PropertySelectProps) {
  return (
    <select
      value={value}
      onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange?.(event.target.value)}
      onBlur={onBlur}
      className="h-10 w-full rounded border border-[#CBD5E1] bg-white px-3 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] focus:ring-2 focus:ring-[#7137D8]/20 shadow-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
