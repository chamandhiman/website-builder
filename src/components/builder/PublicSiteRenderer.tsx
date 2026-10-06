import { useEffect, useState, useMemo, useRef } from "react";
import { getPublishedWebsite, type PublishedWebsiteRecord } from "@/services/publishing";
import { composePageSections } from "@/lib/builder/sharedChrome";
import { buildPreviewHTML } from "@/lib/builder/preview";
import { Loader2, Globe, ArrowLeft, ExternalLink } from "lucide-react";

interface PublicSiteRendererProps {
  slug: string;
  initialPageSlug?: string;
}

export function PublicSiteRenderer({ slug, initialPageSlug }: PublicSiteRendererProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PublishedWebsiteRecord | null>(null);
  const [activePageSlug, setActivePageSlug] = useState<string>(initialPageSlug || "index");
  const [notFound, setNotFound] = useState(false);
  const [badgeDismissed, setBadgeDismissed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    getPublishedWebsite(slug)
      .then((record) => {
        if (!isMounted) return;
        if (!record || !record.project) {
          setNotFound(true);
          setData(null);
        } else {
          setData(record);
          setNotFound(false);
          const firstPageSlug = record.project.pages?.[0]?.slug || "index";
          if (!initialPageSlug) {
            setActivePageSlug(firstPageSlug);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading published website:", err);
        if (isMounted) setNotFound(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, initialPageSlug]);

  // Listen for iframe navigation events (when visitor clicks internal page links)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (msg && msg.__wto && msg.type === "navigate-page") {
        const nextSlug = msg.payload?.slug;
        if (nextSlug && typeof nextSlug === "string") {
          setActivePageSlug(nextSlug);
          // Update URL query param if on /site/:slug without reloading
          if (typeof window !== "undefined" && window.location.pathname.startsWith("/site/")) {
            const url = new URL(window.location.href);
            url.searchParams.set("page", nextSlug);
            window.history.pushState({}, "", url.toString());
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Compute rendered HTML for current page
  const renderedHtml = useMemo(() => {
    if (!data || !data.project) return "";
    const project = data.project;
    const pages = project.pages || [];
    if (pages.length === 0) return "";

    // Find requested page, fallback to first page
    const page =
      pages.find((p) => p.slug === activePageSlug) ||
      pages.find((p) => p.slug === "index") ||
      pages[0];

    const composedSections = composePageSections(project, page);

    const pageList = pages.map((p) => ({ id: p.id, slug: p.slug || "page" }));

    return buildPreviewHTML({
      sections: composedSections,
      globalCss: project.globalCss || "",
      globalJs: project.globalJs || "",
      editable: false,
      assets: project.assets,
      pages: pageList,
      currentPageSlug: page.slug || "index",
      title: page.seo?.title || page.name || project.name,
      description: page.description || page.seo?.description || project.description,
      keywords: page.keywords || page.seo?.keywords || project.keywords,
      seo: page.seo,
      projectSeo: project.seo,
      customHead: project.customHead,
    });
  }, [data, activePageSlug]);

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0F0F] text-[#E0E0E0]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-2 border-[#FACC15]/20 border-t-[#FACC15] animate-spin" />
            <Globe className="absolute h-5 w-5 text-[#FACC15]" />
          </div>
          <p className="text-sm font-medium tracking-wide text-[#A0A0A0]">Loading website...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2B2B2B] bg-[#171717] text-[#969696]">
            <Globe className="h-8 w-8 text-[#666666]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FACC15]">404 Not Found</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Website Not Found</h1>
            <p className="text-sm text-[#969696] leading-relaxed">
              The website at <code className="font-mono text-[#FACC15]">{slug}.webtoolocean.com</code> does not exist or has not been published yet.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://builder.webtoolocean.com"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#FACC15] px-5 text-sm font-semibold text-[#111111] transition hover:bg-[#FDE047]"
            >
              Build Your Website
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Published Website Sandbox */}
      <iframe
        ref={iframeRef}
        key={`${slug}-${activePageSlug}`}
        srcDoc={renderedHtml}
        title={data.name || "Published Website"}
        className="w-full h-full border-0 block"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />

      {/* Subtle "Made with WebToolOcean" Badge */}
      {!badgeDismissed && (
        <aside
          aria-label="Website builder branding"
          className="fixed bottom-3 right-3 z-40 flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md transition hover:scale-105 group"
        >
          <a
            href="https://builder.webtoolocean.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-700 hover:text-black"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[#FACC15] text-[9px] font-bold">
              W
            </span>
            <span>Made with <strong className="font-semibold text-neutral-900">WebToolOcean</strong></span>
          </a>
          <button
            type="button"
            onClick={() => setBadgeDismissed(true)}
            className="text-neutral-400 hover:text-neutral-700 text-xs ml-1 leading-none"
            title="Dismiss badge"
            aria-label="Dismiss badge"
          >
            ×
          </button>
        </aside>
      )}
    </div>
  );
}
