import type { WidgetInstanceRecord } from "../../services/widgetService.ts";
import {
  type AccessibilityConfig,
  type AccessibilityContrastMode,
  DEFAULT_ACCESSIBILITY_CONFIG,
} from "../../services/accessibilityTemplates.ts";
import type { RenderWidgetOptions } from "./wtoWidgetRuntime";

/**
 * Standard Universal Accessibility Humanoid Icon SVG
 */
export const ACCESSIBILITY_ICON_SVG = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;"><circle cx="12" cy="4.5" r="2.5"/><path d="m18 8.5-6 1-6-1"/><path d="M12 9.5v7"/><path d="m9 21.5 3-5 3 5"/></svg>`;

/**
 * Reading Guide horizontal SVG icon
 */
const RULER_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 6H3"/><path d="M21 18H3"/><path d="M7 6v4"/><path d="M12 6v2"/><path d="M17 6v4"/></svg>`;

/**
 * Text size SVG icon
 */
const TEXT_SIZE_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 19 6-14 6 14"/><path d="M5 14h8"/><path d="M18 19v-9"/><path d="M15 13l3-3 3 3"/></svg>`;

/**
 * Contrast SVG icon
 */
const CONTRAST_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/></svg>`;

/**
 * Reset SVG icon
 */
const RESET_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;

/**
 * Close X icon
 */
const CLOSE_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

/**
 * Escapes XML strings safely.
 */
function escapeXml(v: any): string {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Normalizes configuration to ensure all default properties are present.
 */
export function normalizeAccessibilityConfig(raw: any): AccessibilityConfig {
  const def = DEFAULT_ACCESSIBILITY_CONFIG;
  const app = raw?.appearance || {};
  const feat = raw?.features || {};
  const beh = raw?.behavior || {};

  return {
    appearance: {
      template: app.template || def.appearance.template,
      displayStyle: app.displayStyle || def.appearance.displayStyle,
      position: app.position || def.appearance.position,
      offsetX: Number.isFinite(app.offsetX) ? app.offsetX : def.appearance.offsetX,
      offsetY: Number.isFinite(app.offsetY) ? app.offsetY : def.appearance.offsetY,
      buttonSize: Number(app.buttonSize) || def.appearance.buttonSize,
      iconSize: Number(app.iconSize) || def.appearance.iconSize,
      buttonLabel: app.buttonLabel || def.appearance.buttonLabel,
      panelWidth: Number(app.panelWidth) || def.appearance.panelWidth,
      backgroundColor: app.backgroundColor || def.appearance.backgroundColor,
      textColor: app.textColor || def.appearance.textColor,
      accentColor: app.accentColor || def.appearance.accentColor,
      cardBgColor: app.cardBgColor || def.appearance.cardBgColor,
      borderRadius: Number.isFinite(app.borderRadius) ? app.borderRadius : def.appearance.borderRadius,
      shadowIntensity: app.shadowIntensity || def.appearance.shadowIntensity,
      showTooltip: app.showTooltip ?? def.appearance.showTooltip,
      tooltipText: app.tooltipText || def.appearance.tooltipText,
      panelAnimation: app.panelAnimation || def.appearance.panelAnimation,
      theme: app.theme || def.appearance.theme,
    },
    features: {
      textResize: feat.textResize ?? def.features.textResize,
      lineSpacing: feat.lineSpacing ?? def.features.lineSpacing,
      letterSpacing: feat.letterSpacing ?? def.features.letterSpacing,
      readableFont: feat.readableFont ?? def.features.readableFont,
      highlightHeadings: feat.highlightHeadings ?? def.features.highlightHeadings,
      highlightLinks: feat.highlightLinks ?? def.features.highlightLinks,
      readingGuide: feat.readingGuide ?? def.features.readingGuide,
      largeCursor: feat.largeCursor ?? def.features.largeCursor,
      highContrast: feat.highContrast ?? def.features.highContrast,
      darkContrast: feat.darkContrast ?? def.features.darkContrast,
      monochrome: feat.monochrome ?? def.features.monochrome,
      reducedMotion: feat.reducedMotion ?? def.features.reducedMotion,
      screenReaderFriendly: feat.screenReaderFriendly ?? def.features.screenReaderFriendly,
    },
    behavior: {
      rememberPreferences: beh.rememberPreferences ?? def.behavior.rememberPreferences,
      defaultTextScale: Number(beh.defaultTextScale) || def.behavior.defaultTextScale,
      defaultContrast: (beh.defaultContrast || def.behavior.defaultContrast) as AccessibilityContrastMode,
      visibleOnDesktop: beh.visibleOnDesktop ?? def.behavior.visibleOnDesktop,
      visibleOnMobile: beh.visibleOnMobile ?? def.behavior.visibleOnMobile,
      contentScopeSelector: beh.contentScopeSelector || "",
      hotkeyEnabled: beh.hotkeyEnabled ?? def.behavior.hotkeyEnabled,
    },
  };
}

/**
 * Generates the HTML and CSS markup for the Accessibility Widget.
 */
export function renderAccessibilityHtml(
  widget: WidgetInstanceRecord<AccessibilityConfig>,
  options?: RenderWidgetOptions
): { html: string; css: string } {
  if (widget.enabled === false) {
    return { html: "", css: "" };
  }

  const cfg = normalizeAccessibilityConfig(widget.config);
  const { appearance, features, behavior } = cfg;
  const widgetId = widget.id;
  const cls = `wto-a11y-${widgetId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const isLeft = appearance.position === "bottom_left" || appearance.position === "top_left";
  const isTop = appearance.position === "top_left" || appearance.position === "top_right";

  // Shadow level
  let shadowCss = "0 8px 28px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)";
  if (appearance.shadowIntensity === "none") shadowCss = "none";
  if (appearance.shadowIntensity === "soft") shadowCss = "0 4px 16px rgba(0,0,0,0.15)";
  // Adaptive Theme Color Tokens
  const bgLower = (appearance.backgroundColor || "#0f172a").toLowerCase();
  const isLight =
    appearance.theme === "light" ||
    bgLower === "#ffffff" ||
    bgLower === "#fff" ||
    bgLower === "#f8fafc" ||
    bgLower === "#f1f5f9" ||
    bgLower === "#fafafa" ||
    bgLower === "#f3f4f6";

  const borderColor = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.14)";
  const cardBorder = isLight ? "rgba(0, 0, 0, 0.09)" : "rgba(255, 255, 255, 0.1)";
  const cardHoverBorder = isLight ? "rgba(0, 0, 0, 0.22)" : "rgba(255, 255, 255, 0.28)";
  const cardHoverBg = isLight ? "rgba(0, 0, 0, 0.03)" : "rgba(255, 255, 255, 0.06)";
  const headerBg = isLight ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)";
  const headerBorder = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)";
  const footerBg = isLight ? "#f1f5f9" : "rgba(0, 0, 0, 0.32)";
  const footerBorder = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.09)";
  const footerStatusText = isLight ? "#1e293b" : "#f1f5f9";
  const footerNoticeText = isLight ? "#475569" : "rgba(255, 255, 255, 0.65)";
  const resetBtnBg = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.08)";
  const resetBtnBorder = isLight ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.18)";
  const resetBtnText = isLight ? "#0f172a" : "#f8fafc";
  const badgeBg = isLight ? "rgba(0, 0, 0, 0.07)" : "rgba(255, 255, 255, 0.12)";
  const badgeText = isLight ? "#475569" : "#e2e8f0";
  const panelWidthPx = Math.max(380, Number(appearance.panelWidth) || 420);

  // CSS rules
  const css = `
    /* ============================================================== */
    /* WebToolOcean Accessibility Widget - ${widgetId}               */
    /* ============================================================== */

    .${cls}.wto-a11y-root {
      position: ${options?.isPreview ? "absolute" : "fixed"} !important;
      ${isTop ? `top: ${appearance.offsetY}px !important;` : `bottom: ${appearance.offsetY}px !important;`}
      ${isLeft ? `left: ${appearance.offsetX}px !important;` : `right: ${appearance.offsetX}px !important;`}
      z-index: 2147483647 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      box-sizing: border-box !important;
      -webkit-font-smoothing: antialiased;
      line-height: 1.4;
      opacity: 1 !important;
      display: block !important;
      pointer-events: none !important;
    }

    .${cls}.wto-a11y-root *,
    .${cls}.wto-a11y-root *::before,
    .${cls}.wto-a11y-root *::after {
      box-sizing: border-box;
      font-family: inherit;
    }

    /* Floating Launcher Button */
    .${cls} .wto-a11y-launcher-btn {
      pointer-events: auto !important;
      z-index: 2147483647 !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: ${appearance.backgroundColor};
      color: ${appearance.textColor};
      border: 1.5px solid ${appearance.accentColor};
      border-radius: ${appearance.displayStyle === "floating_icon_with_label" ? "9999px" : `${appearance.borderRadius}px`};
      min-width: ${appearance.buttonSize}px;
      height: ${appearance.buttonSize}px;
      padding: ${appearance.displayStyle === "floating_icon_with_label" ? "0 18px" : "0"};
      cursor: pointer;
      box-shadow: ${shadowCss};
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background-color 0.2s ease;
      outline: none;
      position: relative;
      user-select: none;
    }

    .${cls} .wto-a11y-launcher-btn:hover {
      transform: scale(1.05);
      background-color: ${appearance.backgroundColor};
      filter: brightness(1.1);
    }

    .${cls} .wto-a11y-launcher-btn:focus-visible {
      outline: 3px solid ${appearance.accentColor} !important;
      outline-offset: 3px !important;
    }

    .${cls} .wto-a11y-launcher-icon {
      width: ${appearance.iconSize}px;
      height: ${appearance.iconSize}px;
      color: ${appearance.accentColor};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .${cls} .wto-a11y-launcher-label {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: ${appearance.textColor};
      white-space: nowrap;
    }

    /* Tooltip */
    .${cls} .wto-a11y-tooltip {
      position: absolute;
      ${isTop ? "top: 100%; margin-top: 8px;" : "bottom: 100%; margin-bottom: 8px;"}
      ${isLeft ? "left: 0;" : "right: 0;"}
      background-color: #090d16;
      color: #ffffff;
      padding: 6px 11px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateY(${isTop ? "-4px" : "4px"});
      transition: opacity 0.15s ease, transform 0.15s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.12);
      z-index: 10;
    }

    .${cls} .wto-a11y-launcher-btn:hover .wto-a11y-tooltip,
    .${cls} .wto-a11y-launcher-btn:focus-visible .wto-a11y-tooltip {
      opacity: 1;
      transform: translateY(0);
    }

    /* Main Accessibility Panel */
    /* Main Accessibility Panel */
    .${cls} .wto-a11y-panel {
      pointer-events: auto !important;
      z-index: 2147483647 !important;
      position: absolute;
      ${isTop ? `top: calc(100% + 12px);` : `bottom: calc(100% + 12px);`}
      ${isLeft ? "left: 0;" : "right: 0;"}
      width: min(calc(100vw - 28px), ${panelWidthPx}px);
      max-height: min(calc(100vh - 90px), 640px) !important;
      background-color: ${appearance.backgroundColor};
      color: ${appearance.textColor};
      border: 1px solid ${borderColor};
      border-radius: ${appearance.borderRadius}px;
      box-shadow: ${shadowCss};
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: ${isTop ? (isLeft ? "top left" : "top right") : (isLeft ? "bottom left" : "bottom right")};
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s;
    }

    .${cls} .wto-a11y-panel.wto-a11y-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: scale(0.94) translateY(${isTop ? "-10px" : "10px"});
    }

    /* Panel Header */
    .${cls} .wto-a11y-header {
      padding: 16px 20px;
      border-bottom: 1px solid ${headerBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: ${headerBg};
      flex-shrink: 0;
    }

    .${cls} .wto-a11y-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .${cls} .wto-a11y-header-icon {
      width: 24px;
      height: 24px;
      color: ${appearance.accentColor};
    }

    .${cls} .wto-a11y-title {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.01em;
      color: ${appearance.textColor};
      margin: 0;
    }

    .${cls} .wto-a11y-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .${cls} .wto-a11y-btn-reset-header {
      background: ${resetBtnBg};
      border: 1px solid ${resetBtnBorder};
      color: ${appearance.textColor};
      font-size: 12px;
      font-weight: 600;
      padding: 5px 11px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .${cls} .wto-a11y-btn-reset-header:hover {
      border-color: ${appearance.accentColor};
      color: ${appearance.accentColor};
    }

    .${cls} .wto-a11y-btn-close {
      background: transparent;
      border: none;
      color: ${appearance.textColor};
      opacity: 0.75;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.15s ease, background 0.15s ease;
    }

    .${cls} .wto-a11y-btn-close:hover {
      opacity: 1;
      background: ${cardHoverBg};
    }

    /* Scrollable Panel Body */
    .${cls} .wto-a11y-body {
      padding: 18px 20px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 18px;
      scrollbar-width: thin;
      scrollbar-color: rgba(125, 125, 125, 0.3) transparent;
    }

    .${cls} .wto-a11y-section-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${appearance.accentColor};
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .${cls} .wto-a11y-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    /* Tool Buttons */
    .${cls} .wto-a11y-tool-btn {
      background: ${appearance.cardBgColor};
      border: 1.5px solid ${cardBorder};
      border-radius: 12px;
      padding: 13px 14px;
      color: ${appearance.textColor};
      text-align: left;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.18s ease;
      position: relative;
      user-select: none;
    }

    .${cls} .wto-a11y-tool-btn:hover {
      border-color: ${cardHoverBorder};
      background: ${cardHoverBg};
    }

    .${cls} .wto-a11y-tool-btn:focus-visible {
      outline: 2.5px solid ${appearance.accentColor} !important;
      outline-offset: 1px !important;
    }

    .${cls} .wto-a11y-tool-btn.wto-a11y-active {
      background: ${appearance.accentColor}18;
      border-color: ${appearance.accentColor};
      color: ${appearance.accentColor};
    }

    .${cls} .wto-a11y-tool-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .${cls} .wto-a11y-tool-icon {
      width: 18px;
      height: 18px;
      opacity: 0.95;
    }

    .${cls} .wto-a11y-badge-status {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 5px;
      background: ${badgeBg};
      color: ${badgeText};
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .${cls} .wto-a11y-tool-btn.wto-a11y-active .wto-a11y-badge-status {
      background: ${appearance.accentColor};
      color: #0f172a;
    }

    .${cls} .wto-a11y-tool-label {
      font-size: 13px;
      font-weight: 700;
      line-height: 1.35;
      margin: 0;
      color: ${appearance.textColor};
    }

    /* Text Scale Bar */
    .${cls} .wto-a11y-scale-bar {
      grid-column: 1 / -1;
      background: ${appearance.cardBgColor};
      border: 1.5px solid ${cardBorder};
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .${cls} .wto-a11y-scale-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .${cls} .wto-a11y-scale-title {
      font-size: 13px;
      font-weight: 700;
      color: ${appearance.textColor};
      margin: 0;
    }

    .${cls} .wto-a11y-scale-value {
      font-size: 12px;
      color: ${appearance.accentColor};
      font-weight: 800;
      font-family: inherit;
    }

    .${cls} .wto-a11y-scale-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .${cls} .wto-a11y-scale-btn {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: ${resetBtnBg};
      border: 1px solid ${resetBtnBorder};
      color: ${appearance.textColor};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .${cls} .wto-a11y-scale-btn:hover {
      background: ${cardHoverBg};
      border-color: ${appearance.accentColor};
      color: ${appearance.accentColor};
    }

    /* Panel Footer - CLEAN FULL WIDTH SAVE & CLEAR (NO EXTRA CONTENT) */
    .${cls} .wto-a11y-footer {
      padding: 12px 18px;
      border-top: 1px solid ${footerBorder};
      background: ${footerBg};
      flex-shrink: 0;
    }

    .${cls} .wto-a11y-footer-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
    }

    .${cls} .wto-a11y-btn-save-full {
      flex: 1;
      height: 44px;
      background: ${appearance.accentColor};
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px ${appearance.accentColor}40;
      user-select: none;
    }

    .${cls} .wto-a11y-btn-save-full:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px ${appearance.accentColor}55;
    }

    .${cls} .wto-a11y-btn-save-full:active {
      transform: translateY(1px);
    }

    .${cls} .wto-a11y-btn-save-full.wto-a11y-saved {
      background: #10b981 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4) !important;
    }

    .${cls} .wto-a11y-btn-save-full .wto-a11y-save-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${cls} .wto-a11y-btn-clear-footer {
      height: 44px;
      padding: 0 16px;
      background: ${resetBtnBg};
      border: 1.5px solid ${resetBtnBorder};
      color: ${resetBtnText};
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
      white-space: nowrap;
      user-select: none;
    }

    .${cls} .wto-a11y-btn-clear-footer:hover {
      background: ${cardHoverBg};
      border-color: rgba(125, 125, 125, 0.4);
      color: ${appearance.textColor};
    }

    /* Screen Reader Live Region */
    .${cls} .wto-a11y-sr-announcements {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Responsive visibility toggles */
    ${
      !behavior.visibleOnDesktop
        ? `@media (min-width: 769px) { .${cls}.wto-a11y-root { display: none !important; } }`
        : ""
    }
    ${
      !behavior.visibleOnMobile
        ? `@media (max-width: 768px) { .${cls}.wto-a11y-root { display: none !important; } }`
        : ""
    }

    /* ============================================================== */
    /* Dynamic Global Accessibility Classes Applied to Host Website   */
    /* (Excluded explicitly from toolbar to preserve controls)        */
    /* ============================================================== */

    /* 1. Line Spacing */
    body.wto-a11y-active-line-spacing *:not(.wto-a11y-root, .wto-a11y-root *) {
      line-height: 1.85 !important;
    }

    /* 2. Letter Spacing */
    body.wto-a11y-active-letter-spacing *:not(.wto-a11y-root, .wto-a11y-root *) {
      letter-spacing: 0.12em !important;
      word-spacing: 0.16em !important;
    }

    /* 3. Readable Dyslexia-friendly Font */
    body.wto-a11y-active-readable-font *:not(.wto-a11y-root, .wto-a11y-root *) {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    }

    /* 4. Highlight Headings */
    body.wto-a11y-active-highlight-headings :is(h1, h2, h3, h4, h5, h6, [role="heading"]):not(.wto-a11y-root, .wto-a11y-root *) {
      outline: 2px dashed #f59e0b !important;
      outline-offset: 3px !important;
      background-color: rgba(245, 158, 11, 0.12) !important;
    }

    /* 5. Highlight Links */
    body.wto-a11y-active-highlight-links :is(a, [role="link"]):not(.wto-a11y-root, .wto-a11y-root *) {
      text-decoration: underline 3px #38bdf8 !important;
      text-underline-offset: 4px !important;
      background-color: rgba(56, 189, 248, 0.14) !important;
      font-weight: 600 !important;
    }

    /* 6. High Contrast Mode */
    body.wto-a11y-active-high-contrast > .wto-page-shell,
    body.wto-a11y-active-high-contrast > *:not(.wto-floating-widgets-layer):not([data-wto-floating-layer]):not(.wto-a11y-root) {
      filter: contrast(135%) brightness(102%) !important;
    }

    /* 7. Inverted Colors Mode */
    body.wto-a11y-active-inverted > .wto-page-shell,
    body.wto-a11y-active-inverted > *:not(.wto-floating-widgets-layer):not([data-wto-floating-layer]):not(.wto-a11y-root) {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #ffffff !important;
    }
    body.wto-a11y-active-inverted .wto-a11y-root {
      filter: none !important;
    }

    /* 8. Monochrome / Grayscale Mode */
    body.wto-a11y-active-monochrome > .wto-page-shell,
    body.wto-a11y-active-monochrome > *:not(.wto-floating-widgets-layer):not([data-wto-floating-layer]):not(.wto-a11y-root) {
      filter: grayscale(100%) !important;
    }
    body.wto-a11y-active-monochrome .wto-a11y-root {
      filter: none !important;
    }

    /* 9. Large Cursor */
    body.wto-a11y-active-large-cursor,
    body.wto-a11y-active-large-cursor * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='38' height='38' viewBox='0 0 24 24' fill='%23000000' stroke='%23ffffff' stroke-width='2'%3E%3Cpath d='M3 3l7 18 3-7 7-3L3 3z'/%3E%3C/svg%3E"), auto !important;
    }

    /* 10. Reduced Motion */
    body.wto-a11y-active-reduced-motion *,
    body.wto-a11y-active-reduced-motion *::before,
    body.wto-a11y-active-reduced-motion *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }

    /* 11. Reading Guide Ruler */
    .wto-a11y-reading-ruler {
      position: fixed;
      left: 0;
      right: 0;
      width: 100vw;
      height: 4px;
      background: linear-gradient(90deg, #38bdf8, #f59e0b, #38bdf8);
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.6), 0 2px 8px rgba(0,0,0,0.4);
      z-index: 2147483630;
      pointer-events: none;
      transition: top 0.04s ease-out;
    }
  `;

  // HTML markup
  const html = `
    <div id="wto-a11y-${escapeXml(widgetId)}"
         class="wto-a11y-root ${cls}"
         data-wto-widget="${escapeXml(widgetId)}"
         data-wto-a11y="1"
         data-default-scale="${behavior.defaultTextScale}"
         data-default-contrast="${escapeXml(behavior.defaultContrast)}"
         data-remember="${behavior.rememberPreferences ? "1" : "0"}"
         data-hotkey="${behavior.hotkeyEnabled ? "1" : "0"}"
         role="region"
         aria-label="Website Accessibility Toolbar">
      <style>${css}</style>

      <!-- Floating Trigger Button -->
      <button type="button"
              class="wto-a11y-launcher-btn"
              data-a11y-action="toggle-panel"
              aria-expanded="false"
              aria-haspopup="dialog"
              aria-label="Open Accessibility Toolbar">
        <span class="wto-a11y-launcher-icon">
          ${ACCESSIBILITY_ICON_SVG}
        </span>
        ${
          appearance.displayStyle === "floating_icon_with_label"
            ? `<span class="wto-a11y-launcher-label">${escapeXml(appearance.buttonLabel)}</span>`
            : ""
        }
        ${
          appearance.showTooltip
            ? `<span class="wto-a11y-tooltip">${escapeXml(appearance.tooltipText)}</span>`
            : ""
        }
      </button>

      <!-- Accessibility Preferences Panel Dialog -->
      <div class="wto-a11y-panel wto-a11y-hidden"
           role="dialog"
           aria-modal="false"
           aria-label="Accessibility Settings">

        <!-- Header -->
        <div class="wto-a11y-header">
          <div class="wto-a11y-title-wrap">
            <span class="wto-a11y-header-icon">${ACCESSIBILITY_ICON_SVG}</span>
            <h3 class="wto-a11y-title">Accessibility Tools</h3>
          </div>
          <div class="wto-a11y-header-actions">
            <button type="button"
                    class="wto-a11y-btn-reset-header"
                    data-a11y-action="reset-all"
                    title="Reset all settings to default">
              ${RESET_ICON_SVG}
              <span>Reset</span>
            </button>
            <button type="button"
                    class="wto-a11y-btn-close"
                    data-a11y-action="close-panel"
                    aria-label="Close Accessibility Toolbar">
              ${CLOSE_ICON_SVG}
            </button>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="wto-a11y-body">

          <!-- Section: Text & Reading -->
          <div>
            <div class="wto-a11y-section-title">
              ${TEXT_SIZE_ICON_SVG}
              <span>Text &amp; Readability</span>
            </div>
            <div class="wto-a11y-grid">
              ${
                features.textResize
                  ? `
                <!-- Text Resize Controller -->
                <div class="wto-a11y-scale-bar">
                  <div class="wto-a11y-scale-info">
                    <span class="wto-a11y-scale-title">Text Size</span>
                    <span class="wto-a11y-scale-value" data-a11y-scale-val>100%</span>
                  </div>
                  <div class="wto-a11y-scale-controls">
                    <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-decrease" aria-label="Decrease text size" title="Decrease font size">−</button>
                    <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-reset" aria-label="Reset text size" title="Reset font size">A</button>
                    <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-increase" aria-label="Increase text size" title="Increase font size">+</button>
                  </div>
                </div>
              `
                  : ""
              }

              ${
                features.lineSpacing
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="line-spacing" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">↕</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Line Spacing</span>
                </button>
              `
                  : ""
              }

              ${
                features.letterSpacing
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="letter-spacing" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">↔</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Letter Spacing</span>
                </button>
              `
                  : ""
              }

              ${
                features.readableFont
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="readable-font" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">Aa</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Readable Font</span>
                </button>
              `
                  : ""
              }

              ${
                features.highlightHeadings
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="highlight-headings" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">H</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Highlight Headings</span>
                </button>
              `
                  : ""
              }

              ${
                features.highlightLinks
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="highlight-links" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">🔗</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Highlight Links</span>
                </button>
              `
                  : ""
              }

              ${
                features.readingGuide
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="reading-guide" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">${RULER_ICON_SVG}</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Reading Guide</span>
                </button>
              `
                  : ""
              }

              ${
                features.largeCursor
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="large-cursor" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">↗</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Large Cursor</span>
                </button>
              `
                  : ""
              }
            </div>
          </div>

          <!-- Section: Contrast & Display -->
          <div>
            <div class="wto-a11y-section-title">
              ${CONTRAST_ICON_SVG}
              <span>Contrast &amp; Colors</span>
            </div>
            <div class="wto-a11y-grid">
              ${
                features.highContrast
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-contrast="high-contrast" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">◐</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">High Contrast</span>
                </button>
              `
                  : ""
              }

              ${
                features.darkContrast
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-contrast="inverted" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">◑</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Invert Colors</span>
                </button>
              `
                  : ""
              }

              ${
                features.monochrome
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-contrast="monochrome" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">●</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Monochrome</span>
                </button>
              `
                  : ""
              }

              ${
                features.reducedMotion
                  ? `
                <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="reduced-motion" aria-pressed="false">
                  <div class="wto-a11y-tool-top">
                    <span class="wto-a11y-tool-icon">⏸</span>
                    <span class="wto-a11y-badge-status">OFF</span>
                  </div>
                  <span class="wto-a11y-tool-label">Stop Animations</span>
                </button>
              `
                  : ""
              }
            </div>
          </div>

        </div>

        <!-- Panel Footer - Clean Save & Clear (No extra text) -->
        <div class="wto-a11y-footer">
          <div class="wto-a11y-footer-actions">
            <button type="button" class="wto-a11y-btn-save-full" data-a11y-action="save-preferences" aria-label="Save Settings">
              <span class="wto-a11y-save-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              </span>
              <span class="wto-a11y-save-label">Save</span>
            </button>
            <button type="button" class="wto-a11y-btn-clear-footer" data-a11y-action="reset-all" title="Clear all settings" aria-label="Clear all settings">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>Clear</span>
            </button>
          </div>
        </div>

      </div>

      <!-- ARIA Live Announcements for Screen Readers -->
      <div class="wto-a11y-sr-announcements" aria-live="polite" aria-atomic="true"></div>

      <!-- Reading Guide Visual Element -->
      <div class="wto-a11y-reading-ruler" aria-hidden="true" style="display: none;"></div>
    </div>
  `.trim();

  return { html, css };
}

