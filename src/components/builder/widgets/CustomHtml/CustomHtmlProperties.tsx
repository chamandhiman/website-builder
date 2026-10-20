import React, { useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetData } from "../widgetRegistry";
import { defaultCustomHtmlWidgetData, isCustomHtmlWidgetData, type CustomHtmlWidgetData } from "./CustomHtmlTypes";
import { getAllWidgets, type WidgetInstanceRecord } from "@/services/widgetService";
import { renderCountdownHtml, renderGoogleReviewsHtml } from "@/lib/widget-runtime/wtoWidgetRuntime";
import {
  Code2,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Clock,
  Star,
  Trash2,
  Boxes,
  Plus,
  Megaphone,
  HelpCircle,
  Accessibility,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CustomHtmlPropertiesProps {
  value?: WidgetData;
  onChange?: (nextValue: WidgetData) => void;
  widgetId?: string;
  onClose?: () => void;
}

export function normalizeWidgetSnippet(html: string): string {
  if (!html) return "";
  const match = html.match(/data-wto-widget=["']([^"']+)["']/);
  if (match) {
    const widgetId = match[1];
    // If the html contains dumped css, keyframes, or pre-rendered studio markup, condense to clean embed snippet
    if (
      html.includes("<style") ||
      html.includes("@keyframes") ||
      html.includes("wto-cd-") ||
      html.includes("wto-anim-") ||
      html.includes("wto-countdown-root") ||
      html.includes("wto-dynamic-widget-root") ||
      html.includes("wto-embedded-widget-container")
    ) {
      return `<div data-wto-widget="${widgetId}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
    }
  }
  return html;
}

export function CustomHtmlProperties({ value, onChange, widgetId }: CustomHtmlPropertiesProps) {
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);
  const selectedSectionId = useBuilder((s) => s.selectedSectionId);
  const updateSection = useBuilder((s) => s.updateSection);
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const setRightPanelTab = useBuilder((s) => s.setRightPanelTab);

  const currentSection = React.useMemo(() => {
    if (!project || !selectedSectionId) return null;
    if (project.sharedHeader?.id === selectedSectionId) return project.sharedHeader;
    if (project.sharedFooter?.id === selectedSectionId) return project.sharedFooter;
    for (const p of project.pages || []) {
      const s = (p.sections || []).find((sec) => sec.id === selectedSectionId);
      if (s) return s;
    }
    return null;
  }, [project, selectedSectionId]);

  const [widgetName, setWidgetName] = useState(currentSection?.name || "Custom HTML / Embed");

  useEffect(() => {
    if (currentSection?.name) {
      setWidgetName(currentSection.name);
    }
  }, [currentSection?.name]);

  const resolvedWidget: CustomHtmlWidgetData =
    value && isCustomHtmlWidgetData(value)
      ? value
      : defaultCustomHtmlWidgetData;

  const [htmlInput, setHtmlInput] = useState<string>(() =>
    normalizeWidgetSnippet(resolvedWidget.content?.html || "")
  );
  const [lastSavedHtml, setLastSavedHtml] = useState<string>(() =>
    normalizeWidgetSnippet(resolvedWidget.content?.html || "")
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isFlashGlow, setIsFlashGlow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [availableWidgets, setAvailableWidgets] = useState<WidgetInstanceRecord[]>([]);
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(false);

  const isDirty = htmlInput !== lastSavedHtml;

  useEffect(() => {
    const raw = resolvedWidget.content?.html || "";
    const cleaned = normalizeWidgetSnippet(raw);
    setHtmlInput(cleaned);
    setLastSavedHtml(cleaned);
    if (cleaned !== raw) {
      handleSave(cleaned);
    }
  }, [resolvedWidget.content?.html]);

  // Load created widgets from Studio
  useEffect(() => {
    let mounted = true;
    async function loadUserWidgets() {
      setIsLoadingWidgets(true);
      try {
        const widgets = await getAllWidgets();
        if (mounted) {
          setAvailableWidgets(widgets || []);
        }
      } catch (err) {
        console.warn("[CustomHtmlProperties] Error loading widgets:", err);
      } finally {
        if (mounted) setIsLoadingWidgets(false);
      }
    }
    void loadUserWidgets();
    return () => {
      mounted = false;
    };
  }, []);

  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  const updateContentConfig = (updates: Record<string, any>) => {
    const updated: CustomHtmlWidgetData = {
      ...resolvedWidget,
      content: {
        ...resolvedWidget.content,
        ...updates,
      },
      ...updates,
    };
    if (onChange) {
      onChange(updated);
    }
    if (widgetId) {
      updateWidgetInstance(widgetId, updated as any);
    }
    if (selectedSectionId) {
      updateSection(selectedSectionId, {
        widgetInstance: {
          ...updated,
          id: selectedSectionId,
          variant: "default",
        } as any,
      });
      persistWithStatus();
    }
  };

  const handleSave = (newHtml: string) => {
    const updated: CustomHtmlWidgetData = {
      ...resolvedWidget,
      content: {
        ...resolvedWidget.content,
        html: newHtml,
      },
    };
    if (onChange) {
      onChange(updated);
    }
    if (widgetId) {
      updateWidgetInstance(widgetId, updated as any);
    }
    if (selectedSectionId) {
      updateSection(selectedSectionId, {
        html: newHtml,
        name: widgetName.trim() || undefined,
        widgetInstance: {
          ...updated,
          id: selectedSectionId,
          variant: "default",
        } as any,
      });
      persistWithStatus();
    }
  };

  const handleSaveExplicit = (snippetOverride?: string) => {
    const targetHtml = snippetOverride !== undefined ? snippetOverride : htmlInput;
    setSaveStatus("saving");
    setIsFlashGlow(true);

    handleSave(targetHtml);
    setLastSavedHtml(targetHtml);

    // Notify any canvas/preview instances immediately
    try {
      window.dispatchEvent(
        new CustomEvent("wto-widget-saved", { detail: { widgetId: detectedWidgetId } })
      );
      window.dispatchEvent(
        new CustomEvent("wto-custom-html-saved", { detail: { html: targetHtml, widgetId } })
      );
      window.postMessage({ type: "WTO_CUSTOM_HTML_SAVED", html: targetHtml, widgetId }, "*");
    } catch (_) {}

    setTimeout(() => {
      setSaveStatus("saved");
      toast.success("Saved!", {
        duration: 2000,
      });
    }, 180);

    setTimeout(() => {
      setIsFlashGlow(false);
    }, 1200);

    setTimeout(() => {
      setSaveStatus("idle");
    }, 2800);
  };

  const handleCopy = () => {
    if (!htmlInput) return;
    navigator.clipboard.writeText(htmlInput);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertStudioWidget = (widget: WidgetInstanceRecord) => {
    const snippet = `<div data-wto-widget="${widget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
    setHtmlInput(snippet);
    handleSaveExplicit(snippet);
    toast.success(`Inserted: ${widget.name || widget.id}`);
  };

  const handleInsertGenericIframe = () => {
    const sampleIframe = `<iframe\n  src="https://www.youtube.com/embed/dQw4w9WgXcQ"\n  width="100%"\n  height="400"\n  frameborder="0"\n  allowfullscreen\n  style="border-radius: 12px;"\n></iframe>`;
    setHtmlInput(sampleIframe);
    handleSaveExplicit(sampleIframe);
  };

  const handleInsertGenericContainer = () => {
    const sampleMarkup = `<div style="padding: 32px; background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.15); border-radius: 16px; text-align: center;">\n  <h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Custom Content Area</h3>\n  <p style="font-size: 14px; color: #a1a1aa; margin: 0;">Add your custom HTML, SVG, or embed elements here.</p>\n</div>`;
    setHtmlInput(sampleMarkup);
    handleSaveExplicit(sampleMarkup);
  };

  const handleClear = () => {
    setHtmlInput("");
    handleSaveExplicit("");
    toast.info("Cleared");
  };

  // Detect whether current HTML contains a WebToolOcean widget embed
  const wtoWidgetMatch = htmlInput.match(/data-wto-widget=["']([^"']+)["']/);
  const detectedWidgetId = wtoWidgetMatch ? wtoWidgetMatch[1] : null;
  const connectedWidget = detectedWidgetId
    ? availableWidgets.find((w) => w.id === detectedWidgetId)
    : null;

  return (
    <div className="p-4 space-y-4 text-xs text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-xs">Custom HTML / Embed</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRightPanelTab("embeds")}
            className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            All Embeds →
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!htmlInput}
            className="text-[10px] text-zinc-400 hover:text-zinc-200 disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Widget Name Input */}
      <div>
        <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
          Widget Name
        </label>
        <input
          type="text"
          value={widgetName}
          onChange={(e) => {
            setWidgetName(e.target.value);
            if (selectedSectionId && e.target.value.trim()) {
              updateSection(selectedSectionId, { name: e.target.value.trim() });
            }
          }}
          placeholder="e.g. WhatsApp Contact Button, Booking Form"
          className="w-full h-8 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
        />
      </div>

      {/* Code Editor - First Screen */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-zinc-300 block">
          HTML Code / Embed Snippet
        </label>

        <textarea
          value={htmlInput}
          onChange={(e) => {
            const cleaned = normalizeWidgetSnippet(e.target.value);
            setHtmlInput(cleaned);
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
              e.preventDefault();
              handleSaveExplicit();
            }
          }}
          placeholder="Paste your custom HTML, iframe, or studio widget embed code here..."
          rows={4}
          spellCheck={false}
          className={`w-full p-2.5 font-mono text-xs bg-zinc-950 rounded-lg text-amber-100 placeholder:text-zinc-600 outline-none resize-y leading-relaxed transition-all duration-300 ${
            isFlashGlow
              ? "border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.35)]"
              : isDirty
              ? "border-amber-500/70 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
              : "border border-zinc-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
          }`}
          style={{ minHeight: "88px" }}
        />

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleSaveExplicit()}
            disabled={saveStatus === "saving"}
            className={`flex-1 w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer select-none flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 ${
              saveStatus === "saved"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)] border border-emerald-400/40"
                : saveStatus === "saving"
                ? "bg-amber-500 text-zinc-950 opacity-90"
                : isDirty
                ? "bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-[0_2px_12px_rgba(251,191,36,0.35)] hover:shadow-[0_0_18px_rgba(251,191,36,0.55)] border border-amber-300/80 ring-1 ring-amber-400/30"
                : "bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-[0_2px_10px_rgba(251,191,36,0.25)] hover:shadow-[0_0_16px_rgba(251,191,36,0.45)] border border-amber-300/60"
            }`}
            title="Save code (Ctrl+S)"
          >
            {saveStatus === "saved" ? (
              <>
                <Check className="w-4 h-4 stroke-[3] text-white animate-in zoom-in spin-in-45 duration-200" />
                <span className="font-extrabold tracking-wide">Saved</span>
              </>
            ) : saveStatus === "saving" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>

          {htmlInput && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              title="Clear code"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Sizing & Spacing */}
      <div className="space-y-3 pt-3 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            Width
          </label>
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            <button
              type="button"
              onClick={() => updateContentConfig({ widthMode: "full" })}
              className={`px-2 py-1 rounded font-medium ${
                ((resolvedWidget.content as any)?.widthMode || "full") === "full"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Full Width
            </button>
            <button
              type="button"
              onClick={() => updateContentConfig({ widthMode: "custom" })}
              className={`px-2 py-1 rounded font-medium ${
                (resolvedWidget.content as any)?.widthMode === "custom"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {(resolvedWidget.content as any)?.widthMode === "custom" && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Max Width</span>
              <span className="font-mono text-white">{(resolvedWidget.content as any)?.maxWidth || 1000}px</span>
            </div>
            <input
              type="range"
              min="320"
              max="1440"
              step="20"
              value={(resolvedWidget.content as any)?.maxWidth || 1000}
              onChange={(e) => updateContentConfig({ maxWidth: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        )}

        {/* Height Mode */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
            Height
          </label>
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-[10px]">
            <button
              type="button"
              onClick={() => updateContentConfig({ heightMode: "auto" })}
              className={`px-2 py-1 rounded font-medium ${
                ((resolvedWidget.content as any)?.heightMode || "auto") === "auto"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={() => updateContentConfig({ heightMode: "custom" })}
              className={`px-2 py-1 rounded font-medium ${
                (resolvedWidget.content as any)?.heightMode === "custom"
                  ? "bg-amber-400 text-zinc-950 font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Custom (px)
            </button>
          </div>
        </div>

        {(resolvedWidget.content as any)?.heightMode === "custom" && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Pixel Height</span>
              <span className="font-mono text-white">{(resolvedWidget.content as any)?.customHeight || 450}px</span>
            </div>
            <input
              type="range"
              min="150"
              max="1200"
              step="25"
              value={(resolvedWidget.content as any)?.customHeight || 450}
              onChange={(e) => updateContentConfig({ customHeight: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        )}

        {/* Border Radius */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Border Radius</span>
            <span className="font-mono text-white">{(resolvedWidget.content as any)?.borderRadius || 0}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="2"
            value={(resolvedWidget.content as any)?.borderRadius || 0}
            onChange={(e) => updateContentConfig({ borderRadius: parseInt(e.target.value, 10) })}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Vertical Spacing */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Padding Top</span>
              <span className="font-mono text-white">{(resolvedWidget.content as any)?.paddingTop ?? 24}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="4"
              value={(resolvedWidget.content as any)?.paddingTop ?? 24}
              onChange={(e) => updateContentConfig({ paddingTop: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Padding Bottom</span>
              <span className="font-mono text-white">{(resolvedWidget.content as any)?.paddingBottom ?? 24}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="4"
              value={(resolvedWidget.content as any)?.paddingBottom ?? 24}
              onChange={(e) => updateContentConfig({ paddingBottom: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Connected Widget Badge (Context-Aware) */}
      {detectedWidgetId && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              {connectedWidget?.type === "countdown" ? (
                <Clock className="w-3.5 h-3.5" />
              ) : connectedWidget?.type === "google_reviews" ? (
                <Star className="w-3.5 h-3.5" />
              ) : connectedWidget?.type === "announcement_popup" ? (
                <Megaphone className="w-3.5 h-3.5" />
              ) : connectedWidget?.type === "faq_accordion" ? (
                <HelpCircle className="w-3.5 h-3.5" />
              ) : connectedWidget?.type === "whatsapp_chat" ? (
                <MessageCircle className="w-3.5 h-3.5" />
              ) : connectedWidget?.type === "accessibility" ? (
                <Accessibility className="w-3.5 h-3.5" />
              ) : (
                <Boxes className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white truncate">
                {connectedWidget?.name || `Widget ID: ${detectedWidgetId}`}
              </div>
              <div className="text-[10px] text-amber-300/80 capitalize flex items-center gap-1.5">
                <span>{connectedWidget?.type ? connectedWidget.type.replace(/_/g, " ") : "Studio Widget"}</span>
                {connectedWidget?.status && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-black/40 text-zinc-300 font-semibold uppercase">
                    {connectedWidget.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <a
            href={
              connectedWidget?.type === "countdown"
                ? `/dashboard/widgets/countdown/${detectedWidgetId}`
                : connectedWidget?.type === "google_reviews"
                  ? `/dashboard/widgets/google-reviews/${detectedWidgetId}`
                  : connectedWidget?.type === "announcement_popup"
                    ? `/dashboard/widgets/announcement-popup/${detectedWidgetId}`
                    : connectedWidget?.type === "faq_accordion"
                      ? `/dashboard/widgets/faq-accordion/${detectedWidgetId}`
                      : connectedWidget?.type === "whatsapp_chat"
                        ? `/dashboard/widgets/whatsapp-chat/${detectedWidgetId}`
                        : connectedWidget?.type === "accessibility"
                          ? `/dashboard/widgets/accessibility/${detectedWidgetId}`
                          : `/dashboard/widgets`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0"
            title="Edit this widget in Studio"
          >
            <span>Edit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Studio Widget Quick-Insert Dropdown / Picker */}
      <div className="space-y-1.5 pt-1 border-t border-zinc-800/80">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-zinc-400" />
            <span>Embed Studio Widget</span>
          </label>
          <a
            href="/dashboard/widgets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
          >
            <span>Widget Hub</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {availableWidgets.length > 0 ? (
          <div className="relative">
            <select
              value={connectedWidget?.id || ""}
              onChange={(e) => {
                const targetWidget = availableWidgets.find((w) => w.id === e.target.value);
                if (targetWidget) {
                  handleInsertStudioWidget(targetWidget);
                }
              }}
              className="w-full py-2 px-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-400 rounded-lg text-xs text-zinc-200 outline-none transition cursor-pointer"
            >
              <option value="" disabled>
                -- Select a widget to embed --
              </option>
              {availableWidgets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name || w.id} ({w.type ? w.type.replace(/_/g, " ") : "Widget"})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{isLoadingWidgets ? "Loading studio widgets…" : "No widgets found in your Studio."}</span>
            <a
              href="/dashboard/widgets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-semibold"
            >
              Create one →
            </a>
          </div>
        )}
      </div>

      {/* Quick Snippets Presets */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Quick Snippets
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleInsertGenericIframe}
            className="py-1 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-[11px] text-zinc-300 transition"
          >
            + iFrame Embed
          </button>
          <button
            type="button"
            onClick={handleInsertGenericContainer}
            className="py-1 px-2.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-[11px] text-zinc-300 transition"
          >
            + Custom Container
          </button>
        </div>
      </div>
    </div>
  );
}
