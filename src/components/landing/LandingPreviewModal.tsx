import { useEffect, useMemo, useRef } from "react";
import { buildPreviewHTML, APP_CSS_HREF } from "@/lib/builder/preview";
import { composePageSections } from "@/lib/builder/sharedChrome";
import type { Project, Page } from "@/lib/builder/store";

interface LandingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any | null;
  onUseTemplate: (template: any) => void;
}

export function LandingPreviewModal({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}: LandingPreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Compute live HTML if this is a real template with pages/sections
  const livePreviewHtml = useMemo(() => {
    if (!template) return "";

    const targetTemplate = template.realRef || template;
    const hasRealPages = Array.isArray(targetTemplate.pages) && targetTemplate.pages.length > 0;
    const hasSections = Array.isArray(targetTemplate.sections) && targetTemplate.sections.length > 0;

    if (!hasRealPages && !hasSections) {
      return "";
    }

    try {
      const rawPages: Page[] = hasRealPages
        ? targetTemplate.pages.map((p: any, idx: number) => ({
            id: p.id || `page-${idx}`,
            name: p.name || (idx === 0 ? "Home" : `Page ${idx + 1}`),
            slug: p.slug || (idx === 0 ? "index" : `page-${idx}`),
            sections: (p.sections || []).map((sec: any) => ({
              ...sec,
              html: sec.html || sec.content?.html || "",
            })),
            useGlobalHeader: p.useGlobalHeader ?? true,
            useGlobalFooter: p.useGlobalFooter ?? true,
            hideHeader: Boolean(p.hideHeader),
            hideFooter: Boolean(p.hideFooter),
          }))
        : [
            {
              id: "page-home",
              name: "Home",
              slug: "index",
              sections: (targetTemplate.sections || []).map((sec: any) => ({
                ...sec,
                html: sec.html || sec.content?.html || "",
              })),
              useGlobalHeader: true,
              useGlobalFooter: true,
            },
          ];

      const proj: Project = {
        id: targetTemplate.id || "preview-project",
        name: targetTemplate.name || "Preview Project",
        pages: rawPages,
        currentPageId: rawPages[0].id,
        sharedHeader: targetTemplate.sharedHeader ?? null,
        sharedFooter: targetTemplate.sharedFooter ?? null,
        globalCss: targetTemplate.globalCss || "",
        globalJs: targetTemplate.globalJs || "",
        customHead: targetTemplate.customHead || "",
        assets: targetTemplate.assets || {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const activePage = rawPages[0];
      const composedSections = composePageSections(proj, activePage);

      return buildPreviewHTML({
        sections: composedSections,
        globalCss: proj.globalCss,
        globalJs: proj.globalJs,
        editable: false,
        assets: proj.assets,
        currentPageSlug: activePage.slug,
        pages: proj.pages.map((p) => ({ id: p.id, slug: p.slug })),
        previewCssHref: proj.globalCss ? undefined : APP_CSS_HREF,
      });
    } catch (err) {
      console.warn("Failed to generate live preview HTML:", err);
      return "";
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const slug = (template.n || template.name || "template")
    .toLowerCase()
    .replace(/\s+/g, "-") + ".webtoolocean.com";

  // Procedural site mockup fallback
  const wordsList = template.words || ["Modern", "Creative", "Reliable", "Fast"];
  const repeatedWords = [...wordsList, ...wordsList, ...wordsList, ...wordsList];
  const statsList = template.stats || [
    ["10k+", "Users"],
    ["99.9%", "Uptime"],
    ["4.9★", "Rating"],
  ];
  const linksList = template.links || ["Home", "About", "Services", "Contact"];

  return (
    <div className="modal open" id="modal">
      <div className="win2">
        <div className="mbar">
          <i />
          <i />
          <i />
          <span className="u" id="mname">
            {slug}
          </span>
          <span className="sp">
            <button
              type="button"
              className="btn btn-y sm"
              id="muse"
              onClick={() => onUseTemplate(template.realRef || template)}
            >
              Use template →
            </button>
            <button
              type="button"
              className="btn btn-ghost sm"
              id="mclose"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </span>
        </div>

        <div id="mbody">
          {livePreviewHtml ? (
            <iframe
              ref={iframeRef}
              srcDoc={livePreviewHtml}
              title={template.name || template.n}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div
              className="site"
              style={{
                // @ts-ignore
                "--sb": template.sb || "#0c0c0d",
                "--sf": template.sf || "#f2f0ea",
                "--sa": template.sa || "#ffd21f",
                "--sab": template.sab || "#111",
                "--sg": template.sg || "linear-gradient(130deg, #ffd21f, #ff8a00)",
                "--sh": template.sh || "#2a1f14",
                "--r": template.r || "10px",
              }}
            >
              <div className="s-nav">
                <div className="s-logo">{template.n}</div>
                <div className="s-links">
                  {linksList.map((link: string, idx: number) => (
                    <span key={idx}>{link}</span>
                  ))}
                </div>
                <span className="s-cta">{template.b1 || "Get Started"}</span>
              </div>

              <div className="s-hero">
                <div>
                  <h3 className="s-h">{template.h}</h3>
                  <p>{template.p}</p>
                  <div className="s-btns">
                    <a>{template.b1 || "Get Started"}</a>
                    <a>{template.b2 || "Learn More"}</a>
                  </div>
                </div>

                <div className="s-vis">
                  <span className="s-chip c1">
                    <svg className="ic">
                      <use href="#i-zap" />
                    </svg>
                    {template.chips?.[0] || "Fast Setup"}
                  </span>
                  <span className="s-chip c2">
                    <svg className="ic">
                      <use href="#i-circle" />
                    </svg>
                    {template.chips?.[1] || "Production Ready"}
                  </span>
                </div>
              </div>

              <div className="s-strip">
                <div>
                  {repeatedWords.map((w: string, idx: number) => (
                    <span key={idx}>{w} ✦</span>
                  ))}
                </div>
              </div>

              <div className="s-cards">
                {statsList.map((st: [string, string], idx: number) => (
                  <div key={idx}>
                    <b>{st[0]}</b>
                    <span>{st[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
