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
  const storageKeys = ["wto_dynamic_widgets_v1", "wto_widgets"];
  for (const k of storageKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed[widgetId]) return parsed[widgetId];
      }
    } catch (e) {}
    try {
      const sRaw = sessionStorage.getItem(k);
      if (sRaw) {
        const parsed = JSON.parse(sRaw);
        if (parsed && parsed[widgetId]) return parsed[widgetId];
      }
    } catch (e) {}
    try {
      if (window.parent && window.parent !== window) {
        const pRaw = window.parent.localStorage.getItem(k);
        if (pRaw) {
          const parsed = JSON.parse(pRaw);
          if (parsed && parsed[widgetId]) return parsed[widgetId];
        }
      }
    } catch (e) {}
    try {
      if (window.top && window.top !== window) {
        const tRaw = window.top.localStorage.getItem(k);
        if (tRaw) {
          const parsed = JSON.parse(tRaw);
          if (parsed && parsed[widgetId]) return parsed[widgetId];
        }
      }
    } catch (e) {}
  }
  return null;
}

export function buildCustomHtmlBootstrapMarkup(
  data: WidgetData,
  context?: WidgetExportContext,
): string {
  const d = isCustomHtmlWidgetData(data) ? data : defaultCustomHtmlWidgetData;
  const rawHtml = String(d.content?.html || "").trim();

  // 1. If empty: In PREVIEW / EXPORT mode, do NOT show empty placeholder at all!
  if (!rawHtml) {
    if (!context?.editorMode) {
      return "";
    }
    return `
      <div class="wto-custom-html-empty"
           data-wto-ignore-edit="1"
           data-builder-selectable="false"
           data-builder-editor-only="1"
           contenteditable="false"
           style="display:flex !important;align-items:center !important;justify-content:center !important;gap:8px !important;min-height:68px !important;width:100% !important;margin:12px 0 !important;padding:16px 20px !important;box-sizing:border-box !important;border:2px dashed rgba(245,158,11,0.4) !important;border-radius:12px !important;background-color:#18181b !important;color:#fbbf24 !important;font-size:13.5px !important;font-weight:600 !important;text-align:center !important;user-select:none !important;cursor:pointer !important;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;pointer-events:none;"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        <span style="pointer-events:none;">Add your widget here...</span>
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
          const res = renderAnnouncementPopupHtml(widget as any, { isPreview: !context?.editorMode });
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
          return `${styleTag}<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-100 overflow-visible" style="display:block;width:100%;position:relative;">${renderedHtml}</div>`;
        }
      }
    } catch (e) {
      // fallback
    }

    // If widget not found in local storage, but rawHtml already contains rendered widget markup, preserve it!
    if (/wto-countdown-root|wto-announcement-bar-root|wto-popup-backdrop|wto-google-reviews-root|wto-reviews-container|wto-faq-root|wto-faq-container|wto-dynamic-widget-root|wto-cd-inner/i.test(rawHtml)) {
      const cleanHtml = context?.editorMode
        ? rawHtml.replace(/<script[^>]*src=["']https:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "")
        : rawHtml;
      return `<div class="wto-custom-html-wrapper w-100 overflow-visible" style="display:block;width:100%;position:relative;">${cleanHtml}</div>`;
    }

    // If not found in local storage, in preview or live mode preserve the embed markup so runtime script can initialize it
    if (!context?.editorMode) {
      const cleanHtml = rawHtml.replace(/<script[^>]*src=["']https:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "");
      return `<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-100 overflow-visible" style="display:block;width:100%;position:relative;">${cleanHtml}</div>`;
    }
    return `
      <div data-wto-widget="${widgetId}" class="wto-custom-html-pending"
           style="display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;min-height:140px !important;width:100% !important;margin:20px 0 !important;padding:28px 20px !important;box-sizing:border-box !important;border:2px dashed rgba(245,158,11,0.55) !important;border-radius:14px !important;background-color:#18181b !important;color:#f4f4f5 !important;text-align:center !important;cursor:pointer !important;box-shadow:0 4px 20px rgba(0,0,0,0.25) !important;">
        <div style="color:#f59e0b !important;font-size:14px;font-weight:700;margin-bottom:6px;">Dynamic Widget: ${widgetId}</div>
        <p style="font-size:12px;color:#a1a1aa !important;margin:0;">Interactive widget will render live upon preview or publish.</p>
      </div>
    `.trim();
  }

  // 3. If no widget embed is present: In PREVIEW / EXPORT mode, do NOT show it
  if (!context?.editorMode) {
    return "";
  }

  const cleanHtml = rawHtml.replace(/<script[^>]*src=["']https:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "");
  return `<div class="wto-custom-html-wrapper w-100 overflow-visible" style="display:block;width:100%;position:relative;">${cleanHtml}</div>`;
}
