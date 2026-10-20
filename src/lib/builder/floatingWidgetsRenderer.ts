import type { FloatingWidgetRecord, FloatingPosition } from "./floatingWidgetsTypes";

/**
 * Calculates stacked positioning offsets for floating widgets sharing the same corner.
 */
export function calculateStackedOffsets(widgets: FloatingWidgetRecord[]): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>();
  const cornerGroups = new Map<FloatingPosition, FloatingWidgetRecord[]>();

  widgets.filter((w) => w.enabled).forEach((w) => {
    const list = cornerGroups.get(w.position) || [];
    list.push(w);
    cornerGroups.set(w.position, list);
  });

  cornerGroups.forEach((groupList, pos) => {
    let currentYOffset = 0;
    groupList.forEach((widget, index) => {
      const baseX = widget.offsetX || 20;
      const baseY = widget.offsetY || 20;
      const stackedY = baseY + (index > 0 ? currentYOffset : 0);
      result.set(widget.id, { x: baseX, y: stackedY });
      // Approximate widget height spacing based on widget type
      const heightContribution = widget.type === "language_switcher" ? 44 : 64;
      currentYOffset += heightContribution + 12;
    });
  });

  return result;
}

export function getAnnouncementIconSvg(icon: string, color: string = "#FFFFFF"): string {
  switch (icon) {
    case "megaphone":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`;
    case "bell":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
    case "star":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    case "gift":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`;
    case "percent":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`;
    case "info":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    case "check":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    case "sparkles":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`;
    case "bullhorn":
    case "speaker":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
    case "tag":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>`;
    case "clock":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    case "leaf":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
    case "shield":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }
}

export function getWhatsAppButtonIconSvg(style: string = "whatsapp_standard", color: string = "#FFFFFF"): string {
  switch (style) {
    case "bubble_dots":
    case "chat_bubble":
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block; flex-shrink: 0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><circle cx="8" cy="12" r="1" fill="${color}"/><circle cx="12" cy="12" r="1" fill="${color}"/><circle cx="16" cy="12" r="1" fill="${color}"/></svg>`;
    case "oval_dots":
    case "message_dots":
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="${color}" style="display:block; flex-shrink: 0;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>`;
    case "phone":
      return `<svg viewBox="0 0 24 24" width="20" height="20" fill="${color}" style="display:block; flex-shrink: 0;"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 3.93c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.55c0-.55-.45-1-1-1z"/></svg>`;
    case "whatsapp_solid":
    case "whatsapp_badge":
      return `<svg viewBox="0 0 24 24" width="22" height="22" fill="${color}" style="display:block; flex-shrink: 0;"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-1.09 1.04-1.5 1.07-.38.03-.86.05-2.77-.73-2.43-1-3.99-3.48-4.11-3.64-.12-.17-.98-1.31-.98-2.5 0-1.19.62-1.77.85-2.02.21-.24.47-.3.63-.3.16 0 .32 0 .46.01.15.01.35-.06.55.42.2.49.68 1.66.74 1.79.06.13.1.29.02.45-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.5.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-1.1.76-1.48.16-.38.32-.32.54-.24.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.13 1.11z"/></svg>`;
    case "whatsapp_standard":
    default:
      return `<svg viewBox="0 0 32 32" width="22" height="22" fill="${color}" style="display:block; flex-shrink: 0;"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/></svg>`;
  }
}

export function getAccessibilityHumanIconSvg(color: string = "#FFFFFF", size: number = 22): string {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" style="display:block; flex-shrink: 0;"><path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>`;
}

/**
 * Renders complete HTML markup and styles for all active floating widgets.
 */
