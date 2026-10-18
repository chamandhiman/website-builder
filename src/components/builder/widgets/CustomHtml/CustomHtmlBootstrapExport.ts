import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import { defaultCustomHtmlWidgetData, isCustomHtmlWidgetData } from "./CustomHtmlTypes";
import {
  renderGoogleReviewsHtml,
  renderCountdownHtml,
  renderAnnouncementPopupHtml,
  renderFaqHtml,
  renderWhatsAppChatHtml,
  renderAccessibilityHtml,
} from "@/lib/widget-runtime/wtoWidgetRuntime";
import {
  loadLocalWidgets,
  saveWidget,
  createNewCountdownWidget,
  createNewGoogleReviewsWidget,
  createNewAnnouncementPopupWidget,
  createNewFaqWidget,
  createNewWhatsAppChatWidget,
  createNewAccessibilityWidget,
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

export function getCustomHtmlRawContent(data: any): string {
  if (!data) return "";
  if (typeof data.content?.html === "string" && data.content.html.trim()) {
    return data.content.html.trim();
  }
  if (typeof data.data?.content?.html === "string" && data.data.content.html.trim()) {
    return data.data.content.html.trim();
  }
  if (typeof data.html === "string" && data.html.trim()) {
    return data.html.trim();
  }
  if (typeof data.snippetHtml === "string" && data.snippetHtml.trim()) {
    return data.snippetHtml.trim();
  }
  return "";
}

export function buildCustomHtmlBootstrapMarkup(
  data: WidgetData,
  context?: WidgetExportContext,
): string {
  const rawHtml = getCustomHtmlRawContent(data);

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
           style="display:flex !important;align-items:center !important;justify-content:center !important;gap:10px !important;min-height:56px !important;width:100% !important;margin:8px 0 !important;padding:12px 18px !important;box-sizing:border-box !important;border:1.5px dashed rgba(245,158,11,0.45) !important;border-radius:10px !important;background-color:#18181b !important;color:#fbbf24 !important;font-size:13px !important;font-weight:600 !important;text-align:center !important;user-select:none !important;cursor:pointer !important;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;pointer-events:none;"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        <span style="pointer-events:none;">Configure Custom Embed / HTML</span>
      </div>
    `.trim();
  }

  // 2. Check if this contains a WebToolOcean dynamic widget embed
  const wtoWidgetMatch = rawHtml.match(/data-wto-widget=(?:["']|&quot;)?([^"'\s>&;]+)(?:["']|&quot;)?/i);
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
        } else if (widgetId.startsWith("wgt_wa")) {
          widget = createNewWhatsAppChatWidget("WhatsApp Live Chat", "classic_whatsapp");
          widget.id = widgetId;
          void saveWidget(widget);
        } else if (widgetId.startsWith("wgt_acc")) {
          widget = createNewAccessibilityWidget("Accessibility Toolbar", "modern_floating");
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
          const res = renderAnnouncementPopupHtml(widget as any, { isPreview: false, isStudioMockup: false });
          renderedHtml = res.html;
          renderedCss = res.css;
        } else if (widget.type === "faq_accordion") {
          const res = renderFaqHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        } else if (widget.type === "whatsapp_chat") {
          const res = renderWhatsAppChatHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        } else if (widget.type === "accessibility") {
          const res = renderAccessibilityHtml(widget as any, { isPreview: !context?.editorMode });
          renderedHtml = res.html;
          renderedCss = res.css;
        } else {
          const res = renderGoogleReviewsHtml(widget as any);
          renderedHtml = res.html;
          renderedCss = res.css;
        }
        if (renderedHtml) {
          const styleTag = renderedCss ? `<style>${renderedCss}</style>\n` : "";
          const isPopupModal = widget.type === "announcement_popup" && (widget as any).config?.displayMode === "popup";
          const containerStyle = isPopupModal
            ? "display:block;width:100%;"
            : "display:block;width:100%;position:relative;";
          return `${styleTag}<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-100 overflow-visible" style="${containerStyle}">${renderedHtml}</div>`;
        }
      }
    } catch (e) {
      // fallback
    }

    // If widget not found in local storage, but rawHtml already contains rendered widget markup, preserve it!
    if (/wto-countdown-root|wto-announcement-bar-root|wto-popup-backdrop|wto-google-reviews-root|wto-reviews-container|wto-faq-root|wto-faq-container|wto-wa-root|wto-a11y-root|wto-dynamic-widget-root|wto-cd-inner/i.test(rawHtml)) {
      const cleanHtml = context?.editorMode
        ? rawHtml.replace(/<script[^>]*src=["']https:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "")
        : rawHtml;
      return `<div class="wto-custom-html-wrapper w-100 overflow-visible" style="display:block;width:100%;position:relative;">${cleanHtml}</div>`;
    }

    // If not found in local storage, in preview or live mode preserve the embed markup and ensure runtime script is available
    if (!context?.editorMode) {
      const hasScriptTag = /widget\.js/i.test(rawHtml);
      const scriptTag = hasScriptTag
        ? ""
        : `\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
      return `<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-100 overflow-visible" style="display:block;width:100%;">${rawHtml}${scriptTag}</div>`;
    }
    return `
      <div data-wto-widget="${widgetId}" class="wto-custom-html-pending"
           style="display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;min-height:140px !important;width:100% !important;margin:20px 0 !important;padding:28px 20px !important;box-sizing:border-box !important;border:2px dashed rgba(245,158,11,0.55) !important;border-radius:14px !important;background-color:#18181b !important;color:#f4f4f5 !important;text-align:center !important;cursor:pointer !important;box-shadow:0 4px 20px rgba(0,0,0,0.25) !important;">
        <div style="color:#f59e0b !important;font-size:14px;font-weight:700;margin-bottom:6px;">Dynamic Widget: ${widgetId}</div>
        <p style="font-size:12px;color:#a1a1aa !important;margin:0;">Interactive widget will render live upon preview or publish.</p>
      </div>
    `.trim();
  }

  // 3. For custom HTML, iframes, and third-party embeds (YouTube, Calendly, forms, etc.):
  // ALWAYS return the content so it reliably displays on preview, demo, and published websites!
  return `<div class="wto-custom-html-wrapper w-100 overflow-visible" style="display:block;width:100%;position:relative;">${rawHtml}</div>`;
}
