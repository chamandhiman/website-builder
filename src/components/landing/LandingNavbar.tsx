"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { LoginDropdown } from "@/components/auth/LoginDropdown";

interface LandingNavbarProps {
  onOpenAuthModal?: () => void;
}

export function LandingNavbar({ onOpenAuthModal }: LandingNavbarProps) {
  const { user, authReady, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to sign out");
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Account";
  const userInitials =
    user?.initials ||
    displayName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) ||
    "U";

  // Check if photo is present and hasn't failed to load
  const hasValidPhoto = Boolean(user?.photoURL && !avatarError);

  return (
    <nav className="top">
      <a className="brand" href="#">
        WebTool<b>Ocean</b>
      </a>

      <div className="menu">
        <a href="#templates">Templates</a>
        <a href="#features">Features</a>
        <a href="#widgets">Widgets</a>
        <a href="#launch">Launch</a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {authReady && user ? (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex items-center gap-2.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-yellow-400/50 transition-all duration-200 outline-none select-none cursor-pointer shadow-sm"
                title={`Signed in as ${user.email || displayName}`}
              >
                {/* Modern Avatar with Google Referrer Fix & Fallback */}
                <div className="relative flex items-center justify-center h-7 w-7 rounded-full overflow-hidden shrink-0 border border-white/15 bg-[#1F1F1F]">
                  {hasValidPhoto ? (
                    <img
                      src={user?.photoURL}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={() => setAvatarError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-amber-400 to-yellow-500 font-bold text-black text-[11px] uppercase tracking-tight">
                      {userInitials}
                    </span>
                  )}
                  {/* Subtle online status indicator */}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-[#141417]" />
                </div>

                {/* User Name */}
                <span className="text-xs font-semibold text-zinc-100 max-w-[100px] truncate sm:max-w-[130px] group-hover:text-yellow-400 transition-colors">
                  {displayName}
                </span>

                {/* Animated Chevron */}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-200 ${
                    dropdownOpen ? "rotate-180 text-yellow-400" : ""
                  }`}
                />
              </button>
            </DropdownMenuTrigger>

            {/* Modern Glassmorphic Profile Dropdown Menu */}
            <DropdownMenuContent
              sideOffset={10}
              align="end"
              className="w-64 rounded-2xl border border-white/10 bg-[#121216]/95 backdrop-blur-2xl p-2 text-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(250,204,21,0.08)] animate-in fade-in zoom-in-95 duration-150 z-50"
            >
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 mb-1">
                <div className="relative flex items-center justify-center h-10 w-10 rounded-full overflow-hidden shrink-0 border border-white/15 bg-[#202024]">
                  {hasValidPhoto ? (
                    <img
                      src={user?.photoURL}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={() => setAvatarError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-amber-400 to-yellow-500 font-extrabold text-black text-sm uppercase">
                      {userInitials}
                    </span>
                  )}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#121216]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-100 truncate">{displayName}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email || "Google Account"}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                      {user.role === "super_admin" ? "SUPER ADMIN" : "FREE PLAN"}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1.5 bg-white/10" />

              {/* Primary Dashboard Link */}
              <DropdownMenuItem
                onSelect={() => navigate({ to: "/dashboard" as never })}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-zinc-100 hover:bg-yellow-400/15 hover:text-yellow-300 focus:bg-yellow-400/15 focus:text-yellow-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-bold">Dashboard</span>
                    <span className="block text-[10px] text-zinc-400 font-normal">Manage your websites</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-yellow-300 group-hover:translate-x-0.5 transition-all" />
              </DropdownMenuItem>

              {/* Templates */}
              <DropdownMenuItem
                onSelect={() => {
                  const el = document.getElementById("templates");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate({ to: "/templates" as never });
                  }
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white focus:bg-white/[0.08] focus:text-white transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Layers className="h-4 w-4" />
                </div>
                <span>Explore Templates</span>
              </DropdownMenuItem>

              {/* Super Admin (if authorized) */}
              {user.role === "super_admin" && (
                <DropdownMenuItem
                  onSelect={() => navigate({ to: "/super-admin" as never })}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-purple-300 hover:bg-purple-500/15 hover:text-purple-200 focus:bg-purple-500/15 focus:text-purple-200 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Super Admin Panel</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="my-1.5 bg-white/10" />

              {/* Sign Out */}
              <DropdownMenuItem
                onSelect={handleLogout}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 focus:bg-rose-500/15 focus:text-rose-200 transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <LoginDropdown
            triggerClassName="btn btn-ghost sm"
            triggerChildren="Log in"
          />
        )}
      </div>
    </nav>
  );
}
