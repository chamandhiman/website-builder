import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, ShieldAlert, Sparkles, Loader2 } from "lucide-react";

interface LandingHeaderProps {
  activePanel: number;
  onNavigatePanel: (panelIndex: number) => void;
  onOpenAuthModal?: () => void;
}

export function LandingHeader({
  activePanel,
  onNavigatePanel,
  onOpenAuthModal,
}: LandingHeaderProps) {
  const { user, authReady, loginWithGoogle, logout, signingIn } = useAuth();
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  const menuItems = [
    { label: "Home", index: 0 },
    { label: "Edit", index: 1 },
    { label: "Download", index: 2 },
    { label: "Templates", index: 3 },
    { label: "Get started", index: 4 },
  ];

  const handleLoginClick = async () => {
    setLoggingIn(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
    } catch (err: any) {
      console.error("Login with Google error:", err);
      if (onOpenAuthModal) {
        onOpenAuthModal();
      } else {
        toast.error(err?.message || "Google sign in failed. Please try again.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const isWorking = loggingIn || signingIn;

  return (
    <nav aria-label="Main">
      <a
        className="brand"
        onClick={(e) => {
          e.preventDefault();
          onNavigatePanel(0);
        }}
        role="button"
        tabIndex={0}
      >
        <svg viewBox="0 0 32 32" aria-label="WebToolOcean logo" fill="none">
          <rect width="32" height="32" rx="9" fill="#FFD21F" />
          <path
            d="M6 12.5l4 9.5 4-7.5 4 7.5 4-9.5"
            stroke="#111"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 10.5c1.5-1 3-1 4 0"
            stroke="#111"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
        <span>
          WebToolOcean
          <small>Website Builder</small>
        </span>
      </a>

      <div className="menu">
        {menuItems.map((item) => (
          <a
            key={item.label}
            className={activePanel === item.index ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onNavigatePanel(item.index);
            }}
            role="button"
            tabIndex={0}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="nav-cta">
        {authReady && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#1c1c20] p-0.5 transition hover:border-[#ffd21f] focus:outline-none"
                aria-label="User account menu"
              >
                <Avatar className="h-full w-full">
                  {user.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-[#ffd21f] text-[#111] font-bold text-xs">
                    {user.initials || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              sideOffset={10}
              align="end"
              className="w-60 rounded-2xl border border-white/10 bg-[#17171a] p-2 text-[#f2f0ea] shadow-2xl backdrop-blur-xl"
            >
              {/* User details info */}
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-[#ffd21f] text-[#111] font-bold text-xs">
                      {user.initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="truncate font-semibold text-sm text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#9a978f]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-[#ffd21f]">
                  <Sparkles size={11} />
                  <span>{user.plan || "Free plan"}</span>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-white/10 my-1" />

              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white hover:bg-white/5 cursor-pointer"
                >
                  <LayoutDashboard size={15} className="text-[#ffd21f]" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to="/templates"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white hover:bg-white/5 cursor-pointer"
                >
                  <Sparkles size={15} className="text-[#ffd21f]" />
                  <span>Templates Library</span>
                </Link>
              </DropdownMenuItem>

              {user.role === "super_admin" && (
                <DropdownMenuItem asChild>
                  <Link
                    to="/super-admin"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white hover:bg-white/5 cursor-pointer"
                  >
                    <ShieldAlert size={15} className="text-red-400" />
                    <span>Super Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-white/10 my-1" />

              <DropdownMenuItem
                onClick={async () => {
                  await logout();
                  toast.success("Signed out");
                }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
              >
                <LogOut size={15} />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            type="button"
            className="btn btn-y magnetic"
            onClick={handleLoginClick}
            disabled={isWorking}
          >
            {isWorking ? (
              <span className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" />
                <span>Signing in…</span>
              </span>
            ) : (
              <span>Log in</span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
