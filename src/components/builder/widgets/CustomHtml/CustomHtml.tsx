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
  const [livePreviewMarkup, setLivePreviewMarkup] = useState<string | null>(null);
  const [isWidgetDisabled, setIsWidgetDisabled] = useState(false);

  // Check if this Custom HTML contains a WebToolOcean widget embed (e.g. data-wto-widget="wgt_google_..." or data-wto-widget="wgt_wa_...")
  const wtoWidgetMatch = rawHtml.match(/data-wto-widget=(?:["']|&quot;)?([^"'\s>&;]+)(?:["']|&quot;)?/i);
  const detectedWidgetId = wtoWidgetMatch ? wtoWidgetMatch[1] : null;

  useEffect(() => {
    let mounted = true;
    if (!detectedWidgetId) {
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
            const cfg = (record.config || {}) as any;
            const content = cfg.content || {};
            const appearance = cfg.appearance || {};
            const phone = content.phoneNumber || "";
            const agentName = content.agentName || "Customer Support";
            const pos = appearance.position === "bottom_left" ? "Bottom-Left" : "Bottom-Right";
            const btnColor = appearance.buttonColor || "#25d366";

            // In-canvas placeholder badge card so user immediately sees their widget in the builder canvas
            const inCanvasCard = `
              <div class="wto-wa-canvas-badge" style="background:#091913;border:1.5px solid rgba(34,197,94,0.35);border-radius:14px;padding:16px 20px;margin:12px 0;box-shadow:0 6px 20px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;text-align:left;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
                  <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:44px;height:44px;border-radius:50%;background:${btnColor};color:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(37,211,102,0.35);flex-shrink:0;">
                      <svg viewBox="0 0 32 32" width="24" height="24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/></svg>
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:14px;color:#ffffff;display:flex;align-items:center;gap:8px;">
                        <span>WhatsApp Live Chat</span>
                        <span style="font-size:10px;font-weight:700;letter-spacing:0.5px;padding:2px 8px;border-radius:999px;background:rgba(34,197,94,0.2);color:#4ade80;border:1px solid rgba(34,197,94,0.35);">ACTIVE</span>
                      </div>
                      <div style="font-size:12px;color:#a1a1aa;margin-top:3px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span>Phone: <strong style="color:#ffffff;">${phone ? '+' + phone.replace(/^\+/, '') : 'Not configured'}</strong></span>
                        <span>•</span>
                        <span>Agent: <strong style="color:#ffffff;">${agentName}</strong></span>
                        <span>•</span>
                        <span>Position: <strong style="color:#ffffff;">${pos}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href="/dashboard/widgets/whatsapp-chat/${record.id}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:7px 14px;border-radius:8px;background:#18181b;color:#fbbf24;border:1px solid rgba(245,158,11,0.35);text-decoration:none;transition:all 0.15s ease;">
                      Open Widget Studio ↗
                    </a>
                  </div>
                </div>
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#71717a;">
                  <span>Floating chat button is live on this page (${pos.toLowerCase()}). Click button to test chat.</span>
                  <span style="font-family:monospace;color:#a1a1aa;">${record.id}</span>
                </div>
              </div>
            `;
            fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + inCanvasCard + rendered.html;
          } else if (record.type === "accessibility") {
            const rendered = renderAccessibilityHtml(record as any, { isPreview: false });
            const cfg = (record.config || {}) as any;
            const appearance = cfg.appearance || {};
            const pos =
              appearance.position === "bottom_left"
                ? "Bottom-Left"
                : appearance.position === "top_left"
                ? "Top-Left"
                : appearance.position === "top_right"
                ? "Top-Right"
                : "Bottom-Right";
            const btnColor = appearance.accentColor || appearance.backgroundColor || "#3b82f6";

            const inCanvasCard = `
              <div class="wto-a11y-canvas-badge" style="background:#090d16;border:1.5px solid rgba(59,130,246,0.35);border-radius:14px;padding:16px 20px;margin:12px 0;box-shadow:0 6px 20px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;text-align:left;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
                  <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:44px;height:44px;border-radius:50%;background:${btnColor};color:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(59,130,246,0.35);flex-shrink:0;">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:14px;color:#ffffff;display:flex;align-items:center;gap:8px;">
                        <span>Accessibility Toolbar</span>
                        <span style="font-size:10px;font-weight:700;letter-spacing:0.5px;padding:2px 8px;border-radius:999px;background:rgba(59,130,246,0.2);color:#60a5fa;border:1px solid rgba(59,130,246,0.35);">ACTIVE</span>
                      </div>
                      <div style="font-size:12px;color:#a1a1aa;margin-top:3px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span>Position: <strong style="color:#ffffff;">${pos}</strong></span>
                        <span>•</span>
                        <span>Shortcut: <strong style="color:#ffffff;">Alt + A</strong></span>
                        <span>•</span>
                        <span>Theme: <strong style="color:#ffffff;">${appearance.theme || 'Modern'}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href="/dashboard/widgets/accessibility/${record.id}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:7px 14px;border-radius:8px;background:#18181b;color:#fbbf24;border:1px solid rgba(245,158,11,0.35);text-decoration:none;transition:all 0.15s ease;">
                      Open Widget Studio ↗
                    </a>
                  </div>
                </div>
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#71717a;">
                  <span>Floating accessibility launcher is active on this page (${pos.toLowerCase()}). Click launcher or press Alt+A to test.</span>
                  <span style="font-family:monospace;color:#a1a1aa;">${record.id}</span>
                </div>
              </div>
            `;
            fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + inCanvasCard + rendered.html;
          } else if (record.type === "language_switcher") {
            const rendered = renderLanguageSwitcherHtml(record as any, { isPreview: false });
            const cfg = (record.config || {}) as any;
            const appearance = cfg.appearance || {};
            const pos =
              appearance.position === "bottom_left"
                ? "Bottom-Left"
                : appearance.position === "top_left"
                ? "Top-Left"
                : appearance.position === "top_right"
                ? "Top-Right"
                : "Bottom-Right";
            const languages = (cfg.languages || []).map((l: any) => l.name || l.code).join(", ") || "Multiple languages";

            const inCanvasCard = `
              <div class="wto-lang-canvas-badge" style="background:#0c121e;border:1.5px solid rgba(59,130,246,0.35);border-radius:14px;padding:16px 20px;margin:12px 0;box-shadow:0 6px 20px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;text-align:left;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
                  <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(59,130,246,0.35);flex-shrink:0;">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:14px;color:#ffffff;display:flex;align-items:center;gap:8px;">
                        <span>Language Switcher</span>
                        <span style="font-size:10px;font-weight:700;letter-spacing:0.5px;padding:2px 8px;border-radius:999px;background:rgba(59,130,246,0.2);color:#60a5fa;border:1px solid rgba(59,130,246,0.35);">ACTIVE</span>
                      </div>
                      <div style="font-size:12px;color:#a1a1aa;margin-top:3px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span>Position: <strong style="color:#ffffff;">${pos}</strong></span>
                        <span>•</span>
                        <span>Languages: <strong style="color:#ffffff;">${languages}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href="/dashboard/widgets/language-switcher/${record.id}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:7px 14px;border-radius:8px;background:#18181b;color:#60a5fa;border:1px solid rgba(59,130,246,0.35);text-decoration:none;transition:all 0.15s ease;">
                      Open Widget Studio ↗
                    </a>
                  </div>
                </div>
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#71717a;">
                  <span>Interactive translation switcher will be live on this page.</span>
                  <span style="font-family:monospace;color:#a1a1aa;">${record.id}</span>
                </div>
              </div>
            `;
            fullMarkup = (rendered.css ? `<style>${rendered.css}</style>\n` : "") + inCanvasCard + rendered.html;
          } else if (record.type === "announcement_popup" && (record.config as any)?.displayMode === "popup") {
            const cfg = (record.config || {}) as any;
            const trigger = cfg.displayRules?.trigger || "immediate";
            const delaySec = cfg.displayRules?.triggerDelaySeconds || 2;
            const triggerLabel =
              trigger === "delay"
                ? `After ${delaySec}s delay on page load`
                : trigger === "scroll"
                ? `On ${cfg.displayRules?.triggerScrollPercent || 40}% scroll`
                : trigger === "exit_intent"
                ? "On exit intent"
                : "Immediately on load";

            const inCanvasCard = `
              <div class="wto-popup-canvas-badge" style="background:#0e0b16;border:1.5px solid rgba(168,85,247,0.35);border-radius:14px;padding:16px 20px;margin:12px 0;box-shadow:0 6px 20px rgba(0,0,0,0.3);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e4e4e7;text-align:left;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
                  <div style="display:flex;align-items:center;gap:14px;">
                    <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(168,85,247,0.35);flex-shrink:0;">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:14px;color:#ffffff;display:flex;align-items:center;gap:8px;">
                        <span>Popup Modal</span>
                        <span style="font-size:10px;font-weight:700;letter-spacing:0.5px;padding:2px 8px;border-radius:999px;background:rgba(168,85,247,0.2);color:#c084fc;border:1px solid rgba(168,85,247,0.35);">ACTIVE</span>
                      </div>
                      <div style="font-size:12px;color:#a1a1aa;margin-top:3px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span>Headline: <strong style="color:#ffffff;">${cfg.content?.headline || record.name}</strong></span>
                        <span>•</span>
                        <span>Trigger: <strong style="color:#ffffff;">${triggerLabel}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href="/dashboard/widgets/announcement-popup/${record.id}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:7px 14px;border-radius:8px;background:#18181b;color:#c084fc;border:1px solid rgba(168,85,247,0.35);text-decoration:none;transition:all 0.15s ease;">
                      Open Widget Studio ↗
                    </a>
                  </div>
                </div>
                <div style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#71717a;">
                  <span>Modal overlay triggers automatically for visitors on the live site and Demo view based on your display rules.</span>
                  <span style="font-family:monospace;color:#a1a1aa;">${record.id}</span>
                </div>
              </div>
            `;
            fullMarkup = inCanvasCard;
          } else {
            const rendered =
              record.type === "countdown"
                ? renderCountdownHtml(record as any)
                : record.type === "announcement_popup"
                ? renderAnnouncementPopupHtml(record as any, { isPreview: false, isStudioMockup: false })
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
        ) : detectedWidgetId?.startsWith("wgt_wa") ? (
          <div className="w-full p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>Initializing WhatsApp Live Chat widget (<strong>{detectedWidgetId}</strong>)...</span>
            </div>
            <a
              href={`/dashboard/widgets/whatsapp-chat/${detectedWidgetId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
            >
              Open Studio ↗
            </a>
          </div>
        ) : (
          <div className="relative group">
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
