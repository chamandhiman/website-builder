"use client";

import { AppSidebarNav } from "./AppSidebar";

export function AppNav({ fixed = true }: { fixed?: boolean } = {}) {
  return <AppSidebarNav className={fixed ? "fixed inset-y-0 left-0 z-40" : ""} />;
}
