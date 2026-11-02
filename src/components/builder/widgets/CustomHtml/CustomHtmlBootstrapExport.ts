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

export function getCustomHtmlConfig(data: any): {
  widthMode: "full" | "custom";
  maxWidth: number;
  heightMode: "auto" | "custom";
  customHeight: number;
  borderRadius: number;
  paddingTop: number;
  paddingBottom: number;
} {
  const c = data?.content || data?.data?.content || data || {};
  return {
    widthMode: c.widthMode === "custom" ? "custom" : "full",
    maxWidth: typeof c.maxWidth === "number" ? c.maxWidth : (parseInt(c.maxWidth, 10) || 1000),
    heightMode: c.heightMode === "custom" ? "custom" : "auto",
    customHeight: typeof c.customHeight === "number" ? c.customHeight : (parseInt(c.customHeight, 10) || 450),
    borderRadius: typeof c.borderRadius === "number" ? c.borderRadius : (parseInt(c.borderRadius, 10) || 0),
    paddingTop: typeof c.paddingTop === "number" ? c.paddingTop : (parseInt(c.paddingTop, 10) || 24),
    paddingBottom: typeof c.paddingBottom === "number" ? c.paddingBottom : (parseInt(c.paddingBottom, 10) || 24),
  };
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

  const cfg = getCustomHtmlConfig(data);
  const maxWidthStyle = cfg.widthMode === "custom" ? `max-width:${cfg.maxWidth}px;margin-left:auto;margin-right:auto;` : `width:100%;`;
  const heightStyle = cfg.heightMode === "custom" ? `height:${cfg.customHeight}px;overflow:auto;` : ``;
  const radiusStyle = cfg.borderRadius > 0 ? `border-radius:${cfg.borderRadius}px;overflow:hidden;` : ``;
  const paddingStyle = `padding-top:${cfg.paddingTop}px;padding-bottom:${cfg.paddingBottom}px;`;

  const escapeAttr = (s: string) => String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const wrapResult = (inner: string) => {
    return `<div class="wto-custom-html-outer" style="${maxWidthStyle}${paddingStyle}${heightStyle}${radiusStyle}"><div class="wto-custom-html-wrapper w-100 overflow-visible" data-wto-custom-html="1" style="display:block;width:100%;position:relative;">${inner}</div></div>`;
  };

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
          return wrapResult(`${styleTag}<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-100 overflow-visible" style="${containerStyle}">${renderedHtml}</div>`);
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
      return wrapResult(`<div class="wto-custom-html-wrapper w-100 overflow-visible" data-wto-custom-html="1" style="display:block;width:100%;position:relative;">${cleanHtml}</div>`);
    }

    // In preview or live mode preserve the embed markup and ensure runtime script is available
    if (!context?.editorMode) {
      const hasScriptTag = /widget\.js/i.test(rawHtml);
      const scriptTag = hasScriptTag
        ? ""
        : `\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
      return wrapResult(`<div data-wto-widget="${widgetId}" class="wto-embedded-widget-container w-100 overflow-visible" style="display:block;width:100%;">${rawHtml}${scriptTag}</div>`);
    }
  }

  // 3. Check for supported embed scripts (WhatsApp, FAQ, etc.) to render actual visual previews instead of debug cards
  const contentObj = (data as any)?.content || (data as any)?.data?.content || {};
  const isWhatsAppScript = /whatsapp(\.min)?\.js|wa\.me|whatsapp_chat/i.test(rawHtml) || contentObj?.embedType === "whatsapp" || Boolean(contentObj?.phoneNumber);
  const isFaqScript = /faq(\.min)?\.js|faq_accordion/i.test(rawHtml) || contentObj?.embedType === "faq" || (Array.isArray(contentObj?.faqItems) && contentObj.faqItems.length > 0);

  if (isWhatsAppScript) {
    try {
      const phoneAttr = rawHtml.match(/data-phone=["']([^"']+)["']/i)?.[1];
      const agentAttr = rawHtml.match(/data-agent(?:-name)?=["']([^"']+)["']/i)?.[1];
      const msgAttr = rawHtml.match(/data-message=["']([^"']+)["']/i)?.[1];
      const posAttr = rawHtml.match(/data-position=["']([^"']+)["']/i)?.[1];
      const colorAttr = rawHtml.match(/data-color=["']([^"']+)["']/i)?.[1];

      const waWidget = createNewWhatsAppChatWidget(
        contentObj.widgetName || "WhatsApp Live Chat",
        "classic_whatsapp"
      );
      const cfg = waWidget.config as any;
      if (contentObj.phoneNumber || phoneAttr) cfg.content.phoneNumber = contentObj.phoneNumber || phoneAttr;
      if (contentObj.agentName || agentAttr) cfg.content.agentName = contentObj.agentName || agentAttr;
      if (contentObj.message || msgAttr) cfg.content.greetingText = contentObj.message || msgAttr;
      if (contentObj.buttonLabel) cfg.content.buttonLabel = contentObj.buttonLabel;
      if (contentObj.position || posAttr) cfg.appearance.position = contentObj.position || posAttr;
      if (contentObj.buttonColor || colorAttr) cfg.appearance.buttonColor = contentObj.buttonColor || colorAttr;

      const rendered = renderWhatsAppChatHtml(waWidget as any, { isPreview: false });
      const styleTag = rendered.css ? `<style>${rendered.css}</style>\n` : "";
      return wrapResult(`${styleTag}<div class="wto-embedded-wa-container" style="display:block;width:100%;position:relative;">${rendered.html}</div>`);
    } catch (_) {}
  }

  if (isFaqScript) {
    try {
      const faqTitleAttr = rawHtml.match(/data-title=["']([^"']+)["']/i)?.[1];
      const faqWidget = createNewFaqWidget(
        contentObj.widgetName || contentObj.faqTitle || faqTitleAttr || "FAQ Accordion",
        "classic_accordion"
      );
      const cfg = faqWidget.config as any;
      if (contentObj.faqTitle || faqTitleAttr) cfg.header.title = contentObj.faqTitle || faqTitleAttr;
      if (contentObj.faqSubtitle) cfg.header.subtitle = contentObj.faqSubtitle;
      if (Array.isArray(contentObj.faqItems) && contentObj.faqItems.length > 0) {
        cfg.items = contentObj.faqItems;
      }
      if (contentObj.faqLayout) cfg.layout.style = contentObj.faqLayout;
      if (contentObj.accentColor) cfg.style.accentColor = contentObj.accentColor;

      const rendered = renderFaqHtml(faqWidget as any);
      const styleTag = rendered.css ? `<style>${rendered.css}</style>\n` : "";
      return wrapResult(`${styleTag}<div class="wto-embedded-faq-container" style="display:block;width:100%;position:relative;">${rendered.html}</div>`);
    } catch (_) {}
  }

  // 4. For generic custom HTML, iframes, and embeds:
  // Show clean live preview directly without any black debug cards or script labels!
  return wrapResult(rawHtml);
}