/**
 * Attaches fully functional interactive accessibility behaviors to a container or page.
 */
export function attachAccessibilityInteractivity(
  container: HTMLElement | null,
  options?: { isPreview?: boolean }
): () => void {
  if (!container && typeof document === "undefined") return () => {};

  const root =
    container?.matches?.(".wto-a11y-root, [data-wto-a11y='1']")
      ? container
      : container?.querySelector<HTMLElement>(".wto-a11y-root, [data-wto-a11y='1']") ||
        document.querySelector<HTMLElement>(".wto-a11y-root, [data-wto-a11y='1']");

  if (!root) return () => {};

  // If running on a live website or embedded page (not inside studio preview),
  // hoist root directly into document.body so sticky headers, page transforms, and overflow:hidden never hide it.
  let didHoist = false;
  let originalParent: Node | null = null;
  let nextSibling: Node | null = null;
  if (!options?.isPreview && typeof document !== "undefined" && document.body && root.parentNode !== document.body) {
    originalParent = root.parentNode;
    nextSibling = root.nextSibling;
    document.body.appendChild(root);
    didHoist = true;
  }

  const widgetId = root.getAttribute("data-wto-widget") || "default";
  const remember = root.getAttribute("data-remember") === "1";
  const hotkeyEnabled = root.getAttribute("data-hotkey") === "1";
  const storageKey = `wto_a11y_prefs_${typeof window !== "undefined" ? window.location.hostname || "site" : "site"}`;

  const launcherBtn = root.querySelector<HTMLButtonElement>('[data-a11y-action="toggle-panel"]');
  const panel = root.querySelector<HTMLElement>(".wto-a11y-panel");
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-a11y-action="close-panel"]');
  const resetBtns = root.querySelectorAll<HTMLButtonElement>('[data-a11y-action="reset-all"]');
  const liveAnnouncer = root.querySelector<HTMLElement>(".wto-a11y-sr-announcements");
  const readingRuler = root.querySelector<HTMLElement>(".wto-a11y-reading-ruler");

  // State object
  const state = {
    isOpen: false,
    textScale: Number(root.getAttribute("data-default-scale") || 100),
    activeTools: new Set<string>(),
    activeContrast: "none",
  };

  // Announce for screen-readers
  function announce(message: string) {
    if (liveAnnouncer) {
      liveAnnouncer.textContent = "";
      setTimeout(() => {
        liveAnnouncer.textContent = message;
      }, 50);
    }
  }

  // Save to localStorage
  function persistState() {
    if (!remember || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          textScale: state.textScale,
          tools: Array.from(state.activeTools),
          contrast: state.activeContrast,
        })
      );
    } catch (_) {}
  }

  // Load from localStorage
  function loadPersistedState() {
    if (!remember || typeof localStorage === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Number.isFinite(parsed.textScale)) state.textScale = parsed.textScale;
        if (Array.isArray(parsed.tools)) state.activeTools = new Set(parsed.tools);
        if (typeof parsed.contrast === "string") state.activeContrast = parsed.contrast;
      }
    } catch (_) {}
  }

  // Update UI button states and host document classes
  function applyState() {
    const docBody = document.body;
    if (!docBody) return;

    // 1. Text Scale
    const scaleValEl = root?.querySelector<HTMLElement>("[data-a11y-scale-val]");
    if (scaleValEl) {
      scaleValEl.textContent = `${state.textScale}%`;
    }

    if (state.textScale !== 100) {
      document.documentElement.style.setProperty("--wto-a11y-font-scale", `${state.textScale / 100}`);
      // Apply zoom / font scale safely to host elements excluding toolbar
      docBody.style.fontSize = `${state.textScale}%`;
    } else {
      document.documentElement.style.removeProperty("--wto-a11y-font-scale");
      docBody.style.fontSize = "";
    }

    // 2. Standard Toggles
    const toggleMap: Record<string, string> = {
      "line-spacing": "wto-a11y-active-line-spacing",
      "letter-spacing": "wto-a11y-active-letter-spacing",
      "readable-font": "wto-a11y-active-readable-font",
      "highlight-headings": "wto-a11y-active-highlight-headings",
      "highlight-links": "wto-a11y-active-highlight-links",
      "large-cursor": "wto-a11y-active-large-cursor",
      "reduced-motion": "wto-a11y-active-reduced-motion",
    };

    Object.entries(toggleMap).forEach(([toolKey, className]) => {
      const isActive = state.activeTools.has(toolKey);
      docBody.classList.toggle(className, isActive);

      const btn = root?.querySelector<HTMLButtonElement>(`[data-a11y-tool="${toolKey}"]`);
      if (btn) {
        btn.classList.toggle("wto-a11y-active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        const badge = btn.querySelector(".wto-a11y-badge-status");
        if (badge) badge.textContent = isActive ? "ON" : "OFF";
      }
    });

    // 3. Reading Guide
    const hasGuide = state.activeTools.has("reading-guide");
    if (readingRuler) {
      readingRuler.style.display = hasGuide ? "block" : "none";
    }
    const guideBtn = root?.querySelector<HTMLButtonElement>('[data-a11y-tool="reading-guide"]');
    if (guideBtn) {
      guideBtn.classList.toggle("wto-a11y-active", hasGuide);
      guideBtn.setAttribute("aria-pressed", hasGuide ? "true" : "false");
      const badge = guideBtn.querySelector(".wto-a11y-badge-status");
      if (badge) badge.textContent = hasGuide ? "ON" : "OFF";
    }

    // 4. Contrast Modes
    const contrastClasses = [
      "wto-a11y-active-high-contrast",
      "wto-a11y-active-inverted",
      "wto-a11y-active-monochrome",
    ];
    contrastClasses.forEach((c) => docBody.classList.remove(c));

    if (state.activeContrast === "high-contrast") docBody.classList.add("wto-a11y-active-high-contrast");
    if (state.activeContrast === "inverted") docBody.classList.add("wto-a11y-active-inverted");
    if (state.activeContrast === "monochrome") docBody.classList.add("wto-a11y-active-monochrome");

    ["high-contrast", "inverted", "monochrome"].forEach((mode) => {
      const btn = root?.querySelector<HTMLButtonElement>(`[data-a11y-contrast="${mode}"]`);
      if (btn) {
        const isActive = state.activeContrast === mode;
        btn.classList.toggle("wto-a11y-active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        const badge = btn.querySelector(".wto-a11y-badge-status");
        if (badge) badge.textContent = isActive ? "ON" : "OFF";
      }
    });
  }

  // Toggle Panel Open/Close
  function setPanelOpen(open: boolean) {
    state.isOpen = open;
    if (panel) {
      panel.classList.toggle("wto-a11y-hidden", !open);
    }
    if (launcherBtn) {
      launcherBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (open) {
      // Focus first actionable button inside panel for accessible keyboard navigation
      const firstBtn = panel?.querySelector<HTMLElement>("button, [tabindex='0']");
      if (firstBtn) firstBtn.focus();
      announce("Accessibility menu opened.");
    } else {
      launcherBtn?.focus();
      announce("Accessibility menu closed.");
    }
  }

  // Reset All
  function resetAll() {
    state.textScale = 100;
    state.activeTools.clear();
    state.activeContrast = "none";
    applyState();
    persistState();
    announce("All accessibility adjustments reset to default.");
  }

  // Event Listeners
  launcherBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPanelOpen(!state.isOpen);
  });

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPanelOpen(false);
  });

  resetBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetAll();
    });
  });

  // Save Preferences Action (Full width button with checkmark feedback)
  const saveBtns = root.querySelectorAll<HTMLButtonElement>('[data-a11y-action="save-preferences"]');
  saveBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      persistState();
      btn.classList.add("wto-a11y-saved");
      const label = btn.querySelector<HTMLElement>(".wto-a11y-save-label");
      const icon = btn.querySelector<HTMLElement>(".wto-a11y-save-icon");
      if (label) label.textContent = "Saved";
      if (icon) {
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      }
      announce("Preferences saved successfully.");
      setTimeout(() => {
        btn.classList.remove("wto-a11y-saved");
        if (label) label.textContent = "Save";
        if (icon) {
          icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';
        }
      }, 2500);
    });
  });

  // Text Scale Actions
  root.querySelector('[data-a11y-action="text-increase"]')?.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.textScale < 160) {
      state.textScale = Math.min(160, state.textScale + 10);
      applyState();
      persistState();
      announce(`Text size increased to ${state.textScale} percent`);
    }
  });

  root.querySelector('[data-a11y-action="text-decrease"]')?.addEventListener("click", (e) => {
    e.preventDefault();
    if (state.textScale > 80) {
      state.textScale = Math.max(80, state.textScale - 10);
      applyState();
      persistState();
      announce(`Text size decreased to ${state.textScale} percent`);
    }
  });

  root.querySelector('[data-a11y-action="text-reset"]')?.addEventListener("click", (e) => {
    e.preventDefault();
    state.textScale = 100;
    applyState();
    persistState();
    announce("Text size reset to 100 percent");
  });

  // Standard Tool Toggles
  root.querySelectorAll<HTMLButtonElement>("[data-a11y-tool]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const toolKey = btn.getAttribute("data-a11y-tool");
      if (!toolKey) return;

      if (state.activeTools.has(toolKey)) {
        state.activeTools.delete(toolKey);
        announce(`${toolKey.replace("-", " ")} disabled.`);
      } else {
        state.activeTools.add(toolKey);
        announce(`${toolKey.replace("-", " ")} enabled.`);
      }
      applyState();
      persistState();
    });
  });

  // Contrast Mode Toggles
  root.querySelectorAll<HTMLButtonElement>("[data-a11y-contrast]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const contrastMode = btn.getAttribute("data-a11y-contrast");
      if (!contrastMode) return;

      if (state.activeContrast === contrastMode) {
        state.activeContrast = "none";
        announce("Normal contrast restored.");
      } else {
        state.activeContrast = contrastMode;
        announce(`${contrastMode.replace("-", " ")} enabled.`);
      }
      applyState();
      persistState();
    });
  });

  // Reading Guide mouse tracker
  const handleMouseMove = (e: MouseEvent) => {
    if (!state.activeTools.has("reading-guide") || !readingRuler) return;
    readingRuler.style.top = `${e.clientY}px`;
  };
  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  // Escape to close & hotkey
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && state.isOpen) {
      e.preventDefault();
      setPanelOpen(false);
      return;
    }
    // Alt + A to toggle
    if (hotkeyEnabled && e.altKey && (e.key === "a" || e.key === "A")) {
      e.preventDefault();
      setPanelOpen(!state.isOpen);
    }
  };
  window.addEventListener("keydown", handleKeyDown);

  // Click outside to close panel
  const handleClickOutside = (e: MouseEvent) => {
    if (!state.isOpen) return;
    const target = e.target as HTMLElement;
    if (root && !root.contains(target)) {
      setPanelOpen(false);
    }
  };
  document.addEventListener("click", handleClickOutside);

  // Initial load & apply
  loadPersistedState();
  applyState();

  // Cleanup function
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("click", handleClickOutside);

    // Clean up all document classes and styles
    if (document.body) {
      document.body.classList.remove(
        "wto-a11y-active-line-spacing",
        "wto-a11y-active-letter-spacing",
        "wto-a11y-active-readable-font",
        "wto-a11y-active-highlight-headings",
        "wto-a11y-active-highlight-links",
        "wto-a11y-active-large-cursor",
        "wto-a11y-active-reduced-motion",
        "wto-a11y-active-high-contrast",
        "wto-a11y-active-inverted",
        "wto-a11y-active-monochrome"
      );
      document.body.style.fontSize = "";
    }
    document.documentElement.style.removeProperty("--wto-a11y-font-scale");

    if (didHoist && root.parentNode === document.body) {
      if (originalParent && originalParent.isConnected) {
        originalParent.insertBefore(root, nextSibling);
      } else {
        root.remove();
      }
    }
  };
}
