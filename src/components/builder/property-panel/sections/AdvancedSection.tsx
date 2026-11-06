import React from "react";

export interface AdvancedSectionProps {
  children?: React.ReactNode;
  title?: string;
}

export function AdvancedSection({ children, title = "Advanced" }: AdvancedSectionProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
      <div className="mb-2 text-sm font-semibold text-[#000000]">{title}</div>
      {children ?? <p className="text-sm text-[#64748B]">Advanced controls go here.</p>}
    </section>
  );
}
