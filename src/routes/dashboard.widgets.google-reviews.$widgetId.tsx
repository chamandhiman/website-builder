import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { nanoid } from "nanoid";
import {
  getWidget,
  saveWidget,
  publishWidget,
  searchGoogleBusinesses,
  fetchReviewsForBusiness,
  getGooglePlacesApiKey,
  testGooglePlacesApiKey,
  type WidgetInstanceRecord,
  type GoogleReviewsConfig,
  type GoogleReviewItem,
  type GoogleBusinessSearchResult,
  TEMPLATE_PRESETS,
} from "@/services/widgetService";
import {
  renderGoogleReviewsHtml,
  attachWidgetInteractivity,
} from "@/lib/widget-runtime/wtoWidgetRuntime";
import {
  ArrowLeft,
  Search,
  Check,
  Star,
  Sliders,
  Layers,
  Palette,
  Settings,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ExternalLink,
  Code2,
  CheckCircle2,
  ChevronRight,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  MapPin,
  Globe,
  HelpCircle,
  ArrowRight,
  Key,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/widgets/google-reviews/$widgetId")({
  component: GoogleReviewsStudioPage,
});

/** Modern SaaS ON/OFF Toggle Switch */
function StudioSwitch({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between py-2 px-1 cursor-pointer select-none group rounded-lg hover:bg-zinc-800/40 transition-colors"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div className="pr-3">
        <span className="text-zinc-200 group-hover:text-white font-medium text-xs transition-colors">
          {label}
        </span>
        {description && <p className="text-[10px] text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-bold tracking-wider uppercase transition-colors ${
            checked ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-amber-400/50 ${
            checked ? "bg-amber-400" : "bg-zinc-700"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onChange(!checked);
          }}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow-md ring-0 transition duration-200 ease-in-out ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function GoogleReviewsStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/google-reviews/$widgetId" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Studio tabs: "template" | "source" | "reviews" | "layout" | "header" | "review" | "style" | "settings"
  const [activeTab, setActiveTab] = useState<string>("template");

  // Device preview state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Source search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleBusinessSearchResult[]>([]);

  // Google Places API integration state
  const [customApiKey, setCustomApiKey] = useState(() => getGooglePlacesApiKey());
  const [apiTestStatus, setApiTestStatus] = useState<{ checked: boolean; ok?: boolean; message?: string; blocked?: boolean } | null>(null);
  const [testingApi, setTestingApi] = useState(false);
  const [refreshingReviews, setRefreshingReviews] = useState(false);

  // Add Real Customer Review Form Modal
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTime, setNewTime] = useState("Recent review");
  const [newText, setNewText] = useState("");

  // Preview container ref for interactive carousel handlers
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getWidget(widgetId);
        if (data) {
          // If this widget previously held fabricated "Alex Morgan" dummy reviews, purge and reload authentic reviews
          if (
            data.selectedReviews?.some(
              (r) => r.authorName === "Alex Morgan" && r.text?.includes("Outstanding experience with")
            )
          ) {
            const refreshed = await fetchReviewsForBusiness({
              placeId: data.source?.placeId || "ChIJj61dQgK6j4AR4GeTYWZsKWw",
              name: data.source?.businessName || "Google LLC (Googleplex)",
              address: data.source?.address,
            });
            data.selectedReviews = refreshed.reviews;
            data.allReviews = refreshed.reviews;
            data.source = refreshed.source;
            await saveWidget(data);
          }
          setWidget(data);
        } else {
          toast.error("Widget not found");
          navigate({ to: "/dashboard/widgets" as any });
        }
      } catch (err) {
        toast.error("Error loading widget");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [widgetId, navigate]);

  // Handle Search Businesses
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchGoogleBusinesses(searchQuery);
      setSearchResults(results);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  // Helper to update draft state
  const updateDraft = (partial: Partial<WidgetInstanceRecord>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...partial,
        status: "draft",
      };
    });
  };

  const updateConfig = (sectionKey: keyof GoogleReviewsConfig, partial: any) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      const currentSec = (prev.config as any)[sectionKey] || {};
      return {
        ...prev,
        status: "draft",
        config: {
          ...prev.config,
          [sectionKey]: {
            ...currentSec,
            ...partial,
          },
        },
      };
    });
  };

  // Select a business from search results: fetches authentic reviews and updates draft
  const handleSelectBusiness = async (res: GoogleBusinessSearchResult) => {
    if (!widget) return;
    toast.loading(`Connecting to "${res.name}" and retrieving reviews…`, { id: "fetch-reviews" });
    try {
      const result = await fetchReviewsForBusiness(res);
      setWidget((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "draft",
          source: result.source,
          selectedReviews: result.reviews,
          allReviews: result.reviews,
        };
      });
      setSearchResults([]);
      setSearchQuery("");
      toast.success(
        `Connected to "${res.name}" (${result.reviews.length} reviews loaded)`,
        { id: "fetch-reviews" }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews for selected business", { id: "fetch-reviews" });
    }
  };

  // Refresh reviews directly from connected business source
  const handleRefreshReviews = async () => {
    if (!widget || !widget.source?.businessName) return;
    setRefreshingReviews(true);
    toast.loading("Refreshing authentic reviews…", { id: "sync-reviews" });
    try {
      const result = await fetchReviewsForBusiness({
        placeId: widget.source.placeId || "",
        name: widget.source.businessName,
        address: widget.source.address,
      });
      updateDraft({
        source: result.source,
        selectedReviews: result.reviews,
        allReviews: result.reviews,
      });
      toast.success(`Reviews refreshed! (${result.reviews.length} reviews loaded)`, { id: "sync-reviews" });
    } catch (err) {
      toast.error("Failed to refresh reviews", { id: "sync-reviews" });
    } finally {
      setRefreshingReviews(false);
    }
  };

  // Delete a review
  const handleDeleteReview = (reviewId: string) => {
    if (!widget) return;
    const nextAll = (widget.allReviews || widget.selectedReviews || []).filter((r) => r.id !== reviewId);
    const nextSelected = widget.selectedReviews.filter((r) => r.id !== reviewId);
    updateDraft({
      allReviews: nextAll,
      selectedReviews: nextSelected,
    });
    toast.success("Review deleted");
  };

  // Add custom real customer review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!widget) return;
    if (!newAuthorName.trim() || !newText.trim()) {
      toast.error("Please enter both reviewer name and review text");
      return;
    }
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ea580c", "#ec4899", "#f59e0b"];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];
    const newRev: GoogleReviewItem = {
      id: `rev-${nanoid(8)}`,
      authorName: newAuthorName.trim(),
      authorInitials: newAuthorName.trim().slice(0, 2).toUpperCase(),
      avatarBgColor: randomBg,
      rating: Number(newRating) || 5,
      relativeTimeDescription: newTime.trim() || "Recent review",
      text: newText.trim(),
      verified: true,
      source: "google",
    };

    const nextAll = [newRev, ...(widget.allReviews || widget.selectedReviews || [])];
    const nextSelected = [newRev, ...widget.selectedReviews];

    updateDraft({
      allReviews: nextAll,
      selectedReviews: nextSelected,
    });

    setNewAuthorName("");
    setNewText("");
    setNewTime("Recent review");
    setNewRating(5);
    setShowAddReviewModal(false);
    toast.success("Customer review added!");
  };

  // Test and Save Google Places API Key
  const handleTestAndSaveApiKey = async () => {
    setTestingApi(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("wto_google_places_api_key", customApiKey.trim());
      }
      const res = await testGooglePlacesApiKey(customApiKey);
      setApiTestStatus({ checked: true, ok: res.ok, message: res.message, blocked: res.blocked });
      if (res.ok) {
        toast.success("Google Places API Key verified & ready!");
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      setApiTestStatus({ checked: true, ok: false, message: err?.message || "Failed to verify key" });
      toast.error("Failed to verify Google Places API Key");
    } finally {
      setTestingApi(false);
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!widget) return;
    setSaving(true);
    try {
      await saveWidget(widget);
      toast.success("Draft saved");
    } catch (err) {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Publish Widget
  const handlePublish = async () => {
    if (!widget) return;
    setPublishing(true);
    try {
      const pub = await publishWidget(widget);
      setWidget(pub);
      toast.success("Widget published successfully!");
      navigate({ to: `/dashboard/widgets/${widget.id}/install` as any });
    } catch (err) {
      toast.error("Failed to publish widget");
    } finally {
      setPublishing(false);
    }
  };

  // Device-aware markup for live preview
  const previewMarkup = useMemo(() => {
    if (!widget) return "";
    return renderGoogleReviewsHtml(widget, { device: previewDevice }).html;
  }, [widget, previewDevice]);

  // Attach carousel interactivity (Prev, Next, Dots, Autoplay, Read More) in preview
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const cleanup = attachWidgetInteractivity(previewContainerRef.current, { previewDevice });
    return cleanup;
  }, [previewMarkup, previewDevice]);

  if (loading || !widget) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading Widget Studio…
      </div>
    );
  }

  const isPublished = widget.status === "published";
  const cfg = widget.config as GoogleReviewsConfig;
  const currentSource = widget.source;
  const allReviewsList = widget.allReviews || widget.selectedReviews || [];

  return (
    <div className="h-screen flex flex-col bg-[#121214] text-zinc-100 overflow-hidden">
      {/* Top Studio Navbar */}
      <header className="h-14 border-b border-zinc-800 bg-[#18181b] px-4 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/widgets" as any })}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition text-xs font-semibold"
            title="Back to Widgets"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Widgets</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{widget.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isPublished
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
              <span>ID: <code className="text-amber-400 font-mono">{widget.id}</code></span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{currentSource?.businessName || "No business connected"}</span>
            </div>
          </div>
        </div>

        {/* Device Switcher (Desktop / Tablet / Mobile) */}
        <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setPreviewDevice("desktop")}
            className={`p-1.5 rounded-md transition-colors ${
              previewDevice === "desktop" ? "bg-amber-400 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("tablet")}
            className={`p-1.5 rounded-md transition-colors ${
              previewDevice === "tablet" ? "bg-amber-400 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("mobile")}
            className={`p-1.5 rounded-md transition-colors ${
              previewDevice === "mobile" ? "bg-amber-400 text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isPublished && (
            <button
              type="button"
              onClick={() => navigate({ to: `/dashboard/widgets/${widget.id}/install` as any })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Install Code</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{publishing ? "Publishing…" : "Publish Widget"}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body: Left Sidebar + Right Live Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Studio Sidebar */}
        <aside className="w-80 md:w-96 border-r border-zinc-800 bg-[#18181b] flex flex-col z-10">
          {/* Studio Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-zinc-800 bg-[#16161b] shrink-0 select-none overflow-hidden">
            {[
              { id: "template", label: "Template", icon: Layers },
              { id: "source", label: "Source", icon: Search },
              { id: "reviews", label: `Reviews (${widget.selectedReviews?.length || 0})`, icon: Star },
              { id: "layout", label: "Layout", icon: Sliders },
              { id: "header", label: "Header", icon: Globe },
              { id: "review", label: "Review", icon: Eye },
              { id: "style", label: "Style", icon: Palette },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`group flex flex-col items-center justify-center py-2.5 px-1 text-center border-b-2 transition cursor-pointer ${
                    isActive
                      ? "border-amber-400 bg-amber-500/10 text-amber-300"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 group-hover:scale-110 ${
                      isActive ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold mt-1 tracking-tight truncate max-w-full leading-none ${
                      isActive ? "text-amber-300 font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Form Controls */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-zinc-300">
            {/* 0. TEMPLATE SELECTION TAB */}
            {activeTab === "template" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Choose Template</h4>
                  <p className="text-zinc-400 text-[11px]">
                    Select a starting visual layout preset for your Google Reviews widget.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "carousel", name: "Carousel", desc: "Interactive multi-card slider with arrows & dots" },
                    { id: "grid", name: "Grid", desc: "Clean responsive multi-column showcase grid" },
                    { id: "list", name: "List", desc: "Vertical stacked full-width review cards" },
                    { id: "masonry", name: "Masonry", desc: "Dynamic masonry cards layout" },
                    { id: "slider", name: "Slider", desc: "Touch-enabled sliding showcase" },
                    { id: "badge", name: "Card / Badge", desc: "Compact Google rating badge" },
                  ].map((tmpl) => {
                    const isSelected = (cfg.template || cfg.layout.type || "carousel") === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          const preset = TEMPLATE_PRESETS[tmpl.id] || {};
                          updateDraft({
                            config: {
                              ...cfg,
                              template: tmpl.id as any,
                              layout: {
                                ...cfg.layout,
                                type: tmpl.id as any,
                                ...(preset.layout || {}),
                              },
                            },
                          });
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-amber-400/10 border-amber-400 ring-1 ring-amber-400/30"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-white text-xs">{tmpl.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">{tmpl.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await handleSaveDraft();
                    setActiveTab("source");
                  }}
                  className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 mt-3"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 1. SOURCE TAB */}
            {activeTab === "source" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Connect Source</h4>
                  <p className="text-zinc-400 text-[11px]">
                    Connect your Google Business profile to retrieve authentic customer reviews.
                  </p>
                </div>

                {/* Connected Business Box */}
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Connected Source</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {widget.selectedReviews?.length || 0} Reviews
                      </span>
                      <button
                        type="button"
                        onClick={handleRefreshReviews}
                        disabled={refreshingReviews}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                        title="Reload real reviews from connected source"
                      >
                        <RefreshCw className={`w-3 h-3 text-amber-400 ${refreshingReviews ? "animate-spin" : ""}`} />
                        <span>Sync</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">{currentSource?.businessName || "No business connected"}</h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{currentSource?.address}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {(currentSource?.overallRating ?? 4.7).toFixed(1)}
                    </span>
                    <span className="text-zinc-400">{currentSource?.totalReviews ?? widget.selectedReviews?.length ?? 0} Total Reviews</span>
                    <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[90px]">
                      {currentSource?.placeId}
                    </span>
                  </div>
                </div>

                {/* Search Box */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Search Business Name, Address or Location
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Google, Google New York, Netsmartz Infotech..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={searching}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg text-xs transition-colors disabled:opacity-50"
                    >
                      {searching ? "…" : "Search"}
                    </button>
                  </div>

                  {/* Popular Verified Business Presets for Fast Testing */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-zinc-500">Quick connect:</span>
                    {["Google", "Google New York", "Netsmartz Infotech", "Apple Park", "The French Laundry"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={async () => {
                          setSearchQuery(preset);
                          setSearching(true);
                          try {
                            const res = await searchGoogleBusinesses(preset);
                            setSearchResults(res);
                          } finally {
                            setSearching(false);
                          }
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-750 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Results List */}
                {searchResults.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-zinc-400 block">Select Location to Connect:</span>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((res) => (
                        <div
                          key={res.placeId}
                          onClick={() => handleSelectBusiness(res)}
                          className="p-3 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-400/50 cursor-pointer transition-all flex items-start justify-between gap-2 group"
                        >
                          <div>
                            <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">{res.name}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">{res.address}</div>
                            <div className="flex items-center gap-2 text-[10px] text-amber-400 mt-1 font-semibold">
                              <span>⭐ {res.rating.toFixed(1)}</span>
                              <span className="text-zinc-500">({res.reviewCount} reviews)</span>
                              {res.reviews?.length > 0 && (
                                <span className="text-emerald-400 text-[10px]">✓ {res.reviews.length} authentic reviews</span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded bg-amber-400/20 group-hover:bg-amber-400 text-amber-300 group-hover:text-black text-[10px] font-bold transition-all shrink-0"
                          >
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Places API Key Configuration Section */}
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Google Places API (Live Integration)</span>
                    </div>
                    {apiTestStatus?.ok ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Connected
                      </span>
                    ) : apiTestStatus?.blocked ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        Needs Activation
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Configure your Google Cloud Places API key to query and import real-time reviews for any registered business worldwide.
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleTestAndSaveApiKey}
                        disabled={testingApi || !customApiKey.trim()}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold rounded-md border border-zinc-700 transition-colors disabled:opacity-50"
                      >
                        {testingApi ? "Verifying…" : "Save & Verify"}
                      </button>
                    </div>

                    {apiTestStatus && (
                      <div
                        className={`p-2.5 rounded-lg text-[11px] leading-relaxed flex items-start gap-2 ${
                          apiTestStatus.ok
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                            : "bg-amber-500/10 border border-amber-500/30 text-amber-200"
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="space-y-1.5">
                          <p>{apiTestStatus.message}</p>
                          {apiTestStatus.blocked && (
                            <a
                              href="https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=1017816701985"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline pt-0.5"
                            >
                              <span>Enable Places API in Google Cloud Console</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">Review Selection</h4>
                    <p className="text-[11px] text-zinc-400">
                      {widget.selectedReviews.length} of {allReviewsList.length} reviews selected
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReviewModal((prev) => !prev)}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-bold transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Review</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDraft({ selectedReviews: [...allReviewsList] })}
                      className="text-[10px] font-semibold text-amber-400 hover:text-amber-300"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDraft({ selectedReviews: [] })}
                      className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-400"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Add Review Inline Form */}
                {showAddReviewModal && (
                  <form onSubmit={handleAddReview} className="p-3.5 rounded-xl bg-zinc-900 border border-amber-400/40 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Customer Review</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddReviewModal(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-300">Customer Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={newAuthorName}
                        onChange={(e) => setNewAuthorName(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-300">Rating (1 to 5) *</label>
                        <div className="flex items-center gap-1 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= newRating ? "fill-amber-400 text-amber-400" : "text-zinc-600"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-zinc-300">Date / Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 2 weeks ago"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-300">Review Text *</label>
                      <textarea
                        rows={3}
                        placeholder="Write the customer's feedback here..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-md text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddReviewModal(false)}
                        className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-sm"
                      >
                        Add Review
                      </button>
                    </div>
                  </form>
                )}

                {/* Empty State when no reviews are present */}
                {allReviewsList.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 text-center space-y-3">
                    <Star className="w-8 h-8 text-amber-400/60 mx-auto" />
                    <div>
                      <p className="font-bold text-white text-xs">No reviews attached yet</p>
                      <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto">
                        Connect a verified Google location from the Source tab to load real customer reviews, or click Add Review to input them manually.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddReviewModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs"
                      >
                        + Add Customer Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("source")}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-zinc-700"
                      >
                        Search Business
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allReviewsList.map((rev) => {
                      const isSelected = widget.selectedReviews.some((r) => r.id === rev.id);
                      return (
                        <div
                          key={rev.id}
                          className={`p-3 rounded-xl border transition-all flex items-start gap-3 group relative ${
                            isSelected
                              ? "bg-zinc-900 border-zinc-700 shadow-sm"
                              : "bg-zinc-950/60 border-zinc-850 opacity-60"
                          }`}
                        >
                          <div
                            className="mt-0.5 cursor-pointer"
                            onClick={() => {
                              if (isSelected) {
                                updateDraft({ selectedReviews: widget.selectedReviews.filter((r) => r.id !== rev.id) });
                              } else {
                                updateDraft({ selectedReviews: [...widget.selectedReviews, rev] });
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="accent-amber-400 h-4 w-4 cursor-pointer"
                            />
                          </div>

                          <div
                            className="min-w-0 flex-1 cursor-pointer"
                            onClick={() => {
                              if (isSelected) {
                                updateDraft({ selectedReviews: widget.selectedReviews.filter((r) => r.id !== rev.id) });
                              } else {
                                updateDraft({ selectedReviews: [...widget.selectedReviews, rev] });
                              }
                            }}
                          >
                            <div className="flex items-center justify-between pr-6">
                              <span className="font-bold text-white text-xs">{rev.authorName}</span>
                              <span className="text-amber-400 font-bold text-[10px]">★ {rev.rating}</span>
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{rev.relativeTimeDescription}</div>
                            <p className="text-[11px] text-zinc-300 line-clamp-2 mt-1 leading-relaxed">{rev.text}</p>
                          </div>

                          {/* Delete Review Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReview(rev.id);
                            }}
                            className="text-zinc-600 hover:text-red-400 p-1 rounded transition-colors"
                            title="Delete this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}


            {/* 3. LAYOUT TAB */}
            {activeTab === "layout" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">Choose Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["carousel", "grid", "slider", "list", "masonry", "badge"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const preset = TEMPLATE_PRESETS[type] || {};
                          updateConfig("layout", { ...cfg.layout, type, ...(preset.layout || {}) });
                        }}
                        className={`py-2 px-1 rounded-lg border text-xs font-semibold capitalize transition-all ${
                          cfg.layout.type === type
                            ? "bg-amber-400/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/30"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                    Desktop Columns ({cfg.layout.desktopColumns})
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => updateConfig("layout", { desktopColumns: col })}
                        className={`py-1.5 rounded-lg border font-bold text-xs ${
                          cfg.layout.desktopColumns === col
                            ? "bg-amber-400/20 border-amber-400 text-amber-300"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-zinc-800">
                  <StudioSwitch
                    label="Navigation Arrows"
                    checked={cfg.layout.showArrows !== false}
                    onChange={(val) => updateConfig("layout", { showArrows: val })}
                  />
                  <StudioSwitch
                    label="Pagination Dots"
                    checked={cfg.layout.showDots !== false}
                    onChange={(val) => updateConfig("layout", { showDots: val })}
                  />
                  <StudioSwitch
                    label="Autoplay"
                    checked={Boolean(cfg.layout.autoplay)}
                    onChange={(val) => updateConfig("layout", { autoplay: val })}
                    description="Automatically cycles through slides; pauses on hover"
                  />
                </div>
              </div>
            )}

            {/* 4. HEADER TAB */}
            {activeTab === "header" && (
              <div className="space-y-4">
                <StudioSwitch
                  label="Show Header"
                  checked={cfg.header.showHeader !== false}
                  onChange={(val) => updateConfig("header", { showHeader: val })}
                />

                {cfg.header.showHeader !== false && (
                  <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Widget Title</label>
                      <input
                        type="text"
                        value={cfg.header.title || ""}
                        onChange={(e) => updateConfig("header", { title: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <StudioSwitch
                      label="Show Google Logo"
                      checked={cfg.header.showGoogleLogo !== false}
                      onChange={(val) => updateConfig("header", { showGoogleLogo: val })}
                    />

                    <StudioSwitch
                      label="Show Rating"
                      checked={cfg.header.showRating !== false}
                      onChange={(val) => updateConfig("header", { showRating: val })}
                    />

                    <StudioSwitch
                      label="Show Number of Reviews"
                      checked={cfg.header.showReviewCount !== false}
                      onChange={(val) => updateConfig("header", { showReviewCount: val })}
                    />

                    <StudioSwitch
                      label="Show Write Review Button"
                      checked={cfg.header.showWriteReviewButton !== false}
                      onChange={(val) => updateConfig("header", { showWriteReviewButton: val })}
                    />

                    {cfg.header.showWriteReviewButton !== false && (
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Button Text</label>
                        <input
                          type="text"
                          value={cfg.header.buttonText || "Review us on Google"}
                          onChange={(e) => updateConfig("header", { buttonText: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. REVIEW TAB */}
            {activeTab === "review" && (
              <div className="space-y-1">
                <StudioSwitch
                  label="Show Reviewer Photo"
                  checked={cfg.review.showReviewerPhoto !== false}
                  onChange={(val) => updateConfig("review", { showReviewerPhoto: val })}
                />

                <StudioSwitch
                  label="Show Reviewer Name"
                  checked={cfg.review.showReviewerName !== false}
                  onChange={(val) => updateConfig("review", { showReviewerName: val })}
                />

                <StudioSwitch
                  label="Show Google Icon"
                  checked={cfg.review.showGoogleIcon !== false}
                  onChange={(val) => updateConfig("review", { showGoogleIcon: val })}
                />

                <StudioSwitch
                  label="Show Rating"
                  checked={cfg.review.showRating !== false}
                  onChange={(val) => updateConfig("review", { showRating: val })}
                />

                <StudioSwitch
                  label="Show Verified Badge"
                  checked={cfg.review.showVerifiedBadge !== false}
                  onChange={(val) => updateConfig("review", { showVerifiedBadge: val })}
                />

                <StudioSwitch
                  label="Show Review Date"
                  checked={cfg.review.showReviewDate !== false}
                  onChange={(val) => updateConfig("review", { showReviewDate: val })}
                />

                <StudioSwitch
                  label="Show Read More"
                  checked={cfg.review.showReadMore !== false}
                  onChange={(val) => updateConfig("review", { showReadMore: val })}
                />
              </div>
            )}

            {/* 6. STYLE TAB */}
            {activeTab === "style" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Color Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig("style", {
                          theme: "light",
                          cardBackgroundColor: "#ffffff",
                          textColor: "#1f2937",
                          secondaryTextColor: "#6b7280",
                        })
                      }
                      className={`py-2 rounded-lg border text-xs font-semibold ${
                        cfg.style.theme === "light"
                          ? "bg-zinc-800 border-amber-400 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      Light Theme
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig("style", {
                          theme: "dark",
                          cardBackgroundColor: "#1e293b",
                          textColor: "#f8fafc",
                          secondaryTextColor: "#94a3b8",
                        })
                      }
                      className={`py-2 rounded-lg border text-xs font-semibold ${
                        cfg.style.theme === "dark"
                          ? "bg-zinc-800 border-amber-400 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      Dark Theme
                    </button>
                  </div>
                </div>

                {/* Typography & Font Formatting */}
                <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                  <span className="text-xs font-semibold text-white block">Typography & Fonts</span>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Font Family</label>
                    <select
                      value={cfg.style.fontFamily || "Inter, system-ui, sans-serif"}
                      onChange={(e) => updateConfig("style", { fontFamily: e.target.value })}
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Inter, system-ui, sans-serif">Inter (Modern & Clean)</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Poppins', sans-serif">Poppins (Geometric)</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Playfair Display', serif">Playfair Display (Editorial)</option>
                      <option value="Georgia, serif">Georgia (Classic Serif)</option>
                      <option value="system-ui, -apple-system, sans-serif">System Default</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Card Font Size</span>
                      <span className="font-mono">{cfg.style.fontSize || 14}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="18"
                      value={cfg.style.fontSize || 14}
                      onChange={(e) => updateConfig("style", { fontSize: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Card Text Alignment</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateConfig("style", { textAlign: "left" })}
                        className={`py-1.5 rounded text-xs font-semibold transition ${
                          (cfg.style.textAlign || "left") === "left"
                            ? "bg-amber-400 text-black font-bold"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}
                      >
                        Left Align
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig("style", { textAlign: "center" })}
                        className={`py-1.5 rounded text-xs font-semibold transition ${
                          cfg.style.textAlign === "center"
                            ? "bg-amber-400 text-black font-bold"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}
                      >
                        Center Align
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Star Color</span>
                    <input
                      type="color"
                      value={cfg.style.starColor || "#f59e0b"}
                      onChange={(e) => updateConfig("style", { starColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Accent / Button Color</span>
                    <input
                      type="color"
                      value={cfg.style.accentColor || "#1d4ed8"}
                      onChange={(e) => updateConfig("style", { accentColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Card Background</span>
                    <input
                      type="color"
                      value={cfg.style.cardBackgroundColor || "#ffffff"}
                      onChange={(e) => updateConfig("style", { cardBackgroundColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <StudioSwitch
                  label="Open links in new tab"
                  checked={cfg.settings.openLinksInNewTab !== false}
                  onChange={(val) => updateConfig("settings", { openLinksInNewTab: val })}
                />

                <StudioSwitch
                  label="Hide empty reviews"
                  checked={Boolean(cfg.settings.hideEmptyReviews)}
                  onChange={(val) => updateConfig("settings", { hideEmptyReviews: val })}
                />

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Minimum Rating Filter</label>
                  <select
                    value={cfg.settings.minRating || 0}
                    onChange={(e) => updateConfig("settings", { minRating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-xs"
                  >
                    <option value={0}>Show all ratings</option>
                    <option value={4}>4 Stars & above</option>
                    <option value={5}>5 Stars only</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Live Preview Canvas */}
        <main className="flex-1 bg-[#09090b] flex flex-col items-center justify-center p-6 overflow-auto relative">
          <div
            className="transition-all duration-300 h-full max-h-[820px] w-full bg-transparent flex flex-col items-center justify-center"
            style={{
              maxWidth: previewDevice === "mobile" ? "375px" : previewDevice === "tablet" ? "768px" : "100%",
            }}
          >
            <div className="w-full h-full overflow-y-auto rounded-2xl bg-white/5 border border-zinc-800 shadow-2xl p-6 flex flex-col justify-center">
              <div
                ref={previewContainerRef}
                className="w-full"
                dangerouslySetInnerHTML={{ __html: previewMarkup }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
