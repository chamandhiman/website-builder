import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/lib/auth";
import { useBuilder } from "@/lib/builder/store";
import { LogOut, User, Settings, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginDropdown } from "@/components/auth/LoginDropdown";
import { toast } from "sonner";

export function Header({ hideBranding, hideProfile }: { hideBranding?: boolean; hideProfile?: boolean } = {}) {
  const mounted = useMounted();
  const navigate = useNavigate();

  const { user, logout, authReady } = useAuth();
  const showProjectDashboard = useBuilder((s) => s.showProjectDashboard);
  const setShowProjectDashboard = useBuilder((s) => s.setShowProjectDashboard);

  const handleLogout = async () => {
    await logout();
    setShowProjectDashboard(false);
    navigate({ to: "/" });
    toast.success("Signed out successfully");
  };

  const handleSwitchAccount = async () => {
    await logout();
    toast.info("Signed out. Click Log in to choose an account.");
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 h-12 w-full border-b border-[#E2E8F0] bg-white/95">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-32 rounded-md bg-[#F1F5F9]" />
          <div className="h-8 w-8 rounded-full bg-[#F1F5F9]" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 h-12 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xs">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {!hideBranding ? (
          <div className="flex items-center gap-3 text-[#111827]">
            {showProjectDashboard ? (
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="flex items-center outline-none hover:opacity-90 transition cursor-pointer"
                aria-label="Website Builder home"
              >
                <img
                  src="/logo.png"
                  alt="Website Builder by WebToolOcean"
                  className="h-8 w-auto max-w-[190px] object-contain"
                />
              </button>
            ) : (
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Website Builder by WebToolOcean"
                  className="h-8 w-auto max-w-[190px] object-contain"
                />
              </div>
            )}
          </div>
        ) : <div />}

        {!hideProfile ? (
          <div className="flex items-center gap-2">
            {authReady ? (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#111827] transition hover:border-[#7137D8] shadow-xs"
                    >
                      <Avatar className="h-8 w-8">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.name} referrerPolicy="no-referrer" />
                        ) : (
                          <AvatarFallback className="bg-purple-100 text-[#7137D8] font-bold">{user.initials}</AvatarFallback>
                        )}
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={8} align="end" className="w-56 bg-white border-[#E2E8F0] text-[#111827] shadow-xl rounded-xl p-1">
                    <div className="px-3 py-2 text-sm">
                      <p className="font-semibold text-[#111827]">{user.name}</p>
                      <p className="text-xs text-[#64748B]">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                    <DropdownMenuItem onSelect={handleSwitchAccount} className="text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827] rounded-lg">
                      <User className="mr-2 h-4 w-4 text-[#64748B]" />
                      Switch Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setShowProjectDashboard(true);
                        navigate({ to: '/' });
                      }}
                      className="text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827] rounded-lg"
                    >
                      <User className="mr-2 h-4 w-4 text-[#64748B]" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => void 0} className="text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827] rounded-lg">
                      <Settings className="mr-2 h-4 w-4 text-[#64748B]" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => void 0} className="text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827] rounded-lg">
                      <CreditCard className="mr-2 h-4 w-4 text-[#64748B]" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                    <DropdownMenuItem onSelect={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg">
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center">
                  <LoginDropdown
                    triggerClassName="inline-flex h-9 items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#111827] transition hover:border-[#7137D8] hover:text-[#7137D8] shadow-xs"
                    triggerChildren="Log in"
                  />
                </div>
              )
            ) : null}

          </div>
        ) : null}
      </div>
    </header>
  );
}
