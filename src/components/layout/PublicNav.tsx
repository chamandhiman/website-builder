import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard } from "lucide-react";

export function PublicNav() {
  const { user, authReady } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2a2a2f] bg-[#0e0e10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-base tracking-tight text-[#f4f4f5]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#facc15] font-black text-[#151515] text-base">
            W
          </span>
          <span className="text-lg font-bold font-['Bricolage_Grotesque']">WebToolOcean</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#9a9aa3]">
          <Link to="/" className="hover:text-[#f4f4f5] transition">
            Home
          </Link>
          <Link
            to="/templates"
            className="text-[#facc15] hover:text-yellow-400 transition font-semibold"
          >
            Templates
          </Link>
          <a href="/#features" className="hover:text-[#f4f4f5] transition">
            Features
          </a>
          <a href="/#pricing" className="hover:text-[#f4f4f5] transition">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          {authReady && user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-4 py-2 text-xs font-bold text-[#151515] hover:bg-yellow-400 transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#2a2a2f] px-4 py-2 text-xs font-semibold text-[#f4f4f5] hover:border-[#facc15] transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#facc15] px-4 py-2 text-xs font-bold text-[#151515] hover:bg-yellow-400 transition"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
