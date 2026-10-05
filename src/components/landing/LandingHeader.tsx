import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard } from "lucide-react";

interface LandingHeaderProps {
  activePanel: number;
  onNavigatePanel: (panelIndex: number) => void;
}

export function LandingHeader({
  activePanel,
  onNavigatePanel,
}: LandingHeaderProps) {
  const { user, authReady } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", index: 0 },
    { label: "Edit", index: 1 },
    { label: "Download", index: 2 },
    { label: "Templates", index: 3 },
    { label: "Get started", index: 4 },
  ];

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
          <Link to="/dashboard" className="btn btn-y magnetic">
            <LayoutDashboard size={15} />
            <span>Dashboard →</span>
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate({ to: "/login" as never })}
            >
              Log in
            </button>
            <button
              type="button"
              className="btn btn-y magnetic"
              onClick={() => onNavigatePanel(4)}
            >
              Start free →
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
