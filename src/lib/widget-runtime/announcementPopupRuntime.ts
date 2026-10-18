import type { WidgetInstanceRecord } from "@/services/widgetService";
import { type AnnouncementPopupConfig, normalizeAnnouncementPopupConfig } from "@/services/announcementPopupTemplates";
import type { RenderWidgetOptions } from "./wtoWidgetRuntime";

/**
 * Escapes HTML characters safely.
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
 * Validates a URL to prevent javascript: and data: pseudo-protocols.
 */
function sanitizeUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return "#";
  }
  return trimmed;
}

/**
 * Generates pure HTML & scoped CSS for an Announcement Bar or Popup Modal widget instance.
 */
export function renderAnnouncementPopupHtml(
  widget: WidgetInstanceRecord<AnnouncementPopupConfig>,
  options?: RenderWidgetOptions
): { html: string; css: string } {
  const cfg = normalizeAnnouncementPopupConfig(widget.config || {});
  const widgetId = widget.id || "wgt_announcement_preview";
  const cls = `wto-inst-${widgetId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const isPopup = cfg.displayMode === "popup";

  // Content
  const content = cfg.content || {
    headline: "Special Announcement",
    description: "",
    badgeText: "",
    showBadge: false,
    icon: "",
    showCloseButton: true,
  };

  const primaryBtn = cfg.buttons?.primary || {
    enabled: true,
    text: "Learn More",
    url: "#",
    openInNewTab: false,
    backgroundColor: "#facc15",
    textColor: "#000000",
  };

  const secondaryBtn = cfg.buttons?.secondary || {
    enabled: false,
    text: "Dismiss",
    url: "#",
    openInNewTab: false,
    backgroundColor: "transparent",
    textColor: "#94a3b8",
  };

  const img = cfg.image || {
    enabled: false,
    url: "",
    alt: "",
    position: "top",
  };

  const cd = cfg.countdown || {
    enabled: false,
    targetTimestamp: 0,
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    labelDays: "d",
    labelHours: "h",
    labelMinutes: "m",
    labelSeconds: "s",
    completionMessage: "Offer has ended",
  };

  const coupon = cfg.coupon || {
    enabled: false,
    code: "",
    buttonText: "Copy Code",
  };

  const rawBarPos = cfg.barPosition;
  const barPos =
    typeof rawBarPos === "object" && rawBarPos !== null
      ? rawBarPos
      : {
          position: typeof rawBarPos === "string" ? rawBarPos : "fixed_top",
          contained: false,
          maxWidth: 1200,
          sticky: true,
          zIndex: 99999,
          showReopenButton: false,
          reopenButtonText: "Open Bar",
        };

  const dispRules = cfg.displayRules || {
    trigger: "immediate",
    triggerDelaySeconds: 2,
    triggerScrollPercent: 40,
    frequency: "always",
    deviceVisibility: "all",
    scheduleEnabled: false,
    dismissPersistence: true,
  };

  const colors = cfg.colors || {
    background: isPopup ? "#18181b" : "#0f172a",
    textColor: "#f8fafc",
    headingColor: "#ffffff",
    badgeBackground: "#ef4444",
    badgeTextColor: "#ffffff",
    borderColor: "#334155",
    overlayColor: "rgba(0, 0, 0, 0.7)",
  };

  const typo = cfg.typography || {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    headingSize: isPopup ? 24 : 16,
    bodySize: isPopup ? 14 : 13,
    fontWeight: "600",
    lineHeight: "1.4",
    textAlign: isPopup ? "center" : "center",
  };

  const layout = cfg.layout || {
    paddingY: isPopup ? 28 : 12,
    paddingX: isPopup ? 28 : 20,
    borderRadius: isPopup ? 20 : 0,
    borderWidth: 1,
    shadow: "0 20px 40px rgba(0,0,0,0.4)",
    popupWidth: 520,
    popupMaxHeight: "90vh",
  };

  const anim = cfg.animation || {
    type: "fade",
    durationMs: 350,
  };

  // Safe CTA targets
  const primTarget = primaryBtn.openInNewTab ? '_blank" rel="noopener noreferrer' : "_self";
  const secTarget = secondaryBtn.openInNewTab ? '_blank" rel="noopener noreferrer' : "_self";

  // Data attributes for runtime execution
  const dataAttrs = `
    data-wto-widget="${escapeXml(widgetId)}"
    data-ap-mode="${isPopup ? "popup" : "bar"}"
    data-ap-trigger="${escapeXml(dispRules.trigger)}"
    data-ap-delay="${Number(dispRules.triggerDelaySeconds || 2)}"
    data-ap-scroll="${Number(dispRules.triggerScrollPercent || 40)}"
    data-ap-frequency="${escapeXml(dispRules.frequency)}"
    data-ap-page-targeting="${escapeXml(dispRules.pageTargeting || "all")}"
    data-ap-targeted-paths="${escapeXml((dispRules.targetedPaths || []).join(","))}"
    data-ap-home-return="${dispRules.reappearOnHomeReturn || dispRules.frequency === "home_return" ? "1" : "0"}"
    data-ap-dismiss-scope="${dispRules.dismissScope || "session"}"
    data-ap-schedule-enabled="${dispRules.scheduleEnabled ? "1" : "0"}"
    data-ap-start-time="${dispRules.scheduleStartTime || ""}"
    data-ap-end-time="${dispRules.scheduleEndTime || ""}"
    data-ap-countdown="${cd.enabled ? "1" : "0"}"
    data-ap-target-timestamp="${Number(cd.targetTimestamp || 0)}"
    data-ap-countdown-expired-msg="${escapeXml(cd.completionMessage || "Offer has ended")}"
    data-ap-dismiss-storage="${dispRules.dismissPersistence !== false ? "1" : "0"}"
    data-ap-bar-pos="${escapeXml(barPos.position)}"
    data-ap-sticky="${barPos.sticky !== false ? "1" : "0"}"
    data-ap-contained="${barPos.contained ? "1" : "0"}"
    data-ap-max-width="${Number(barPos.maxWidth || 1000)}"
    data-ap-reopen="${barPos.showReopenButton ? "1" : "0"}"
  `.trim();

  // Scoped CSS
  const animKeyframe = `
    @keyframes ${cls}-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes ${cls}-slide-down {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes ${cls}-slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes ${cls}-scale-up {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;

  let css = `
    ${animKeyframe}
    .${cls} {
      font-family: ${typo.fontFamily};
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: ${typo.lineHeight};
    }
    .${cls} * {
      box-sizing: border-box;
    }

    /* Animation Classes */
    .${cls}.wto-ap-anim-fade {
      animation: ${cls}-fade-in ${anim.durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .${cls}.wto-ap-anim-slide_down {
      animation: ${cls}-slide-down ${anim.durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .${cls}.wto-ap-anim-slide_up {
      animation: ${cls}-slide-up ${anim.durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .${cls}.wto-ap-anim-scale {
      animation: ${cls}-scale-up ${anim.durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .${cls}.wto-closed,
    .${cls}[data-wto-closed="1"] {
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    .${cls} .wto-bar-close-btn,
    .${cls} .wto-popup-close-btn {
      cursor: pointer !important;
      pointer-events: auto !important;
      z-index: 10 !important;
    }
    .${cls} .wto-bar-close-btn svg,
    .${cls} .wto-popup-close-btn svg {
      pointer-events: none !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .${cls}.wto-ap-anim-fade,
      .${cls}.wto-ap-anim-slide_down,
      .${cls}.wto-ap-anim-slide_up,
      .${cls}.wto-ap-anim-scale {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;

  // HTML Generation
  let html = "";

  if (!isPopup) {
    // =========================================================================
    // 1. ANNOUNCEMENT BAR
    // =========================================================================
    const isPreview = Boolean(options?.isPreview);
    const normPos =
      barPos.position === "top_fixed" ? "fixed_top" :
      barPos.position === "bottom_fixed" ? "fixed_bottom" :
      barPos.position === "top_flow" ? "flow_top" :
      barPos.position === "bottom_flow" ? "flow_bottom" :
      barPos.position || "fixed_top";

    const isFixedTop = normPos === "fixed_top";
    const isFixedBottom = normPos === "fixed_bottom";
    const isFlowTop = normPos === "flow_top";
    const isFlowBottom = normPos === "flow_bottom";
    const zIndex = Math.max(99999, Number(barPos.zIndex || 99999));

    let posStyle = "";
    if (isFixedTop) {
      posStyle = `display: block !important; position: ${barPos.sticky !== false ? "fixed" : "absolute"} !important; top: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; z-index: ${zIndex} !important; ${barPos.contained ? "pointer-events: none;" : ""}`;
    } else if (isFixedBottom) {
      posStyle = `display: block !important; position: ${barPos.sticky !== false ? "fixed" : "absolute"} !important; bottom: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; z-index: ${zIndex} !important; ${barPos.contained ? "pointer-events: none;" : ""}`;
    } else if (isFlowTop) {
      posStyle = `display: block !important; position: ${barPos.sticky !== false ? "sticky; top: 0;" : "relative;"} width: 100% !important; z-index: ${zIndex} !important; ${barPos.contained ? "pointer-events: none;" : ""}`;
    } else {
      // flow_bottom
      posStyle = `display: block !important; position: ${barPos.sticky ? "sticky; bottom: 0;" : "relative;"} width: 100% !important; z-index: ${zIndex} !important; ${barPos.contained ? "pointer-events: none;" : ""}`;
    }

    const maxWidth = Math.max(300, Number(barPos.maxWidth || 1000));
    const containerStyle = barPos.contained
      ? `max-width: ${maxWidth}px !important; width: calc(100% - 32px) !important; margin: ${
          isFixedBottom || isFlowBottom ? "0 auto 16px auto" : "16px auto 0 auto"
        } !important; border-radius: ${layout.borderRadius || 12}px !important; pointer-events: auto !important; box-shadow: ${layout.shadow || "0 10px 30px rgba(0,0,0,0.35)"} !important; border: ${layout.borderWidth || 1}px solid ${colors.borderColor || "rgba(255,255,255,0.15)"} !important;`
      : `width: 100% !important; max-width: 100% !important; margin: 0 !important; border-radius: 0 !important; pointer-events: auto !important; border-top: ${isFixedBottom ? `${layout.borderWidth || 1}px solid ${colors.borderColor || "rgba(255,255,255,0.15)"}` : "none"} !important; border-bottom: ${isFixedTop || isFlowTop ? `${layout.borderWidth || 1}px solid ${colors.borderColor || "rgba(255,255,255,0.15)"}` : "none"} !important;`;

    html = `
      <div class="${cls} wto-announcement-bar-root wto-ap-anim-${anim.type}" ${dataAttrs} style="${posStyle}">
        <div class="wto-bar-inner" style="
          background-color: ${colors.background};
          color: ${colors.textColor};
          padding: ${layout.paddingY}px ${layout.paddingX}px;
          min-height: 44px;
          display: flex !important;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          ${containerStyle}
        ">
          <div class="wto-bar-content-wrapper" style="
            display: flex;
            align-items: center;
            justify-content: ${typo.textAlign === "left" ? "flex-start" : typo.textAlign === "right" ? "flex-end" : "center"};
            flex-wrap: wrap;
            gap: 12px 20px;
            width: 100%;
            position: relative;
          ">
            
            <!-- Message & Info Group -->
            <div class="wto-bar-text-group" style="
              display: inline-flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 8px 12px;
              justify-content: ${typo.textAlign === "left" ? "flex-start" : typo.textAlign === "right" ? "flex-end" : "center"};
              text-align: ${typo.textAlign};
            ">
              ${content.showBadge && content.badgeText ? `
                <span class="wto-bar-badge" style="
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  background-color: ${colors.badgeBackground};
                  color: ${colors.badgeTextColor};
                  padding: 3px 8px;
                  border-radius: 9999px;
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.04em;
                  text-transform: uppercase;
                ">
                  ${content.icon ? `<span class="wto-bar-icon">${escapeXml(content.icon)}</span>` : ""}
                  ${escapeXml(content.badgeText)}
                </span>
              ` : content.icon ? `<span class="wto-bar-icon" style="font-size: 16px;">${escapeXml(content.icon)}</span>` : ""}

              ${content.headline ? `
                <span class="wto-bar-headline" style="
                  font-size: ${typo.headingSize}px;
                  font-weight: ${typo.fontWeight};
                  color: ${colors.headingColor};
                  ${(typo as any).headingItalic ? "font-style: italic;" : ""}
                  ${(typo as any).headingUnderline ? "text-decoration: underline;" : ""}
                ">
                  ${escapeXml(content.headline)}
                </span>
              ` : ""}

              ${content.description ? `
                <span class="wto-bar-desc" style="
                  font-size: ${typo.bodySize}px;
                  color: ${colors.textColor};
                  opacity: 0.9;
                  ${(typo as any).bodyBold ? "font-weight: 700;" : ""}
                  ${(typo as any).bodyItalic ? "font-style: italic;" : ""}
                  ${(typo as any).bodyUnderline ? "text-decoration: underline;" : ""}
                ">
                  ${escapeXml(content.description)}
                </span>
              ` : ""}
            </div>

            <!-- Optional Synchronized Countdown Ticker -->
            ${cd.enabled ? `
              <div class="wto-bar-countdown-group" style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(0, 0, 0, 0.25);
                padding: 4px 10px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                font-family: monospace;
                font-weight: 700;
                font-size: 13px;
                color: ${colors.headingColor};
              ">
                <span class="wto-cd-clock-icon" style="opacity: 0.7;">⏱️</span>
                <span class="wto-cd-unit wto-cd-days" ${!cd.showDays ? 'style="display:none;"' : ""}>
                  <span class="wto-cd-val">00</span><span style="font-size:10px;font-family:sans-serif;opacity:0.7;">${escapeXml(cd.labelDays)}</span> :
                </span>
                <span class="wto-cd-unit wto-cd-hours" ${!cd.showHours ? 'style="display:none;"' : ""}>
                  <span class="wto-cd-val">00</span><span style="font-size:10px;font-family:sans-serif;opacity:0.7;">${escapeXml(cd.labelHours)}</span> :
                </span>
                <span class="wto-cd-unit wto-cd-minutes" ${!cd.showMinutes ? 'style="display:none;"' : ""}>
                  <span class="wto-cd-val">00</span><span style="font-size:10px;font-family:sans-serif;opacity:0.7;">${escapeXml(cd.labelMinutes)}</span> :
                </span>
                <span class="wto-cd-unit wto-cd-seconds" ${!cd.showSeconds ? 'style="display:none;"' : ""}>
                  <span class="wto-cd-val">00</span><span style="font-size:10px;font-family:sans-serif;opacity:0.7;">${escapeXml(cd.labelSeconds)}</span>
                </span>
                <span class="wto-cd-expired-note" style="display:none; color:#f87171;">${escapeXml(cd.completionMessage)}</span>
              </div>
            ` : ""}

            <!-- Optional Coupon Code -->
            ${coupon.enabled && coupon.code ? `
              <div class="wto-bar-coupon-group" style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
              ">
                <span class="wto-coupon-pill" style="
                  padding: 4px 10px;
                  background: rgba(255, 255, 255, 0.1);
                  border: 1px dashed ${colors.borderColor};
                  border-radius: 6px;
                  font-family: monospace;
                  font-weight: 700;
                  font-size: 12px;
                  letter-spacing: 0.05em;
                  color: ${colors.headingColor};
                ">${escapeXml(coupon.code)}</span>
                <button type="button" class="wto-coupon-copy-btn" data-code="${escapeXml(coupon.code)}" style="
                  background: rgba(255,255,255,0.15);
                  border: none;
                  color: ${colors.textColor};
                  padding: 4px 10px;
                  border-radius: 6px;
                  font-size: 11px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: background 0.15s;
                ">${escapeXml(coupon.buttonText || "Copy")}</button>
              </div>
            ` : ""}

            <!-- Action Buttons Group -->
            ${(primaryBtn.enabled || secondaryBtn.enabled) ? `
              <div class="wto-bar-buttons-group" style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
              ">
                ${primaryBtn.enabled ? `
                  <a href="${escapeXml(sanitizeUrl(primaryBtn.url))}" target="${primTarget}" class="wto-btn-primary" style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: ${primaryBtn.backgroundColor};
                    color: ${primaryBtn.textColor};
                    font-size: 12px;
                    font-weight: 700;
                    padding: 6px 14px;
                    border-radius: 9999px;
                    text-decoration: none;
                    white-space: nowrap;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                    transition: opacity 0.15s, transform 0.15s;
                  ">${escapeXml(primaryBtn.text)}</a>
                ` : ""}

                ${secondaryBtn.enabled ? `
                  <a href="${escapeXml(sanitizeUrl(secondaryBtn.url))}" target="${secTarget}" class="wto-btn-secondary" style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: ${secondaryBtn.backgroundColor};
                    color: ${secondaryBtn.textColor};
                    font-size: 12px;
                    font-weight: 600;
                    padding: 6px 12px;
                    border-radius: 9999px;
                    text-decoration: none;
                    white-space: nowrap;
                    opacity: 0.85;
                    transition: opacity 0.15s;
                  ">${escapeXml(secondaryBtn.text)}</a>
                ` : ""}
              </div>
            ` : ""}

            <!-- Close Button -->
            ${content.showCloseButton ? `
              <button type="button" class="wto-bar-close-btn" aria-label="Close notification bar" style="
                background: transparent;
                border: none;
                color: ${colors.textColor};
                opacity: 0.75;
                font-size: 16px;
                line-height: 1;
                cursor: pointer !important;
                pointer-events: auto !important;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: opacity 0.15s, background 0.15s;
                margin-left: auto;
                z-index: 10;
              ">
                <svg style="pointer-events: none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            ` : ""}

          </div>
        </div>

        <!-- Optional Reopen Pill (Shown when bar is closed) -->
        ${barPos.showReopenButton ? `
          <button type="button" class="wto-bar-reopen-btn" style="
            display: none;
            position: fixed !important;
            ${isFixedBottom || isFlowBottom ? "bottom: 16px !important;" : "top: 16px !important;"}
            right: 16px !important;
            background: ${colors.background};
            color: ${colors.textColor};
            border: 1px solid ${colors.borderColor || "rgba(255,255,255,0.2)"};
            padding: 7px 16px;
            border-radius: 9999px;
            font-size: 11.5px;
            font-weight: 700;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
            cursor: pointer;
            z-index: 100001 !important;
            pointer-events: auto !important;
            align-items: center;
            gap: 6px;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          ">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>${escapeXml(barPos.reopenButtonText || "Open Bar")}</span>
          </button>
        ` : ""}
      </div>
    `;

  } else {
    // =========================================================================
    // 2. POPUP MODAL
    // =========================================================================
    const imgPos = img.position || "top";
    const hasImg = img.enabled && img.url;

    // Image HTML snippet
    let imgHtml = "";
    if (hasImg) {
      if (imgPos === "top") {
        imgHtml = `
          <div class="wto-popup-img-top" style="width: 100%; max-height: 220px; overflow: hidden; border-top-left-radius: ${layout.borderRadius}px; border-top-right-radius: ${layout.borderRadius}px;">
            <img src="${escapeXml(img.url)}" alt="${escapeXml(img.alt || content.headline)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        `;
      } else if (imgPos === "left" || imgPos === "right") {
        imgHtml = `
          <div class="wto-popup-img-side" style="width: 40%; min-width: 160px; max-height: 100%; overflow: hidden; flex-shrink: 0;">
            <img src="${escapeXml(img.url)}" alt="${escapeXml(img.alt || content.headline)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        `;
      }
    }

    html = `
      <div class="${cls} wto-popup-backdrop wto-ap-anim-${anim.type}" ${dataAttrs} role="dialog" aria-modal="true" aria-labelledby="${cls}-title" aria-describedby="${cls}-desc" style="
        position: ${options?.isStudioMockup ? "absolute" : "fixed"} !important;
        inset: 0 !important;
        top: 0 !important;
        left: 0 !important;
        width: ${options?.isStudioMockup ? "100%" : "100vw"} !important;
        height: ${options?.isStudioMockup ? "100%" : "100vh"} !important;
        background-color: ${colors.overlayColor} !important;
        backdrop-filter: blur(4px) !important;
        -webkit-backdrop-filter: blur(4px) !important;
        display: flex;
        align-items: center !important;
        justify-content: center !important;
        padding: 16px !important;
        z-index: 99999999 !important;
        box-sizing: border-box !important;
        overflow-y: auto !important;
      ">
        <div class="wto-popup-dialog" style="
          background-color: ${colors.background};
          color: ${colors.textColor};
          border: ${layout.borderWidth}px solid ${colors.borderColor};
          border-radius: ${layout.borderRadius}px;
          box-shadow: ${layout.shadow};
          width: 100%;
          max-width: ${layout.popupWidth}px;
          max-height: ${layout.popupMaxHeight};
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: ${hasImg && (imgPos === "left" || imgPos === "right") ? (imgPos === "right" ? "row-reverse" : "row") : "column"};
        ">
          <!-- Close Button Top Right -->
          ${content.showCloseButton ? `
              <button type="button" class="wto-popup-close-btn" aria-label="Close dialog" style="
                position: absolute;
                top: 14px;
                right: 14px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.35);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer !important;
                pointer-events: auto !important;
                z-index: 10;
                transition: transform 0.15s, background 0.15s;
              ">
                <svg style="pointer-events: none;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
          ` : ""}

          <!-- Top or Side Image -->
          ${hasImg && (imgPos === "top" || imgPos === "left" || imgPos === "right") ? imgHtml : ""}

          <!-- Popup Body Content -->
          <div class="wto-popup-body" style="
            padding: ${layout.paddingY}px ${layout.paddingX}px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            text-align: ${typo.textAlign};
            flex: 1;
          ">
            
            <!-- Badge / Icon -->
            ${content.showBadge && content.badgeText ? `
              <div style="display: flex; justify-content: ${typo.textAlign === "left" ? "flex-start" : typo.textAlign === "right" ? "flex-end" : "center"};">
                <span class="wto-popup-badge" style="
                  display: inline-flex;
                  align-items: center;
                  gap: 5px;
                  background-color: ${colors.badgeBackground};
                  color: ${colors.badgeTextColor};
                  padding: 4px 10px;
                  border-radius: 9999px;
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.05em;
                  text-transform: uppercase;
                ">
                  ${content.icon ? `<span>${escapeXml(content.icon)}</span>` : ""}
                  ${escapeXml(content.badgeText)}
                </span>
              </div>
            ` : content.icon ? `
              <div style="font-size: 32px; line-height: 1;">${escapeXml(content.icon)}</div>
            ` : ""}

            <!-- Headline -->
            ${content.headline ? `
              <h2 id="${cls}-title" class="wto-popup-headline" style="
                font-size: ${typo.headingSize}px;
                font-weight: ${typo.fontWeight};
                color: ${colors.headingColor};
                margin: 0;
                line-height: 1.25;
                ${(typo as any).headingItalic ? "font-style: italic;" : ""}
                ${(typo as any).headingUnderline ? "text-decoration: underline;" : ""}
              ">${escapeXml(content.headline)}</h2>
            ` : ""}

            <!-- Description -->
            ${content.description ? `
              <div id="${cls}-desc" class="wto-popup-desc" style="
                font-size: ${typo.bodySize}px;
                color: ${colors.textColor};
                opacity: 0.9;
                line-height: 1.5;
                margin: 0;
                ${(typo as any).bodyBold ? "font-weight: 700;" : ""}
                ${(typo as any).bodyItalic ? "font-style: italic;" : ""}
                ${(typo as any).bodyUnderline ? "text-decoration: underline;" : ""}
              ">${escapeXml(content.description)}</div>
            ` : ""}

            <!-- Optional Synchronized Countdown Ticker -->
            ${cd.enabled ? `
              <div class="wto-popup-countdown" style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background: rgba(0, 0, 0, 0.25);
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
              ">
                <div class="wto-cd-unit wto-cd-days" ${!cd.showDays ? 'style="display:none;"' : ""} style="text-align: center;">
                  <div class="wto-cd-val" style="font-size: 22px; font-weight: 800; font-family: monospace; color: ${colors.headingColor};">00</div>
                  <div style="font-size: 10px; text-transform: uppercase; opacity: 0.7;">${escapeXml(cd.labelDays)}</div>
                </div>
                <div class="wto-cd-unit wto-cd-hours" ${!cd.showHours ? 'style="display:none;"' : ""} style="text-align: center;">
                  <div class="wto-cd-val" style="font-size: 22px; font-weight: 800; font-family: monospace; color: ${colors.headingColor};">00</div>
                  <div style="font-size: 10px; text-transform: uppercase; opacity: 0.7;">${escapeXml(cd.labelHours)}</div>
                </div>
                <div class="wto-cd-unit wto-cd-minutes" ${!cd.showMinutes ? 'style="display:none;"' : ""} style="text-align: center;">
                  <div class="wto-cd-val" style="font-size: 22px; font-weight: 800; font-family: monospace; color: ${colors.headingColor};">00</div>
                  <div style="font-size: 10px; text-transform: uppercase; opacity: 0.7;">${escapeXml(cd.labelMinutes)}</div>
                </div>
                <div class="wto-cd-unit wto-cd-seconds" ${!cd.showSeconds ? 'style="display:none;"' : ""} style="text-align: center;">
                  <div class="wto-cd-val" style="font-size: 22px; font-weight: 800; font-family: monospace; color: ${colors.headingColor};">00</div>
                  <div style="font-size: 10px; text-transform: uppercase; opacity: 0.7;">${escapeXml(cd.labelSeconds)}</div>
                </div>
                <div class="wto-cd-expired-note" style="display:none; color:#f87171; font-weight:700;">${escapeXml(cd.completionMessage)}</div>
              </div>
            ` : ""}

            <!-- Coupon Box -->
            ${coupon.enabled && coupon.code ? `
              <div class="wto-popup-coupon" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                background: rgba(255, 255, 255, 0.06);
                border: 2px dashed ${colors.borderColor};
                border-radius: 10px;
                gap: 12px;
              ">
                <div style="font-family: monospace; font-size: 16px; font-weight: 800; letter-spacing: 0.08em; color: ${colors.headingColor};">
                  ${escapeXml(coupon.code)}
                </div>
                <button type="button" class="wto-coupon-copy-btn" data-code="${escapeXml(coupon.code)}" style="
                  background: ${primaryBtn.backgroundColor};
                  color: ${primaryBtn.textColor};
                  border: none;
                  font-weight: 700;
                  font-size: 12px;
                  padding: 6px 14px;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: opacity 0.15s;
                ">${escapeXml(coupon.buttonText || "Copy Code")}</button>
              </div>
            ` : ""}

            <!-- Buttons Group -->
            ${(primaryBtn.enabled || secondaryBtn.enabled) ? `
              <div class="wto-popup-buttons" style="
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 4px;
              ">
                ${primaryBtn.enabled ? `
                  <a href="${escapeXml(sanitizeUrl(primaryBtn.url))}" target="${primTarget}" class="wto-btn-primary" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 12px 20px;
                    background-color: ${primaryBtn.backgroundColor};
                    color: ${primaryBtn.textColor};
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 10px;
                    text-decoration: none;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
                    transition: transform 0.15s, opacity 0.15s;
                  ">${escapeXml(primaryBtn.text)}</a>
                ` : ""}

                ${secondaryBtn.enabled ? `
                  <a href="${escapeXml(sanitizeUrl(secondaryBtn.url))}" target="${secTarget}" class="wto-btn-secondary" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 8px 16px;
                    background-color: ${secondaryBtn.backgroundColor};
                    color: ${secondaryBtn.textColor};
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 8px;
                    text-decoration: none;
                    opacity: 0.8;
                    transition: opacity 0.15s;
                  ">${escapeXml(secondaryBtn.text)}</a>
                ` : ""}
              </div>
            ` : ""}

          </div>
        </div>
      </div>
    `;
  }

  return { html, css };
}

