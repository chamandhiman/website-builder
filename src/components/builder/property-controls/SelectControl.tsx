import { useId } from "react";
import { ControlWrapper } from "./ControlWrapper";

export interface SelectOption {
  label: string;
  value: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface SelectControlProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
  tooltip?: string;
}

export function SelectControl({
  label,
  value,
  options,
  onChange,
  disabled = false,
  hint,
  tooltip,
}: SelectControlProps) {
  const id = useId();

  return (
    <ControlWrapper label={label} hint={hint} tooltip={tooltip} htmlFor={id}>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-lg border border-[#CBD5E1] bg-white px-2.5 text-[13px] text-[#000000] outline-none transition duration-150 focus:border-[#7137D8] focus:ring-2 focus:ring-[#7137D8]/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled} title={option.tooltip}>
            {option.label}
          </option>
        ))}
      </select>
    </ControlWrapper>
  );
}
