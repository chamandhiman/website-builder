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
      <a className="brand" href="#" aria-label="Website Builder by WebToolOcean" style={{ display: "inline-flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Website Builder by WebToolOcean"
          className="h-9 w-auto max-w-[210px] object-contain"
        />
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
                className="group flex items-center gap-2.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#7137D8]/40 transition-all duration-200 outline-none select-none cursor-pointer shadow-xs"
                title={`Signed in as ${user.email || displayName}`}
              >
                {/* Modern Avatar with Google Referrer Fix & Fallback */}
                <div className="relative flex items-center justify-center h-7 w-7 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0] bg-[#F1F5F9]">
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
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#7137D8] to-[#3478F6] font-bold text-white text-[11px] uppercase tracking-tight">
                      {userInitials}
                    </span>
                  )}
                  {/* Subtle online status indicator */}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
                </div>

                {/* User Name */}
                <span className="text-xs font-semibold text-[#111827] max-w-[100px] truncate sm:max-w-[130px] group-hover:text-[#7137D8] transition-colors">
                  {displayName}
                </span>

                {/* Animated Chevron */}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#64748B] transition-transform duration-200 group-hover:text-[#111827] ${dropdownOpen ? "rotate-180 text-[#7137D8]" : ""
                    }`}
                />
              </button>
            </DropdownMenuTrigger>

            {/* Modern Clean White Profile Dropdown Menu */}
            <DropdownMenuContent
              sideOffset={10}
              align="end"
              className="w-64 rounded-2xl border border-[#E2E8F0] bg-white/98 backdrop-blur-2xl p-2 text-[#111827] shadow-[0_15px_35px_rgba(0,0,0,0.1),0_0_15px_rgba(113,55,216,0.06)] animate-in fade-in zoom-in-95 duration-150 z-50"
            >
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-1">
                <div className="relative flex items-center justify-center h-10 w-10 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0] bg-[#F1F5F9]">
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
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#7137D8] to-[#3478F6] font-extrabold text-white text-sm uppercase">
                      {userInitials}
                    </span>
                  )}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#111827] truncate">{displayName}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user.email || "Google Account"}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-purple-100 text-[#7137D8] border border-purple-200">
                      {user.role === "super_admin" ? "SUPER ADMIN" : "FREE PLAN"}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1.5 bg-[#E2E8F0]" />

              {/* Primary Dashboard Link */}
              <DropdownMenuItem
                onSelect={() => navigate({ to: "/dashboard" as never })}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#111827] hover:bg-purple-50 hover:text-[#7137D8] focus:bg-purple-50 focus:text-[#7137D8] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-[#7137D8] group-hover:bg-[#7137D8] group-hover:text-white transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-bold">Dashboard</span>
                    <span className="block text-[10px] text-[#64748B] font-normal">Manage your websites</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:text-[#7137D8] group-hover:translate-x-0.5 transition-all" />
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
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827] focus:bg-[#F1F5F9] focus:text-[#111827] transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-blue-100 text-[#3478F6]">
                  <Layers className="h-4 w-4" />
                </div>
                <span>Explore Templates</span>
              </DropdownMenuItem>

              {/* Super Admin (if authorized) */}
              {user.role === "super_admin" && (
                <DropdownMenuItem
                  onSelect={() => navigate({ to: "/super-admin" as never })}
                  className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-[#7137D8] hover:bg-purple-50 hover:text-[#7137D8] focus:bg-purple-50 focus:text-[#7137D8] transition-colors cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-purple-100 text-[#7137D8]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span>Super Admin Panel</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="my-1.5 bg-[#E2E8F0]" />

              {/* Sign Out */}
              <DropdownMenuItem
                onSelect={handleLogout}
                className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
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
