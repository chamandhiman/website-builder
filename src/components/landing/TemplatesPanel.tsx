import { useState, useMemo } from "react";
import gsap from "gsap";
import type { Template } from "@/services/templates";

interface TemplatesPanelProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

interface TemplateCardData {
  n: string;
  c: string;
  s: string;
  bg: string;
  fg: string;
  big: string;
  h: string;
  id: string;
  original: Template;
}

const DEFAULT_TEMPLATES: Array<Omit<TemplateCardData, "original">> = [
  {
    n: "DreamHome",
    c: "Luxury Real Estate",
    s: "new",
    bg: "#f3efe7",
    fg: "#1b1b1b",
    big: "linear-gradient(160deg,#c9b38a,#4b3b2a)",
    h: "Live where<br>light lives.",
    id: "tpl-dreamhome",
  },
  {
    n: "WellnessLife",
    c: "Health & Fitness",
    s: "new",
    bg: "#0f2a22",
    fg: "#d9ffe9",
    big: "linear-gradient(120deg,#7CF5C8,#1a6b54)",
    h: "Stronger<br>every day.",
    id: "tpl-wellness",
  },
  {
    n: "Portfolio X",
    c: "Personal / Creative",
    s: "",
    bg: "#111",
    fg: "#fff",
    big: "linear-gradient(120deg,#ff4d6d,#ffd21f)",
    h: "I design<br>loud things.",
    id: "tpl-folio",
  },
  {
    n: "Brewline",
    c: "Café & Restaurant",
    s: "",
    bg: "#2b1a12",
    fg: "#ffe6c7",
    big: "linear-gradient(140deg,#b5651d,#3a2214)",
    h: "Slow coffee,<br>fast mornings.",
    id: "tpl-brewline",
  },
  {
    n: "LaunchKit",
    c: "SaaS Landing",
    s: "soon",
    bg: "#0d0b1f",
    fg: "#e8e4ff",
    big: "linear-gradient(120deg,#9b8cff,#2b1f6b)",
    h: "Ship your<br>startup.",
    id: "tpl-launchpad",
  },
  {
    n: "Shopwave",
    c: "E-commerce Store",
    s: "soon",
    bg: "#fff4d6",
    fg: "#1b1b1b",
    big: "linear-gradient(120deg,#ffd21f,#ff8a00)",
    h: "Drop 04 is<br>here.",
    id: "tpl-shopwave",
  },
  {
    n: "EventPulse",
    c: "Events & Conferences",
    s: "soon",
    bg: "#1a0f14",
    fg: "#ffd6e0",
    big: "linear-gradient(120deg,#ff6b8b,#5a1a2e)",
    h: "Oct 24.<br>Be there.",
    id: "tpl-snapshot",
  },
];

export function TemplatesPanel({
  templates,
  onSelectTemplate,
}: TemplatesPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  const displayList = useMemo(() => {
    return DEFAULT_TEMPLATES.map((item, idx) => {
      const match = templates.find(
        (t) =>
          t.id === item.id ||
          t.name.toLowerCase() === item.n.toLowerCase() ||
          t.slug === item.n.toLowerCase()
      );

      const original: Template = match || {
        id: item.id,
        name: item.n,
        slug: item.n.toLowerCase(),
        category: item.c,
        status: item.s === "soon" ? "upcoming" : "published",
        description: `${item.n} template`,
        featured: idx === 0,
        isNew: item.s === "new",
      };

      return {
        ...item,
        original,
      };
    });
  }, [templates]);

  const handleTabClick = (tabIdx: number) => {
    setActiveTab(tabIdx);
  };

  const isVisibleForTab = (item: TemplateCardData) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return item.s === "new";
    if (activeTab === 2) return item.s === "soon";
    if (activeTab === 3) return !item.s || item.s !== "soon";
    return true;
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const rotY = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const rotX = -((e.clientY - r.top) / r.height - 0.5) * 14;
    gsap.to(card, {
      rotateY: rotY,
      rotateX: rotX,
      transformPerspective: 900,
      duration: 0.4,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <section className="panel tpl-panel" data-name="04 — Templates" id="panel-3">
      <div className="tpl-head">
        <div>
          <div className="eyebrow">
            <i />
            Template library
          </div>
          <h2>
            Start <span className="hl">beautiful.</span>
          </h2>
        </div>

        <div className="tabs" role="tablist">
          <button
            type="button"
            className={activeTab === 0 ? "on" : ""}
            onClick={() => handleTabClick(0)}
          >
            All
          </button>
          <button
            type="button"
            className={activeTab === 1 ? "on" : ""}
            onClick={() => handleTabClick(1)}
          >
            New
          </button>
          <button
            type="button"
            className={activeTab === 2 ? "on" : ""}
            onClick={() => handleTabClick(2)}
          >
            Coming soon
          </button>
          <button
            type="button"
            className={activeTab === 3 ? "on" : ""}
            onClick={() => handleTabClick(3)}
          >
            Business
          </button>
        </div>
      </div>

      <div className="tpl-row" id="tplRow">
        {displayList.map((t) => {
          const visible = isVisibleForTab(t);
          const isSoon = t.s === "soon";

          return (
            <article
              key={t.id}
              className={`tpl ${isSoon ? "soon-card" : ""}`}
              style={{
                opacity: visible ? 1 : 0.15,
                transform: visible ? "scale(1)" : "scale(0.94)",
                transition: "opacity 0.4s, transform 0.4s, border-color 0.3s",
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => onSelectTemplate(t.original)}
            >
              <div className="shot" style={{ background: "#18181b" }}>
                {t.s ? (
                  <span className={`tag ${t.s}`}>
                    {t.s === "new" ? "New" : "Coming soon"}
                  </span>
                ) : null}

                <div className="mini" style={{ background: t.bg, color: t.fg }}>
                  <div className="m-nav">
                    <b />
                    <span>
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <div
                    className="m-h"
                    dangerouslySetInnerHTML={{ __html: t.h }}
                  />
                  <div className="m-p">
                    <i />
                    <i style={{ width: "50%" }} />
                  </div>
                  <div className="m-big" style={{ background: t.big }} />
                  <div className="m-blocks">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="m-blocks">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>

              <div className="meta">
                <div>
                  <h4>{t.n}</h4>
                  <p>{t.c}</p>
                </div>
                {isSoon ? (
                  <span className="notify">Notify me</span>
                ) : (
                  <span className="use">→</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
