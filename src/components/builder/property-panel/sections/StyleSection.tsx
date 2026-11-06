import React from "react";

export interface StyleSectionProps {
  children?: React.ReactNode;
  title?: string;
}

export function StyleSection({ children, title = "Style" }: StyleSectionProps) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-xs">
      <div className="mb-2 text-sm font-semibold text-[#000000]">{title}</div>
      {children ?? <p className="text-sm text-[#64748B]">Style controls go here.</p>}
    </section>
  );
}
