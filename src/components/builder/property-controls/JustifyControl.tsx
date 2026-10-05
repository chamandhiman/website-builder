import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Square } from "lucide-react";
import { ButtonGroupControl } from "./ButtonGroupControl";

export type JustifyValue = "start" | "center" | "end" | "between" | "around";

export interface JustifyControlProps {
  label: string;
  value: JustifyValue;
  onChange: (value: JustifyValue) => void;
  disabled?: boolean;
  hint?: string;
  tooltip?: string;
}

export function JustifyControl({ label, value, onChange, disabled, hint, tooltip }: JustifyControlProps) {
  const options = [
    { label: "Start", value: "start" as const, icon: <AlignLeft className="h-4 w-4" />, tooltip: "Justify to start" },
    { label: "Center", value: "center" as const, icon: <AlignCenter className="h-4 w-4" />, tooltip: "Justify to center" },
    { label: "End", value: "end" as const, icon: <AlignRight className="h-4 w-4" />, tooltip: "Justify to end" },
    { label: "Between", value: "between" as const, icon: <AlignJustify className="h-4 w-4" />, tooltip: "Space between items" },
    { label: "Around", value: "around" as const, icon: <Square className="h-4 w-4" />, tooltip: "Space around items" },
  ];

  return (
    <ButtonGroupControl
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled}
      hint={hint}
      tooltip={tooltip}
    />
  );
}
