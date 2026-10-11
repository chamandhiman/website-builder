import type { WidgetInstanceRecord } from "@/services/widgetService";
import { type CountdownConfig, calculateTargetTimestamp } from "@/services/countdownTemplates";
import type { RenderWidgetOptions } from "./wtoWidgetRuntime";

/**
 * Escapes HTML characters safely.
 */
function escapeXml(v: string | number | boolean | undefined | null) {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generates badge icon SVG markup.
 */
function getBadgeIconSvg(icon: string) {
  switch (icon) {
    case "fire":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"></path></svg>`;
    case "zap":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    case "rocket":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`;
    case "sparkles":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;
    case "gift":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`;
    case "clock":
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
  }
}

/**
 * Generates pure HTML & CSS for a dynamic Countdown Timer widget instance.
 */
export function renderCountdownHtml(
  widget: WidgetInstanceRecord<CountdownConfig>,
  options?: RenderWidgetOptions,
): { html: string; css: string } {
  const cfg = (widget.config || {}) as CountdownConfig;
  const widgetId = widget.id;
  const cls = `wto-inst-${widgetId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const colors = cfg.colors || {
    background: "#18181b",
    text: "#ffffff",
    secondaryText: "#a1a1aa",
    numberColor: "#facc15",
    labelColor: "#a1a1aa",
    cardBackground: "#27272a",
    cardBorder: "#3f3f46",
    badgeBackground: "#ef4444",
    badgeText: "#ffffff",
    buttonBackground: "#facc15",
    buttonText: "#000000",
  };

  const typo = cfg.typography || {
    fontFamily: "Inter, sans-serif",
    headingSize: 26,
    timerSize: 36,
    labelSize: 12,
    descriptionSize: 14,
  };

  const spacing = cfg.spacing || {
    padding: 28,
    gap: 16,
    borderRadius: 16,
  };

  const effects = cfg.effects || {
    shadow: true,
    border: true,
    borderColor: "#3f3f46",
  };

  const isSticky = cfg.sticky && (cfg.position === "top_bar" || cfg.position === "bottom_bar");
  const isBanner = cfg.position === "top_bar" || cfg.position === "bottom_bar";

  // Position specific container styles
  let positionStyles = "";
  if (cfg.position === "top_bar") {
    positionStyles = isSticky
      ? "position: sticky; top: 0; left: 0; right: 0; z-index: 9999;"
      : "width: 100%;";
  } else if (cfg.position === "bottom_bar") {
    positionStyles = isSticky
      ? "position: sticky; bottom: 0; left: 0; right: 0; z-index: 9999;"
      : "width: 100%;";
  } else if (cfg.position === "full_width") {
    positionStyles = "width: 100%;";
  } else {
    // inline
    positionStyles = "max-width: 900px; margin: 0 auto;";
  }

  // Border style
  const borderRule = effects.border ? `1px solid ${effects.borderColor || colors.cardBorder || "#3f3f46"}` : "none";
  const shadowRule = effects.shadow ? "0 10px 30px -10px rgba(0,0,0,0.45)" : "none";

  // Build Units HTML
  const units: Array<{ key: "days" | "hours" | "minutes" | "seconds"; label: string; show: boolean }> = [
    { key: "days", label: cfg.labelDays || "Days", show: cfg.showDays !== false },
    { key: "hours", label: cfg.labelHours || "Hours", show: cfg.showHours !== false },
    { key: "minutes", label: cfg.labelMinutes || "Minutes", show: cfg.showMinutes !== false },
    { key: "seconds", label: cfg.labelSeconds || "Seconds", show: cfg.showSeconds !== false },
  ];

  const activeUnits = units.filter((u) => u.show);
  // Default fallback if all turned off
  if (activeUnits.length === 0) {
    activeUnits.push({ key: "seconds", label: cfg.labelSeconds || "Seconds", show: true });
  }

  // Render Unit Blocks based on style
  const unitsHtml = activeUnits
    .map((unit, idx) => {
      const showColon = cfg.timerStyle === "minimal" && idx < activeUnits.length - 1;
      return `
        <div class="wto-cd-unit wto-cd-unit-${unit.key}" data-unit="${unit.key}">
          <div class="wto-cd-digit-box">
            <span class="wto-cd-digit" data-digit-for="${unit.key}">00</span>
            ${cfg.timerStyle === "flip" ? `<div class="wto-cd-flip-line"></div>` : ""}
          </div>
          ${
            cfg.showLabels !== false
              ? `<span class="wto-cd-label">${escapeXml(unit.label)}</span>`
              : ""
          }
        </div>
        ${showColon ? `<div class="wto-cd-separator">:</div>` : ""}
      `;
    })
    .join("");

  // Badge HTML
  let badgeHtml = "";
  if (cfg.showBadge && cfg.badgeText) {
    badgeHtml = `
      <div class="wto-cd-badge">
        <span class="wto-cd-badge-icon">${getBadgeIconSvg(cfg.badgeIcon || "fire")}</span>
        <span>${escapeXml(cfg.badgeText)}</span>
      </div>
    `;
  }

  // Heading & Description HTML
  let textHtml = "";
  if (cfg.heading || cfg.description) {
    textHtml = `
      <div class="wto-cd-text-group">
        ${
          cfg.heading
            ? `<h3 class="wto-cd-heading" style="${cfg.headingBold ? "font-weight: 700;" : "font-weight: 500;"}${cfg.headingItalic ? "font-style: italic;" : ""}${cfg.headingUnderline ? "text-decoration: underline;" : ""}">${escapeXml(cfg.heading)}</h3>`
            : ""
        }
        ${
          cfg.description
            ? `<p class="wto-cd-desc" style="${cfg.descBold ? "font-weight: 700;" : ""}${cfg.descItalic ? "font-style: italic;" : ""}${cfg.descUnderline ? "text-decoration: underline;" : ""}">${escapeXml(cfg.description)}</p>`
            : ""
        }
      </div>
    `;
  }

  // CTA Button HTML
  let ctaHtml = "";
  if (cfg.showCTA && cfg.ctaText) {
    const targetAttr = cfg.ctaTarget === "_blank" ? 'target="_blank" rel="noopener noreferrer"' : "";
    ctaHtml = `
      <div class="wto-cd-cta-wrap">
        <a href="${escapeXml(cfg.ctaUrl || "#")}" ${targetAttr} class="wto-cd-btn wto-cd-btn-${cfg.ctaStyle || "primary"}">
          <span>${escapeXml(cfg.ctaText)}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:6px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>
    `;
  }

  // Close Button HTML (for sticky bars)
  let closeButtonHtml = "";
  if (isBanner && cfg.showCloseButton) {
    closeButtonHtml = `
      <button type="button" class="wto-cd-close-btn" aria-label="Dismiss banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
  }

  // Expiry message container
  const expiryMessageHtml = `
    <div class="wto-cd-expiry-message" style="display:none;">
      <div class="wto-cd-expiry-content">
        <span class="wto-cd-expiry-icon">${getBadgeIconSvg("clock")}</span>
        <p class="wto-cd-expiry-text">${escapeXml(cfg.expiryMessage || "Offer has ended.")}</p>
      </div>
    </div>
  `;

  // Scoped CSS
  const css = `
    .${cls} {
      font-family: ${typo.fontFamily || "Inter, sans-serif"};
      background-color: ${colors.background || "#18181b"};
      color: ${colors.text || "#ffffff"};
      border: ${borderRule};
      border-radius: ${isBanner && cfg.position === "top_bar" ? "0 0 " + spacing.borderRadius + "px " + spacing.borderRadius + "px" : isBanner && cfg.position === "bottom_bar" ? spacing.borderRadius + "px " + spacing.borderRadius + "px 0 0" : spacing.borderRadius + "px"};
      box-shadow: ${shadowRule};
      box-sizing: border-box;
      ${positionStyles}
      overflow: hidden;
      transition: all 0.25s ease;
      position: relative;
    }
    .${cls} * {
      box-sizing: border-box;
    }

    .${cls} .wto-cd-inner {
      padding: ${spacing.padding || 24}px;
      display: flex;
      flex-direction: ${isBanner ? "row" : "column"};
      align-items: center;
      justify-content: ${isBanner ? "space-between" : "center"};
      gap: ${spacing.gap || 16}px;
      text-align: ${cfg.contentAlign || "center"};
      width: 100%;
    }

    .${cls} .wto-cd-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background-color: ${colors.badgeBackground || "#ef4444"};
      color: ${colors.badgeText || "#ffffff"};
      margin-bottom: 8px;
    }

    .${cls} .wto-cd-badge-icon {
      display: inline-flex;
      align-items: center;
    }

    .${cls} .wto-cd-text-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: ${cfg.contentAlign || (isBanner ? "left" : "center")};
      align-items: ${cfg.contentAlign === "left" ? "flex-start" : cfg.contentAlign === "right" ? "flex-end" : "center"};
      ${isBanner ? "max-width: 380px;" : ""}
    }

    .${cls} .wto-cd-heading {
      margin: 0;
      font-size: ${typo.headingSize || 24}px;
      line-height: 1.25;
      color: ${colors.text || "#ffffff"};
      letter-spacing: -0.02em;
    }

    .${cls} .wto-cd-desc {
      margin: 0;
      font-size: ${typo.descriptionSize || 13}px;
      color: ${colors.secondaryText || "#a1a1aa"};
      line-height: 1.4;
    }

    .${cls} .wto-cd-digits-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${cfg.timerStyle === "minimal" ? "8px" : (spacing.gap || 16) + "px"};
      flex-wrap: wrap;
    }

    .${cls} .wto-cd-unit {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: ${cfg.timerStyle === "minimal" ? "auto" : "64px"};
    }

    .${cls} .wto-cd-digit-box {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-weight: 800;
      font-size: ${typo.timerSize || 32}px;
      line-height: 1;
      color: ${colors.numberColor || "#facc15"};
      font-variant-numeric: tabular-nums;
      ${
        cfg.timerStyle === "cards"
          ? `background-color: ${colors.cardBackground || "#27272a"};
             border: 1px solid ${colors.cardBorder || "#3f3f46"};
             border-radius: ${Math.max(6, (spacing.borderRadius || 12) - 4)}px;
             padding: 10px 14px;
             min-width: 60px;
             box-shadow: 0 4px 12px rgba(0,0,0,0.15);`
          : cfg.timerStyle === "flip"
          ? `background: linear-gradient(180deg, ${colors.cardBackground || "#27272a"} 49%, #121214 50%);
             border: 1px solid ${colors.cardBorder || "#3f3f46"};
             border-radius: 8px;
             padding: 10px 14px;
             min-width: 62px;
             box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 14px rgba(0,0,0,0.3);`
          : cfg.timerStyle === "modern"
          ? `background-color: ${colors.cardBackground || "#27272a"}cc;
             backdrop-filter: blur(8px);
             border: 1px solid ${colors.cardBorder || "#3f3f46"};
             border-radius: 9999px;
             padding: 8px 18px;
             min-width: 58px;`
          : cfg.timerStyle === "minimal"
          ? `background: transparent; padding: 2px 4px;`
          : `/* classic */
             padding: 6px 10px;`
      }
    }

    .${cls} .wto-cd-flip-line {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: rgba(0,0,0,0.5);
      box-shadow: 0 1px 0 rgba(255,255,255,0.08);
      pointer-events: none;
    }

    .${cls} .wto-cd-separator {
      font-size: ${typo.timerSize ? typo.timerSize * 0.85 : 28}px;
      font-weight: 700;
      color: ${colors.labelColor || "#a1a1aa"};
      line-height: 1;
      padding-bottom: 12px;
    }

    .${cls} .wto-cd-label {
      font-size: ${typo.labelSize || 11}px;
      font-weight: 600;
      color: ${colors.labelColor || "#a1a1aa"};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 6px;
    }

    /* Number Animations */
    .${cls} .wto-anim-fade-run {
      animation: wtoFade 0.3s ease-in-out;
    }
    .${cls} .wto-anim-slide-run {
      animation: wtoSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .${cls} .wto-anim-flip-run {
      animation: wtoFlip 0.35s ease-in-out;
      transform-style: preserve-3d;
    }

    @keyframes wtoFade {
      0% { opacity: 0.2; }
      100% { opacity: 1; }
    }
    @keyframes wtoSlide {
      0% { transform: translateY(-8px); opacity: 0.3; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes wtoFlip {
      0% { transform: rotateX(-75deg); opacity: 0.4; }
      100% { transform: rotateX(0deg); opacity: 1; }
    }

    /* CTA Button */
    .${cls} .wto-cd-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 22px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .${cls} .wto-cd-btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }
    .${cls} .wto-cd-btn:active {
      transform: translateY(0);
    }

    .${cls} .wto-cd-btn-primary {
      background-color: ${colors.buttonBackground || "#facc15"};
      color: ${colors.buttonText || "#000000"};
      box-shadow: 0 4px 14px ${colors.buttonBackground}40;
    }

    .${cls} .wto-cd-btn-secondary {
      background-color: ${colors.cardBackground || "#27272a"};
      color: ${colors.text || "#ffffff"};
      border: 1px solid ${colors.cardBorder || "#3f3f46"};
    }

    .${cls} .wto-cd-btn-outline {
      background-color: transparent;
      color: ${colors.buttonBackground || "#facc15"};
      border: 2px solid ${colors.buttonBackground || "#facc15"};
    }

    .${cls} .wto-cd-btn-glow {
      background-color: ${colors.buttonBackground || "#ef4444"};
      color: ${colors.buttonText || "#ffffff"};
      box-shadow: 0 0 20px ${colors.buttonBackground || "#ef4444"}80;
    }

    /* Close Button */
    .${cls} .wto-cd-close-btn {
      background: transparent;
      border: none;
      color: ${colors.secondaryText || "#a1a1aa"};
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .${cls} .wto-cd-close-btn:hover {
      color: ${colors.text || "#ffffff"};
      background-color: rgba(255,255,255,0.1);
    }

    /* Expiry Message */
    .${cls} .wto-cd-expiry-message {
      padding: 18px 24px;
      text-align: center;
      width: 100%;
    }
    .${cls} .wto-cd-expiry-content {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: ${colors.text || "#ffffff"};
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .${cls} .wto-cd-inner {
        flex-direction: column !important;
        text-align: center !important;
        padding: 16px !important;
        gap: 14px !important;
      }
      .${cls} .wto-cd-text-group {
        text-align: center !important;
        max-width: 100% !important;
      }
      .${cls} .wto-cd-heading {
        font-size: ${Math.max(16, (typo.headingSize || 24) * 0.8)}px !important;
      }
      .${cls} .wto-cd-digit-box {
        font-size: ${Math.max(20, (typo.timerSize || 32) * 0.75)}px !important;
        padding: 6px 10px !important;
        min-width: 48px !important;
      }
      .${cls} .wto-cd-btn {
        width: 100%;
      }
    }
  `;

  // Dynamic Root Markup with Data Attributes for client-side ticking
  const targetTimestamp = cfg.targetTimestamp || calculateTargetTimestamp(cfg);

  const html = `
    <div class="wto-countdown-root ${cls}"
         data-wto-widget="${widgetId}"
         data-wto-countdown="1"
         data-target-timestamp="${targetTimestamp}"
         data-admin-time="${cfg.adminStartTime || Date.now()}"
         data-mode="${cfg.timerMode || "date"}"
         data-target-date="${cfg.targetDate || ""}"
         data-target-time="${cfg.targetTime || "23:59"}"
         data-timezone="${cfg.timezone || "local"}"
         data-duration-val="${cfg.durationValue || 15}"
         data-duration-unit="${cfg.durationUnit || "minutes"}"
         data-persist="${cfg.persistVisitor ? "1" : "0"}"
         data-counter-start="${cfg.counterStart ?? 100}"
         data-counter-end="${cfg.counterEnd ?? 0}"
         data-counter-dir="${cfg.counterDirection || "down"}"
         data-counter-dur="${cfg.counterDurationSeconds || 60}"
         data-recurring-hrs="${cfg.recurringIntervalHours || 24}"
         data-show-days="${cfg.showDays !== false ? "1" : "0"}"
         data-show-hours="${cfg.showHours !== false ? "1" : "0"}"
         data-show-minutes="${cfg.showMinutes !== false ? "1" : "0"}"
         data-show-seconds="${cfg.showSeconds !== false ? "1" : "0"}"
         data-anim="${cfg.animation || "slide"}"
         data-expiry-action="${cfg.expiryAction || "message"}"
         data-expiry-msg="${escapeXml(cfg.expiryMessage || "Offer has ended.")}"
         data-expiry-url="${escapeXml(cfg.expiryRedirectUrl || "")}"
         data-position="${cfg.position || "inline"}"
         data-sticky="${cfg.sticky ? "1" : "0"}">
      <style>${css}</style>
      <div class="wto-cd-inner">
        <div class="wto-cd-header-col">
          ${badgeHtml}
          ${textHtml}
        </div>

        <div class="wto-cd-timer-col">
          <div class="wto-cd-digits-row">
            ${unitsHtml}
          </div>
        </div>

        ${ctaHtml}
        ${closeButtonHtml}
      </div>

      ${expiryMessageHtml}
    </div>
  `.trim();

  return { html, css };
}

/**
 * Attaches interactive 1-second countdown clock logic, number animations,
 * personal countdown localStorage persistence, and expiry behavior to a rendered container.
 */
export function attachCountdownInteractivity(
  container: HTMLElement | null,
  options?: { isPreview?: boolean }
): () => void {
  if (!container) return () => {};

  const countdownRoots: HTMLElement[] = [];
  if (container.matches?.(".wto-countdown-root, [data-wto-countdown='1']")) {
    countdownRoots.push(container);
  }
  container
    .querySelectorAll<HTMLElement>(".wto-countdown-root, [data-wto-countdown='1']")
    .forEach((el) => {
      if (!countdownRoots.includes(el)) countdownRoots.push(el);
    });

  const cleanups: Array<() => void> = [];

  countdownRoots.forEach((root) => {
    const widgetId = root.getAttribute("data-wto-widget") || "countdown";
    const targetTimestampAttr = Number(root.getAttribute("data-target-timestamp") || 0);
    const mode = root.getAttribute("data-mode") || "date";
    const targetDateStr = root.getAttribute("data-target-date") || "";
    const targetTimeStr = root.getAttribute("data-target-time") || "23:59";
    const timezone = root.getAttribute("data-timezone") || "local";
    const durationVal = Number(root.getAttribute("data-duration-val") || 15);
    const durationUnit = root.getAttribute("data-duration-unit") || "minutes";
    const persist = root.getAttribute("data-persist") === "1";
    const counterStart = Number(root.getAttribute("data-counter-start") || 100);
    const counterEnd = Number(root.getAttribute("data-counter-end") || 0);
    const counterDir = root.getAttribute("data-counter-dir") || "down";
    const counterDur = Math.max(1, Number(root.getAttribute("data-counter-dur") || 60));
    const recurringHrs = Math.max(0.1, Number(root.getAttribute("data-recurring-hrs") || 24));
    const showDays = root.getAttribute("data-show-days") !== "0";
    const showHours = root.getAttribute("data-show-hours") !== "0";
    const showMinutes = root.getAttribute("data-show-minutes") !== "0";
    const showSeconds = root.getAttribute("data-show-seconds") !== "0";
    const animType = root.getAttribute("data-anim") || "none";
    const expiryAction = root.getAttribute("data-expiry-action") || "message";
    const expiryMsg = root.getAttribute("data-expiry-msg") || "Offer has ended.";
    const expiryUrl = root.getAttribute("data-expiry-url") || "";

    const daysEl = root.querySelector<HTMLElement>('[data-digit-for="days"]');
    const hoursEl = root.querySelector<HTMLElement>('[data-digit-for="hours"]');
    const minsEl = root.querySelector<HTMLElement>('[data-digit-for="minutes"]');
    const secsEl = root.querySelector<HTMLElement>('[data-digit-for="seconds"]');
    const timerInner = root.querySelector<HTMLElement>(".wto-cd-inner");
    const expiryMsgEl = root.querySelector<HTMLElement>(".wto-cd-expiry-message");
    const closeBtn = root.querySelector<HTMLButtonElement>(".wto-cd-close-btn");

    // Close button dismiss handler
    if (closeBtn) {
      const handleClose = (e: MouseEvent) => {
        e.preventDefault();
        root.style.transition = "opacity 0.25s, transform 0.25s";
        root.style.opacity = "0";
        root.style.transform = "scale(0.98)";
        setTimeout(() => {
          root.style.display = "none";
        }, 250);
      };
      closeBtn.addEventListener("click", handleClose);
      cleanups.push(() => closeBtn.removeEventListener("click", handleClose));
    }

    // Previous values cache for animations
    const prevValues: Record<string, string> = {};

    function updateDigitWithAnimation(el: HTMLElement | null, newVal: string) {
      if (!el) return;
      const key = el.getAttribute("data-digit-for") || "";
      const oldVal = prevValues[key];

      if (oldVal !== newVal) {
        prevValues[key] = newVal;
        el.textContent = newVal;

        if (animType !== "none" && oldVal !== undefined) {
          const animClass = `wto-anim-${animType}-run`;
          el.classList.remove(animClass);
          // force reflow
          void el.offsetWidth;
          el.classList.add(animClass);
          setTimeout(() => {
            el.classList.remove(animClass);
          }, 350);
        }
      }
    }

    // Personal countdown local storage setup
    const personalKey = `wto_cd_visitor_${widgetId}`;
    let personalEndTime = targetTimestampAttr > 0 ? targetTimestampAttr : 0;
    const personalDurationMs =
      durationVal *
      (durationUnit === "days"
        ? 86400000
        : durationUnit === "hours"
        ? 3600000
        : 60000);

    if (mode === "personal") {
      if (!personalEndTime) {
        if (persist && typeof window !== "undefined") {
          const stored = localStorage.getItem(personalKey);
          if (stored) {
            personalEndTime = Number(stored);
          } else {
            personalEndTime = Date.now() + personalDurationMs;
            localStorage.setItem(personalKey, String(personalEndTime));
          }
        } else {
          personalEndTime = Date.now() + personalDurationMs;
        }
      }
    }

    // Number counter setup
    const counterStartTime = Date.now();

    let hasExpired = false;

    function handleExpiry() {
      if (hasExpired) return;
      hasExpired = true;

      if (expiryAction === "hide") {
        root.style.display = "none";
      } else if (expiryAction === "message") {
        if (timerInner) timerInner.style.display = "none";
        if (expiryMsgEl) {
          expiryMsgEl.style.display = "block";
          const textEl = expiryMsgEl.querySelector<HTMLElement>(".wto-cd-expiry-text");
          if (textEl) textEl.textContent = expiryMsg;
        }
      } else if (expiryAction === "redirect") {
        if (expiryUrl) {
          if (!options?.isPreview && typeof window !== "undefined") {
            window.location.href = expiryUrl;
          } else if (expiryMsgEl) {
            if (timerInner) timerInner.style.display = "none";
            expiryMsgEl.style.display = "block";
            const textEl = expiryMsgEl.querySelector<HTMLElement>(".wto-cd-expiry-text");
            if (textEl) textEl.textContent = `[Preview] Timer Expired: Would redirect to ${expiryUrl}`;
          }
        }
      } else if (expiryAction === "restart") {
        hasExpired = false;
        if (mode === "personal" && targetTimestampAttr <= 0) {
          personalEndTime = Date.now() + personalDurationMs;
          if (persist && typeof window !== "undefined") {
            localStorage.setItem(personalKey, String(personalEndTime));
          }
        }
      }
    }

    function tick() {
      const now = Date.now();
      let diffMs = 0;

      if (targetTimestampAttr > 0) {
        diffMs = targetTimestampAttr - now;
      } else if (mode === "date") {
        let targetMs = 0;
        if (targetDateStr) {
          const [yr, mo, da] = targetDateStr.split("-").map(Number);
          const [hr, mi] = (targetTimeStr || "23:59").split(":").map(Number);
          const targetDateObj = new Date(yr, (mo || 1) - 1, da || 1, hr || 0, mi || 0, 0);
          targetMs = targetDateObj.getTime();
        }
        diffMs = targetMs - now;
      } else if (mode === "personal") {
        diffMs = personalEndTime - now;
      } else if (mode === "recurring") {
        const cycleMs = recurringHrs * 3600000;
        diffMs = cycleMs - (now % cycleMs);
      } else if (mode === "counter") {
        const elapsedSec = (now - counterStartTime) / 1000;
        const progress = Math.min(1, elapsedSec / counterDur);
        const currentCount =
          counterDir === "up"
            ? Math.round(counterStart + (counterEnd - counterStart) * progress)
            : Math.round(counterStart - (counterStart - counterEnd) * progress);

        const countStr = String(currentCount).padStart(2, "0");
        updateDigitWithAnimation(secsEl, countStr);
        if (progress >= 1 && !hasExpired) {
          handleExpiry();
        }
        return;
      }

      if (diffMs <= 0) {
        updateDigitWithAnimation(daysEl, "00");
        updateDigitWithAnimation(hoursEl, "00");
        updateDigitWithAnimation(minsEl, "00");
        updateDigitWithAnimation(secsEl, "00");
        handleExpiry();
        return;
      }

      // Intelligent Unit Distribution (overflow handling when higher units are disabled)
      let remSec = Math.floor(diffMs / 1000);
      let remMin = Math.floor(remSec / 60);
      let remHr = Math.floor(remMin / 60);
      const remDay = Math.floor(remHr / 24);

      let finalDays = 0;
      let finalHours = 0;
      let finalMinutes = 0;
      let finalSeconds = 0;

      if (showDays) {
        finalDays = remDay;
        remHr = remHr % 24;
      }
      if (showHours) {
        finalHours = remHr;
        remMin = remMin % 60;
      }
      if (showMinutes) {
        finalMinutes = remMin;
        remSec = remSec % 60;
      }
      finalSeconds = remSec;

      updateDigitWithAnimation(daysEl, String(finalDays).padStart(2, "0"));
      updateDigitWithAnimation(hoursEl, String(finalHours).padStart(2, "0"));
      updateDigitWithAnimation(minsEl, String(finalMinutes).padStart(2, "0"));
      updateDigitWithAnimation(secsEl, String(finalSeconds).padStart(2, "0"));
    }

    // Run first tick immediately
    tick();
    const timerInterval = setInterval(tick, 1000);
    cleanups.push(() => clearInterval(timerInterval));
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
