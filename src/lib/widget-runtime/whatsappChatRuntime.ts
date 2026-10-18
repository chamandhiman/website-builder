import type { WidgetInstanceRecord } from "@/services/widgetService";
import {
  type WhatsAppChatConfig,
  normalizeWhatsAppPhone,
  isValidWhatsAppPhone,
  createWhatsAppUrl,
  DEFAULT_WHATSAPP_CONFIG,
} from "@/services/whatsappChatTemplates";
import type { RenderWidgetOptions } from "./wtoWidgetRuntime";

/**
 * Escapes HTML characters safely to prevent XSS.
 */
function escapeXml(v: string | number | boolean | undefined | null): string {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizes URLs (specifically avatars) to prevent script pseudo-protocols.
 */
function sanitizeAvatarUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(javascript|vbscript|data:text\/html):/i.test(trimmed)) {
    return "";
  }
  return trimmed;
}

/**
 * Standard WhatsApp crisp SVG icon.
 */
export const WHATSAPP_ICON_SVG = `<svg viewBox="0 0 32 32" width="100%" height="100%" fill="currentColor" aria-hidden="true" style="display:block;"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/></svg>`;

/**
 * Normalizes WhatsApp widget configuration ensuring defaults are always present.
 */
export function normalizeWhatsAppChatConfig(raw: any): WhatsAppChatConfig {
  const def = DEFAULT_WHATSAPP_CONFIG;
  const content = raw?.content || {};
  const appearance = raw?.appearance || {};
  const behavior = raw?.behavior || {};

  return {
    content: {
      phoneNumber: content.phoneNumber || "",
      buttonLabel: content.buttonLabel ?? def.content.buttonLabel,
      greetingText: content.greetingText ?? def.content.greetingText,
      prefilledMessage: content.prefilledMessage ?? def.content.prefilledMessage,
      agentName: content.agentName ?? def.content.agentName,
      agentAvatarUrl: content.agentAvatarUrl ?? "",
      statusLabel: content.statusLabel ?? def.content.statusLabel,
      workingHoursNotice: content.workingHoursNotice ?? def.content.workingHoursNotice,
      showWorkingHoursNotice: content.showWorkingHoursNotice ?? def.content.showWorkingHoursNotice,
    },
    appearance: {
      template: appearance.template || def.appearance.template,
      layoutStyle: appearance.layoutStyle || def.appearance.layoutStyle,
      buttonColor: appearance.buttonColor || def.appearance.buttonColor,
      buttonTextColor: appearance.buttonTextColor || def.appearance.buttonTextColor,
      iconSize: Number(appearance.iconSize) || def.appearance.iconSize,
      buttonDiameter: Number(appearance.buttonDiameter) || def.appearance.buttonDiameter,
      borderRadius: Number(appearance.borderRadius) ?? def.appearance.borderRadius,
      greetingBgColor: appearance.greetingBgColor || def.appearance.greetingBgColor,
      greetingTextColor: appearance.greetingTextColor || def.appearance.greetingTextColor,
      position: appearance.position || def.appearance.position,
      offsetX: Number(appearance.offsetX) ?? def.appearance.offsetX,
      offsetY: Number(appearance.offsetY) ?? def.appearance.offsetY,
      showTooltip: appearance.showTooltip ?? def.appearance.showTooltip,
      customTooltipText: appearance.customTooltipText ?? def.appearance.customTooltipText,
      entranceAnimation: appearance.entranceAnimation || def.appearance.entranceAnimation,
      attentionAnimation: appearance.attentionAnimation || def.appearance.attentionAnimation,
      theme: appearance.theme || def.appearance.theme,
    },
    behavior: {
      openInNewTab: behavior.openInNewTab ?? def.behavior.openInNewTab,
      prefillMessage: behavior.prefillMessage ?? def.behavior.prefillMessage,
      showGreetingBubble: behavior.showGreetingBubble ?? def.behavior.showGreetingBubble,
      greetingDelaySec: Number(behavior.greetingDelaySec) ?? def.behavior.greetingDelaySec,
      autoDismissGreetingSec: Number(behavior.autoDismissGreetingSec) ?? def.behavior.autoDismissGreetingSec,
      visibleOnDesktop: behavior.visibleOnDesktop ?? def.behavior.visibleOnDesktop,
      visibleOnMobile: behavior.visibleOnMobile ?? def.behavior.visibleOnMobile,
    },
  };
}

