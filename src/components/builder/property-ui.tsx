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
    <div className="mb-2.5 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-2xs transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-[#000000] font-bold transition hover:bg-[#F8FAFC]"
      >
        <span className="truncate">{title}</span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-[#A1A1AA] transition-transform duration-200 ${
            open ? "rotate-180 text-[#7137D8]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] p-3">
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
      <label className="text-[11px] font-medium text-[#000000] font-bold">
        {label}
      </label>

      {children}
    </div>
  );
}