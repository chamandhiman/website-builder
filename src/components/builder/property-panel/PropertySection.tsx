import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export interface PropertySectionProps {
  title: string;
  children?: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  icon?: ReactNode;
}

export function PropertySection({ title, children, isExpanded = true, onToggle, icon }: PropertySectionProps) {
  return (
    <section className="border-b border-[#2A2A2A]">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-11 w-full items-center justify-between px-0 py-0 text-left"
      >
        <div className="flex items-center gap-2">
          {icon ? <span className="text-[#707070]">{icon}</span> : null}
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#707070]">{title}</span>
        </div>
        <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} className="h-4 w-4 text-[#707070]" />
      </button>

      {isExpanded ? <div className="space-y-3 pb-4 pt-2">{children}</div> : null}
    </section>
  );
}
