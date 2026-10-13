import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  getAllWidgets,
  deleteWidget,
  duplicateWidget,
  createNewGoogleReviewsWidget,
  createNewCountdownWidget,
  createNewFaqWidget,
  saveWidget,
  COUNTDOWN_TEMPLATE_LIST,
  type WidgetInstanceRecord,
  type CountdownTemplateItem,
} from "@/services/widgetService";
import { renderCountdownHtml, renderGoogleReviewsHtml } from "@/lib/widget-runtime/wtoWidgetRuntime";
import { TemplateCardPreview } from "@/components/widgets/TemplateCardPreview";
import {
  Clock,
  Star,
  Code2,
  Edit3,
  Copy,
  Trash2,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Search,
  Megaphone,
  Sparkles,
  HelpCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface WidgetsSearchParams {
  tab?: "catalog" | "my_widgets" | "countdown" | "google_reviews";
}

export const Route = createFileRoute("/dashboard/widgets/")({
  validateSearch: (search: Record<string, unknown>): WidgetsSearchParams => {
    return {
      tab: (search.tab as any) || undefined,
    };
  },
  component: DashboardWidgetsPage,
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function DashboardWidgetsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const [widgets, setWidgets] = useState<WidgetInstanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: "catalog" | "active" | "choose_countdown" | "choose_google_reviews"
  const [viewMode, setViewMode] = useState<"catalog" | "active" | "choose_countdown" | "choose_google_reviews">(() => {
    if (tab === "countdown") return "choose_countdown";
    if (tab === "google_reviews") return "choose_google_reviews";
    if (tab === "my_widgets") return "active";
    return "catalog";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [creatingCountdownKey, setCreatingCountdownKey] = useState<string | null>(null);
  const [creatingGoogle, setCreatingGoogle] = useState(false);
  const [googleWidgetName, setGoogleWidgetName] = useState("My Google Reviews");
  const [embedModalWidget, setEmbedModalWidget] = useState<WidgetInstanceRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingWidget, setDeletingWidget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live ticking countdown for card 1
  const [liveSec, setLiveSec] = useState(53);
  const [liveMin, setLiveMin] = useState(47);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSec((prev) => {
        if (prev <= 0) {
          setLiveMin((m) => (m > 0 ? m - 1 : 59));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadWidgets = async () => {
    setLoading(true);
    try {
      const list = await getAllWidgets();
      setWidgets(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load widgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWidgets();
    const handleUpdate = () => loadWidgets();
    window.addEventListener("wto-widget-saved", handleUpdate);
    window.addEventListener("wto-widget-deleted", handleUpdate);
    return () => {
      window.removeEventListener("wto-widget-saved", handleUpdate);
      window.removeEventListener("wto-widget-deleted", handleUpdate);
    };
  }, []);

  const filterMatches = (category: string, name: string) => {
    const matchesCat = selectedCategory === "all" || selectedCategory === category;
    const matchesSearch =
      searchQuery.trim() === "" ||
      name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  };

  const handleSelectCountdownTemplate = async (tpl: CountdownTemplateItem) => {
    setCreatingCountdownKey(tpl.key);
    try {
      const newWidget = createNewCountdownWidget(tpl.name, tpl.key);
      await saveWidget(newWidget);
      toast.success(`${tpl.name} created! Opening Countdown Studio…`);
      navigate({
        to: "/dashboard/widgets/countdown/$widgetId",
        params: { widgetId: newWidget.id },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create countdown widget");
      setCreatingCountdownKey(null);
    }
  };

  const handleCreateGoogleReview = async (layoutType: "carousel" | "grid" | "badge" = "carousel") => {
    setCreatingGoogle(true);
    try {
      const newWidget = createNewGoogleReviewsWidget(googleWidgetName.trim() || "My Google Reviews", layoutType);
      await saveWidget(newWidget);
      toast.success("Google Reviews widget created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/google-reviews/$widgetId",
        params: { widgetId: newWidget.id },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create Google Review widget");
      setCreatingGoogle(false);
    }
  };

  const handleCreateFaq = async (templateKey: any = "classic_accordion") => {
    try {
      const newWidget = createNewFaqWidget("FAQ Accordion", templateKey);
      await saveWidget(newWidget);
      toast.success("FAQ Accordion created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/faq-accordion/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create FAQ Accordion");
    }
  };

  const handleToggleWidgetActive = async (w: WidgetInstanceRecord) => {
    const nextEnabled = w.enabled === false ? true : false;
    try {
      const updated = {
        ...w,
        enabled: nextEnabled,
      };
      await saveWidget(updated);
      setWidgets((prev) =>
        prev.map((item) => (item.id === w.id ? { ...item, enabled: nextEnabled } : item))
      );
      toast.success(
        nextEnabled
          ? `"${w.name}" turned ON — visible across all sites & embeds.`
          : `"${w.name}" turned OFF — hidden from all sites & embeds.`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update widget active state");
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeletingWidget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deletingWidget) return;
    setIsDeleting(true);
    try {
      await deleteWidget(deletingWidget.id);
      toast.success(`"${deletingWidget.name}" deleted successfully`);
      setDeletingWidget(null);
      await loadWidgets();
    } catch (err) {
      console.error("[Widgets] Failed to delete widget:", err);
      toast.error("Failed to delete widget");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateWidget(id);
      if (copy) {
        toast.success("Widget duplicated");
        await loadWidgets();
      }
    } catch (err) {
      toast.error("Failed to duplicate widget");
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const embedCodeString = useMemo(() => {
    if (!embedModalWidget) return "";
    return `<div data-wto-widget="${embedModalWidget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [embedModalWidget]);

  const copyEmbedCode = () => {
    if (!embedCodeString) return;
    navigator.clipboard.writeText(embedCodeString);
    setCopied(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      {/* ================= CASE 1: CHOOSE COUNTDOWN TEMPLATE ================= */}
      {viewMode === "choose_countdown" && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-5 border-b border-[#26262e]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151518] hover:bg-[#1f1f25] text-[#9a9aa3] hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Widgets</span>
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-white">Choose a Countdown Template</h1>
                <p className="text-xs text-[#9a9aa3]">Select a pre-designed style to launch your countdown widget.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCountdownTemplate(COUNTDOWN_TEMPLATE_LIST[0])}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 cursor-pointer"
            >
              <span>Blank Timer +</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNTDOWN_TEMPLATE_LIST.map((tpl) => (
              <div
                key={tpl.key}
                className="p-4 rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/40 transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="h-44 rounded-xl overflow-hidden bg-[#0d0d10] border border-[#26262e] p-2 flex items-center justify-center">
                    <TemplateCardPreview tpl={tpl} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-[#ffc21a] transition">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[#9a9aa3] line-clamp-2 mt-1">{tpl.description}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#ffc21a] bg-[#ffc21a]/10 px-2 py-0.5 rounded-full border border-[#ffc21a]/20 capitalize">
                    {(tpl as any).timerMode || tpl.config?.timerMode || "Date"}
                  </span>
                  <button
                    type="button"
                    disabled={creatingCountdownKey === tpl.key}
                    onClick={() => handleSelectCountdownTemplate(tpl)}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md hover:opacity-90 transition cursor-pointer"
                  >
                    <span>{creatingCountdownKey === tpl.key ? "Opening…" : "Use Template →"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CASE 2: CHOOSE GOOGLE REVIEWS LAYOUT ================= */}
      {viewMode === "choose_google_reviews" && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-5 border-b border-[#26262e]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151518] hover:bg-[#1f1f25] text-[#9a9aa3] hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Widgets</span>
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-white">Choose Google Reviews Layout</h1>
                <p className="text-xs text-[#9a9aa3]">Display authentic Google reviews on your websites.</p>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <label className="text-xs font-bold text-[#9a9aa3] block mb-1.5">Widget Name</label>
            <input
              type="text"
              value={googleWidgetName}
              onChange={(e) => setGoogleWidgetName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-[#26262e] text-white text-sm focus:outline-none focus:border-[#ffc21a]"
              placeholder="e.g. Homepage Customer Reviews"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Carousel */}
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#0f0f13] border border-white/10 p-3 flex flex-col justify-center">
                  <div className="text-xs text-[#ffc21a] font-bold">★★★★★ 5.0</div>
                  <p className="text-xs text-white mt-1 italic">&quot;Best service in town! Super fast delivery.&quot;</p>
                  <small className="text-[11px] text-[#6b6b74] mt-1">Ananya S. · Verified Google Review</small>
                </div>
                <h3 className="font-extrabold text-white text-base">Interactive Carousel</h3>
                <p className="text-xs text-[#9a9aa3]">Smooth horizontal slider with auto-play and navigation arrows.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("carousel")}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Carousel & Open →"}</span>
              </button>
            </div>

            {/* Grid */}
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#0f0f13] border border-white/10 p-3 grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-[#16161c] border border-white/10 text-[10px] text-zinc-300">
                    <span className="text-[#ffc21a]">★★★★★</span>
                    <p className="line-clamp-2 mt-0.5">Super support!</p>
                  </div>
                  <div className="p-2 rounded bg-[#16161c] border border-white/10 text-[10px] text-zinc-300">
                    <span className="text-[#ffc21a]">★★★★★</span>
                    <p className="line-clamp-2 mt-0.5">Great quality!</p>
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base">Multi-Column Grid</h3>
                <p className="text-xs text-[#9a9aa3]">Show multiple reviews simultaneously in a responsive grid layout.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("grid")}
                className="w-full py-2 px-3 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:border-[#ffc21a]/50 transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Grid & Open →"}</span>
              </button>
            </div>

            {/* Floating Badge */}
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#0f0f13] border border-white/10 p-3 flex items-center justify-center">
                  <div className="px-3.5 py-2 rounded-xl bg-[#1a1a20] border border-[#303038] text-center">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-center">
                      <GoogleIcon />
                      <span>Google Rating</span>
                    </div>
                    <div className="text-[#ffc21a] text-xs font-bold mt-1">★★★★★ 4.9/5</div>
                    <div className="text-[10px] text-[#6b6b74]">150+ verified reviews</div>
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base">Floating Rating Badge</h3>
                <p className="text-xs text-[#9a9aa3]">A compact badge pinned to the corner or embedded inline in headers.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("badge")}
                className="w-full py-2 px-3 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:border-[#ffc21a]/50 transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Badge & Open →"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CATALOG & ACTIVE VIEW ================= */}
      {viewMode !== "choose_countdown" && viewMode !== "choose_google_reviews" && (
        <>
          {/* ================= HERO BANNER ================= */}
          <section className="relative rounded-[22px] bg-gradient-to-br from-[#17150f] via-[#141418] to-[#121215] border border-white/[0.07] p-8 overflow-hidden flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-2xl">
            {/* Ambient Gold & Blue Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#ffc21a]/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-xs font-bold mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a] animate-pulse" />
                Dynamic Widgets
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                Widget Studio <span className="text-[#ffc21a] bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] bg-clip-text text-transparent">&amp; Hub</span>
              </h1>
              <p className="text-sm text-[#9a9aa3] leading-relaxed">
                Choose interactive widgets to boost conversions, build social trust and embed them on any website — in under a minute.
              </p>
            </div>

            {/* Sliding View Switch */}
            <div className="relative z-10 flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "catalog"
                    ? "bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black shadow-lg shadow-[#ffc21a]/25"
                    : "text-[#9a9aa3] hover:text-white"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={viewMode === "catalog" ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Widget Catalog</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    viewMode === "catalog" ? "bg-black/20 text-[#1a1400]" : "bg-white/10 text-[#9a9aa3]"
                  }`}
                >
                  6
                </span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("active")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "active"
                    ? "bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black shadow-lg shadow-[#ffc21a]/25"
                    : "text-[#9a9aa3] hover:text-white"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>My Active Widgets</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    viewMode === "active" ? "bg-black/20 text-[#1a1400]" : "bg-white/10 text-[#9a9aa3]"
                  }`}
                >
                  {widgets.length || 4}
                </span>
              </button>
            </div>
          </section>

          {/* ================= STATS ROW ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#ffc21a]/10 text-[#ffc21a] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">6</div>
                <div className="text-xs text-[#9a9aa3]">Widgets in catalog</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">2</div>
                <div className="text-xs text-[#9a9aa3]">Ready to use</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#60a5fa]/10 text-[#60a5fa] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{widgets.length || 4}</div>
                <div className="text-xs text-[#9a9aa3]">Active on your sites</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">12.4k</div>
                <div className="text-xs text-[#9a9aa3]">
                  Views this month <span className="text-[#22c55e] font-bold ml-1">↑ 18%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CATALOG VIEW ================= */}
          {viewMode === "catalog" && (
            <section className="space-y-6">
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "all"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md shadow-[#ffc21a]/25"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    <span>All widgets</span>
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                        selectedCategory === "all" ? "bg-black/20 text-[#1a1400]" : "text-[#6b6b74]"
                      }`}
                    >
                      6
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("urgency")}
                    className={`px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "urgency"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    Urgency &amp; Timers
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("social_proof")}
                    className={`px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "social_proof"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    Social Proof &amp; Reviews
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("chat")}
                    className={`px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "chat"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    Chat &amp; Contact
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("promo")}
                    className={`px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "promo"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    Promotions &amp; Bars
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("support")}
                    className={`px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "support"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    Customer Support
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory("media")}
                    className={`px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === "media"
                        ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md"
                        : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold"
                    }`}
                  >
                    Social Media
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-[#151518] border border-white/[0.08] focus-within:border-[#ffc21a]/50 rounded-xl px-3 py-1.5 w-full md:w-[240px] shrink-0">
                  <Search className="w-3.5 h-3.5 text-[#6b6b74] shrink-0" />
                  <input
                    type="search"
                    placeholder="Search widgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#6b6b74] flex-1 min-w-0"
                  />
                  <kbd className="text-[10px] font-semibold text-[#6b6b74] border border-white/10 rounded px-1.5 py-0.5 shrink-0">⌘K</kbd>
                </div>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* FAQ Accordion (Ready & Fully Functional) */}
                {filterMatches("support", "faq accordion") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(56,189,248,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                      <div className="w-full max-w-[280px] space-y-2">
                        {/* Open question */}
                        <div className="p-2.5 rounded-lg bg-white/[0.06] border border-white/10 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-bold text-white">
                            <span>How does it work?</span>
                            <span className="text-[#ffc21a] text-xs font-black">−</span>
                          </div>
                          <p className="text-[10px] text-[#9a9aa3] mt-1 leading-snug line-clamp-1">
                            Everything is automated and completely customizable.
                          </p>
                        </div>
                        {/* Closed question */}
                        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-medium text-zinc-300">
                          <span>Can I embed this anywhere?</span>
                          <span className="text-zinc-500 text-xs font-bold">+</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-sky-400 bg-sky-400/10 border border-sky-400/20 px-3 py-0.5 rounded-full mt-2">
                        💬 Live Accordion &amp; Search
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                            Ready
                          </span>
                          <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                            8 Pro presets
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Customer Support
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                            <HelpCircle className="w-4 h-4" />
                          </span>
                          <span>FAQ Accordion</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Display frequently asked questions and answers in a clean, interactive accordion with live search, categories, and 8 ready-made templates.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ 8 templates
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Live search
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Category filter
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Rich text answers
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Schema FAQPage
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => handleCreateFaq("classic_accordion")}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:opacity-95 text-black font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-sky-500/10"
                        >
                          <span>+ Create FAQ Widget</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* 1. Countdown Timer (Ready) */}
                {filterMatches("urgency", "countdown timer") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,194,26,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-[#26262c] to-[#1f1f24] border border-white/10 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                            <span>02</span>
                            <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60" />
                          </div>
                          <small className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b6b74]">
                            HRS
                          </small>
                        </div>
                        <span className="text-[#ffc21a] font-bold text-xl pb-3.5">:</span>
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-[#26262c] to-[#1f1f24] border border-white/10 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                            <span>{pad(liveMin)}</span>
                            <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60" />
                          </div>
                          <small className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b6b74]">
                            MIN
                          </small>
                        </div>
                        <span className="text-[#ffc21a] font-bold text-xl pb-3.5">:</span>
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-[#26262c] to-[#1f1f24] border border-[#ffc21a]/30 text-[#ffc21a] font-black text-2xl flex items-center justify-center shadow-lg animate-pulse">
                            <span>{pad(liveSec)}</span>
                            <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60" />
                          </div>
                          <small className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b6b74]">
                            SEC
                          </small>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#ffc21a] bg-[#ffc21a]/10 border border-[#ffc21a]/20 px-3 py-0.5 rounded-full mt-3">
                        ⚡ Flash sale ends soon
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                            Ready
                          </span>
                          <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                            10 Pro presets
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Urgency &amp; Conversions
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-[#ffc21a]/10 border border-[#ffc21a]/20 text-[#ffc21a] flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </span>
                          <span>Countdown Timer</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Sales deadlines, evergreen visitor timers, recurring bars &amp; number counters with flip-clock styles and expiry actions.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Date &amp; evergreen
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Sticky bars
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Flip clock
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Sound alerts
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewMode("choose_countdown")}
                          className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Choose widget</span>
                          <span className="text-sm">→</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode("choose_countdown")}
                          className="w-10 h-10 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Preview"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* 2. Google Reviews (Ready) */}
                {filterMatches("social_proof", "google reviews") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(66,133,244,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                      {/* Review Card */}
                      <div className="w-[220px] p-2.5 rounded-xl bg-[#1f1f25] border border-white/10 shadow-xl flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-[#3b82f6] text-white font-black text-xs flex items-center justify-center shrink-0">
                          M
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-xs font-bold text-white">Meera</strong>
                            <span className="text-[#ffc21a] text-[10px]">★★★★★</span>
                          </div>
                          <p className="text-[11px] text-[#9a9aa3] truncate">Highly recommended.</p>
                        </div>
                      </div>

                      {/* Google 4.9 Badge */}
                      <div className="absolute right-3.5 bottom-3 bg-white text-black px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <GoogleIcon className="w-3.5 h-3.5" />
                        <span className="font-extrabold text-[11px]">4.9</span>
                        <span className="text-[#f59e0b] text-[10px]">★</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                            Ready
                          </span>
                          <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                            Live Google Places
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Social Proof &amp; Trust
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-white border border-white text-black flex items-center justify-center">
                            <GoogleIcon className="w-4 h-4" />
                          </span>
                          <span>Google Reviews</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Display authentic Google reviews with verified badges, real-time ratings and carousel, grid, masonry or floating layouts.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Live sync
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Carousel &amp; grid
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Verified badges
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ 5-star filter
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewMode("choose_google_reviews")}
                          className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Choose widget</span>
                          <span className="text-sm">→</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode("choose_google_reviews")}
                          className="w-10 h-10 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Preview"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* 3. WhatsApp Live Chat (Coming soon) */}
                {filterMatches("chat", "whatsapp live chat") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-white/20 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(37,211,102,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                      {/* Chat Window */}
                      <div className="w-[210px] rounded-xl overflow-hidden bg-[#1f1f25] border border-white/10 shadow-xl pb-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#075e54]">
                          <span className="w-5 h-5 rounded-full bg-[#25d366] text-black font-extrabold text-[10px] flex items-center justify-center">
                            W
                          </span>
                          <div>
                            <strong className="block text-[11px] font-bold text-white leading-tight">Support</strong>
                            <small className="block text-[9px] text-[#a7f3d0] leading-tight">● Online</small>
                          </div>
                        </div>
                        <p className="m-2 p-1.5 rounded-lg bg-[#2a2a31] text-[10px] text-white w-fit">
                          Hi there 👋 How can we help?
                        </p>
                        <div className="mr-2 ml-auto p-1.5 rounded-lg bg-[#005c4b] w-fit flex gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#d1fae5] animate-ping" />
                          <span className="w-1 h-1 rounded-full bg-[#d1fae5] animate-pulse" />
                          <span className="w-1 h-1 rounded-full bg-[#d1fae5]" />
                        </div>
                      </div>

                      {/* Floating Green WhatsApp Button */}
                      <span className="absolute right-4 bottom-3 w-9 h-9 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg shadow-[#25d366]/40 animate-pulse">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
                        </svg>
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a]" />
                            Coming soon
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#6b6b74]">
                            <span className="w-14 h-1 rounded-full bg-white/10 overflow-hidden block">
                              <span className="w-[72%] h-full bg-gradient-to-r from-[#ff9f0a] to-[#ffc21a] block" />
                            </span>
                            72%
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Chat &amp; Contact
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-[#25d366]/15 border border-[#25d366]/30 text-[#25d366] flex items-center justify-center">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
                            </svg>
                          </span>
                          <span>WhatsApp Live Chat</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Floating WhatsApp button with custom greeting, avatar and pre-filled messages that turn visitors into phone leads.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Floating bubble
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Custom greeting
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Mobile ready
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Lead capture
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => toast.success("We'll notify you as soon as WhatsApp Live Chat is released!")}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-white font-bold text-xs transition cursor-pointer"
                        >
                          🔔 Notify me when ready
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* 4. Sales Pop Notifications (Coming soon) */}
                {filterMatches("social_proof", "sales pop notifications") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-white/20 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(167,139,250,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f7f7f8] text-black shadow-xl w-fit">
                        <span className="w-8 h-8 rounded-lg bg-[#ffe9a8] flex items-center justify-center text-sm">
                          🛍️
                        </span>
                        <div>
                          <strong className="block text-xs font-bold leading-tight">Priya from Delhi</strong>
                          <small className="block text-[10px] text-zinc-600 leading-tight">
                            just bought Premium Plan · 2m ago
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a]" />
                            Coming soon
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#6b6b74]">
                            <span className="w-14 h-1 rounded-full bg-white/10 overflow-hidden block">
                              <span className="w-[45%] h-full bg-gradient-to-r from-[#ff9f0a] to-[#ffc21a] block" />
                            </span>
                            45%
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Social Proof &amp; Trust
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-[#a78bfa]/15 border border-[#a78bfa]/30 text-[#a78bfa] flex items-center justify-center">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4" />
                            </svg>
                          </span>
                          <span>Sales Pop Notifications</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Show real-time purchase and sign-up pop-ups to create FOMO and build instant trust with new visitors.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Live activity
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Custom timing
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Geo labels
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Click tracking
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => toast.success("We'll notify you as soon as Sales Pop is released!")}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-white font-bold text-xs transition cursor-pointer"
                        >
                          🔔 Notify me when ready
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* 5. Announcement & Popup (Ready to Deploy) */}
                {filterMatches("promo", "announcement & popup") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(250,204,21,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                      <div className="w-[230px] rounded-xl overflow-hidden bg-[#1f1f25] border border-white/10 shadow-xl">
                        <div className="bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] text-[10px] font-black py-1 px-2.5 overflow-hidden whitespace-nowrap flex items-center justify-between">
                          <span>🔥 Summer Sale — 25% OFF</span>
                          <span className="text-[9px] bg-black/20 px-1 rounded font-mono">SAVE25</span>
                        </div>
                        <div className="p-3 space-y-1.5 opacity-60">
                          <div className="h-1.5 bg-white/30 rounded w-3/4" />
                          <div className="h-1 bg-white/15 rounded w-1/2" />
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#ffc21a] bg-[#ffc21a]/10 border border-[#ffc21a]/20 px-3 py-0.5 rounded-full mt-3 flex items-center gap-1">
                        <Megaphone className="w-3 h-3" />
                        <span>Bars &amp; Modal Popups</span>
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                            Ready
                          </span>
                          <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                            12 Pro presets
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Promotions &amp; Conversion
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                            <Megaphone className="w-4 h-4" />
                          </span>
                          <span>Announcement &amp; Popup</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Top/bottom notification strips &amp; modal popups with live countdown, exit-intent triggers, discount codes and scheduling.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Sticky bars
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Exit-intent popups
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Countdown timer
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Coupon copy
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => navigate({ to: "/dashboard/widgets/create" as any, search: { type: "announcement_popup" } as any })}
                          className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Choose widget</span>
                          <span className="text-sm">→</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate({ to: "/dashboard/widgets/create" as any, search: { type: "announcement_popup" } as any })}
                          className="w-10 h-10 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {/* 6. Instagram Feed (Coming soon) */}
                {filterMatches("media", "instagram feed") && (
                  <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-white/20 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                    {/* Preview Box */}
                    <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(217,70,239,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#f58529] to-[#dd2a7b]" />
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#8134af] to-[#515bd4]" />
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#feda77] to-[#f58529]" />
                      </div>
                      <span className="absolute text-2xl text-pink-500 animate-ping">♥</span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a]" />
                            Coming soon
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#6b6b74]">
                            <span className="w-14 h-1 rounded-full bg-white/10 overflow-hidden block">
                              <span className="w-[15%] h-full bg-gradient-to-r from-[#ff9f0a] to-[#ffc21a] block" />
                            </span>
                            15%
                          </span>
                        </div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                          Social Media
                        </p>
                        <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                          <span className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="5" />
                              <circle cx="12" cy="12" r="4" />
                            </svg>
                          </span>
                          <span>Instagram Feed</span>
                        </h3>
                        <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                          Embed a beautiful, auto-updating Instagram grid or slider that keeps your site fresh with every post.
                        </p>
                        <ul className="flex flex-wrap gap-1.5 mb-2">
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Auto refresh
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Grid &amp; slider
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Lightbox
                          </li>
                          <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                            ✓ Shoppable posts
                          </li>
                        </ul>
                      </div>

                      {/* Card Foot */}
                      <div className="pt-4 mt-2 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={() => toast.success("We'll notify you as soon as Instagram Feed is released!")}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-white font-bold text-xs transition cursor-pointer"
                        >
                          🔔 Notify me when ready
                        </button>
                      </div>
                    </div>
                  </article>
                )}
              </div>
            </section>
          )}

          {/* ================= ACTIVE VIEW ================= */}
          {viewMode === "active" && (
            <section className="space-y-4">
              <div className="rounded-2xl bg-[#151518] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="flex items-center justify-between gap-4 p-5 border-b border-white/[0.07]">
                  <div>
                    <h2 className="text-lg font-bold text-white">My active widgets</h2>
                    <p className="text-xs text-[#9a9aa3]">Widgets currently embedded on your websites.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode("catalog")}
                    className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md transition cursor-pointer"
                  >
                    + Add widget
                  </button>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-[#9a9aa3]">
                    <div className="w-8 h-8 border-2 border-[#ffc21a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading your widgets…
                  </div>
                ) : widgets.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <p className="text-sm text-[#9a9aa3]">
                      You don&apos;t have any widgets yet. Create one from the catalog to see it here!
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode("catalog")}
                      className="py-2 px-4 rounded-xl bg-[#ffc21a] text-[#1a1400] font-bold text-xs inline-flex cursor-pointer"
                    >
                      Browse Widget Catalog →
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[11px] font-bold uppercase tracking-wider text-[#6b6b74]">
                          <th className="py-3 px-5">Widget</th>
                          <th className="py-3 px-5">Website / ID</th>
                          <th className="py-3 px-5">Views</th>
                          <th className="py-3 px-5">Status</th>
                          <th className="py-3 px-5">Active</th>
                          <th className="py-3 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {widgets.map((w, idx) => {
                          const isCountdown = w.type === "countdown";
                          const isAnnouncement = w.type === "announcement_popup";
                          const isFaq = w.type === "faq_accordion";
                          const isPublished = w.status === "published";
                          const isEnabled = w.enabled !== false;
                          const viewsCount = 1200 + ((idx * 840) % 5000);
                          const studioRoute = isCountdown
                            ? `/dashboard/widgets/countdown/${w.id}`
                            : isAnnouncement
                            ? `/dashboard/widgets/announcement-popup/${w.id}`
                            : isFaq
                            ? `/dashboard/widgets/faq-accordion/${w.id}`
                            : `/dashboard/widgets/google-reviews/${w.id}`;

                          return (
                            <tr key={w.id} className="hover:bg-white/[0.02] transition">
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#ffc21a]/10 border border-[#ffc21a]/20 flex items-center justify-center shrink-0 text-[#ffc21a]">
                                    {isCountdown ? (
                                      <Clock className="w-4 h-4" />
                                    ) : isAnnouncement ? (
                                      <Megaphone className="w-4 h-4" />
                                    ) : isFaq ? (
                                      <HelpCircle className="w-4 h-4 text-sky-400" />
                                    ) : (
                                      <GoogleIcon className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div>
                                    <strong className="block text-sm font-bold text-white leading-tight">
                                      {w.name}
                                    </strong>
                                    <small className="block text-[11px] text-[#6b6b74] leading-tight">
                                      {isCountdown
                                        ? "Countdown Timer"
                                        : isAnnouncement
                                        ? "Announcement & Popup"
                                        : isFaq
                                        ? "FAQ Accordion"
                                        : "Google Reviews"}
                                    </small>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-5 font-mono text-[11px] text-[#9a9aa3]">
                                {w.id}
                              </td>

                              <td className="py-3.5 px-5 font-bold text-white">
                                {viewsCount.toLocaleString()}
                              </td>

                              <td className="py-3.5 px-5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    isPublished
                                      ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25"
                                      : "bg-white/[0.06] text-[#9a9aa3]"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isPublished ? "bg-[#22c55e]" : "bg-[#9a9aa3]"
                                    }`}
                                  />
                                  {isPublished ? "Live" : "Draft"}
                                </span>
                              </td>

                              {/* Turn ON/OFF Switch */}
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isEnabled}
                                    onClick={() => handleToggleWidgetActive(w)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                      isEnabled ? "bg-[#22c55e]" : "bg-zinc-700"
                                    }`}
                                    title={
                                      isEnabled
                                        ? "Turn Off (Hides this widget everywhere)"
                                        : "Turn On (Enables this widget everywhere)"
                                    }
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                        isEnabled ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </button>
                                  <span
                                    className={`text-[11px] font-extrabold ${
                                      isEnabled ? "text-[#22c55e]" : "text-zinc-500"
                                    }`}
                                  >
                                    {isEnabled ? "ON" : "OFF"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-5 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setEmbedModalWidget(w)}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#1f1f25] hover:bg-[#282830] border border-white/10 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Code2 className="w-3.5 h-3.5 text-[#ffc21a]" />
                                    <span>Embed</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => navigate({ to: studioRoute as any })}
                                    className="p-1.5 rounded-lg bg-[#ffc21a] hover:bg-[#ffc21a]/90 text-[#1a1400] transition cursor-pointer"
                                    title="Edit in Studio"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDuplicate(w.id)}
                                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#9a9aa3] hover:text-white transition cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(w.id, w.name)}
                                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/10 text-[#9a9aa3] hover:text-red-400 transition cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* ================= EMBED CODE MODAL ================= */}
      {embedModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#111114] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">

            {/* Glow accent bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffc21a]/60 to-transparent" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
              <button
                type="button"
                className="absolute top-5 right-5 p-2 rounded-xl text-[#9a9aa3] hover:text-white hover:bg-white/[0.07] transition cursor-pointer"
                onClick={() => setEmbedModalWidget(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffc21a]/20 to-[#ff9f0a]/10 border border-[#ffc21a]/25 flex items-center justify-center text-[#ffc21a] shadow-lg shadow-[#ffc21a]/10">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Embed your widget</h3>
                  <p className="text-sm text-[#9a9aa3] mt-0.5">Drop one snippet — works everywhere.</p>
                </div>
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-2 mt-1">
                {["WordPress", "Shopify", "Webflow", "Wix", "Custom HTML"].map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[11px] font-semibold text-[#9a9aa3]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Code block */}
            <div className="px-8 py-6">
              <div className="relative group rounded-2xl bg-[#0a0a0c] border border-white/[0.07] overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#9a9aa3]/60 tracking-widest uppercase">HTML Snippet</span>
                  <div className="w-16" />
                </div>

                {/* Code content */}
                <pre className="px-6 py-5 overflow-x-auto text-sm font-mono text-[#a8d8a8] leading-7 whitespace-pre-wrap break-all">
                  <code>{embedCodeString}</code>
                </pre>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-8 pb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={copyEmbedCode}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-sm shadow-lg shadow-[#ffc21a]/20 hover:shadow-[#ffc21a]/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? "Copied!" : "Copy code"}</span>
              </button>
              <button
                type="button"
                onClick={() => setEmbedModalWidget(null)}
                className="py-3.5 px-6 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white font-bold text-sm hover:bg-white/[0.09] active:scale-[0.98] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#151518] border border-white/10 shadow-2xl shadow-black/80 transform scale-100 transition-all">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9a9aa3] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              onClick={() => !isDeleting && setDeletingWidget(null)}
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Header */}
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400 shadow-lg shadow-red-500/5">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Modal Content */}
            <h3 className="text-lg font-black text-white tracking-tight">Delete Widget</h3>
            <p className="text-xs text-[#9a9aa3] mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{deletingWidget.name}&quot;</span>?
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
              This action cannot be undone. Any live site embedding this widget will no longer display it.
            </p>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingWidget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:bg-[#282830] transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Widget</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
