import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

export function PropertyCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2.5 overflow-hidden rounded-xl border border-[#262626] bg-[#171717] transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-[#F4F4F5] transition hover:bg-[#1F1F1F]"
      >
        <span className="truncate">{title}</span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-[#A1A1AA] transition-transform duration-200 ${
            open ? "rotate-180 text-[#FACC15]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-[#222222] bg-[#141414]/70 p-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function PropertyField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-[#94A3B8]">
        {label}
      </label>

      {children}
    </div>
  );
}