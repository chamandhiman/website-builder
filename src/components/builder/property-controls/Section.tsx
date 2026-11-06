import { ChevronDown } from "lucide-react";
import { useState, ReactNode } from "react";

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Section({
  title,
  defaultOpen = true,
  children,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E2E8F0] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#000000] hover:bg-[#F8FAFC] transition"
      >
        <span>{title}</span>

        <ChevronDown
          className={`h-4 w-4 text-[#64748B] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}