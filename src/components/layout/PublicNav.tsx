import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard } from "lucide-react";
import { LoginDropdown } from "@/components/auth/LoginDropdown";

export function PublicNav() {
  const { user, authReady } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center outline-none hover:opacity-90 transition" aria-label="Website Builder home">
          <img
            src="/logo.png"
            alt="Website Builder by WebToolOcean"
            className="h-9 w-auto max-w-[210px] object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569]">
          <Link to="/" className="hover:text-[#111827] transition">
            Home
          </Link>
          <Link
            to="/templates"
            className="text-[#7137D8] hover:text-[#D52BBD] transition font-semibold"
          >
            Templates
          </Link>
          <a href="/#features" className="hover:text-[#111827] transition">
            Features
          </a>
          <a href="/#pricing" className="hover:text-[#111827] transition">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          {authReady && user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7137D8] to-[#3478F6] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition shadow-xs"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <LoginDropdown
              triggerClassName="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#111827] hover:border-[#7137D8] hover:text-[#7137D8] transition shadow-xs"
              triggerChildren="Log in"
            />
          )}
        </div>
      </div>
    </nav>
  );
}
