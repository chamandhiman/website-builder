import type { WidgetInstanceRecord } from "../../services/widgetService.ts";
import {
  type LanguageSwitcherConfig,
  type LanguageOption,
  DEFAULT_LANGUAGE_SWITCHER_CONFIG,
} from "../../services/languageSwitcherTemplates.ts";
import type { RenderWidgetOptions } from "./wtoWidgetRuntime";

/**
 * Standard Globe Icon SVG
 */
export const GLOBE_ICON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;

/**
 * Down Chevron Icon SVG
 */
export const CHEVRON_DOWN_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><path d="m6 9 6 6 6-6"/></svg>`;

/**
 * Search Icon SVG
 */
export const SEARCH_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;

/**
 * Checkmark SVG for active language item
 */
export const CHECK_ICON_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

/**
 * External Link SVG
 */
export const EXTERNAL_LINK_SVG = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

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
 * Normalizes language switcher configuration with defaults.
 */
export function normalizeLanguageSwitcherConfig(raw: any): LanguageSwitcherConfig {
  const def = DEFAULT_LANGUAGE_SWITCHER_CONFIG;
  const app = raw?.appearance || {};
  const beh = raw?.behavior || {};
  const langs = Array.isArray(raw?.languages) && raw.languages.length > 0 ? raw.languages : def.languages;

  return {
    languages: langs.map((l: any, i: number) => ({
      id: l.id || `lang-${i}`,
      code: l.code || "en",
      name: l.name || "Language",
      nativeName: l.nativeName || l.name || "Language",
      flag: l.flag || "🌐",
      url: l.url || "/",
      enabled: l.enabled !== false,
      isDefault: Boolean(l.isDefault),
    })),
    appearance: {
      template: app.template || def.appearance.template,
      layout: app.layout || def.appearance.layout,
      buttonFormat: app.buttonFormat || def.appearance.buttonFormat,
      showGlobeIcon: app.showGlobeIcon ?? def.appearance.showGlobeIcon,
      showFlags: app.showFlags ?? def.appearance.showFlags,
      showNativeNames: app.showNativeNames ?? def.appearance.showNativeNames,
      showSearchInDropdown: app.showSearchInDropdown ?? def.appearance.showSearchInDropdown,
      preSelectionLabel: app.preSelectionLabel ?? def.appearance.preSelectionLabel,
      fontSize: Number(app.fontSize) || def.appearance.fontSize,
      paddingX: Number(app.paddingX) || def.appearance.paddingX,
      paddingY: Number(app.paddingY) || def.appearance.paddingY,
      borderRadius: Number.isFinite(app.borderRadius) ? app.borderRadius : def.appearance.borderRadius,
      dropdownBorderRadius: Number.isFinite(app.dropdownBorderRadius) ? app.dropdownBorderRadius : def.appearance.dropdownBorderRadius,
      dropdownWidth: Number(app.dropdownWidth) || def.appearance.dropdownWidth,
      theme: app.theme || def.appearance.theme,
      backgroundColor: app.backgroundColor || def.appearance.backgroundColor,
      textColor: app.textColor || def.appearance.textColor,
      borderColor: app.borderColor || def.appearance.borderColor,
      hoverBackgroundColor: app.hoverBackgroundColor || def.appearance.hoverBackgroundColor,
      hoverTextColor: app.hoverTextColor || def.appearance.hoverTextColor,
      activeItemBackgroundColor: app.activeItemBackgroundColor || def.appearance.activeItemBackgroundColor,
      activeItemTextColor: app.activeItemTextColor || def.appearance.activeItemTextColor,
      accentColor: app.accentColor || def.appearance.accentColor,
      dropdownBackgroundColor: app.dropdownBackgroundColor || def.appearance.dropdownBackgroundColor,
      dropdownTextColor: app.dropdownTextColor || def.appearance.dropdownTextColor,
      dropdownBorderColor: app.dropdownBorderColor || def.appearance.dropdownBorderColor,
      dropdownShadow: app.dropdownShadow || def.appearance.dropdownShadow,
      dropdownPosition: app.dropdownPosition || def.appearance.dropdownPosition,
      floatingPosition: app.floatingPosition || def.appearance.floatingPosition,
      floatingOffsetX: Number(app.floatingOffsetX) || def.appearance.floatingOffsetX,
      floatingOffsetY: Number(app.floatingOffsetY) || def.appearance.floatingOffsetY,
      zIndex: Number(app.zIndex) || def.appearance.zIndex,
      visibleOnDesktop: app.visibleOnDesktop ?? def.appearance.visibleOnDesktop,
      visibleOnMobile: app.visibleOnMobile ?? def.appearance.visibleOnMobile,
      showTooltip: app.showTooltip ?? def.appearance.showTooltip,
      tooltipText: app.tooltipText || def.appearance.tooltipText,
      animation: app.animation || def.appearance.animation,
    },
    behavior: {
      mode: beh.mode || def.behavior.mode,
      detectBrowserLanguage: beh.detectBrowserLanguage ?? def.behavior.detectBrowserLanguage,
      rememberVisitorPreference: beh.rememberVisitorPreference ?? def.behavior.rememberVisitorPreference,
      autoRedirect: Boolean(beh.autoRedirect),
      openInNewTab: Boolean(beh.openInNewTab),
      storageKeyPrefix: beh.storageKeyPrefix || def.behavior.storageKeyPrefix,
      defaultFallbackCode: beh.defaultFallbackCode || def.behavior.defaultFallbackCode,
      autoTranslateProvider: beh.autoTranslateProvider || def.behavior.autoTranslateProvider,
    },
  };
}

/**
 * Generates the production HTML and scoped CSS markup for the Website Language Switcher.
 */
export function renderLanguageSwitcherHtml(
  widget: WidgetInstanceRecord,
  options?: RenderWidgetOptions
): { html: string; css: string } {
  if (widget.enabled === false) {
    return { html: "", css: "" };
  }

  const cfg = normalizeLanguageSwitcherConfig(widget.config);
  const app = cfg.appearance;
  const beh = cfg.behavior;
  const languages = cfg.languages.filter((l) => l.enabled);
  const defaultLang = languages.find((l) => l.isDefault) || languages[0] || {
    id: "def",
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🌐",
    url: "/",
    enabled: true,
  };

  const widgetId = widget.id;
  const cleanId = widgetId.replace(/[^a-zA-Z0-9_-]/g, "");
  const cls = `wto-lang-inst-${cleanId}`;

  const isFloating = app.layout === "floating_selector";
  const isHorizontalPills = app.layout === "horizontal_pills";
  const isMinimalText = app.layout === "minimal_text";
  const isCompactSheet = app.layout === "compact_bottom_sheet";

  // Dropdown Shadow CSS
  const shadowMap: Record<string, string> = {
    none: "none",
    soft: "0 4px 14px rgba(0,0,0,0.12)",
    medium: "0 10px 25px -3px rgba(0,0,0,0.25), 0 4px 10px -2px rgba(0,0,0,0.15)",
    intense: "0 20px 35px -5px rgba(0,0,0,0.4), 0 8px 16px -3px rgba(0,0,0,0.25)",
  };
  const dropdownShadowCss = shadowMap[app.dropdownShadow] || shadowMap.medium;

  // Floating Position Styles
  let floatingPositionCss = "";
  if (isFloating) {
    const posX = app.floatingPosition.includes("left") ? `left: ${app.floatingOffsetX}px;` : `right: ${app.floatingOffsetX}px;`;
    const posY = app.floatingPosition.includes("top") ? `top: ${app.floatingOffsetY}px;` : `bottom: ${app.floatingOffsetY}px;`;
    floatingPositionCss = `
      position: fixed;
      ${posX}
      ${posY}
      z-index: ${app.zIndex};
    `;
  }

  // Scoped CSS
  const css = `
    .${cls} {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      box-sizing: border-box;
      display: inline-block;
      text-align: left;
      position: relative;
      ${floatingPositionCss}
    }
    .${cls} *, .${cls} *::before, .${cls} *::after {
      box-sizing: border-box;
    }

    /* Trigger Button */
    .${cls} .wto-lang-trigger {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: ${app.fontSize}px;
      padding: ${app.paddingY}px ${app.paddingX}px;
      border-radius: ${app.borderRadius}px;
      background-color: ${app.backgroundColor};
      color: ${app.textColor};
      border: 1px solid ${app.borderColor};
      cursor: pointer;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      line-height: 1;
      text-decoration: none;
    }
    .${cls} .wto-lang-trigger:hover {
      background-color: ${app.hoverBackgroundColor};
      color: ${app.hoverTextColor};
      border-color: ${app.accentColor};
      transform: translateY(-1px);
    }
    .${cls} .wto-lang-trigger:active {
      transform: translateY(0);
    }

    /* Icon styling */
    .${cls} .wto-lang-globe-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: ${app.accentColor};
      flex-shrink: 0;
    }
    .${cls} .wto-lang-flag {
      font-size: 1.15em;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }
    .${cls} .wto-lang-label-pre {
      font-size: 0.9em;
      opacity: 0.75;
      font-weight: 500;
    }
    .${cls} .wto-lang-name {
      font-weight: 600;
      white-space: nowrap;
    }
    .${cls} .wto-lang-code {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .${cls} .wto-lang-chevron {
      display: inline-flex;
      align-items: center;
      margin-left: 2px;
      opacity: 0.7;
      transition: transform 0.2s ease;
    }
    .${cls}.wto-open .wto-lang-chevron {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .${cls} .wto-lang-dropdown {
      position: absolute;
      width: ${app.dropdownWidth}px;
      max-height: 340px;
      overflow-y: auto;
      background-color: ${app.dropdownBackgroundColor};
      color: ${app.dropdownTextColor};
      border: 1px solid ${app.dropdownBorderColor};
      border-radius: ${app.dropdownBorderRadius}px;
      box-shadow: ${dropdownShadowCss};
      padding: 6px;
      z-index: 9999999;
      opacity: 0;
      visibility: hidden;
      transform: scale(0.96) translateY(-4px);
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(12px);
    }
    .${cls}.wto-open .wto-lang-dropdown {
      opacity: 1;
      visibility: visible;
      transform: scale(1) translateY(0);
    }

    /* Position Variants */
    ${
      app.dropdownPosition === "top_right" || (isFloating && app.floatingPosition.includes("bottom"))
        ? `
        .${cls} .wto-lang-dropdown {
          bottom: calc(100% + 8px);
          right: 0;
        }
      `
        : app.dropdownPosition === "top_left"
        ? `
        .${cls} .wto-lang-dropdown {
          bottom: calc(100% + 8px);
          left: 0;
        }
      `
        : app.dropdownPosition === "bottom_left"
        ? `
        .${cls} .wto-lang-dropdown {
          top: calc(100% + 8px);
          left: 0;
        }
      `
        : `
        .${cls} .wto-lang-dropdown {
          top: calc(100% + 8px);
          right: 0;
        }
      `
    }

    /* Search input inside dropdown */
    .${cls} .wto-lang-search-box {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      margin-bottom: 6px;
    }
    .${cls} .wto-lang-search-input {
      background: transparent;
      border: none;
      outline: none;
      color: inherit;
      font-size: 11px;
      width: 100%;
    }

    /* Dropdown Items */
    .${cls} .wto-lang-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: ${app.fontSize}px;
      color: inherit;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      text-decoration: none;
      transition: all 0.12s ease;
      user-select: none;
    }
    .${cls} .wto-lang-item:hover, .${cls} .wto-lang-item:focus {
      background-color: ${app.hoverBackgroundColor};
      color: ${app.hoverTextColor};
    }
    .${cls} .wto-lang-item.wto-active {
      background-color: ${app.activeItemBackgroundColor};
      color: ${app.activeItemTextColor};
      font-weight: 600;
    }
    .${cls} .wto-lang-item-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .${cls} .wto-lang-item-names {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
      min-width: 0;
    }
    .${cls} .wto-lang-item-main {
      font-size: 1em;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .${cls} .wto-lang-item-native {
      font-size: 0.85em;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .${cls} .wto-lang-badge-default {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 4px;
      background: rgba(255,255,255,0.12);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Horizontal Pills Layout */
    .${cls} .wto-lang-pills-row {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .${cls} .wto-lang-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: ${app.paddingY}px ${app.paddingX}px;
      border-radius: ${app.borderRadius}px;
      background-color: ${app.backgroundColor};
      color: ${app.textColor};
      border: 1px solid ${app.borderColor};
      font-size: ${app.fontSize}px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .${cls} .wto-lang-pill-btn:hover {
      background-color: ${app.hoverBackgroundColor};
      color: ${app.hoverTextColor};
      border-color: ${app.accentColor};
    }
    .${cls} .wto-lang-pill-btn.wto-active {
      background-color: ${app.activeItemBackgroundColor};
      color: ${app.activeItemTextColor};
      border-color: ${app.activeItemBackgroundColor};
      font-weight: 600;
    }

    /* Tooltip */
    .${cls} .wto-lang-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      padding: 5px 9px;
      border-radius: 6px;
      background: #09090b;
      color: #f4f4f5;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      z-index: 10;
    }
    .${cls}:hover .wto-lang-tooltip {
      opacity: ${app.showTooltip ? "1" : "0"};
      visibility: ${app.showTooltip ? "visible" : "hidden"};
    }

    /* Responsive visibility */
    @media (max-width: 768px) {
      ${!app.visibleOnMobile ? `.${cls} { display: none !important; }` : ""}
    }
    @media (min-width: 769px) {
      ${!app.visibleOnDesktop ? `.${cls} { display: none !important; }` : ""}
    }
  `;

  // Render Horizontal Pills
  if (isHorizontalPills) {
    const pillsHtml = languages
      .map((l) => {
        const isActive = l.id === defaultLang.id;
        const flagHtml = app.showFlags ? `<span class="wto-lang-flag">${l.flag}</span>` : "";
        const nameText = app.buttonFormat === "code_only" ? l.code.toUpperCase() : app.showNativeNames ? l.nativeName : l.name;

        return `
          <a
            href="${escapeXml(l.url)}"
            class="wto-lang-pill-btn ${isActive ? "wto-active" : ""}"
            data-lang-id="${escapeXml(l.id)}"
            data-lang-code="${escapeXml(l.code)}"
            data-lang-url="${escapeXml(l.url)}"
            title="${escapeXml(l.name)}"
          >
            ${flagHtml}
            <span class="wto-lang-name">${escapeXml(nameText)}</span>
          </a>
        `;
      })
      .join("");

    const html = `
      <div id="wto-lang-${cleanId}" class="${cls}" data-wto-lang-widget="1" data-widget-id="${escapeXml(widgetId)}">
        <div class="wto-lang-pills-row" role="navigation" aria-label="Language selection">
          ${app.showGlobeIcon ? `<span class="wto-lang-globe-icon">${GLOBE_ICON_SVG}</span>` : ""}
          ${app.preSelectionLabel ? `<span class="wto-lang-label-pre">${escapeXml(app.preSelectionLabel)}</span>` : ""}
          ${pillsHtml}
        </div>
      </div>
    `;

    return { html, css };
  }

  // Trigger Button Content for Dropdown layouts
  let triggerContent = "";
  if (app.showGlobeIcon && (app.layout === "globe_dropdown" || app.layout === "globe_text_dropdown" || isFloating)) {
    triggerContent += `<span class="wto-lang-globe-icon">${GLOBE_ICON_SVG}</span>`;
  }

  if (app.showFlags && defaultLang.flag && app.layout !== "minimal_text") {
    triggerContent += `<span class="wto-lang-flag">${defaultLang.flag}</span>`;
  }

  if (app.preSelectionLabel) {
    triggerContent += `<span class="wto-lang-label-pre">${escapeXml(app.preSelectionLabel)}</span>`;
  }

  if (app.buttonFormat === "code_only" || isMinimalText) {
    triggerContent += `<span class="wto-lang-code">${escapeXml(defaultLang.code.toUpperCase())}</span>`;
  } else if (app.buttonFormat === "name_only" || app.buttonFormat === "flag_and_name" || app.buttonFormat === "globe_and_name") {
    triggerContent += `<span class="wto-lang-name">${escapeXml(app.showNativeNames ? defaultLang.nativeName : defaultLang.name)}</span>`;
  } else {
    triggerContent += `<span class="wto-lang-code">${escapeXml(defaultLang.code.toUpperCase())}</span>`;
  }

  triggerContent += `<span class="wto-lang-chevron">${CHEVRON_DOWN_SVG}</span>`;

  // Search box inside dropdown if many languages
  const searchBoxHtml =
    app.showSearchInDropdown && languages.length > 4
      ? `
        <div class="wto-lang-search-box">
          ${SEARCH_ICON_SVG}
          <input type="text" class="wto-lang-search-input" placeholder="Search language..." aria-label="Search languages" />
        </div>
      `
      : "";

  // Dropdown list items
  const itemsHtml = languages
    .map((l) => {
      const isActive = l.id === defaultLang.id;
      const flagHtml = app.showFlags ? `<span class="wto-lang-flag">${l.flag}</span>` : "";

      return `
        <a
          href="${escapeXml(l.url)}"
          class="wto-lang-item ${isActive ? "wto-active" : ""}"
          data-lang-id="${escapeXml(l.id)}"
          data-lang-code="${escapeXml(l.code)}"
          data-lang-url="${escapeXml(l.url)}"
          data-lang-name="${escapeXml(l.name.toLowerCase())}"
          data-lang-native="${escapeXml(l.nativeName.toLowerCase())}"
          role="option"
          aria-selected="${isActive ? "true" : "false"}"
        >
          <div class="wto-lang-item-left">
            ${flagHtml}
            <div class="wto-lang-item-names">
              <span class="wto-lang-item-main">${escapeXml(l.name)}</span>
              ${app.showNativeNames && l.nativeName !== l.name ? `<span class="wto-lang-item-native">${escapeXml(l.nativeName)}</span>` : ""}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            ${l.isDefault ? `<span class="wto-lang-badge-default">Default</span>` : ""}
            ${isActive ? `<span style="color:${app.activeItemTextColor || app.accentColor};">${CHECK_ICON_SVG}</span>` : ""}
          </div>
        </a>
      `;
    })
    .join("");

  const html = `
    <div id="wto-lang-${cleanId}" class="${cls}" data-wto-lang-widget="1" data-widget-id="${escapeXml(widgetId)}">
      <button
        type="button"
        class="wto-lang-trigger"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-label="Select website language. Current language: ${escapeXml(defaultLang.name)}"
      >
        ${triggerContent}
      </button>

      ${app.showTooltip ? `<div class="wto-lang-tooltip">${escapeXml(app.tooltipText)}</div>` : ""}

      <div class="wto-lang-dropdown" role="listbox" aria-label="Available languages">
        ${searchBoxHtml}
        <div class="wto-lang-items-list">
          ${itemsHtml}
        </div>
      </div>
    </div>
  `;

  return { html, css };
}

/**
 * Attaches client-side DOM interactivity for the Language Switcher widget.
 * Handles dropdown toggling, outside clicks, search filtering, browser language detection,
 * preference remembering, and safe URL navigation.
 */
export function attachLanguageSwitcherInteractivity(
  container: HTMLElement | null,
  widgetOrOptions?:
    | WidgetInstanceRecord
    | {
        isPreview?: boolean;
        onLanguageSelect?: (lang: LanguageOption) => void;
      },
  options?: {
    isPreview?: boolean;
    onLanguageSelect?: (lang: LanguageOption) => void;
  }
): () => void {
  if (!container) return () => {};
  const root = container.querySelector<HTMLElement>("[data-wto-lang-widget='1']") || container;
  if (!root || root.getAttribute("data-wto-lang-init") === "1") return () => {};
  root.setAttribute("data-wto-lang-init", "1");

  const opts = widgetOrOptions && "isPreview" in widgetOrOptions ? widgetOrOptions : options;
  const widget = widgetOrOptions && "config" in widgetOrOptions ? (widgetOrOptions as WidgetInstanceRecord) : null;
  const cfg = widget ? normalizeLanguageSwitcherConfig(widget.config) : null;
  const beh = cfg?.behavior || { storageKeyPrefix: "wto_lang_pref", rememberVisitorPreference: true, openInNewTab: false, autoRedirect: false, detectBrowserLanguage: false };
  const languages: LanguageOption[] = cfg?.languages?.filter((l) => l.enabled) || [
    { id: "en", code: "en", name: "English", nativeName: "English", flag: "🌐", url: "/", enabled: true, isDefault: true },
  ];
  const triggerBtn = root.querySelector<HTMLButtonElement>(".wto-lang-trigger");
  const dropdown = root.querySelector<HTMLElement>(".wto-lang-dropdown");
  const searchInput = root.querySelector<HTMLInputElement>(".wto-lang-search-input");
  const items = Array.from(root.querySelectorAll<HTMLElement>(".wto-lang-item, .wto-lang-pill-btn"));

  const widgetId = widget?.id || root.getAttribute("data-wto-widget") || "default";
  const storageKey = `${beh.storageKeyPrefix}_${widgetId}`;

  // Helper to open/close dropdown
  const toggleDropdown = (open?: boolean) => {
    const willOpen = typeof open === "boolean" ? open : !root.classList.contains("wto-open");
    root.classList.toggle("wto-open", willOpen);
    if (triggerBtn) {
      triggerBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    }
    if (willOpen && searchInput) {
      setTimeout(() => searchInput.focus(), 60);
    }
  };

  // Toggle button click
  if (triggerBtn) {
    triggerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });
  }

  // Click outside closes dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (!root.contains(e.target as Node)) {
      toggleDropdown(false);
    }
  };
  document.addEventListener("click", handleClickOutside);

  // Escape key closes dropdown
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && root.classList.contains("wto-open")) {
      toggleDropdown(false);
      triggerBtn?.focus();
    }
  };
  document.addEventListener("keydown", handleKeyDown);

  // Search filter inside dropdown
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase().trim();
      items.forEach((item) => {
        const name = item.getAttribute("data-lang-name") || "";
        const nativeName = item.getAttribute("data-lang-native") || "";
        const code = item.getAttribute("data-lang-code")?.toLowerCase() || "";
        const match = !q || name.includes(q) || nativeName.includes(q) || code.includes(q);
        item.style.display = match ? "flex" : "none";
      });
    });
  }

  // Language selection click handler
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const code = item.getAttribute("data-lang-code");
      const url = item.getAttribute("data-lang-url");
      const lang = languages.find((l) => l.code === code) || languages[0];

      if (!lang) return;

      // Persist preference if enabled
      if (beh.rememberVisitorPreference && typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, lang.code);
        } catch (_) {}
      }

      // Close dropdown
      toggleDropdown(false);

      // Handle selection
      if (opts?.isPreview) {
        opts.onLanguageSelect?.(lang);
      } else {
        // Live navigation to exact configured destination URL
        if (url && url !== "#" && url !== "") {
          if (beh.openInNewTab) {
            window.open(url, "_blank");
          } else {
            window.location.href = url;
          }
        }
      }
    });
  });

  // Browser language suggestion / auto-redirect logic (Live only, strictly guarded against loops)
  if (!opts?.isPreview && typeof window !== "undefined") {
    try {
      const storedLang = beh.rememberVisitorPreference ? localStorage.getItem(storageKey) : null;
      let targetLang = languages.find((l) => l.code === storedLang);

      // If no stored preference, check browser languages
      if (!targetLang && beh.detectBrowserLanguage && navigator.languages) {
        for (const browserLang of navigator.languages) {
          const simpleCode = browserLang.toLowerCase().split("-")[0];
          const match = languages.find(
            (l) => l.code.toLowerCase() === browserLang.toLowerCase() || l.code.toLowerCase() === simpleCode
          );
          if (match) {
            targetLang = match;
            break;
          }
        }
      }

      // Optional Auto-Redirect (Only if explicitly enabled and destination is different from current page)
      if (beh.autoRedirect && targetLang && targetLang.url && targetLang.url !== "#") {
        const currentHref = window.location.href;
        const currentPath = window.location.pathname;

        // Strictly check that we are not already on that destination to avoid redirect loops!
        const alreadyThere =
          currentHref === targetLang.url ||
          currentPath === targetLang.url ||
          (targetLang.url.startsWith("/") && currentPath.startsWith(targetLang.url));

        if (!alreadyThere) {
          window.location.href = targetLang.url;
        }
      }
    } catch (_) {}
  }

  // Cleanup handler return
  return () => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleKeyDown);
  };
}
