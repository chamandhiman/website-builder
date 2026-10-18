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
        const waUrl = `https://wa.me/${phone.replace(/^\+/, "")}?text=${encodeURIComponent(rawMsg)}`;
        const btnColor = widget.config.buttonColor || "#25D366";
        const agentName = widget.config.agentName || "Customer Support";
        const greeting = widget.config.greetingText || "How can we help you today?";
        const btnLabel = widget.config.buttonLabel || "Chat with us";

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-whatsapp" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99999; pointer-events: auto;">
            ${editorControls}
            <div class="wto-wa-container" style="display: flex; flex-direction: column; align-items: ${pos.includes("left") ? "flex-start" : "flex-end"}; gap: 8px;">
              ${
                greeting
                  ? `<div class="wto-wa-bubble" style="background: #ffffff; color: #1f2937; padding: 10px 14px; border-radius: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 500; box-shadow: 0 4px 18px rgba(0,0,0,0.18); max-width: 240px; border-bottom-${pos.includes("left") ? "left" : "right"}-radius: 4px; display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: 10px; color: #059669; font-weight: 700; text-transform: uppercase;">${agentName}</span>
                      <span>${greeting}</span>
                    </div>`
                  : ""
              }
              <a href="${editorMode ? "javascript:void(0)" : waUrl}" target="_blank" rel="noopener noreferrer" class="wto-wa-btn" style="display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px; border-radius: 999px; background: ${btnColor}; color: #ffffff; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; box-shadow: 0 6px 20px rgba(37,211,102,0.38); transition: transform 0.2s ease, box-shadow 0.2s ease;">
                <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" style="flex-shrink: 0;"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/></svg>
                <span>${btnLabel}</span>
              </a>
            </div>
          </div>
        `);
        break;
      }

      case "accessibility": {
        const accent = widget.config.accentColor || "#3B82F6";
        const btnSize = widget.config.buttonSize || 50;

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-a11y" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99998; pointer-events: auto;">
            ${editorControls}
            <button type="button" class="wto-a11y-trigger-btn" onclick="window.wtoToggleA11yPanel && window.wtoToggleA11yPanel()" style="width: ${btnSize}px; height: ${btnSize}px; border-radius: 50%; background: ${accent}; color: #ffffff; border: 2px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 20px rgba(59,130,246,0.35); transition: transform 0.2s ease;">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>
            </button>
          </div>
        `);
        break;
      }

      case "language_switcher": {
        const langs = Array.isArray(widget.config.languages) ? widget.config.languages : [{ code: "en", name: "English", flag: "🇺🇸" }];
        const currentLang = langs[0] || { code: "en", name: "English", flag: "🇺🇸" };

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
        const label = widget.config.label || "Call Now";
        const actionType = widget.config.actionType || "phone";
        const actionVal = widget.config.actionValue || "+1234567890";
        const href = actionType === "phone" ? `tel:${actionVal}` : actionType === "email" ? `mailto:${actionVal}` : actionVal;

        htmlParts.push(`
          <div class="wto-floating-item wto-floating-contact" ${editAttrs} style="position: fixed; ${posStyle} z-index: 99995; pointer-events: auto;">
            ${editorControls}
            <a href="${editorMode ? "javascript:void(0)" : href}" class="wto-contact-btn" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 999px; background: ${btnColor}; color: ${textColor}; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 700; box-shadow: 0 6px 20px rgba(250,204,21,0.35); transition: transform 0.2s ease;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>${label}</span>
            </a>
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
    @media (max-width: 768px) {
      .wto-floating-item { max-width: 90vw !important; }
    }
  `;

  const js = `
    (function() {
      if (typeof window === 'undefined') return;
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
          if (target) {
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
