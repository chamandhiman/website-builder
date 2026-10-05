import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroPanelProps {
  onStartBuilding: () => void;
  onExploreTemplates: () => void;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function HeroPanel({
  onStartBuilding,
  onExploreTemplates,
  mousePosRef,
}: HeroPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const typedRef = useRef<HTMLSpanElement | null>(null);
  const selRef = useRef<HTMLDivElement | null>(null);
  const fcurRef = useRef<SVGSVGElement | null>(null);
  const builderRef = useRef<HTMLDivElement | null>(null);
  const rotatorRef = useRef<HTMLSpanElement | null>(null);

  // Ocean Particle Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    let t = 0;
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.012;
      const cols = 70;
      const rows = 16;
      const gx = w / cols;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i <= cols; i++) {
          const px = i * gx;
          const base = h * 0.62 + j * (h * 0.028);
          const d = Math.hypot(px / dpr - mx, base / dpr - my);
          const lift = Math.max(0, 1 - d / 260) * 40 * dpr;
          const py =
            base + Math.sin(i * 0.18 + t * 2 + j * 0.5) * 12 * dpr * (1 + j * 0.08) - lift;
          const a = (1 - j / rows) * 0.55;
          ctx.fillStyle =
            lift > 4
              ? `rgba(255, 210, 31, ${a + 0.3})`
              : `rgba(255, 210, 31, ${a * 0.45})`;
          ctx.beginPath();
          ctx.arc(px, py, (1 + j * 0.09) * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePosRef]);

  // Word Rotator
  useEffect(() => {
    const rot = rotatorRef.current;
    if (!rot) return;
    const spans = Array.from(rot.querySelectorAll("span"));
    if (spans.length === 0) return;

    let idx = 0;
    gsap.set(spans, { yPercent: 100 });
    gsap.set(spans[0], { yPercent: 0 });

    const interval = setInterval(() => {
      const next = (idx + 1) % spans.length;
      gsap.to(spans[idx], { yPercent: -100, duration: 0.7, ease: "expo.inOut" });
      gsap.fromTo(
        spans[next],
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: "expo.inOut" }
      );
      idx = next;
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // Builder Canvas Live Mockup Interaction
  useEffect(() => {
    const typed = typedRef.current;
    const sel = selRef.current;
    const fcur = fcurRef.current;
    const builder = builderRef.current;
    if (!typed || !sel || !fcur || !builder) return;

    let isCancelled = false;
    const heads = [
      "Live where light lives.",
      "Your dream home awaits.",
      "Luxury, simplified.",
    ];
    const targets: Array<[string, string]> = [
      [".b-hero .t", "Heading"],
      [".b-img", "Image"],
      [".b-hero .pill", "Button"],
      [".b-cards .blk:nth-child(2)", "Feature card"],
    ];
    let k = 0;

    const getBox = (selector: string) => {
      const targetElem = builder.querySelector(selector);
      if (!targetElem) return { x: 0, y: 0, w: 100, h: 40 };
      const r = targetElem.getBoundingClientRect();
      const b = builder.getBoundingClientRect();
      return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
    };

    const typeText = async (str: string) => {
      typed.textContent = "";
      for (const char of str) {
        if (isCancelled) return;
        typed.textContent += char;
        await new Promise((res) => setTimeout(res, 55));
      }
    };

    const cycle = async () => {
      if (isCancelled) return;
      const [q, label] = targets[k % targets.length];
      const b = getBox(q);

      await gsap.to(fcur, {
        left: b.x + b.w * 0.7,
        top: b.y + b.h * 0.6,
        duration: 1,
        ease: "power3.inOut",
      });
      if (isCancelled) return;

      gsap.fromTo(fcur, { scale: 0.8 }, { scale: 1, duration: 0.3 });
      sel.setAttribute("data-label", label);
      gsap.set(sel, {
        left: b.x - 4,
        top: b.y - 4,
        width: b.w + 8,
        height: b.h + 8,
      });
      gsap.fromTo(sel, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.35 });

      if (label === "Heading") {
        await typeText(heads[Math.floor(k / 4) % heads.length]);
      }
      if (label === "Image") {
        const im = builder.querySelector<HTMLElement>(".b-img");
        if (im) {
          const gradients = [
            "linear-gradient(160deg, #ffd21f, #ff8a00 60%, #ff4d6d)",
            "linear-gradient(160deg, #7cf5c8, #1a6b54)",
            "linear-gradient(160deg, #9b8cff, #2b1f6b)",
          ];
          im.style.background = gradients[Math.floor(k / 4) % 3];
        }
      }
      if (label === "Button") {
        gsap.fromTo(q, { scale: 1 }, { scale: 1.15, yoyo: true, repeat: 1, duration: 0.25 });
      }
      if (label === "Feature card") {
        const bar = builder.querySelector<HTMLElement>("#exbar");
        if (bar) {
          gsap.to(bar, {
            width: "100%",
            duration: 1.2,
            onComplete: () => gsap.set(bar, { width: 0, delay: 0.6 }),
          });
        }
      }

      await new Promise((res) => setTimeout(res, 1300));
      if (isCancelled) return;
      gsap.to(sel, { opacity: 0, duration: 0.25 });
      k++;
      cycle();
    };

    const initialTimeout = setTimeout(() => {
      typeText(heads[0]).then(cycle);
    }, 1500);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <section className="panel" data-name="01 — Build" id="panel-0">
      <canvas id="ocean" ref={canvasRef} />

      <div className="hero-grid">
        <div>
          <div className="eyebrow">
            <i />
            No-code website builder
          </div>
          <h1>
            <span className="word">
              <span>Build</span>
            </span>{" "}
            <span className="word">
              <span>websites</span>
            </span>
            <br />
            <span className="word">
              <span>that</span>
            </span>{" "}
            <span className="rotator" id="rot" ref={rotatorRef}>
              <span>flow.</span>
              <span>convert.</span>
              <span>sell.</span>
              <span>wow.</span>
            </span>
          </h1>
          <p className="lead">
            Pick a template, click anything to edit, and download clean code you actually
            own. WebToolOcean turns an idea into a live website in minutes — not weeks.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-y btn-lg magnetic"
              onClick={onStartBuilding}
            >
              Start building — it&apos;s free
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-lg"
              onClick={onExploreTemplates}
            >
              Browse templates
            </button>
          </div>

          <div className="scroll-hint">
            <span className="arr" />
            Scroll to sail sideways
          </div>
        </div>

        <div className="builder" id="builder" ref={builderRef}>
          <div className="b-bar">
            <i />
            <i />
            <i />
            <span className="url">dreamhome.webtoolocean.site</span>
          </div>

          <div className="b-canvas">
            <div className="blk b-nav" data-b>
              <span>
                <b />
                <b />
                <b />
              </span>
              <em />
            </div>

            <div className="blk b-hero" data-b>
              <div>
                <div className="t">
                  <span id="typed" ref={typedRef} />
                  <span className="caret" />
                </div>
                <div className="lines">
                  <b style={{ width: "90%" }} />
                  <b style={{ width: "70%" }} />
                </div>
                <span className="pill">Book a tour</span>
              </div>
              <div className="b-img" data-b />
            </div>

            <div className="b-cards">
              <div className="blk" data-b>
                <b />
                <i />
              </div>
              <div className="blk" data-b>
                <b />
                <i />
              </div>
              <div className="blk" data-b>
                <b />
                <i />
              </div>
            </div>
          </div>

          <div className="select" id="sel" ref={selRef} data-label="Heading" />

          <svg
            className="fake-cursor"
            id="fcur"
            ref={fcurRef}
            viewBox="0 0 24 24"
          >
            <path
              d="M4 2l16 9-7 2-3 7z"
              fill="#FFD21F"
              stroke="#111"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          <div className="float-chip chip-1">
            <span className="sw">
              <i style={{ background: "#FFD21F" }} />
              <i style={{ background: "#ff4d6d" }} />
              <i style={{ background: "#0f3b4a" }} />
            </span>
            Theme applied
          </div>

          <div className="float-chip chip-2">
            Exporting
            <span className="bar">
              <i id="exbar" />
            </span>
          </div>

          <div className="float-chip chip-3">✦ 24 new templates</div>
        </div>
      </div>
    </section>
  );
}
