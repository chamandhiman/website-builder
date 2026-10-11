import type { WidgetInstanceRecord } from "@/services/widgetService";
import type { FaqConfig, FaqItem } from "@/services/faqTemplates";
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
 * Validates URLs to prevent script injection.
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
 * Formats basic rich text in answers (paragraphs, bold, links, bullet lists).
 */
function formatRichAnswer(raw: string): string {
  if (!raw) return "";

  // Split lines
  const lines = raw.split("\n");
  let inList = false;
  let html = "";

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      continue;
    }

    // Bullet points (starting with - or *)
    if (/^[-*•]\s+/.test(trimmed)) {
      if (!inList) {
        html += '<ul style="margin:8px 0;padding-left:22px;list-style-type:disc;">';
        inList = true;
      }
      const itemText = escapeXml(trimmed.replace(/^[-*•]\s+/, ""));
      html += `<li style="margin-bottom:4px;">${parseInlineFormat(itemText)}</li>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    html += `<p style="margin:0 0 8px 0;line-height:1.6;">${parseInlineFormat(escapeXml(trimmed))}</p>`;
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}

function parseInlineFormat(text: string): string {
  // Bold **text**
  let res = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Links [text](url)
  res = res.replace(/\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#facc15;text-decoration:underline;">$1</a>');
  return res;
}

/**
 * Returns SVG markup for the selected icon style.
 */
function renderFaqIcon(style: string, iconColor: string): string {
  switch (style) {
    case "plus_minus":
      return `
        <span class="wto-faq-icon wto-faq-icon-plus" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex-shrink:0;color:${iconColor};transition:transform 0.25s ease;">
          <svg class="wto-icon-plus" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <svg class="wto-icon-minus" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
      `;
    case "arrow":
      return `
        <span class="wto-faq-icon wto-faq-icon-arrow" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex-shrink:0;color:${iconColor};transition:transform 0.25s ease;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      `;
    case "caret":
      return `
        <span class="wto-faq-icon wto-faq-icon-caret" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex-shrink:0;color:${iconColor};transition:transform 0.25s ease;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
        </span>
      `;
    case "chevron":
    default:
      return `
        <span class="wto-faq-icon wto-faq-icon-chevron" style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex-shrink:0;color:${iconColor};transition:transform 0.25s cubic-bezier(0.16,1,0.3,1);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      `;
  }
}

/**
 * Generates pure HTML & scoped CSS for an FAQ Accordion widget instance.
 */
export function renderFaqHtml(
  widget: WidgetInstanceRecord<FaqConfig>,
  options?: RenderWidgetOptions
): { html: string; css: string } {
  // If widget is turned off, do not render markup
  if (widget.enabled === false) {
    return { html: "", css: "" };
  }

  const cfg = (widget.config || {}) as FaqConfig;
  const widgetId = widget.id || "wgt_faq_preview";
  const cls = `wto-inst-${widgetId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const content = cfg.content || {
    heading: "Frequently Asked Questions",
    description: "",
    showHeading: true,
    showDescription: true,
    showSearch: false,
    searchPlaceholder: "Search questions…",
    showCategories: false,
    categories: [],
    items: [],
  };

  const layout = cfg.layout || {
    template: "classic_accordion",
    columns: 1,
    alignment: "left",
    maxWidth: 860,
    isFullWidth: false,
    questionSpacing: 12,
    rowPadding: 18,
    borderRadius: 12,
    borderWidth: 1,
    iconPosition: "right",
    showMoreLimit: 0,
    showMoreText: "Show more questions",
    showLessText: "Show less",
  };

  const behavior = cfg.behavior || {
    allowMultipleOpen: false,
    initialState: "first_open",
    animationDurationMs: 250,
    showExpandAllControls: false,
    supportUrl: "#",
    supportText: "Still have questions? Contact support",
    emptySearchText: "No questions found.",
  };

  const rawRowBg = cfg.colors?.rowBackground ?? cfg.colors?.rowBg ?? "#18181b";
  const isLightRow = rawRowBg === "transparent" || rawRowBg === "#ffffff" || rawRowBg === "#fff" || rawRowBg === "rgb(255, 255, 255)";
  let rawQColor = cfg.colors?.questionColor ?? (isLightRow ? "#0f172a" : "#ffffff");
  let rawAColor = cfg.colors?.answerColor ?? (isLightRow ? "#334155" : "#d4d4d8");
  if (isLightRow && (rawQColor.toLowerCase() === "#ffffff" || rawQColor.toLowerCase() === "#fff")) {
    rawQColor = "#0f172a";
  }
  if (isLightRow && (rawAColor.toLowerCase() === "#d4d4d8" || rawAColor.toLowerCase() === "#ffffff")) {
    rawAColor = "#334155";
  }

  const colors = {
    widgetBackground: cfg.colors?.widgetBackground ?? cfg.colors?.widgetBg ?? "transparent",
    headingColor: cfg.colors?.headingColor ?? (isLightRow ? "#0f172a" : "#ffffff"),
    descriptionColor: cfg.colors?.descriptionColor ?? (isLightRow ? "#64748b" : "#a1a1aa"),
    questionColor: rawQColor,
    answerColor: rawAColor,
    rowBackground: rawRowBg,
    expandedRowBackground: cfg.colors?.expandedRowBackground ?? cfg.colors?.expandedRowBg ?? (isLightRow ? "rgba(250, 204, 21, 0.08)" : "#27272a"),
    borderColor: cfg.colors?.borderColor ?? (isLightRow ? "#e4e4e7" : "#3f3f46"),
    iconColor: cfg.colors?.iconColor ?? "#facc15",
    searchBackground: cfg.colors?.searchBackground ?? cfg.colors?.searchBg ?? (isLightRow ? "#ffffff" : "#18181b"),
    searchTextColor: cfg.colors?.searchTextColor ?? (isLightRow ? "#0f172a" : "#ffffff"),
    categoryTagBackground: cfg.colors?.categoryTagBackground ?? (isLightRow ? "#f1f5f9" : "#27272a"),
    categoryTagTextColor: cfg.colors?.categoryTagTextColor ?? (isLightRow ? "#475569" : "#a1a1aa"),
    activeCategoryTagBackground: cfg.colors?.activeCategoryTagBackground ?? "#facc15",
    activeCategoryTagTextColor: cfg.colors?.activeCategoryTagTextColor ?? "#000000",
  };

  const typo = {
    fontFamily: cfg.typography?.fontFamily || "Inter, system-ui, sans-serif",
    headingSize: cfg.typography?.headingSize || 28,
    questionSize: cfg.typography?.questionFontSize ?? cfg.typography?.questionSize ?? 16,
    answerSize: cfg.typography?.answerFontSize ?? cfg.typography?.answerSize ?? 14,
    fontWeight: cfg.typography?.fontWeight || "600",
    lineHeight: cfg.typography?.lineHeight || "1.6",
  };

  const iconStyle = cfg.icons?.style || "chevron";
  const items: FaqItem[] = (Array.isArray(cfg.items) && cfg.items.length > 0 ? cfg.items : content.items) || [];
  const isMobile = options?.device === "mobile";
  const isTwoCol = !isMobile && layout.columns === 2;

  // Scoped CSS
  const css = `
    .${cls} {
      font-family: ${typo.fontFamily};
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: ${typo.lineHeight};
      width: 100%;
      ${layout.isFullWidth ? "max-width: 100%;" : `max-width: ${layout.maxWidth}px;`}
      margin: 0 auto;
      background-color: ${colors.widgetBackground};
    }
    .${cls} * {
      box-sizing: border-box;
    }

    /* Accordion Item Rows */
    .${cls} .wto-faq-item {
      background-color: ${colors.rowBackground};
      border: ${layout.borderWidth}px solid ${colors.borderColor};
      border-radius: ${layout.borderRadius}px;
      margin-bottom: ${layout.questionSpacing}px;
      transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }
    .${cls} .wto-faq-item.is-open {
      background-color: ${colors.expandedRowBackground};
      border-color: ${colors.iconColor};
    }

    /* Question Button Header */
    .${cls} .wto-faq-question-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: ${layout.rowPadding}px;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      color: ${colors.questionColor};
      font-family: inherit;
      font-size: ${typo.questionSize}px;
      font-weight: ${typo.fontWeight};
      line-height: 1.4;
      user-select: none;
      transition: color 0.15s ease;
    }
    .${cls} .wto-faq-question-btn:focus-visible {
      outline: 2px solid ${colors.iconColor};
      outline-offset: -2px;
    }

    /* Icon Rotations */
    .${cls} .wto-faq-item.is-open .wto-faq-icon-chevron {
      transform: rotate(180deg);
    }
    .${cls} .wto-faq-item.is-open .wto-faq-icon-arrow {
      transform: rotate(90deg);
    }
    .${cls} .wto-faq-item.is-open .wto-icon-plus {
      display: none !important;
    }
    .${cls} .wto-faq-item.is-open .wto-icon-minus {
      display: block !important;
    }

    /* Answer Content Collapse */
    .${cls} .wto-faq-answer-panel {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height ${behavior.animationDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${behavior.animationDurationMs}ms ease;
    }
    .${cls} .wto-faq-item.is-open .wto-faq-answer-panel {
      max-height: 1200px;
      opacity: 1;
    }
    .${cls} .wto-faq-answer-inner {
      padding: 0 ${layout.rowPadding}px ${layout.rowPadding}px ${layout.rowPadding}px;
      color: ${colors.answerColor};
      font-size: ${typo.answerSize}px;
      line-height: 1.6;
    }

    /* Category Pill Tags */
    .${cls} .wto-faq-cat-tag {
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid ${colors.borderColor};
      background: ${colors.categoryTagBackground};
      color: ${colors.categoryTagTextColor};
      transition: all 0.15s ease;
    }
    .${cls} .wto-faq-cat-tag.is-active {
      background: ${colors.activeCategoryTagBackground};
      color: ${colors.activeCategoryTagTextColor};
      border-color: ${colors.activeCategoryTagBackground};
      font-weight: 700;
    }

    @media (prefers-reduced-motion: reduce) {
      .${cls} .wto-faq-answer-panel {
        transition: none !important;
      }
    }
  `;

  // JSON-LD Schema.org Structured Data
  let structuredDataScript = "";
  if (cfg.advanced?.structuredData && items.length > 0) {
    const faqEntities = items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer.replace(/<[^>]+>/g, ""),
      },
    }));
    const schemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities,
    });
    structuredDataScript = `<script type="application/ld+json">${schemaJson}</script>`;
  }

  // Categories list
  const categories = content.categories && content.categories.length > 0
    ? content.categories
    : Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[];

  // Render question items
  const renderItemHtml = (it: FaqItem, index: number) => {
    const isInitiallyOpen =
      behavior.initialState === "first_open" ? index === 0 : Boolean(it.isOpen);
    const openClass = isInitiallyOpen ? "is-open" : "";
    const ariaExpanded = isInitiallyOpen ? "true" : "false";
    const itemId = `${cls}-item-${index}`;
    const questionId = `${cls}-q-${index}`;
    const answerId = `${cls}-a-${index}`;
    const iconHtml = renderFaqIcon(iconStyle, colors.iconColor);

    return `
      <div class="wto-faq-item ${openClass}" id="${itemId}" data-faq-index="${index}" data-faq-category="${escapeXml(it.category || "")}">
        <button
          type="button"
          class="wto-faq-question-btn"
          id="${questionId}"
          aria-expanded="${ariaExpanded}"
          aria-controls="${answerId}"
          style="flex-direction:${layout.iconPosition === "left" ? "row-reverse" : "row"};justify-content:${layout.iconPosition === "left" ? "flex-end" : "space-between"};"
        >
          <span class="wto-faq-question-text" style="flex:1;">
            ${escapeXml(it.question)}
          </span>
          ${iconHtml}
        </button>

        <div
          class="wto-faq-answer-panel"
          id="${answerId}"
          role="region"
          aria-labelledby="${questionId}"
        >
          <div class="wto-faq-answer-inner">
            ${formatRichAnswer(it.answer)}
          </div>
        </div>
      </div>
    `;
  };

  // Build items grid / columns
  let itemsHtml = "";
  if (isTwoCol) {
    const half = Math.ceil(items.length / 2);
    const col1 = items.slice(0, half);
    const col2 = items.slice(half);

    itemsHtml = `
      <div class="wto-faq-columns-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0 ${layout.questionSpacing}px;">
        <div class="wto-faq-col-1">${col1.map((it, idx) => renderItemHtml(it, idx)).join("")}</div>
        <div class="wto-faq-col-2">${col2.map((it, idx) => renderItemHtml(it, idx + half)).join("")}</div>
      </div>
    `;
  } else {
    itemsHtml = `
      <div class="wto-faq-list">
        ${items.map((it, idx) => renderItemHtml(it, idx)).join("")}
      </div>
    `;
  }

  const html = `
    <div class="${cls} wto-faq-root ${cfg.advanced?.customCssClass || ""}" data-wto-widget="${escapeXml(widgetId)}" data-allow-multiple="${behavior.allowMultipleOpen ? "1" : "0"}" data-show-limit="${Number(layout.showMoreLimit || 0)}">
      
      <!-- Section Header -->
      ${(content.showHeading && content.heading) || (content.showDescription && content.description) ? `
        <div class="wto-faq-header" style="margin-bottom:24px;text-align:${layout.alignment};">
          ${content.showHeading && content.heading ? `
            <h2 class="wto-faq-title" style="margin:0 0 8px 0;font-size:${typo.headingSize}px;font-weight:800;color:${colors.headingColor};">
              ${escapeXml(content.heading)}
            </h2>
          ` : ""}
          ${content.showDescription && content.description ? `
            <p class="wto-faq-desc" style="margin:0;font-size:14px;color:${colors.descriptionColor};line-height:1.5;">
              ${escapeXml(content.description)}
            </p>
          ` : ""}
        </div>
      ` : ""}

      <!-- Search Input -->
      ${content.showSearch ? `
        <div class="wto-faq-search-wrap" style="margin-bottom:18px;position:relative;">
          <input
            type="text"
            class="wto-faq-search-input"
            placeholder="${escapeXml(content.searchPlaceholder || "Search questions…")}"
            aria-label="Search frequently asked questions"
            style="
              width:100%;
              padding:12px 16px 12px 40px;
              background:${colors.searchBackground};
              color:${colors.searchTextColor};
              border:1px solid ${colors.borderColor};
              border-radius:${layout.borderRadius}px;
              font-size:13px;
              outline:none;
              transition:border-color 0.15s ease;
            "
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${colors.descriptionColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      ` : ""}

      <!-- Categories & Expand All Controls Bar -->
      ${(content.showCategories && categories.length > 0) || behavior.showExpandAllControls ? `
        <div class="wto-faq-controls-bar" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
          ${content.showCategories && categories.length > 0 ? `
            <div class="wto-faq-categories-row" style="display:flex;align-items:center;flex-wrap:wrap;gap:8px;">
              <button type="button" class="wto-faq-cat-tag is-active" data-cat="all">All</button>
              ${categories.map((c) => `<button type="button" class="wto-faq-cat-tag" data-cat="${escapeXml(c)}">${escapeXml(c)}</button>`).join("")}
            </div>
          ` : "<div></div>"}

          ${behavior.showExpandAllControls ? `
            <div class="wto-faq-expand-controls" style="display:flex;align-items:center;gap:6px;margin-left:auto;">
              <button type="button" class="wto-faq-expand-all-btn" style="background:transparent;border:none;color:${colors.iconColor};font-size:11px;font-weight:700;cursor:pointer;padding:4px 8px;">Expand all</button>
              <span style="color:${colors.borderColor};">|</span>
              <button type="button" class="wto-faq-collapse-all-btn" style="background:transparent;border:none;color:${colors.descriptionColor};font-size:11px;font-weight:600;cursor:pointer;padding:4px 8px;">Collapse all</button>
            </div>
          ` : ""}
        </div>
      ` : ""}

      <!-- Accordion Questions Items -->
      <div class="wto-faq-items-container">
        ${itemsHtml}
      </div>

      <!-- Empty Search Results Message (Hidden by default) -->
      <div class="wto-faq-empty-search" style="display:none;padding:28px 16px;text-align:center;color:${colors.descriptionColor};font-size:13px;background:${colors.rowBackground};border:1px dashed ${colors.borderColor};border-radius:${layout.borderRadius}px;margin-top:10px;">
        ${escapeXml(behavior.emptySearchText || "No questions found matching your search.")}
      </div>

      <!-- Show More / Less Toggle Button -->
      ${layout.showMoreLimit > 0 && items.length > layout.showMoreLimit ? `
        <div class="wto-faq-show-more-wrap" style="text-align:center;margin-top:16px;">
          <button type="button" class="wto-faq-show-more-btn" data-showing-all="0" style="
            background:${colors.rowBackground};
            border:1px solid ${colors.borderColor};
            color:${colors.questionColor};
            padding:10px 20px;
            border-radius:9999px;
            font-size:12px;
            font-weight:700;
            cursor:pointer;
            transition:all 0.15s ease;
          ">
            ${escapeXml(layout.showMoreText || "Show more questions")}
          </button>
        </div>
      ` : ""}

      <!-- Optional Contact Support Banner -->
      ${behavior.supportUrl && behavior.supportText ? `
        <div class="wto-faq-support-banner" style="
          margin-top:24px;
          padding:16px 20px;
          background:${colors.rowBackground};
          border:1px solid ${colors.borderColor};
          border-radius:${layout.borderRadius}px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          flex-wrap:wrap;
          gap:12px;
        ">
          <span style="font-size:13px;color:${colors.questionColor};font-weight:600;">
            ${escapeXml(behavior.supportText)}
          </span>
          <a href="${escapeXml(sanitizeUrl(behavior.supportUrl))}" target="_blank" rel="noopener noreferrer" style="
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding:8px 16px;
            background:${colors.iconColor};
            color:#000000;
            font-size:12px;
            font-weight:700;
            border-radius:8px;
            text-decoration:none;
            transition:opacity 0.15s ease;
          ">
            <span>Contact Support</span>
            <span>→</span>
          </a>
        </div>
      ` : ""}

      ${structuredDataScript}
    </div>
  `;

  return { html, css };
}

