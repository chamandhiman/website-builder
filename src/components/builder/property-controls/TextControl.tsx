import { useId } from "react";
import { ControlWrapper } from "./ControlWrapper";

export interface TextControlProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
  tooltip?: string;
}

export function TextControl({
  label,
  value,
  placeholder = "",
  onChange,
  disabled = false,
  hint,
  tooltip,
}: TextControlProps) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-[#000000] font-bold">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-md border border-[#CBD5E1] bg-white px-2.5 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]/20 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}