export function renderFloatingWidgetsOverlay(
  widgets: FloatingWidgetRecord[] = [],
  options?: { editorMode?: boolean; currentPageId?: string }
): { html: string; css: string; js: string } {
  const activeWidgets = widgets.filter((w) => {
    if (!w.enabled) return false;
    // Page targeting filter
    if (options?.currentPageId && w.pageTargeting === "custom" && w.targetedPages?.length) {
      if (!w.targetedPages.includes(options.currentPageId)) return false;
    }
    return true;
  });

  if (activeWidgets.length === 0) {
    return { html: "", css: "", js: "" };
  }

  const stackedOffsets = calculateStackedOffsets(activeWidgets);
  const editorMode = Boolean(options?.editorMode);

  let htmlParts: string[] = [];

  activeWidgets.forEach((widget) => {
    const coords = stackedOffsets.get(widget.id) || { x: widget.offsetX || 20, y: widget.offsetY || 20 };
    const pos = widget.position;

    let posStyle = "";
    if (pos === "bottom_right") posStyle = `bottom: ${coords.y}px; right: ${coords.x}px;`;
    else if (pos === "bottom_left") posStyle = `bottom: ${coords.y}px; left: ${coords.x}px;`;
    else if (pos === "bottom_center") posStyle = `bottom: ${coords.y}px; left: 50%; transform: translateX(-50%);`;
    else if (pos === "top_right") posStyle = `top: ${coords.y}px; right: ${coords.x}px;`;
    else if (pos === "top_left") posStyle = `top: ${coords.y}px; left: ${coords.x}px;`;
    else if (pos === "top_center") posStyle = `top: ${coords.y}px; left: 50%; transform: translateX(-50%);`;
    else if (pos === "top_fixed") posStyle = `top: 0; left: 0; width: 100%;`;
    else if (pos === "bottom_fixed") posStyle = `bottom: 0; left: 0; width: 100%;`;
    else if (pos === "middle_right") posStyle = `top: 50%; right: ${coords.x}px; transform: translateY(-50%);`;
    else if (pos === "middle_left") posStyle = `top: 50%; left: ${coords.x}px; transform: translateY(-50%);`;

    const desktopDisplay = widget.showOnDesktop ? "flex" : "none";
    const mobileDisplay = widget.showOnMobile ? "flex" : "none";

    const editAttrs = editorMode
      ? `data-wto-floating-widget="1" data-wto-floating-id="${widget.id}" data-wto-floating-type="${widget.type}" title="${widget.name} (Click to configure)"`
      : "";

    const editorControls = editorMode
      ? `
        <div class="wto-floating-editor-badge" style="position: absolute; top: -24px; ${pos.includes("left") ? "left: 0" : pos.includes("center") ? "left: 50%; transform: translateX(-50%)" : "right: 0"}; display: flex; align-items: center; gap: 5px; background: #18181B; border: 1px solid #FACC15; padding: 2px 6px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); z-index: 100000; pointer-events: auto;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #FACC15;"></span>
          <span style="font-family: system-ui, sans-serif; font-size: 10px; font-weight: 700; color: #FACC15; white-space: nowrap;">${widget.name || widget.type}</span>
          <button type="button" data-wto-floating-act="edit" data-wto-floating-id="${widget.id}" style="all: unset; cursor: pointer; padding: 1px 4px; border-radius: 3px; background: rgba(255,255,255,0.12); color: #ffffff; font-size: 9px; font-weight: 600;">Edit</button>
          <button type="button" data-wto-floating-act="delete" data-wto-floating-id="${widget.id}" style="all: unset; cursor: pointer; padding: 1px 4px; border-radius: 3px; background: rgba(239,68,68,0.25); color: #fca5a5; font-size: 9px; font-weight: 600;">Delete</button>
        </div>
      `
      : "";

    switch (widget.type) {
      case "whatsapp_chat": {
        const phone = String(widget.config.phoneNumber || "").replace(/[^\d+]/g, "");
        const rawMsg = widget.config.prefilledMessage || "";
        const waUrl = phone ? `https://wa.me/${phone.replace(/^\+/, "")}?text=${encodeURIComponent(rawMsg)}` : "javascript:void(0)";
        const btnColor = widget.config.buttonColor || "#25D366";
        const isWhite = btnColor.toLowerCase() === "#ffffff";
        const iconTextColor = isWhite ? "#111111" : "#ffffff";
        const agentName = widget.config.agentName || "Customer Support";
        const greeting = widget.config.tooltipText || widget.config.greetingText || "";
        const showTooltip = widget.config.showTooltip !== false && Boolean(greeting);
        const btnLabel = widget.config.buttonLabel || "Chat with us";
        const labelPos = widget.config.labelPosition || "hover";
        const buttonStyle = widget.config.buttonStyle || "whatsapp_standard";
        const customIcon = widget.config.customIconUrl || "";

        // In live published site, do not render if phone number is not configured
        if (!phone && !editorMode) {
          break;
        }

        const iconHtml = customIcon
          ? `<img src="${customIcon}" alt="WhatsApp" style="width: 24px; height: 24px; object-fit: contain; border-radius: 4px; display: block;" />`
          : getWhatsAppButtonIconSvg(buttonStyle, iconTextColor);

        const isLeft = pos.includes("left");

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-whatsapp" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99999; pointer-events: auto;">
            ${editorControls}
            <div class="wto-wa-container" style="display: flex; flex-direction: ${pos.startsWith("middle") ? (isLeft ? "row" : "row-reverse") : "column"}; align-items: ${isLeft ? "flex-start" : "flex-end"}; gap: 10px;">
              ${
                showTooltip || (!phone && editorMode)
                  ? `<div class="wto-wa-bubble" style="background: #ffffff; color: #1f2937; padding: 10px 14px; border-radius: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 500; box-shadow: 0 6px 22px rgba(0,0,0,0.22); max-width: 240px; border-bottom-${isLeft ? "left" : "right"}-radius: 4px; display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 10px; color: #059669; font-weight: 700; text-transform: uppercase;">${agentName}</span>
                      <span>${greeting || (editorMode ? "Configure WhatsApp Number" : "")}</span>
                    </div>`
                  : ""
              }
              <a href="${editorMode ? "javascript:void(0)" : waUrl}" target="_blank" rel="noopener noreferrer" class="wto-wa-btn" style="position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: ${labelPos === "always" ? "12px 20px" : "14px"}; border-radius: 999px; background: ${btnColor}; color: ${iconTextColor}; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; box-shadow: 0 8px 24px ${btnColor === "#25D366" ? "rgba(37,211,102,0.4)" : "rgba(0,0,0,0.3)"}; border: ${isWhite ? "1px solid #e4e4e7" : "none"}; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                ${iconHtml}
                ${labelPos === "always" ? `<span style="white-space: nowrap;">${btnLabel}</span>` : ""}
                <span style="position: absolute; top: -3px; right: -3px; width: 18px; height: 18px; background: #EF4444; color: #FFFFFF; font-size: 10px; font-weight: bold; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">1</span>
              </a>
            </div>
          </div>
        `);
        break;
      }

      case "accessibility": {
        const style = widget.config.toolbarStyle || "circle";
        const accent = widget.config.toolbarColor || widget.config.accentColor || "#2563EB";
        const isWhite = accent.toLowerCase() === "#ffffff";
        const fg = isWhite ? "#111111" : "#FFFFFF";
        const showByDefault = Boolean(widget.config.showByDefault || widget.config.initialOpen);
        const isLeft = pos.includes("left");
        const isMiddle = pos.startsWith("middle");

        let triggerBtnHtml = "";
        if (style === "circle") {
          triggerBtnHtml = `
            <button type="button" class="wto-a11y-trigger-btn" onclick="window.wtoToggleA11yPanel && window.wtoToggleA11yPanel()" style="width: 52px; height: 52px; border-radius: 50%; background: ${accent}; color: ${fg}; border: ${isWhite ? "1px solid #d4d4d8" : "2px solid rgba(255,255,255,0.25)"}; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: transform 0.2s ease;" aria-label="Accessibility Menu" title="Accessibility Tools (Alt+A)">
              ${getAccessibilityHumanIconSvg(fg, 24)}
            </button>
          `;
        } else if (style === "square") {
          triggerBtnHtml = `
            <button type="button" class="wto-a11y-trigger-btn" onclick="window.wtoToggleA11yPanel && window.wtoToggleA11yPanel()" style="width: 48px; height: 48px; border-radius: 12px; background: ${accent}; color: ${fg}; border: ${isWhite ? "1px solid #d4d4d8" : "2px solid rgba(255,255,255,0.25)"}; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: transform 0.2s ease;" aria-label="Accessibility Menu" title="Accessibility Tools (Alt+A)">
              ${getAccessibilityHumanIconSvg(fg, 24)}
            </button>
          `;
        } else if (style === "text_button") {
          triggerBtnHtml = `
            <button type="button" class="wto-a11y-trigger-btn" onclick="window.wtoToggleA11yPanel && window.wtoToggleA11yPanel()" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: ${accent}; color: ${fg}; border: ${isWhite ? "1px solid #d4d4d8" : "2px solid rgba(255,255,255,0.25)"}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: transform 0.2s ease;" aria-label="Accessibility Menu" title="Accessibility Tools (Alt+A)">
              ${getAccessibilityHumanIconSvg(fg, 20)}
              <span>Accessibility</span>
            </button>
          `;
        } else {
          // minimal
          triggerBtnHtml = `
            <button type="button" class="wto-a11y-trigger-btn" onclick="window.wtoToggleA11yPanel && window.wtoToggleA11yPanel()" style="width: 46px; height: 46px; border-radius: 12px; background: rgba(24,24,27,0.9); color: ${fg}; border: 1.5px solid ${accent}; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.35); backdrop-filter: blur(8px); transition: transform 0.2s ease;" aria-label="Accessibility Menu" title="Accessibility Tools (Alt+A)">
              ${getAccessibilityHumanIconSvg(fg, 22)}
            </button>
          `;
        }

        const flyoutPosStyle = isMiddle
          ? (isLeft ? "left: 64px; top: 50%; transform: translateY(-50%);" : "right: 64px; top: 50%; transform: translateY(-50%);")
          : (isLeft ? "left: 0; bottom: 64px;" : "right: 0; bottom: 64px;");

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-a11y" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99998; pointer-events: auto;">
            ${editorControls}
            <div style="position: relative; display: flex; flex-direction: column; align-items: ${isLeft ? "flex-start" : "flex-end"};">
              ${triggerBtnHtml}

              <!-- Accessibility Tools Flyout Panel -->
              <div id="wto-a11y-flyout" class="wto-a11y-panel" style="position: absolute; ${flyoutPosStyle} width: 230px; background: #ffffff; color: #18181b; border-radius: 16px; padding: 12px; box-shadow: 0 20px 48px rgba(0,0,0,0.35); border: 1px solid #e4e4e7; z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: ${showByDefault ? "block" : "none"};">
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid #f4f4f5;">
                  <span style="font-size: 13px; font-weight: 700; color: #09090b;">Accessibility Tools</span>
                  <button type="button" onclick="window.wtoToggleA11yPanel && window.wtoToggleA11yPanel(false)" style="all: unset; cursor: pointer; color: #71717a; font-size: 13px; padding: 2px 6px; border-radius: 4px;" aria-label="Close" onmouseover="this.style.color='#09090b'" onmouseout="this.style.color='#71717a'">✕</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                  <button type="button" data-wto-a11y-cmd="text-inc" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #f8fafc; color: #1e293b; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-weight: 800; font-size: 13px;">A+</span>
                    <span>Increase Text Size</span>
                  </button>
                  <button type="button" data-wto-a11y-cmd="text-dec" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #f8fafc; color: #1e293b; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-weight: 800; font-size: 13px;">A-</span>
                    <span>Decrease Text Size</span>
                  </button>
                  <button type="button" data-wto-a11y-cmd="contrast" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #f8fafc; color: #1e293b; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-weight: 800; font-size: 13px;">◐</span>
                    <span>High Contrast</span>
                  </button>
                  <button type="button" data-wto-a11y-cmd="font" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #f8fafc; color: #1e293b; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-weight: 800; font-size: 13px;">TT</span>
                    <span>Readable Font</span>
                  </button>
                  <button type="button" data-wto-a11y-cmd="keyboard" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #f8fafc; color: #1e293b; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-size: 13px;">⌨</span>
                    <span>Keyboard Navigation</span>
                  </button>
                  <button type="button" data-wto-a11y-cmd="animations" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #f8fafc; color: #1e293b; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                    <span style="font-size: 13px;">⏸</span>
                    <span>Stop Animations</span>
                  </button>
                  <button type="button" data-wto-a11y-cmd="reset" class="wto-a11y-tool-btn" style="all: unset; cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: #fef2f2; color: #dc2626; font-size: 12px; font-weight: 600; transition: background 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">
                    <span style="font-size: 13px;">↺</span>
                    <span>Reset Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `);
        break;
      }

      case "language_switcher": {
        const langs = Array.isArray(widget.config.languages) ? widget.config.languages : [{ code: "en", name: "English", flag: "🌐" }];
        const currentLang = langs[0] || { code: "en", name: "English", flag: "🌐" };

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-lang" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99997; pointer-events: auto;">
            ${editorControls}
            <div class="wto-lang-pill" style="display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: rgba(20,20,24,0.92); border: 1.5px solid rgba(255,255,255,0.15); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; backdrop-filter: blur(10px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
              <span style="font-size: 16px;">${currentLang.flag || "🌐"}</span>
              <span>${currentLang.name || "English"}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        `);
        break;
      }

      case "back_to_top": {
        const bg = widget.config.backgroundColor || "#1F1F23";
        const color = widget.config.textColor || "#FACC15";
        const shape = widget.config.shape === "rounded_square" ? "12px" : "50%";
        const size = widget.config.size || 46;

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-backtotop" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99996; pointer-events: auto;">
            ${editorControls}
            <button type="button" class="wto-btt-btn" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" style="width: ${size}px; height: ${size}px; border-radius: ${shape}; background: ${bg}; color: ${color}; border: 1.5px solid rgba(250,204,21,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.35); transition: transform 0.2s ease, opacity 0.2s ease;" title="Back to top">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
          </div>
        `);
        break;
      }

      case "floating_contact": {
        const btnColor = widget.config.buttonColor || "#FACC15";
        const textColor = widget.config.textColor || "#111111";
        const label = widget.config.label || "Call Us";
        const actionType = widget.config.actionType || "phone";
        const rawVal = String(widget.config.phoneNumber || widget.config.actionValue || "").trim();
        const cleanPhone = rawVal.replace(/[^\d+]/g, "");

        // In live published site, do not render if no contact target is configured
        if (!rawVal && !editorMode) {
          break;
        }

        let href = "javascript:void(0)";
        if (actionType === "phone" && cleanPhone) {
          href = `tel:${cleanPhone}`;
        } else if (actionType === "whatsapp" && cleanPhone) {
          const prefilled = widget.config.prefilledMessage || "";
          href = `https://wa.me/${cleanPhone.replace(/^\+/, "")}${prefilled ? `?text=${encodeURIComponent(prefilled)}` : ""}`;
        } else if (actionType === "email" && rawVal) {
          href = `mailto:${rawVal}`;
        }

        const iconSvg = actionType === "whatsapp"
          ? `<svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" style="flex-shrink:0;"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/></svg>`
          : actionType === "email"
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

        const displayLabel = rawVal ? label : (editorMode ? `${label} (Set Phone)` : label);

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-contact" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99995; pointer-events: auto;">
            ${editorControls}
            <a href="${editorMode ? "javascript:void(0)" : href}" class="wto-contact-btn" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: ${btnColor}; color: ${textColor}; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 700; box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: transform 0.2s ease;">
              ${iconSvg}
              <span>${displayLabel}</span>
            </a>
          </div>
        `);
        break;
      }

      case "announcement_popup": {
        const text = widget.config.text || widget.config.message || "";
        const headline = widget.config.headline || "";
        if (!text && !headline && !editorMode) break;

        const template = widget.config.template || "classic";
        const link = widget.config.linkUrl || widget.config.ctaUrl || "";
        const ctaLabel = widget.config.buttonText || widget.config.ctaLabel || widget.config.buttonLabel || "";
        const linkText = widget.config.linkText || "";
        const bg = widget.config.backgroundColor || "#4A1525";
        const color = widget.config.textColor || "#FFFFFF";
        const iconName = widget.config.icon || "none";
        const iconColor = widget.config.iconColor || color || "#FFFFFF";
        const iconSvg = iconName !== "none" ? getAnnouncementIconSvg(iconName, iconColor) : "";
        const btnBg = widget.config.btnBgColor || widget.config.buttonBgColor || "#FACC15";
        const btnColor = widget.config.btnTextColor || widget.config.buttonTextColor || "#111111";
        const showClose = widget.config.showCloseButton !== false;
        const allowDismiss = widget.config.allowDismiss !== false;
        const anim = widget.config.animation || "slide_down";
        const animClass = anim === "slide_down" ? "wto-anim-slide-down" : anim === "fade_in" ? "wto-anim-fade-in" : "";
        const openNewTab = widget.config.linkNewTab !== false;
        const countdownTarget = widget.config.countdownTarget || (widget.config.countdownDate ? new Date(widget.config.countdownDate).getTime() : undefined);

        const bannerPosStyle = widget.position === "bottom_fixed"
          ? "position: fixed; bottom: 0; left: 0; right: 0; width: 100%; z-index: 99999; pointer-events: auto;"
          : "position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 99999; pointer-events: auto;";

        const dismissOnClick = allowDismiss
          ? `wtoDismissAnnouncement(this, '${widget.id}', 7)`
          : `this.closest('.wto-floating-announcement-banner').style.display='none'`;

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-announcement-banner ${animClass}" ${editAttrs} style="${bannerPosStyle}" data-wto-floating-announcement="1">
            ${editorControls}
            <div style="background: ${bg}; color: ${color}; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 500; box-shadow: 0 4px 16px rgba(0,0,0,0.25); min-height: 42px;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; text-align: center; flex-wrap: wrap;">
                ${iconSvg ? `<span style="display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${iconSvg}</span>` : ""}

                ${template === "multiline" ? `
                  <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1px;">
                    ${headline ? `<span style="font-size: 13px; font-weight: 700; line-height: 1.25;">${headline}</span>` : ""}
                    <span style="font-size: 12px; font-weight: 400; opacity: 0.95; line-height: 1.3;">${text || (editorMode ? "Configure announcement text" : "")}</span>
                  </div>
                ` : `
                  <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center;">
                    ${headline ? `<strong style="font-weight: 700;">${headline}:</strong>` : ""}
                    <span style="font-size: 13px; font-weight: 500; line-height: 1.4;">${text || (editorMode ? "Configure announcement text" : "")}</span>
                  </div>
                `}

                ${template === "countdown" ? `
                  <div class="wto-cd-container" data-wto-countdown-target="${countdownTarget || ""}" style="display: inline-flex; align-items: center; gap: 4px; font-family: monospace; font-size: 11px; font-weight: 700; margin-left: 6px;">
                    <span style="background: rgba(0,0,0,0.55); color: #fff; padding: 2px 6px; border-radius: 4px;"><span class="wto-cd-days">00</span>d</span>
                    <span style="background: rgba(0,0,0,0.55); color: #fff; padding: 2px 6px; border-radius: 4px;"><span class="wto-cd-hours">00</span>h</span>
                    <span style="background: rgba(0,0,0,0.55); color: #fff; padding: 2px 6px; border-radius: 4px;"><span class="wto-cd-mins">00</span>m</span>
                    <span style="background: rgba(0,0,0,0.55); color: #fff; padding: 2px 6px; border-radius: 4px;"><span class="wto-cd-secs">00</span>s</span>
                  </div>
                ` : ""}

                ${template === "announcement_link" && linkText ? `
                  <a href="${editorMode ? "javascript:void(0)" : (link || "#")}" target="${openNewTab ? "_blank" : "_self"}" style="color: inherit; text-decoration: underline; font-weight: 700; margin-left: 6px; font-size: 12px;">${linkText}</a>
                ` : ""}

                ${ctaLabel ? `
                  <a href="${editorMode ? "javascript:void(0)" : (link || "#")}" target="${openNewTab ? "_blank" : "_self"}" style="display: inline-flex; align-items: center; background: ${btnBg}; color: ${btnColor}; padding: 5px 14px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 12px; white-space: nowrap; transition: opacity 0.2s; margin-left: 6px;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${ctaLabel}</a>
                ` : ""}
              </div>

              ${showClose ? `
                <button type="button" onclick="${dismissOnClick}" style="all: unset; cursor: pointer; opacity: 0.75; font-size: 14px; padding: 2px 8px; line-height: 1; border-radius: 4px; flex-shrink: 0;" aria-label="Dismiss">✕</button>
              ` : ""}
            </div>
          </div>
        `);
        break;
      }

      case "chatbot": {
        const botName = widget.config.botName || "AI Assistant";
        const welcome = widget.config.welcomeMessage || "Hi there! How can I help you today?";
        const primaryColor = widget.config.primaryColor || "#2563EB";

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-chatbot" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99995; pointer-events: auto;">
            ${editorControls}
            <div style="display: flex; flex-direction: column; align-items: ${pos.includes("left") ? "flex-start" : "flex-end"}; gap: 8px;">
              <div class="wto-chatbot-bubble" style="background: #1E1E22; color: #F5F5F5; padding: 10px 14px; border-radius: 14px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 500; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 6px 20px rgba(0,0,0,0.3); max-width: 240px;">
                <span style="font-size: 10px; color: #60A5FA; font-weight: 700; display: block; margin-bottom: 2px;">${botName}</span>
                <span>${welcome}</span>
              </div>
              <button type="button" class="wto-chatbot-btn" style="width: 52px; height: 52px; border-radius: 50%; background: ${primaryColor}; color: #ffffff; border: 2px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(37,99,235,0.35);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              </button>
            </div>
          </div>
        `);
        break;
      }

      case "custom_embed": {
        const snippet = widget.snippetHtml || "";
        htmlParts.push(`
          <div class="wto-floating-item wto-floating-custom-embed" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99994; pointer-events: auto;">
            ${editorControls}
            <div class="wto-floating-custom-inner" style="position: relative; max-width: 380px;">
              ${snippet}
            </div>
          </div>
        `);
        break;
      }

      default:
        break;
    }
  });

  const overlayHtml = `
    <!-- WebToolOcean Floating Widgets Overlay Layer -->
    <div class="wto-floating-widgets-layer" data-wto-floating-layer="1" style="position: fixed; inset: 0; pointer-events: none; z-index: 99999; overflow: visible;">
      ${htmlParts.join("\n")}
    </div>
  `;

  const css = `
    .wto-floating-widgets-layer { pointer-events: none !important; }
    .wto-floating-item { pointer-events: auto !important; transition: transform 0.18s ease; }
    .wto-floating-item:hover { transform: translateY(-2px); }
    .wto-floating-announcement-banner, .wto-floating-announcement-banner:hover { transform: none !important; }
    @keyframes wtoSlideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes wtoFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .wto-anim-slide-down { animation: wtoSlideDown 0.35s ease-out !important; }
    .wto-anim-fade-in { animation: wtoFadeIn 0.35s ease-out !important; }
    body[data-builder-edit-mode="1"] .wto-floating-item:hover {
      outline: 2px dashed #FACC15 !important;
      outline-offset: 4px;
      cursor: pointer;
    }
    body[data-builder-edit-mode="1"] .wto-floating-item.wto-selected-floating {
      outline: 2px solid #FACC15 !important;
      outline-offset: 4px;
      box-shadow: 0 0 16px rgba(250, 204, 21, 0.45) !important;
    }
    /* Accessibility Widget Styles */
    body.wto-high-contrast {
      background-color: #000000 !important;
      color: #FFFF00 !important;
    }
    body.wto-high-contrast *:not(.wto-a11y-panel):not(.wto-a11y-panel *) {
      background-color: #000000 !important;
      color: #FFFF00 !important;
      border-color: #FFFF00 !important;
    }
    body.wto-high-contrast a:not(.wto-a11y-panel *) {
      color: #00FFFF !important;
      text-decoration: underline !important;
    }
    body.wto-readable-font *:not(.wto-a11y-panel *) {
      font-family: Arial, Helvetica, sans-serif !important;
      letter-spacing: 0.04em !important;
      line-height: 1.65 !important;
    }
    body.wto-a11y-focus-visible a:focus,
    body.wto-a11y-focus-visible button:focus,
    body.wto-a11y-focus-visible input:focus,
    body.wto-a11y-focus-visible textarea:focus,
    body.wto-a11y-focus-visible select:focus,
    body.wto-a11y-focus-visible [tabindex]:focus {
      outline: 3px solid #FACC15 !important;
      outline-offset: 3px !important;
    }
    body.wto-reduced-motion *,
    body.wto-reduced-motion *::before,
    body.wto-reduced-motion *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
    @media (max-width: 768px) {
      .wto-floating-item:not(.wto-floating-announcement-banner) { max-width: 90vw !important; }
      .wto-a11y-panel { width: 220px !important; }
    }
  `;

  const js = `
    (function() {
      if (typeof window === 'undefined') return;

      // Accessibility Runtime
      var currentA11yScale = 100;
      function applyA11yScale(s) {
        currentA11yScale = Math.max(85, Math.min(150, s));
        document.documentElement.style.fontSize = currentA11yScale + '%';
      }

      window.wtoToggleA11yPanel = function(force) {
        var panel = document.getElementById('wto-a11y-flyout');
        if (!panel) return;
        var isShown = panel.style.display !== 'none';
        var next = force !== undefined ? force : !isShown;
        panel.style.display = next ? 'block' : 'none';
      };

      document.addEventListener('click', function(e) {
        var a11yBtn = e.target && e.target.closest ? e.target.closest('[data-wto-a11y-cmd]') : null;
        if (a11yBtn) {
          e.preventDefault();
          e.stopPropagation();
          var cmd = a11yBtn.getAttribute('data-wto-a11y-cmd');

          if (cmd === 'text-inc') {
            applyA11yScale(currentA11yScale + 15);
          } else if (cmd === 'text-dec') {
            applyA11yScale(currentA11yScale - 15);
          } else if (cmd === 'contrast') {
            document.body.classList.toggle('wto-high-contrast');
          } else if (cmd === 'font') {
            document.body.classList.toggle('wto-readable-font');
          } else if (cmd === 'keyboard') {
            document.body.classList.toggle('wto-a11y-focus-visible');
          } else if (cmd === 'animations') {
            document.body.classList.toggle('wto-reduced-motion');
          } else if (cmd === 'reset') {
            currentA11yScale = 100;
            document.documentElement.style.fontSize = '';
            document.body.classList.remove('wto-high-contrast', 'wto-readable-font', 'wto-a11y-focus-visible', 'wto-reduced-motion');
            try { localStorage.removeItem('wto_a11y_prefs'); } catch(_) {}
            return;
          }

          try {
            var prefs = {
              scale: currentA11yScale,
              contrast: document.body.classList.contains('wto-high-contrast'),
              font: document.body.classList.contains('wto-readable-font'),
              keyboard: document.body.classList.contains('wto-a11y-focus-visible'),
              reducedMotion: document.body.classList.contains('wto-reduced-motion')
            };
            localStorage.setItem('wto_a11y_prefs', JSON.stringify(prefs));
          } catch(_) {}
          return;
        }

        // Close a11y panel if clicked outside
        var flyout = document.getElementById('wto-a11y-flyout');
        if (flyout && flyout.style.display !== 'none') {
          if (!e.target.closest('.wto-floating-a11y')) {
            flyout.style.display = 'none';
          }
        }
      }, true);

      // Restore saved preferences
      try {
        var rawA11y = localStorage.getItem('wto_a11y_prefs');
        if (rawA11y) {
          var p = JSON.parse(rawA11y);
          if (p.scale && p.scale !== 100) applyA11yScale(p.scale);
          if (p.contrast) document.body.classList.add('wto-high-contrast');
          if (p.font) document.body.classList.add('wto-readable-font');
          if (p.keyboard) document.body.classList.add('wto-a11y-focus-visible');
          if (p.reducedMotion) document.body.classList.add('wto-reduced-motion');
        }
      } catch(_) {}

      // Alt + A keyboard shortcut to toggle panel
      document.addEventListener('keydown', function(e) {
        if (e.altKey && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          window.wtoToggleA11yPanel();
        }
      });

      // Announcement Bar Runtime
      window.wtoDismissAnnouncement = function(btn, fwId, days) {
        var banner = btn ? (btn.closest('.wto-floating-announcement-banner') || btn.closest('.wto-floating-popup')) : null;
        if (banner) banner.style.display = 'none';
        if (fwId && days) {
          try {
            var exp = Date.now() + (days * 86400000);
            localStorage.setItem('wto_dismiss_' + fwId, exp.toString());
          } catch(_) {}
        }
      };

      // Check dismissed announcements on load
      try {
        var annItems = document.querySelectorAll('.wto-floating-announcement-banner');
        for (var ai = 0; ai < annItems.length; ai++) {
          var item = annItems[ai];
          var aid = item.getAttribute('data-wto-floating-id');
          if (aid) {
            var savedExp = localStorage.getItem('wto_dismiss_' + aid);
            if (savedExp && parseInt(savedExp, 10) > Date.now()) {
              item.style.display = 'none';
            }
          }
        }
      } catch(_) {}

      // Live Countdown Ticker
      function initCountdownTickers() {
        var cdContainers = document.querySelectorAll('[data-wto-countdown-target]');
        if (!cdContainers.length) return;

        function updateAll() {
          var now = Date.now();
          for (var i = 0; i < cdContainers.length; i++) {
            var c = cdContainers[i];
            var targetStr = c.getAttribute('data-wto-countdown-target');
            if (!targetStr) continue;
            var target = parseInt(targetStr, 10);
            if (isNaN(target)) continue;

            var diff = Math.max(0, Math.floor((target - now) / 1000));
            var days = Math.floor(diff / 86400);
            var hours = Math.floor((diff % 86400) / 3600);
            var mins = Math.floor((diff % 3600) / 60);
            var secs = diff % 60;

            var dEl = c.querySelector('.wto-cd-days');
            var hEl = c.querySelector('.wto-cd-hours');
            var mEl = c.querySelector('.wto-cd-mins');
            var sEl = c.querySelector('.wto-cd-secs');

            if (dEl) dEl.textContent = String(days).padStart(2, '0');
            if (hEl) hEl.textContent = String(hours).padStart(2, '0');
            if (mEl) mEl.textContent = String(mins).padStart(2, '0');
            if (sEl) sEl.textContent = String(secs).padStart(2, '0');
          }
        }
        updateAll();
        setInterval(updateAll, 1000);
      }
      initCountdownTickers();

      // Click selection and action buttons in builder canvas
      if (document.body && document.body.hasAttribute('data-builder-edit-mode')) {
        document.addEventListener('click', function(e) {
          var actBtn = e.target && e.target.closest ? e.target.closest('[data-wto-floating-act]') : null;
          if (actBtn) {
            e.preventDefault();
            e.stopPropagation();
            var act = actBtn.getAttribute('data-wto-floating-act');
            var fid = actBtn.getAttribute('data-wto-floating-id');
            if (act === 'edit') {
              window.parent.postMessage({ type: 'WTO_EDIT_FLOATING_WIDGET', widgetId: fid }, '*');
            } else if (act === 'delete') {
              window.parent.postMessage({ type: 'WTO_DELETE_FLOATING_WIDGET', widgetId: fid }, '*');
            }
            return;
          }

          var target = e.target && e.target.closest ? e.target.closest('[data-wto-floating-id]') : null;
          if (target && !e.target.closest('[data-wto-a11y-cmd]') && !e.target.closest('.wto-a11y-trigger-btn')) {
            e.preventDefault();
            e.stopPropagation();
            var wid = target.getAttribute('data-wto-floating-id');
            var wtype = target.getAttribute('data-wto-floating-type');
            window.parent.postMessage({ type: 'WTO_SELECT_FLOATING_WIDGET', widgetId: wid, widgetType: wtype }, '*');
          }
        }, true);
      }
    })();
  `;

  return { html: overlayHtml, css, js };
}
