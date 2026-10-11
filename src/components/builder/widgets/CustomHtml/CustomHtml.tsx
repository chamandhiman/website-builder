import { useEffect, useRef, useState } from "react";
import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultCustomHtmlWidgetData, isCustomHtmlWidgetData } from "./CustomHtmlTypes";
import {
  getWidget,
  saveWidget,
  createNewCountdownWidget,
  createNewGoogleReviewsWidget,
  createNewAnnouncementPopupWidget,
  createNewFaqWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  renderGoogleReviewsHtml,
  renderCountdownHtml,
  renderAnnouncementPopupHtml,
  renderFaqHtml,
  attachWidgetInteractivity,
} from "@/lib/widget-runtime/wtoWidgetRuntime";
import { Code2, Sparkles } from "lucide-react";

export function CustomHtml({ data = defaultCustomHtmlWidgetData }: { data: WidgetData }) {
  const d = isCustomHtmlWidgetData(data) ? data : defaultCustomHtmlWidgetData;
  const containerRef = useRef<HTMLDivElement>(null);
  const rawHtml = String(d.content?.html || "").trim();
  const [livePreviewMarkup, setLivePreviewMarkup] = useState<string | null>(null);

  // Check if this Custom HTML contains a WebToolOcean widget embed (e.g. data-wto-widget="wgt_google_...")
  const wtoWidgetMatch = rawHtml.match(/data-wto-widget=["']([^"']+)["']/);
  const detectedWidgetId = wtoWidgetMatch ? wtoWidgetMatch[1] : null;

  useEffect(() => {
    let mounted = true;
    if (!detectedWidgetId) {
      setLivePreviewMarkup(null);
      return;
    }

    async function loadWidget() {
      try {
        let record = await getWidget(detectedWidgetId!);
        if (!record && detectedWidgetId) {
          if (detectedWidgetId.startsWith("wgt_countdown")) {
            record = createNewCountdownWidget("Countdown Timer", "sales");
            record.id = detectedWidgetId;
            void saveWidget(record);
          } else if (detectedWidgetId.startsWith("wgt_announcement")) {
            record = createNewAnnouncementPopupWidget("Announcement Bar", "sale_bar", "bar");
            record.id = detectedWidgetId;
            void saveWidget(record);
          } else if (detectedWidgetId.startsWith("wgt_faq")) {
            record = createNewFaqWidget("FAQ Accordion", "classic_accordion");
            record.id = detectedWidgetId;
            void saveWidget(record);
          } else if (detectedWidgetId.startsWith("wgt_google")) {
            record = createNewGoogleReviewsWidget("Google Reviews", "carousel");
            record.id = detectedWidgetId;
            void saveWidget(record);
          }
        }
        if (mounted && record) {
          if (record.enabled === false) {
            setLivePreviewMarkup("");
            return;
          }
          const rendered =
            record.type === "countdown"
              ? renderCountdownHtml(record as any)
              : record.type === "announcement_popup"
              ? renderAnnouncementPopupHtml(record as any)
              : record.type === "faq_accordion"
              ? renderFaqHtml(record as any)
              : renderGoogleReviewsHtml(record);
          const fullMarkup = rendered.css ? `<style>${rendered.css}</style>\n${rendered.html}` : rendered.html;
          setLivePreviewMarkup(fullMarkup);
        }
      } catch (err) {
        console.warn("[CustomHtml] Failed to preview embedded widget", err);
      }
    }

    loadWidget();

    const handleSaved = (e: any) => {
      if (e?.detail?.widgetId === detectedWidgetId || !e?.detail?.widgetId) {
        loadWidget();
      }
    };
    window.addEventListener("wto-widget-saved", handleSaved);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "wto_dynamic_widgets_v1" || e.key === "wto_widgets" || !e.key) {
        loadWidget();
      }
    };
    window.addEventListener("storage", handleStorage);

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel("wto_widgets_channel");
        channel.onmessage = (msg) => {
          if (msg?.data?.widgetId === detectedWidgetId || !msg?.data?.widgetId) {
            loadWidget();
          }
        };
      }
    } catch (_) {}

    return () => {
      mounted = false;
      window.removeEventListener("wto-widget-saved", handleSaved);
      window.removeEventListener("storage", handleStorage);
      if (channel) {
        channel.close();
      }
    };
  }, [detectedWidgetId, rawHtml]);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = attachWidgetInteractivity(containerRef.current);
    return cleanup;
  }, [livePreviewMarkup, rawHtml]);

  if (d.advanced?.visibility === false) return null;

  return (
    <BaseWidget
      data={d}
      widgetType="custom-html"
      title="Custom HTML / Embed"
      variantLabel="Generic Embed"
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div ref={containerRef} className="w-full">
        {!rawHtml ? (
          <div className="py-12 px-6 my-3 rounded-2xl border-2 border-dashed border-amber-400/50 bg-zinc-900/80 text-center flex flex-col items-center justify-center gap-2 select-none">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              <Code2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Custom HTML / Widget Embed</h4>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Click this block to embed studio widgets (Google Reviews, Countdown Timer, etc.), third-party embeds (iFrames, YouTube, Calendly), or custom HTML &amp; CSS.
            </p>
          </div>
        ) : livePreviewMarkup ? (
          <div className="w-full" dangerouslySetInnerHTML={{ __html: livePreviewMarkup }} />
        ) : (
          <div className="relative group">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
          </div>
        )}
      </div>
    </BaseWidget>
  );
}
