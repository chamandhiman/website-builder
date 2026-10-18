import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  getWidget,
  saveWidget,
  publishWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  type LanguageOption,
  type LanguageSwitcherConfig,
  type LanguageSwitcherLayout,
  type LanguageSwitcherPosition,
  COMMON_LANGUAGES_CATALOG,
  DEFAULT_LANGUAGE_SWITCHER_CONFIG,
} from "@/services/languageSwitcherTemplates";
import {
  renderLanguageSwitcherHtml,
  attachLanguageSwitcherInteractivity,
} from "@/lib/widget-runtime/languageSwitcherRuntime";
import {
  ArrowLeft,
  Globe,
  Sliders,
  Eye,
  ExternalLink,
  Code2,
  CheckCircle2,
  RefreshCw,
  Monitor,
  Smartphone,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { WidgetStudioHeader } from "@/components/widgets/WidgetStudioHeader";

export const Route = createFileRoute("/dashboard/widgets/language-switcher/$widgetId")({
  component: SimpleLanguageSwitcherStudioPage,
});

/** Clean Toggle Switch */
function SimpleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800/80 cursor-pointer select-none transition"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span className="text-zinc-300 font-semibold text-xs">{label}</span>
      <div
        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
          checked ? "bg-[#38bdf8]" : "bg-zinc-700"
        }`}
      >
        <div
          className={`bg-zinc-950 w-4 h-4 rounded-full shadow transform transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}

function SimpleLanguageSwitcherStudioPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/language-switcher/$widgetId" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord<LanguageSwitcherConfig> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"languages" | "settings">("languages");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Selected language to add from dropdown
  const [selectedCatalogCode, setSelectedCatalogCode] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customLangName, setCustomLangName] = useState("");
  const [customLangCode, setCustomLangCode] = useState("");
  const [customLangFlag, setCustomLangFlag] = useState("🌐");
  const [customLangUrl, setCustomLangUrl] = useState("");

  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load widget data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getWidget(widgetId);
        if (data && data.type === "language_switcher") {
          const config = data.config || {};
          const merged: LanguageSwitcherConfig = {
            languages: Array.isArray(config.languages) && config.languages.length > 0
              ? config.languages
              : DEFAULT_LANGUAGE_SWITCHER_CONFIG.languages,
            appearance: {
              ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
              ...(config.appearance || {}),
            },
            behavior: {
              ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.behavior,
              ...(config.behavior || {}),
            },
          };
          setWidget({
            ...data,
            config: merged,
          } as WidgetInstanceRecord<LanguageSwitcherConfig>);
        } else {
          toast.error("Widget not found");
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

  // Update Appearance
  const updateAppearance = (patch: Partial<LanguageSwitcherConfig["appearance"]>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          appearance: {
            ...prev.config.appearance,
            ...patch,
          },
        },
      };
    });
  };

  // Update Behavior
  const updateBehavior = (patch: Partial<LanguageSwitcherConfig["behavior"]>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          behavior: {
            ...prev.config.behavior,
            ...patch,
          },
        },
      };
    });
  };

  // Add Language from Dropdown
  const handleAddLanguageFromDropdown = () => {
    if (!widget || !selectedCatalogCode) return;
    const item = COMMON_LANGUAGES_CATALOG.find((l) => l.code === selectedCatalogCode);
    if (!item) return;

    const exists = widget.config.languages.some(
      (l) => l.code.toLowerCase() === item.code.toLowerCase()
    );
    if (exists) {
      toast.info(`${item.name} is already added.`);
      return;
    }

    const newLang: LanguageOption = {
      id: `lang_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      code: item.code,
      name: item.name,
      nativeName: item.nativeName,
      flag: item.flag,
      url: `https://example.com/${item.code.toLowerCase()}/`,
      enabled: true,
      isDefault: false,
    };

    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          languages: [...prev.config.languages, newLang],
        },
      };
    });
    setSelectedCatalogCode("");
    toast.success(`Added ${item.name}!`);
  };

  // Add Custom Language
  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLangName.trim() || !customLangCode.trim()) {
      toast.error("Name and code are required.");
      return;
    }

    const cleanCode = customLangCode.trim().toLowerCase();
    const newLang: LanguageOption = {
      id: `lang_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      code: cleanCode,
      name: customLangName.trim(),
      nativeName: customLangName.trim(),
      flag: customLangFlag.trim() || "🌐",
      url: customLangUrl.trim() || `https://example.com/${cleanCode}/`,
      enabled: true,
      isDefault: false,
    };

    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          languages: [...prev.config.languages, newLang],
        },
      };
    });

    setIsAddingCustom(false);
    setCustomLangName("");
    setCustomLangCode("");
    setCustomLangUrl("");
    toast.success(`Added ${newLang.name}!`);
  };

  // Update Language URL or Field
  const handleUpdateLanguage = (id: string, patch: Partial<LanguageOption>) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          languages: prev.config.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        },
      };
    });
  };

  // Set Default
  const handleSetDefaultLanguage = (id: string) => {
    if (!widget) return;
    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          languages: prev.config.languages.map((l) => ({
            ...l,
            isDefault: l.id === id,
          })),
        },
      };
    });
    toast.success("Default language updated.");
  };

  // Remove
  const handleRemoveLanguage = (id: string) => {
    if (!widget) return;
    if (widget.config.languages.length <= 1) {
      toast.error("You need at least one language.");
      return;
    }
    const toRemove = widget.config.languages.find((l) => l.id === id);
    setWidget((prev) => {
      if (!prev) return prev;
      const remaining = prev.config.languages.filter((l) => l.id !== id);
      if (toRemove?.isDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return {
        ...prev,
        config: {
          ...prev.config,
          languages: remaining,
        },
      };
    });
    toast.success("Language removed.");
  };

  // Reorder
  const handleMoveLanguage = (index: number, direction: "up" | "down") => {
    if (!widget) return;
    const langs = [...widget.config.languages];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= langs.length) return;

    const temp = langs[index];
    langs[index] = langs[targetIdx];
    langs[targetIdx] = temp;

    setWidget((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        config: {
          ...prev.config,
          languages: langs,
        },
      };
    });
  };

  // Save Widget
  const handleSave = async () => {
    if (!widget) return;
    setSaving(true);
    try {
      await saveWidget(widget);
      toast.success("Language Switcher saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save widget");
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
      toast.success("Language Switcher published live!");
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
    return renderLanguageSwitcherHtml(widget, {
      device: previewDevice,
      isPreview: true,
    });
  }, [widget, previewDevice, previewKey]);

  // Interactivity in preview
  useEffect(() => {
    if (!previewContainerRef.current || !widget) return;
    const cleanup = attachLanguageSwitcherInteractivity(previewContainerRef.current, widget, {
      isPreview: true,
      onLanguageSelect: (selectedLang) => {
        toast.info(
          `Navigates to: ${selectedLang.url}`,
          { duration: 3000 }
        );
      },
    });
    return cleanup;
  }, [renderedOutput, widget, previewKey]);

  const embedCode = useMemo(() => {
    if (!widget) return "";
    return `<div data-wto-widget="${widget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [widget]);

  const handleCopyEmbed = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopiedEmbed(false), 2200);
  };

  if (loading || !widget) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading Language Studio…</span>
        </div>
      </div>
    );
  }

  const { config } = widget;
  const { appearance, behavior, languages } = config;

  return (
    <div className="min-h-screen bg-[#0d0d10] text-zinc-100 flex flex-col font-sans">
      {/* ================= HEADER ================= */}
      <WidgetStudioHeader
        widgetName={widget.name}
        onWidgetNameChange={(name) => setWidget({ ...widget, name })}
        status={widget.status}
        icon={<Languages className="w-3.5 h-3.5" />}
        iconBgClass="bg-[#38bdf8]/15 border-[#38bdf8]/30 text-[#38bdf8]"
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        onResetPreview={() => setPreviewKey((k) => k + 1)}
        onOpenEmbed={handleCopyEmbed}
        onSaveDraft={handleSave}
        onPublish={handlePublish}
        saving={saving}
        publishing={publishing}
      />

      {/* ================= BODY ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Super Clean Sidebar with only 2 Tabs */}
        <aside className="w-full lg:w-[460px] bg-[#141418] border-r border-zinc-800/80 flex flex-col shrink-0 h-[calc(100vh-64px)] overflow-y-auto">
          {/* Exactly 2 Clean Tabs */}
          <div className="p-2 border-b border-zinc-800/80 bg-[#111114] grid grid-cols-2 gap-2 sticky top-0 z-20">
            <button
              type="button"
              onClick={() => setActiveTab("languages")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === "languages"
                  ? "bg-[#38bdf8] text-black shadow"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>Languages &amp; URLs</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === "settings"
                  ? "bg-[#38bdf8] text-black shadow"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Position &amp; Style</span>
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* ================= TAB 1: LANGUAGES & URLS ================= */}
            {activeTab === "languages" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Clean Dropdown to Add Language */}
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">Add Language</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCustom(!isAddingCustom)}
                      className="text-[11px] text-[#38bdf8] hover:underline font-semibold"
                    >
                      {isAddingCustom ? "Use standard list" : "+ Custom code"}
                    </button>
                  </div>

                  {!isAddingCustom ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedCatalogCode}
                        onChange={(e) => setSelectedCatalogCode(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white outline-none focus:border-[#38bdf8]"
                      >
                        <option value="">Select a language to add...</option>
                        {COMMON_LANGUAGES_CATALOG.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.flag} {l.name} ({l.code})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleAddLanguageFromDropdown}
                        disabled={!selectedCatalogCode}
                        className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black font-extrabold text-xs transition flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAddCustomLanguage} className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={customLangName}
                          onChange={(e) => setCustomLangName(e.target.value)}
                          placeholder="Name (e.g. Hindi)"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                          required
                        />
                        <input
                          type="text"
                          value={customLangCode}
                          onChange={(e) => setCustomLangCode(e.target.value)}
                          placeholder="Code (e.g. hi)"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white font-mono"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customLangUrl}
                          onChange={(e) => setCustomLangUrl(e.target.value)}
                          placeholder="URL (e.g. /hi/ or https://...)"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white font-mono"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-[#38bdf8] text-black font-bold text-xs"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Compact List of Languages */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-bold px-1">
                    <span>Configured Languages ({languages.length})</span>
                    <span className="text-[10px] text-zinc-500">Destination URLs</span>
                  </div>

                  {languages.map((lang, index) => (
                    <div
                      key={lang.id}
                      className={`p-3 rounded-xl border transition-all space-y-2 ${
                        lang.isDefault
                          ? "bg-zinc-900 border-[#38bdf8]/40"
                          : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {/* Top Bar: Reorder, Name, Default Badge, Delete */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Up/down arrows */}
                          <div className="flex items-center gap-0.5 text-zinc-500">
                            <button
                              type="button"
                              onClick={() => handleMoveLanguage(index, "up")}
                              disabled={index === 0}
                              className="p-0.5 hover:text-white disabled:opacity-20"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLanguage(index, "down")}
                              disabled={index === languages.length - 1}
                              className="p-0.5 hover:text-white disabled:opacity-20"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-base select-none">{lang.flag}</span>

                          <span className="font-bold text-xs text-white truncate">
                            {lang.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase">
                            ({lang.code})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {lang.isDefault ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
                              Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultLanguage(lang.id)}
                              className="text-[10px] font-medium text-zinc-400 hover:text-[#38bdf8] px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/60"
                            >
                              Set Default
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(lang.id)}
                            className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Direct Destination URL Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={lang.url}
                          onChange={(e) => handleUpdateLanguage(lang.id, { url: e.target.value })}
                          placeholder="Destination URL (e.g. https://... or /es/)"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono pr-7 focus:border-[#38bdf8] outline-none"
                        />
                        {lang.url && (
                          <a
                            href={lang.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-2 top-2 text-zinc-500 hover:text-[#38bdf8]"
                            title="Open link"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 2: POSITION & STYLE ================= */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 1. Placement / Position Controls Right Here! */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-white block">Widget Position on Website</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "bottom_right", label: "Bottom Right (Floating)" },
                      { id: "bottom_left", label: "Bottom Left (Floating)" },
                      { id: "top_right", label: "Top Right (Floating)" },
                      { id: "top_left", label: "Top Left (Floating)" },
                    ].map((pos) => {
                      const isSelected =
                        appearance.layout === "floating_selector" &&
                        appearance.floatingPosition === pos.id;
                      return (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => {
                            updateAppearance({
                              layout: "floating_selector",
                              floatingPosition: pos.id as LanguageSwitcherPosition,
                            });
                          }}
                          className={`p-2.5 rounded-xl text-xs font-bold text-left border transition ${
                            isSelected
                              ? "bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {pos.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateAppearance({
                        layout: "globe_dropdown",
                      });
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-bold text-left border transition mt-1.5 ${
                      appearance.layout !== "floating_selector"
                        ? "bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Inline (Embed inside Header, Navbar, or Footer)
                  </button>
                </div>

                {/* 2. Simplified Layout Choices (Just 4 clean options) */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-bold text-white block">Switcher Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: "globe_dropdown",
                        label: "Globe + Dropdown",
                        desc: "Standard dropdown button",
                      },
                      {
                        id: "flag_button_dropdown",
                        label: "Flag + Dropdown",
                        desc: "Shows active flag & name",
                      },
                      {
                        id: "minimal_text",
                        label: "Minimal Text",
                        desc: "Simple code (e.g. EN ▾)",
                      },
                      {
                        id: "horizontal_pills",
                        label: "Inline Pills",
                        desc: "Horizontal side-by-side buttons",
                      },
                    ].map((s) => {
                      const isCurrent =
                        appearance.layout === s.id ||
                        (appearance.layout === "floating_selector" && s.id === "globe_dropdown");
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (appearance.layout === "floating_selector") {
                              updateAppearance({ buttonFormat: s.id === "minimal_text" ? "code_only" : "flag_and_name" });
                            } else {
                              updateAppearance({ layout: s.id as LanguageSwitcherLayout });
                            }
                          }}
                          className={`p-2.5 rounded-xl text-left border transition ${
                            isCurrent
                              ? "bg-[#38bdf8]/15 border-[#38bdf8] text-white"
                              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <strong className="block text-xs font-bold text-white">{s.label}</strong>
                          <span className="block text-[10px] text-zinc-500 mt-0.5">{s.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Easy Toggles */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-bold text-white block mb-1">Display Controls</label>
                  <SimpleSwitch
                    label="Show Flag Icons"
                    checked={appearance.showFlags}
                    onChange={(v) => updateAppearance({ showFlags: v })}
                  />
                  <SimpleSwitch
                    label="Show Globe Icon"
                    checked={appearance.showGlobeIcon}
                    onChange={(v) => updateAppearance({ showGlobeIcon: v })}
                  />
                  <SimpleSwitch
                    label="Show Native Language Script (e.g. Español, Français)"
                    checked={appearance.showNativeNames}
                    onChange={(v) => updateAppearance({ showNativeNames: v })}
                  />
                  <SimpleSwitch
                    label="Detect Visitor's Browser Language"
                    checked={behavior.detectBrowserLanguage}
                    onChange={(v) => updateBehavior({ detectBrowserLanguage: v })}
                  />
                  <SimpleSwitch
                    label="Remember Visitor's Chosen Language"
                    checked={behavior.rememberVisitorPreference}
                    onChange={(v) => updateBehavior({ rememberVisitorPreference: v })}
                  />
                  <SimpleSwitch
                    label="Open Links in New Browser Tab"
                    checked={behavior.openInNewTab}
                    onChange={(v) => updateBehavior({ openInNewTab: v })}
                  />
                </div>

                {/* 4. Quick Theme & Colors */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-bold text-white block mb-1">Colors</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold block">Background</span>
                      <input
                        type="color"
                        value={appearance.backgroundColor.startsWith("#") ? appearance.backgroundColor : "#18181b"}
                        onChange={(e) => updateAppearance({ backgroundColor: e.target.value, dropdownBackgroundColor: e.target.value })}
                        className="w-full h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold block">Text</span>
                      <input
                        type="color"
                        value={appearance.textColor.startsWith("#") ? appearance.textColor : "#ffffff"}
                        onChange={(e) => updateAppearance({ textColor: e.target.value, dropdownTextColor: e.target.value })}
                        className="w-full h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold block">Accent</span>
                      <input
                        type="color"
                        value={appearance.accentColor.startsWith("#") ? appearance.accentColor : "#38bdf8"}
                        onChange={(e) => updateAppearance({ accentColor: e.target.value, activeItemTextColor: e.target.value })}
                        className="w-full h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right: Live Preview */}
        <main className="flex-1 bg-[#0a0a0c] flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto relative">
          <div className="w-full max-w-4xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Eye className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-bold text-white">Live Preview</span>
            </div>

            <button
              type="button"
              onClick={() => setPreviewKey((k) => k + 1)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold border border-zinc-800 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Website Canvas */}
          <div
            className={`w-full transition-all duration-300 rounded-2xl border border-zinc-800/80 bg-zinc-950/70 shadow-2xl relative overflow-hidden flex flex-col ${
              previewDevice === "desktop" ? "max-w-4xl min-h-[520px]" : "max-w-[390px] min-h-[580px]"
            }`}
          >
            {/* Top Browser Bar */}
            <div className="h-9 bg-[#121215] border-b border-zinc-800/80 px-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-3 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono flex items-center gap-1.5 truncate">
                <Globe className="w-3 h-3 text-[#38bdf8]" />
                <span>example.com</span>
              </div>
              <div className="w-8" />
            </div>

            {/* Simulated Navigation Bar */}
            <div className="px-6 py-3.5 border-b border-zinc-800/40 bg-zinc-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8] font-black text-xs">
                  W
                </span>
                <span className="font-bold text-xs text-white">Acme Global</span>
              </div>

              {/* INLINE Switcher slot */}
              {appearance.layout !== "floating_selector" && (
                <div className="flex items-center">
                  <div
                    ref={previewContainerRef}
                    dangerouslySetInnerHTML={{
                      __html: `<style>${renderedOutput.css}</style>${renderedOutput.html}`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Simulated Page Content */}
            <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center items-center text-center space-y-3 relative">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Preview Your Language Switcher
              </h1>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Click the language switcher to test dropdown opening and language selection.
              </p>

              {/* FLOATING Switcher slot */}
              {appearance.layout === "floating_selector" && (
                <div
                  ref={previewContainerRef}
                  dangerouslySetInnerHTML={{
                    __html: `<style>${renderedOutput.css}</style>${renderedOutput.html}`,
                  }}
                />
              )}
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] text-zinc-500">
              Selecting a language in preview safely tests destination routing.
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