/**
 * Automatically inspects the parent/container environment and ensures
 * high-contrast, fully readable colors when rendered on light or dark pages.
 */
export function autoAdaptFaqContrast(root: HTMLElement): void {
  if (!root || typeof window === "undefined") return;

  function getEffectiveBg(el: HTMLElement): string {
    let curr: HTMLElement | null = el;
    while (curr && curr !== document.documentElement) {
      const comp = window.getComputedStyle(curr);
      const bg = comp.backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        return bg;
      }
      curr = curr.parentElement;
    }
    return "rgb(255, 255, 255)";
  }

  function parseRgb(colorStr: string): [number, number, number] {
    if (!colorStr) return [255, 255, 255];
    const nums = colorStr.replace(/[^0-9,]/g, "").split(",");
    if (nums.length >= 3) {
      return [parseInt(nums[0], 10) || 0, parseInt(nums[1], 10) || 0, parseInt(nums[2], 10) || 0];
    }
    return [255, 255, 255];
  }

  function isLight(colorStr: string): boolean {
    if (!colorStr || colorStr === "transparent" || colorStr === "inherit") return true;
    const [r, g, b] = parseRgb(colorStr);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.52;
  }

  const effectiveRootBg = getEffectiveBg(root);
  const isRootLight = isLight(effectiveRootBg);

  const items = root.querySelectorAll<HTMLElement>(".wto-faq-item, .wto-faq-row");
  items.forEach((item) => {
    const itemComp = window.getComputedStyle(item);
    const itemBg = (itemComp.backgroundColor && itemComp.backgroundColor !== "transparent" && itemComp.backgroundColor !== "rgba(0, 0, 0, 0)")
      ? itemComp.backgroundColor
      : effectiveRootBg;
    const isItemLight = isLight(itemBg);

    const btn = item.querySelector<HTMLElement>(".wto-faq-question-btn");
    if (btn) {
      const btnComp = window.getComputedStyle(btn);
      if (isItemLight && isLight(btnComp.color)) {
        btn.style.setProperty("color", "#0f172a", "important");
      }
    }

    const ans = item.querySelector<HTMLElement>(".wto-faq-answer-inner, .wto-faq-answer-panel");
    if (ans) {
      const ansComp = window.getComputedStyle(ans);
      if (isItemLight && isLight(ansComp.color)) {
        ans.style.setProperty("color", "#334155", "important");
      }
    }

    if (isItemLight) {
      const borderComp = window.getComputedStyle(item);
      const bColor = borderComp.borderColor;
      if (bColor && (bColor === "rgba(255, 255, 255, 0.1)" || bColor.includes("255, 255, 255"))) {
        item.style.setProperty("border-color", "#e2e8f0", "important");
      }
    }
  });

  const heading = root.querySelector<HTMLElement>(".wto-faq-heading, h2, h3");
  if (heading && isRootLight && isLight(window.getComputedStyle(heading).color)) {
    heading.style.setProperty("color", "#0f172a", "important");
  }

  const desc = root.querySelector<HTMLElement>(".wto-faq-description");
  if (desc && isRootLight && isLight(window.getComputedStyle(desc).color)) {
    desc.style.setProperty("color", "#64748b", "important");
  }

  const banner = root.querySelector<HTMLElement>(".wto-faq-support-banner");
  if (banner) {
    const bannerComp = window.getComputedStyle(banner);
    const bannerBg = (bannerComp.backgroundColor && bannerComp.backgroundColor !== "transparent" && bannerComp.backgroundColor !== "rgba(0, 0, 0, 0)")
      ? bannerComp.backgroundColor
      : effectiveRootBg;
    if (isLight(bannerBg)) {
      const sp = banner.querySelector<HTMLElement>("span");
      if (sp && isLight(window.getComputedStyle(sp).color)) {
        sp.style.setProperty("color", "#0f172a", "important");
      }
      banner.style.setProperty("border-color", "#e2e8f0", "important");
    }
  }

  const searchInput = root.querySelector<HTMLInputElement>(".wto-faq-search-input");
  if (searchInput && isRootLight) {
    const sComp = window.getComputedStyle(searchInput);
    if (isLight(sComp.backgroundColor) && isLight(sComp.color)) {
      searchInput.style.setProperty("color", "#0f172a", "important");
      searchInput.style.setProperty("border-color", "#e2e8f0", "important");
    }
  }
}

