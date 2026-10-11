import { useState, useEffect } from "react";
import { Palette, ArrowUp } from "lucide-react";

const ACCENTS: Record<string, [string, string, string]> = {
  yellow: ["#FFD21F", "#FFD21F", "#d18b00"],
  red: ["#ff4d5e", "#ff4d5e", "#d6283a"],
  pink: ["#ff5fa2", "#ff5fa2", "#d6336c"],
  mint: ["#2fe0b0", "#2fe0b0", "#0b9f78"],
  orange: ["#ff8a3d", "#ff8a3d", "#d9480f"],
};

export function LandingThemePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<string>("red");
  const [accent, setAccent] = useState<string>("yellow");

  // Load saved theme preference on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wto-theme2") || "{}");
      if (saved.t) setTheme(saved.t);
      if (saved.a && ACCENTS[saved.a]) setAccent(saved.a);
    } catch {
      // Ignore json errors
    }
  }, []);

  // Apply theme attributes and variables
  useEffect(() => {
    const root = document.documentElement;
    const landingEl = document.querySelector(".wto-landing") as HTMLElement | null;
    const [c1, c2, c3] = ACCENTS[accent] || ACCENTS.yellow;

    // Set on documentElement & scoped landing element
    if (theme === "red") {
      delete root.dataset.theme;
      if (landingEl) delete landingEl.dataset.theme;
    } else {
      root.dataset.theme = theme;
      if (landingEl) landingEl.dataset.theme = theme;
    }

    root.style.setProperty("--y", c1);
    root.style.setProperty("--hlD", c2);
    root.style.setProperty("--hlL", c3);

    if (landingEl) {
      landingEl.style.setProperty("--y", c1);
      landingEl.style.setProperty("--hlD", c2);
      landingEl.style.setProperty("--hlL", c3);
    }

    try {
      localStorage.setItem("wto-theme2", JSON.stringify({ t: theme, a: accent }));
    } catch {
      // LocalStorage error fallback
    }

    return () => {
      // Clean up dataset theme when unmounting from landing page
      delete root.dataset.theme;
      root.style.removeProperty("--y");
      root.style.removeProperty("--hlD");
      root.style.removeProperty("--hlL");
    };
  }, [theme, accent]);

  const handleReset = () => {
    setTheme("red");
    setAccent("yellow");
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Theme Settings Popup */}
      <div className={`tp ${isOpen ? "open" : ""}`} id="tp">
        <div className="tp-h">
          <b>Theme</b>
          <button
            type="button"
            id="tpX"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="tp-t" id="tpT">
          <button
            type="button"
            className={theme === "red" ? "on" : ""}
            onClick={() => setTheme("red")}
          >
            <i style={{ background: "linear-gradient(135deg, #e11d48, #1b0a10)" }} />
            Red
          </button>
          <button
            type="button"
            className={theme === "blue" ? "on" : ""}
            onClick={() => setTheme("blue")}
          >
            <i style={{ background: "linear-gradient(135deg, #3b2a8c, #14112e)" }} />
            Blue
          </button>
          <button
            type="button"
            className={theme === "black" ? "on" : ""}
            onClick={() => setTheme("black")}
          >
            <i style={{ background: "#0a0a0b" }} />
            Black
          </button>
          <button
            type="button"
            className={theme === "white" ? "on" : ""}
            onClick={() => setTheme("white")}
          >
            <i style={{ background: "#f7f5ef" }} />
            White
          </button>
        </div>

        <div className="tp-l">Accent color</div>
        <div className="tp-a" id="tpA">
          <button
            type="button"
            className={accent === "yellow" ? "on" : ""}
            style={{ background: "#FFD21F" }}
            aria-label="Yellow"
            onClick={() => setAccent("yellow")}
          />
          <button
            type="button"
            className={accent === "red" ? "on" : ""}
            style={{ background: "#ff4d5e" }}
            aria-label="Red"
            onClick={() => setAccent("red")}
          />
          <button
            type="button"
            className={accent === "pink" ? "on" : ""}
            style={{ background: "#ff5fa2" }}
            aria-label="Pink"
            onClick={() => setAccent("pink")}
          />
          <button
            type="button"
            className={accent === "mint" ? "on" : ""}
            style={{ background: "#2fe0b0" }}
            aria-label="Mint"
            onClick={() => setAccent("mint")}
          />
          <button
            type="button"
            className={accent === "orange" ? "on" : ""}
            style={{ background: "#ff8a3d" }}
            aria-label="Orange"
            onClick={() => setAccent("orange")}
          />
        </div>

        <button type="button" className="tp-r" id="tpR" onClick={handleReset}>
          Reset to default
        </button>
      </div>

      {/* Floating Theme Palette Button */}
      <button
        type="button"
        className="tp-btn"
        id="tpBtn"
        aria-label="Change theme colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>
          <Palette className="ic" strokeWidth={2.2} />
        </span>
      </button>

      {/* Back To Top Button */}
      <a
        className="totop"
        href="#"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <ArrowUp className="ic" strokeWidth={2.6} />
      </a>
    </>
  );
}
