import { Link } from "@tanstack/react-router";

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-[#2a2a2f] bg-[#0e0e10] py-12 text-[#9a9aa3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 font-extrabold text-base tracking-tight text-[#f4f4f5]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#facc15] font-black text-[#151515] text-sm">
                W
              </span>
              <span className="text-base font-bold font-['Bricolage_Grotesque']">WebToolOcean</span>
            </Link>
            <p className="text-xs text-[#9a9aa3] max-w-xs leading-relaxed">
              Build stunning, mobile-responsive websites visually with pre-designed sections and templates. Export clean HTML, CSS & JavaScript anytime.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f4f4f5] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/templates" className="hover:text-[#facc15] transition">
                  Template Library
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-[#facc15] transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-[#facc15] transition">
                  Pricing Plans
                </a>
              </li>
              <li>
                <Link to="/templates" className="hover:text-[#facc15] transition">
                  Free Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f4f4f5] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/templates" search={{ category: "Real Estate" }} className="hover:text-[#facc15] transition">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link to="/templates" search={{ category: "Freelancer" }} className="hover:text-[#facc15] transition">
                  Freelancer & Portfolio
                </Link>
              </li>
              <li>
                <Link to="/templates" search={{ category: "Healthcare" }} className="hover:text-[#facc15] transition">
                  Healthcare & Medical
                </Link>
              </li>
              <li>
                <Link to="/templates" search={{ category: "SaaS & Technology" }} className="hover:text-[#facc15] transition">
                  SaaS & Startups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f4f4f5] mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-[#facc15] transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#facc15] transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#facc15] transition">
                  Project Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2a2a2f] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#62626a]">
          <p>© {new Date().getFullYear()} WebToolOcean Website Builder. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-[#f4f4f5] transition">Terms</a>
            <a href="#" className="hover:text-[#f4f4f5] transition">Privacy</a>
            <a href="#" className="hover:text-[#f4f4f5] transition">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
