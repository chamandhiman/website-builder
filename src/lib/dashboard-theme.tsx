"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Moon, Sun, Compass, Palette, Check, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    id: "dark",
    name: "Dark",
    label: "Midnight Black",
    description: "Classic deep black with gold accents",
    icon: Moon,
    accentColor: "#facc15",
    badgeBg: "bg-[#111114]",
    badgeBorder: "border-[#363636]",
    previewBg: "#0b0b0d",
  },
  {
    id: "navy",
    name: "Navy",
    label: "Navy Blue",
    description: "Deep oceanic blue with cyan highlights",
    icon: Compass,
    accentColor: "#38bdf8",
    badgeBg: "bg-[#0c152e]",
    badgeBorder: "border-sky-500/30",
    previewBg: "#070c18",
  },
  {
    id: "light",
    name: "Light",
    label: "White Clean",
    description: "Crisp white minimalist light theme",
    icon: Sun,
    accentColor: "#2563eb",
    badgeBg: "bg-white",
    badgeBorder: "border-slate-300",
    previewBg: "#f8fafc",
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
  const [theme, setThemeState] = useState<DashboardTheme>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as DashboardTheme;
      if (saved && (saved === "dark" || saved === "navy" || saved === "light")) {
        return saved;
      }
    } catch {}
    return "dark";
  });

  const setTheme = (newTheme: DashboardTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-dashboard-theme", newTheme);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-dashboard-theme", theme);
    }
  }, [theme]);

  const currentOption = useMemo(() => {
    return DASHBOARD_THEMES.find((t) => t.id === theme) || DASHBOARD_THEMES[0];
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      currentOption,
      themes: DASHBOARD_THEMES,
    }),
    [theme, currentOption]
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
    // Graceful fallback if outside provider
    const fallbackTheme: DashboardTheme = "dark";
    return {
      theme: fallbackTheme,
      setTheme: (t: DashboardTheme) => {
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-dashboard-theme", t);
        }
        try {
          localStorage.setItem(STORAGE_KEY, t);
        } catch {}
      },
      currentOption: DASHBOARD_THEMES[0],
      themes: DASHBOARD_THEMES,
    };
  }
  return context;
}

/**
 * DashboardThemeSelector
 * Multi-mode component that can render:
 * - "sidebar-row": Segmented row for expanded AppSidebar right next to Exit Dashboard
 * - "compact-icon": Single icon trigger for compact AppSidebar with dropdown
 * - "banner-button": Sleek pill button for the Hero greeting banner in ProjectDashboard
 */
export function DashboardThemeSelector({
  mode = "sidebar-row",
  className = "",
}: {
  mode?: "sidebar-row" | "compact-icon" | "banner-button";
  className?: string;
}) {
  const { theme, setTheme, currentOption, themes } = useDashboardTheme();
  const ActiveIcon = currentOption.icon;

  if (mode === "compact-icon") {
    return (
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-[#9a9aa3] hover:text-white hover:bg-white/[0.06] transition cursor-pointer outline-none relative ${className}`}
                aria-label={`Change theme (Current: ${currentOption.name})`}
              >
                <ActiveIcon className="w-4 h-4 transition-transform hover:scale-110" style={{ color: currentOption.accentColor }} />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={14}
            className="bg-[#18181c] border border-white/10 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none"
          >
            Theme: {currentOption.label}
          </TooltipContent>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={14}
            className="w-52 bg-[#16161a] border-[#26262e] text-[#f4f4f5] shadow-2xl z-50 p-1.5 rounded-xl"
          >
            <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
              Dashboard Theme
            </div>
            <DropdownMenuSeparator className="bg-[#26262e] my-1" />
            {themes.map((t) => {
              const IconComp = t.icon;
              const isSelected = theme === t.id;
              return (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center justify-between px-2.5 py-2 text-xs rounded-lg cursor-pointer transition ${
                    isSelected ? "bg-white/[0.08] text-white font-bold" : "text-[#9a9aa3] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center border"
                      style={{ backgroundColor: t.previewBg, borderColor: t.accentColor + "40" }}
                    >
                      <IconComp className="w-3.5 h-3.5" style={{ color: t.accentColor }} />
                    </span>
                    <span>{t.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ffc21a]" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    );
  }

  if (mode === "banner-button") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#151518] border border-white/10 hover:border-white/20 text-[#d4d4d8] hover:text-white font-bold text-xs transition cursor-pointer shadow-sm ${className}`}
            title="Change Dashboard Theme"
          >
            <ActiveIcon className="w-3.5 h-3.5 transition-transform" style={{ color: currentOption.accentColor }} />
            <span className="capitalize">{currentOption.name}</span>
            <Palette className="w-3 h-3 text-[#71717a] ml-0.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 bg-[#16161a] border-[#26262e] text-[#f4f4f5] shadow-2xl z-50 p-1.5 rounded-xl"
        >
          <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Select Dashboard Theme
          </div>
          <DropdownMenuSeparator className="bg-[#26262e] my-1" />
          {themes.map((t) => {
            const IconComp = t.icon;
            const isSelected = theme === t.id;
            return (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center justify-between px-2.5 py-2 text-xs rounded-lg cursor-pointer transition ${
                  isSelected ? "bg-white/[0.08] text-white font-bold" : "text-[#9a9aa3] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center border"
                    style={{ backgroundColor: t.previewBg, borderColor: t.accentColor + "40" }}
                  >
                    <IconComp className="w-3.5 h-3.5" style={{ color: t.accentColor }} />
                  </span>
                  <span>{t.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#ffc21a]" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default: "sidebar-row"
  return (
    <div className={`w-full py-1.5 ${className}`}>
      <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-semibold text-[#8e8e98]">
        <span className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#ffc21a]" />
          <span>Dashboard Theme</span>
        </span>
        <span className="text-[10px] font-bold tracking-wider text-[#ffc21a] uppercase">
          {currentOption.name}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        {themes.map((t) => {
          const IconComp = t.icon;
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                isSelected
                  ? "bg-white/[0.12] text-white shadow-xs border border-white/[0.15]"
                  : "text-[#8e8e98] hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
              title={t.label + ": " + t.description}
            >
              <IconComp
                className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "animate-in zoom-in-75 duration-150" : ""}`}
                style={{ color: isSelected ? t.accentColor : undefined }}
              />
              <span className="truncate">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
