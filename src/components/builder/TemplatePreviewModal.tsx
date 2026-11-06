import { useState, useMemo, useEffect, useRef } from "react";
import { X, Monitor, Tablet, Smartphone, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { Template } from "@/services/templates";
import type { TemplateDefinition } from "@/lib/builder/templates";
import type { Project, Page } from "@/lib/builder/store";
import { composePageSections } from "@/lib/builder/sharedChrome";
import { buildPreviewHTML, APP_CSS_HREF } from "@/lib/builder/preview";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | TemplateDefinition | any | null;
  onUseTemplate: (template: any) => void;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activePageSlug, setActivePageSlug] = useState<string>("index");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset page when template changes
  useEffect(() => {
    setActivePageSlug("index");
  }, [template?.id]);

  // Convert template to standard Project structure for preview rendering
  const project: Project | null = useMemo(() => {
    if (!template) return null;

    const rawPages: Page[] = Array.isArray(template.pages) && template.pages.length > 0
      ? template.pages.map((p: any, idx: number) => ({
          id: p.id || `page-${p.slug || idx}`,
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
            sections: (template.sections || []).map((sec: any) => ({
              ...sec,
              html: sec.html || sec.content?.html || "",
            })),
            useGlobalHeader: true,
            useGlobalFooter: true,
            hideHeader: false,
            hideFooter: false,
          },
        ];

    return {
      id: template.id || "preview-project",
      name: template.name || "Template Preview",
      pages: rawPages,
      currentPageId: rawPages[0]?.id || "page-home",
      sharedHeader: template.sharedHeader ?? null,
      sharedFooter: template.sharedFooter ?? null,
      sharedChromeMigrated: true,
      globalCss: template.globalCss || "",
      globalJs: template.globalJs || "",
      customHead: template.customHead || "",
      assets: template.assets || {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source: "template",
      layout: { type: "custom" },
      isTemplate: true,
    };
  }, [template]);

  // Active page
  const activePage = useMemo(() => {
    if (!project) return null;
    return (
      project.pages.find((p) => p.slug === activePageSlug) ||
      project.pages.find((p) => p.slug === "index" || p.slug === "home") ||
      project.pages[0] ||
      null
    );
  }, [project, activePageSlug]);

  // Build rendered HTML with Anti-Scraping / Inspect protection
  const previewHtml = useMemo(() => {
    if (!project || !activePage) return "";

    const composed = composePageSections(project, activePage);

    // Anti-scraping protection snippet to prevent casual devtools/right-click inspection
    const antiScrapingSnippet = `
      <style>
        /* Disable text selection and dragging across preview */
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
        }
      </style>
      <script>
        (function() {
          // Block right-click context menu
          document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
              window.parent.postMessage({ type: 'wto-preview-contextmenu-blocked' }, '*');
            } catch (_) {}
            return false;
          }, true);

          // Block DevTools shortcuts & Save/View Source shortcuts
          document.addEventListener('keydown', function(e) {
            var key = e.key ? e.key.toUpperCase() : '';
            var isCtrlOrMeta = e.ctrlKey || e.metaKey;
            
            // F12
            if (e.keyCode === 123 || e.key === 'F12') {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (isCtrlOrMeta && e.shiftKey && ['I', 'J', 'C'].indexOf(key) !== -1) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
            // Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
            if (isCtrlOrMeta && ['U', 'S', 'P'].indexOf(key) !== -1) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }, true);

          // Disable selection and dragging
          document.addEventListener('selectstart', function(e) { e.preventDefault(); }, true);
          document.addEventListener('dragstart', function(e) { e.preventDefault(); }, true);
        })();
      </script>
    `;

    return buildPreviewHTML({
      sections: composed,
      globalCss: project.globalCss || "",
      globalJs: project.globalJs || "",
      editable: false,
      assets: project.assets,
      pages: project.pages.map((p) => ({ id: p.id, slug: p.slug })),
      currentPageSlug: activePage.slug,
      title: `${project.name} - Live Preview`,
      description: activePage.description,
      keywords: activePage.keywords,
      customHead: `${project.customHead || ""}\n${antiScrapingSnippet}`,
      previewCssHref: project.globalCss ? undefined : APP_CSS_HREF,
    });
  }, [project, activePage]);

  // Listen for navigation messages and context-menu block notifications from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "wto-preview-contextmenu-blocked") {
        toast.info("Right-click is protected in Preview. Click 'Use This Template' to edit in builder!");
      }
      if (e.data.type === "navigate-page" && e.data.payload?.slug) {
        const slug = String(e.data.payload.slug).replace(/^\/+/, "").replace(/\.html$/, "");
        setActivePageSlug(slug);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Keyboard shortcut listener to prevent DevTools / View Source inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      const key = e.key.toUpperCase();
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (
        e.key === "F12" ||
        (isCtrlOrMeta && e.shiftKey && ["I", "J", "C"].includes(key)) ||
        (isCtrlOrMeta && ["U", "S", "P"].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.info("Source code is protected in Preview. Click 'Use This Template' to edit in builder!");
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const deviceWidthClass =
    device === "mobile"
      ? "w-[390px] max-w-full h-[844px] max-h-[88vh]"
      : device === "tablet"
      ? "w-[768px] max-w-full h-[1024px] max-h-[88vh]"
      : "w-full h-full";

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-[#F1F5F9]/95 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        toast.info("Right-click is protected in Preview. Click 'Use This Template' to edit in builder!");
      }}
    >
      {/* Top Header Toolbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-3 sm:px-6 shadow-xs gap-2">
        {/* Left: WebToolOcean Official Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Website Builder by WebToolOcean"
              className="h-8 w-auto max-w-[190px] object-contain"
            />
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> Preview
            </span>
          </div>

          {/* Page Tabs for Multi-page templates */}
          {project && project.pages.length > 1 && (
            <div className="hidden lg:flex items-center gap-1 ml-2 pl-3 border-l border-[#E2E8F0]">
              {project.pages.map((p) => {
                const isActive = activePage?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePageSlug(p.slug)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                      isActive
                        ? "bg-[#EDE9FE] text-[#7137D8] border border-[#7137D8]/30"
                        : "text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: Device Switcher (Desktop, Tablet, Mobile) visible on all viewports */}
        <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] p-1 gap-1 shrink-0 shadow-xs">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              device === "desktop"
                ? "bg-white text-[#7137D8] shadow-xs font-bold"
                : "text-[#64748B] hover:text-[#000000] hover:bg-white/60"
            }`}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              device === "tablet"
                ? "bg-white text-[#7137D8] shadow-xs font-bold"
                : "text-[#64748B] hover:text-[#000000] hover:bg-white/60"
            }`}
            title="Tablet View"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              device === "mobile"
                ? "bg-white text-[#7137D8] shadow-xs font-bold"
                : "text-[#64748B] hover:text-[#000000] hover:bg-white/60"
            }`}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Prominent Premium Yellow "Use This Template" Action + Harmonious Close */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onClose();
              onUseTemplate(template);
            }}
            className="group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#7137D8] via-[#8B5CF6] to-[#7C3AED] px-4 sm:px-5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:brightness-105 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(250,204,21,0.5)] hover:brightness-105 active:translate-y-0 active:shadow-md cursor-pointer"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            <Sparkles className="h-4 w-4 shrink-0 fill-white text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="relative font-bold tracking-tight">Use This Template</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] shadow-xs transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9] hover:text-[#000000]"
            title="Close Preview (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Preview Stage */}
      <main className="relative flex-1 overflow-auto bg-[#080A10] p-2 sm:p-4 flex items-center justify-center">
        <div
          className={`relative transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-[#1E2536] bg-black ${deviceWidthClass}`}
        >
          {previewHtml ? (
            <iframe
              ref={iframeRef}
              srcDoc={previewHtml}
              title={`${template.name} Preview`}
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-presentation"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#94A3B8] text-sm">
              Loading preview...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
