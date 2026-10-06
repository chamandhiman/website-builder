import { useState, useMemo } from "react";
import gsap from "gsap";
import { Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { PREBUILT_TEMPLATES } from "@/services/templateSeeds";
import type { Template } from "@/services/templates";
import { toast } from "sonner";

interface TemplatesPanelProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onRequestLoginForTemplate: (template: Template) => void;
  onPreviewTemplate?: (template: Template) => void;
}

export function TemplatesPanel({
  templates,
  onSelectTemplate,
  onRequestLoginForTemplate,
  onPreviewTemplate,
}: TemplatesPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("All");

  // Merge runtime templates with built-in seeds to ensure rich real data
  const realTemplates = useMemo(() => {
    const list = templates && templates.length > 0 ? templates : PREBUILT_TEMPLATES;
    // Map with curated fallback graphics if thumbnail is missing
    return list.map((t, idx) => {
      let fallbackBg = "#141416";
      let fallbackBig = "linear-gradient(120deg, #ffd21f, #ff8a00)";
      if (idx % 4 === 1) {
        fallbackBg = "#0f2a22";
        fallbackBig = "linear-gradient(120deg, #7CF5C8, #1a6b54)";
      } else if (idx % 4 === 2) {
        fallbackBg = "#2b1a12";
        fallbackBig = "linear-gradient(140deg, #b5651d, #3a2214)";
      } else if (idx % 4 === 3) {
        fallbackBg = "#0d0b1f";
        fallbackBig = "linear-gradient(120deg, #9b8cff, #2b1f6b)";
      }

      return {
        ...t,
        fallbackBg,
        fallbackBig,
      };
    });
  }, [templates]);

  // Extract unique categories for tabs
  const tabs = useMemo(() => {
    return ["All", "New", "Beauty & Salon", "Restaurant & Café", "Real Estate", "SaaS & Technology", "Freelancer"];
  }, []);

  const filteredTemplates = useMemo(() => {
    if (activeTab === "All") return realTemplates;
    if (activeTab === "New") return realTemplates.filter((t) => t.isNew || t.featured);
    if (activeTab === "Coming soon") return realTemplates.filter((t) => t.status === "upcoming");
    return realTemplates.filter(
      (t) =>
        t.category.toLowerCase().includes(activeTab.toLowerCase()) ||
        t.name.toLowerCase().includes(activeTab.toLowerCase())
    );
  }, [realTemplates, activeTab]);

  const handleCardClick = (t: Template) => {
    if (t.status === "upcoming") {
      toast.info(`"${t.name}" is coming soon! Stay tuned.`);
      return;
    }

    if (user) {
      onSelectTemplate(t);
    } else {
      onRequestLoginForTemplate(t);
    }
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
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "on" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="tpl-row" id="tplRow">
        {filteredTemplates.map((t) => {
          const isSoon = t.status === "upcoming";

          return (
            <article
              key={t.id}
              className={`tpl ${isSoon ? "soon-card" : ""}`}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => handleCardClick(t)}
            >
              <div className="shot" style={{ background: "#18181b" }}>
                {isSoon ? (
                  <span className="tag soon">Coming soon</span>
                ) : t.isNew ? (
                  <span className="tag new">New</span>
                ) : t.featured ? (
                  <span className="tag new">Featured</span>
                ) : null}

                {/* Real thumbnail image if available, else mini site art */}
                {t.thumbnail ? (
                  <div className="mini" style={{ background: "#18181b", padding: 0 }}>
                    <img
                      src={t.thumbnail}
                      alt={t.name}
                      className="h-full w-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="mini" style={{ background: t.fallbackBg, color: "#f2f0ea" }}>
                    <div className="m-nav">
                      <b />
                      <span>
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                    <div className="m-h">{t.name}</div>
                    <div className="m-p">
                      <i />
                      <i style={{ width: "50%" }} />
                    </div>
                    <div className="m-big" style={{ background: t.fallbackBig }} />
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
                )}
              </div>

              <div className="meta">
                <div style={{ maxWidth: "200px" }}>
                  <h4 className="truncate">{t.name}</h4>
                  <p className="truncate">{t.category}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!isSoon && onPreviewTemplate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewTemplate(t);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#27272a] text-[#f4f4f5] hover:bg-[#3f3f46] hover:text-[#facc15] transition border border-[#3f3f46]"
                      title="Preview Template"
                    >
                      <Eye className="h-3 w-3 text-[#facc15]" />
                      <span>Preview</span>
                    </button>
                  )}
                  {isSoon ? (
                    <span className="notify">Notify me</span>
                  ) : (
                    <span className="use" title="Use Template">
                      →
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
