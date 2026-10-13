import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  createNewGoogleReviewsWidget,
  createNewCountdownWidget,
  createNewAnnouncementPopupWidget,
  createNewFaqWidget,
  saveWidget,
  COUNTDOWN_TEMPLATE_LIST,
  ANNOUNCEMENT_POPUP_TEMPLATE_LIST,
  FAQ_TEMPLATE_LIST,
  type CountdownTemplateItem,
  type AnnouncementPopupTemplateItem,
  type FaqTemplateItem,
} from "@/services/widgetService";
import {
  ArrowLeft,
  Sparkles,
  Star,
  Instagram,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Rocket,
  Gift,
  RotateCcw,
  Check,
  Megaphone,
  Layers,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/widgets/create")({
  component: CreateWidgetTypePage,
});

/** Mini Visual Preview for FAQ Accordion Template Card */
function FaqTemplateCardPreview({ tpl }: { tpl: FaqTemplateItem }) {
  const cfg = tpl.config;
  const colors = cfg.colors;
  const sampleQ = cfg.items[0]?.question || "How does it work?";
  const sampleA = cfg.items[0]?.answer || "Everything is automated and customizable.";
  const secondQ = cfg.items[1]?.question || "Can I customize the design?";

  return (
    <div
      className="p-3.5 rounded-xl border relative overflow-hidden transition-all flex flex-col justify-center min-h-[140px] text-left select-none"
      style={{
        backgroundColor: colors.widgetBg || "#18181b",
        borderColor: colors.borderColor || "#27272a",
        fontFamily: cfg.typography.fontFamily || "inherit",
      }}
    >
      {cfg.layout.showHeader && cfg.content.heading && (
        <div
          className="text-xs font-bold mb-2 truncate"
          style={{ color: colors.headingColor || "#ffffff" }}
        >
          {cfg.content.heading}
        </div>
      )}

      {/* Item 1 - Open */}
      <div
        className="rounded-lg p-2.5 mb-2 border transition-all"
        style={{
          backgroundColor: colors.expandedRowBg || "#27272a",
          borderColor: colors.borderColor || "#3f3f46",
          borderRadius: `${cfg.appearance?.borderRadius || cfg.layout?.borderRadius || 8}px`,
        }}
      >
        <div className="flex items-center justify-between text-[11px] font-bold" style={{ color: colors.questionColor || "#ffffff" }}>
          <span className="truncate pr-2">{sampleQ}</span>
          <span className="shrink-0 text-[10px] text-amber-400 font-bold">−</span>
        </div>
        <div className="text-[10px] mt-1 line-clamp-1 leading-snug" style={{ color: colors.answerColor || "#a1a1aa" }}>
          {sampleA}
        </div>
      </div>

      {/* Item 2 - Closed */}
      <div
        className="rounded-lg px-2.5 py-1.5 border transition-all flex items-center justify-between"
        style={{
          backgroundColor: colors.rowBg || "transparent",
          borderColor: colors.borderColor || "#27272a",
          borderRadius: `${cfg.appearance?.borderRadius || cfg.layout?.borderRadius || 8}px`,
        }}
      >
        <span className="text-[11px] font-semibold truncate pr-2" style={{ color: colors.questionColor || "#d4d4d8" }}>
          {secondQ}
        </span>
        <span className="shrink-0 text-[10px] text-zinc-400 font-bold">+</span>
      </div>
    </div>
  );
}

