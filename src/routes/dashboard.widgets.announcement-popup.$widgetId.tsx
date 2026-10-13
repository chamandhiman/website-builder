import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getWidget,
  saveWidget,
  publishWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  type AnnouncementPopupConfig,
  type AnnouncementBarPosition,
  type AnnouncementBarPositionConfig,
  type PopupTriggerType,
  type PopupFrequencyType,
  ANNOUNCEMENT_POPUP_TEMPLATES,
  ANNOUNCEMENT_POPUP_TEMPLATE_LIST,
  normalizeAnnouncementPopupConfig,
} from "@/services/announcementPopupTemplates";
import {
  renderAnnouncementPopupHtml,
  attachAnnouncementPopupInteractivity,
} from "@/lib/widget-runtime/announcementPopupRuntime";
import {
  ArrowLeft,
  Megaphone,
  Layers,
  Palette,
  Sliders,
  Sparkles,
  Code2,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Monitor,
  Smartphone,
  Eye,
  Type,
  Image,
  Tag,
  Clock,
  Settings,
  X,
  Calendar,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/widgets/announcement-popup/$widgetId")({
  component: AnnouncementPopupStudioPage,
});

/** Modern SaaS Toggle Switch */
function SettingSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
      <div className="pr-3">
        <div className="text-xs font-semibold text-zinc-200">{label}</div>
        {description && <div className="text-[11px] text-zinc-400 mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-amber-400" : "bg-zinc-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0 bg-zinc-300"
          }`}
        />
      </button>
    </div>
  );
}

/** Color Picker Row */
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-850/60 last:border-0">
      <label className="text-xs text-zinc-300 font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded text-zinc-300 focus:outline-none focus:border-amber-400 text-center"
        />
        <input
          type="color"
          value={value.startsWith("#") ? value.slice(0, 7) : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer p-0"
        />
      </div>
    </div>
  );
}

function AnnouncementPopupStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/announcement-popup/$widgetId" });
  const navigate = useNavigate();

  // Widget state
  const [widget, setWidget] = useState<WidgetInstanceRecord<AnnouncementPopupConfig> | null>(null);
  const [config, setConfig] = useState<AnnouncementPopupConfig | null>(null);
  const [widgetName, setWidgetName] = useState("Announcement & Popup");
  const [loading, setLoading] = useState(true);

  // Studio UI state
  const [activeTab, setActiveTab] = useState<"templates" | "content" | "design" | "position" | "rules">("templates");
  const [templateFilter, setTemplateFilter] = useState<"all" | "bar" | "popup">("all");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load widget on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getWidget(widgetId);
        if (mounted && data) {
          setWidget(data as WidgetInstanceRecord<AnnouncementPopupConfig>);
          const rawCfg = data.config || ANNOUNCEMENT_POPUP_TEMPLATES.sale_bar.config;
          setConfig(normalizeAnnouncementPopupConfig(rawCfg));
          setWidgetName(data.name || "Announcement & Popup");
        } else if (mounted) {
          toast.error("Widget not found");
          navigate({ to: "/dashboard/widgets" as any });
        }
      } catch (err) {
        console.error("Error loading widget", err);
        toast.error("Error loading widget");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [widgetId, navigate]);

  // Update config helper
  const updateConfig = (updater: (prev: AnnouncementPopupConfig) => AnnouncementPopupConfig) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const next = updater({ ...prev });
      setHasUnsavedChanges(true);
      return normalizeAnnouncementPopupConfig(next);
    });
  };

  // Embed code
  const embedCode = useMemo(() => {
    return `<div data-wto-widget="${widgetId}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [widgetId]);

  // Live preview HTML & CSS markup
  const renderedOutput = useMemo(() => {
    if (!widget || !config) return { html: "", css: "" };
    const mockWidget: WidgetInstanceRecord<AnnouncementPopupConfig> = {
      ...widget,
      config,
    };
    return renderAnnouncementPopupHtml(mockWidget, {
      device: previewDevice,
      isPreview: true,
    });
  }, [widget, config, previewDevice, previewKey]);

  // Attach preview interactivity
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const previewEl = previewContainerRef.current;

    // Immediately remove any direct orphaned announcement bars or popups left behind from previous renders/hoists
    Array.from(previewEl.children).forEach((child) => {
      if (
        child.classList.contains("wto-announcement-bar-root") ||
        child.classList.contains("wto-announcement-popup-root") ||
        child.classList.contains("wto-popup-backdrop")
      ) {
        child.remove();
      }
    });

    const cleanup = attachAnnouncementPopupInteractivity(previewEl, {
      isPreview: true,
    });
    return cleanup;
  }, [renderedOutput]);

  // Save Draft
  const handleSave = async (publishAfter = false) => {
    if (!widget || !config) return;
    setIsSaving(true);
    try {
      const updated: WidgetInstanceRecord<AnnouncementPopupConfig> = {
        ...widget,
        name: widgetName.trim() || "Announcement & Popup",
        config,
        status: publishAfter ? "published" : widget.status || "draft",
        updatedAt: new Date().toISOString(),
      };
      await saveWidget(updated);
      setWidget(updated);
      setHasUnsavedChanges(false);
      toast.success(publishAfter ? "Widget published successfully!" : "Changes saved to draft!");
      if (publishAfter) {
        setShowEmbedModal(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save widget");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish
  const handlePublish = async () => {
    if (!widget || !config) return;
    setIsPublishing(true);
    try {
      const updated: WidgetInstanceRecord<AnnouncementPopupConfig> = {
        ...widget,
        name: widgetName.trim() || "Announcement & Popup",
        config,
        status: "published",
        updatedAt: new Date().toISOString(),
      };
      await publishWidget(updated);
      setWidget(updated);
      setHasUnsavedChanges(false);
      toast.success("Widget published successfully!");
      setShowEmbedModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish widget");
    } finally {
      setIsPublishing(false);
    }
  };

  // Apply template
  const handleApplyTemplate = (tplKey: string) => {
    const tpl = ANNOUNCEMENT_POPUP_TEMPLATES[tplKey];
    if (!tpl) return;
    updateConfig(() => normalizeAnnouncementPopupConfig(tpl.config));
    toast.success(`Applied template: ${tpl.name}`);
  };

  if (loading || !widget || !config) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading Announcement &amp; Popup Studio…
      </div>
    );
  }

  const isBar = config.displayMode === "bar";
  const rawBar = config.barPosition;
  const barObj: AnnouncementBarPositionConfig =
    typeof rawBar === "object" && rawBar !== null
      ? (rawBar as AnnouncementBarPositionConfig)
      : {
          position: typeof rawBar === "string" ? rawBar : "fixed_top",
          sticky: config.sticky ?? true,
          contained: config.barLayout === "contained",
          maxWidth: 1200,
          zIndex: 9999,
          showReopenButton: false,
          reopenButtonText: "Open Bar",
        };
  const currentPos =
    barObj.position === "top_fixed" ? "fixed_top" :
    barObj.position === "bottom_fixed" ? "fixed_bottom" :
    barObj.position === "top_flow" ? "flow_top" :
    barObj.position === "bottom_flow" ? "flow_bottom" :
    barObj.position || "fixed_top";

  return (
    <div className="min-h-screen bg-[#141416] text-zinc-100 flex flex-col overflow-hidden">
      {/* =========================================================================
          TOP TOOLBAR
         ========================================================================= */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Back & Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/widgets" as any })}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            title="Back to widgets"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={widgetName}
              onChange={(e) => {
                setWidgetName(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-zinc-700 focus:border-amber-400 focus:outline-none px-1 py-0.5 max-w-[220px] md:max-w-[320px] truncate"
              placeholder="Widget Name"
            />

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                widget.status === "published"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  widget.status === "published" ? "bg-emerald-400" : "bg-zinc-500"
                }`}
              ></span>
              {widget.status === "published" ? "Published" : "Draft"}
            </span>

            {hasUnsavedChanges && (
              <span className="text-[11px] text-amber-400 font-medium hidden sm:inline">
                • Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="hidden md:flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setPreviewDevice("desktop")}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              previewDevice === "desktop"
                ? "bg-zinc-800 text-amber-300 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice("mobile")}
            className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
              previewDevice === "mobile"
                ? "bg-zinc-800 text-amber-300 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            title="Reset Preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-md shadow-amber-500/10 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing…" : "Publish"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEmbedModal(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Install</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          STUDIO BODY (SIDEBAR + PREVIEW CANVAS)
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Sidebar */}
        <div className="w-full md:w-[420px] lg:w-[460px] border-r border-zinc-800 bg-[#18181b] flex flex-col shrink-0 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="grid grid-cols-5 border-b border-zinc-800 bg-zinc-900/60 shrink-0 select-none overflow-hidden">
            {[
              { id: "templates", label: "Templates", icon: Layers },
              { id: "content", label: "Content", icon: Type },
              { id: "design", label: "Design", icon: Palette },
              { id: "position", label: isBar ? "Position" : "Modal", icon: Sliders },
              { id: "rules", label: "Rules", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
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
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {/* ---------------- 1. TEMPLATES TAB ---------------- */}
            {activeTab === "templates" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Ready-Made Templates
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Select one of 12 production templates.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setTemplateFilter("all")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        templateFilter === "all" ? "bg-zinc-800 text-amber-300" : "text-zinc-400"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilter("bar")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        templateFilter === "bar" ? "bg-zinc-800 text-amber-300" : "text-zinc-400"
                      }`}
                    >
                      Bars
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilter("popup")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        templateFilter === "popup" ? "bg-zinc-800 text-amber-300" : "text-zinc-400"
                      }`}
                    >
                      Popups
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ANNOUNCEMENT_POPUP_TEMPLATE_LIST.filter((tpl) => {
                    if (templateFilter === "bar") return tpl.displayMode === "bar";
                    if (templateFilter === "popup") return tpl.displayMode === "popup";
                    return true;
                  }).map((tpl) => {
                    return (
                      <div
                        key={tpl.key}
                        onClick={() => handleApplyTemplate(tpl.key)}
                        className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-amber-400/80 hover:bg-zinc-900 cursor-pointer transition flex flex-col justify-between group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                tpl.displayMode === "bar"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              }`}
                            >
                              {tpl.displayMode === "bar" ? "Bar" : "Popup"}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium">
                              {tpl.badge}
                            </span>
                          </div>

                          <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                            {tpl.name}
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-amber-400 font-semibold">
                          <span>Apply Preset</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- 2. CONTENT TAB ---------------- */}
            {activeTab === "content" && (
              <div className="space-y-5">
                {/* Mode Selector */}
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <label className="text-xs font-bold text-zinc-300 block">Widget Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          displayMode: "bar",
                        }))
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        config.displayMode === "bar"
                          ? "bg-amber-400 text-black shadow-sm"
                          : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Announcement Bar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig((prev) => ({
                          ...prev,
                          displayMode: "popup",
                        }))
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        config.displayMode === "popup"
                          ? "bg-amber-400 text-black shadow-sm"
                          : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Popup Modal</span>
                    </button>
                  </div>
                </div>

                {/* Main Headlines */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Text Content
                  </h4>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Headline</label>
                    <input
                      type="text"
                      value={config.content?.headline ?? ""}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          content: { ...(prev.content || {}), headline: e.target.value } as any,
                        }))
                      }
                      placeholder="e.g. Special Offer: Save 20% Today"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Description / Message
                    </label>
                    <textarea
                      rows={3}
                      value={config.content?.description ?? ""}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          content: { ...(prev.content || {}), description: e.target.value } as any,
                        }))
                      }
                      placeholder="Add an engaging message or offer description…"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 resize-y"
                    />
                  </div>

                  {/* Badge & Icon */}
                  <div className="pt-2 border-t border-zinc-800 space-y-3">
                    <SettingSwitch
                      checked={Boolean(config.content?.showBadge)}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          content: { ...(prev.content || {}), showBadge: val } as any,
                        }))
                      }
                      label="Show Badge Label"
                      description="Displays a pill tag next to your headline"
                    />

                    {config.content?.showBadge && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Badge Text</label>
                          <input
                            type="text"
                            value={config.content?.badgeText || ""}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                content: { ...(prev.content || {}), badgeText: e.target.value } as any,
                              }))
                            }
                            placeholder="e.g. LIMITED TIME"
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Icon / Emoji</label>
                          <input
                            type="text"
                            value={config.content?.icon || ""}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                content: { ...(prev.content || {}), icon: e.target.value } as any,
                              }))
                            }
                            placeholder="🔥, ⚡, 🎁, 🎉"
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400 text-center"
                          />
                        </div>
                      </div>
                    )}

                    <SettingSwitch
                      checked={Boolean(config.content?.showCloseButton)}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          content: { ...(prev.content || {}), showCloseButton: val } as any,
                        }))
                      }
                      label="Show Close (X) Button"
                      description="Allows visitors to dismiss the widget"
                    />
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <SettingSwitch
                    checked={Boolean(config.buttons?.primary?.enabled)}
                    onChange={(val) =>
                      updateConfig((prev) => ({
                        ...prev,
                        buttons: {
                          ...(prev.buttons || {}),
                          primary: { ...(prev.buttons?.primary || {}), enabled: val } as any,
                        },
                      }))
                    }
                    label="Primary CTA Button"
                    description="Main action button for visitors"
                  />

                  {config.buttons?.primary?.enabled && (
                    <div className="space-y-3 pt-2 border-t border-zinc-800">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">
                            Button Label
                          </label>
                          <input
                            type="text"
                            value={config.buttons?.primary?.text ?? ""}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                buttons: {
                                  ...(prev.buttons || {}),
                                  primary: { ...(prev.buttons?.primary || {}), text: e.target.value } as any,
                                },
                              }))
                            }
                            placeholder="e.g. Claim Discount"
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Target URL</label>
                          <input
                            type="text"
                            value={config.buttons?.primary?.url ?? ""}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                buttons: {
                                  ...(prev.buttons || {}),
                                  primary: { ...(prev.buttons?.primary || {}), url: e.target.value } as any,
                                },
                              }))
                            }
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <SettingSwitch
                        checked={Boolean(config.buttons?.primary?.openInNewTab)}
                        onChange={(val) =>
                          updateConfig((prev) => ({
                            ...prev,
                            buttons: {
                              ...(prev.buttons || {}),
                              primary: { ...(prev.buttons?.primary || {}), openInNewTab: val } as any,
                            },
                          }))
                        }
                        label="Open in new browser tab"
                      />
                    </div>
                  )}
                </div>

                {/* Secondary Button */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <SettingSwitch
                    checked={Boolean(config.buttons?.secondary?.enabled)}
                    onChange={(val) =>
                      updateConfig((prev) => ({
                        ...prev,
                        buttons: {
                          ...(prev.buttons || {}),
                          secondary: { ...(prev.buttons?.secondary || {}), enabled: val } as any,
                        },
                      }))
                    }
                    label="Secondary Button"
                    description="Optional dismissal or secondary link"
                  />

                  {config.buttons?.secondary?.enabled && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Button Text</label>
                        <input
                          type="text"
                          value={config.buttons?.secondary?.text ?? ""}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              buttons: {
                                ...(prev.buttons || {}),
                                secondary: { ...(prev.buttons?.secondary || {}), text: e.target.value } as any,
                              },
                            }))
                          }
                          placeholder="No thanks"
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Target URL</label>
                        <input
                          type="text"
                          value={config.buttons?.secondary?.url ?? ""}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              buttons: {
                                ...(prev.buttons || {}),
                                secondary: { ...(prev.buttons?.secondary || {}), url: e.target.value } as any,
                              },
                            }))
                          }
                          placeholder="#"
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Coupon Code Feature */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <SettingSwitch
                    checked={Boolean(config.coupon?.enabled)}
                    onChange={(val) =>
                      updateConfig((prev) => ({
                        ...prev,
                        coupon: { ...prev.coupon, enabled: val },
                      }))
                    }
                    label="Coupon / Promo Code"
                    description="Displays a copyable promo voucher code"
                  />

                  {config.coupon?.enabled && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Promo Code</label>
                        <input
                          type="text"
                          value={config.coupon.code || ""}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              coupon: { ...prev.coupon, code: e.target.value.toUpperCase() },
                            }))
                          }
                          placeholder="SAVE20"
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400 uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Copy Button</label>
                        <input
                          type="text"
                          value={config.coupon.buttonText || ""}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              coupon: { ...prev.coupon, buttonText: e.target.value },
                            }))
                          }
                          placeholder="Copy Code"
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Synchronized Countdown Integration */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <SettingSwitch
                    checked={Boolean(config.countdown?.enabled)}
                    onChange={(val) =>
                      updateConfig((prev) => ({
                        ...prev,
                        countdown: {
                          ...prev.countdown,
                          enabled: val,
                          targetTimestamp:
                            val && (!prev.countdown?.targetTimestamp || prev.countdown.targetTimestamp <= 0)
                              ? Date.now() + 48 * 3600 * 1000
                              : prev.countdown?.targetTimestamp,
                        },
                      }))
                    }
                    label="Live Countdown Timer"
                    description="Creates scarcity with an authoritative deadline"
                  />

                  {config.countdown?.enabled && (
                    <div className="space-y-3 pt-2 border-t border-zinc-800">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          Target End Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={
                            config.countdown.targetTimestamp
                              ? new Date(config.countdown.targetTimestamp)
                                  .toISOString()
                                  .slice(0, 16)
                              : new Date(Date.now() + 48 * 3600 * 1000)
                                  .toISOString()
                                  .slice(0, 16)
                          }
                          onChange={(e) => {
                            const dateVal = new Date(e.target.value);
                            const ms = dateVal.getTime();
                            if (!isNaN(ms)) {
                              updateConfig((prev) => ({
                                ...prev,
                                countdown: {
                                  ...prev.countdown,
                                  targetTimestamp: ms,
                                },
                              }));
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <SettingSwitch
                          checked={Boolean(config.countdown.showDays)}
                          onChange={(val) =>
                            updateConfig((prev) => ({
                              ...prev,
                              countdown: { ...prev.countdown, showDays: val },
                            }))
                          }
                          label="Days"
                        />
                        <SettingSwitch
                          checked={Boolean(config.countdown.showHours)}
                          onChange={(val) =>
                            updateConfig((prev) => ({
                              ...prev,
                              countdown: { ...prev.countdown, showHours: val },
                            }))
                          }
                          label="Hours"
                        />
                        <SettingSwitch
                          checked={Boolean(config.countdown.showMinutes)}
                          onChange={(val) =>
                            updateConfig((prev) => ({
                              ...prev,
                              countdown: { ...prev.countdown, showMinutes: val },
                            }))
                          }
                          label="Minutes"
                        />
                        <SettingSwitch
                          checked={Boolean(config.countdown.showSeconds)}
                          onChange={(val) =>
                            updateConfig((prev) => ({
                              ...prev,
                              countdown: { ...prev.countdown, showSeconds: val },
                            }))
                          }
                          label="Seconds"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          Expired Message
                        </label>
                        <input
                          type="text"
                          value={config.countdown.completionMessage || "Offer has ended"}
                          onChange={(e) =>
                            updateConfig((prev) => ({
                              ...prev,
                              countdown: {
                                ...prev.countdown,
                                completionMessage: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Image (If in Popup Mode) */}
                {config.displayMode === "popup" && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <SettingSwitch
                      checked={Boolean(config.image?.enabled)}
                      onChange={(val) =>
                        updateConfig((prev) => ({
                          ...prev,
                          image: { ...prev.image, enabled: val },
                        }))
                      }
                      label="Popup Promotional Image"
                      description="Include an image inside the modal dialog"
                    />

                    {config.image?.enabled && (
                      <div className="space-y-3 pt-2 border-t border-zinc-800">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Image URL</label>
                          <input
                            type="text"
                            value={config.image.url || ""}
                            onChange={(e) =>
                              updateConfig((prev) => ({
                                ...prev,
                                image: { ...prev.image, url: e.target.value },
                              }))
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">
                            Image Position
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(["top", "left", "right"] as const).map((pos) => (
                              <button
                                key={pos}
                                type="button"
                                onClick={() =>
                                  updateConfig((prev) => ({
                                    ...prev,
                                    image: { ...prev.image, position: pos },
                                  }))
                                }
                                className={`py-1.5 px-2 rounded text-xs capitalize font-semibold transition ${
                                  config.image?.position === pos
                                    ? "bg-amber-400 text-black font-bold"
                                    : "bg-zinc-950 text-zinc-400 border border-zinc-800"
                                }`}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 3. DESIGN & COLORS TAB ---------------- */}
            {activeTab === "design" && (
              <div className="space-y-5">
                {/* Color Palette */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Color Palette
                  </h4>

                  <ColorField
                    label="Background Color"
                    value={config.colors.background}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        colors: { ...p.colors, background: v },
                      }))
                    }
                  />

                  <ColorField
                    label="Text Color"
                    value={config.colors.textColor}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        colors: { ...p.colors, textColor: v },
                      }))
                    }
                  />

                  <ColorField
                    label="Heading Color"
                    value={config.colors.headingColor}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        colors: { ...p.colors, headingColor: v },
                      }))
                    }
                  />

                  <ColorField
                    label="Primary Button Bg"
                    value={config.buttons?.primary?.backgroundColor || config.colors.primaryBtnBg || "#ffc21a"}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        buttons: {
                          ...(p.buttons || {}),
                          primary: { ...(p.buttons?.primary || {}), backgroundColor: v } as any,
                        },
                      }))
                    }
                  />

                  <ColorField
                    label="Primary Button Text"
                    value={config.buttons?.primary?.textColor || config.colors.primaryBtnText || "#18181b"}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        buttons: {
                          ...(p.buttons || {}),
                          primary: { ...(p.buttons?.primary || {}), textColor: v } as any,
                        },
                      }))
                    }
                  />

                  <ColorField
                    label="Border Color"
                    value={config.colors.borderColor}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        colors: { ...p.colors, borderColor: v },
                      }))
                    }
                  />

                  <ColorField
                    label="Badge Background"
                    value={config.colors.badgeBackground || config.colors.badgeBg || "#ef4444"}
                    onChange={(v) =>
                      updateConfig((p) => ({
                        ...p,
                        colors: { ...p.colors, badgeBackground: v },
                      }))
                    }
                  />

                  {config.displayMode === "popup" && (
                    <ColorField
                      label="Backdrop Overlay"
                      value={config.colors.overlayColor}
                      onChange={(v) =>
                        updateConfig((p) => ({
                          ...p,
                          colors: { ...p.colors, overlayColor: v },
                        }))
                      }
                    />
                  )}
                </div>

                {/* Typography */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Typography
                  </h4>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Font Family</label>
                    <select
                      value={config.typography.fontFamily}
                      onChange={(e) =>
                        updateConfig((p) => ({
                          ...p,
                          typography: { ...p.typography, fontFamily: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Inter, system-ui, sans-serif">Inter (Modern Clean)</option>
                      <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                      <option value="'Outfit', sans-serif">Outfit (Editorial)</option>
                      <option value="'Poppins', sans-serif">Poppins (Geometric)</option>
                      <option value="system-ui, -apple-system, sans-serif">System Default</option>
                      <option value="Georgia, serif">Georgia (Serif)</option>
                      <option value="monospace">Monospace (Code)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">
                        Heading Size: {config.typography.headingSize}px
                      </label>
                      <input
                        type="range"
                        min={12}
                        max={36}
                        value={config.typography.headingSize}
                        onChange={(e) =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              headingSize: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">
                        Body Size: {config.typography.bodySize}px
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={20}
                        value={config.typography.bodySize}
                        onChange={(e) =>
                          updateConfig((p) => ({
                            ...p,
                            typography: { ...p.typography, bodySize: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>

                  {/* Heading Style Formatting */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Heading Style</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              headingWeight: p.typography.headingWeight === "700" ? "600" : "700",
                            },
                          }))
                        }
                        className={`p-1.5 rounded transition ${
                          config.typography.headingWeight === "700" || config.typography.headingWeight === "800"
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title="Bold Headline"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              headingItalic: !(p.typography as any).headingItalic,
                            },
                          }))
                        }
                        className={`p-1.5 rounded transition ${
                          (config.typography as any).headingItalic
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title="Italic Headline"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              headingUnderline: !(p.typography as any).headingUnderline,
                            },
                          }))
                        }
                        className={`p-1.5 rounded transition ${
                          (config.typography as any).headingUnderline
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title="Underline Headline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Style Formatting */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Body Style</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              bodyBold: !(p.typography as any).bodyBold,
                            },
                          }))
                        }
                        className={`p-1.5 rounded transition ${
                          (config.typography as any).bodyBold
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title="Bold Body"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              bodyItalic: !(p.typography as any).bodyItalic,
                            },
                          }))
                        }
                        className={`p-1.5 rounded transition ${
                          (config.typography as any).bodyItalic
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title="Italic Body"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            typography: {
                              ...p.typography,
                              bodyUnderline: !(p.typography as any).bodyUnderline,
                            },
                          }))
                        }
                        className={`p-1.5 rounded transition ${
                          (config.typography as any).bodyUnderline
                            ? "bg-zinc-800 text-amber-400 font-bold"
                            : "text-zinc-500 hover:text-white"
                        }`}
                        title="Underline Body"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-zinc-400 block">Text Alignment</label>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() =>
                            updateConfig((p) => ({
                              ...p,
                              typography: { ...p.typography, textAlign: align },
                            }))
                          }
                          className={`p-1.5 rounded transition ${
                            config.typography.textAlign === align
                              ? "bg-zinc-800 text-amber-400 font-bold"
                              : "text-zinc-500 hover:text-white"
                          }`}
                          title={`Align ${align}`}
                        >
                          {align === "left" ? <AlignLeft className="w-3.5 h-3.5" /> : align === "center" ? <AlignCenter className="w-3.5 h-3.5" /> : <AlignRight className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sizing, Radius & Animation */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Dimensions &amp; Animation
                  </h4>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Border Radius: {config.layout.borderRadius}px
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={32}
                      value={config.layout.borderRadius}
                      onChange={(e) =>
                        updateConfig((p) => ({
                          ...p,
                          layout: { ...p.layout, borderRadius: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Padding Y: {config.layout.paddingY}px
                    </label>
                    <input
                      type="range"
                      min={6}
                      max={48}
                      value={config.layout.paddingY}
                      onChange={(e) =>
                        updateConfig((p) => ({
                          ...p,
                          layout: { ...p.layout, paddingY: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Entrance Animation</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["fade", "slide_down", "slide_up", "scale"] as const).map((anim) => (
                        <button
                          key={anim}
                          type="button"
                          onClick={() =>
                            updateConfig((p) => ({
                              ...p,
                              animation: { ...p.animation, type: anim },
                            }))
                          }
                          className={`py-1.5 px-2 rounded text-[11px] capitalize font-semibold transition ${
                            config.animation.type === anim
                              ? "bg-amber-400 text-black font-bold"
                              : "bg-zinc-950 text-zinc-400 border border-zinc-800"
                          }`}
                        >
                          {anim.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 4. POSITION & LAYOUT TAB ---------------- */}
            {activeTab === "position" && (
              <div className="space-y-5">
                {isBar ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Display Position
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "fixed_top", label: "Fixed at Top" },
                          { id: "fixed_bottom", label: "Fixed at Bottom" },
                          { id: "flow_top", label: "Normal Flow (Top)" },
                          { id: "flow_bottom", label: "Normal Flow (Bottom)" },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() =>
                              updateConfig((p) => {
                                const prevBar =
                                  typeof p.barPosition === "object" && p.barPosition !== null
                                    ? p.barPosition
                                    : barObj;
                                return {
                                  ...p,
                                  barPosition: {
                                    ...prevBar,
                                    position: pos.id as AnnouncementBarPosition,
                                  },
                                };
                              })
                            }
                            className={`p-2.5 rounded-lg text-xs font-semibold text-left transition border ${
                              currentPos === pos.id
                                ? "bg-amber-400/10 border-amber-400 text-amber-300 font-bold"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-800 space-y-3">
                        <SettingSwitch
                          checked={Boolean(barObj.sticky)}
                          onChange={(val) =>
                            updateConfig((p) => {
                              const prevBar =
                                typeof p.barPosition === "object" && p.barPosition !== null
                                  ? p.barPosition
                                  : barObj;
                              return {
                                ...p,
                                barPosition: { ...prevBar, sticky: val },
                              };
                            })
                          }
                          label="Sticky on Scroll"
                          description="Remains anchored while the visitor scrolls"
                        />

                        <SettingSwitch
                          checked={Boolean(barObj.contained)}
                          onChange={(val) =>
                            updateConfig((p) => {
                              const prevBar =
                                typeof p.barPosition === "object" && p.barPosition !== null
                                  ? p.barPosition
                                  : barObj;
                              return {
                                ...p,
                                barPosition: { ...prevBar, contained: val },
                              };
                            })
                          }
                          label="Contained Width (Floating Banner)"
                          description="Limits width instead of full edge-to-edge stretch"
                        />

                        {barObj.contained && (
                          <div>
                            <label className="text-[11px] text-zinc-400 block mb-1">
                              Max Width: {barObj.maxWidth}px
                            </label>
                            <input
                              type="range"
                              min={600}
                              max={1400}
                              step={20}
                              value={barObj.maxWidth}
                              onChange={(e) =>
                                updateConfig((p) => {
                                  const prevBar =
                                    typeof p.barPosition === "object" && p.barPosition !== null
                                    ? p.barPosition
                                    : barObj;
                                  return {
                                    ...p,
                                    barPosition: {
                                      ...prevBar,
                                      maxWidth: Number(e.target.value),
                                    },
                                  };
                                })
                              }
                              className="w-full accent-amber-400"
                            />
                          </div>
                        )}

                        <SettingSwitch
                          checked={Boolean(barObj.showReopenButton)}
                          onChange={(val) =>
                            updateConfig((p) => {
                              const prevBar =
                                typeof p.barPosition === "object" && p.barPosition !== null
                                  ? p.barPosition
                                  : barObj;
                              return {
                                ...p,
                                barPosition: { ...prevBar, showReopenButton: val },
                              };
                            })
                          }
                          label="Show Reopen Button When Dismissed"
                          description="Leaves a subtle pill to restore the bar"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Modal Dialog Sizing
                    </h4>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">
                        Popup Width: {config.layout.popupWidth}px
                      </label>
                      <input
                        type="range"
                        min={360}
                        max={720}
                        step={10}
                        value={config.layout.popupWidth}
                        onChange={(e) =>
                          updateConfig((p) => ({
                            ...p,
                            layout: { ...p.layout, popupWidth: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 5. DISPLAY RULES & SCHEDULING TAB ---------------- */}
            {activeTab === "rules" && (
              <div className="space-y-5">
                {/* Trigger Section */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Activation Triggers
                  </h4>

                  <div className="space-y-2">
                    {[
                      { id: "immediate", label: "Immediately on Page Load", desc: "Shows as soon as page mounts" },
                      { id: "delay", label: "Time Delay", desc: "Shows after visitor spends X seconds on page" },
                      { id: "scroll", label: "Scroll Percentage", desc: "Shows after visitor scrolls down X%" },
                      { id: "exit_intent", label: "Exit Intent", desc: "Desktop: triggers when mouse moves towards browser top" },
                    ].map((trig) => (
                      <div
                        key={trig.id}
                        onClick={() =>
                          updateConfig((p) => ({
                            ...p,
                            displayRules: {
                              ...p.displayRules,
                              trigger: trig.id as PopupTriggerType,
                            },
                          }))
                        }
                        className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                          config.displayRules.trigger === trig.id
                            ? "bg-amber-400/10 border-amber-400 text-white"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            config.displayRules.trigger === trig.id
                              ? "border-amber-400 bg-amber-400"
                              : "border-zinc-700"
                          }`}
                        >
                          {config.displayRules.trigger === trig.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-100">{trig.label}</div>
                          <div className="text-[11px] text-zinc-400">{trig.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {config.displayRules.trigger === "delay" && (
                    <div className="pt-2 border-t border-zinc-800">
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        Delay: {config.displayRules.triggerDelaySeconds} seconds
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={30}
                        value={config.displayRules.triggerDelaySeconds}
                        onChange={(e) =>
                          updateConfig((p) => ({
                            ...p,
                            displayRules: {
                              ...p.displayRules,
                              triggerDelaySeconds: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-amber-400"
                      />
                    </div>
                  )}

                  {config.displayRules.trigger === "scroll" && (
                    <div className="pt-2 border-t border-zinc-800">
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        Scroll Threshold: {config.displayRules.triggerScrollPercent}%
                      </label>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        value={config.displayRules.triggerScrollPercent}
                        onChange={(e) =>
                          updateConfig((p) => ({
                            ...p,
                            displayRules: {
                              ...p.displayRules,
                              triggerScrollPercent: Number(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-amber-400"
                      />
                    </div>
                  )}
                </div>

                {/* Frequency & Dismissal */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Display Frequency
                  </h4>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">How often to show</label>
                    <select
                      value={config.displayRules.frequency}
                      onChange={(e) =>
                        updateConfig((p) => ({
                          ...p,
                          displayRules: {
                            ...p.displayRules,
                            frequency: e.target.value as PopupFrequencyType,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="always">Every page load</option>
                      <option value="session">Once per browser session</option>
                      <option value="1day">Once per day</option>
                      <option value="7days">Once every 7 days</option>
                      <option value="30days">Once every 30 days</option>
                      <option value="once">Only once per visitor</option>
                    </select>
                  </div>

                  <SettingSwitch
                    checked={Boolean(config.displayRules.dismissPersistence)}
                    onChange={(val) =>
                      updateConfig((p) => ({
                        ...p,
                        displayRules: { ...p.displayRules, dismissPersistence: val },
                      }))
                    }
                    label="Remember Visitor Dismissal"
                    description="Prevents annoying visitors after they click Close (X)"
                  />
                </div>

                {/* Scheduling */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <SettingSwitch
                    checked={Boolean(config.displayRules.scheduleEnabled)}
                    onChange={(val) =>
                      updateConfig((p) => ({
                        ...p,
                        displayRules: { ...p.displayRules, scheduleEnabled: val },
                      }))
                    }
                    label="Schedule Start & End Date"
                    description="Automatically display and hide widget on specific dates"
                  />

                  {config.displayRules.scheduleEnabled && (
                    <div className="space-y-3 pt-2 border-t border-zinc-800">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          Active From (Start)
                        </label>
                        <input
                          type="datetime-local"
                          value={config.displayRules.scheduleStartTime || ""}
                          onChange={(e) =>
                            updateConfig((p) => ({
                              ...p,
                              displayRules: {
                                ...p.displayRules,
                                scheduleStartTime: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          Active Until (End)
                        </label>
                        <input
                          type="datetime-local"
                          value={config.displayRules.scheduleEndTime || ""}
                          onChange={(e) =>
                            updateConfig((p) => ({
                              ...p,
                              displayRules: {
                                ...p.displayRules,
                                scheduleEndTime: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Live Website Mockup & Canvas */}
        <div className="flex-1 bg-zinc-950 flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8 relative">
          <div
            className={`w-full transition-all duration-300 relative shadow-2xl rounded-2xl border border-zinc-800 overflow-hidden bg-[#0d0f14] flex flex-col ${
              previewDevice === "mobile" ? "max-w-[390px] min-h-[680px]" : "max-w-5xl min-h-[720px]"
            }`}
            style={{ transform: "translateZ(0)" }}
          >
            {/* Mock Browser Top Bar */}
            <div className="h-9 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between select-none shrink-0 z-40">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 px-3 py-0.5 rounded-md bg-zinc-950/60 border border-zinc-800/80 max-w-[240px] truncate">
                https://my-store.com
              </div>
              <div className="w-10"></div>
            </div>

            {/* Live Rendered Widget Inside Preview Canvas */}
            <div
              ref={previewContainerRef}
              data-wto-mock-canvas="1"
              style={{ transform: "translateZ(0)" }}
              className="relative flex-1 flex flex-col w-full overflow-hidden"
            >
              {renderedOutput.css && <style>{renderedOutput.css}</style>}

              {/* Top / Floating / Modal Widget (When NOT flow_bottom) */}
              {(!isBar || currentPos !== "flow_bottom") && (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{
                    __html: renderedOutput.html,
                  }}
                />
              )}

              {/* Realistic Website Demo Content Underneath */}
              <div
                className={`p-6 md:p-12 space-y-12 select-none pointer-events-none opacity-80 flex-1 ${
                  isBar && currentPos === "fixed_bottom" ? "pb-24" : ""
                }`}
              >
                {/* Mock Nav */}
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
                  <div className="flex items-center gap-2 font-bold text-base text-white">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-black flex items-center justify-center font-black">
                      A
                    </div>
                    <span>Apex Commerce</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-zinc-400 font-medium">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span>Pricing</span>
                    <span>Company</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-200 text-xs font-semibold">
                    Cart (0)
                  </div>
                </div>

                {/* Mock Hero */}
                <div className="max-w-2xl mx-auto text-center space-y-4 pt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-amber-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Summer Collection 2026 Live Now</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    Design Better. Launch Faster. Convert Smarter.
                  </h1>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
                    Transform your storefront with responsive promotional campaigns, high-converting notification bars, and targeted modal offers.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/10">
                      Explore Catalog
                    </div>
                    <div className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-700">
                      View Lookbook
                    </div>
                  </div>
                </div>

                {/* Mock Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {[
                    { name: "Nordic Minimalist Chair", price: "$249.00", badge: "Best Seller" },
                    { name: "Ceramic Studio Lamp", price: "$89.00", badge: "New" },
                    { name: "Organic Wool Throw", price: "$120.00", badge: "20% Off" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
                      <div className="h-32 rounded-lg bg-zinc-850 flex items-center justify-center text-zinc-600 text-xs font-medium">
                        Product Preview
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.name}</span>
                        <span className="text-amber-400 font-mono font-bold">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Flow Widget (When flow_bottom) */}
              {isBar && currentPos === "flow_bottom" && (
                <div
                  className="w-full mt-auto"
                  dangerouslySetInnerHTML={{
                    __html: renderedOutput.html,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EMBED / INSTALLATION MODAL
         ========================================================================= */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Embed on Any Website</h3>
                  <p className="text-xs text-zinc-400">
                    Copy and paste this snippet into your website or builder.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Widget ID Pill */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Widget ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-300 font-bold">{widgetId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(widgetId);
                      setCopiedId(true);
                      toast.success("Widget ID copied!");
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                    title="Copy ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <span>HTML Embed Code</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      (Works in Custom HTML block or external HTML)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                      setCopiedSnippet(true);
                      toast.success("Embed code copied to clipboard!");
                      setTimeout(() => setCopiedSnippet(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition shadow active:scale-95"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black border border-zinc-800 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed select-all">
                  {embedCode}
                </pre>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Installation Guide:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>1. WebToolOcean Website Builder</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Open your website page in the Builder. Drag and drop a <strong>Custom HTML</strong> block from the widget sidebar. Paste this code snippet into the code input. Your published widget will immediately render.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>2. Plain HTML / Static Website</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px]">
                      Paste this snippet into your HTML document (before the closing &lt;/body&gt; tag). The script loads asynchronously without jQuery, React, or heavy libraries, and automatically initializes the widget.
                    </p>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Updates Note:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/80">
                    Once embedded, any changes you make and publish in this Studio will update on your live website automatically without needing to replace or re-paste the embed code!
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
