import { Link } from "@tanstack/react-router";

export function LandingFooter() {
  return (
    <footer>
      <div>
        <Link
          to="/"
          className="brand"
          style={{ padding: 0, marginBottom: "14px", display: "inline-flex" }}
        >
          <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
            <rect width="32" height="32" rx="9" fill="#FFD21F" />
            <path
              d="M6 12.5l4 9.5 4-7.5 4 7.5 4-9.5"
              stroke="#111"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ color: "var(--text)" }}>WebToolOcean</span>
        </Link>
        <p style={{ maxWidth: "34ch" }}>
          The website builder for people who&apos;d rather ship than configure.
        </p>
      </div>

      <div>
        <h6>Product</h6>
        <Link to="/#panel-1">Editor</Link>
        <Link to="/templates">Templates</Link>
        <Link to="/#panel-2">Export</Link>
        <Link to="/#panel-4">Pricing</Link>
      </div>

      <div>
        <h6>Resources</h6>
        <a href="#docs" onClick={(e) => e.preventDefault()}>Docs</a>
        <a href="#changelog" onClick={(e) => e.preventDefault()}>Changelog</a>
        <a href="#roadmap" onClick={(e) => e.preventDefault()}>Roadmap</a>
      </div>

      <div>
        <h6>Company</h6>
        <a href="#about" onClick={(e) => e.preventDefault()}>About</a>
        <a href="#contact" onClick={(e) => e.preventDefault()}>Contact</a>
        <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
      </div>

      <div className="copy">
        <span>© 2026 WebToolOcean</span>
        <span>Made in Greater Noida</span>
      </div>
    </footer>
  );
}
