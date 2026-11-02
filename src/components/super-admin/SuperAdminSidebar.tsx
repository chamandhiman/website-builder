"use client";

import { useMemo, type ReactNode } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Layers, Puzzle, Settings, LogOut, ChevronDown } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard, route: "/super-admin" },
  { key: "templates", label: "Templates", Icon: Layers, route: "/super-admin/templates" },
  { key: "widgets", label: "Widgets", Icon: Puzzle, route: "/super-admin/widgets" },
  { key: "settings", label: "Settings", Icon: Settings, route: "/super-admin/settings" },
] as const;

type MenuKey = (typeof MENU_ITEMS)[number]["key"];

export function SuperAdminSidebar({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mounted = useMounted();
  const { user, logout } = useAuth();

  const currentPath = location.pathname;
  const activeKey = useMemo(() => {
    if (currentPath.startsWith("/super-admin/templates")) return "templates";
    if (currentPath.startsWith("/super-admin/widgets")) return "widgets";
    if (currentPath.startsWith("/super-admin/settings")) return "settings";
    if (currentPath.startsWith("/super-admin")) return "dashboard";
    return null;
  }, [currentPath]);

  if (!mounted) {
    return (
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[180px] flex-col border-r border-[#E2E8F0] bg-white">
        <div className="flex h-full flex-col items-center gap-3 py-4">
          <div className="h-10 w-10 rounded-xl bg-[#F1F5F9]" />
          <div className="h-10 w-10 rounded-xl bg-[#F1F5F9]" />
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[180px] flex-col border-r border-[#E2E8F0] bg-white shadow-xs">
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <div className="flex items-center gap-2.5 px-3 pb-4 pt-5">
            <img
              src="/logo-icon.png"
              alt="Super Admin"
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
            />
            <div className="flex flex-col">
              <p className="text-[12px] font-semibold leading-tight text-[#111827]">Super Admin</p>
              <p className="text-[11px] leading-tight text-[#64748B]">Template Manager</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col items-center gap-0 px-2">
            {MENU_ITEMS.map(({ key, label, Icon, route }) => {
              const active = activeKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate({ to: route as never })}
                  className={`group relative flex w-full items-center gap-2.5 border-t border-[#E2E8F0] px-2 py-2.5 transition-all duration-150 ${
                    active ? "bg-[#7137D8]/10 text-[#7137D8] font-bold" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827]"
                  }`}
                  style={{ borderRadius: "6px" }}
                >
                  <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 text-left text-[12px] font-medium leading-none">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="shrink-0 border-t border-[#E2E8F0] p-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#F1F5F9]"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      {user?.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.name} />
                      ) : (
                        <AvatarFallback className="text-[10px] bg-purple-100 text-[#7137D8] font-bold">{user?.initials}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="truncate text-[12px] font-medium leading-tight text-[#111827]">{user?.name}</p>
                      <p className="truncate text-[10px] leading-tight text-[#64748B]">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={4} align="end" className="w-56 bg-white border-[#E2E8F0] text-[#111827] shadow-xl rounded-xl p-1">
                  <div className="px-3 py-2 text-sm">
                    <p className="font-semibold text-[#111827]">{user?.name}</p>
                    <p className="text-xs text-[#64748B]">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                  <DropdownMenuItem
                    onSelect={() => {
                      navigate({ to: "/dashboard" as never });
                    }}
                    className="text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827] rounded-lg"
                  >
                    Builder Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                  <DropdownMenuItem
                    onSelect={async () => {
                      await logout();
                      navigate({ to: "/" });
                      toast.success("Signed out successfully");
                    }}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="px-2 py-2 text-[11px] text-[#969696]">Not signed in</div>
            )}
          </div>
        </div>
      </aside>
      {children}
    </>
  );
}