/**
 * Attaches runtime expand/collapse, search filtering, category filtering,
 * contrast auto-adaptation, and keyboard navigation to rendered FAQ containers.
 */
export function attachFaqInteractivity(
  container: HTMLElement,
  options?: { isPreview?: boolean }
): () => void {
  const elements = container.querySelectorAll<HTMLElement>(".wto-faq-root");
  const cleanupTasks: Array<() => void> = [];

  elements.forEach((root) => {
    // 0. Automatically adapt colors based on container brightness (prevents white-on-white)
    autoAdaptFaqContrast(root);

    const allowMultiple = root.getAttribute("data-allow-multiple") === "1";
    const showLimit = Number(root.getAttribute("data-show-limit") || 0);

    const items = Array.from(root.querySelectorAll<HTMLElement>(".wto-faq-item"));
    const questionButtons = Array.from(root.querySelectorAll<HTMLButtonElement>(".wto-faq-question-btn"));
    const searchInput = root.querySelector<HTMLInputElement>(".wto-faq-search-input");
    const categoryTags = Array.from(root.querySelectorAll<HTMLButtonElement>(".wto-faq-cat-tag"));
    const expandAllBtn = root.querySelector<HTMLButtonElement>(".wto-faq-expand-all-btn");
    const collapseAllBtn = root.querySelector<HTMLButtonElement>(".wto-faq-collapse-all-btn");
    const showMoreBtn = root.querySelector<HTMLButtonElement>(".wto-faq-show-more-btn");
    const emptySearchNote = root.querySelector<HTMLElement>(".wto-faq-empty-search");

    // 1. Show More Limit Setup
    if (showLimit > 0 && items.length > showLimit) {
      items.forEach((it, idx) => {
        if (idx >= showLimit) {
          it.style.display = "none";
          it.setAttribute("data-hidden-by-limit", "1");
        }
      });
    }

    if (showMoreBtn) {
      const handleShowMore = (e: Event) => {
        e.preventDefault();
        const isShowingAll = showMoreBtn.getAttribute("data-showing-all") === "1";
        if (isShowingAll) {
          // Collapse to limit
          items.forEach((it, idx) => {
            if (idx >= showLimit) {
              it.style.display = "none";
              it.setAttribute("data-hidden-by-limit", "1");
            }
          });
          showMoreBtn.setAttribute("data-showing-all", "0");
          showMoreBtn.textContent = "Show more questions";
        } else {
          // Expand all
          items.forEach((it) => {
            it.style.display = "block";
            it.removeAttribute("data-hidden-by-limit");
          });
          showMoreBtn.setAttribute("data-showing-all", "1");
          showMoreBtn.textContent = "Show less";
        }
      };
      showMoreBtn.addEventListener("click", handleShowMore);
      cleanupTasks.push(() => showMoreBtn.removeEventListener("click", handleShowMore));
    }

    // 2. Expand / Collapse Item Toggle Handler
    const toggleItem = (targetItem: HTMLElement, open?: boolean) => {
      const btn = targetItem.querySelector<HTMLButtonElement>(".wto-faq-question-btn");
      const isAlreadyOpen = targetItem.classList.contains("is-open");
      const shouldOpen = open !== undefined ? open : !isAlreadyOpen;

      if (shouldOpen && !allowMultiple) {
        // Close other items
        items.forEach((other) => {
          if (other !== targetItem && other.classList.contains("is-open")) {
            other.classList.remove("is-open");
            const otherBtn = other.querySelector<HTMLButtonElement>(".wto-faq-question-btn");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });
      }

      if (shouldOpen) {
        targetItem.classList.add("is-open");
        if (btn) btn.setAttribute("aria-expanded", "true");
      } else {
        targetItem.classList.remove("is-open");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    };

    questionButtons.forEach((btn) => {
      const item = btn.closest<HTMLElement>(".wto-faq-item");
      if (!item) return;

      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(item);
      };
      btn.addEventListener("click", handleClick);
      cleanupTasks.push(() => btn.removeEventListener("click", handleClick));
    });

    // 3. Expand All / Collapse All Controls
    if (expandAllBtn) {
      const handleExpandAll = (e: Event) => {
        e.preventDefault();
        items.forEach((it) => toggleItem(it, true));
      };
      expandAllBtn.addEventListener("click", handleExpandAll);
      cleanupTasks.push(() => expandAllBtn.removeEventListener("click", handleExpandAll));
    }

    if (collapseAllBtn) {
      const handleCollapseAll = (e: Event) => {
        e.preventDefault();
        items.forEach((it) => toggleItem(it, false));
      };
      collapseAllBtn.addEventListener("click", handleCollapseAll);
      cleanupTasks.push(() => collapseAllBtn.removeEventListener("click", handleCollapseAll));
    }

    // 4. Live Search Filtering
    if (searchInput) {
      const handleSearch = () => {
        const query = searchInput.value.trim().toLowerCase();
        let matchCount = 0;

        items.forEach((it) => {
          const qText = it.querySelector(".wto-faq-question-text")?.textContent?.toLowerCase() || "";
          const aText = it.querySelector(".wto-faq-answer-inner")?.textContent?.toLowerCase() || "";
          const isMatch = !query || qText.includes(query) || aText.includes(query);

          if (isMatch) {
            it.style.display = "block";
            matchCount++;
          } else {
            it.style.display = "none";
          }
        });

        if (emptySearchNote) {
          emptySearchNote.style.display = matchCount === 0 ? "block" : "none";
        }
      };

      searchInput.addEventListener("input", handleSearch);
      cleanupTasks.push(() => searchInput.removeEventListener("input", handleSearch));
    }

    // 5. Category Filter Tags
    categoryTags.forEach((tag) => {
      const handleCategoryClick = (e: Event) => {
        e.preventDefault();
        const cat = tag.getAttribute("data-cat") || "all";

        categoryTags.forEach((t) => t.classList.remove("is-active"));
        tag.classList.add("is-active");

        let visibleCount = 0;
        items.forEach((it) => {
          const itemCat = it.getAttribute("data-faq-category") || "";
          const matches = cat === "all" || itemCat.toLowerCase() === cat.toLowerCase();

          if (matches) {
            it.style.display = "block";
            visibleCount++;
          } else {
            it.style.display = "none";
          }
        });

        if (emptySearchNote) {
          emptySearchNote.style.display = visibleCount === 0 ? "block" : "none";
        }
      };

      tag.addEventListener("click", handleCategoryClick);
      cleanupTasks.push(() => tag.removeEventListener("click", handleCategoryClick));
    });
  });

  return () => {
    cleanupTasks.forEach((fn) => fn());
  };
}
