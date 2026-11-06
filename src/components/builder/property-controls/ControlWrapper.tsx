import type { ReactNode } from "react";

export interface ControlWrapperProps {
  label: string;
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
  tooltip?: string;
}

export function ControlWrapper({ label, children, htmlFor, hint, tooltip }: ControlWrapperProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[11px] font-medium leading-none text-[#000000] font-bold" aria-label={label}>
          {label}
        </label>
        {tooltip ? (
          <span className="truncate text-[10px] text-[#000000] font-bold" title={tooltip} aria-label={tooltip}>
            {tooltip}
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-[10px] text-[#000000] font-bold">{hint}</p> : null}
    </div>
  );
}