/** Mini Visual Preview for Countdown Template Card */
function TemplateCardPreview({ tpl }: { tpl: CountdownTemplateItem }) {
  const cfg = tpl.config;
  const colors = cfg.colors;
  const isMinimal = cfg.timerStyle === "minimal";
  const isFlip = cfg.timerStyle === "flip";

  return (
    <div
      className="p-4 rounded-xl border relative overflow-hidden transition-all flex flex-col items-center justify-center min-h-[140px] text-center"
      style={{
        backgroundColor: colors.background || "#18181b",
        borderColor: colors.cardBorder || "#3f3f46",
      }}
    >
      {/* Badge */}
      {cfg.showBadge && cfg.badgeText && (
        <div
          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 shadow-sm"
          style={{
            backgroundColor: colors.badgeBackground || "#ef4444",
            color: colors.badgeText || "#ffffff",
          }}
        >
          {cfg.badgeIcon === "fire" && <Flame className="w-2.5 h-2.5" />}
          {cfg.badgeIcon === "zap" && <Zap className="w-2.5 h-2.5" />}
          {cfg.badgeIcon === "rocket" && <Rocket className="w-2.5 h-2.5" />}
          {cfg.badgeIcon === "gift" && <Gift className="w-2.5 h-2.5" />}
          <span>{cfg.badgeText.length > 24 ? cfg.badgeText.slice(0, 22) + "…" : cfg.badgeText}</span>
        </div>
      )}

      {/* Heading */}
      <div
        className="text-xs font-bold truncate max-w-[220px] mb-2"
        style={{ color: colors.text || "#ffffff" }}
      >
        {cfg.heading}
      </div>

      {/* Digits Display */}
      <div className="flex items-center gap-1.5 my-1">
        {cfg.showDays && (
          <div
            className={`px-2 py-1 rounded text-xs font-mono font-bold ${
              isFlip ? "border border-zinc-700 shadow-inner" : ""
            }`}
            style={{
              backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
              color: colors.numberColor || "#facc15",
            }}
          >
            02<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelDays || "d"}</span>
          </div>
        )}
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            isFlip ? "border border-zinc-700 shadow-inner" : ""
          }`}
          style={{
            backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
            color: colors.numberColor || "#facc15",
          }}
        >
          14<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelHours || "h"}</span>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            isFlip ? "border border-zinc-700 shadow-inner" : ""
          }`}
          style={{
            backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
            color: colors.numberColor || "#facc15",
          }}
        >
          35<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelMinutes || "m"}</span>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            isFlip ? "border border-zinc-700 shadow-inner" : ""
          }`}
          style={{
            backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
            color: colors.numberColor || "#facc15",
          }}
        >
          48<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelSeconds || "s"}</span>
        </div>
      </div>

      {/* CTA Button */}
      {cfg.showCTA && (
        <div
          className="mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm"
          style={{
            backgroundColor: colors.buttonBackground || "#facc15",
            color: colors.buttonText || "#000000",
          }}
        >
          {cfg.ctaText}
        </div>
      )}
    </div>
  );
}

function CreateWidgetTypePage() {
  const navigate = useNavigate();

  // Check if URL specifies ?type=countdown or ?type=google_reviews or ?type=announcement_popup
  const searchParamType =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("type")
      : null;

  const initialView =
    searchParamType === "countdown"
      ? "countdown_templates"
      : searchParamType === "announcement_popup"
      ? "announcement_templates"
      : searchParamType === "faq_accordion"
      ? "faq_templates"
      : "choose";

  const [view, setView] = useState<
    "choose" | "countdown_templates" | "google_reviews" | "announcement_templates" | "faq_templates"
  >(initialView);
  const [selectedType, setSelectedType] = useState<
    "google_reviews" | "countdown" | "announcement_popup" | "faq_accordion" | "instagram"
  >("faq_accordion");
  const [widgetName, setWidgetName] = useState("My Google Reviews");
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [announcementFilter, setAnnouncementFilter] = useState<"all" | "bar" | "popup">("all");

  // Create Google Reviews
  const handleCreateGoogleReviews = async () => {
    setCreatingId("google");
    try {
      const newWidget = createNewGoogleReviewsWidget(widgetName.trim() || "My Google Reviews");
      await saveWidget(newWidget);
      toast.success("Widget created!");
      navigate({ to: `/dashboard/widgets/google-reviews/${newWidget.id}` as any });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create widget");
      setCreatingId(null);
    }
  };

  // Create Countdown Widget from selected template
  const handleSelectCountdownTemplate = async (tpl: CountdownTemplateItem) => {
    setCreatingId(tpl.key);
    try {
      const newWidget = createNewCountdownWidget(tpl.name, tpl.key);
      await saveWidget(newWidget);
      toast.success(`${tpl.name} created! Opening Widget Studio…`);
      navigate({
        to: "/dashboard/widgets/countdown/$widgetId",
        params: { widgetId: newWidget.id },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create countdown widget");
      setCreatingId(null);
    }
  };

  // Create Announcement & Popup Widget from selected template
  const handleSelectAnnouncementTemplate = async (tpl: AnnouncementPopupTemplateItem) => {
    setCreatingId(tpl.key);
    try {
      const newWidget = createNewAnnouncementPopupWidget(tpl.name, tpl.key, tpl.displayMode);
      await saveWidget(newWidget);
      toast.success(`${tpl.name} created! Opening Widget Studio…`);
      navigate({
        to: "/dashboard/widgets/announcement-popup/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create announcement widget");
      setCreatingId(null);
    }
  };

  // Create FAQ Accordion Widget from selected template
  const handleSelectFaqTemplate = async (tpl: FaqTemplateItem) => {
    setCreatingId(tpl.key);
    try {
      const newWidget = createNewFaqWidget(tpl.name, tpl.key);
      await saveWidget(newWidget);
      toast.success(`${tpl.name} created! Opening FAQ Studio…`);
      navigate({
        to: "/dashboard/widgets/faq-accordion/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create FAQ widget");
      setCreatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] text-zinc-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ================= STEP 2: COUNTDOWN TEMPLATES SELECTION SCREEN ================= */}
        {view === "countdown_templates" ? (
          <div className="space-y-6">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("choose")}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  title="Back to widget types"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Select Countdown Template</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      10 Pro Presets
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    Choose a professional starter template to open in the Countdown Studio.
                  </p>
                </div>
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {COUNTDOWN_TEMPLATE_LIST.map((tpl) => {
                const isCreatingThis = creatingId === tpl.key;
                return (
                  <div
                    key={tpl.key}
                    className="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:shadow-amber-500/5 group"
                  >
                    {/* Visual Preview */}
                    <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80">
                      <TemplateCardPreview tpl={tpl} />
                    </div>

                    {/* Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                            {tpl.name}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700/80">
                            {tpl.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Use Template Action */}
                      <button
                        type="button"
                        onClick={() => handleSelectCountdownTemplate(tpl)}
                        disabled={isCreatingThis}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 active:scale-98 disabled:opacity-50"
                      >
                        <span>{isCreatingThis ? "Creating Widget…" : "Use Template"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : view === "announcement_templates" ? (
          <div className="space-y-6">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("choose")}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  title="Back to widget types"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Select Announcement &amp; Popup Template</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      12 Pro Presets
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    Choose a ready-made Announcement Bar or Popup Modal template to customize in the visual Studio.
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAnnouncementFilter("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    announcementFilter === "all" ? "bg-zinc-800 text-amber-300 shadow" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  All (12)
                </button>
                <button
                  type="button"
                  onClick={() => setAnnouncementFilter("bar")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    announcementFilter === "bar" ? "bg-zinc-800 text-amber-300 shadow" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Bars (6)
                </button>
                <button
                  type="button"
                  onClick={() => setAnnouncementFilter("popup")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    announcementFilter === "popup" ? "bg-zinc-800 text-amber-300 shadow" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Popups (6)
                </button>
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ANNOUNCEMENT_POPUP_TEMPLATE_LIST.filter((tpl) => {
                if (announcementFilter === "bar") return tpl.displayMode === "bar";
                if (announcementFilter === "popup") return tpl.displayMode === "popup";
                return true;
              }).map((tpl) => {
                const isCreatingThis = creatingId === tpl.key;
                const cfg = tpl.config;
                return (
                  <div
                    key={tpl.key}
                    className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-amber-400/80 transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tpl.displayMode === "bar"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {tpl.displayMode === "bar" ? "Announcement Bar" : "Popup Modal"}
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">{tpl.badge}</span>
                      </div>

                      {/* Mini Live Preview Box */}
                      <div
                        className="p-3.5 rounded-xl border flex flex-col items-center justify-center min-h-[120px] text-center relative overflow-hidden"
                        style={{
                          backgroundColor: cfg.colors?.background || "#18181b",
                          borderColor: cfg.colors?.borderColor || "#3f3f46",
                        }}
                      >
                        {cfg.showBadge && cfg.badgeText && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mb-1.5 flex items-center gap-1"
                            style={{
                              backgroundColor: cfg.colors?.badgeBg || "#ef4444",
                              color: cfg.colors?.badgeText || "#ffffff",
                            }}
                          >
                            {cfg.badgeText}
                          </span>
                        )}
                        <div
                          className="text-xs font-bold line-clamp-2 mb-1 px-2"
                          style={{ color: cfg.colors?.headingColor || "#ffffff" }}
                        >
                          {cfg.headline}
                        </div>
                        {cfg.description && (
                          <div
                            className="text-[10px] opacity-70 line-clamp-2 max-w-[220px]"
                            style={{ color: cfg.colors?.textColor || "#a1a1aa" }}
                          >
                            {cfg.description}
                          </div>
                        )}
                        {cfg.primaryButton?.show && (
                          <div
                            className="mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold"
                            style={{
                              backgroundColor: cfg.colors?.primaryBtnBg || "#facc15",
                              color: cfg.colors?.primaryBtnText || "#000000",
                            }}
                          >
                            {cfg.primaryButton.text}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {tpl.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => handleSelectAnnouncementTemplate(tpl)}
                        disabled={isCreatingThis}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 active:scale-98 disabled:opacity-50"
                      >
                        <span>{isCreatingThis ? "Creating Widget…" : "Use Template"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : view === "faq_templates" ? (
          <div className="space-y-6">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("choose")}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  title="Back to widget types"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Select FAQ Accordion Template</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      8 Pro Presets
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    Choose a ready-made FAQ layout to customize questions, answers, colors, and behavior in the Studio.
                  </p>
                </div>
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FAQ_TEMPLATE_LIST.map((tpl) => {
                const isCreatingThis = creatingId === tpl.key;
                return (
                  <div
                    key={tpl.key}
                    className="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:shadow-amber-500/5 group"
                  >
                    {/* Visual Preview */}
                    <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80">
                      <FaqTemplateCardPreview tpl={tpl} />
                    </div>

                    {/* Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                            {tpl.name}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700/80">
                            {tpl.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Use Template Action */}
                      <button
                        type="button"
                        onClick={() => handleSelectFaqTemplate(tpl)}
                        disabled={isCreatingThis}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 active:scale-98 disabled:opacity-50"
                      >
                        <span>{isCreatingThis ? "Creating Widget…" : "Use Template"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= STEP 1: CHOOSE WIDGET TYPE SCREEN ================= */
          <div className="space-y-8">
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/widgets" as any })}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Choose Widget Type</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Select a widget to configure and embed on your website.</p>
              </div>
            </div>

            {/* Widget Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* FAQ Accordion Card (NEW & Ready to Deploy) */}
              <div
                onClick={() => {
                  setSelectedType("faq_accordion");
                  setView("faq_templates");
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedType === "faq_accordion"
                    ? "bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/5"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-2 shadow-md flex items-center justify-center text-white">
                      <HelpCircle className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ready to Deploy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      FAQ Accordion
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      Interactive question and answer accordions. Expand vertically, 8 ready-made templates, live keyword search, categories, and Schema.org FAQPage structured data.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800 flex items-center justify-between text-xs text-amber-300 font-semibold">
                  <span>8 Pro Templates &amp; Studio</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* 1. Announcement & Popup Card */}
              <div
                onClick={() => {
                  setSelectedType("announcement_popup");
                  setView("announcement_templates");
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedType === "announcement_popup"
                    ? "bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/5"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-2 shadow-md flex items-center justify-center text-black">
                      <Megaphone className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ready to Deploy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      Announcement &amp; Popup
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      Elfsight-style notification bars and modal popups. Top/bottom sticky bars, exit-intent modals, promo discount offers, countdown tickers, and customizable trigger rules.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800 flex items-center justify-between text-xs text-amber-300 font-semibold">
                  <span>12 Pro Templates &amp; Studio</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* 2. Countdown Timer Card (Active & Upgraded) */}
              <div
                onClick={() => {
                  setSelectedType("countdown");
                  setView("countdown_templates");
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedType === "countdown"
                    ? "bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/5"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-2 shadow-md flex items-center justify-center text-black">
                      <Clock className="w-7 h-7" />
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ready to Deploy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      Countdown Timer
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      Drive sales, urgency, and conversions with dynamic countdowns. Supports Date deadlines, Evergreen visitor timers, Number counters, Sticky bars, Flip clocks, and customizable expiry actions.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800 flex items-center justify-between text-xs text-amber-300 font-semibold">
                  <span>10 Pro Templates &amp; Live Studio</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* 2. Google Reviews Card (Primary) */}
              <div
                onClick={() => {
                  setSelectedType("google_reviews");
                  setView("google_reviews");
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  selectedType === "google_reviews"
                    ? "bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20 shadow-xl shadow-amber-500/5"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-sm flex items-center justify-center">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/>
                        <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"/>
                        <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"/>
                        <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z" fill="#EA4335"/>
                      </svg>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ready to Deploy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      Google Reviews
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      Display verified real-time testimonials from Google Business. Supports Carousel, Grid, Masonry, and Badge layouts with automatic rating calculations and embed script generation.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800 flex items-center justify-between text-xs text-amber-300 font-semibold">
                  <span>Dynamic Studio & Standalone Embed</span>
                  <CheckCircle2 className={`w-5 h-5 ${selectedType === "google_reviews" ? "text-amber-400" : "text-zinc-600"}`} />
                </div>
              </div>

              {/* 3. Instagram Feed (Coming Soon) */}
              <div
                onClick={() => toast.info("Instagram Feed is in development and coming soon!")}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 opacity-70 hover:opacity-90 cursor-not-allowed flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-2 shadow-sm flex items-center justify-center text-white">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                      Coming Soon
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">Instagram Feed</h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      Embed live posts, reels, and stories from your Instagram profile with responsive grid and carousel sliders.
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800 text-xs text-zinc-500 font-medium">
                  In Development
                </div>
              </div>
            </div>

            {/* Google Reviews Details Box */}
            {view === "google_reviews" && (
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 max-w-xl">
                <h4 className="font-semibold text-white text-sm">Google Reviews Widget Details</h4>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Widget Name</label>
                  <input
                    type="text"
                    value={widgetName}
                    onChange={(e) => setWidgetName(e.target.value)}
                    placeholder="e.g. My Business Reviews"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCreateGoogleReviews}
                  disabled={creatingId !== null}
                  className="w-full py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-98 disabled:opacity-50"
                >
                  <span>{creatingId ? "Creating Widget…" : "Open Widget Studio"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