/**
 * Attaches runtime triggers, timer updates, clipboard copy, frequency storage,
 * and dismissal events to rendered announcement bar or popup containers.
 */
export function attachAnnouncementPopupInteractivity(
  container: HTMLElement,
  options?: { isPreview?: boolean; isStudioMockup?: boolean }
): () => void {
  const isPreview = Boolean(options?.isPreview);
  // Only the visual Studio Editor phone/laptop mockup frame is a studio mockup
  const isStudioMockup = Boolean(
    options?.isStudioMockup ||
    (container && (container.hasAttribute("data-wto-mock-canvas") || container.querySelector("[data-wto-mock-canvas]"))) ||
    (typeof window !== "undefined" && window.location.pathname.includes("/widgets/announcement-popup/"))
  );

  // In studio canvas mockup, purge direct stale roots
  if (isStudioMockup) {
    const directStale = container.querySelectorAll<HTMLElement>(
      ":scope > .wto-announcement-bar-root, :scope > .wto-popup-backdrop, :scope > .wto-announcement-popup-root"
    );
    directStale.forEach((el) => el.remove());
  }

  const elements = Array.from(container.querySelectorAll<HTMLElement>(
    ".wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]"
  ));

  // If in studio mockup mode, ensure only the single active widget is present:
  if (isStudioMockup && elements.length > 1) {
    while (elements.length > 1) {
      const oldEl = elements.shift();
      oldEl?.remove();
    }
  }

  const cleanupTasks: Array<() => void> = [];

  elements.forEach((root) => {
    const widgetId = root.getAttribute("data-wto-widget") || "wgt_announcement";
    const mode = root.getAttribute("data-ap-mode") || "bar";
    const trigger = root.getAttribute("data-ap-trigger") || "immediate";
    const delaySec = Number(root.getAttribute("data-ap-delay") || 2);
    const scrollPct = Number(root.getAttribute("data-ap-scroll") || 40);
    const freq = root.getAttribute("data-ap-frequency") || "always";
    const scheduleEnabled = root.getAttribute("data-ap-schedule-enabled") === "1";
    const startTimeStr = root.getAttribute("data-ap-start-time") || "";
    const endTimeStr = root.getAttribute("data-ap-end-time") || "";
    const isCountdown = root.getAttribute("data-ap-countdown") === "1";
    const targetTimestamp = Number(root.getAttribute("data-ap-target-timestamp") || 0);

    const pageTargeting = root.getAttribute("data-ap-page-targeting") || "all";
    const targetedPathsStr = root.getAttribute("data-ap-targeted-paths") || "";
    const homeReturnEnabled = root.getAttribute("data-ap-home-return") === "1" || freq === "home_return";
    const dismissScope = root.getAttribute("data-ap-dismiss-scope") || "session";
    const dismissStorage = root.getAttribute("data-ap-dismiss-storage") === "1";

    const rawPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "/";
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const pageParam = urlParams ? (urlParams.get("page") || "").toLowerCase().replace(/^[./]+/, "").replace(/\.html$/i, "") : "";
    const isDemo = rawPath.includes("/demo/") || rawPath.includes("/preview");
    const isDemoHome = isDemo && (pageParam === "home" || pageParam === "index" || !pageParam);
    const isHome = rawPath === "/" || rawPath === "" || rawPath.endsWith("/index.html") || rawPath === "/index.php" || isDemoHome;
    const path = isDemo ? (pageParam ? `/${pageParam}` : "/") : rawPath;

    // In studio mockup, clean up any previous seen flags so refreshes never hide the widget
    if (isStudioMockup && widgetId) {
      try {
        sessionStorage.removeItem(`wto_ap_seen_${widgetId}`);
        localStorage.removeItem(`wto_ap_seen_${widgetId}`);
        sessionStorage.removeItem(`wto_ap_dismissed_${widgetId}`);
        localStorage.removeItem(`wto_ap_dismissed_${widgetId}`);
      } catch (_) {}
    }

    // 0. Page Targeting Check (live storefront & demo)
    if (!isStudioMockup) {
      if (pageTargeting === "homepage_only" && !isHome) {
        root.style.display = "none";
        return;
      }
      if ((pageTargeting === "custom" || pageTargeting === "include") && targetedPathsStr) {
        const paths = targetedPathsStr.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
        const matches = paths.some((p) => {
          if (p.endsWith("*")) return path.startsWith(p.slice(0, -1));
          return path === p || path.startsWith(p);
        });
        if (!matches) {
          root.style.display = "none";
          return;
        }
      }
    }

    // 1. Scheduling checks (Only enforced in live production mode, NEVER in studio mockup)
    if (!isStudioMockup && scheduleEnabled) {
      const now = Date.now();
      if (startTimeStr) {
        const startMs = new Date(startTimeStr).getTime();
        if (!isNaN(startMs) && now < startMs) {
          root.style.display = "none";
          return;
        }
      }
      if (endTimeStr) {
        const endMs = new Date(endTimeStr).getTime();
        if (!isNaN(endMs) && now > endMs) {
          root.style.display = "none";
          return;
        }
      }
    }

    // 2. Dismissal Persistence Check
    if (!isStudioMockup && dismissStorage && widgetId) {
      const dismissKey = `wto_ap_dismissed_${widgetId}`;
      const isDismissed = dismissScope === "permanent"
        ? localStorage.getItem(dismissKey)
        : sessionStorage.getItem(dismissKey);

      // If homeReturnEnabled is on and visitor is on the Home page, show on home return!
      if (isDismissed && !(homeReturnEnabled && isHome)) {
        root.style.display = "none";
        return;
      }
    }

    // 3. Frequency & Persistence checks (Only for popups)
    if (!isStudioMockup && mode === "popup" && freq !== "always") {
      try {
        const storageKey = `wto_ap_seen_${widgetId}`;

        // Return to Home Page behavior:
        if (homeReturnEnabled && isHome) {
          // Allowed on home page returns!
        } else if (freq === "session") {
          if (sessionStorage.getItem(storageKey)) {
            root.style.display = "none";
            return;
          }
        } else if (freq === "once") {
          if (localStorage.getItem(storageKey)) {
            root.style.display = "none";
            return;
          }
        } else {
          // Time-based frequency: 1day, 7days, 30days
          const lastSeen = Number(localStorage.getItem(storageKey) || 0);
          const now = Date.now();
          const cooldownMap: Record<string, number> = {
            "1day": 24 * 3600 * 1000,
            "daily": 24 * 3600 * 1000,
            "7days": 7 * 24 * 3600 * 1000,
            "weekly": 7 * 24 * 3600 * 1000,
            "30days": 30 * 24 * 3600 * 1000,
            "monthly": 30 * 24 * 3600 * 1000,
          };
          const cooldown = cooldownMap[freq] || 0;
          if (lastSeen > 0 && now - lastSeen < cooldown) {
            root.style.display = "none";
            return;
          }
        }
      } catch (err) {
        // Safe fallback
      }
    }

    // Record seen only for popups and never in studio mockup
    const recordSeen = () => {
      if (isStudioMockup || mode !== "popup") return;
      try {
        const storageKey = `wto_ap_seen_${widgetId}`;
        const now = String(Date.now());
        if (freq === "session") sessionStorage.setItem(storageKey, now);
        else localStorage.setItem(storageKey, now);
      } catch (e) {}
    };

    // 4. Triggers & Initial Visibility
    if (root.classList.contains("wto-closed") || root.getAttribute("data-wto-closed") === "1") {
      return;
    }

    if (isStudioMockup) {
      // In studio mockup device canvas, keep immediately visible for visual styling
      if (mode === "bar") {
        root.style.display = "block";
      } else {
        root.style.display = "flex";
      }
    } else {
      if (mode === "bar") {
        root.style.display = "block";
      } else {
        // Live production / Demo popup modal triggering
        if (trigger === "delay") {
          root.style.display = "none";
          const delayMs = Math.max(0, delaySec * 1000);
          const tid = setTimeout(() => {
            root.style.display = "flex";
            recordSeen();
          }, delayMs);
          cleanupTasks.push(() => clearTimeout(tid));
        } else if (trigger === "scroll") {
          root.style.display = "none";
          let triggered = false;
          const handleScroll = () => {
            if (triggered) return;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const current = (window.scrollY / docHeight) * 100;
            if (current >= scrollPct) {
              triggered = true;
              root.style.display = "flex";
              recordSeen();
              window.removeEventListener("scroll", handleScroll);
            }
          };
          window.addEventListener("scroll", handleScroll, { passive: true });
          cleanupTasks.push(() => window.removeEventListener("scroll", handleScroll));
        } else if (trigger === "exit_intent") {
          root.style.display = "none";
          let triggered = false;
          const handleMouseLeave = (e: MouseEvent) => {
            if (triggered) return;
            if (e.clientY <= 10 && window.innerWidth >= 768) {
              triggered = true;
              root.style.display = "flex";
              recordSeen();
              document.removeEventListener("mouseleave", handleMouseLeave);
            }
          };
          document.addEventListener("mouseleave", handleMouseLeave);
          cleanupTasks.push(() => document.removeEventListener("mouseleave", handleMouseLeave));
        } else {
          // Immediate
          root.style.display = "flex";
          recordSeen();
        }
      }
    }

    // Hoist elements to document.body on live storefronts & demo pages
    // For POPUP MODALS: ALWAYS hoist to document.body so that ancestor headers/navbars with backdrop-filter, transform, or overflow: hidden CANNOT trap or clip the modal!
    const studioPreview = root.closest<HTMLElement>("[data-wto-mock-canvas], .relative.flex-1.flex.flex-col");
    if (!studioPreview && !isStudioMockup && mode === "popup") {
      const hoistTarget = root.ownerDocument?.body || document.body;
      if (hoistTarget && root.parentElement !== hoistTarget) {
        const existingOld = hoistTarget.querySelector<HTMLElement>(`.wto-popup-backdrop[data-wto-widget="${widgetId}"]`);
        if (existingOld && existingOld !== root) {
          existingOld.remove();
        }
        hoistTarget.appendChild(root);
        cleanupTasks.push(() => {
          if (root.parentElement === hoistTarget) root.remove();
        });
      }
    }

    // For ANNOUNCEMENT BARS: Hoist to top/bottom of body
    if (!studioPreview && !isStudioMockup && mode === "bar") {
      const barPosVal = root.getAttribute("data-ap-bar-pos") || "fixed_top";
      const isTop = barPosVal === "fixed_top" || barPosVal === "flow_top" || barPosVal === "top_fixed" || barPosVal === "top_flow";
      const isBottom = barPosVal === "fixed_bottom" || barPosVal === "flow_bottom" || barPosVal === "bottom_fixed" || barPosVal === "bottom_flow";

      const hoistTarget = root.ownerDocument?.body || document.body;
      if (hoistTarget) {
        const existingOld = hoistTarget.querySelector<HTMLElement>(`[data-wto-widget="${widgetId}"]`);
        if (existingOld && existingOld !== root) {
          existingOld.remove();
        }

        if (isTop && root.parentElement !== hoistTarget) {
          hoistTarget.prepend(root);
          cleanupTasks.push(() => {
            if (root.parentElement === hoistTarget) root.remove();
          });
        } else if (isBottom && root.parentElement !== hoistTarget) {
          hoistTarget.appendChild(root);
          cleanupTasks.push(() => {
            if (root.parentElement === hoistTarget) root.remove();
          });
        }
      }
    }

    // 4. Close & Reopen Button Handlers
    const reopenBtn = root.querySelector<HTMLElement>(".wto-bar-reopen-btn");

    const closeWidget = (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      root.classList.add("wto-closed");
      root.setAttribute("data-wto-closed", "1");

      if (reopenBtn) {
        const barInner = root.querySelector<HTMLElement>(".wto-bar-inner");
        if (barInner) barInner.style.setProperty("display", "none", "important");
        root.style.setProperty("height", "0px", "important");
        root.style.setProperty("min-height", "0px", "important");
        root.style.setProperty("padding", "0px", "important");
        root.style.setProperty("margin", "0px", "important");
        root.style.setProperty("pointer-events", "none", "important");
        root.style.setProperty("background", "transparent", "important");
        root.style.setProperty("box-shadow", "none", "important");
        root.style.setProperty("border", "none", "important");
        reopenBtn.style.setProperty("display", "inline-flex", "important");
        reopenBtn.style.setProperty("pointer-events", "auto", "important");
      } else {
        root.style.setProperty("display", "none", "important");
        root.style.setProperty("height", "0px", "important");
        root.style.setProperty("min-height", "0px", "important");
        root.style.setProperty("padding", "0px", "important");
        root.style.setProperty("margin", "0px", "important");
        root.style.setProperty("visibility", "hidden", "important");
        root.style.setProperty("pointer-events", "none", "important");
        const barInner = root.querySelector<HTMLElement>(".wto-bar-inner");
        if (barInner) barInner.style.setProperty("display", "none", "important");

        // Also collapse parent widget root container if present so zero leftover height remains
        const widgetRoot = root.closest<HTMLElement>("[data-wto-widget-root], [data-widget-id]");
        if (widgetRoot && widgetRoot !== root) {
          widgetRoot.style.setProperty("display", "none", "important");
          widgetRoot.style.setProperty("height", "0px", "important");
          widgetRoot.classList.add("wto-closed");
        }
      }

      updateBarOffset();
      recordSeen();

      if (dismissStorage && widgetId && !isPreview) {
        const dismissKey = `wto_ap_dismissed_${widgetId}`;
        try {
          if (dismissScope === "permanent") localStorage.setItem(dismissKey, "1");
          else sessionStorage.setItem(dismissKey, "1");
        } catch (_) {}
      }
    };

    const reopenWidget = (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      root.classList.remove("wto-closed");
      root.removeAttribute("data-wto-closed");

      const barInner = root.querySelector<HTMLElement>(".wto-bar-inner");
      if (barInner) barInner.style.removeProperty("display");
      root.style.removeProperty("display");
      root.style.removeProperty("height");
      root.style.removeProperty("min-height");
      root.style.removeProperty("padding");
      root.style.removeProperty("margin");
      root.style.removeProperty("pointer-events");
      root.style.removeProperty("background");
      root.style.removeProperty("box-shadow");
      root.style.removeProperty("border");
      root.style.removeProperty("visibility");

      if (reopenBtn) {
        reopenBtn.style.setProperty("display", "none", "important");
      }

      const widgetRoot = root.closest<HTMLElement>("[data-wto-widget-root], [data-widget-id]");
      if (widgetRoot && widgetRoot !== root) {
        widgetRoot.style.removeProperty("display");
        widgetRoot.style.removeProperty("height");
        widgetRoot.classList.remove("wto-closed");
      }

      setTimeout(updateBarOffset, 30);
    };

    // Attach click to all close buttons
    const closeBtns = root.querySelectorAll<HTMLElement>(".wto-bar-close-btn, .wto-popup-close-btn, [data-ap-close], .wto-close-btn");
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", closeWidget);
      cleanupTasks.push(() => btn.removeEventListener("click", closeWidget));
    });

    // Delegated click handler on root as fail-safe (capture phase)
    const handleRootClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLElement>(".wto-bar-close-btn, .wto-popup-close-btn, [data-ap-close], .wto-close-btn");
      if (btn && root.contains(btn)) {
        closeWidget(e);
      }
    };
    root.addEventListener("click", handleRootClick, true);
    cleanupTasks.push(() => root.removeEventListener("click", handleRootClick, true));

    if (reopenBtn) {
      reopenBtn.addEventListener("click", reopenWidget);
      cleanupTasks.push(() => reopenBtn.removeEventListener("click", reopenWidget));
    }

    if (mode === "popup") {
      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === root) {
          closeWidget(e);
        }
      };
      root.addEventListener("click", handleBackdropClick);
      cleanupTasks.push(() => root.removeEventListener("click", handleBackdropClick));

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && root.style.display !== "none" && !root.classList.contains("wto-closed")) {
          closeWidget(e);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      cleanupTasks.push(() => window.removeEventListener("keydown", handleKeyDown));
    }

    const updateBarOffset = () => {
      if (mode === "bar") {
        const barPosVal = root.getAttribute("data-ap-bar-pos") || "fixed_top";
        const isFixedTop = barPosVal === "fixed_top" || barPosVal === "top_fixed";
        const barInner = root.querySelector<HTMLElement>(".wto-bar-inner");
        const isClosed = root.classList.contains("wto-closed") || root.getAttribute("data-wto-closed") === "1" || root.style.display === "none";
        const isVisible = !isClosed && (!barInner || (barInner.style.display !== "none" && !barInner.classList.contains("wto-closed")));
        if (isFixedTop && isVisible) {
          const h = (barInner ? barInner.offsetHeight : root.offsetHeight) || 44;
          const isContainedVal = root.getAttribute("data-ap-contained") === "1";
          const offset = isContainedVal ? h + 16 : h;
          document.documentElement.style.setProperty("--wto-header-top", `${offset}px`);
        } else {
          document.documentElement.style.setProperty("--wto-header-top", "0px");
        }
      }
    };
    if (mode === "bar") {
      setTimeout(updateBarOffset, 60);
      window.addEventListener("resize", updateBarOffset);
      cleanupTasks.push(() => {
        window.removeEventListener("resize", updateBarOffset);
        document.documentElement.style.setProperty("--wto-header-top", "0px");
      });
    }

    // Backdrop click and Escape key closing for Popup
    if (mode === "popup") {
      const handleBackdrop = (e: MouseEvent) => {
        if (e.target === root) {
          root.style.display = "none";
          recordSeen();
        }
      };
      root.addEventListener("click", handleBackdrop);
      cleanupTasks.push(() => root.removeEventListener("click", handleBackdrop));

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && root.style.display !== "none") {
          root.style.display = "none";
          recordSeen();
        }
      };
      window.addEventListener("keydown", handleKeydown);
      cleanupTasks.push(() => window.removeEventListener("keydown", handleKeydown));
    }

    // 5. Coupon Code Copy button
    root.querySelectorAll<HTMLElement>(".wto-coupon-copy-btn").forEach((btn) => {
      const code = btn.getAttribute("data-code") || "";
      const origText = btn.textContent || "Copy";
      const handleCopy = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        if (code) {
          navigator.clipboard?.writeText(code).then(() => {
            btn.textContent = "Copied!";
            setTimeout(() => {
              btn.textContent = origText;
            }, 2000);
          }).catch(() => {
            btn.textContent = "Copied!";
          });
        }
      };
      btn.addEventListener("click", handleCopy);
      cleanupTasks.push(() => btn.removeEventListener("click", handleCopy));
    });

    // 6. Synchronized Countdown Ticker
    if (isCountdown && targetTimestamp > 0) {
      const daysVal = root.querySelector<HTMLElement>(".wto-cd-days .wto-cd-val");
      const hoursVal = root.querySelector<HTMLElement>(".wto-cd-hours .wto-cd-val");
      const minsVal = root.querySelector<HTMLElement>(".wto-cd-minutes .wto-cd-val");
      const secsVal = root.querySelector<HTMLElement>(".wto-cd-seconds .wto-cd-val");
      const expiredNote = root.querySelector<HTMLElement>(".wto-cd-expired-note");
      const clockIcon = root.querySelector<HTMLElement>(".wto-cd-clock-icon");

      const updateTicker = () => {
        const now = Date.now();
        const diff = targetTimestamp - now;

        if (diff <= 0) {
          if (daysVal) daysVal.textContent = "00";
          if (hoursVal) hoursVal.textContent = "00";
          if (minsVal) minsVal.textContent = "00";
          if (secsVal) secsVal.textContent = "00";
          if (expiredNote) expiredNote.style.display = "inline-block";
          if (clockIcon) clockIcon.style.display = "none";
          return;
        }

        const totalSecs = Math.floor(diff / 1000);
        const d = Math.floor(totalSecs / (3600 * 24));
        const h = Math.floor((totalSecs % (3600 * 24)) / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;

        if (daysVal) daysVal.textContent = String(d).padStart(2, "0");
        if (hoursVal) hoursVal.textContent = String(h).padStart(2, "0");
        if (minsVal) minsVal.textContent = String(m).padStart(2, "0");
        if (secsVal) secsVal.textContent = String(s).padStart(2, "0");
        if (expiredNote) expiredNote.style.display = "none";
        if (clockIcon) clockIcon.style.display = "inline-block";
      };

      updateTicker();
      const cdTimer = setInterval(updateTicker, 1000);
      cleanupTasks.push(() => clearInterval(cdTimer));
    }
  });

  return () => {
    cleanupTasks.forEach((fn) => fn());
  };
}
