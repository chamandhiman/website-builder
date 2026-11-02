import { Link } from "@tanstack/react-router";

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-[#E2E8F0] bg-white py-12 text-[#64748B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center outline-none hover:opacity-90 transition" aria-label="Website Builder home">
              <img
                src="/logo.png"
                alt="Website Builder by WebToolOcean"
                className="h-9 w-auto max-w-[210px] object-contain"
              />
            </Link>
            <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">
              Build stunning, mobile-responsive websites visually with pre-designed sections and templates. Export clean HTML, CSS & JavaScript anytime.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/templates" className="text-[#475569] hover:text-[#7137D8] transition">
                  Template Library
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-[#475569] hover:text-[#7137D8] transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-[#475569] hover:text-[#7137D8] transition">
                  Pricing Plans
                </a>
              </li>
              <li>
                <Link to="/templates" className="text-[#475569] hover:text-[#7137D8] transition">
                  Free Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/templates" search={{ category: "Real Estate" }} className="text-[#475569] hover:text-[#7137D8] transition">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link to="/templates" search={{ category: "Freelancer" }} className="text-[#475569] hover:text-[#7137D8] transition">
                  Freelancer & Portfolio
                </Link>
              </li>
              <li>
                <Link to="/templates" search={{ category: "Healthcare" }} className="text-[#475569] hover:text-[#7137D8] transition">
                  Healthcare & Medical
                </Link>
              </li>
              <li>
                <Link to="/templates" search={{ category: "SaaS & Technology" }} className="text-[#475569] hover:text-[#7137D8] transition">
                  SaaS & Startups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-[#475569] hover:text-[#7137D8] transition">
                  Builder Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#475569] hover:text-[#7137D8] transition">
                  Project Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#E2E8F0] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} WebToolOcean Website Builder. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-[#111827] transition">Terms</a>
            <a href="#" className="hover:text-[#111827] transition">Privacy</a>
            <a href="#" className="hover:text-[#111827] transition">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
