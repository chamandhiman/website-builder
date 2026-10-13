"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useBuilder } from "@/lib/builder/store";
import { useCloudProjects } from "@/lib/builder/useCloudProjects";
import { CreateProjectDialog } from "@/components/builder/CreateProjectDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { LogOut, User as UserIcon, Home, X, Palette, Menu } from "lucide-react";
import { DashboardThemeSelector, useDashboardTheme } from "@/lib/dashboard-theme";

export function AppSidebarNav({
  className = "",
  compact,
  onClose,
}: {
  className?: string;
  compact?: boolean;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const setShowProjectDashboard = useBuilder((s) => s.setShowProjectDashboard);
  const { projects: cloudProjects } = useCloudProjects();
  const { theme, setTheme } = useDashboardTheme();

  const [createOpen, setCreateOpen] = useState(false);
  const [widgetsCount, setWidgetsCount] = useState<number>(() => {
    if (typeof window === "undefined") return 4;
    try {
      const raw = localStorage.getItem("wto_dynamic_widgets_v1");
      if (raw) return Object.keys(JSON.parse(raw)).length;
    } catch {}
    return 4;
  });

  useEffect(() => {
    let isCancelled = false;
    const fetchCount = async () => {
      try {
        const { getAllWidgets } = await import("@/services/widgetService");
        const list = await getAllWidgets();
        if (!isCancelled) setWidgetsCount(list.length || 4);
      } catch {
        try {
          const raw = localStorage.getItem("wto_dynamic_widgets_v1");
          if (raw && !isCancelled) setWidgetsCount(Object.keys(JSON.parse(raw)).length || 4);
        } catch {}
      }
    };
    void fetchCount();

    const handleEvt = () => {
      void fetchCount();
    };
    window.addEventListener("wto-widget-saved", handleEvt);
    window.addEventListener("wto-widget-deleted", handleEvt);
    window.addEventListener("storage", handleEvt);
    return () => {
      isCancelled = true;
      window.removeEventListener("wto-widget-saved", handleEvt);
      window.removeEventListener("wto-widget-deleted", handleEvt);
      window.removeEventListener("storage", handleEvt);
    };
  }, []);

  const currentPath = location.pathname;
  const isCompact = compact ?? currentPath.startsWith("/editor");

  const activeKey = useMemo(() => {
    // When in editor mode, do NOT select/highlight any navigation item
    if (isCompact || currentPath.startsWith("/editor")) {
      return null;
    }
    if (currentPath.startsWith("/dashboard/widgets") || currentPath.startsWith("/widgets")) return "widgets";
    if (currentPath.startsWith("/dashboard/templates") || currentPath.startsWith("/templates")) return "templates";
    if (currentPath.startsWith("/dashboard/projects")) return "projects";
    if (currentPath.startsWith("/dashboard/favorites")) return "favorites";
    if (currentPath.startsWith("/dashboard/trash")) return "trash";
    if (currentPath === "/dashboard" || currentPath === "/dashboard/") return "dashboard";
    if (currentPath.startsWith("/dashboard")) return "dashboard";
    return null;
  }, [currentPath, isCompact]);

  const projectsCount = useMemo(
    () => (cloudProjects as Array<{ status?: string }>).filter((p) => p.status !== "trashed").length || 4,
    [cloudProjects]
  );
  const favoritesCount = useMemo(
    () =>
      (cloudProjects as Array<{ favorite?: boolean; status?: string }>).filter(
        (p) => Boolean(p.favorite) && p.status !== "trashed"
      ).length,
    [cloudProjects]
  );
  const trashCount = useMemo(
    () => (cloudProjects as Array<{ status?: string }>).filter((p) => p.status === "trashed").length || 1,
    [cloudProjects]
  );
  const templatesCount = 11;

  const handleNav = (route: string) => {
    setShowProjectDashboard(true);
    onClose?.();
    navigate({ to: route as never });
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Web Tool Ocean";
  const userEmail = user?.email || "webtoolocean@gmail.com";
  const avatarChar = displayName.charAt(0).toUpperCase() || "W";

  const workspaceNav = [
    {
      key: "dashboard",
      label: "Dashboard",
      route: "/dashboard",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      ),
      count: null,
    },
    {
      key: "projects",
      label: "My Projects",
      route: "/dashboard/projects",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
      count: projectsCount,
    },
    {
      key: "templates",
      label: "Templates",
      route: "/dashboard/templates",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      count: templatesCount,
    },
    {
      key: "widgets",
      label: "Widgets",
      route: "/dashboard/widgets",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 12h18M12 3v18" />
        </svg>
      ),
      count: widgetsCount,
    },
  ];

  const libraryNav = [
    {
      key: "favorites",
      label: "Favorites",
      route: "/dashboard/favorites",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        </svg>
      ),
      count: favoritesCount > 0 ? favoritesCount : null,
      isTrash: false,
    },
    {
      key: "trash",
      label: "Trash",
      route: "/dashboard/trash",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
        </svg>
      ),
      count: trashCount,
      isTrash: true,
    },
  ];

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={100}>
      {/* ================= SIDEBAR ================= */}
      <aside
        data-compact={isCompact ? "true" : undefined}
        style={{
          width: isCompact ? "64px" : "260px",
          minWidth: isCompact ? "64px" : "260px",
          maxWidth: isCompact ? "64px" : "260px",
        }}
        className={`wto-sidebar ${
          isCompact
            ? "compact wto-sidebar-compact w-[64px] min-w-[64px] max-w-[64px] p-2 items-center"
            : "w-[260px] p-3 sm:p-3.5"
        } shrink-0 sticky top-0 bottom-0 h-screen max-h-screen h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-[#111114] border-r border-white/[0.07] z-40 overflow-hidden ${className}`}
      >
        {/* Pinned Top Header */}
        <div className={`shrink-0 w-full flex flex-col gap-2.5 pb-1 ${isCompact ? "items-center" : ""}`}>
          {/* Brand Header */}
          {isCompact ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleNav("/dashboard")}
                  className="flex items-center justify-center cursor-pointer hover:opacity-90 transition pt-1 outline-none"
                  aria-label="WebToolOcean Dashboard"
                >
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#ffc21a] to-[#ff9f0a] shadow-[0_8px_24px_-8px_rgba(255,194,26,0.6)]">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 32 32"
                      fill="none"
                      stroke="#1a1400"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      className="w-5 h-5 animate-pulse"
                    >
                      <path d="M5 11c3.5-3 7-3 11 0s7.5 3 11 0M5 17c3.5-3 7-3 11 0s7.5 3 11 0M5 23c3.5-3 7-3 11 0s7.5 3 11 0" />
                    </svg>
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={14}
                className="bg-[#18181c] border border-white/10 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none"
              >
                Back to Dashboard
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => handleNav("/dashboard")}
                className="flex items-center gap-3 px-1 py-1 text-left cursor-pointer hover:opacity-90 transition flex-1 min-w-0"
                aria-label="WebToolOcean home"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#ffc21a] to-[#ff9f0a] shadow-[0_8px_24px_-8px_rgba(255,194,26,0.6)]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#1a1400"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="w-6 h-6 animate-pulse"
                  >
                    <path d="M5 11c3.5-3 7-3 11 0s7.5 3 11 0M5 17c3.5-3 7-3 11 0s7.5 3 11 0M5 23c3.5-3 7-3 11 0s7.5 3 11 0" />
                  </svg>
                </span>
                <div className="truncate">
                  <strong className="block text-[15px] font-extrabold text-white tracking-tight leading-tight truncate">
                    WebToolOcean
                  </strong>
                  <small className="block text-xs text-[#6b6b74] leading-tight">Website Builder</small>
                </div>
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#888] hover:bg-white/10 hover:text-white transition shrink-0 ml-1"
                  aria-label="Close menu"
                  title="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* New Project Button */}
          {isCompact ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  aria-label="Create New Project"
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-dashed border-[#ffc21a]/30 hover:border-[#ffc21a] text-[#ffc21a] bg-[#ffc21a]/[0.02] hover:bg-[#ffc21a]/[0.08] transition text-xl font-bold cursor-pointer outline-none"
                >
                  <span>+</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={14}
                className="bg-[#18181c] border border-white/10 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none"
              >
                Create New Project
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-[#ffc21a]/30 hover:border-[#ffc21a] text-[#9a9aa3] hover:text-white bg-[#ffc21a]/[0.02] hover:bg-[#ffc21a]/[0.06] transition text-sm font-semibold cursor-pointer"
            >
              <span className="text-[#ffc21a] text-lg font-bold leading-none">+</span>
              <span>New project</span>
            </button>
          )}
        </div>

        {/* Scrollable Middle: Navigation Sections */}
        <nav
          className={`wto-sidebar-nav-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col gap-1 w-full text-xs font-semibold py-1 ${
            isCompact ? "items-center" : ""
          }`}
        >
          {!isCompact && (
            <p className="text-[11px] font-extrabold tracking-wider text-[#6b6b74] uppercase px-3 pt-2 pb-1">
              Workspace
            </p>
          )}

          {workspaceNav.map((item) => {
            const isActive = activeKey === item.key;
            if (isCompact) {
              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleNav(item.route)}
                      aria-label={item.label}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer outline-none ${
                        isActive
                          ? "bg-gradient-to-r from-[#ffc21a]/20 to-transparent text-[#ffc21a] font-bold"
                          : "text-[#9a9aa3] hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#ffc21a] rounded-r shadow-[0_0_10px_#ffc21a]" />
                      )}
                      {item.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={14}
                    className="bg-[#18181c] border border-white/10 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#ffc21a]/15 to-transparent text-[#ffc21a] font-bold"
                    : "text-[#9a9aa3] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#ffc21a] rounded-r shadow-[0_0_10px_#ffc21a]" />
                )}
                {item.icon}
                <span>{item.label}</span>
                {item.count !== null && (
                  <span
                    className={`ml-auto text-[11px] px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#ffc21a] text-[#1a1400] font-extrabold"
                        : "bg-white/[0.06] text-[#9a9aa3] font-bold"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {isCompact ? (
            <div className="w-6 h-[1px] bg-white/[0.08] my-1.5 mx-auto" />
          ) : (
            <p className="text-[11px] font-extrabold tracking-wider text-[#6b6b74] uppercase px-3 pt-3 pb-1">
              Library
            </p>
          )}

          {libraryNav.map((item) => {
            const isActive = activeKey === item.key;
            if (isCompact) {
              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleNav(item.route)}
                      aria-label={item.label}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer outline-none ${
                        isActive
                          ? "bg-gradient-to-r from-[#ffc21a]/20 to-transparent text-[#ffc21a] font-bold"
                          : "text-[#9a9aa3] hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#ffc21a] rounded-r shadow-[0_0_10px_#ffc21a]" />
                      )}
                      {item.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={14}
                    className="bg-[#18181c] border border-white/10 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#ffc21a]/15 to-transparent text-[#ffc21a] font-bold"
                    : "text-[#9a9aa3] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#ffc21a] rounded-r shadow-[0_0_10px_#ffc21a]" />
                )}
                {item.icon}
                <span>{item.label}</span>
                {item.count !== null && (
                  <span
                    className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.isTrash
                        ? "bg-[#f87171]/15 text-[#f87171]"
                        : "bg-white/[0.06] text-[#9a9aa3]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pinned Bottom Footer (Sticks to bottom) */}
        <div className={`shrink-0 w-full pt-1.5 mt-auto flex flex-col gap-1 border-t border-white/[0.08] ${isCompact ? "items-center" : ""}`}>
          {/* Theme Switcher & Exit Dashboard to Landing Page */}
          {isCompact ? (
            <>
              <DashboardThemeSelector mode="compact-icon" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/" })}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-[#9a9aa3] hover:text-[#ffc21a] hover:bg-white/[0.06] transition cursor-pointer outline-none"
                    aria-label="Exit Dashboard"
                  >
                    <Home className="w-4 h-4 text-[#ffc21a]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={14}
                  className="bg-[#18181c] border border-white/10 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg shadow-2xl z-50 pointer-events-none"
                >
                  Exit Dashboard (Landing Page)
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <DashboardThemeSelector mode="sidebar-row" />
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#9a9aa3] hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
              >
                <Home className="w-4 h-4 shrink-0 text-[#ffc21a]" />
                <span>Exit Dashboard</span>
              </button>
            </>
          )}

          {/* User Footer Profile */}
          <div className={`w-full ${isCompact ? "flex justify-center pt-0.5" : "pt-0.5"}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isCompact ? (
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#ffc21a] text-[#1a1400] font-black text-sm flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition shadow-md outline-none"
                    aria-label="User profile menu"
                  >
                    {avatarChar}
                  </button>
                ) : (
                  <div
                    className="flex items-center gap-2.5 cursor-pointer hover:bg-white/[0.02] p-1.5 rounded-xl transition"
                    role="button"
                    tabIndex={0}
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#ffc21a] text-[#1a1400] font-black text-xs flex items-center justify-center shrink-0">
                      {avatarChar}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <strong className="block text-xs font-bold text-white truncate">{displayName}</strong>
                      <small className="block text-[11px] text-[#6b6b74] truncate">{userEmail}</small>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6b6b74"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                )}
              </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isCompact ? "end" : "start"}
              side={isCompact ? "right" : "top"}
              sideOffset={isCompact ? 14 : 6}
              className="w-56 bg-[#16161a] border-[#26262e] text-[#f4f4f5] shadow-2xl z-50"
            >
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-[#f4f4f5]">{displayName}</p>
                <p className="text-[11px] text-[#8e8e98] truncate">{userEmail}</p>
              </div>
              <DropdownMenuSeparator className="bg-[#26262e]" />
              <DropdownMenuItem
                onClick={() => handleNav("/dashboard/profile" as never)}
                className="cursor-pointer text-xs focus:bg-[#25252d] focus:text-[#ffc21a]"
              >
                <UserIcon className="mr-2 h-3.5 w-3.5" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/" })}
                className="cursor-pointer text-xs focus:bg-[#25252d] focus:text-[#ffc21a]"
              >
                <Home className="mr-2 h-3.5 w-3.5 text-[#ffc21a]" />
                Exit Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const allThemes: Array<"dark" | "navy" | "light"> = ["dark", "navy", "light"];
                  const idx = allThemes.indexOf(theme);
                  const next = allThemes[(idx + 1) % allThemes.length];
                  setTheme(next);
                }}
                className="cursor-pointer text-xs focus:bg-[#25252d] focus:text-[#ffc21a] flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Palette className="mr-2 h-3.5 w-3.5 text-[#ffc21a]" />
                  Theme
                </span>
                <span className="capitalize text-[#ffc21a] font-semibold text-[11px] bg-white/[0.06] px-1.5 py-0.5 rounded">
                  {theme}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#26262e]" />
              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  navigate({ to: "/" });
                  toast.success("Logged out successfully");
                }}
                className="cursor-pointer text-xs text-red-400 focus:bg-red-950/40 focus:text-red-300"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>

      {/* Modal for creating a new project */}
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </TooltipProvider>
  );
}

export function AppSidebar({ children }: { children?: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!children) {
    return <AppSidebarNav />;
  }

  return (
    <div className="wto-app-layout flex h-screen max-h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#0b0b0d] text-[#f4f4f5]">
      {/* DESKTOP SIDEBAR - Stationary, fixed top-to-bottom, never scrolls with page */}
      <div className="hidden md:flex h-full shrink-0">
        <AppSidebarNav />
      </div>

      {/* MOBILE DRAWER (Below md: < 768px) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[260px] max-w-[85vw] flex-col bg-[#111114] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-200">
            <AppSidebarNav onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* RIGHT CONTENT AREA - Dedicated independent scrollable viewport */}
      <div className="wto-app-content-scroll flex-1 min-w-0 h-full max-h-screen max-h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#0b0b0d] flex flex-col scroll-smooth">
        {/* Mobile top bar with hamburger icon */}
        <div className="md:hidden shrink-0 flex items-center justify-between px-4 py-3 bg-[#111114] border-b border-white/[0.08] sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 p-1.5 -ml-1 text-[#9a9aa3] hover:text-white rounded-lg hover:bg-white/[0.06] transition cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5 text-[#ffc21a]" />
            <span className="text-xs font-bold text-white">Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#ffc21a] to-[#ff9f0a] shadow-sm">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none" stroke="#1a1400" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 11c3.5-3 7-3 11 0s7.5 3 11 0M5 17c3.5-3 7-3 11 0s7.5 3 11 0M5 23c3.5-3 7-3 11 0s7.5 3 11 0" />
              </svg>
            </span>
            <span className="text-xs font-extrabold text-white">WebToolOcean</span>
          </div>
        </div>

        {/* Page Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
