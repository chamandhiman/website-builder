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
  Globe,
  Timer,
  RefreshCw,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { WidgetStudioHeader } from "@/components/widgets/WidgetStudioHeader";

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
    <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0] last:border-0">
      <div className="pr-3">
        <div className="text-xs font-semibold text-[#111827]">{label}</div>
        {description && <div className="text-[11px] text-[#64748B] mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[#7137D8]" : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
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
    <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0] last:border-0">
      <label className="text-xs text-[#374151] font-semibold">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg text-[#111827] focus:outline-none focus:border-[#7137D8] text-center shadow-2xs"
        />
        <input
          type="color"
          value={value.startsWith("#") ? value.slice(0, 7) : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-[#CBD5E1] bg-white cursor-pointer p-0 shadow-2xs"
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
          const normalized = normalizeAnnouncementPopupConfig(rawCfg);
          setConfig(normalized);
          setTemplateFilter(normalized.displayMode === "bar" ? "bar" : "popup");
          setWidgetName(data.name || (normalized.displayMode === "bar" ? "Announcement Bar" : "Popup Modal"));
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
      isStudioMockup: true,
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
      isStudioMockup: true,
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">
        <div className="w-8 h-8 border-2 border-[#7137D8] border-t-transparent rounded-full animate-spin mr-3"></div>
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col overflow-hidden">
      {/* =========================================================================
          TOP TOOLBAR
         ========================================================================= */}
      <WidgetStudioHeader
        widgetName={widgetName}
        onWidgetNameChange={(name) => {
          setWidgetName(name);
          setHasUnsavedChanges(true);
        }}
        status={widget.status}
        icon={<Megaphone className="w-3.5 h-3.5" />}
        iconBgClass="bg-purple-500/15 border-purple-500/30 text-purple-400"
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        onResetPreview={() => setPreviewKey((k) => k + 1)}
        onOpenEmbed={() => setShowEmbedModal(true)}
        onSaveDraft={() => handleSave(false)}
        onPublish={handlePublish}
        saving={isSaving}
        publishing={isPublishing}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* =========================================================================
          STUDIO BODY (SIDEBAR + PREVIEW CANVAS)
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Sidebar */}
        <div className="w-full md:w-[420px] lg:w-[460px] border-r border-[#E2E8F0] bg-white flex flex-col shrink-0 overflow-hidden shadow-2xs">
          {/* Widget Mode Switcher (Bar vs Popup) */}
          <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3 shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">Widget Type</span>
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5 mt-0.5">
                {isBar ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Announcement Bar
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    Popup Modal
                  </>
                )}
              </span>
            </div>
            <div className="flex bg-white p-1 rounded-xl border border-[#CBD5E1] gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  updateConfig((p) => ({ ...p, displayMode: "bar" }));
                  setTemplateFilter("bar");
                }}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  isBar
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-xs"
                    : "text-[#64748B] hover:text-[#111827]"
                }`}
                title="Switch to Announcement Bar"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Bar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  updateConfig((p) => ({ ...p, displayMode: "popup" }));
                  setTemplateFilter("popup");
                }}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  !isBar
                    ? "bg-purple-50 text-[#7137D8] border border-purple-200 shadow-xs"
                    : "text-[#64748B] hover:text-[#111827]"
                }`}
                title="Switch to Popup Modal"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Popup</span>
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="grid grid-cols-5 border-b border-[#E2E8F0] bg-white shrink-0 select-none overflow-hidden shadow-2xs">
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
                      ? "border-[#7137D8] bg-[#F6F0FE] text-[#7137D8]"
                      : "border-transparent text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 group-hover:scale-110 ${
                      isActive ? "text-[#7137D8]" : "text-[#64748B] group-hover:text-[#111827]"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold mt-1 tracking-tight truncate max-w-full leading-none ${
                      isActive ? "text-[#7137D8] font-bold" : "text-[#64748B] group-hover:text-[#111827]"
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
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                      {templateFilter === "bar"
                        ? "Announcement Bar Presets"
                        : templateFilter === "popup"
                        ? "Popup Modal Presets"
                        : "Ready-Made Presets"}
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {templateFilter === "bar"
                        ? "6 pre-styled header & footer notification bars"
                        : templateFilter === "popup"
                        ? "6 high-converting modal lightboxes & popups"
                        : "Select one of 12 production templates"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setTemplateFilter("all")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        templateFilter === "all" ? "bg-white text-[#7137D8] font-bold shadow-xs border border-[#CBD5E1]" : "text-[#64748B] hover:text-[#111827]"
                      }`}
                    >
                      All (12)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilter("bar")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        templateFilter === "bar" ? "bg-white text-blue-600 font-bold shadow-xs border border-blue-200" : "text-[#64748B] hover:text-[#111827]"
                      }`}
                    >
                      Bars (6)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilter("popup")}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        templateFilter === "popup" ? "bg-white text-[#7137D8] font-bold shadow-xs border border-purple-200" : "text-[#64748B] hover:text-[#111827]"
                      }`}
                    >
                      Popups (6)
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
                        className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#7137D8] hover:shadow-md cursor-pointer transition flex flex-col justify-between group shadow-2xs"
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
                            <span className="text-[10px] text-[#94A3B8] font-medium">
                              {tpl.badge}
                            </span>
                          </div>

                          <div className="font-bold text-xs text-white group-hover:text-[#7137D8] transition-colors">
                            {tpl.name}
                          </div>
                          <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#7137D8] font-semibold">
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
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <label className="text-xs font-bold text-[#334155] block">Widget Type</label>
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
                          ? "bg-[#7137D8] text-black shadow-sm"
                          : "bg-white text-[#64748B] hover:text-white border border-[#E2E8F0]"
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
                          ? "bg-[#7137D8] text-black shadow-sm"
                          : "bg-white text-[#64748B] hover:text-white border border-[#E2E8F0]"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Popup Modal</span>
                    </button>
                  </div>
                </div>

                {/* Main Headlines */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Text Content
                  </h4>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Headline</label>
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
                      className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-white focus:outline-none focus:border-[#7137D8]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">
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
                      className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-white focus:outline-none focus:border-[#7137D8] resize-y"
                    />
                  </div>

                  {/* Badge & Icon */}
                  <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
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
                          <label className="text-[11px] text-[#64748B] block mb-1">Badge Text</label>
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
                            className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#64748B] block mb-1">Icon / Emoji</label>
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
                            className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8] text-center"
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
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
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
                    <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-[#64748B] block mb-1">
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
                            className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#64748B] block mb-1">Target URL</label>
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
                            className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
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
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
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
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">Button Text</label>
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">Target URL</label>
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Coupon Code Feature */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
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
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">Promo Code</label>
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8] uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">Copy Button</label>
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Synchronized Countdown Integration */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
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
                    <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
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
                        <label className="text-[11px] text-[#64748B] block mb-1">
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Image (If in Popup Mode) */}
                {config.displayMode === "popup" && (
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
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
                      <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                        <div>
                          <label className="text-[11px] text-[#64748B] block mb-1">Image URL</label>
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
                            className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8] font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-[#64748B] block mb-1">
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
                                    ? "bg-[#7137D8] text-black font-bold"
                                    : "bg-white text-[#64748B] border border-[#E2E8F0]"
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
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
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
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Typography
                  </h4>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Font Family</label>
                    <select
                      value={config.typography.fontFamily}
                      onChange={(e) =>
                        updateConfig((p) => ({
                          ...p,
                          typography: { ...p.typography, fontFamily: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-white focus:outline-none focus:border-[#7137D8] cursor-pointer"
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
                      <label className="text-xs text-[#64748B] block mb-1">
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
                      <label className="text-xs text-[#64748B] block mb-1">
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
                    <span className="text-xs text-[#64748B]">Heading Style</span>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-[#E2E8F0]">
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
                            ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                            : "text-[#94A3B8] hover:text-white"
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
                            ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                            : "text-[#94A3B8] hover:text-white"
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
                            ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                        title="Underline Headline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Style Formatting */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">Body Style</span>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-[#E2E8F0]">
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
                            ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                            : "text-[#94A3B8] hover:text-white"
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
                            ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                            : "text-[#94A3B8] hover:text-white"
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
                            ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                            : "text-[#94A3B8] hover:text-white"
                        }`}
                        title="Underline Body"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#64748B] block">Text Alignment</label>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-[#E2E8F0]">
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
                              ? "bg-[#F1F5F9] text-[#7137D8] font-bold"
                              : "text-[#94A3B8] hover:text-white"
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
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Dimensions &amp; Animation
                  </h4>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">
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
                    <label className="text-xs text-[#64748B] block mb-1">
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
                    <label className="text-xs text-[#64748B] block mb-1">Entrance Animation</label>
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
                              ? "bg-[#7137D8] text-black font-bold"
                              : "bg-white text-[#64748B] border border-[#E2E8F0]"
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
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
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
                                ? "bg-[#7137D8]/10 border-[#7137D8] text-[#7137D8] font-bold"
                                : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-white"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
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
                            <label className="text-[11px] text-[#64748B] block mb-1">
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
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Modal Dialog Sizing
                    </h4>

                    <div>
                      <label className="text-xs text-[#64748B] block mb-1">
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

            {/* ---------------- 5. DISPLAY RULES & TARGETING TAB ---------------- */}
            {activeTab === "rules" && (
              <div className="space-y-5">
                {/* 1. Activation Trigger & Time Delay */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-[#7137D8]" />
                      Activation Trigger
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Choose when the {isBar ? "announcement bar" : "popup modal"} appears to visitors.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "immediate", label: "Immediate on Page Load", desc: "Shows instantly as soon as visitor arrives" },
                      { id: "delay", label: "Timed Delay (After Page Load)", desc: "Wait a few seconds after page load before displaying" },
                      { id: "scroll", label: "Scroll Percentage", desc: "Shows after visitor scrolls down part of the page" },
                      { id: "exit_intent", label: "Exit Intent", desc: "Desktop: Triggers when mouse moves towards browser top to leave" },
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
                            ? "bg-[#7137D8]/10 border-[#7137D8] text-white"
                            : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#111827]"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            config.displayRules.trigger === trig.id
                              ? "border-[#7137D8] bg-[#7137D8]"
                              : "border-[#CBD5E1]"
                          }`}
                        >
                          {config.displayRules.trigger === trig.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#111827]">{trig.label}</div>
                          <div className="text-[11px] text-[#64748B]">{trig.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Convenient Time Delay Controls */}
                  {config.displayRules.trigger === "delay" && (
                    <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#111827]">
                          Delay time before showing
                        </label>
                        <span className="text-xs font-mono font-bold text-[#7137D8] px-2 py-0.5 rounded bg-[#7137D8]/10 border border-[#7137D8]/30">
                          {config.displayRules.triggerDelaySeconds ?? 3}s
                        </span>
                      </div>

                      {/* Quick preset buttons for convenience */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#64748B] mb-1.5">Quick Presets:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { sec: 0, label: "0s (Instant)" },
                            { sec: 2, label: "2s" },
                            { sec: 3, label: "3s" },
                            { sec: 5, label: "5s (Popular)" },
                            { sec: 10, label: "10s" },
                            { sec: 15, label: "15s" },
                            { sec: 30, label: "30s" },
                          ].map((pill) => (
                            <button
                              key={pill.sec}
                              type="button"
                              onClick={() =>
                                updateConfig((p) => ({
                                  ...p,
                                  displayRules: {
                                    ...p.displayRules,
                                    triggerDelaySeconds: pill.sec,
                                  },
                                }))
                              }
                              className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition border ${
                                config.displayRules.triggerDelaySeconds === pill.sec
                                  ? "bg-[#7137D8] text-black border-[#7137D8] font-bold shadow"
                                  : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-white hover:border-[#CBD5E1]"
                              }`}
                            >
                              {pill.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Precision Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                          <span>0s (Instant)</span>
                          <span>Custom: {config.displayRules.triggerDelaySeconds ?? 3} seconds</span>
                          <span>60s</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={60}
                          step={1}
                          value={config.displayRules.triggerDelaySeconds ?? 3}
                          onChange={(e) =>
                            updateConfig((p) => ({
                              ...p,
                              displayRules: {
                                ...p.displayRules,
                                triggerDelaySeconds: Number(e.target.value),
                              },
                            }))
                          }
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {config.displayRules.trigger === "scroll" && (
                    <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#111827]">
                          Scroll Depth Threshold
                        </label>
                        <span className="text-xs font-mono font-bold text-[#7137D8] px-2 py-0.5 rounded bg-[#7137D8]/10 border border-[#7137D8]/30">
                          {config.displayRules.triggerScrollPercent}%
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[25, 40, 50, 75].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() =>
                              updateConfig((p) => ({
                                ...p,
                                displayRules: {
                                  ...p.displayRules,
                                  triggerScrollPercent: pct,
                                },
                              }))
                            }
                            className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold border transition ${
                              config.displayRules.triggerScrollPercent === pct
                                ? "bg-[#7137D8] text-black border-[#7137D8] font-bold"
                                : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-white"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
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
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Page Targeting & Return to Home Page Behavior */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      Page Targeting &amp; Return Behavior
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Control which pages display this widget and how returning visitors are greeted.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Target Pages</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "all", label: "All Pages" },
                        { id: "homepage_only", label: "Homepage Only" },
                        { id: "custom", label: "Custom Paths" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            updateConfig((p) => ({
                              ...p,
                              displayRules: {
                                ...p.displayRules,
                                pageTargeting: t.id as any,
                              },
                            }))
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                            (config.displayRules.pageTargeting || "all") === t.id
                              ? "bg-[#7137D8] text-black border-[#7137D8] font-bold shadow"
                              : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.displayRules.pageTargeting === "custom" && (
                    <div>
                      <label className="text-[11px] text-[#64748B] block mb-1">
                        URL Paths (comma separated, use * for wildcards)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(config.displayRules.targetedPaths) ? config.displayRules.targetedPaths.join(", ") : (config.displayRules.targetedPaths || "")}
                        onChange={(e) =>
                          updateConfig((p) => ({
                            ...p,
                            displayRules: {
                              ...p.displayRules,
                              targetedPaths: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            },
                          }))
                        }
                        placeholder="/pricing, /products/*, /cart"
                        className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8] font-mono"
                      />
                    </div>
                  )}

                  {/* Return to Home Page Switch */}
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <SettingSwitch
                      checked={Boolean(config.displayRules.reappearOnHomeReturn)}
                      onChange={(val) =>
                        updateConfig((p) => ({
                          ...p,
                          displayRules: { ...p.displayRules, reappearOnHomeReturn: val },
                        }))
                      }
                      label="Always Show When Returning to Home Page"
                      description="When a visitor navigates back or lands on the Home Page (/), always show the popup even if closed on other pages."
                    />
                  </div>
                </div>

                {/* 3. Frequency & Recurrence Cadence */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                      Display Frequency
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      How frequently returning visitors see this {isBar ? "bar" : "popup"}.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Frequency Rule</label>
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
                      className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-white focus:outline-none focus:border-[#7137D8] cursor-pointer"
                    >
                      <option value="always">Every page load (Always show)</option>
                      <option value="home_return">Always on Home Page / Return to Home</option>
                      <option value="session">Once per browser session (Until window closed)</option>
                      <option value="1day">Once every 24 hours (Daily)</option>
                      <option value="7days">Once every 7 days (Weekly)</option>
                      <option value="30days">Once every 30 days (Monthly)</option>
                      <option value="once">Only once per visitor (Never repeat)</option>
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
                    description="Prevents showing again after visitor clicks the close (X) button"
                  />

                  {config.displayRules.dismissPersistence && (
                    <div>
                      <label className="text-[11px] text-[#64748B] block mb-1">Dismissal Memory Scope</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "session", label: "For current session" },
                          { id: "permanent", label: "Permanent cooldown" },
                        ].map((scope) => (
                          <button
                            key={scope.id}
                            type="button"
                            onClick={() =>
                              updateConfig((p) => ({
                                ...p,
                                displayRules: {
                                  ...p.displayRules,
                                  dismissScope: scope.id as any,
                                },
                              }))
                            }
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                              (config.displayRules.dismissScope || "permanent") === scope.id
                                ? "bg-[#7137D8] text-black border-[#7137D8] font-bold shadow"
                                : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-white"
                            }`}
                          >
                            {scope.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Date & Time Scheduling */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
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
                    <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#64748B] block mb-1">
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
                          className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#111827] shadow-2xs focus:outline-none focus:border-[#7137D8]"
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
        <div className="flex-1 bg-[#F1F5F9] flex flex-col items-center justify-start overflow-y-auto p-4 md:p-8 relative">
          <div
            className={`w-full transition-all duration-300 relative shadow-xl rounded-2xl border border-[#CBD5E1] overflow-hidden bg-white flex flex-col ${
              previewDevice === "mobile" ? "max-w-[390px] min-h-[680px]" : "max-w-5xl min-h-[720px]"
            }`}
            style={{ transform: "translateZ(0)" }}
          >
            {/* Mock Browser Top Bar */}
            <div className="h-9 bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 flex items-center justify-between select-none shrink-0 z-40">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="text-[11px] font-mono text-[#64748B] px-3 py-0.5 rounded-md bg-white border border-[#E2E8F0] max-w-[240px] truncate">
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
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-2 font-bold text-base text-[#111827]">
                    <div className="w-7 h-7 rounded-lg bg-[#7137D8] text-white flex items-center justify-center font-black">
                      A
                    </div>
                    <span>Apex Commerce</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-[#64748B] font-medium">
                    <span>Products</span>
                    <span>Solutions</span>
                    <span>Pricing</span>
                    <span>Company</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0] text-xs font-semibold">
                    Cart (0)
                  </div>
                </div>

                {/* Mock Hero */}
                <div className="max-w-2xl mx-auto text-center space-y-4 pt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F0FE] border border-[#EDE0FD] text-[#7137D8] text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Summer Collection 2026 Live Now</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
                    Design Better. Launch Faster. Convert Smarter.
                  </h1>
                  <p className="text-sm text-[#475569] leading-relaxed max-w-lg mx-auto">
                    Transform your storefront with responsive promotional campaigns, high-converting notification bars, and targeted modal offers.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="px-5 py-2.5 rounded-xl bg-[#7137D8] text-white font-bold text-xs shadow-md shadow-[#7137D8]/20">
                      Explore Catalog
                    </div>
                    <div className="px-4 py-2.5 rounded-xl bg-white text-[#334155] font-semibold text-xs border border-[#CBD5E1] shadow-2xs">
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
                    <div key={i} className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                      <div className="h-32 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-zinc-600 text-xs font-medium">
                        Product Preview
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.name}</span>
                        <span className="text-[#7137D8] font-mono font-bold">{item.price}</span>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#7137D8]/10 border border-[#7137D8]/20 text-[#7137D8] flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-base">Embed on Any Website</h3>
                  <p className="text-xs text-[#64748B]">
                    Copy and paste this snippet into your website or builder.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Widget ID Pill */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Widget ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#7137D8] font-bold">{widgetId}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(widgetId);
                      setCopiedId(true);
                      toast.success("Widget ID copied!");
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="p-1 rounded bg-white border border-[#CBD5E1] text-[#334155] hover:text-[#111827] transition shadow-2xs"
                    title="Copy ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                    <span>HTML Embed Code</span>
                    <span className="text-[10px] text-[#94A3B8] font-normal">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs transition shadow-xs active:scale-95"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black border border-[#E2E8F0] text-[#111827] font-mono text-xs overflow-x-auto leading-relaxed select-all">
                  {embedCode}
                </pre>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Installation Guide:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/60 border border-[#E2E8F0] space-y-2">
                    <div className="font-bold text-[#7137D8] flex items-center gap-1.5">
                      <span>1. WebToolOcean Website Builder</span>
                    </div>
                    <p className="text-[#64748B] leading-relaxed text-[11px]">
                      Open your website page in the Builder. Drag and drop a <strong>Custom HTML</strong> block from the widget sidebar. Paste this code snippet into the code input. Your published widget will immediately render.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/60 border border-[#E2E8F0] space-y-2">
                    <div className="font-bold text-[#7137D8] flex items-center gap-1.5">
                      <span>2. Plain HTML / Static Website</span>
                    </div>
                    <p className="text-[#64748B] leading-relaxed text-[11px]">
                      Paste this snippet into your HTML document (before the closing &lt;/body&gt; tag). The script loads asynchronously without jQuery, React, or heavy libraries, and automatically initializes the widget.
                    </p>
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#7137D8]" />
                    <span>Live Updates Note:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-200/80">
                    Once embedded, any changes you make and publish in this Studio will update on your live website automatically without needing to replace or re-paste the embed code!
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-white/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2 rounded-lg bg-[#F1F5F9] hover:bg-zinc-700 text-[#111827] font-semibold text-xs transition"
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
