import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getWidget,
  saveWidget,
  publishWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  type CountdownConfig,
  type CountdownTimerMode,
  type CountdownTimerStyle,
  type CountdownNumberAnimation,
  type CountdownPosition,
  type CountdownExpiryAction,
  COUNTDOWN_TEMPLATES,
  calculateTargetTimestamp,
} from "@/services/countdownTemplates";
import {
  renderCountdownHtml,
  attachCountdownInteractivity,
} from "@/lib/widget-runtime/countdownRuntime";
import {
  ArrowLeft,
  Clock,
  Sliders,
  Layers,
  Palette,
  ExternalLink,
  Code2,
  CheckCircle2,
  Eye,
  RefreshCw,
  X,
  Type,
  Maximize2,
  MousePointerClick,
  Sparkles,
  Zap,
  Flame,
  Rocket,
  Gift,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { WidgetStudioHeader } from "@/components/widgets/WidgetStudioHeader";

export const Route = createFileRoute("/dashboard/widgets/countdown/$widgetId")({
  component: CountdownStudioPage,
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
            checked ? "text-amber-400" : "text-zinc-500"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
            checked ? "bg-amber-400" : "bg-zinc-700"
          }`}
        >
          <div
            className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
              checked ? "translate-x-5 bg-black" : "translate-x-0 bg-zinc-300"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

/** Color Swatch Input Component */
function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-zinc-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-zinc-400">{value}</span>
        <label className="relative cursor-pointer">
          <div
            className="w-7 h-7 rounded-lg border border-zinc-700 shadow-sm transition hover:scale-105"
            style={{ backgroundColor: value || "#ffffff" }}
          />
          <input
            type="color"
            value={value && value.startsWith("#") ? value.slice(0, 7) : "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}

function CountdownStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/countdown/$widgetId" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord<CountdownConfig> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"timer" | "content" | "style" | "theme" | "actions">("timer");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load Widget Instance
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const found = await getWidget(widgetId);
        if (mounted) {
          if (found) {
            let loaded = found as WidgetInstanceRecord<CountdownConfig>;
            if (!loaded.config?.targetTimestamp || loaded.config.targetTimestamp <= 0) {
              const now = Date.now();
              const initialTarget = calculateTargetTimestamp(loaded.config, {
                forceRecalculate: true,
                baseStartTime: now,
              });
              loaded = {
                ...loaded,
                config: {
                  ...loaded.config,
                  adminStartTime: loaded.config.adminStartTime || now,
                  targetTimestamp: initialTarget,
                },
              };
              void saveWidget(loaded);
            }
            setWidget(loaded);
          } else {
            toast.error("Widget not found");
            navigate({ to: "/dashboard/widgets" as any });
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load widget");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [widgetId, navigate]);

  // Update Config Helper
  const updateConfig = (patch: Partial<CountdownConfig>, options?: { resetTiming?: boolean }) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      const nextConfig: CountdownConfig = {
        ...prev.config,
        ...patch,
      };

      // Recalculate targetTimestamp ONLY if a timing-relevant property was actually modified or an explicit reset was requested
      const timingChanged =
        options?.resetTiming ||
        (patch.timerMode !== undefined && patch.timerMode !== prev.config.timerMode) ||
        (patch.targetDate !== undefined && patch.targetDate !== prev.config.targetDate) ||
        (patch.targetTime !== undefined && patch.targetTime !== prev.config.targetTime) ||
        (patch.timezone !== undefined && patch.timezone !== prev.config.timezone) ||
        (patch.durationValue !== undefined && Number(patch.durationValue) !== Number(prev.config.durationValue)) ||
        (patch.durationUnit !== undefined && patch.durationUnit !== prev.config.durationUnit) ||
        (patch.recurringIntervalHours !== undefined && Number(patch.recurringIntervalHours) !== Number(prev.config.recurringIntervalHours));

      if (timingChanged) {
        const now = Date.now();
        nextConfig.adminStartTime = now;
        nextConfig.targetTimestamp = calculateTargetTimestamp(nextConfig, {
          forceRecalculate: true,
          baseStartTime: now,
        });
      } else {
        // Keep existing saved targetTimestamp without restarting or drifting
        nextConfig.adminStartTime = prev.config.adminStartTime;
        nextConfig.targetTimestamp = prev.config.targetTimestamp;
      }

      const updated = {
        ...prev,
        config: nextConfig,
      };
      void saveWidget(updated);
      return updated;
    });
  };

  // Update Nested Colors
  const updateColors = (patch: Partial<CountdownConfig["colors"]>) => {
    if (!widget) return;
    updateConfig({
      colors: {
        ...widget.config.colors,
        ...patch,
      },
    });
  };

  // Update Nested Typography
  const updateTypography = (patch: Partial<CountdownConfig["typography"]>) => {
    if (!widget) return;
    updateConfig({
      typography: {
        ...widget.config.typography,
        ...patch,
      },
    });
  };

  // Update Nested Spacing
  const updateSpacing = (patch: Partial<CountdownConfig["spacing"]>) => {
    if (!widget) return;
    updateConfig({
      spacing: {
        ...widget.config.spacing,
        ...patch,
      },
    });
  };

  // Update Nested Effects
  const updateEffects = (patch: Partial<CountdownConfig["effects"]>) => {
    if (!widget) return;
    updateConfig({
      effects: {
        ...widget.config.effects,
        ...patch,
      },
    });
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!widget) return;
    setSaving(true);
    try {
      await saveWidget(widget);
      toast.success("Draft saved successfully");
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
      setWidget(pub as WidgetInstanceRecord<CountdownConfig>);
      toast.success("Widget published! Live snapshot updated.");
    } catch (err) {
      toast.error("Failed to publish widget");
    } finally {
      setPublishing(false);
    }
  };

  // Reset Live Timer Preview & synchronize deadline
  const handleResetPreview = () => {
    if (!widget) return;
    const now = Date.now();
    const newTarget = calculateTargetTimestamp(
      { ...widget.config, adminStartTime: now },
      { forceRecalculate: true, baseStartTime: now }
    );

    const updated = {
      ...widget,
      config: {
        ...widget.config,
        adminStartTime: now,
        targetTimestamp: newTarget,
      },
    };
    setWidget(updated);
    void saveWidget(updated);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`wto_cd_visitor_${widget.id}`);
    }
    setPreviewKey((k) => k + 1);
    toast.info("Countdown timer reset and synchronized");
  };

  // Trigger Expiry Test in Preview
  const handleTestExpiry = () => {
    if (!widget) return;
    if (previewContainerRef.current) {
      const days = previewContainerRef.current.querySelector<HTMLElement>('[data-digit-for="days"]');
      const hours = previewContainerRef.current.querySelector<HTMLElement>('[data-digit-for="hours"]');
      const mins = previewContainerRef.current.querySelector<HTMLElement>('[data-digit-for="minutes"]');
      const secs = previewContainerRef.current.querySelector<HTMLElement>('[data-digit-for="seconds"]');
      const inner = previewContainerRef.current.querySelector<HTMLElement>(".wto-cd-inner");
      const expiryMsg = previewContainerRef.current.querySelector<HTMLElement>(".wto-cd-expiry-message");

      if (days) days.textContent = "00";
      if (hours) hours.textContent = "00";
      if (mins) mins.textContent = "00";
      if (secs) secs.textContent = "00";

      if (widget.config.expiryAction === "message") {
        if (inner) inner.style.display = "none";
        if (expiryMsg) expiryMsg.style.display = "block";
      } else if (widget.config.expiryAction === "hide") {
        if (previewContainerRef.current.firstElementChild) {
          (previewContainerRef.current.firstElementChild as HTMLElement).style.display = "none";
        }
      }
      toast.info(`Tested expiry action: "${widget.config.expiryAction}"`);
    }
  };

  // Generate Rendered HTML
  const renderedOutput = useMemo(() => {
    if (!widget) return { html: "", css: "" };
    return renderCountdownHtml(widget, { device: previewDevice });
  }, [widget, previewDevice, previewKey]);

  // Attach live countdown interactivity to the preview container
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const cleanup = attachCountdownInteractivity(previewContainerRef.current, { isPreview: true });
    return cleanup;
  }, [renderedOutput, previewKey]);

  // Generate Embed Code
  const embedCode = useMemo(() => {
    if (!widget) return "";
    return `<div data-wto-widget="${widget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [widget]);

  if (loading || !widget) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading Countdown Studio…</span>
        </div>
      </div>
    );
  }

  const cfg = widget.config;
  const isPublished = widget.status === "published";

  return (
    <div className="h-screen w-full flex flex-col bg-[#121214] text-zinc-100 overflow-hidden select-none">
      {/* Top Studio Navbar */}
      <WidgetStudioHeader
        widgetName={widget.name}
        onWidgetNameChange={(name) => setWidget({ ...widget, name })}
        status={widget.status}
        icon={<Clock className="w-3.5 h-3.5" />}
        iconBgClass="bg-amber-400/15 border-amber-400/30 text-amber-400"
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        onResetPreview={handleResetPreview}
        onOpenEmbed={() => setEmbedModalOpen(true)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* Main Studio Body: Left Controls Sidebar + Right Live Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-[360px] md:w-[400px] border-r border-zinc-800 bg-[#151518] flex flex-col shrink-0 overflow-hidden">
          {/* Tabs Navigation */}
          <div className="grid grid-cols-5 border-b border-zinc-800 bg-zinc-950 shrink-0 select-none overflow-hidden">
            {[
              { id: "timer", label: "Timer", icon: Clock },
              { id: "content", label: "Content", icon: Type },
              { id: "style", label: "Style", icon: Layers },
              { id: "theme", label: "Theme", icon: Palette },
              { id: "actions", label: "CTA", icon: MousePointerClick },
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

          {/* Tab Content Panels (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* ================= TAB 1: TIMER ================= */}
            {activeTab === "timer" && (
              <div className="space-y-6">
                {/* Timer Mode Selection */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2.5">
                    Timer Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "date", label: "Countdown to Date", desc: "Fixed target deadline" },
                      { key: "personal", label: "Personal Timer", desc: "Evergreen per visitor" },
                      { key: "recurring", label: "Recurring Timer", desc: "Resets every cycle" },
                      { key: "counter", label: "Number Counter", desc: "Animated counter" },
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => updateConfig({ timerMode: mode.key as CountdownTimerMode })}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          cfg.timerMode === mode.key
                            ? "bg-zinc-900 border-amber-400 ring-1 ring-amber-400/30 text-white"
                            : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                        }`}
                      >
                        <div className="text-xs font-bold text-zinc-200">{mode.label}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Mode Controls */}
                {cfg.timerMode === "date" && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <span className="text-xs font-semibold text-white block">Target Date & Time</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Date</label>
                        <input
                          type="date"
                          value={cfg.targetDate}
                          onChange={(e) => updateConfig({ targetDate: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Time</label>
                        <input
                          type="time"
                          value={cfg.targetTime}
                          onChange={(e) => updateConfig({ targetTime: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Timezone</label>
                      <select
                        value={cfg.timezone}
                        onChange={(e) => updateConfig({ timezone: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="local">User Local Timezone</option>
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York">EST (New York / Eastern)</option>
                        <option value="America/Los_Angeles">PST (Los Angeles / Pacific)</option>
                        <option value="Europe/London">GMT / BST (London)</option>
                        <option value="Asia/Kolkata">IST (India Standard Time)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Personal Mode Controls */}
                {cfg.timerMode === "personal" && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <span className="text-xs font-semibold text-white block">Personal Visitor Duration</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Duration</label>
                        <input
                          type="number"
                          min="1"
                          value={cfg.durationValue}
                          onChange={(e) => updateConfig({ durationValue: Math.max(1, Number(e.target.value)) })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Unit</label>
                        <select
                          value={cfg.durationUnit}
                          onChange={(e) => updateConfig({ durationUnit: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>

                    <StudioSwitch
                      label="Persist per Visitor"
                      checked={cfg.persistVisitor}
                      onChange={(v) => updateConfig({ persistVisitor: v })}
                      description="Stores timer in localStorage across page refreshes"
                    />
                  </div>
                )}

                {/* Recurring Mode Controls */}
                {cfg.timerMode === "recurring" && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <span className="text-xs font-semibold text-white block">Recurring Auto-Reset Interval</span>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Repeat Every (Hours)</label>
                      <input
                        type="number"
                        min="1"
                        value={cfg.recurringIntervalHours}
                        onChange={(e) =>
                          updateConfig({ recurringIntervalHours: Math.max(1, Number(e.target.value)) })
                        }
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">
                        When the timer reaches zero, it automatically loops and restarts from the beginning.
                      </p>
                    </div>
                  </div>
                )}

                {/* Number Counter Controls */}
                {cfg.timerMode === "counter" && (
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <span className="text-xs font-semibold text-white block">Number Counter Range</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Start Value</label>
                        <input
                          type="number"
                          value={cfg.counterStart}
                          onChange={(e) => updateConfig({ counterStart: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">End Value</label>
                        <input
                          type="number"
                          value={cfg.counterEnd}
                          onChange={(e) => updateConfig({ counterEnd: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Direction</label>
                        <select
                          value={cfg.counterDirection}
                          onChange={(e) => updateConfig({ counterDirection: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="down">Count Down</option>
                          <option value="up">Count Up</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Duration (Secs)</label>
                        <input
                          type="number"
                          min="1"
                          value={cfg.counterDurationSeconds}
                          onChange={(e) =>
                            updateConfig({ counterDurationSeconds: Math.max(1, Number(e.target.value)) })
                          }
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Units & Custom Labels */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Display Units & Labels
                  </label>

                  <StudioSwitch
                    label="Show Days"
                    checked={cfg.showDays}
                    onChange={(v) => updateConfig({ showDays: v })}
                    description="When disabled, remaining time intelligently rolls into hours"
                  />
                  {cfg.showDays && (
                    <input
                      type="text"
                      value={cfg.labelDays}
                      onChange={(e) => updateConfig({ labelDays: e.target.value })}
                      placeholder="Days label (e.g. Days)"
                      className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 mb-2"
                    />
                  )}

                  <StudioSwitch
                    label="Show Hours"
                    checked={cfg.showHours}
                    onChange={(v) => updateConfig({ showHours: v })}
                  />
                  {cfg.showHours && (
                    <input
                      type="text"
                      value={cfg.labelHours}
                      onChange={(e) => updateConfig({ labelHours: e.target.value })}
                      placeholder="Hours label (e.g. Hours)"
                      className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 mb-2"
                    />
                  )}

                  <StudioSwitch
                    label="Show Minutes"
                    checked={cfg.showMinutes}
                    onChange={(v) => updateConfig({ showMinutes: v })}
                  />
                  {cfg.showMinutes && (
                    <input
                      type="text"
                      value={cfg.labelMinutes}
                      onChange={(e) => updateConfig({ labelMinutes: e.target.value })}
                      placeholder="Minutes label (e.g. Minutes)"
                      className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 mb-2"
                    />
                  )}

                  <StudioSwitch
                    label="Show Seconds"
                    checked={cfg.showSeconds}
                    onChange={(v) => updateConfig({ showSeconds: v })}
                  />
                  {cfg.showSeconds && (
                    <input
                      type="text"
                      value={cfg.labelSeconds}
                      onChange={(e) => updateConfig({ labelSeconds: e.target.value })}
                      placeholder="Seconds label (e.g. Seconds)"
                      className="w-full px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-200 mb-2"
                    />
                  )}

                  <StudioSwitch
                    label="Display Labels"
                    checked={cfg.showLabels}
                    onChange={(v) => updateConfig({ showLabels: v })}
                    description="Show or hide the text labels underneath numbers"
                  />
                </div>

                {/* Number Animation */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    Number Change Animation
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { key: "none", label: "None" },
                      { key: "fade", label: "Fade" },
                      { key: "slide", label: "Slide" },
                      { key: "flip", label: "Flip" },
                    ].map((anim) => (
                      <button
                        key={anim.key}
                        type="button"
                        onClick={() => updateConfig({ animation: anim.key as CountdownNumberAnimation })}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${
                          cfg.animation === anim.key
                            ? "bg-amber-400 text-black border-amber-400 shadow-sm"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {anim.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expiry Behavior */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">When Timer Reaches Zero</span>
                    <button
                      type="button"
                      onClick={handleTestExpiry}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Test Expiry
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { key: "hide", label: "Hide Timer Entirely" },
                      { key: "message", label: "Display Custom Message" },
                      { key: "redirect", label: "Redirect Visitor to URL" },
                      { key: "restart", label: "Restart Timer" },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs border transition ${
                          cfg.expiryAction === opt.key
                            ? "bg-zinc-800 border-amber-400 text-white font-medium"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="expiryAction"
                          checked={cfg.expiryAction === opt.key}
                          onChange={() => updateConfig({ expiryAction: opt.key as CountdownExpiryAction })}
                          className="text-amber-400 focus:ring-0"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  {cfg.expiryAction === "message" && (
                    <div className="pt-2">
                      <label className="text-[11px] text-zinc-400 block mb-1">Expired Message</label>
                      <textarea
                        rows={2}
                        value={cfg.expiryMessage}
                        onChange={(e) => updateConfig({ expiryMessage: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}

                  {cfg.expiryAction === "redirect" && (
                    <div className="pt-2">
                      <label className="text-[11px] text-zinc-400 block mb-1">Redirect URL</label>
                      <input
                        type="url"
                        value={cfg.expiryRedirectUrl}
                        onChange={(e) => updateConfig({ expiryRedirectUrl: e.target.value })}
                        placeholder="https://example.com/expired"
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: CONTENT ================= */}
            {activeTab === "content" && (
              <div className="space-y-5">
                {/* Badge Section */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <StudioSwitch
                    label="Urgency Badge / Tag"
                    checked={cfg.showBadge}
                    onChange={(v) => updateConfig({ showBadge: v })}
                    description="Highlight promotional tag above heading"
                  />
                  {cfg.showBadge && (
                    <>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={cfg.badgeText}
                          onChange={(e) => updateConfig({ badgeText: e.target.value })}
                          placeholder="e.g. FLASH DEAL 50% OFF"
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Badge Icon</label>
                        <div className="flex gap-2">
                          {[
                            { key: "fire", icon: Flame },
                            { key: "zap", icon: Zap },
                            { key: "rocket", icon: Rocket },
                            { key: "sparkles", icon: Sparkles },
                            { key: "gift", icon: Gift },
                            { key: "clock", icon: Clock },
                          ].map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => updateConfig({ badgeIcon: item.key })}
                                className={`p-2 rounded-lg border transition ${
                                  cfg.badgeIcon === item.key
                                    ? "bg-amber-400 text-black border-amber-400"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                                }`}
                              >
                                <IconComponent className="w-3.5 h-3.5" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Heading & Description */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Heading</label>
                    <input
                      type="text"
                      value={cfg.heading}
                      onChange={(e) => updateConfig({ heading: e.target.value })}
                      placeholder="e.g. Special Offer Ends Soon"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={cfg.description}
                      onChange={(e) => updateConfig({ description: e.target.value })}
                      placeholder="e.g. Don't miss out on this limited seasonal discount."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Typography formatting */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <span className="text-xs font-semibold text-white block">Formatting & Alignment</span>
                  
                  {/* Heading Style */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Heading Style</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => updateConfig({ headingBold: !cfg.headingBold })}
                        className={`p-1.5 rounded transition ${cfg.headingBold ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Bold Heading"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig({ headingItalic: !cfg.headingItalic })}
                        className={`p-1.5 rounded transition ${cfg.headingItalic ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Italic Heading"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig({ headingUnderline: !cfg.headingUnderline })}
                        className={`p-1.5 rounded transition ${cfg.headingUnderline ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Underline Heading"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description Style */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Description Style</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => updateConfig({ descBold: !cfg.descBold })}
                        className={`p-1.5 rounded transition ${cfg.descBold ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Bold Description"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig({ descItalic: !cfg.descItalic })}
                        className={`p-1.5 rounded transition ${cfg.descItalic ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Italic Description"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig({ descUnderline: !cfg.descUnderline })}
                        className={`p-1.5 rounded transition ${cfg.descUnderline ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Underline Description"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Text Alignment</span>
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => updateConfig({ contentAlign: "left" })}
                        className={`p-1.5 rounded transition ${cfg.contentAlign === "left" ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Align Left"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig({ contentAlign: "center" })}
                        className={`p-1.5 rounded transition ${cfg.contentAlign === "center" ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Align Center"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig({ contentAlign: "right" })}
                        className={`p-1.5 rounded transition ${cfg.contentAlign === "right" ? "bg-zinc-800 text-amber-400 font-bold" : "text-zinc-500 hover:text-white"}`}
                        title="Align Right"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: STYLE & POSITION ================= */}
            {activeTab === "style" && (
              <div className="space-y-6">
                {/* Visual Timer Styles with Mini Previews */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2.5">
                    Timer Visual Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: "classic",
                        name: "Classic",
                        preview: "12 : 34",
                        styleHint: "Bordered text",
                      },
                      {
                        key: "cards",
                        name: "Cards",
                        preview: "[12] [34]",
                        styleHint: "Elevated boxes",
                      },
                      {
                        key: "minimal",
                        name: "Minimal",
                        preview: "12 : 34",
                        styleHint: "Clean inline colon",
                      },
                      {
                        key: "flip",
                        name: "Flip",
                        preview: "12|34",
                        styleHint: "Split flap clock",
                      },
                      {
                        key: "modern",
                        name: "Modern",
                        preview: "( 12 ) ( 34 )",
                        styleHint: "Pill glass cards",
                      },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => updateConfig({ timerStyle: st.key as CountdownTimerStyle })}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          cfg.timerStyle === st.key
                            ? "bg-zinc-900 border-amber-400 ring-1 ring-amber-400/30 text-white shadow-md shadow-amber-500/5"
                            : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-zinc-200">{st.name}</span>
                          <span className="text-[10px] text-zinc-500">{st.styleHint}</span>
                        </div>
                        <div className="bg-zinc-950 p-2 rounded-lg text-center font-mono text-xs font-semibold text-amber-300 tracking-wider">
                          {st.preview}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Position & Sticky Controls */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <span className="text-xs font-semibold text-white block">Widget Placement</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: "inline", label: "Inline" },
                      { key: "full_width", label: "Full Width" },
                      { key: "top_bar", label: "Top Bar" },
                      { key: "bottom_bar", label: "Bottom Bar" },
                    ].map((pos) => (
                      <button
                        key={pos.key}
                        type="button"
                        onClick={() => updateConfig({ position: pos.key as CountdownPosition })}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${
                          cfg.position === pos.key
                            ? "bg-amber-400 text-black border-amber-400"
                            : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>

                  {(cfg.position === "top_bar" || cfg.position === "bottom_bar") && (
                    <div className="pt-2 border-t border-zinc-800 space-y-2">
                      <StudioSwitch
                        label="Sticky Bar"
                        checked={cfg.sticky}
                        onChange={(v) => updateConfig({ sticky: v })}
                        description="Keeps banner fixed on screen during scroll"
                      />
                      <StudioSwitch
                        label="Close Button"
                        checked={cfg.showCloseButton}
                        onChange={(v) => updateConfig({ showCloseButton: v })}
                        description="Allows visitors to dismiss the bar"
                      />
                    </div>
                  )}
                </div>

                {/* Sizing & Spacing Sliders */}
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Sizes & Spacing
                  </label>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Timer Numbers Size</span>
                      <span className="font-mono">{cfg.typography.timerSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="64"
                      value={cfg.typography.timerSize}
                      onChange={(e) => updateTypography({ timerSize: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Heading Size</span>
                      <span className="font-mono">{cfg.typography.headingSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="44"
                      value={cfg.typography.headingSize}
                      onChange={(e) => updateTypography({ headingSize: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Description Size</span>
                      <span className="font-mono">{cfg.typography.descriptionSize || 13}px</span>
                    </div>
                    <input
                      type="range"
                      min="11"
                      max="24"
                      value={cfg.typography.descriptionSize || 13}
                      onChange={(e) => updateTypography({ descriptionSize: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Padding</span>
                      <span className="font-mono">{cfg.spacing.padding}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={cfg.spacing.padding}
                      onChange={(e) => updateSpacing({ padding: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Border Radius</span>
                      <span className="font-mono">{cfg.spacing.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={cfg.spacing.borderRadius}
                      onChange={(e) => updateSpacing({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Effects */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <span className="text-xs font-semibold text-white block">Visual Effects</span>
                  <StudioSwitch
                    label="Box Shadow"
                    checked={cfg.effects.shadow}
                    onChange={(v) => updateEffects({ shadow: v })}
                  />
                  <StudioSwitch
                    label="Border"
                    checked={cfg.effects.border}
                    onChange={(v) => updateEffects({ border: v })}
                  />
                  {cfg.effects.border && (
                    <ColorControl
                      label="Border Color"
                      value={cfg.effects.borderColor}
                      onChange={(c) => updateEffects({ borderColor: c })}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 4: THEME / COLORS ================= */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                {/* Typography Font Family */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    Typography Font Family
                  </label>
                  <select
                    value={cfg.typography.fontFamily}
                    onChange={(e) => updateTypography({ fontFamily: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Inter, sans-serif">Inter (Modern Clean)</option>
                    <option value="Outfit, sans-serif">Outfit (Geometric Sans)</option>
                    <option value="Roboto, sans-serif">Roboto (Universal Sans)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Luxury Serif)</option>
                    <option value="Montserrat, sans-serif">Montserrat (Bold Punchy)</option>
                    <option value="Oswald, sans-serif">Oswald (Tall Impact)</option>
                    <option value="'Courier New', monospace">Courier (Monospace / Digital)</option>
                  </select>
                </div>

                {/* Color Palette Controls */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-xs font-semibold text-white block mb-2">Theme Colors</span>
                  <ColorControl
                    label="Background Color"
                    value={cfg.colors.background}
                    onChange={(c) => updateColors({ background: c })}
                  />
                  <ColorControl
                    label="Heading Text Color"
                    value={cfg.colors.text}
                    onChange={(c) => updateColors({ text: c })}
                  />
                  <ColorControl
                    label="Description Text Color"
                    value={cfg.colors.secondaryText}
                    onChange={(c) => updateColors({ secondaryText: c })}
                  />
                  <ColorControl
                    label="Timer Number Color"
                    value={cfg.colors.numberColor}
                    onChange={(c) => updateColors({ numberColor: c })}
                  />
                  <ColorControl
                    label="Timer Label Color"
                    value={cfg.colors.labelColor}
                    onChange={(c) => updateColors({ labelColor: c })}
                  />
                  <ColorControl
                    label="Card Background Color"
                    value={cfg.colors.cardBackground}
                    onChange={(c) => updateColors({ cardBackground: c })}
                  />
                  <ColorControl
                    label="Card Border Color"
                    value={cfg.colors.cardBorder}
                    onChange={(c) => updateColors({ cardBorder: c })}
                  />
                  <ColorControl
                    label="Badge Background"
                    value={cfg.colors.badgeBackground}
                    onChange={(c) => updateColors({ badgeBackground: c })}
                  />
                  <ColorControl
                    label="Button Background"
                    value={cfg.colors.buttonBackground}
                    onChange={(c) => updateColors({ buttonBackground: c })}
                  />
                  <ColorControl
                    label="Button Text Color"
                    value={cfg.colors.buttonText}
                    onChange={(c) => updateColors({ buttonText: c })}
                  />
                </div>
              </div>
            )}

            {/* ================= TAB 5: ACTIONS (CTA) ================= */}
            {activeTab === "actions" && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <StudioSwitch
                    label="Show Call-To-Action Button"
                    checked={cfg.showCTA}
                    onChange={(v) => updateConfig({ showCTA: v })}
                    description="Encourage immediate clicks from your countdown"
                  />

                  {cfg.showCTA && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Button Text</label>
                        <input
                          type="text"
                          value={cfg.ctaText}
                          onChange={(e) => updateConfig({ ctaText: e.target.value })}
                          placeholder="e.g. Shop Deal Now"
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Destination URL</label>
                        <input
                          type="url"
                          value={cfg.ctaUrl}
                          onChange={(e) => updateConfig({ ctaUrl: e.target.value })}
                          placeholder="https://example.com/shop"
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Open Link</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateConfig({ ctaTarget: "_blank" })}
                            className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                              cfg.ctaTarget === "_blank"
                                ? "bg-amber-400 text-black border-amber-400"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400"
                            }`}
                          >
                            New Tab (_blank)
                          </button>
                          <button
                            type="button"
                            onClick={() => updateConfig({ ctaTarget: "_self" })}
                            className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                              cfg.ctaTarget === "_self"
                                ? "bg-amber-400 text-black border-amber-400"
                                : "bg-zinc-950 border-zinc-800 text-zinc-400"
                            }`}
                          >
                            Same Tab (_self)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Button Style</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: "primary", label: "Primary Fill" },
                            { key: "secondary", label: "Secondary Dark" },
                            { key: "outline", label: "Outline" },
                            { key: "glow", label: "Glow Accent" },
                          ].map((st) => (
                            <button
                              key={st.key}
                              type="button"
                              onClick={() => updateConfig({ ctaStyle: st.key as any })}
                              className={`py-2 text-xs font-semibold rounded-lg border transition ${
                                cfg.ctaStyle === st.key
                                  ? "bg-zinc-800 border-amber-400 text-white"
                                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Live Preview Area */}
        <main className="flex-1 bg-[#0a0a0c] flex flex-col overflow-hidden relative">
          {/* Preview Canvas Bar */}
          <div className="h-10 border-b border-zinc-800/80 bg-zinc-950/80 px-4 flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-zinc-300">Live Preview</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500 font-mono">1-Sec Real-Time Clock</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-zinc-500 text-[11px]">
                Width: {previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px"}
              </span>
            </div>
          </div>

          {/* Preview Canvas Workspace */}
          <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:16px_16px]">
            <div
              className={`transition-all duration-300 shadow-2xl relative ${
                previewDevice === "desktop"
                  ? "w-full max-w-4xl"
                  : previewDevice === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              {/* Mock website content background for sticky bars */}
              {(cfg.position === "top_bar" || cfg.position === "bottom_bar") && (
                <div className="p-4 mb-2 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500 text-xs">
                  Mock Website Page Content (Demonstrating {cfg.position === "top_bar" ? "Top" : "Bottom"} Bar Placement)
                </div>
              )}

              {/* Injected Live Widget Container */}
              <div
                ref={previewContainerRef}
                dangerouslySetInnerHTML={{ __html: renderedOutput.html }}
                className="w-full relative"
              />

              {(cfg.position === "top_bar" || cfg.position === "bottom_bar") && (
                <div className="p-8 mt-2 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-lg text-center text-zinc-500 text-xs">
                  Scrollable Container Content Below Banner
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Embed Dialog Modal */}
      {embedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Embed Countdown Timer</h3>
              </div>
              <button
                type="button"
                onClick={() => setEmbedModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Copy and paste this HTML snippet into any website, landing page, or WebToolOcean page to display this countdown timer.
            </p>

            <div className="relative">
              <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto select-all">
                {embedCode}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500 font-mono">Widget ID: {widget.id}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(embedCode);
                  toast.success("Embed snippet copied to clipboard!");
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-lg transition"
              >
                Copy Embed Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