/**
 * Generates the HTML and CSS markup for WhatsApp Live Chat widget.
 */
export function renderWhatsAppChatHtml(
  widget: WidgetInstanceRecord<WhatsAppChatConfig>,
  options?: RenderWidgetOptions
): { html: string; css: string } {
  if (widget.enabled === false) {
    return { html: "", css: "" };
  }

  const cfg = normalizeWhatsAppChatConfig(widget.config);
  const widgetId = widget.id || "wgt_wa_preview";
  const cls = `wto-wa-${widgetId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const isPreview = options?.isPreview ?? false;

  const { content, appearance, behavior } = cfg;
  const isLeft = appearance.position === "bottom_left";

  // Phone and click link resolution
  const validPhone = isValidWhatsAppPhone(content.phoneNumber);
  const cleanPhone = normalizeWhatsAppPhone(content.phoneNumber);
  let waUrl = "#";
  if (validPhone) {
    try {
      waUrl = createWhatsAppUrl(cleanPhone, behavior.prefillMessage ? content.prefilledMessage : "");
    } catch {
      waUrl = "#";
    }
  }

  // Avatar markup
  const avatarUrl = sanitizeAvatarUrl(content.agentAvatarUrl);
  const avatarHtml = avatarUrl
    ? `<img src="${escapeXml(avatarUrl)}" alt="${escapeXml(content.agentName)}" class="wto-wa-avatar-img" />`
    : `<div class="wto-wa-avatar-fallback">${escapeXml(
        content.agentName
          ? content.agentName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "WA"
      )}</div>`;

  // Layout branches:
  // 1. floating_button: Simple circle / pill button with optional hover tooltip
  // 2. button_with_greeting: Floating button + greeting speech bubble with dismiss 'x'
  // 3. contact_card: Floating button + popover card with agent header, greeting message, working hours, and CTA
  const isContactCard = appearance.layoutStyle === "contact_card";
  const isGreetingBubble = appearance.layoutStyle === "button_with_greeting";
  const showBubble = behavior.showGreetingBubble && (isGreetingBubble || isContactCard);

  // Position styles
  const posSide = isLeft ? `left: ${appearance.offsetX}px;` : `right: ${appearance.offsetX}px;`;
  const posBottom = `bottom: ${appearance.offsetY}px;`;

  // Device visibility class
  const desktopHidden = !behavior.visibleOnDesktop ? "wto-wa-hide-desktop" : "";
  const mobileHidden = !behavior.visibleOnMobile ? "wto-wa-hide-mobile" : "";

  // Animation classes
  const entranceAnimCls =
    appearance.entranceAnimation && appearance.entranceAnimation !== "none"
      ? `wto-wa-anim-${appearance.entranceAnimation}`
      : "";
  const attentionAnimCls =
    appearance.attentionAnimation && appearance.attentionAnimation !== "none"
      ? `wto-wa-attn-${appearance.attentionAnimation}`
      : "";

  const css = `
    .${cls} {
      position: ${isPreview ? "absolute" : "fixed"};
      ${posBottom}
      ${posSide}
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.45;
      color: #111827;
      box-sizing: border-box;
      pointer-events: auto;
      direction: ltr;
      display: flex;
      flex-direction: column;
      align-items: ${isLeft ? "flex-start" : "flex-end"};
      gap: 12px;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .${cls} * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Device visibility */
    @media (min-width: 768px) {
      .${cls}.wto-wa-hide-desktop {
        display: none !important;
      }
    }
    @media (max-width: 767px) {
      .${cls}.wto-wa-hide-mobile {
        display: none !important;
      }
    }

    /* Floating Button */
    .${cls} .wto-wa-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: ${appearance.buttonColor};
      color: ${appearance.buttonTextColor};
      min-width: ${appearance.buttonDiameter}px;
      height: ${appearance.buttonDiameter}px;
      border-radius: ${appearance.borderRadius}px;
      padding: ${appearance.borderRadius >= 30 ? "0 18px 0 16px" : "0 14px"};
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.12);
      text-decoration: none;
      cursor: pointer;
      border: none;
      outline: none;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background-color 0.15s ease;
      position: relative;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .${cls} .wto-wa-btn:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28), 0 3px 8px rgba(0, 0, 0, 0.16);
    }

    .${cls} .wto-wa-btn:active {
      transform: translateY(1px) scale(0.97);
    }

    .${cls} .wto-wa-btn-icon {
      width: ${appearance.iconSize}px;
      height: ${appearance.iconSize}px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${cls} .wto-wa-btn-label {
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      letter-spacing: -0.01em;
    }

    /* Badge count or green dot */
    .${cls} .wto-wa-online-dot {
      width: 10px;
      height: 10px;
      background: #22c55e;
      border: 2px solid #ffffff;
      border-radius: 50%;
      position: absolute;
      top: 4px;
      right: 4px;
      box-shadow: 0 0 4px rgba(34, 197, 94, 0.6);
    }

    /* Hover Tooltip */
    .${cls} .wto-wa-tooltip {
      position: absolute;
      ${isLeft ? "left: calc(100% + 12px);" : "right: calc(100% + 12px);"}
      top: 50%;
      transform: translateY(-50%);
      background: #1e293b;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.18s ease, transform 0.18s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10;
    }

    .${cls} .wto-wa-btn:hover .wto-wa-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(${isLeft ? "4px" : "-4px"});
    }

    /* Speech Bubble Greeting */
    .${cls} .wto-wa-bubble {
      background: ${appearance.greetingBgColor};
      color: ${appearance.greetingTextColor};
      border-radius: 16px;
      padding: 14px 16px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
      max-width: 290px;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
      animation: wtoWaBubblePop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .${cls} .wto-wa-bubble.wto-wa-hidden {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .${cls} .wto-wa-bubble-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: color 0.15s, background-color 0.15s;
    }

    .${cls} .wto-wa-bubble-close:hover {
      color: #4b5563;
      background-color: rgba(0, 0, 0, 0.06);
    }

    .${cls} .wto-wa-bubble-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 18px;
    }

    .${cls} .wto-wa-agent-name {
      font-weight: 600;
      font-size: 13px;
      color: inherit;
    }

    .${cls} .wto-wa-status-label {
      font-size: 11px;
      color: #6b7280;
    }

    .${cls} .wto-wa-bubble-text {
      font-size: 13px;
      line-height: 1.4;
      color: inherit;
    }

    /* Contact Card Modal / Popover */
    .${cls} .wto-wa-card {
      width: 320px;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      transition: opacity 0.25s ease, transform 0.25s ease;
      animation: wtoWaCardPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .${cls} .wto-wa-card.wto-wa-hidden {
      display: none !important;
    }

    .${cls} .wto-wa-card-header {
      background: ${appearance.buttonColor};
      color: #ffffff;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }

    .${cls} .wto-wa-card-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .${cls} .wto-wa-card-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.8);
    }

    .${cls} .wto-wa-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .${cls} .wto-wa-avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
    }

    .${cls} .wto-wa-card-title {
      font-weight: 700;
      font-size: 15px;
      line-height: 1.2;
    }

    .${cls} .wto-wa-card-status {
      font-size: 12px;
      opacity: 0.88;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 3px;
    }

    .${cls} .wto-wa-card-status-dot {
      width: 7px;
      height: 7px;
      background: #86efac;
      border-radius: 50%;
      display: inline-block;
    }

    .${cls} .wto-wa-card-close {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      color: #ffffff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s;
    }

    .${cls} .wto-wa-card-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .${cls} .wto-wa-card-body {
      padding: 16px 18px;
      background: #f8fafc;
      background-image: radial-gradient(#e2e8f0 0.75px, transparent 0.75px);
      background-size: 12px 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .${cls} .wto-wa-card-bubble {
      background: #ffffff;
      color: #1f2937;
      padding: 12px 14px;
      border-radius: 12px 12px 12px 2px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      font-size: 13px;
      line-height: 1.45;
      border: 1px solid #e5e7eb;
    }

    .${cls} .wto-wa-card-notice {
      font-size: 11px;
      color: #64748b;
      text-align: center;
      background: rgba(241, 245, 249, 0.85);
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px dashed #cbd5e1;
    }

    .${cls} .wto-wa-card-footer {
      padding: 14px 18px 18px;
      background: #ffffff;
      border-top: 1px solid #f1f5f9;
    }

    .${cls} .wto-wa-card-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: ${appearance.buttonColor};
      color: ${appearance.buttonTextColor};
      text-decoration: none;
      padding: 11px 16px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
      cursor: pointer;
      border: none;
      width: 100%;
    }

    .${cls} .wto-wa-card-action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 14px rgba(0, 0, 0, 0.18);
    }

    /* Animations */
    @keyframes wtoWaBubblePop {
      0% { opacity: 0; transform: translateY(10px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes wtoWaCardPop {
      0% { opacity: 0; transform: translateY(14px) scale(0.94); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes wtoWaFadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes wtoWaSlideUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes wtoWaBounceIn {
      0% { opacity: 0; transform: translateY(40px) scale(0.7); }
      60% { opacity: 1; transform: translateY(-8px) scale(1.05); }
      80% { transform: translateY(4px) scale(0.98); }
      100% { transform: translateY(0) scale(1); }
    }

    .${cls}.wto-wa-anim-fade_in {
      animation: wtoWaFadeIn 0.4s ease-out forwards;
    }
    .${cls}.wto-wa-anim-slide_up {
      animation: wtoWaSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .${cls}.wto-wa-anim-bounce {
      animation: wtoWaBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    /* Attention Animations */
    @keyframes wtoWaPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4); }
    }

    @keyframes wtoWaAttnBounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
      60% { transform: translateY(-4px); }
    }

    .${cls} .wto-wa-attn-subtle_pulse {
      animation: wtoWaPulse 3s infinite ease-in-out;
    }

    .${cls} .wto-wa-attn-subtle_bounce {
      animation: wtoWaAttnBounce 3.5s infinite;
    }

    /* Accessibility / Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .${cls},
      .${cls} *,
      .${cls} .wto-wa-btn,
      .${cls} .wto-wa-bubble,
      .${cls} .wto-wa-card {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  // External top-level navigation: use real anchor element with target="_blank" rel="noopener noreferrer"
  const targetAttr = 'target="_blank" rel="noopener noreferrer"';
  const buttonAriaLabel = `Chat with ${escapeXml(content.agentName || "us")} on WhatsApp`;

  // 1. Bubble element (if layout is button_with_greeting)
  let bubbleHtml = "";
  if (isGreetingBubble && showBubble) {
    bubbleHtml = `
      <div class="wto-wa-bubble" role="dialog" aria-label="Greeting from ${escapeXml(content.agentName)}">
        <button type="button" class="wto-wa-bubble-close" aria-label="Dismiss greeting" data-wa-action="dismiss-bubble">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="wto-wa-bubble-header">
          <span class="wto-wa-agent-name">${escapeXml(content.agentName)}</span>
          ${content.statusLabel ? `<span class="wto-wa-status-label">${escapeXml(content.statusLabel)}</span>` : ""}
        </div>
        <div class="wto-wa-bubble-text">${escapeXml(content.greetingText)}</div>
      </div>
    `;
  }

  // 2. Contact Card element (if layout is contact_card)
  let cardHtml = "";
  if (isContactCard) {
    cardHtml = `
      <div class="wto-wa-card wto-wa-hidden" role="dialog" aria-label="WhatsApp Contact Card" data-wa-card="1">
        <div class="wto-wa-card-header">
          <div class="wto-wa-card-header-info">
            <div class="wto-wa-card-avatar">
              ${avatarHtml}
            </div>
            <div>
              <div class="wto-wa-card-title">${escapeXml(content.agentName)}</div>
              <div class="wto-wa-card-status">
                <span class="wto-wa-card-status-dot"></span>
                <span>${escapeXml(content.statusLabel || "Usually replies in minutes")}</span>
              </div>
            </div>
          </div>
          <button type="button" class="wto-wa-card-close" aria-label="Close chat window" data-wa-action="close-card">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="wto-wa-card-body">
          <div class="wto-wa-card-bubble">
            ${escapeXml(content.greetingText)}
          </div>
          ${
            content.showWorkingHoursNotice && content.workingHoursNotice
              ? `<div class="wto-wa-card-notice">${escapeXml(content.workingHoursNotice)}</div>`
              : ""
          }
        </div>
        <div class="wto-wa-card-footer">
          <a href="${escapeXml(waUrl)}" ${targetAttr} class="wto-wa-card-action-btn" data-wa-action="start-chat" aria-label="${escapeXml(buttonAriaLabel)}">
            <span style="width:20px;height:20px;display:flex;align-items:center;">${WHATSAPP_ICON_SVG}</span>
            <span>${escapeXml(content.buttonLabel || "Start Chat")}</span>
          </a>
        </div>
      </div>
    `;
  }

  // 3. Floating Trigger Button
  const hasLabel = Boolean(content.buttonLabel && appearance.borderRadius < 50);
  const triggerTag = isContactCard ? "button" : "a";
  const triggerHref = !isContactCard ? `href="${escapeXml(waUrl)}" ${targetAttr}` : `type="button"`;

  const buttonHtml = `
    <${triggerTag} ${triggerHref} class="wto-wa-btn ${attentionAnimCls}" data-wa-action="${isContactCard ? "toggle-card" : "open-wa"}" aria-label="${escapeXml(buttonAriaLabel)}">
      <span class="wto-wa-btn-icon">${WHATSAPP_ICON_SVG}</span>
      ${hasLabel ? `<span class="wto-wa-btn-label">${escapeXml(content.buttonLabel)}</span>` : ""}
      <span class="wto-wa-online-dot" aria-hidden="true"></span>
      ${
        appearance.showTooltip && appearance.customTooltipText
          ? `<span class="wto-wa-tooltip">${escapeXml(appearance.customTooltipText)}</span>`
          : ""
      }
    </${triggerTag}>
  `;

  const html = `
    <div class="wto-wa-root ${cls} ${desktopHidden} ${mobileHidden} ${entranceAnimCls}"
         data-wto-widget="${widgetId}"
         data-wto-wa="1"
         data-phone="${escapeXml(cleanPhone)}"
         data-valid="${validPhone ? "1" : "0"}"
         data-new-tab="${behavior.openInNewTab ? "1" : "0"}"
         data-greeting-delay="${behavior.greetingDelaySec || 0}"
         data-auto-dismiss="${behavior.autoDismissGreetingSec || 0}"
         data-layout="${appearance.layoutStyle}">
      ${cardHtml}
      ${bubbleHtml}
      ${buttonHtml}
    </div>
  `.trim();

  return { html, css };
}

/**
 * Attaches client-side interactions to a rendered WhatsApp widget container:
 * - Handling greeting delay & auto-dismiss
 * - Toggling contact card popover
 * - Dismissing greeting bubbles
 * - Validating click action and opening official WhatsApp Click to Chat URL
 */
export function attachWhatsAppChatInteractivity(
  container: HTMLElement | null
): () => void {
  if (!container) return () => {};

  const cleanups: Array<() => void> = [];
  const roots = container.querySelectorAll<HTMLElement>(".wto-wa-root, [data-wto-wa='1']");

  roots.forEach((root) => {
    // Avoid double-binding
    if (root.getAttribute("data-wto-wa-ready") === "1") return;
    root.setAttribute("data-wto-wa-ready", "1");
    cleanups.push(() => root.removeAttribute("data-wto-wa-ready"));

    const card = root.querySelector<HTMLElement>("[data-wa-card='1']");
    const bubble = root.querySelector<HTMLElement>(".wto-wa-bubble");
    const toggleBtn = root.querySelector<HTMLElement>('[data-wa-action="toggle-card"]');
    const closeCardBtn = root.querySelector<HTMLElement>('[data-wa-action="close-card"]');
    const dismissBubbleBtn = root.querySelector<HTMLElement>('[data-wa-action="dismiss-bubble"]');
    const waLinkBtns = root.querySelectorAll<HTMLElement>('[data-wa-action="open-wa"], [data-wa-action="start-chat"]');

    // 1. Card Toggle
    if (card && toggleBtn) {
      const handleToggle = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const isHidden = card.classList.contains("wto-wa-hidden");
        if (isHidden) {
          card.classList.remove("wto-wa-hidden");
          if (bubble) bubble.classList.add("wto-wa-hidden");
        } else {
          card.classList.add("wto-wa-hidden");
        }
      };
      toggleBtn.addEventListener("click", handleToggle);
      cleanups.push(() => toggleBtn.removeEventListener("click", handleToggle));
    }

    if (card && closeCardBtn) {
      const handleClose = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        card.classList.add("wto-wa-hidden");
      };
      closeCardBtn.addEventListener("click", handleClose);
      cleanups.push(() => closeCardBtn.removeEventListener("click", handleClose));
    }

    // 2. Bubble Dismiss
    if (bubble && dismissBubbleBtn) {
      const handleDismiss = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        bubble.classList.add("wto-wa-hidden");
      };
      dismissBubbleBtn.addEventListener("click", handleDismiss);
      cleanups.push(() => dismissBubbleBtn.removeEventListener("click", handleDismiss));
    }

    // 3. Greeting Delay & Auto Dismiss
    const greetingDelaySec = Number(root.getAttribute("data-greeting-delay") || 0);
    const autoDismissSec = Number(root.getAttribute("data-auto-dismiss") || 0);

    if (bubble && greetingDelaySec > 0) {
      bubble.classList.add("wto-wa-hidden");
      const showTimer = setTimeout(() => {
        if (!card || card.classList.contains("wto-wa-hidden")) {
          bubble.classList.remove("wto-wa-hidden");
        }
      }, greetingDelaySec * 1000);
      cleanups.push(() => clearTimeout(showTimer));
    }

    if (bubble && autoDismissSec > 0) {
      const dismissTimer = setTimeout(() => {
        bubble.classList.add("wto-wa-hidden");
      }, (greetingDelaySec + autoDismissSec) * 1000);
      cleanups.push(() => clearTimeout(dismissTimer));
    }

    // 4. Click WhatsApp URL validation safeguard and top-level external navigation
    waLinkBtns.forEach((linkBtn) => {
      const handleWaClick = (e: Event) => {
        const phone = root.getAttribute("data-phone") || "";
        const isValid = root.getAttribute("data-valid") === "1";
        if (!isValid || !phone) {
          e.preventDefault();
          console.warn("[WhatsApp Live Chat] Phone number is not configured or invalid.");
          alert("Please configure a valid WhatsApp phone number with country code in the widget settings.");
          return;
        }

        const href = (linkBtn as HTMLAnchorElement).href || linkBtn.getAttribute("href") || "";
        if (!href || href === "#") {
          e.preventDefault();
          return;
        }

        // Open WhatsApp as a top-level external navigation, never inside an iframe or embedded preview
        const isInsideIframe = typeof window !== "undefined" && window.self !== window.top;
        if (isInsideIframe) {
          e.preventDefault();
          e.stopPropagation();

          try {
            const win = window.open(href, "_blank", "noopener,noreferrer");
            if (!win || win.closed) {
              try {
                if (window.top && window.top !== window) {
                  window.top.open(href, "_blank", "noopener,noreferrer");
                  return;
                }
              } catch (_) {}

              const a = document.createElement("a");
              a.href = href;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              a.style.display = "none";
              document.body.appendChild(a);
              a.click();
              setTimeout(() => {
                try { a.remove(); } catch (_) {}
              }, 100);
            }
          } catch (err) {
            console.warn("[WhatsApp Live Chat] Top-level popup fallback:", err);
            try {
              window.open(href, "_blank", "noopener,noreferrer");
            } catch (_) {}
          }
        }
      };
      linkBtn.addEventListener("click", handleWaClick);
      cleanups.push(() => linkBtn.removeEventListener("click", handleWaClick));
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
