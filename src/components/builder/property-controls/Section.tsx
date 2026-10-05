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
    <div className="border-b border-[#2A2A2A] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-[#E0E0E0] hover:bg-[#252525] transition"
      >
        <span>{title}</span>

        <ChevronDown
          className={`h-4 w-4 text-[#707070] transition-transform ${
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