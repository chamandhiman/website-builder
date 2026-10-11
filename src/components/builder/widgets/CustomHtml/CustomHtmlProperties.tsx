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

  const resolvedWidget: CustomHtmlWidgetData =
    value && isCustomHtmlWidgetData(value)
      ? value
      : defaultCustomHtmlWidgetData;

  const [htmlInput, setHtmlInput] = useState<string>(() =>
    normalizeWidgetSnippet(resolvedWidget.content?.html || "")
  );
  const [copied, setCopied] = useState(false);
  const [availableWidgets, setAvailableWidgets] = useState<WidgetInstanceRecord[]>([]);
  const [isLoadingWidgets, setIsLoadingWidgets] = useState(false);

  useEffect(() => {
    const raw = resolvedWidget.content?.html || "";
    const cleaned = normalizeWidgetSnippet(raw);
    setHtmlInput(cleaned);
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
    } else if (widgetId) {
      updateWidgetInstance(widgetId, updated as any);
    }
  };

  const handleCopy = () => {
    if (!htmlInput) return;
    navigator.clipboard.writeText(htmlInput);
    setCopied(true);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertStudioWidget = (widget: WidgetInstanceRecord) => {
    const snippet = `<div data-wto-widget="${widget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
    setHtmlInput(snippet);
    handleSave(snippet);
    toast.success(`Inserted widget embed: ${widget.name || widget.id}`);
  };

  const handleInsertGenericIframe = () => {
    const sampleIframe = `<iframe\n  src="https://www.youtube.com/embed/dQw4w9WgXcQ"\n  width="100%"\n  height="400"\n  frameborder="0"\n  allowfullscreen\n  style="border-radius: 12px;"\n></iframe>`;
    setHtmlInput(sampleIframe);
    handleSave(sampleIframe);
    toast.success("Inserted sample iFrame snippet");
  };

  const handleInsertGenericContainer = () => {
    const sampleMarkup = `<div style="padding: 32px; background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.15); border-radius: 16px; text-align: center;">\n  <h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Custom Content Area</h3>\n  <p style="font-size: 14px; color: #a1a1aa; margin: 0;">Add your custom HTML, SVG, or embed elements here.</p>\n</div>`;
    setHtmlInput(sampleMarkup);
    handleSave(sampleMarkup);
    toast.success("Inserted custom HTML layout template");
  };

  const handleClear = () => {
    setHtmlInput("");
    handleSave("");
    toast.info("Cleared Custom HTML content");
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
            handleSave(cleaned);
          }}
          placeholder="Paste your custom HTML, iframe, or studio widget embed code here..."
          rows={4}
          spellCheck={false}
          className="w-full p-2.5 font-mono text-xs bg-zinc-950 border border-zinc-800 focus:border-amber-400 rounded-lg text-amber-100 placeholder:text-zinc-600 outline-none resize-y leading-relaxed"
          style={{ minHeight: "88px" }}
        />

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[10px] text-zinc-500">
            {htmlInput.length} characters
          </span>
          <div className="flex items-center gap-2">
            {htmlInput && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[10px] text-zinc-400 hover:text-rose-400 transition flex items-center gap-1"
                title="Clear code"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                handleSave(htmlInput);
                toast.success("Custom HTML saved!");
              }}
              className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors shadow-sm"
            >
              Save Code
            </button>
          </div>
        </div>

        {/* Small reasonable 1-line text */}
        <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1 leading-normal">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Paste your Studio widget code, &lt;iframe&gt;, or custom HTML &amp; CSS here.</span>
        </p>
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
