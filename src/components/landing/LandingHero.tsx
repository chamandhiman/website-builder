import { useState, useEffect, useRef } from "react";

interface LandingHeroProps {
  onStartBuilding: () => void;
}

export function LandingHero({ onStartBuilding }: LandingHeroProps) {
  const [currentMode, setCurrentMode] = useState<number>(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const bldRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance tabs every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMode((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentMode]);

  // 3D tilt on mouse movement over the hero section
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bldRef.current) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    bldRef.current.style.transform = `perspective(1400px) rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 8}deg)`;
  };

  const handleMouseLeave = () => {
    if (!bldRef.current) return;
    bldRef.current.style.transform = "";
  };

  const handleScrollToTemplates = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("templates");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="hero"
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aurora">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="gridbg"></div>

      <div className="hwrap">
        <div className="htxt">
          {/* Tab 0 */}
          <div className={`ts ${currentMode === 0 ? "on" : ""}`}>
            <div className="eyebrow">
              <i></i>Website builder
            </div>
            <h1>
              Create beautiful websites <span className="hl">in minutes.</span>
            </h1>
            <p>
              Drag widgets onto the page, pick a template and watch your website come
              to life — no code needed.
            </p>
          </div>

          {/* Tab 1 */}
          <div className={`ts ${currentMode === 1 ? "on" : ""}`}>
            <div className="eyebrow">
              <i></i>Live editor
            </div>
            <h1>
              Click anything. <span className="hl">Edit it live.</span>
            </h1>
            <p>
              Change text, colors, fonts and corners right on the page and see the
              result instantly.
            </p>
          </div>

          {/* Tab 2 */}
          <div className={`ts ${currentMode === 2 ? "on" : ""}`}>
            <div className="eyebrow">
              <i></i>Export
            </div>
            <h1>
              Download <span className="hl">HTML or React.</span>
            </h1>
            <p>
              Get clean, fast code you own. Upload the HTML anywhere, or drop the
              React version into your app.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="acts">
            <button
              type="button"
              className="btn btn-y"
              onClick={onStartBuilding}
            >
              Start free →
            </button>
            <a
              className="btn btn-w"
              href="#templates"
              onClick={handleScrollToTemplates}
            >
              Browse templates
            </a>
          </div>

          {/* Tab Controls */}
          <div className="stabs" id="stabs">
            <button
              type="button"
              className={currentMode === 0 ? "on" : ""}
              onClick={() => setCurrentMode(0)}
            >
              <b>01</b>Build
              <i></i>
            </button>
            <button
              type="button"
              className={currentMode === 1 ? "on" : ""}
              onClick={() => setCurrentMode(1)}
            >
              <b>02</b>Edit live
              <i></i>
            </button>
            <button
              type="button"
              className={currentMode === 2 ? "on" : ""}
              onClick={() => setCurrentMode(2)}
            >
              <b>03</b>Download
              <i></i>
            </button>
          </div>
        </div>

        {/* 3D Builder Mockup */}
        <div className="bwrap">
          <div className="bld" id="bld" data-m={currentMode} ref={bldRef}>
            {/* Top Browser Bar */}
            <div className="b-top">
              <i></i>
              <i></i>
              <i></i>
              <span className="b-url">mystore.webtoolocean.com</span>
              <span className="b-sp"></span>
              <span className="b-ghost">Preview</span>
              <span className="b-dl">
                <svg className="ic">
                  <use href="#i-download" />
                </svg>
                Download
              </span>
            </div>

            {/* Main Builder Workspace */}
            <div className="b-main">
              <aside className="b-l">
                <h6>Add widgets</h6>
                <div className="wg">
                  <span className="wl">
                    <svg className="ic">
                      <use href="#i-monitor" />
                    </svg>
                    Hero
                  </span>
                </div>
                <div className="wg">
                  <span className="wl">
                    <svg className="ic">
                      <use href="#i-grid" />
                    </svg>
                    Features
                  </span>
                </div>
                <div className="wg">
                  <span className="wl">
                    <svg className="ic">
                      <use href="#i-image" />
                    </svg>
                    Gallery
                  </span>
                </div>
                <div className="wg">
                  <span className="wl">
                    <svg className="ic">
                      <use href="#i-chat" />
                    </svg>
                    Chat
                  </span>
                  <s>PRO</s>
                </div>
                <div className="wg wp">
                  <span className="wl">
                    <svg className="ic">
                      <use href="#i-dollar" />
                    </svg>
                    Pricing
                  </span>
                  <s>PRO</s>
                </div>
                <div className="wg">
                  <span className="wl">
                    <svg className="ic">
                      <use href="#i-clock" />
                    </svg>
                    Timer
                  </span>
                  <s>PRO</s>
                </div>
              </aside>

              <div className="b-c">
                <div className="pg">
                  <div className="p-nav">
                    <b>Aurora</b>
                    <span>
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                    <em>Book</em>
                  </div>
                  <div className="p-hero">
                    <div>
                      <div className="p-h">
                        Your dream home,
                        <br />
                        <span className="typ">one tour away.</span>
                      </div>
                      <div className="p-l">
                        <i></i>
                        <i></i>
                      </div>
                      <div className="p-btn">Book a tour</div>
                    </div>
                    <div className="p-img"></div>
                  </div>
                  <div className="p-cards">
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                  <div className="p-price">
                    <b>Pricing</b>
                    <div>
                      <i>$50</i>
                      <i>$80</i>
                      <i>Custom</i>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="b-r">
                <h6>Style</h6>
                <label>Color</label>
                <div className="sw">
                  <i style={{ background: "#b8893b" }}></i>
                  <i style={{ background: "#ff4d6d" }}></i>
                  <i style={{ background: "#12b886" }}></i>
                </div>
                <label>Corners</label>
                <div className="sl">
                  <u></u>
                </div>
                <label>Font</label>
                <div className="fn">
                  <em>Aa</em>
                  <em>Aa</em>
                </div>
              </aside>
            </div>

            {/* Flying Cursor & Dragged Ghost Item */}
            <svg className="fcur" viewBox="0 0 24 24">
              <path
                d="M4 2l16 9-7 2-3 7z"
                fill="#FFD21F"
                stroke="#111"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <div className="ghost">
              <svg className="ic">
                <use href="#i-dollar" />
              </svg>
              Pricing
            </div>

            {/* Export Modal Overlay Animation */}
            <div className="exp">
              <h5>Export your website</h5>
              <div className="et">
                <em className="t1">HTML</em>
                <em className="t2">React</em>
              </div>
              <div className="cs">
                <pre className="c1">
{`<section class="hero">
  <h1>Your dream home</h1>
</section>`}
                </pre>
                <pre className="c2">
{`export default function Hero(){
  return <h1>Your dream home</h1>
}`}
                </pre>
              </div>
              <div className="eb">
                <i></i>
              </div>
              <div className="ef">
                <span>index.html</span>
                <span>style.css</span>
                <span>script.js</span>
              </div>
              <div className="ok">✓ Ready to download</div>
            </div>
          </div>

          {/* Floating Pill Chips */}
          <div className="fl f1">
            <svg className="ic">
              <use href="#i-react" />
            </svg>
            React export
          </div>
          <div className="fl f2">
            <svg className="ic">
              <use href="#i-grid" />
            </svg>
            Premium widgets
          </div>
          <div className="fl f3">
            <svg className="ic">
              <use href="#i-circle" />
            </svg>
            SEO ready
          </div>
        </div>
      </div>
    </section>
  );
}
