import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getWidget,
  saveWidget,
  publishWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  type WhatsAppChatConfig,
  type WhatsAppPosition,
  type WhatsAppEntranceAnimation,
  type WhatsAppAttentionAnimation,
  type WhatsAppLayoutStyle,
  WHATSAPP_CHAT_TEMPLATES,
  WHATSAPP_CHAT_TEMPLATE_LIST,
  DEFAULT_WHATSAPP_CONFIG,
  normalizeWhatsAppPhone,
  isValidWhatsAppPhone,
  createWhatsAppUrl,
} from "@/services/whatsappChatTemplates";
import {
  renderWhatsAppChatHtml,
  attachWhatsAppChatInteractivity,
  WHATSAPP_ICON_SVG,
} from "@/lib/widget-runtime/whatsappChatRuntime";
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
  MessageCircle,
  HelpCircle,
  Phone,
  Send,
  User,
  Image,
  Clock,
  Sparkles,
  ShieldAlert,
  Info,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { WidgetStudioHeader } from "@/components/widgets/WidgetStudioHeader";

export const Route = createFileRoute("/dashboard/widgets/whatsapp-chat/$widgetId")({
  component: WhatsAppChatStudioPage,
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
            checked ? "text-[#25d366]" : "text-zinc-500"
          }`}
        >
          {checked ? "ON" : "OFF"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            checked ? "bg-[#25d366]" : "bg-zinc-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function WhatsAppChatStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/whatsapp-chat/$widgetId" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord<WhatsAppChatConfig> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "appearance" | "behavior" | "install">("content");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedWaLink, setCopiedWaLink] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load widget configuration
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getWidget(widgetId);
        if (data && data.type === "whatsapp_chat") {
          setWidget(data as WidgetInstanceRecord<WhatsAppChatConfig>);
        } else if (data) {
          // Type mismatch fallback
          setWidget(data as any);
        } else {
          toast.error("WhatsApp widget not found");
          navigate({ to: "/dashboard/widgets" as any });
        }
      } catch (err) {
        console.error("Failed to load widget:", err);
        toast.error("Failed to load widget");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [widgetId, navigate]);

  // Deep update helper
  const updateContent = (partial: Partial<WhatsAppChatConfig["content"]>) => {
    if (!widget) return;
    setWidget({
      ...widget,
      config: {
        ...widget.config,
        content: {
          ...widget.config.content,
          ...partial,
        },
      },
    });
  };

  const updateAppearance = (partial: Partial<WhatsAppChatConfig["appearance"]>) => {
    if (!widget) return;
    setWidget({
      ...widget,
      config: {
        ...widget.config,
        appearance: {
          ...widget.config.appearance,
          ...partial,
        },
      },
    });
  };

  const updateBehavior = (partial: Partial<WhatsAppChatConfig["behavior"]>) => {
    if (!widget) return;
    setWidget({
      ...widget,
      config: {
        ...widget.config,
        behavior: {
          ...widget.config.behavior,
          ...partial,
        },
      },
    });
  };

  // Apply Preset
  const handleApplyPreset = (tplKey: keyof typeof WHATSAPP_CHAT_TEMPLATES) => {
    if (!widget) return;
    const tpl = WHATSAPP_CHAT_TEMPLATES[tplKey];
    if (!tpl) return;
    setWidget({
      ...widget,
      config: {
        ...widget.config,
        appearance: {
          ...widget.config.appearance,
          ...tpl.config.appearance,
        },
        behavior: {
          ...widget.config.behavior,
          ...tpl.config.behavior,
        },
      },
    });
    setPreviewKey((k) => k + 1);
    toast.success(`Applied "${tplKey.replace(/_/g, " ")}" preset`);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!widget) return;
    setSaving(true);
    try {
      await saveWidget(widget);
      toast.success("Widget draft saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Publish Widget
  const handlePublish = async () => {
    if (!widget) return;
    const phone = widget.config?.content?.phoneNumber;
    if (!isValidWhatsAppPhone(phone)) {
      toast.error("Please configure a valid WhatsApp phone number with country code before publishing.");
      setActiveTab("content");
      return;
    }

    setPublishing(true);
    try {
      await publishWidget(widget);
      setWidget({ ...widget, status: "published" });
      toast.success("Widget published! It is now live on your site.");
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
    return renderWhatsAppChatHtml(widget, {
      device: previewDevice,
      isPreview: true,
    });
  }, [widget, previewDevice, previewKey]);

  // Attach interactivity to preview
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const cleanup = attachWhatsAppChatInteractivity(previewContainerRef.current);
    return cleanup;
  }, [renderedOutput, previewKey]);

  // Derived Values
  const rawPhone = widget?.config?.content?.phoneNumber || "";
  const normalizedPhone = normalizeWhatsAppPhone(rawPhone);
  const isPhoneValid = isValidWhatsAppPhone(normalizedPhone);

  const directWaUrl = useMemo(() => {
    if (!isPhoneValid) return "";
    try {
      return createWhatsAppUrl(
        normalizedPhone,
        widget?.config?.behavior?.prefillMessage ? widget?.config?.content?.prefilledMessage : ""
      );
    } catch {
      return "";
    }
  }, [isPhoneValid, normalizedPhone, widget?.config?.behavior?.prefillMessage, widget?.config?.content?.prefilledMessage]);

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

  const handleCopyWaLink = () => {
    if (!directWaUrl) return;
    navigator.clipboard.writeText(directWaUrl);
    setCopiedWaLink(true);
    toast.success("WhatsApp link copied!");
    setTimeout(() => setCopiedWaLink(false), 2200);
  };

  if (loading || !widget) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#25d366] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading WhatsApp Studio…</span>
        </div>
      </div>
    );
  }

  const { content, appearance, behavior } = widget.config;
  const isPublished = widget.status === "published";

  return (
    <div className="h-screen w-full flex flex-col bg-[#121214] text-zinc-100 overflow-hidden select-none">
      {/* Top Studio Navbar */}
      <WidgetStudioHeader
        widgetName={widget.name}
        onWidgetNameChange={(name) => setWidget({ ...widget, name })}
        status={widget.status}
        icon={<MessageCircle className="w-3.5 h-3.5" />}
        iconBgClass="bg-[#25d366]/15 border-[#25d366]/30 text-[#25d366]"
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        onResetPreview={() => setPreviewKey((k) => k + 1)}
        onOpenEmbed={() => setActiveTab("install")}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* Main Studio Body: Split View (Settings Panel on Left, Live Canvas on Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar Panel */}
        <div className="w-[380px] lg:w-[420px] bg-zinc-950 border-r border-zinc-800/80 flex flex-col shrink-0">
          {/* Tabs Navigation */}
          <div className="grid grid-cols-4 border-b border-zinc-800/80 bg-zinc-950 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition border-b-2 cursor-pointer ${
                activeTab === "content"
                  ? "border-[#25d366] text-[#25d366] bg-zinc-900/40"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Content</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition border-b-2 cursor-pointer ${
                activeTab === "appearance"
                  ? "border-[#25d366] text-[#25d366] bg-zinc-900/40"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Appearance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("behavior")}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition border-b-2 cursor-pointer ${
                activeTab === "behavior"
                  ? "border-[#25d366] text-[#25d366] bg-zinc-900/40"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Behavior</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("install")}
              className={`py-3 flex flex-col items-center justify-center gap-1 transition border-b-2 cursor-pointer ${
                activeTab === "install"
                  ? "border-[#25d366] text-[#25d366] bg-zinc-900/40"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          </div>

          {/* Tab Content Panels (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* ================= TAB 1: CONTENT ================= */}
            {activeTab === "content" && (
              <div className="space-y-5">
                {/* 1. Phone Number */}
                <div className="space-y-2 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#25d366]" />
                      <span>WhatsApp Phone Number</span>
                    </label>
                    {isPhoneValid ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Valid
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400">Required</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={content.phoneNumber}
                    onChange={(e) => updateContent({ phoneNumber: e.target.value })}
                    placeholder="e.g. 14155552671 or 919876543210"
                    className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition ${
                      rawPhone && !isPhoneValid
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-zinc-800 focus:border-[#25d366]"
                    }`}
                  />
                  <div className="text-[11px] text-zinc-400 leading-snug">
                    Enter your international number with country code. Do not include <code className="text-zinc-300">+</code>, spaces, or dashes.
                    {normalizedPhone && (
                      <div className="mt-1 font-mono text-[10px] text-zinc-300">
                        Normalized: <span className="text-[#25d366]">+{normalizedPhone}</span>
                      </div>
                    )}
                  </div>
                  {rawPhone && !isPhoneValid && (
                    <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>Phone number must have between 8 and 15 digits.</span>
                    </div>
                  )}
                </div>

                {/* 2. Button Label */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Button Label</label>
                  <input
                    type="text"
                    value={content.buttonLabel}
                    onChange={(e) => updateContent({ buttonLabel: e.target.value })}
                    placeholder="Chat on WhatsApp"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366]"
                  />
                  <span className="text-[10px] text-zinc-500">
                    Shown when button style has pill/rounded border radius.
                  </span>
                </div>

                {/* 3. Greeting Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Greeting Text</label>
                  <textarea
                    rows={2}
                    value={content.greetingText}
                    onChange={(e) => updateContent({ greetingText: e.target.value })}
                    placeholder="Hi! How can we help you today?"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366] resize-none"
                  />
                  <span className="text-[10px] text-zinc-500">
                    Displayed inside the welcome speech bubble or contact card.
                  </span>
                </div>

                {/* 4. Pre-filled Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Pre-filled Message</label>
                  <textarea
                    rows={2}
                    value={content.prefilledMessage}
                    onChange={(e) => updateContent({ prefilledMessage: e.target.value })}
                    placeholder="Hi, I would like to know more about your services."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366] resize-none"
                  />
                  <span className="text-[10px] text-zinc-500">
                    Pre-populated automatically in the visitor&apos;s WhatsApp input box.
                  </span>
                </div>

                {/* 5. Agent / Team Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Business / Agent Name</span>
                  </label>
                  <input
                    type="text"
                    value={content.agentName}
                    onChange={(e) => updateContent({ agentName: e.target.value })}
                    placeholder="Support Team"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366]"
                  />
                </div>

                {/* 6. Agent Avatar URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Agent Avatar URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={content.agentAvatarUrl}
                    onChange={(e) => updateContent({ agentAvatarUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366]"
                  />
                  <span className="text-[10px] text-zinc-500">
                    Leave blank to show agent initials with official badge.
                  </span>
                </div>

                {/* 7. Status / Availability Label */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Status Label (Informational)</label>
                  <input
                    type="text"
                    value={content.statusLabel}
                    onChange={(e) => updateContent({ statusLabel: e.target.value })}
                    placeholder="Usually replies in minutes"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366]"
                  />
                  <span className="text-[10px] text-zinc-500">
                    Static informational text displayed next to the green status dot.
                  </span>
                </div>

                {/* 8. Working Hours Notice */}
                <div className="space-y-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <StudioSwitch
                    label="Show Working Hours Notice"
                    checked={content.showWorkingHoursNotice}
                    onChange={(checked) => updateContent({ showWorkingHoursNotice: checked })}
                    description="Displays your operating schedule as an informational badge."
                  />
                  {content.showWorkingHoursNotice && (
                    <input
                      type="text"
                      value={content.workingHoursNotice}
                      onChange={(e) => updateContent({ workingHoursNotice: e.target.value })}
                      placeholder="We usually reply Monday–Friday (9am - 6pm)"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366] mt-2"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: APPEARANCE ================= */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                {/* 1. Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Design Presets</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {WHATSAPP_CHAT_TEMPLATE_LIST.map((tpl) => (
                      <button
                        key={tpl.key}
                        type="button"
                        onClick={() => handleApplyPreset(tpl.key)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          appearance.template === tpl.key
                            ? "bg-[#25d366]/10 border-[#25d366] text-white"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{tpl.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{tpl.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Layout Style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Layout Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "floating_button", label: "Button", icon: "🔘" },
                      { key: "button_with_greeting", label: "With Bubble", icon: "💬" },
                      { key: "contact_card", label: "Contact Card", icon: "📇" },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => updateAppearance({ layoutStyle: st.key as WhatsAppLayoutStyle })}
                        className={`py-2 px-2 rounded-lg border text-center transition cursor-pointer text-xs font-semibold flex flex-col items-center gap-1 ${
                          appearance.layoutStyle === st.key
                            ? "bg-[#25d366]/15 border-[#25d366] text-[#25d366]"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="text-base">{st.icon}</span>
                        <span>{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Button Color & Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">Button Background Color</label>
                    <span className="font-mono text-xs text-zinc-400">{appearance.buttonColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={appearance.buttonColor}
                      onChange={(e) => updateAppearance({ buttonColor: e.target.value })}
                      className="w-10 h-8 rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 cursor-pointer shrink-0"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { color: "#25d366", label: "Official WhatsApp Green" },
                        { color: "#128c7e", label: "Teal Green" },
                        { color: "#075e54", label: "Dark Forest" },
                        { color: "#111827", label: "Midnight Dark" },
                      ].map((cp) => (
                        <button
                          key={cp.color}
                          type="button"
                          onClick={() => updateAppearance({ buttonColor: cp.color })}
                          className={`w-6 h-6 rounded-full border transition cursor-pointer ${
                            appearance.buttonColor.toLowerCase() === cp.color.toLowerCase()
                              ? "ring-2 ring-white scale-110"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{ backgroundColor: cp.color }}
                          title={cp.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Position & Viewport Spacing */}
                <div className="space-y-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300">Screen Position</label>
                    <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => updateAppearance({ position: "bottom_left" })}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition cursor-pointer ${
                          appearance.position === "bottom_left" ? "bg-zinc-800 text-white" : "text-zinc-400"
                        }`}
                      >
                        Bottom Left
                      </button>
                      <button
                        type="button"
                        onClick={() => updateAppearance({ position: "bottom_right" })}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition cursor-pointer ${
                          appearance.position === "bottom_right" ? "bg-zinc-800 text-white" : "text-zinc-400"
                        }`}
                      >
                        Bottom Right
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Side Offset</span>
                        <span>{appearance.offsetX}px</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={60}
                        value={appearance.offsetX}
                        onChange={(e) => updateAppearance({ offsetX: Number(e.target.value) })}
                        className="w-full accent-[#25d366]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                        <span>Bottom Offset</span>
                        <span>{appearance.offsetY}px</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={80}
                        value={appearance.offsetY}
                        onChange={(e) => updateAppearance({ offsetY: Number(e.target.value) })}
                        className="w-full accent-[#25d366]"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Button Sizing */}
                <div className="space-y-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Button Diameter</span>
                      <span>{appearance.buttonDiameter}px</span>
                    </div>
                    <input
                      type="range"
                      min={48}
                      max={72}
                      value={appearance.buttonDiameter}
                      onChange={(e) => updateAppearance({ buttonDiameter: Number(e.target.value) })}
                      className="w-full accent-[#25d366]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Icon Size</span>
                      <span>{appearance.iconSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={38}
                      value={appearance.iconSize}
                      onChange={(e) => updateAppearance({ iconSize: Number(e.target.value) })}
                      className="w-full accent-[#25d366]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Border Radius</span>
                      <span>{appearance.borderRadius >= 50 ? "Circle / Pill" : `${appearance.borderRadius}px`}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={appearance.borderRadius}
                      onChange={(e) => updateAppearance({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-[#25d366]"
                    />
                  </div>
                </div>

                {/* 6. Animations */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Entrance Animation</label>
                    <select
                      value={appearance.entranceAnimation}
                      onChange={(e) => updateAppearance({ entranceAnimation: e.target.value as WhatsAppEntranceAnimation })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25d366] cursor-pointer"
                    >
                      <option value="none">None</option>
                      <option value="fade_in">Fade In</option>
                      <option value="slide_up">Slide Up</option>
                      <option value="bounce">Bouncy Pop-in</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Subtle Attention Animation</label>
                    <select
                      value={appearance.attentionAnimation}
                      onChange={(e) => updateAppearance({ attentionAnimation: e.target.value as WhatsAppAttentionAnimation })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25d366] cursor-pointer"
                    >
                      <option value="none">None (Static)</option>
                      <option value="subtle_pulse">Subtle Pulse (Heartbeat)</option>
                      <option value="subtle_bounce">Subtle Bounce</option>
                    </select>
                  </div>
                </div>

                {/* 7. Hover Tooltip */}
                <div className="space-y-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <StudioSwitch
                    label="Show Tooltip on Hover"
                    checked={appearance.showTooltip}
                    onChange={(checked) => updateAppearance({ showTooltip: checked })}
                    description="Displays a dark hint bubble when the visitor hovers over the button."
                  />
                  {appearance.showTooltip && (
                    <input
                      type="text"
                      value={appearance.customTooltipText}
                      onChange={(e) => updateAppearance({ customTooltipText: e.target.value })}
                      placeholder="Chat with us"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#25d366] mt-2"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 3: BEHAVIOR ================= */}
            {activeTab === "behavior" && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <StudioSwitch
                    label="Open WhatsApp in New Tab"
                    checked={behavior.openInNewTab}
                    onChange={(checked) => updateBehavior({ openInNewTab: checked })}
                    description="Opens WhatsApp (wa.me) or the WhatsApp app in a separate browser tab."
                  />

                  <div className="h-px bg-zinc-800" />

                  <StudioSwitch
                    label="Pre-fill WhatsApp Message"
                    checked={behavior.prefillMessage}
                    onChange={(checked) => updateBehavior({ prefillMessage: checked })}
                    description="Automatically fills in the starter greeting message when WhatsApp opens."
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <StudioSwitch
                    label="Show Greeting Bubble"
                    checked={behavior.showGreetingBubble}
                    onChange={(checked) => updateBehavior({ showGreetingBubble: checked })}
                    description="Shows the speech bubble or contact greeting to attract visitor attention."
                  />

                  {behavior.showGreetingBubble && (
                    <>
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Greeting Delay</span>
                          <span>{behavior.greetingDelaySec}s</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          value={behavior.greetingDelaySec}
                          onChange={(e) => updateBehavior({ greetingDelaySec: Number(e.target.value) })}
                          className="w-full accent-[#25d366]"
                        />
                        <span className="text-[10px] text-zinc-500">
                          Wait {behavior.greetingDelaySec}s after page load before popping up greeting.
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Auto-Dismiss Duration</span>
                          <span>{behavior.autoDismissGreetingSec === 0 ? "Never (Stay Open)" : `${behavior.autoDismissGreetingSec}s`}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={30}
                          step={5}
                          value={behavior.autoDismissGreetingSec}
                          onChange={(e) => updateBehavior({ autoDismissGreetingSec: Number(e.target.value) })}
                          className="w-full accent-[#25d366]"
                        />
                        <span className="text-[10px] text-zinc-500">
                          Automatically hides the greeting bubble after this duration.
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold text-white">Device Visibility</h4>
                  <StudioSwitch
                    label="Show on Desktop Computers"
                    checked={behavior.visibleOnDesktop}
                    onChange={(checked) => updateBehavior({ visibleOnDesktop: checked })}
                    description="Redirects desktop visitors to WhatsApp Web."
                  />
                  <div className="h-px bg-zinc-800" />
                  <StudioSwitch
                    label="Show on Mobile Phones & Tablets"
                    checked={behavior.visibleOnMobile}
                    onChange={(checked) => updateBehavior({ visibleOnMobile: checked })}
                    description="Opens WhatsApp application directly on iOS & Android."
                  />
                </div>
              </div>
            )}

            {/* ================= TAB 4: INSTALLATION ================= */}
            {activeTab === "install" && (
              <div className="space-y-6">
                {/* Embed Code Snippet Card */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#25d366]" />
                      <span>Embed Snippet</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmbed}
                      className="px-2.5 py-1 rounded bg-[#25d366] text-black font-bold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90 transition"
                    >
                      {copiedEmbed ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmbed ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                    {embedCode}
                  </pre>
                  <p className="text-[11px] text-zinc-400">
                    Paste this snippet before the closing <code className="text-zinc-300">&lt;/body&gt;</code> tag of your website.
                  </p>
                </div>

                {/* Direct WhatsApp Click Link */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                      <span>Direct WhatsApp Link</span>
                    </span>
                    <button
                      type="button"
                      disabled={!isPhoneValid}
                      onClick={handleCopyWaLink}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition disabled:opacity-40"
                    >
                      {copiedWaLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWaLink ? "Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={directWaUrl || "Please configure your phone number first"}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-zinc-300 select-all"
                  />
                  {isPhoneValid && directWaUrl && (
                    <a
                      href={directWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25d366] hover:underline"
                    >
                      <span>Test destination on WhatsApp Web →</span>
                    </a>
                  )}
                </div>

                {/* Platform Instructions */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white">Platform Instructions</h4>

                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <div className="text-xs font-bold text-zinc-200">1. HTML / Static Websites</div>
                    <p className="text-[11px] text-zinc-400">
                      Paste the code snippet immediately before the closing <code className="text-zinc-300">&lt;/body&gt;</code> tag on every page where you want the live chat to show.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <div className="text-xs font-bold text-zinc-200">2. WordPress</div>
                    <p className="text-[11px] text-zinc-400">
                      Use a plugin like <em>Insert Headers and Footers</em> or add the snippet to your theme footer via Appearance &gt; Theme File Editor &gt; footer.php.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                    <div className="text-xs font-bold text-zinc-200">3. React / Next.js</div>
                    <p className="text-[11px] text-zinc-400">
                      Add the script to your Root Layout or custom <code className="text-zinc-300">_document.tsx</code> using Next.js Script (<code className="text-zinc-300">strategy=&quot;lazyOnload&quot;</code>).
                    </p>
                  </div>
                </div>

                {/* Safeguard Notice */}
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] space-y-1 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>No Third-Party API Required</span>
                  </div>
                  <p className="text-blue-200/80">
                    This widget uses the official WhatsApp Click to Chat protocol. It requires no WhatsApp Business API subscription, no webhook server, and no third-party messaging fees.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="flex-1 bg-[#0a0a0c] flex flex-col overflow-hidden relative">
          {/* Top Canvas Bar */}
          <div className="h-10 border-b border-zinc-800/80 bg-zinc-950/80 px-4 flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25d366]" />
              <span className="font-semibold text-zinc-300">Live Preview</span>
              <span className="text-zinc-500 text-[11px]">
                ({previewDevice === "desktop" ? "Desktop viewport" : "Mobile 375px"})
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              {isPhoneValid ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCheck className="w-3.5 h-3.5" /> Ready for live chats
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" /> Destination phone not configured
                </span>
              )}
            </div>
          </div>

          {/* Canvas Viewport Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
            <div
              className={`relative bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
                previewDevice === "desktop" ? "w-full max-w-4xl h-[580px]" : "w-[375px] h-[667px]"
              }`}
            >
              {/* Simulated Browser Bar */}
              <div className="h-9 bg-zinc-900 border-b border-zinc-800 px-3 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="bg-zinc-950 border border-zinc-800/80 rounded px-2.5 py-0.5 text-[10px] text-zinc-400 font-mono truncate max-w-[200px]">
                  https://yourcustomerwebsite.com
                </div>
                <div className="w-12" />
              </div>

              {/* Simulated Webpage Content */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 relative bg-gradient-to-b from-[#18181b] to-[#121215]">
                {/* Simulated Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
                  <div className="h-5 w-28 bg-zinc-800 rounded" />
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="h-3 w-14 bg-zinc-800/60 rounded" />
                    <div className="h-3 w-14 bg-zinc-800/60 rounded" />
                    <div className="h-3 w-14 bg-zinc-800/60 rounded" />
                  </div>
                  <div className="h-7 w-20 bg-zinc-800 rounded-lg" />
                </div>

                {/* Simulated Hero Section */}
                <div className="space-y-3 pt-6 max-w-md">
                  <div className="h-3 w-20 bg-amber-400/20 rounded text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block">
                    Sample Website
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight">
                    Grow Your Business Faster With Modern Tools
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    This is how your live website looks to visitors with your customized WhatsApp Live Chat widget floating in the corner.
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <div className="h-8 w-28 bg-white/10 rounded-lg" />
                    <div className="h-8 w-24 bg-zinc-800 rounded-lg" />
                  </div>
                </div>

                {/* Simulated Feature Cards */}
                <div className="grid grid-cols-2 gap-3 pt-4 opacity-50 pointer-events-none">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                    <div className="w-6 h-6 rounded bg-zinc-800" />
                    <div className="h-3 w-20 bg-zinc-700 rounded" />
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                    <div className="w-6 h-6 rounded bg-zinc-800" />
                    <div className="h-3 w-20 bg-zinc-700 rounded" />
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                  </div>
                </div>

                {/* THE LIVE FLOATING WHATSAPP CHAT WIDGET */}
                <div
                  ref={previewContainerRef}
                  className="wto-live-preview-wrapper"
                  dangerouslySetInnerHTML={{
                    __html: renderedOutput.css
                      ? `<style>${renderedOutput.css}</style>\n${renderedOutput.html}`
                      : renderedOutput.html,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
