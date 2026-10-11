import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getWidget,
  saveWidget,
  publishWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  type FaqConfig,
  type FaqItem,
  type FaqTemplateKey,
  FAQ_TEMPLATES,
  FAQ_TEMPLATE_LIST,
  createNewFaqWidget,
  normalizeFaqConfig,
} from "@/services/faqTemplates";
import {
  renderFaqHtml,
  attachFaqInteractivity,
} from "@/lib/widget-runtime/faqRuntime";
import {
  ArrowLeft,
  HelpCircle,
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
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  X,
  Search,
  MessageSquare,
  FileQuestion,
  Tag,
  ListFilter,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/widgets/faq-accordion/$widgetId")({
  component: FaqAccordionStudioPage,
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
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-850 last:border-0 text-xs">
      <span className="text-zinc-300 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-[11px] font-mono text-zinc-300 text-center uppercase"
        />
        <div className="relative w-6 h-6 rounded-md border border-zinc-600 overflow-hidden shrink-0 cursor-pointer shadow-sm">
          <input
            type="color"
            value={value.startsWith("#") ? value : "#18181b"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>
      </div>
    </div>
  );
}

/** Numeric Range Slider */
function RangeSliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="py-2 border-b border-zinc-850 last:border-0 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-300 font-medium">{label}</span>
        <span className="font-mono text-amber-300 font-bold text-[11px]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-zinc-750 rounded-lg appearance-none cursor-pointer accent-amber-400"
      />
    </div>
  );
}

function FaqAccordionStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/faq-accordion/$widgetId" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord<FaqConfig> | null>(null);
  const [config, setConfig] = useState<FaqConfig | null>(null);
  const [widgetName, setWidgetName] = useState("FAQ Accordion");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "content" | "layout" | "behavior" | "appearance" | "advanced">("content");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load or initialize widget
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        let record = (await getWidget(widgetId)) as WidgetInstanceRecord<FaqConfig> | null;
        if (!record) {
          record = createNewFaqWidget("FAQ Accordion", "classic_accordion");
          record.id = widgetId;
          await saveWidget(record);
        }
        if (mounted && record) {
          setWidget(record);
          const normalized = normalizeFaqConfig(record.config);
          setConfig(normalized);
          setWidgetName(record.name || "FAQ Accordion");
          if (normalized.items?.length > 0) {
            setEditingItemId(normalized.items[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load FAQ widget:", err);
        toast.error("Error loading widget configuration");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [widgetId]);

  // Update config helper with dirty tracking
  const updateConfig = (updater: (prev: FaqConfig) => FaqConfig) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const normalizedPrev = normalizeFaqConfig(prev);
      const next = updater(JSON.parse(JSON.stringify(normalizedPrev)));
      const normalizedNext = normalizeFaqConfig(next);
      setHasUnsavedChanges(true);
      return normalizedNext;
    });
  };

  // Switch Template
  const handleSelectTemplate = (templateKey: FaqTemplateKey) => {
    const tplPreset = FAQ_TEMPLATES[templateKey];
    if (!tplPreset) return;
    updateConfig((prev) => {
      // Retain user's current items and title, apply template layout, appearance, colors, behavior
      return normalizeFaqConfig({
        ...prev,
        template: templateKey,
        layout: {
          ...prev.layout,
          ...(tplPreset.config?.layout || {}),
        },
        behavior: {
          ...prev.behavior,
          ...(tplPreset.config?.behavior || {}),
        },
        appearance: {
          ...(prev as any).appearance,
          ...((tplPreset.config as any)?.appearance || {}),
        },
        colors: {
          ...prev.colors,
          ...(tplPreset.config?.colors || {}),
        },
        typography: {
          ...prev.typography,
          ...(tplPreset.config?.typography || {}),
        },
      });
    });
    toast.success(`Applied ${tplPreset.name} template!`);
  };

  // Reset to original preset defaults (including sample content)
  const handleConfirmReset = () => {
    if (!config) return;
    const tplKey = config.template || "classic_accordion";
    const preset = FAQ_TEMPLATES[tplKey] || FAQ_TEMPLATES.classic_accordion;
    setConfig(normalizeFaqConfig(JSON.parse(JSON.stringify(preset.config))));
    setHasUnsavedChanges(true);
    setShowResetModal(false);
    toast.info("Reset to template default configuration.");
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!widget || !config) return;
    setIsSaving(true);
    try {
      const updated: WidgetInstanceRecord<FaqConfig> = {
        ...widget,
        name: widgetName.trim() || "FAQ Accordion",
        config: normalizeFaqConfig(config),
        status: "draft",
        updatedAt: new Date().toISOString(),
      };
      await saveWidget(updated);
      setWidget(updated);
      setHasUnsavedChanges(false);
      toast.success("Draft saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Widget
  const handlePublish = async () => {
    if (!widget || !config) return;
    setIsPublishing(true);
    try {
      const updated: WidgetInstanceRecord<FaqConfig> = {
        ...widget,
        name: widgetName.trim() || "FAQ Accordion",
        config: normalizeFaqConfig(config),
        status: "published",
        updatedAt: new Date().toISOString(),
      };
      const pub = (await publishWidget(updated)) as WidgetInstanceRecord<FaqConfig>;
      setWidget(pub);
      setHasUnsavedChanges(false);
      toast.success("Widget published live!");
      setEmbedModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish widget");
    } finally {
      setIsPublishing(false);
    }
  };

  // Items Management
  const handleAddItem = () => {
    const newItemId = `faq-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: FaqItem = {
      id: newItemId,
      question: "New Frequently Asked Question?",
      answer: "Provide a helpful, detailed answer to this customer question here.",
      category: "General",
    };
    updateConfig((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
    setEditingItemId(newItemId);
    toast.success("Added new question!");
  };

  const handleDuplicateItem = (itemToCopy: FaqItem) => {
    const duplicated: FaqItem = {
      ...itemToCopy,
      id: `faq-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      question: `${itemToCopy.question} (Copy)`,
    };
    updateConfig((prev) => {
      const items = prev.items || [];
      const idx = items.findIndex((i) => i.id === itemToCopy.id);
      const nextItems = [...items];
      if (idx >= 0) {
        nextItems.splice(idx + 1, 0, duplicated);
      } else {
        nextItems.push(duplicated);
      }
      return { ...prev, items: nextItems };
    });
    setEditingItemId(duplicated.id);
    toast.success("Duplicated question!");
  };

  const handleDeleteItem = (itemId: string) => {
    if (!config || (config.items || []).length <= 1) {
      toast.error("FAQ must have at least one question.");
      return;
    }
    updateConfig((prev) => ({
      ...prev,
      items: (prev.items || []).filter((i) => i.id !== itemId),
    }));
    if (editingItemId === itemId) {
      const remaining = (config.items || []).filter((i) => i.id !== itemId);
      setEditingItemId(remaining[0]?.id || null);
    }
    toast.info("Deleted question.");
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (!config) return;
    const items = config.items || [];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    updateConfig((prev) => {
      const list = [...(prev.items || [])];
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, items: list };
    });
  };

  // Live rendered HTML & CSS
  const previewMarkup = useMemo(() => {
    if (!config || !widget) return { html: "", css: "" };
    const mockRecord: WidgetInstanceRecord<FaqConfig> = {
      ...widget,
      id: widget.id,
      name: widgetName,
      config,
    };
    return renderFaqHtml(mockRecord, { device: previewDevice });
  }, [config, widget, widgetName, previewDevice]);

  // Attach runtime interactivity to live preview container
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const cleanup = attachFaqInteractivity(previewContainerRef.current);
    return cleanup;
  }, [previewMarkup, previewDevice]);

  // Embed Snippet
  const embedSnippet = `<div data-wto-widget="${widgetId}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopiedEmbed(false), 2200);
  };

  if (loading || !config || !widget) {
    return (
      <div className="min-h-screen bg-[#141416] flex items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-3" />
        Loading FAQ Accordion Studio…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-100 flex flex-col overflow-hidden font-sans select-none">
      {/* ================= TOP STUDIO APP BAR ================= */}
      <header className="h-14 border-b border-zinc-800 bg-[#16161a] px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/widgets" as any })}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
            title="Back to Widgets Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-500 p-1.5 flex items-center justify-center text-white shrink-0 shadow-sm">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <input
                type="text"
                value={widgetName}
                onChange={(e) => {
                  setWidgetName(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="bg-transparent text-sm font-bold text-white hover:bg-zinc-800/60 focus:bg-zinc-900 border border-transparent hover:border-zinc-700 focus:border-amber-400 rounded px-2 py-0.5 outline-none transition w-44 md:w-64 truncate"
                title="Click to rename widget"
              />
              <div className="text-[10px] text-zinc-500 flex items-center gap-2 pl-2">
                <span>FAQ Accordion</span>
                <span>•</span>
                <span className="font-mono">{widgetId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher & Unsaved Indicator */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Unsaved changes
            </span>
          )}

          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                previewDevice === "desktop"
                  ? "bg-zinc-800 text-amber-400 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                previewDevice === "mobile"
                  ? "bg-zinc-800 text-amber-400 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEmbedModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center gap-1.5 border border-zinc-700/80 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Embed Code</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition border border-zinc-700 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs transition shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? "Publishing…" : "Publish Live"}
          </button>
        </div>
      </header>

      {/* ================= MAIN SPLIT VIEW (SETTINGS LEFT | PREVIEW RIGHT) ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT CONFIGURATION PANEL ================= */}
        <aside className="w-full md:w-[420px] lg:w-[460px] bg-[#141418] border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden z-20">
          {/* Tab Navigation */}
          <div className="grid grid-cols-6 border-b border-zinc-800 bg-[#16161b] shrink-0 select-none overflow-hidden">
            {[
              { id: "content", label: "Content", icon: MessageSquare },
              { id: "templates", label: "Templates", icon: Layers },
              { id: "layout", label: "Layout", icon: Sliders },
              { id: "behavior", label: "Behavior", icon: Sparkles },
              { id: "appearance", label: "Appearance", icon: Palette },
              { id: "advanced", label: "Advanced", icon: Settings },
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

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* ---------------- 1. CONTENT TAB ---------------- */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Header & Subtitle Settings */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Section Header
                    </span>
                    <SettingSwitch
                      label=""
                      checked={Boolean(config.layout.showHeader)}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          layout: { ...c.layout, showHeader: v },
                        }))
                      }
                    />
                  </div>

                  {config.layout.showHeader && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-xs text-zinc-400 font-medium block mb-1">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={config.content.heading}
                          onChange={(e) =>
                            updateConfig((c) => ({
                              ...c,
                              content: { ...c.content, heading: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
                          placeholder="e.g. Frequently Asked Questions"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-medium block mb-1">
                          Description / Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={config.content.description}
                          onChange={(e) =>
                            updateConfig((c) => ({
                              ...c,
                              content: { ...c.content, description: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none resize-none leading-relaxed"
                          placeholder="Short description under the heading"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ Questions List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Questions &amp; Answers ({(config.items || []).length})
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Add, edit, reorder, and duplicate your FAQ entries.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {/* Items Accordion Editor List */}
                  <div className="space-y-2.5">
                    {(config.items || []).map((item, idx) => {
                      const isEditing = editingItemId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            isEditing
                              ? "bg-zinc-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/20"
                              : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          {/* Item Card Header */}
                          <div
                            onClick={() => setEditingItemId(isEditing ? null : item.id)}
                            className="p-3 flex items-center justify-between gap-2 cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="w-5 h-5 rounded-md bg-zinc-800 text-[10px] font-mono font-bold text-zinc-400 flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-white truncate">
                                  {item.question || "Untitled Question"}
                                </div>
                                {item.category && (
                                  <span className="text-[10px] text-amber-300/80 font-medium">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Reorder and Action Buttons */}
                            <div
                              className="flex items-center gap-1 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveItem(idx, "up")}
                                className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                                title="Move up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === (config.items || []).length - 1}
                                onClick={() => handleMoveItem(idx, "down")}
                                className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                                title="Move down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateItem(item)}
                                className="p-1 rounded text-zinc-400 hover:text-amber-400 transition cursor-pointer"
                                title="Duplicate question"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 rounded text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                                title="Delete question"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Item Expanded Form Editor */}
                          {isEditing && (
                            <div className="p-3.5 pt-0 border-t border-zinc-800/80 space-y-3 mt-1 bg-zinc-950/40">
                              <div>
                                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  value={item.question || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateConfig((prev) => ({
                                      ...prev,
                                      items: (prev.items || []).map((i) =>
                                        i.id === item.id ? { ...i, question: val } : i
                                      ),
                                    }));
                                  }}
                                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[11px] font-semibold text-zinc-400">
                                    Answer (Rich Text / HTML supported)
                                  </label>
                                  <span className="text-[10px] text-zinc-500">
                                    Supports &lt;b&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;p&gt;
                                  </span>
                                </div>
                                <textarea
                                  rows={4}
                                  value={item.answer || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateConfig((prev) => ({
                                      ...prev,
                                      items: (prev.items || []).map((i) =>
                                        i.id === item.id ? { ...i, answer: val } : i
                                      ),
                                    }));
                                  }}
                                  className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-200 focus:border-amber-400 outline-none leading-relaxed resize-y font-sans"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                                  Category / Group (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={item.category || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateConfig((prev) => ({
                                      ...prev,
                                      items: (prev.items || []).map((i) =>
                                        i.id === item.id ? { ...i, category: val } : i
                                      ),
                                    }));
                                  }}
                                  placeholder="e.g. Billing, General, Shipping, Account"
                                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 2. TEMPLATES TAB ---------------- */}
            {activeTab === "templates" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Ready-Made Templates (8)
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Switch appearance and layouts instantly without losing your questions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-[11px] text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
                    title="Reset to template defaults"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FAQ_TEMPLATE_LIST.map((tpl) => {
                    const isSelected = config.template === tpl.key;
                    return (
                      <div
                        key={tpl.key}
                        onClick={() => handleSelectTemplate(tpl.key)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-zinc-900 border-amber-400 ring-2 ring-amber-400/20 shadow-md shadow-amber-500/10"
                            : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <h5 className="font-bold text-xs text-white truncate">
                              {tpl.name}
                            </h5>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-amber-300">
                              {tpl.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            {tpl.description}
                          </p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                          <span className={isSelected ? "text-amber-400 font-bold" : "text-zinc-500 font-medium"}>
                            {isSelected ? "Active" : "Apply"}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 font-bold" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- 3. LAYOUT TAB ---------------- */}
            {activeTab === "layout" && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-zinc-800">
                    Grid &amp; Alignment
                  </h4>

                  {/* Columns */}
                  <div>
                    <label className="text-xs text-zinc-300 font-medium block mb-2">
                      Columns Layout
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: 1, label: "Single Column" },
                        { val: 2, label: "Two Columns (Desktop)" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() =>
                            updateConfig((c) => ({
                              ...c,
                              layout: { ...c.layout, columns: opt.val as 1 | 2 },
                            }))
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                            config.layout.columns === opt.val
                              ? "bg-amber-400/10 border-amber-400 text-amber-300"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="text-xs text-zinc-300 font-medium block mb-2">
                      Header Alignment
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: "left", label: "Left Aligned" },
                        { val: "center", label: "Center Aligned" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() =>
                            updateConfig((c) => ({
                              ...c,
                              layout: { ...c.layout, alignment: opt.val as "left" | "center" },
                            }))
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                            config.layout.alignment === opt.val
                              ? "bg-amber-400/10 border-amber-400 text-amber-300"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Position */}
                  <div>
                    <label className="text-xs text-zinc-300 font-medium block mb-2">
                      Expand / Collapse Icon Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: "right", label: "Right Side" },
                        { val: "left", label: "Left Side" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() =>
                            updateConfig((c) => ({
                              ...c,
                              layout: { ...c.layout, iconPosition: opt.val as "left" | "right" },
                            }))
                          }
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                            config.layout.iconPosition === opt.val
                              ? "bg-amber-400/10 border-amber-400 text-amber-300"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max Width */}
                  <div>
                    <label className="text-xs text-zinc-300 font-medium block mb-1">
                      Max Container Width
                    </label>
                    <input
                      type="text"
                      value={config.layout.maxWidth}
                      onChange={(e) =>
                        updateConfig((c) => ({
                          ...c,
                          layout: { ...c.layout, maxWidth: e.target.value },
                        }))
                      }
                      placeholder="e.g. 840px or 100%"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Spacings and Padding */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800">
                    Sizing &amp; Spacing
                  </h4>

                  <RangeSliderField
                    label="Question Spacing"
                    value={config.layout.itemSpacing ?? 12}
                    min={0}
                    max={36}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        layout: { ...c.layout, itemSpacing: v },
                      }))
                    }
                  />

                  <RangeSliderField
                    label="Row Padding"
                    value={config.layout.rowPadding}
                    min={8}
                    max={36}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        layout: { ...c.layout, rowPadding: v },
                      }))
                    }
                  />

                  <RangeSliderField
                    label="Border Radius"
                    value={config.appearance?.borderRadius ?? config.layout.borderRadius ?? 12}
                    min={0}
                    max={32}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        appearance: { ...(c.appearance || {}), borderRadius: v },
                      }))
                    }
                  />

                  <RangeSliderField
                    label="Border Thickness"
                    value={config.appearance?.borderWidth ?? config.layout.borderWidth ?? 1}
                    min={0}
                    max={4}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        appearance: { ...(c.appearance || {}), borderWidth: v },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* ---------------- 4. BEHAVIOR TAB ---------------- */}
            {activeTab === "behavior" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-zinc-800">
                    Accordion Mechanics
                  </h4>

                  <SettingSwitch
                    label="Keep Multiple Questions Open"
                    description="When disabled, opening one question automatically collapses others"
                    checked={Boolean(config.behavior.allowMultiple)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        behavior: { ...c.behavior, allowMultiple: v },
                      }))
                    }
                  />

                  <SettingSwitch
                    label="Expand All & Collapse All Controls"
                    description="Show quick action buttons for visitors to open or close all questions"
                    checked={Boolean(config.behavior.showExpandAllControls)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        behavior: { ...c.behavior, showExpandAllControls: v },
                      }))
                    }
                  />

                  <SettingSwitch
                    label="Live Search Filter"
                    description="Real-time search bar that filters questions as visitors type"
                    checked={Boolean(config.layout.showSearch)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        layout: { ...c.layout, showSearch: v },
                      }))
                    }
                  />

                  <SettingSwitch
                    label="Category Tabs Filter"
                    description="Filter pill buttons generated automatically from item categories"
                    checked={Boolean(config.layout.showCategories)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        layout: { ...c.layout, showCategories: v },
                      }))
                    }
                  />

                  <SettingSwitch
                    label="Limit Items Displayed initially (Show More)"
                    description="Show only initial batch of questions with a load more button"
                    checked={Boolean(config.behavior.showMore)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        behavior: { ...c.behavior, showMore: v },
                      }))
                    }
                  />

                  {config.behavior.showMore && (
                    <div className="pt-2">
                      <RangeSliderField
                        label="Number of items to show initially"
                        value={config.behavior.itemsToShow ?? 4}
                        min={1}
                        max={10}
                        unit=" items"
                        onChange={(v) =>
                          updateConfig((c) => ({
                            ...c,
                            behavior: { ...c.behavior, itemsToShow: v },
                          }))
                        }
                      />
                    </div>
                  )}

                  <RangeSliderField
                    label="Animation Duration"
                    value={config.behavior.animationDuration ?? 200}
                    min={100}
                    max={600}
                    step={25}
                    unit="ms"
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        behavior: { ...c.behavior, animationDuration: v },
                      }))
                    }
                  />
                </div>

                {/* Support Banner / Contact Box */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Customer Support Link
                    </span>
                    <SettingSwitch
                      label=""
                      checked={Boolean(config.behavior.showSupportLink)}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          behavior: { ...c.behavior, showSupportLink: v },
                        }))
                      }
                    />
                  </div>

                  {config.behavior.showSupportLink && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-xs text-zinc-400 font-medium block mb-1">
                          Support Banner Text
                        </label>
                        <input
                          type="text"
                          value={config.behavior.supportText}
                          onChange={(e) =>
                            updateConfig((c) => ({
                              ...c,
                              behavior: { ...c.behavior, supportText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-medium block mb-1">
                          Support Button Label
                        </label>
                        <input
                          type="text"
                          value={config.behavior.supportButtonText}
                          onChange={(e) =>
                            updateConfig((c) => ({
                              ...c,
                              behavior: { ...c.behavior, supportButtonText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-medium block mb-1">
                          Contact / Support URL
                        </label>
                        <input
                          type="url"
                          value={config.behavior.supportUrl}
                          onChange={(e) =>
                            updateConfig((c) => ({
                              ...c,
                              behavior: { ...c.behavior, supportUrl: e.target.value },
                            }))
                          }
                          placeholder="https://example.com/contact"
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 5. APPEARANCE TAB ---------------- */}
            {activeTab === "appearance" && (
              <div className="space-y-5">
                {/* Colors */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Colors &amp; Theme
                    </h4>
                    <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full">
                      Auto-adapts to page
                    </span>
                  </div>

                  {/* Theme Presets */}
                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1.5">
                      Theme Quick Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((c) => ({
                            ...c,
                            colors: {
                              ...c.colors,
                              widgetBackground: "transparent",
                              widgetBg: "transparent",
                              headingColor: "#0f172a",
                              descriptionColor: "#64748b",
                              questionColor: "#0f172a",
                              answerColor: "#334155",
                              rowBackground: "#ffffff",
                              rowBg: "#ffffff",
                              expandedRowBackground: "#f8fafc",
                              expandedRowBg: "#f8fafc",
                              borderColor: "#e2e8f0",
                              iconColor: "#eab308",
                              searchBackground: "#ffffff",
                              searchBg: "#ffffff",
                              searchTextColor: "#0f172a",
                            },
                          }))
                        }
                        className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-zinc-950 border border-zinc-700 text-zinc-200 hover:text-white hover:border-amber-400 transition flex items-center justify-center gap-1.5"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-400" />
                        <span>Light Mode</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateConfig((c) => ({
                            ...c,
                            colors: {
                              ...c.colors,
                              widgetBackground: "transparent",
                              widgetBg: "transparent",
                              headingColor: "#ffffff",
                              descriptionColor: "#a1a1aa",
                              questionColor: "#ffffff",
                              answerColor: "#d4d4d8",
                              rowBackground: "#18181b",
                              rowBg: "#18181b",
                              expandedRowBackground: "#27272a",
                              expandedRowBg: "#27272a",
                              borderColor: "#3f3f46",
                              iconColor: "#facc15",
                              searchBackground: "#18181b",
                              searchBg: "#18181b",
                              searchTextColor: "#ffffff",
                            },
                          }))
                        }
                        className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-zinc-950 border border-zinc-700 text-zinc-200 hover:text-white hover:border-amber-400 transition flex items-center justify-center gap-1.5"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-600" />
                        <span>Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-zinc-800/80">
                    <ColorField
                      label="Widget Background"
                      value={config.colors.widgetBg || config.colors.widgetBackground || "transparent"}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, widgetBg: v, widgetBackground: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Heading Text"
                      value={config.colors.headingColor}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, headingColor: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Description Text"
                      value={config.colors.descriptionColor}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, descriptionColor: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Question Row Background"
                      value={config.colors.rowBg || config.colors.rowBackground || "#18181b"}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, rowBg: v, rowBackground: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Expanded Question Background"
                      value={config.colors.expandedRowBg || config.colors.expandedRowBackground || "#27272a"}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, expandedRowBg: v, expandedRowBackground: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Question Text Color"
                      value={config.colors.questionColor}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, questionColor: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Answer Text Color"
                      value={config.colors.answerColor}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, answerColor: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Border &amp; Divider Color"
                      value={config.colors.borderColor}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, borderColor: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Icon Color"
                      value={config.colors.iconColor}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, iconColor: v },
                        }))
                      }
                    />

                    <ColorField
                      label="Search Input Background"
                      value={config.colors.searchBg || config.colors.searchBackground || "#18181b"}
                      onChange={(v) =>
                        updateConfig((c) => ({
                          ...c,
                          colors: { ...c.colors, searchBg: v, searchBackground: v },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Icon Style */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-zinc-800">
                    Icon Style
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: "chevron", label: "Chevron (▼)" },
                      { val: "plus_minus", label: "Plus / Minus (+/−)" },
                      { val: "arrow", label: "Arrow (➔)" },
                      { val: "caret", label: "Caret (▾)" },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() =>
                          updateConfig((c) => ({
                            ...c,
                            appearance: { ...(c.appearance || {}), iconStyle: opt.val as any },
                          }))
                        }
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition border ${
                          config.appearance?.iconStyle === opt.val
                            ? "bg-amber-400/10 border-amber-400 text-amber-300"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-zinc-800">
                    Typography &amp; Fonts
                  </h4>

                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1">
                      Font Family
                    </label>
                    <select
                      value={config.typography.fontFamily}
                      onChange={(e) =>
                        updateConfig((c) => ({
                          ...c,
                          typography: { ...c.typography, fontFamily: e.target.value },
                        }))
                      }
                      className="w-full py-2 px-3 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none cursor-pointer"
                    >
                      <option value="inherit">Inherit from website (Recommended)</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="'Outfit', sans-serif">Outfit</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="system-ui, sans-serif">System UI</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1">
                      Question Font Weight
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { val: "400", label: "Regular" },
                        { val: "500", label: "Medium" },
                        { val: "600", label: "Semi-bold" },
                        { val: "700", label: "Bold" },
                      ].map((w) => (
                        <button
                          key={w.val}
                          type="button"
                          onClick={() =>
                            updateConfig((c) => ({
                              ...c,
                              typography: { ...c.typography, fontWeight: w.val },
                            }))
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition border ${
                            (config.typography.fontWeight || "600") === w.val
                              ? "bg-amber-400/10 border-amber-400 text-amber-300"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <RangeSliderField
                    label="Question Font Size"
                    value={config.typography.questionFontSize ?? config.typography.questionSize ?? 16}
                    min={12}
                    max={24}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        typography: { ...c.typography, questionFontSize: v, questionSize: v },
                      }))
                    }
                  />

                  <RangeSliderField
                    label="Answer Font Size"
                    value={config.typography.answerFontSize ?? config.typography.answerSize ?? 14}
                    min={11}
                    max={20}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        typography: { ...c.typography, answerFontSize: v, answerSize: v },
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* ---------------- 6. ADVANCED TAB ---------------- */}
            {activeTab === "advanced" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-zinc-800">
                    SEO &amp; Schema Structured Data
                  </h4>

                  <SettingSwitch
                    label="Enable Schema.org FAQPage JSON-LD"
                    description="Generates valid structured data for search engine bots"
                    checked={Boolean(config.advanced.enableSchemaOrgFAQ)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        advanced: { ...c.advanced, enableSchemaOrgFAQ: v },
                      }))
                    }
                  />

                  <SettingSwitch
                    label="Inherit Website Fonts"
                    description="Match host site typography seamlessly"
                    checked={Boolean(config.advanced.inheritFont)}
                    onChange={(v) =>
                      updateConfig((c) => ({
                        ...c,
                        advanced: { ...c.advanced, inheritFont: v },
                      }))
                    }
                  />
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-1 border-b border-zinc-800">
                    Developer &amp; Custom Classes
                  </h4>

                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1">
                      Custom CSS Class Name
                    </label>
                    <input
                      type="text"
                      value={config.advanced.customClass}
                      onChange={(e) =>
                        updateConfig((c) => ({
                          ...c,
                          advanced: { ...c.advanced, customClass: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "") },
                        }))
                      }
                      placeholder="e.g. my-custom-faq"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1">
                      Empty Search Results Message
                    </label>
                    <input
                      type="text"
                      value={config.behavior.noResultsText}
                      onChange={(e) =>
                        updateConfig((c) => ({
                          ...c,
                          behavior: { ...c.behavior, noResultsText: e.target.value },
                        }))
                      }
                      placeholder="No matching questions found."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT LIVE PREVIEW CANVAS ================= */}
        <main className="flex-1 bg-[#101014] flex flex-col items-center justify-start p-6 md:p-10 overflow-y-auto">
          {/* Simulated Device Frame Container */}
          <div
            className={`w-full transition-all duration-300 relative ${
              previewDevice === "mobile"
                ? "max-w-[400px] border-8 border-zinc-800 rounded-[36px] bg-zinc-950 shadow-2xl p-4 my-auto min-h-[640px]"
                : "max-w-4xl"
            }`}
          >
            {/* Live Render Container */}
            <div
              ref={previewContainerRef}
              className="w-full"
              dangerouslySetInnerHTML={{
                __html: previewMarkup.css
                  ? `<style>${previewMarkup.css}</style>\n${previewMarkup.html}`
                  : previewMarkup.html,
              }}
            />
          </div>
        </main>
      </div>

      {/* ================= EMBED CODE MODAL ================= */}
      {embedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Embed FAQ Accordion</h3>
              </div>
              <button
                type="button"
                onClick={() => setEmbedModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Copy and paste this snippet anywhere on your website (WordPress, Shopify, Webflow, or custom HTML):
              </p>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed select-all">
                  {embedSnippet}
                </pre>
                <button
                  type="button"
                  onClick={copyEmbedCode}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <strong className="text-white block mb-1">In WebToolOcean Builder:</strong>
                <span>Add a Custom HTML element, click it, and paste this embed code.</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <strong className="text-white block mb-1">On External Websites:</strong>
                <span>Place the div where the FAQ should appear; the script handles hydration.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500 font-mono">ID: {widgetId}</span>
              <button
                type="button"
                onClick={() => setEmbedModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RESET CONFIRMATION MODAL ================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#151518] border border-white/10 shadow-2xl shadow-black/80">
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              onClick={() => setShowResetModal(false)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
              <RotateCcw className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h3 className="text-lg font-black text-white tracking-tight">Reset to Defaults</h3>
            <p className="text-xs text-[#9a9aa3] mt-2 leading-relaxed">
              Are you sure you want to reset all settings, questions, and styling back to the template defaults?
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
              Any custom edits you have made will be overwritten with the initial template configuration.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:bg-[#282830] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
