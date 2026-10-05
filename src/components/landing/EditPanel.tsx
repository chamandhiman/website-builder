import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export function EditPanel() {
  const [activeSwatch, setActiveSwatch] = useState(0);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const sliderBarRef = useRef<HTMLElement | null>(null);

  const SWATCHES = [
    { color: "#FFD21F", name: "Yellow", filter: "none", radius: "12px", btnRadius: "999px", sliderRight: "40%" },
    { color: "#7CF5C8", name: "Mint", filter: "hue-rotate(90deg)", radius: "28px", btnRadius: "8px", sliderRight: "10%" },
    { color: "#ff6b8b", name: "Rose", filter: "hue-rotate(200deg) saturate(1.2)", radius: "12px", btnRadius: "999px", sliderRight: "40%" },
    { color: "#9b8cff", name: "Purple", filter: "hue-rotate(260deg)", radius: "28px", btnRadius: "8px", sliderRight: "10%" },
  ];

  const TITLES = [
    "Your dream home,<br>one tour away.",
    "Find space<br>to breathe.",
    "Homes that<br>feel like you.",
  ];

  const applySwatch = (idx: number) => {
    setActiveSwatch(idx);
    const sw = SWATCHES[idx];
    const btn = btnRef.current;
    const photo = photoRef.current;
    const title = titleRef.current;
    const sliderBar = sliderBarRef.current;

    if (btn) {
      btn.style.background = sw.color;
      btn.style.borderRadius = sw.btnRadius;
    }
    if (photo) {
      photo.style.filter = sw.filter;
      photo.style.borderRadius = sw.radius;
    }
    if (sliderBar) {
      sliderBar.style.right = sw.sliderRight;
    }
    if (title) {
      gsap.fromTo(title, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 });
      const raw = TITLES[idx % TITLES.length];
      title.innerHTML = raw.replace(
        /(\w+)\.?<br>/,
        `<span style="color:${sw.color}">$1</span><br>`
      );
    }
  };

  useEffect(() => {
    applySwatch(0);
    const interval = setInterval(() => {
      setActiveSwatch((prev) => {
        const next = (prev + 1) % SWATCHES.length;
        applySwatch(next);
        return next;
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="panel" data-name="02 — Edit" id="panel-1">
      <div className="split">
        <div>
          <div className="eyebrow">
            <i />
            Visual editor
          </div>
          <h2>
            Click it.
            <br />
            <span className="outline">Change it.</span>
            <br />
            <span className="hl">Done.</span>
          </h2>
          <p className="lead">
            No code, no settings maze. Every heading, image, button and color is
            editable right on the page.
          </p>

          <div className="feat-list">
            <div className="feat">
              <span className="n">01</span>
              <div>
                <h4>Drag & drop sections</h4>
                <p>Reorder hero, features, galleries and forms in a click.</p>
              </div>
            </div>
            <div className="feat">
              <span className="n">02</span>
              <div>
                <h4>One-click themes</h4>
                <p>Swap the whole palette and fonts across every page instantly.</p>
              </div>
            </div>
            <div className="feat">
              <span className="n">03</span>
              <div>
                <h4>Responsive by default</h4>
                <p>Preview desktop, tablet and mobile side by side.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="editor" id="editor">
          <div className="ed-tools">
            <span className="on">↖</span>
            <span>T</span>
            <span>▢</span>
            <span>◐</span>
            <span>⤓</span>
          </div>

          <div className="ed-stage">
            <div className="ed-title" id="edTitle" ref={titleRef}>
              Your dream home,
              <br />
              one tour away.
            </div>
            <a className="ed-btn" id="edBtn" ref={btnRef}>
              Book a tour
            </a>
            <div className="ed-photo" id="edPhoto" ref={photoRef} />
          </div>

          <div className="ed-props">
            <h5>Style</h5>
            <div>
              Accent
              <div className="swatches" id="sw" style={{ marginTop: "8px" }}>
                {SWATCHES.map((sw, idx) => (
                  <i
                    key={sw.color}
                    className={activeSwatch === idx ? "on" : ""}
                    style={{ background: sw.color }}
                    data-c={sw.color}
                    onClick={() => applySwatch(idx)}
                    role="button"
                    tabIndex={0}
                  />
                ))}
              </div>
            </div>

            <div className="prop-row">
              <span>Font</span>
              <span style={{ color: "var(--text)" }}>Clash Display</span>
            </div>

            <div>
              Corner radius
              <div className="slider" style={{ marginTop: "10px" }}>
                <i id="radI" ref={sliderBarRef} />
              </div>
            </div>

            <div className="prop-row">
              <span>Layout</span>
              <span style={{ color: "var(--text)" }}>Stacked</span>
            </div>

            <div className="prop-row">
              <span>Animation</span>
              <span style={{ color: "var(--y)" }}>Fade up</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
