import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import { defaultCustomHtmlWidgetData, isCustomHtmlWidgetData } from "./CustomHtmlTypes";
import {
  renderGoogleReviewsHtml,
  renderCountdownHtml,
  renderAnnouncementPopupHtml,
  renderFaqHtml,
} from "@/lib/widget-runtime/wtoWidgetRuntime";
import {
  loadLocalWidgets,
  saveWidget,
  createNewCountdownWidget,
  createNewGoogleReviewsWidget,
  createNewAnnouncementPopupWidget,
  createNewFaqWidget,
} from "@/services/widgetService";
import { calculateTargetTimestamp } from "@/services/countdownTemplates";

function getLocalWidget(widgetId: string): any {
  if (typeof window === "undefined") return null;
  try {
    const local = loadLocalWidgets();
    if (local && local[widgetId]) return local[widgetId];
  } catch (e) {}
  try {
    const raw = localStorage.getItem("wto_dynamic_widgets_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed[widgetId]) return parsed[widgetId];
    }
  } catch (e) {}
  try {
    if (window.parent && window.parent !== window) {
      const pRaw = window.parent.localStorage.getItem("wto_dynamic_widgets_v1");
      if (pRaw) {
        const parsed = JSON.parse(pRaw);
        if (parsed && parsed[widgetId]) return parsed[widgetId];
      }
    }
  } catch (e) {}
  try {
    if (window.top && window.top !== window) {
      const tRaw = window.top.localStorage.getItem("wto_dynamic_widgets_v1");
      if (tRaw) {
        const parsed = JSON.parse(tRaw);
        if (parsed && parsed[widgetId]) return parsed[widgetId];
      }
    }
  } catch (e) {}
  return null;
}

export function buildCustomHtmlBootstrapMarkup(
  data: WidgetData,
  context?: WidgetExportContext,
): string {
  const d = isCustomHtmlWidgetData(data) ? data : defaultCustomHtmlWidgetData;
  const rawHtml = String(d.content?.html || "").trim();

  // 1. If empty, ALWAYS render a visible, clickable placeholder container so the block is immediately visible on drag & drop
  if (!rawHtml) {
    return `
      <div class="wto-custom-html-empty py-12 px-6 my-3 rounded-2xl border-2 border-dashed border-amber-400/50 bg-zinc-900/80 text-center flex flex-col items-center justify-center gap-2 select-none transition hover:border-amber-400">
        <div style="width:48px;height:48px;border-radius:14px;background:rgba(250,204,21,0.15);border:1px solid rgba(250,204,21,0.3);display:flex;align-items:center;justify-content:center;color:#facc15;font-weight:bold;font-size:18px;margin:0 auto;">
          &lt;/&gt;
        </div>
        <div style="font-size:15px;font-weight:700;color:#ffffff;margin-top:4px;">
          Custom HTML / Widget Embed
        </div>
        <p style="font-size:12px;color:#a1a1aa;max-width:440px;margin:0 auto;line-height:1.5;">
          Click this block to embed studio widgets (Google Reviews, Countdown Timer, Announcement Bar, Popup), third-party embeds (iFrames, YouTube, Calendly), or custom HTML.
        </p>
      </div>
    `.trim();
  }

  // 2. Check if this contains a WebToolOcean dynamic widget embed
  const wtoWidgetMatch = rawHtml.match(/data-wto-widget=["']([^"']+)["']/);
  if (wtoWidgetMatch) {
    const widgetId = wtoWidgetMatch[1];
    try {
      let widget = getLocalWidget(widgetId);
      if (!widget) {
        if (widgetId.startsWith("wgt_countdown")) {
          widget = createNewCountdownWidget("Countdown Timer", "sales");
          widget.id = widgetId;
          void saveWidget(widget);
        } else if (widgetId.startsWith("wgt_announcement")) {
          widget = createNewAnnouncementPopupWidget("Announcement Bar", "sale_bar", "bar");
          widget.id = widgetId;
          void saveWidget(widget);
        } else if (widgetId.startsWith("wgt_faq")) {
          widget = createNewFaqWidget("FAQ Accordion", "classic_accordion");
          widget.id = widgetId;
          void saveWidget(widget);
        } else if (widgetId.startsWith("wgt_google")) {
          widget = createNewGoogleReviewsWidget("Google Reviews", "carousel");
          widget.id = widgetId;
          void saveWidget(widget);
        }
      }
      if (widget) {
        if (widget.enabled === false) {
          return "";
        }
        if (widget.type === "countdown" && widget.config && (!widget.config.targetTimestamp || widget.config.targetTimestamp <= 0)) {
          const sTime = widget.config.adminStartTime || Date.now();
          widget.config.adminStartTime = sTime;
          widget.config.targetTimestamp = calculateTargetTimestamp(widget.config, { forceRecalculate: true, baseStartTime: sTime });
          void saveWidget(widget);
        }
        let renderedHtml = "";
        let renderedCss = "";
        if (widget.type === "countdown") {
          const res = renderCountdownHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        } else if (widget.type === "announcement_popup") {
          const res = renderAnnouncementPopupHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        } else if (widget.type === "faq_accordion") {
          const res = renderFaqHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        } else {
          const res = renderGoogleReviewsHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        }
        if (renderedHtml) {
          const styleTag = renderedCss ? `<style>${renderedCss}</style>\n` : "";
          return `${styleTag}<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-full">${renderedHtml}</div>`;
        }
      }
    } catch (e) {
      // fallback
    }

    // If widget not found in local storage, but rawHtml already contains rendered widget markup, preserve it!
    if (/wto-countdown-root|wto-dynamic-widget-root|wto-cd-inner/i.test(rawHtml)) {
      const cleanHtml = context?.editorMode
        ? rawHtml.replace(/<script[^>]*src=["']https:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "")
        : rawHtml;
      return `<div class="wto-custom-html-wrapper w-full overflow-visible">${cleanHtml}</div>`;
    }

    // If pending or empty, render a clean placeholder
    return `
      <div data-wto-widget="${widgetId}" class="wto-custom-html-pending py-8 px-6 my-3 rounded-2xl border-2 border-dashed border-amber-400/30 bg-zinc-900/70 text-center flex flex-col items-center justify-center gap-1.5">
        <div style="color:#facc15;font-size:13px;font-weight:700;">Dynamic Widget: ${widgetId}</div>
        <p style="font-size:11px;color:#a1a1aa;margin:0;">Interactive widget will render live upon preview or publish.</p>
      </div>
    `.trim();
  }

  // 3. For custom HTML or third-party embeds
  const cleanHtml = context?.editorMode
    ? rawHtml.replace(/<script[^>]*src=["']https:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "")
    : rawHtml;

  return `<div class="wto-custom-html-wrapper w-full overflow-visible">${cleanHtml}</div>`;
}
