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
  createNewWhatsAppChatWidget,
  createNewAccessibilityWidget,
  createNewLanguageSwitcherWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  renderGoogleReviewsHtml,
  renderCountdownHtml,
  renderAnnouncementPopupHtml,
  renderFaqHtml,
  renderWhatsAppChatHtml,
  renderAccessibilityHtml,
  renderLanguageSwitcherHtml,
  attachWidgetInteractivity,
} from "@/lib/widget-runtime/wtoWidgetRuntime";
import { Code2, Sparkles, MessageCircle, Accessibility } from "lucide-react";
import { useBuilder } from "@/lib/builder/store";
import { getCustomHtmlRawContent, getCustomHtmlConfig } from "./CustomHtmlBootstrapExport";

export function CustomHtml({ data = defaultCustomHtmlWidgetData }: { data: WidgetData }) {
  const d = isCustomHtmlWidgetData(data) ? data : defaultCustomHtmlWidgetData;
  const containerRef = useRef<HTMLDivElement>(null);
  const rawHtml = getCustomHtmlRawContent(d);
  const sanitizedRawHtml = rawHtml
    .replace(/<script[^>]*src=["']https?:\/\/widgets\.webtoolocean\.com\/widget\.js["'][^>]*>\s*<\/script>/gi, "")
    .replace(/https?:\/\/widgets\.webtoolocean\.com\/widget\.js/gi, "/widget.js");
  const hasActiveProject = useBuilder((s) => Boolean(s.currentProjectId));
  const isEditable = typeof window !== "undefined" && (window.location.pathname.startsWith("/editor") || hasActiveProject);
  const [livePreviewMarkup, setLivePreviewMarkup] = useState<string | null>(null);
  const [isWidgetDisabled, setIsWidgetDisabled] = useState(false);

  const hasScript = /<script\b/i.test(rawHtml);
  const widgetIdAttrMatch = rawHtml.match(/data-widget-id=["']([^"']+)["']/i);
  const customWidgetId = widgetIdAttrMatch ? widgetIdAttrMatch[1] : null;
  const isPureScript = hasScript && rawHtml.replace(/<script[\s\S]*?<\/script>/gi, "").trim() === "";

  // Check if this Custom HTML contains a WebToolOcean widget embed (e.g. data-wto-widget="wgt_google_..." or data-wto-widget="wgt_wa_...")
  const wtoWidgetMatch = rawHtml.match(/data-wto-widget=(?:["']|&quot;)?([^"'\s>&;]+)(?:["']|&quot;)?/i);
  const detectedWidgetId = wtoWidgetMatch ? wtoWidgetMatch[1] : null;

  useEffect(() => {
    let mounted = true;
    const isWaScript = /whatsapp(\.min)?\.js|wa\.me|whatsapp_chat/i.test(rawHtml) || (d.content as any)?.embedType === "whatsapp" || Boolean((d.content as any)?.phoneNumber);
    const isFaqScript = /faq(\.min)?\.js|faq_accordion/i.test(rawHtml) || (d.content as any)?.embedType === "faq" || (Array.isArray((d.content as any)?.faqItems) && (d.content as any).faqItems.length > 0);

    if (!detectedWidgetId) {
      if (isWaScript) {
        try {
          const contentObj = (d.content || {}) as any;
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
          const fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + rendered.html;
          setLivePreviewMarkup(fullMarkup);
          setIsWidgetDisabled(false);
          return;
        } catch (_) {}
      }

      if (isFaqScript) {
        try {
          const contentObj = (d.content || {}) as any;
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
          const fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + rendered.html;
          setLivePreviewMarkup(fullMarkup);
          setIsWidgetDisabled(false);
          return;
        } catch (_) {}
      }

      setLivePreviewMarkup(null);
      setIsWidgetDisabled(false);
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
          } else if (detectedWidgetId.startsWith("wgt_wa")) {
            record = createNewWhatsAppChatWidget("WhatsApp Live Chat", "classic_whatsapp");
            record.id = detectedWidgetId;
            void saveWidget(record);
          } else if (detectedWidgetId.startsWith("wgt_acc")) {
            record = createNewAccessibilityWidget("Accessibility Toolbar", "modern_floating");
            record.id = detectedWidgetId;
            void saveWidget(record);
          } else if (detectedWidgetId.startsWith("wgt_lang")) {
            record = createNewLanguageSwitcherWidget("Language Switcher", "classic_globe");
            record.id = detectedWidgetId;
            void saveWidget(record);
          }
        }
        if (mounted && record) {
          if (record.enabled === false) {
            setIsWidgetDisabled(true);
            setLivePreviewMarkup("");
            return;
          }
          setIsWidgetDisabled(false);

          let fullMarkup = "";
          if (record.type === "whatsapp_chat") {
            const rendered = renderWhatsAppChatHtml(record as any, { isPreview: false });
            fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + rendered.html;
          } else if (record.type === "accessibility") {
            const rendered = renderAccessibilityHtml(record as any, { isPreview: false });
            fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + rendered.html;
          } else if (record.type === "language_switcher") {
            const rendered = renderLanguageSwitcherHtml(record as any, { isPreview: false });
            fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + rendered.html;
          } else if (record.type === "announcement_popup") {
            const rendered = renderAnnouncementPopupHtml(record as any, { isPreview: false, isStudioMockup: false });
            fullMarkup = rendered.css ? `<style>${rendered.css}</style>\n${rendered.html}` : rendered.html;
          } else {
            const rendered =
              record.type === "countdown"
                ? renderCountdownHtml(record as any)
                : record.type === "faq_accordion"
                ? renderFaqHtml(record as any)
                : renderGoogleReviewsHtml(record);
            fullMarkup = rendered.css ? `<style>${rendered.css}</style>\n${rendered.html}` : rendered.html;
          }

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
    const cleanup = attachWidgetInteractivity(containerRef.current, { isPreview: true });
    return cleanup;
  }, [livePreviewMarkup, rawHtml]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scripts = Array.from(container.querySelectorAll("script"));
    const createdScripts: HTMLScriptElement[] = [];

    scripts.forEach((oldScript) => {
      if (oldScript.getAttribute("data-wto-executed") === "1") return;
      if (oldScript.getAttribute("type") === "text/wto-inert") return;
      const widgetId = oldScript.getAttribute("data-widget-id");
      const src = oldScript.getAttribute("src");

      if (src && src.includes("webtoolocean.com") && !widgetId) {
        console.warn("[CustomHtml] Embed script is missing data-widget-id attribute:", src);
      }

      if (widgetId) {
        if (
          (window as any)["__WTO_POPUP_" + widgetId + "_LOADED__"] ||
          (src && src.includes("whatsapp") && (window as any)["__WTO_WHATSAPP_LOADED__"])
        ) {
          oldScript.setAttribute("data-wto-executed", "1");
          return;
        }
      }
      oldScript.setAttribute("data-wto-executed", "1");

      const newScript = document.createElement("script");
      for (let i = 0; i < oldScript.attributes.length; i++) {
        const attr = oldScript.attributes[i];
        if (attr.name === "type" && attr.value === "text/wto-inert") continue;
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.setAttribute("data-wto-executed", "1");
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      newScript.onerror = (e) => {
        console.warn("[CustomHtml] Failed to load external embed script:", src, e);
      };

      oldScript.parentNode?.replaceChild(newScript, oldScript);
      createdScripts.push(newScript);
    });

    return () => {
      createdScripts.forEach((s) => {
        const widgetId = s.getAttribute("data-widget-id");
        if (widgetId) {
          const popupHost = document.getElementById("wto-popup-host-" + widgetId);
          if (popupHost) popupHost.remove();
          delete (window as any)["__WTO_POPUP_" + widgetId + "_LOADED__"];

          const waHost = document.getElementById("wto-whatsapp-container-" + widgetId);
          if (waHost) waHost.remove();
          delete (window as any)["__WTO_WHATSAPP_LOADED__"];
        }
        s.remove();
      });
    };
  }, [sanitizedRawHtml]);

  if (d.advanced?.visibility === false) return null;
  if (detectedWidgetId && isWidgetDisabled) return null;

  const cfg = getCustomHtmlConfig(d);

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
      <div
        className="w-full transition-all"
        style={{
          maxWidth: cfg.widthMode === "custom" ? `${cfg.maxWidth}px` : "100%",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: `${cfg.paddingTop}px`,
          paddingBottom: `${cfg.paddingBottom}px`,
          height: cfg.heightMode === "custom" ? `${cfg.customHeight}px` : "auto",
          borderRadius: cfg.borderRadius > 0 ? `${cfg.borderRadius}px` : undefined,
          overflow: cfg.heightMode === "custom" || cfg.borderRadius > 0 ? "hidden" : "visible",
        }}
      >
        <div ref={containerRef} className="w-full h-full">
        {!rawHtml ? (
          <div
            onClick={() => useBuilder.getState().setRightPanelTab("embeds")}
            className="wto-custom-html-empty select-none transition hover:border-amber-400/70"
            data-wto-ignore-edit="1"
            data-builder-selectable="false"
            data-builder-editor-only="1"
            contentEditable={false}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "56px",
              width: "100%",
              margin: "8px 0",
              padding: "12px 18px",
              boxSizing: "border-box",
              border: "1.5px dashed rgba(245, 158, 11, 0.45)",
              borderRadius: "10px",
              backgroundColor: "#18181b",
              color: "#fbbf24",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            <Code2 className="w-4 h-4 text-amber-400 shrink-0 pointer-events-none" />
            <span className="pointer-events-none">Configure Custom Embed / HTML</span>
          </div>
        ) : livePreviewMarkup ? (
          <div className="w-full" dangerouslySetInnerHTML={{ __html: livePreviewMarkup }} />
        ) : (
          <div className="relative group w-full">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: sanitizedRawHtml }}
            />
          </div>
        )}
        </div>
      </div>
    </BaseWidget>
  );
}
