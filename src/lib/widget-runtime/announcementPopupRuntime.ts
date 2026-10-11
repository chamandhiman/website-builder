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
    data-ap-schedule-enabled="${dispRules.scheduleEnabled ? "1" : "0"}"
    data-ap-start-time="${dispRules.scheduleStartTime || ""}"
    data-ap-end-time="${dispRules.scheduleEndTime || ""}"
    data-ap-countdown="${cd.enabled ? "1" : "0"}"
    data-ap-target-timestamp="${Number(cd.targetTimestamp || 0)}"
    data-ap-countdown-expired-msg="${escapeXml(cd.completionMessage || "Offer has ended")}"
    data-ap-dismiss-storage="${dispRules.dismissPersistence !== false ? "1" : "0"}"
    data-ap-bar-pos="${escapeXml(barPos.position)}"
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
    const isFixedTop = barPos.position === "fixed_top";
    const isFixedBottom = barPos.position === "fixed_bottom";
    const isFlowTop = barPos.position === "flow_top";
    const isFlowBottom = barPos.position === "flow_bottom";

    let posStyle = "";
    if (isFixedTop) {
      posStyle = `position: ${barPos.sticky ? "sticky" : "fixed"}; top: 0; left: 0; right: 0; width: 100%; z-index: ${barPos.zIndex};`;
    } else if (isFixedBottom) {
      posStyle = `position: ${barPos.sticky ? "sticky" : "fixed"}; bottom: 0; left: 0; right: 0; width: 100%; z-index: ${barPos.zIndex};`;
    } else {
      // Flow
      posStyle = `position: relative; width: 100%; z-index: ${barPos.zIndex};`;
    }

    const containerStyle = barPos.contained
      ? `max-width: ${barPos.maxWidth}px; margin: 0 auto; border-radius: ${layout.borderRadius}px;`
      : `width: 100%;`;

    html = `
      <div class="${cls} wto-announcement-bar-root wto-ap-anim-${anim.type}" ${dataAttrs} style="${posStyle}">
        <div class="wto-bar-inner" style="
          background-color: ${colors.background};
          color: ${colors.textColor};
          padding: ${layout.paddingY}px ${layout.paddingX}px;
          border-top: ${isFixedBottom ? `${layout.borderWidth}px solid ${colors.borderColor}` : "none"};
          border-bottom: ${isFixedTop || isFlowTop ? `${layout.borderWidth}px solid ${colors.borderColor}` : "none"};
          border: ${barPos.contained ? `${layout.borderWidth}px solid ${colors.borderColor}` : undefined};
          box-shadow: ${layout.shadow};
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
                opacity: 0.65;
                font-size: 16px;
                line-height: 1;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: opacity 0.15s, background 0.15s;
                margin-left: auto;
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
            position: fixed;
            ${isFixedBottom ? "bottom: 16px;" : "top: 16px;"}
            right: 16px;
            background: ${colors.background};
            color: ${colors.textColor};
            border: 1px solid ${colors.borderColor};
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: ${layout.shadow};
            cursor: pointer;
            z-index: ${barPos.zIndex};
          ">
            ${escapeXml(barPos.reopenButtonText || "Open Bar")}
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
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background-color: ${colors.overlayColor};
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        z-index: 999999;
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
              cursor: pointer;
              z-index: 10;
              transition: transform 0.15s, background 0.15s;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
  options?: { isPreview?: boolean }
): () => void {
  const isPreview = Boolean(options?.isPreview);
  const elements = container.querySelectorAll<HTMLElement>(
    ".wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]"
  );

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

    // 1. Scheduling checks (Only enforced in live mode)
    if (!isPreview && scheduleEnabled) {
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

    // 2. Frequency & Persistence checks (Only in live mode)
    if (!isPreview && freq !== "always") {
      try {
        const storageKey = `wto_ap_seen_${widgetId}`;
        if (freq === "session") {
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
            "7days": 7 * 24 * 3600 * 1000,
            "30days": 30 * 24 * 3600 * 1000,
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

    // Record seen if live
    const recordSeen = () => {
      if (isPreview) return;
      try {
        const storageKey = `wto_ap_seen_${widgetId}`;
        const now = String(Date.now());
        if (freq === "session") sessionStorage.setItem(storageKey, now);
        else localStorage.setItem(storageKey, now);
      } catch (e) {}
    };

    // 3. Triggers & Initial Visibility
    if (!isPreview && mode === "popup") {
      if (trigger === "delay") {
        root.style.display = "none";
        const tid = setTimeout(() => {
          root.style.display = "flex";
          recordSeen();
        }, delaySec * 1000);
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

    // 4. Close & Reopen Button Handlers
    const closeBtn = root.querySelector<HTMLElement>(".wto-bar-close-btn, .wto-popup-close-btn");
    const reopenBtn = root.querySelector<HTMLElement>(".wto-bar-reopen-btn");

    if (closeBtn) {
      const handleClose = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        root.style.display = "none";
        if (reopenBtn) reopenBtn.style.display = "block";
        recordSeen();
      };
      closeBtn.addEventListener("click", handleClose);
      cleanupTasks.push(() => closeBtn.removeEventListener("click", handleClose));
    }

    if (reopenBtn) {
      const handleReopen = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        root.style.display = "block";
        reopenBtn.style.display = "none";
      };
      reopenBtn.addEventListener("click", handleReopen);
      cleanupTasks.push(() => reopenBtn.removeEventListener("click", handleReopen));
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
