import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getWidget,
  saveWidget,
  publishWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  type AccessibilityConfig,
  type AccessibilityDisplayStyle,
  type AccessibilityPosition,
  type AccessibilityTheme,
  type AccessibilityContrastMode,
  type AccessibilityShadow,
  type AccessibilityPanelAnimation,
  ACCESSIBILITY_TEMPLATES,
  ACCESSIBILITY_TEMPLATE_LIST,
  DEFAULT_ACCESSIBILITY_CONFIG,
} from "@/services/accessibilityTemplates";
import {
  renderAccessibilityHtml,
  attachAccessibilityInteractivity,
  ACCESSIBILITY_ICON_SVG,
} from "@/lib/widget-runtime/accessibilityRuntime";
import {
  ArrowLeft,
  Sliders,
  Palette,
  ExternalLink,
  Code2,
  CheckCircle2,
  RefreshCw,
  X,
  Monitor,
  Smartphone,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Info,
  CheckCheck,
  Accessibility,
  Eye,
  Type,
  SunMoon,
  Move,
  Settings2,
  Layers,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { WidgetStudioHeader } from "@/components/widgets/WidgetStudioHeader";

export const Route = createFileRoute("/dashboard/widgets/accessibility/$widgetId")({
  component: AccessibilityStudioPage,
});

/** Modern SaaS ON/OFF Toggle Switch matching Studio design */
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
            checked ? "text-[#38bdf8]" : "text-zinc-500"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/40 ${
            checked ? "bg-[#38bdf8]" : "bg-zinc-700"
          }`}
        >
          <div
            className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function AccessibilityStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/accessibility/$widgetId" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord<AccessibilityConfig> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"appearance" | "position" | "features" | "behavior" | "install">("appearance");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load widget data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getWidget(widgetId);
        if (data && data.type === "accessibility") {
          const config = data.config || {};
          const merged: AccessibilityConfig = {
            appearance: {
              ...DEFAULT_ACCESSIBILITY_CONFIG.appearance,
              ...(config.appearance || {}),
            },
            features: {
              ...DEFAULT_ACCESSIBILITY_CONFIG.features,
              ...(config.features || {}),
            },
            behavior: {
              ...DEFAULT_ACCESSIBILITY_CONFIG.behavior,
              ...(config.behavior || {}),
            },
          };
          setWidget({
            ...data,
            config: merged,
          } as WidgetInstanceRecord<AccessibilityConfig>);
        } else {
          toast.error("Widget not found or invalid type");
          navigate({ to: "/dashboard/widgets" as any });
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading widget");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [widgetId, navigate]);

  // Update Config Subsections
  const updateAppearance = (patch: Partial<AccessibilityConfig["appearance"]>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          appearance: { ...prev.config.appearance, ...patch },
        },
      };
    });
  };

  const updateFeatures = (patch: Partial<AccessibilityConfig["features"]>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          features: { ...prev.config.features, ...patch },
        },
      };
    });
  };

  const updateBehavior = (patch: Partial<AccessibilityConfig["behavior"]>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          behavior: { ...prev.config.behavior, ...patch },
        },
      };
    });
  };

  // Apply Preset Template
  const handleApplyPreset = (tplKey: string) => {
    const tpl = ACCESSIBILITY_TEMPLATES[tplKey];
    if (!tpl || !widget) return;
    setWidget({
      ...widget,
      config: JSON.parse(JSON.stringify(tpl.config)),
    });
    toast.success(`Preset "${tpl.name}" applied!`);
  };

  // Save changes
  const handleSave = async () => {
    if (!widget) return;
    setSaving(true);
    try {
      await saveWidget(widget);
      toast.success("Changes saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Publish Widget
  const handlePublish = async () => {
    if (!widget) return;
    setPublishing(true);
    try {
      await publishWidget(widget);
      setWidget({ ...widget, status: "published" });
      toast.success("Accessibility Widget published live!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish widget");
    } finally {
      setPublishing(false);
    }
  };

  // Render HTML for Preview
  const renderedOutput = useMemo(() => {
    if (!widget) return { html: "", css: "" };
    return renderAccessibilityHtml(widget, {
      device: previewDevice,
      isPreview: true,
    });
  }, [widget, previewDevice, previewKey]);

  // Attach interactivity to preview
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const cleanup = attachAccessibilityInteractivity(previewContainerRef.current, { isPreview: true });
    return cleanup;
  }, [renderedOutput, previewKey]);

  const embedCode = useMemo(() => {
    if (!widget) return "";
    return `<div data-wto-widget="${widget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [widget]);

  const handleCopyEmbed = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopiedEmbed(false), 2200);
  };

  const handleResetPreview = () => {
    setPreviewKey((prev) => prev + 1);
    toast.success("Preview reset to original website state.");
  };

  if (loading || !widget) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading Accessibility Studio…</span>
        </div>
      </div>
    );
  }

  const { appearance, features, behavior } = widget.config;

  return (
    <div className="h-screen flex flex-col bg-[#121214] text-zinc-100 overflow-hidden font-sans">
      {/* ================= TOP NAVIGATION / HEADER ================= */}
      <WidgetStudioHeader
        widgetName={widget.name}
        onWidgetNameChange={(name) => setWidget({ ...widget, name })}
        status={widget.status}
        icon={<Accessibility className="w-3.5 h-3.5" />}
        iconBgClass="bg-[#38bdf8]/15 border-[#38bdf8]/30 text-[#38bdf8]"
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        onResetPreview={() => setPreviewKey((k) => k + 1)}
        onOpenEmbed={() => setActiveTab("install")}
        onSaveDraft={handleSave}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* ================= MAIN SPLIT WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Settings Panel */}
        <div className="w-[440px] border-r border-zinc-800/80 bg-zinc-950 flex flex-col shrink-0 overflow-hidden">
          {/* Tabs bar */}
          <div className="h-12 border-b border-zinc-800/80 px-2 flex items-center gap-1 bg-zinc-900/40 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === "appearance"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Appearance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("position")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === "position"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Position</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("features")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === "features"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Features</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("behavior")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === "behavior"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Behavior</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("install")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeTab === "install"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Install</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
            {/* ================= TAB 1: APPEARANCE ================= */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                {/* Preset Templates */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Preset Templates</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACCESSIBILITY_TEMPLATE_LIST.map((tpl) => (
                      <button
                        key={tpl.key}
                        type="button"
                        onClick={() => handleApplyPreset(tpl.key)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                          appearance.template === tpl.key
                            ? "bg-[#38bdf8]/10 border-[#38bdf8] text-white"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold truncate">{tpl.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium">
                            {tpl.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 leading-snug">{tpl.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-800/80" />

                {/* Display Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300">Launcher Button Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "floating_icon", label: "Circular Icon", desc: "Clean circular accessibility trigger" },
                      { key: "floating_icon_with_label", label: "Pill with Label", desc: "Pill badge with custom text" },
                    ].map((style) => (
                      <button
                        key={style.key}
                        type="button"
                        onClick={() => updateAppearance({ displayStyle: style.key as AccessibilityDisplayStyle })}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          appearance.displayStyle === style.key
                            ? "bg-[#38bdf8]/15 border-[#38bdf8] text-white"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <span className="text-xs font-bold block">{style.label}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{style.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Label (if pill) */}
                {appearance.displayStyle === "floating_icon_with_label" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Button Label</label>
                    <input
                      type="text"
                      value={appearance.buttonLabel}
                      onChange={(e) => updateAppearance({ buttonLabel: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                      placeholder="Accessibility"
                    />
                  </div>
                )}

                {/* Colors */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-300">Color Palette</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Background</span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={appearance.backgroundColor}
                          onChange={(e) => updateAppearance({ backgroundColor: e.target.value })}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-xs text-zinc-300">{appearance.backgroundColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Accent Color</span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={appearance.accentColor}
                          onChange={(e) => updateAppearance({ accentColor: e.target.value })}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-xs text-zinc-300">{appearance.accentColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Text Color</span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={appearance.textColor}
                          onChange={(e) => updateAppearance({ textColor: e.target.value })}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-xs text-zinc-300">{appearance.textColor}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Card Background</span>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                        <input
                          type="color"
                          value={appearance.cardBgColor}
                          onChange={(e) => updateAppearance({ cardBgColor: e.target.value })}
                          className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="font-mono text-xs text-zinc-300">{appearance.cardBgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Border Radius & Shadow */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Border Radius ({appearance.borderRadius}px)</label>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={appearance.borderRadius}
                      onChange={(e) => updateAppearance({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Shadow</label>
                    <select
                      value={appearance.shadowIntensity}
                      onChange={(e) => updateAppearance({ shadowIntensity: e.target.value as AccessibilityShadow })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
                    >
                      <option value="none">None</option>
                      <option value="soft">Soft</option>
                      <option value="medium">Medium</option>
                      <option value="intense">Intense</option>
                    </select>
                  </div>
                </div>

                {/* Tooltip Configuration */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <StudioSwitch
                    label="Show Hover Tooltip"
                    checked={appearance.showTooltip}
                    onChange={(checked) => updateAppearance({ showTooltip: checked })}
                    description="Displays assistive tooltip hint when visitors hover on the launcher button."
                  />
                  {appearance.showTooltip && (
                    <input
                      type="text"
                      value={appearance.tooltipText}
                      onChange={(e) => updateAppearance({ tooltipText: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
                      placeholder="Accessibility Options (Alt + A)"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: POSITION (FIXED VIEWPORT) ================= */}
            {activeTab === "position" && (
              <div className="space-y-6">
                {/* Fixed Viewport Property Info Card */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-wide">
                      Fixed Viewport Property: position: fixed
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    This widget is permanently fixed to the visitor’s screen. It never scrolls off, drifts, or hides behind sticky headers, navigation menus, or container divs (Max Z-Index: 2,147,483,647).
                  </p>
                </div>

                {/* Fixed Position on Screen */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-200 block">
                    Fixed Screen Placement
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Choose which corner of the browser viewport to anchor the fixed accessibility button.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: "bottom_right", label: "Bottom Right (Fixed)", desc: "Standard fixed corner (Recommended)" },
                      { key: "bottom_left", label: "Bottom Left (Fixed)", desc: "Fixed anchor on bottom-left" },
                      { key: "top_right", label: "Top Right (Fixed)", desc: "Fixed anchor on top-right" },
                      { key: "top_left", label: "Top Left (Fixed)", desc: "Fixed anchor on top-left" },
                    ].map((pos) => (
                      <button
                        key={pos.key}
                        type="button"
                        onClick={() => updateAppearance({ position: pos.key as AccessibilityPosition })}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          appearance.position === pos.key
                            ? "bg-[#38bdf8]/15 border-[#38bdf8] text-white shadow-sm ring-1 ring-[#38bdf8]/50"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <span className="text-xs font-bold block">{pos.label}</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{pos.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-800/80" />

                {/* Offsets */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-200 block">
                    Screen Edge Distances
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400 font-medium">Offset X (Horizontal)</span>
                        <span className="text-[#38bdf8] font-bold">{appearance.offsetX}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="2"
                        value={appearance.offsetX}
                        onChange={(e) => updateAppearance({ offsetX: Number(e.target.value) })}
                        className="w-full accent-[#38bdf8]"
                      />
                    </div>
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400 font-medium">Offset Y (Vertical)</span>
                        <span className="text-[#38bdf8] font-bold">{appearance.offsetY}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="2"
                        value={appearance.offsetY}
                        onChange={(e) => updateAppearance({ offsetY: Number(e.target.value) })}
                        className="w-full accent-[#38bdf8]"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-zinc-800/80" />

                {/* Sizing & Drawer Room */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-200 block">
                    Drawer &amp; Button Sizing
                  </label>
                  <div className="space-y-3">
                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-300 font-medium">Drawer Panel Width</span>
                        <span className="text-[#38bdf8] font-bold">{appearance.panelWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="360"
                        max="520"
                        step="10"
                        value={appearance.panelWidth}
                        onChange={(e) => updateAppearance({ panelWidth: Number(e.target.value) })}
                        className="w-full accent-[#38bdf8]"
                      />
                      <p className="text-[10px] text-zinc-500 pt-0.5">
                        Default 420px. Gives fonts, text resizers, and buttons comfortable room so nothing is cramped.
                      </p>
                    </div>

                    <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl space-y-1">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-300 font-medium">Fixed Button Size</span>
                        <span className="text-[#38bdf8] font-bold">{appearance.buttonSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="44"
                        max="76"
                        step="2"
                        value={appearance.buttonSize}
                        onChange={(e) => updateAppearance({ buttonSize: Number(e.target.value) })}
                        className="w-full accent-[#38bdf8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: FEATURES ================= */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Text &amp; Readability Controls</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 mb-3">
                    Choose which text customization tools appear inside the visitor toolbar.
                  </p>
                  <div className="space-y-1 bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-xl">
                    <StudioSwitch
                      label="Text Size Resizer (A- / A+)"
                      checked={features.textResize}
                      onChange={(checked) => updateFeatures({ textResize: checked })}
                      description="Allows visitors to step font sizes from 80% up to 160%."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Line Spacing (Height)"
                      checked={features.lineSpacing}
                      onChange={(checked) => updateFeatures({ lineSpacing: checked })}
                      description="Expands line height to 1.85 for relaxed readability."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Letter &amp; Word Spacing"
                      checked={features.letterSpacing}
                      onChange={(checked) => updateFeatures({ letterSpacing: checked })}
                      description="Increases character tracking to reduce reading crowding."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Readable Sans Font"
                      checked={features.readableFont}
                      onChange={(checked) => updateFeatures({ readableFont: checked })}
                      description="Switches complex fonts to a clean, legible system sans-serif."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Highlight Headings"
                      checked={features.highlightHeadings}
                      onChange={(checked) => updateFeatures({ highlightHeadings: checked })}
                      description="Adds clear dashed markers around H1–H6 elements."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Highlight Links"
                      checked={features.highlightLinks}
                      onChange={(checked) => updateFeatures({ highlightLinks: checked })}
                      description="Emphasizes hyperlinks with distinct underlines and contrast."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Reading Guide Ruler"
                      checked={features.readingGuide}
                      onChange={(checked) => updateFeatures({ readingGuide: checked })}
                      description="Horizontal guide line that smoothly tracks mouse cursor."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Enlarged High-Visibility Cursor"
                      checked={features.largeCursor}
                      onChange={(checked) => updateFeatures({ largeCursor: checked })}
                      description="Replaces standard mouse pointer with an oversized high-contrast cursor."
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-200 mb-1 flex items-center gap-1.5">
                    <SunMoon className="w-3.5 h-3.5 text-[#facc15]" />
                    <span>Color, Contrast &amp; Motion Controls</span>
                  </h4>
                  <div className="space-y-1 bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-xl">
                    <StudioSwitch
                      label="High Contrast Mode"
                      checked={features.highContrast}
                      onChange={(checked) => updateFeatures({ highContrast: checked })}
                      description="High-contrast dark background with bright yellow text."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Invert Colors Mode"
                      checked={features.darkContrast}
                      onChange={(checked) => updateFeatures({ darkContrast: checked })}
                      description="Inverts page luminance without distorting the toolbar."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Monochrome (Grayscale) Mode"
                      checked={features.monochrome}
                      onChange={(checked) => updateFeatures({ monochrome: checked })}
                      description="Removes all distracting color saturation."
                    />
                    <div className="h-px bg-zinc-800/60" />
                    <StudioSwitch
                      label="Stop Motion &amp; Animations"
                      checked={features.reducedMotion}
                      onChange={(checked) => updateFeatures({ reducedMotion: checked })}
                      description="Freezes CSS keyframe animations and distracting transitions."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: BEHAVIOR ================= */}
            {activeTab === "behavior" && (
              <div className="space-y-6">
                <div className="space-y-2 bg-zinc-900/60 border border-zinc-850 p-3.5 rounded-xl">
                  <StudioSwitch
                    label="Remember Visitor Preferences"
                    checked={behavior.rememberPreferences}
                    onChange={(checked) => updateBehavior({ rememberPreferences: checked })}
                    description="Stores active choices in site-scoped localStorage so repeat visits stay customized."
                  />
                  <div className="h-px bg-zinc-800/60 my-2" />
                  <StudioSwitch
                    label="Keyboard Hotkey (Alt + A)"
                    checked={behavior.hotkeyEnabled}
                    onChange={(checked) => updateBehavior({ hotkeyEnabled: checked })}
                    description="Allows motor-impaired visitors to trigger toolbar anytime using Alt + A."
                  />
                </div>

                {/* Default text scale & contrast */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-200">Default Initial State</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">
                        Default Text Scale ({behavior.defaultTextScale}%)
                      </label>
                      <input
                        type="range"
                        min="90"
                        max="130"
                        step="5"
                        value={behavior.defaultTextScale}
                        onChange={(e) => updateBehavior({ defaultTextScale: Number(e.target.value) })}
                        className="w-full accent-[#38bdf8]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Default Contrast</label>
                      <select
                        value={behavior.defaultContrast}
                        onChange={(e) => updateBehavior({ defaultContrast: e.target.value as AccessibilityContrastMode })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="none">Standard (None)</option>
                        <option value="high_contrast">High Contrast</option>
                        <option value="inverted">Inverted</option>
                        <option value="monochrome">Monochrome</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Responsive Toggles */}
                <div className="space-y-2 bg-zinc-900/60 border border-zinc-850 p-3.5 rounded-xl">
                  <h4 className="text-xs font-bold text-zinc-200 mb-2">Device Visibility</h4>
                  <StudioSwitch
                    label="Show on Desktop"
                    checked={behavior.visibleOnDesktop}
                    onChange={(checked) => updateBehavior({ visibleOnDesktop: checked })}
                  />
                  <div className="h-px bg-zinc-800/60 my-1" />
                  <StudioSwitch
                    label="Show on Mobile &amp; Tablets"
                    checked={behavior.visibleOnMobile}
                    onChange={(checked) => updateBehavior({ visibleOnMobile: checked })}
                  />
                </div>
              </div>
            )}

            {/* ================= TAB 4: INSTALLATION ================= */}
            {activeTab === "install" && (
              <div className="space-y-6">
                {/* Embed Snippet Card */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Universal Embed Snippet</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmbed}
                      className="px-2.5 py-1 rounded bg-[#38bdf8] text-zinc-950 font-bold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 transition"
                    >
                      {copiedEmbed ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmbed ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                    {embedCode}
                  </pre>
                  <p className="text-[11px] text-zinc-400">
                    Paste this snippet immediately before the closing <code className="text-zinc-300">&lt;/body&gt;</code> tag on your website.
                  </p>
                </div>

                {/* Platform Guides */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white">Platform Instructions</h4>

                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <div className="text-xs font-bold text-zinc-200">1. HTML / Static Site</div>
                    <p className="text-[11px] text-zinc-400">
                      Paste the code snippet into your base layout or footer template immediately before <code className="text-zinc-300">&lt;/body&gt;</code>.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <div className="text-xs font-bold text-zinc-200">2. WordPress</div>
                    <p className="text-[11px] text-zinc-400">
                      Paste into <em>Appearance &gt; Theme File Editor &gt; footer.php</em> or use any code-injection plugin.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <div className="text-xs font-bold text-zinc-200">3. Shopify / Squarespace / Wix</div>
                    <p className="text-[11px] text-zinc-400">
                      Add to your site theme settings under Custom Code &gt; Body Footer.
                    </p>
                  </div>
                </div>

                {/* Accurate Compliance Disclaimer */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Compliance &amp; Best Practices Disclosure</span>
                  </div>
                  <p className="text-amber-200/90">
                    This widget provides valuable assistive viewing options to help visitors with visual, cognitive, and motor preferences.
                    However, adding an accessibility toolbar alone does not make a website automatically compliant with WCAG, ADA, or statutory legal standards.
                    Ensure your underlying website also features semantic HTML, accessible form labels, keyboard navigation, and meaningful alt attributes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Interactive Website Preview */}
        <div className="flex-1 bg-[#0a0a0c] flex flex-col overflow-hidden relative">
          {/* Top Canvas Bar */}
          <div className="h-10 border-b border-zinc-800/80 bg-zinc-950/80 px-4 flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              <span className="font-semibold text-zinc-300">Live Website Preview</span>
              <span className="text-zinc-500 text-[11px]">
                ({previewDevice === "desktop" ? "Desktop 100%" : "Mobile 375px"})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetPreview}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium flex items-center gap-1 transition"
                title="Reset sample page state"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Preview</span>
              </button>

              <div className="h-3.5 w-px bg-zinc-800" />

              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded transition ${
                    previewDevice === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Desktop Viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded transition ${
                    previewDevice === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Mobile Viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Viewport Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center">
            <div
              className={`transition-all duration-300 shadow-2xl rounded-2xl border border-zinc-800 relative bg-white text-zinc-900 overflow-hidden flex flex-col ${
                previewDevice === "desktop" ? "w-full max-w-[1040px] h-full" : "w-[375px] h-[667px]"
              }`}
            >
              {/* Browser Mockup Chrome Bar */}
              <div className="h-8 bg-zinc-100 border-b border-zinc-200 px-3 flex items-center gap-2 shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-white border border-zinc-200 rounded text-[10px] text-zinc-500 px-2 py-0.5 text-center truncate">
                  https://my-store-example.com
                </div>
              </div>

              {/* Sample Host Website Content Area that actually tests the accessibility tools */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 relative select-text">
                {/* Mock Website Header */}
                <header className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                      A
                    </div>
                    <span className="font-extrabold text-base tracking-tight text-zinc-900">Apex Studio</span>
                  </div>
                  <nav className="flex items-center gap-4 text-xs font-semibold text-zinc-600">
                    <a href="#services" className="hover:text-blue-600 transition">Services</a>
                    <a href="#about" className="hover:text-blue-600 transition">About Us</a>
                    <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
                    <a href="#contact" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Contact</a>
                  </nav>
                </header>

                {/* Hero Section */}
                <section className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next-Generation Accessibility Testing</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-tight">
                    Making the Web Enjoyable, Legible &amp; Accessible for Everyone
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
                    Experience our live accessibility toolbar right here. Click the floating accessibility icon in the corner to resize text, enhance contrast, highlight links, and turn on the reading guide ruler in real time.
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href="#get-started"
                      className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition shadow-sm inline-flex items-center gap-1.5"
                    >
                      <span>Explore Catalog</span>
                      <span>→</span>
                    </a>
                    <a
                      href="#documentation"
                      className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 font-semibold text-xs hover:bg-zinc-50 transition"
                    >
                      Read Documentation
                    </a>
                  </div>
                </section>

                {/* Feature Grid with Headings and Links to test highlights */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                    <h2 className="text-sm font-bold text-zinc-900">Dynamic Text Resizing</h2>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Scale body typography seamlessly from 80% to 160% without breaking column layouts. Test it using the A+ control.
                    </p>
                    <a href="#learn-more" className="text-xs font-bold text-blue-600 hover:underline inline-block">
                      Learn how font scaling works →
                    </a>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                    <h2 className="text-sm font-bold text-zinc-900">Color Contrast Modes</h2>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Toggle high contrast, dark inverted, and grayscale desaturation. Notice how the accessibility widget remains perfectly styled!
                    </p>
                    <a href="#contrast-guide" className="text-xs font-bold text-blue-600 hover:underline inline-block">
                      View contrast standards →
                    </a>
                  </div>
                </section>

                {/* Form Example to test inputs */}
                <section className="p-5 rounded-xl border border-zinc-200 bg-white space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Subscribe for Updates</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      defaultValue="visitor@example.com"
                      className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-xs text-zinc-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                    >
                      Subscribe
                    </button>
                  </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-zinc-200 pt-4 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>© 2026 Apex Studio. All rights reserved.</span>
                  <div className="flex items-center gap-3">
                    <a href="#privacy" className="hover:underline">Privacy Policy</a>
                    <a href="#terms" className="hover:underline">Terms of Service</a>
                  </div>
                </footer>
              </div>

              {/* Mounted Accessibility Widget Container inside the live preview */}
              <div
                ref={previewContainerRef}
                dangerouslySetInnerHTML={{ __html: renderedOutput.html }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
