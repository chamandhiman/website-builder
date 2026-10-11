import { Youtube, Instagram, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="ft">
      <div className="ft-top">
        <div className="ft-brand">
          <a className="brand" href="#">
            WebTool<b>Ocean</b>
          </a>
          <p>
            Build beautiful websites in minutes. Pick a template, edit it live, and
            download clean HTML or React code.
          </p>

          <div className="ft-soc">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube className="ic" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="ic" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="ic" />
            </a>
          </div>
        </div>

        <div className="ft-col">
          <h6>Product</h6>
          <a href="#templates">Templates</a>
          <a href="#features">Features</a>
          <a href="#widgets">Premium widgets</a>
          <a href="#launch">Pricing</a>
          <a href="/changelog">Changelog</a>
        </div>

        <div className="ft-col">
          <h6>Company</h6>
          <a href="/about">About us</a>
          <a href="/contact">Contact</a>
          <a href="/blog">Blog</a>
          <a href="https://webtoolocean.com" target="_blank" rel="noopener noreferrer">
            WebToolOcean.com ↗
          </a>
        </div>

        <div className="ft-col">
          <h6>Support</h6>
          <a href="/help">Help center</a>
          <a href="/docs">Documentation</a>
          <a href="/tutorials">Video tutorials</a>
          <a href="/bug-report">Report a bug</a>
        </div>

        <div className="ft-col">
          <h6>Legal</h6>
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms of service</a>
          <a href="/refund">Refund policy</a>
          <a href="/cookies">Cookie policy</a>
        </div>
      </div>

      <div className="ft-big">WebToolOcean</div>

      <div className="ft-bot">
        <span>© 2026 WebToolOcean. All rights reserved.</span>
        <span className="ft-leg">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
        </span>
      </div>
    </footer>
  );
}
