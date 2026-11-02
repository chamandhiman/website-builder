"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Sun, type LucideIcon } from "lucide-react";

export type DashboardTheme = "dark" | "navy" | "light";

export interface ThemeOption {
  id: DashboardTheme;
  name: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  previewBg: string;
}

export const DASHBOARD_THEMES: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    label: "White Clean",
    description: "Crisp white minimalist light theme",
    icon: Sun,
    accentColor: "#7137D8",
    badgeBg: "bg-white",
    badgeBorder: "border-slate-200",
    previewBg: "#FFFFFF",
  },
];

const STORAGE_KEY = "wto_dashboard_theme";

interface DashboardThemeContextValue {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  currentOption: ThemeOption;
  themes: ThemeOption[];
}

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null);

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<DashboardTheme>("light");

  const setTheme = (_newTheme: DashboardTheme) => {
    // Permanent light theme: theme switching is disabled
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-dashboard-theme", "light");
      document.documentElement.classList.remove("dark");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  const currentOption = DASHBOARD_THEMES[0];

  const value = useMemo(
    () => ({
      theme: "light" as DashboardTheme,
      setTheme,
      currentOption,
      themes: DASHBOARD_THEMES,
    }),
    [currentOption]
  );

  return (
    <DashboardThemeContext.Provider value={value}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);
  if (!context) {
    const fallbackTheme: DashboardTheme = "light";
    return {
      theme: fallbackTheme,
      setTheme: (_t: DashboardTheme) => {},
      currentOption: DASHBOARD_THEMES[0],
      themes: DASHBOARD_THEMES,
    };
  }
  return context;
}

/**
 * DashboardThemeSelector
 * Theme-switching is disabled in favor of permanent clean white theme.
 * Returns null to eliminate all theme controls everywhere.
 */
export function DashboardThemeSelector({
  _mode = "sidebar-row",
  _className = "",
}: {
  mode?: "sidebar-row" | "compact-icon" | "banner-button";
  className?: string;
  _mode?: "sidebar-row" | "compact-icon" | "banner-button";
  _className?: string;
}) {
  return null;
}
