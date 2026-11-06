import React from "react";

export interface ResponsiveSectionProps {
  children?: React.ReactNode;
  title?: string;
}

export function ResponsiveSection({ children, title = "Responsive" }: ResponsiveSectionProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
      <div className="mb-2 text-sm font-semibold text-[#000000]">{title}</div>
      {children ?? <p className="text-sm text-[#64748B]">Responsive controls go here.</p>}
    </section>
  );
}
