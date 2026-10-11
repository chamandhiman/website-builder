import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

interface LandingNavbarProps {
  onOpenAuthModal: () => void;
}

export function LandingNavbar({ onOpenAuthModal }: LandingNavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        {user ? (
          <button
            type="button"
            className="btn btn-y sm"
            onClick={() => navigate({ to: "/dashboard" as never })}
          >
            Dashboard →
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-ghost sm"
              style={{ display: "none" }}
              onClick={onOpenAuthModal}
            >
              Log in
            </button>
            <button
              type="button"
              className="btn btn-y sm"
              onClick={onOpenAuthModal}
            >
              Sign up free
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
