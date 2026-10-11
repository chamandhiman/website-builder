import type { WidgetInstanceRecord, GoogleReviewsConfig, GoogleReviewItem } from "@/services/widgetService";
import { renderCountdownHtml, attachCountdownInteractivity } from "./countdownRuntime";
import { renderAnnouncementPopupHtml, attachAnnouncementPopupInteractivity } from "./announcementPopupRuntime";
import { renderFaqHtml, attachFaqInteractivity } from "./faqRuntime";

export { renderCountdownHtml, attachCountdownInteractivity };
export { renderAnnouncementPopupHtml, attachAnnouncementPopupInteractivity };
export { renderFaqHtml, attachFaqInteractivity };

export interface RenderWidgetOptions {
  device?: "desktop" | "tablet" | "mobile";
}

/**
 * Generates the HTML and CSS markup for a dynamic Google Reviews widget instance
 * based on its configuration and active preview device.
 */
export function renderGoogleReviewsHtml(
  widget: WidgetInstanceRecord,
  options?: RenderWidgetOptions,
): { html: string; css: string } {
  if (widget.enabled === false) {
    return { html: "", css: "" };
  }
  const cfg = widget.config as GoogleReviewsConfig;
  const source = widget.source;
  const reviews: GoogleReviewItem[] = widget.selectedReviews || [];
  const widgetId = widget.id;
  const cls = `wto-inst-${widgetId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const st = cfg.style || ({} as GoogleReviewsConfig["style"]);
  const hd = cfg.header || ({} as GoogleReviewsConfig["header"]);
  const rv = cfg.review || ({} as GoogleReviewsConfig["review"]);
  const lo = cfg.layout || ({} as GoogleReviewsConfig["layout"]);

  const bg = st.backgroundColor || "transparent";
  const cardBg = st.cardBackgroundColor || "#ffffff";
  const textColor = st.textColor || "#1f2937";
  const secTextColor = st.secondaryTextColor || "#6b7280";
  const starCol = st.starColor || "#f59e0b";
  const accentCol = st.accentColor || "#1d4ed8";
  const verifiedCol = st.verifiedBadgeColor || "#3b82f6";
  const cardRadius = lo.cardBorderRadius || "14px";
  const cardPad = lo.cardPadding || "24px";
  const cardBorder = `${st.cardBorderWidth || "1px"} solid ${st.cardBorderColor || "#f0f2f5"}`;
  const cardShadow = st.cardShadow || "0 2px 12px rgba(0,0,0,0.06)";
  const hoverLift = st.hoverLift || "4px";

  const ratingVal = (source.overallRating ?? 4.7).toFixed(1);
  const reviewsCount = (source.totalReviews ?? reviews.length).toLocaleString();
  const ctaUrl = source.reviewUrl || "#";

  // Stars SVG helper
  const renderStars = (rating: number) => {
    const clamped = Math.min(5, Math.max(1, Math.round(rating)));
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<svg width="16" height="16" viewBox="0 0 24 24" fill="${i <= clamped ? starCol : "#e5e7eb"}" style="display:inline-block;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
    return `<div class="wto-stars-row" style="display:flex;align-items:center;">${stars}</div>`;
  };

  // Google G Icon SVG
  const googleLogoSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/><path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"/><path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"/><path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z" fill="#EA4335"/></svg>`;

  // Verified Badge SVG
  const verifiedBadgeSvg = `<span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;background:${verifiedCol};margin-left:5px;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`;

  // Header HTML
  let headerHtml = "";
  if (hd.showHeader !== false) {
    headerHtml = `
      <div class="wto-header-section" style="margin-bottom:24px;">
        ${hd.title ? `<h3 class="wto-widget-title" style="font-size:22px;font-weight:700;color:${textColor};margin:0 0 14px 0;text-align:center;">${escapeXml(hd.title)}</h3>` : ""}
        <div class="wto-header-bar" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;background:${st.theme === "dark" ? "#27272a" : "#f8fafc"};padding:14px 18px;border-radius:12px;border:1px solid ${st.theme === "dark" ? "#3f3f46" : "#e2e8f0"};">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            ${hd.showGoogleLogo !== false ? `<div style="display:flex;align-items:center;gap:6px;"><span style="font-weight:700;font-size:17px;"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></span> <span style="font-size:13px;color:${secTextColor};font-weight:500;">Reviews</span></div>` : ""}
            <div style="display:flex;align-items:center;gap:8px;">
              ${hd.showRating !== false ? `<span style="font-size:17px;font-weight:800;color:${textColor};">${ratingVal}</span>` : ""}
              ${hd.showRating !== false ? renderStars(Number(ratingVal)) : ""}
              ${hd.showReviewCount !== false ? `<span style="font-size:13px;color:${secTextColor};">(${reviewsCount})</span>` : ""}
            </div>
          </div>
          ${hd.showWriteReviewButton !== false ? `
            <a href="${escapeXml(ctaUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;background:${accentCol};color:#ffffff;font-size:12px;font-weight:600;padding:8px 16px;border-radius:9999px;text-decoration:none;transition:opacity 0.2s;">
              ${escapeXml(hd.buttonText || "Review us on Google")}
            </a>
          ` : ""}
        </div>
      </div>
    `;
  }

  // Cards HTML
  const cardsHtml = reviews.map((r, idx) => {
    let avatar = "";
    if (rv.showReviewerPhoto !== false) {
      if (r.authorPhoto) {
        avatar = `<img src="${escapeXml(r.authorPhoto)}" alt="${escapeXml(r.authorName)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />`;
      } else {
        const initials = r.authorInitials || r.authorName.slice(0, 2).toUpperCase();
        avatar = `<div style="width:40px;height:40px;border-radius:50%;background:${r.avatarBgColor || "#3b82f6"};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${escapeXml(initials)}</div>`;
      }
    }

    const needsTruncate = rv.showReadMore !== false && r.text.length > (rv.truncateLength || 140);
    const shortText = needsTruncate ? r.text.slice(0, rv.truncateLength || 140).trim() + "..." : r.text;

    return `
      <div class="wto-card-item wto-carousel-slide" data-carousel-slide="1" data-index="${idx}" style="box-sizing:border-box;">
        <div class="wto-card-inner" style="background:${cardBg};border:${cardBorder};border-radius:${cardRadius};padding:${cardPad};box-shadow:${cardShadow};display:flex;flex-direction:column;height:100%;transition:transform 0.2s, box-shadow 0.2s;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="position:relative;flex-shrink:0;">
              ${avatar}
              ${rv.showGoogleIcon !== false ? `<span style="position:absolute;bottom:-3px;right:-3px;width:16px;height:16px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.2);">${googleLogoSvg}</span>` : ""}
            </div>
            <div style="min-width:0;flex:1;">
              <div style="display:flex;align-items:center;font-weight:700;font-size:14px;color:${textColor};">
                <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${rv.showReviewerName !== false ? escapeXml(r.authorName) : ""}</span>
                ${rv.showVerifiedBadge !== false && r.verified !== false ? verifiedBadgeSvg : ""}
              </div>
              ${rv.showReviewDate !== false ? `<div style="font-size:11px;color:${secTextColor};">${escapeXml(r.relativeTimeDescription)}</div>` : ""}
            </div>
          </div>
          ${rv.showRating !== false ? `<div style="margin-bottom:10px;">${renderStars(r.rating)}</div>` : ""}
          <div style="flex:1;">
            <p class="wto-text-collapsed" style="font-size:13px;line-height:1.55;color:${textColor};margin:0;">${escapeXml(shortText)}</p>
            <p class="wto-text-full" style="display:none;font-size:13px;line-height:1.55;color:${textColor};margin:0;">${escapeXml(r.text)}</p>
            ${needsTruncate ? `<button type="button" class="wto-readmore-btn" style="background:none;border:none;padding:0;margin-top:6px;font-size:12px;font-weight:600;color:${accentCol};cursor:pointer;">Read more</button>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");

  const isCarousel = lo.type === "carousel" || lo.type === "slider";
  const deskCols = Number(lo.desktopColumns || 3);
  const tabCols = Number(lo.tabletColumns || 2);
  const mobCols = Number(lo.mobileColumns || 1);
  const gap = lo.gap || "16px";

  // Determine active columns based on preview device mode
  const activeCols = options?.device === "mobile" ? mobCols : options?.device === "tablet" ? tabCols : deskCols;

  // Body container HTML
  let bodyHtml = "";
  if (reviews.length === 0) {
    bodyHtml = `
      <div style="text-align:center;padding:36px 20px;border:1px dashed ${cardBorder};border-radius:${cardRadius};background:${cardBg};">
        <p style="margin:0 0 6px 0;font-size:14px;font-weight:600;color:${textColor};">No reviews selected</p>
        <p style="margin:0;font-size:12px;color:${secTextColor};">Connect a business source or select reviews in the studio to display them here.</p>
      </div>
    `;
  } else if (isCarousel) {
    const showArrows = lo.showArrows !== false && reviews.length > 1;
    const showDots = lo.showDots !== false && reviews.length > 1;

    bodyHtml = `
      <div class="wto-carousel-wrap" data-wto-carousel="1" data-carousel="1" style="position:relative;padding:0 24px;box-sizing:border-box;">
        ${showArrows ? `
          <button type="button" class="wto-nav-btn wto-prev-btn" data-carousel-prev="1" data-wto-carousel-btn="prev" data-wto-ignore-edit="1" aria-label="Previous review" style="position:absolute;left:2px;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;background:#1e293b;color:#ffffff;border:1px solid #334155;cursor:pointer;z-index:40;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.35);transition:all 0.2s ease;pointer-events:auto;user-select:none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="pointer-events:none;"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button type="button" class="wto-nav-btn wto-next-btn" data-carousel-next="1" data-wto-carousel-btn="next" data-wto-ignore-edit="1" aria-label="Next review" style="position:absolute;right:2px;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;background:#1e293b;color:#ffffff;border:1px solid #334155;cursor:pointer;z-index:40;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.35);transition:all 0.2s ease;pointer-events:auto;user-select:none;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="pointer-events:none;"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        ` : ""}
        <div class="wto-carousel-viewport" style="overflow:hidden;width:100%;border-radius:${cardRadius};padding:6px 0;">
          <div class="wto-carousel-track" data-carousel-track="1" style="display:flex;gap:${gap};width:max-content;min-width:100%;transition:transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);will-change:transform;">
            ${cardsHtml}
          </div>
        </div>
        ${showDots ? `
          <div class="wto-carousel-dots" data-carousel-dots="1" style="display:flex;justify-content:center;gap:6px;margin-top:18px;">
            ${reviews.map((_, i) => `<button type="button" class="wto-dot-btn ${i === 0 ? "active" : ""}" data-index="${i}" data-carousel-dot="${i}" data-wto-ignore-edit="1" aria-label="Slide ${i + 1}" style="width:8px;height:8px;border-radius:50%;background:#cbd5e1;border:none;padding:0;cursor:pointer;transition:all 0.2s;pointer-events:auto;"></button>`).join("")}
          </div>
        ` : ""}
      </div>
    `;
  } else {
    // Grid / List / Masonry / Badge
    const cols = lo.type === "list" ? 1 : activeCols;
    bodyHtml = `
      <div class="wto-grid-container" style="display:grid;grid-template-columns:repeat(${cols}, 1fr);gap:${gap};">
        ${cardsHtml}
      </div>
    `;
  }

  const css = `
    .${cls} {
      background-color: ${bg};
      box-sizing: border-box;
      width: 100%;
      font-family: ${st.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
      font-size: ${st.fontSize || 14}px;
      text-align: ${st.textAlign || 'left'};
    }
    .${cls} * { box-sizing: border-box; }
    .${cls} .wto-card-inner:hover {
      transform: translateY(-${hoverLift});
      box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    }
    .${cls} .wto-carousel-wrap .wto-card-item {
      flex: 0 0 calc((100% - (${gap} * (${activeCols} - 1))) / ${activeCols});
      min-width: 0;
    }
    @media (max-width: 1024px) {
      .${cls} .wto-carousel-wrap .wto-card-item {
        flex: 0 0 calc((100% - (${gap} * (${tabCols} - 1))) / ${tabCols});
      }
    }
    @media (max-width: 640px) {
      .${cls} .wto-carousel-wrap .wto-card-item {
        flex: 0 0 calc((100% - (${gap} * (${mobCols} - 1))) / ${mobCols});
      }
    }
    .${cls} .wto-dot-btn.active {
      background-color: ${accentCol || "#f59e0b"} !important;
      transform: scale(1.35);
    }
    .${cls} .wto-nav-btn:hover {
      transform: translateY(-50%) scale(1.1) !important;
      background-color: #0f172a !important;
      box-shadow: 0 6px 18px rgba(0,0,0,0.45) !important;
    }
    .${cls} .wto-nav-btn:active {
      transform: translateY(-50%) scale(0.96) !important;
    }
    .${cls} .wto-card-inner.is-expanded .wto-text-collapsed { display: none !important; }
    .${cls} .wto-card-inner.is-expanded .wto-text-full { display: block !important; }
  `;

  const html = `
    <div class="wto-dynamic-widget-root ${cls}"
         data-wto-widget="${widgetId}"
         data-layout="${lo.type}"
         data-cols-desktop="${deskCols}"
         data-cols-tablet="${tabCols}"
         data-cols-mobile="${mobCols}"
         data-active-cols="${activeCols}"
         data-autoplay="${lo.autoplay ? "1" : "0"}"
         data-autoplay-delay="${lo.autoplayDelay || 3500}"
         data-loop="${lo.loop !== false ? "1" : "0"}">
      <style>${css}</style>
      <div class="wto-widget-container" style="max-width:1200px;margin:0 auto;padding:12px;">
        ${headerHtml}
        ${bodyHtml}
      </div>
    </div>
  `.trim();

  return { html, css };
}

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
 * Attaches interactive handlers (carousel arrows, dots, autoplay with pause-on-hover, read-more toggle)
 * to a rendered widget container.
 * Returns a cleanup function to disconnect event listeners and timers.
 */
export function attachWidgetInteractivity(
  container: HTMLElement | null,
  options?: { previewDevice?: "desktop" | "tablet" | "mobile" },
): () => void {
  if (!container) return () => { };

  const cleanups: Array<() => void> = [];

  // Countdown timer runtime interactivity
  cleanups.push(attachCountdownInteractivity(container));

  // Announcement bar & popup runtime interactivity
  cleanups.push(attachAnnouncementPopupInteractivity(container));

  // FAQ Accordion runtime interactivity
  cleanups.push(attachFaqInteractivity(container));

  // 1. Read more toggles
  const readMoreButtons = container.querySelectorAll<HTMLButtonElement>(".wto-readmore-btn");
  readMoreButtons.forEach((btn) => {
    const clickHandler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest(".wto-card-inner");
      if (!card) return;
      const isExpanded = card.classList.contains("is-expanded");
      if (isExpanded) {
        card.classList.remove("is-expanded");
        btn.textContent = "Read more";
      } else {
        card.classList.add("is-expanded");
        btn.textContent = "Read less";
      }
    };
    btn.addEventListener("click", clickHandler);
    cleanups.push(() => btn.removeEventListener("click", clickHandler));
  });

  // 2. Carousel Sliders
  const rootEls: HTMLElement[] = [];
  if (
    container.matches?.(".wto-dynamic-widget-root, [data-wto-widget], .wto-test-carousel, [data-wto-carousel='1'], .wto-carousel-wrap")
  ) {
    rootEls.push(container);
  }
  container
    .querySelectorAll<HTMLElement>(
      ".wto-dynamic-widget-root, [data-wto-widget], .wto-test-carousel, [data-wto-carousel='1'], .wto-carousel-wrap",
    )
    .forEach((el) => {
      if (!rootEls.includes(el)) rootEls.push(el);
    });

  rootEls.forEach((root) => {
    const track = root.querySelector<HTMLElement>(".wto-carousel-track, [data-carousel-track]");
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".wto-card-item, .wto-carousel-slide, [data-carousel-slide]"),
    );
    const prevBtn = root.querySelector<HTMLButtonElement>(
      ".wto-prev-btn, [data-carousel-prev], [data-wto-carousel-btn='prev']",
    );
    const nextBtn = root.querySelector<HTMLButtonElement>(
      ".wto-next-btn, [data-carousel-next], [data-wto-carousel-btn='next']",
    );
    const dots = Array.from(
      root.querySelectorAll<HTMLButtonElement>(".wto-dot-btn, [data-carousel-dot], .wto-carousel-dot"),
    );
    const carouselWrap = root.querySelector<HTMLElement>(".wto-carousel-wrap") || root;

    if (!track || cards.length === 0 || track.getAttribute("data-wto-slider-ready") === "1") return;
    track.setAttribute("data-wto-slider-ready", "1");
    cleanups.push(() => track.removeAttribute?.("data-wto-slider-ready"));

    let currIndex = 0;
    const deskCols = Number(root.getAttribute("data-cols-desktop") || 3);
    const tabCols = Number(root.getAttribute("data-cols-tablet") || 2);
    const mobCols = Number(root.getAttribute("data-cols-mobile") || 1);
    const isAutoplay = root.getAttribute("data-autoplay") === "1";
    const autoplayDelay = Number(root.getAttribute("data-autoplay-delay") || 3500);
    const isLoop = root.getAttribute("data-loop") !== "0";

    function getVisibleCols(): number {
      if (options?.previewDevice === "mobile") return mobCols;
      if (options?.previewDevice === "tablet") return tabCols;
      if (options?.previewDevice === "desktop") return deskCols;

      const viewport = root.querySelector<HTMLElement>(".wto-carousel-viewport") || root;
      const w = viewport.clientWidth || root.clientWidth || window.innerWidth || 1000;
      if (w < 640) return mobCols;
      if (w < 1024) return tabCols;
      return deskCols;
    }

    function updateSlider() {
      const cols = getVisibleCols();
      const maxIdx = Math.max(0, cards.length - cols);
      if (currIndex > maxIdx) currIndex = maxIdx;
      if (currIndex < 0) currIndex = 0;

      // Calculate translation offset
      // Method 1: targetCard.offsetLeft - cards[0].offsetLeft (exact, subpixel accurate, gap-aware)
      const targetCard = cards[currIndex];
      let offset = 0;
      if (targetCard && cards[0] && targetCard.offsetLeft >= cards[0].offsetLeft) {
        offset = targetCard.offsetLeft - cards[0].offsetLeft;
      }

      // Method 2 fallback: calculated width + gap
      if (offset === 0 && currIndex > 0) {
        const cardWidth = cards[0]?.getBoundingClientRect().width || cards[0]?.offsetWidth || 0;
        const trackGap =
          parseFloat(window.getComputedStyle(track!).gap) ||
          parseFloat(root.getAttribute("data-gap") || "16") ||
          16;
        if (cardWidth > 0) {
          offset = currIndex * (cardWidth + trackGap);
        } else {
          const viewportWidth = (track!.parentElement?.clientWidth || root.clientWidth || 900) - 48;
          const fallbackColWidth = (viewportWidth - trackGap * (cols - 1)) / cols;
          offset = currIndex * (fallbackColWidth + trackGap);
        }
      }

      track!.style.transform = `translate3d(-${offset}px, 0, 0)`;

      // Update dot states
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === currIndex);
        d.classList.toggle("is-active", i === currIndex);
      });

      // Update button visual states
      if (prevBtn) {
        const canGoPrev = isLoop || currIndex > 0;
        prevBtn.style.opacity = canGoPrev ? "1" : "0.35";
        prevBtn.style.pointerEvents = canGoPrev ? "auto" : "none";
        prevBtn.disabled = !canGoPrev;
      }
      if (nextBtn) {
        const canGoNext = isLoop || currIndex < maxIdx;
        nextBtn.style.opacity = canGoNext ? "1" : "0.35";
        nextBtn.style.pointerEvents = canGoNext ? "auto" : "none";
        nextBtn.disabled = !canGoNext;
      }
    }

    // Previous slide
    if (prevBtn) {
      const onPrev = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const cols = getVisibleCols();
        const maxIdx = Math.max(0, cards.length - cols);
        if (currIndex > 0) {
          currIndex--;
        } else if (isLoop) {
          currIndex = maxIdx;
        }
        updateSlider();
      };
      prevBtn.addEventListener("click", onPrev);
      cleanups.push(() => prevBtn.removeEventListener("click", onPrev));
    }

    // Next slide
    if (nextBtn) {
      const onNext = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const cols = getVisibleCols();
        const maxIdx = Math.max(0, cards.length - cols);
        if (currIndex < maxIdx) {
          currIndex++;
        } else if (isLoop) {
          currIndex = 0;
        }
        updateSlider();
      };
      nextBtn.addEventListener("click", onNext);
      cleanups.push(() => nextBtn.removeEventListener("click", onNext));
    }

    // Dot indicators
    dots.forEach((dot) => {
      const onDot = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const cols = getVisibleCols();
        const maxIdx = Math.max(0, cards.length - cols);
        const targetIdx = Number(
          dot.getAttribute("data-index") || dot.getAttribute("data-carousel-dot") || 0,
        );
        currIndex = Math.min(maxIdx, targetIdx);
        updateSlider();
      };
      dot.addEventListener("click", onDot);
      cleanups.push(() => dot.removeEventListener("click", onDot));
    });

    // Autoplay setup
    let autoplayTimer: NodeJS.Timeout | null = null;
    if (isAutoplay && cards.length > getVisibleCols()) {
      const startAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
          const cols = getVisibleCols();
          const maxIdx = Math.max(0, cards.length - cols);
          if (currIndex < maxIdx) {
            currIndex++;
          } else if (isLoop) {
            currIndex = 0;
          }
          updateSlider();
        }, autoplayDelay);
      };

      const stopAutoplay = () => {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      };

      if (carouselWrap) {
        carouselWrap.addEventListener("mouseenter", stopAutoplay);
        carouselWrap.addEventListener("mouseleave", startAutoplay);
        cleanups.push(() => {
          carouselWrap.removeEventListener("mouseenter", stopAutoplay);
          carouselWrap.removeEventListener("mouseleave", startAutoplay);
          stopAutoplay();
        });
      }

      startAutoplay();
    }

    // Initial position & delayed update for layout settlement
    updateSlider();
    if (typeof requestAnimationFrame !== "undefined") {
      const rafId = requestAnimationFrame(() => updateSlider());
      cleanups.push(() => {
        if (typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(rafId);
      });
    }
    const timeoutId = setTimeout(() => updateSlider(), 150);
    cleanups.push(() => clearTimeout(timeoutId));

    // Resize handler
    if (typeof window !== "undefined") {
      const onResize = () => updateSlider();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));
    }
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

/**
 * The standalone runtime script string that executes on published sites and embeds.
 * It finds all [data-wto-widget], queries the widget service/API, and initializes them.
 */
export const WTO_STANDALONE_WIDGET_JS = `
(function(){
  function getStorageWidget(id) {
    try {
      var raw = localStorage.getItem('wto_dynamic_widgets_v1');
      if (raw) {
        var all = JSON.parse(raw);
        if (all && all[id]) return all[id];
      }
    } catch(e) {}
    try {
      if (typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:' && window.parent && window.parent !== window) {
        var pRaw = window.parent.localStorage.getItem('wto_dynamic_widgets_v1');
        if (pRaw) {
          var pAll = JSON.parse(pRaw);
          if (pAll && pAll[id]) return pAll[id];
        }
      }
    } catch(e) {}
    return null;
  }

  function initCountdown(root) {
    if (!root) return;
    if (root.getAttribute('data-wto-cd-active') === '1') return;
    root.setAttribute('data-wto-cd-active', '1');

    var widgetId = root.getAttribute('data-wto-widget') || 'countdown';
    var targetTimestampAttr = Number(root.getAttribute('data-target-timestamp') || 0);
    var mode = root.getAttribute('data-mode') || 'date';
    var targetDateStr = root.getAttribute('data-target-date') || '';
    var targetTimeStr = root.getAttribute('data-target-time') || '23:59';
    var durationVal = Number(root.getAttribute('data-duration-val') || 15);
    var durationUnit = root.getAttribute('data-duration-unit') || 'minutes';
    var persist = root.getAttribute('data-persist') === '1';
    var counterStart = Number(root.getAttribute('data-counter-start') || 100);
    var counterEnd = Number(root.getAttribute('data-counter-end') || 0);
    var counterDir = root.getAttribute('data-counter-dir') || 'down';
    var counterDur = Math.max(1, Number(root.getAttribute('data-counter-dur') || 60));
    var recurringHrs = Math.max(0.1, Number(root.getAttribute('data-recurring-hrs') || 24));
    var showDays = root.getAttribute('data-show-days') !== '0';
    var showHours = root.getAttribute('data-show-hours') !== '0';
    var showMinutes = root.getAttribute('data-show-minutes') !== '0';
    var showSeconds = root.getAttribute('data-show-seconds') !== '0';
    var expiryAction = root.getAttribute('data-expiry-action') || 'message';
    var expiryMsg = root.getAttribute('data-expiry-msg') || 'Offer has ended.';
    var expiryUrl = root.getAttribute('data-expiry-url') || '';

    var daysEl = root.querySelector('[data-digit-for="days"]');
    var hoursEl = root.querySelector('[data-digit-for="hours"]');
    var minsEl = root.querySelector('[data-digit-for="minutes"]');
    var secsEl = root.querySelector('[data-digit-for="seconds"]');
    var timerInner = root.querySelector('.wto-cd-inner');
    var expiryMsgEl = root.querySelector('.wto-cd-expiry-message');
    var closeBtn = root.querySelector('.wto-cd-close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        root.style.transition = 'opacity 0.25s, transform 0.25s';
        root.style.opacity = '0';
        root.style.transform = 'scale(0.98)';
        setTimeout(function() { root.style.display = 'none'; }, 250);
      });
    }

    var prevValues = {};
    function updateDigit(el, val) {
      if (!el) return;
      var key = el.getAttribute('data-digit-for') || '';
      if (prevValues[key] !== val) {
        prevValues[key] = val;
        el.textContent = val;
      }
    }

    var personalKey = 'wto_cd_visitor_' + widgetId;
    var personalEndTime = targetTimestampAttr > 0 ? targetTimestampAttr : 0;
    var personalDurationMs = durationVal * (durationUnit === 'days' ? 86400000 : durationUnit === 'hours' ? 3600000 : 60000);
    if (mode === 'personal') {
      if (!personalEndTime) {
        try {
          if (persist) {
            var stored = localStorage.getItem(personalKey);
            if (stored) { personalEndTime = Number(stored); }
            else { personalEndTime = Date.now() + personalDurationMs; localStorage.setItem(personalKey, String(personalEndTime)); }
          } else {
            personalEndTime = Date.now() + personalDurationMs;
          }
        } catch(e) {
          personalEndTime = Date.now() + personalDurationMs;
        }
      }
    }

    var counterStartTime = Date.now();
    var hasExpired = false;

    function handleExpiry() {
      if (hasExpired) return;
      hasExpired = true;
      if (expiryAction === 'hide') {
        root.style.display = 'none';
      } else if (expiryAction === 'message') {
        if (timerInner) timerInner.style.display = 'none';
        if (expiryMsgEl) {
          expiryMsgEl.style.display = 'block';
          var textEl = expiryMsgEl.querySelector('.wto-cd-expiry-text');
          if (textEl) textEl.textContent = expiryMsg;
        }
      } else if (expiryAction === 'redirect') {
        if (expiryUrl) {
          try { window.location.href = expiryUrl; } catch(e) {}
        }
      } else if (expiryAction === 'restart') {
        hasExpired = false;
        if (mode === 'personal' && targetTimestampAttr <= 0) {
          personalEndTime = Date.now() + personalDurationMs;
          try { if (persist) localStorage.setItem(personalKey, String(personalEndTime)); } catch(e) {}
        }
      }
    }

    function tick() {
      var now = Date.now();
      var diffMs = 0;

      if (targetTimestampAttr > 0) {
        diffMs = targetTimestampAttr - now;
      } else if (mode === 'date') {
        var targetMs = 0;
        if (targetDateStr) {
          var parts = targetDateStr.split('-').map(Number);
          var tParts = (targetTimeStr || '23:59').split(':').map(Number);
          var targetObj = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1, tParts[0] || 0, tParts[1] || 0, 0);
          targetMs = targetObj.getTime();
        }
        diffMs = targetMs - now;
      } else if (mode === 'personal') {
        diffMs = personalEndTime - now;
      } else if (mode === 'recurring') {
        var cycleMs = recurringHrs * 3600000;
        diffMs = cycleMs - (now % cycleMs);
      } else if (mode === 'counter') {
        var elapsedSec = (now - counterStartTime) / 1000;
        var progress = Math.min(1, elapsedSec / counterDur);
        var currentCount = counterDir === 'up'
          ? Math.round(counterStart + (counterEnd - counterStart) * progress)
          : Math.round(counterStart - (counterStart - counterEnd) * progress);
        var countStr = String(currentCount).padStart(2, '0');
        updateDigit(secsEl, countStr);
        if (progress >= 1 && !hasExpired) handleExpiry();
        return;
      }

      if (diffMs <= 0) {
        updateDigit(daysEl, '00');
        updateDigit(hoursEl, '00');
        updateDigit(minsEl, '00');
        updateDigit(secsEl, '00');
        handleExpiry();
        return;
      }

      var remSec = Math.floor(diffMs / 1000);
      var remMin = Math.floor(remSec / 60);
      var remHr = Math.floor(remMin / 60);
      var remDay = Math.floor(remHr / 24);

      var finalDays = 0, finalHours = 0, finalMinutes = 0, finalSeconds = 0;
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

      updateDigit(daysEl, String(finalDays).padStart(2, '0'));
      updateDigit(hoursEl, String(finalHours).padStart(2, '0'));
      updateDigit(minsEl, String(finalMinutes).padStart(2, '0'));
      updateDigit(secsEl, String(finalSeconds).padStart(2, '0'));
    }

    tick();
    setInterval(tick, 1000);
  }

  function attachInteractivity(container){
    container.querySelectorAll('.wto-readmore-btn').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest('.wto-card-inner');
        if (!card) return;
        var isExp = card.classList.contains('is-expanded');
        card.classList.toggle('is-expanded', !isExp);
        btn.textContent = isExp ? 'Read more' : 'Read less';
      });
    });

    var track = container.querySelector('.wto-carousel-track, [data-carousel-track]');
    var cards = Array.prototype.slice.call(container.querySelectorAll('.wto-card-item, .wto-carousel-slide, [data-carousel-slide]'));
    var prevBtn = container.querySelector('.wto-prev-btn, [data-carousel-prev], [data-wto-carousel-btn="prev"]');
    var nextBtn = container.querySelector('.wto-next-btn, [data-carousel-next], [data-wto-carousel-btn="next"]');
    var dots = Array.prototype.slice.call(container.querySelectorAll('.wto-dot-btn, [data-carousel-dot]'));
    var rootWidget = container.querySelector('.wto-dynamic-widget-root') || container;

    if (track && cards.length > 0) {
      var currIndex = 0;
      var deskCols = Number(rootWidget.getAttribute('data-cols-desktop') || (cards.length > 1 && cards[0].offsetWidth && cards[0].offsetWidth < (container.offsetWidth || 1000) * 0.45 ? 3 : 1));
      var tabCols = Number(rootWidget.getAttribute('data-cols-tablet') || (deskCols > 1 ? 2 : 1));
      var mobCols = Number(rootWidget.getAttribute('data-cols-mobile') || 1);
      var isAutoplay = rootWidget.getAttribute('data-autoplay') === '1';
      var autoplayDelay = Number(rootWidget.getAttribute('data-autoplay-delay') || 3500);
      var isLoop = rootWidget.getAttribute('data-loop') !== '0';

      function getVisibleCols(){
        var w = container.clientWidth || window.innerWidth || 1000;
        if (w < 640) return mobCols;
        if (w < 1024) return tabCols;
        return deskCols;
      }

      function updateSlider(){
        var cols = getVisibleCols();
        var maxIdx = Math.max(0, cards.length - cols);
        if (currIndex > maxIdx) currIndex = maxIdx;
        if (currIndex < 0) currIndex = 0;

        var targetCard = cards[currIndex];
        var offset = 0;
        if (targetCard && cards[0]) {
          if (targetCard.offsetLeft !== undefined && cards[0].offsetLeft !== undefined && targetCard.offsetLeft >= cards[0].offsetLeft && targetCard.offsetLeft > 0) {
            offset = targetCard.offsetLeft - cards[0].offsetLeft;
          } else {
            var cardWidth = (cards[0].getBoundingClientRect ? cards[0].getBoundingClientRect().width : 0) || cards[0].offsetWidth || 0;
            var trackGap = parseFloat(window.getComputedStyle(track).gap) || 16;
            offset = currIndex * (cardWidth + trackGap);
          }
        }

        track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

        dots.forEach(function(d, i){ d.classList.toggle('active', i === currIndex); });
        if (prevBtn) {
          var canPrev = isLoop || currIndex > 0;
          prevBtn.style.opacity = canPrev ? '1' : '0.35';
          prevBtn.style.pointerEvents = canPrev ? 'auto' : 'none';
          prevBtn.disabled = !canPrev;
        }
        if (nextBtn) {
          var canNext = isLoop || currIndex < maxIdx;
          nextBtn.style.opacity = canNext ? '1' : '0.35';
          nextBtn.style.pointerEvents = canNext ? 'auto' : 'none';
          nextBtn.disabled = !canNext;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          if (currIndex > 0) { currIndex--; } else if (isLoop) { currIndex = maxIdx; }
          updateSlider();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          if (currIndex < maxIdx) { currIndex++; } else if (isLoop) { currIndex = 0; }
          updateSlider();
        });
      }
      dots.forEach(function(dot){
        dot.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          var targetIdx = Number(dot.getAttribute('data-index') || 0);
          currIndex = Math.min(maxIdx, targetIdx);
          updateSlider();
        });
      });

      if (isAutoplay && cards.length > getVisibleCols()) {
        var wrap = container.querySelector('.wto-carousel-wrap') || container;
        var timer = setInterval(function(){
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          if (currIndex < maxIdx) { currIndex++; } else if (isLoop) { currIndex = 0; }
          updateSlider();
        }, autoplayDelay);
        if (wrap) {
          wrap.addEventListener('mouseenter', function(){ clearInterval(timer); });
          wrap.addEventListener('mouseleave', function(){
            timer = setInterval(function(){
              var cols = getVisibleCols();
              var maxIdx = Math.max(0, cards.length - cols);
              if (currIndex < maxIdx) { currIndex++; } else if (isLoop) { currIndex = 0; }
              updateSlider();
            }, autoplayDelay);
          });
        }
      }

      updateSlider();
      window.addEventListener('resize', updateSlider);
      setTimeout(updateSlider, 100);
    }
  }

  function initAnnouncementPopup(root) {
    if (!root) return;
    var scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]').forEach(function(ap){
      if (ap.getAttribute('data-ap-init') === '1') return;
      ap.setAttribute('data-ap-init', '1');

      var widgetId = ap.getAttribute('data-wto-widget') || '';
      var mode = ap.getAttribute('data-ap-mode') || 'bar';
      var trigger = ap.getAttribute('data-ap-trigger') || 'immediate';
      var delaySec = Number(ap.getAttribute('data-ap-delay') || 2);
      var scrollPct = Number(ap.getAttribute('data-ap-scroll') || 40);
      var freq = ap.getAttribute('data-ap-frequency') || 'always';
      var schedEnabled = ap.getAttribute('data-ap-schedule-enabled') === '1';
      var startStr = ap.getAttribute('data-ap-start-time') || '';
      var endStr = ap.getAttribute('data-ap-end-time') || '';
      var isCd = ap.getAttribute('data-ap-countdown') === '1';
      var targetTs = Number(ap.getAttribute('data-ap-target-timestamp') || 0);

      // Scheduling check
      if (schedEnabled) {
        var now = Date.now();
        if (startStr && now < new Date(startStr).getTime()) { ap.style.display = 'none'; return; }
        if (endStr && now > new Date(endStr).getTime()) { ap.style.display = 'none'; return; }
      }

      // Frequency check
      if (freq !== 'always' && widgetId) {
        var key = 'wto_ap_seen_' + widgetId;
        if (freq === 'session' && sessionStorage.getItem(key)) { ap.style.display = 'none'; return; }
        if (freq === 'once' && localStorage.getItem(key)) { ap.style.display = 'none'; return; }
        var cooldownMap = { '1day': 86400000, '7days': 604800000, '30days': 2592000000 };
        var cdMs = cooldownMap[freq] || 0;
        var last = Number(localStorage.getItem(key) || 0);
        if (last > 0 && (Date.now() - last) < cdMs) { ap.style.display = 'none'; return; }
      }

      function markSeen() {
        if (!widgetId) return;
        var key = 'wto_ap_seen_' + widgetId;
        var nowStr = String(Date.now());
        try {
          if (freq === 'session') sessionStorage.setItem(key, nowStr);
          else localStorage.setItem(key, nowStr);
        } catch(e) {}
      }

      // Triggering
      if (mode === 'popup') {
        if (trigger === 'delay') {
          ap.style.display = 'none';
          setTimeout(function(){ ap.style.display = 'flex'; markSeen(); }, delaySec * 1000);
        } else if (trigger === 'scroll') {
          ap.style.display = 'none';
          var triggered = false;
          window.addEventListener('scroll', function onScr(){
            if (triggered) return;
            var docH = document.documentElement.scrollHeight - window.innerHeight;
            if (docH > 0 && (window.scrollY / docH) * 100 >= scrollPct) {
              triggered = true;
              ap.style.display = 'flex';
              markSeen();
              window.removeEventListener('scroll', onScr);
            }
          });
        } else if (trigger === 'exit_intent') {
          ap.style.display = 'none';
          var triggeredExit = false;
          document.addEventListener('mouseleave', function onLeave(e){
            if (triggeredExit) return;
            if (e.clientY <= 10 && window.innerWidth >= 768) {
              triggeredExit = true;
              ap.style.display = 'flex';
              markSeen();
              document.removeEventListener('mouseleave', onLeave);
            }
          });
        } else {
          ap.style.display = 'flex';
          markSeen();
        }
      }

      // Close & Reopen buttons
      var closeBtn = ap.querySelector('.wto-bar-close-btn, .wto-popup-close-btn');
      var reopenBtn = ap.querySelector('.wto-bar-reopen-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          ap.style.display = 'none';
          if (reopenBtn) reopenBtn.style.display = 'block';
          markSeen();
        });
      }
      if (reopenBtn) {
        reopenBtn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          ap.style.display = 'block';
          reopenBtn.style.display = 'none';
        });
      }

      if (mode === 'popup') {
        ap.addEventListener('click', function(e){
          if (e.target === ap) { ap.style.display = 'none'; markSeen(); }
        });
        window.addEventListener('keydown', function(e){
          if (e.key === 'Escape' && ap.style.display !== 'none') {
            ap.style.display = 'none'; markSeen();
          }
        });
      }

      // Coupon copy
      ap.querySelectorAll('.wto-coupon-copy-btn').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          var code = btn.getAttribute('data-code') || '';
          var orig = btn.textContent || 'Copy';
          if (code && navigator.clipboard) {
            navigator.clipboard.writeText(code).then(function(){
              btn.textContent = 'Copied!';
              setTimeout(function(){ btn.textContent = orig; }, 2000);
            });
          }
        });
      });

      // Countdown ticker
      if (isCd && targetTs > 0) {
        var dEl = ap.querySelector('.wto-cd-days .wto-cd-val');
        var hEl = ap.querySelector('.wto-cd-hours .wto-cd-val');
        var mEl = ap.querySelector('.wto-cd-minutes .wto-cd-val');
        var sEl = ap.querySelector('.wto-cd-seconds .wto-cd-val');
        var expEl = ap.querySelector('.wto-cd-expired-note');
        function updateCd(){
          var diff = targetTs - Date.now();
          if (diff <= 0) {
            if (dEl) dEl.textContent = '00';
            if (hEl) hEl.textContent = '00';
            if (mEl) mEl.textContent = '00';
            if (sEl) sEl.textContent = '00';
            if (expEl) expEl.style.display = 'inline-block';
            return;
          }
          var tot = Math.floor(diff / 1000);
          var d = Math.floor(tot / 86400);
          var h = Math.floor((tot % 86400) / 3600);
          var m = Math.floor((tot % 3600) / 60);
          var s = tot % 60;
          if (dEl) dEl.textContent = String(d).padStart(2, '0');
          if (hEl) hEl.textContent = String(h).padStart(2, '0');
          if (mEl) mEl.textContent = String(m).padStart(2, '0');
          if (sEl) sEl.textContent = String(s).padStart(2, '0');
        }
        updateCd();
        setInterval(updateCd, 1000);
      }
    });
  }

  function autoAdaptFaqContrast(root) {
    if (!root || typeof window === 'undefined') return;
    function getEffectiveBg(el) {
      var curr = el;
      while (curr && curr !== document.documentElement) {
        var comp = window.getComputedStyle(curr);
        var bg = comp.backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          return bg;
        }
        curr = curr.parentElement;
      }
      return 'rgb(255, 255, 255)';
    }
    function parseRgb(colorStr) {
      if (!colorStr) return [255, 255, 255];
      var nums = colorStr.replace(/[^0-9,]/g, '').split(',');
      if (nums.length >= 3) {
        return [parseInt(nums[0], 10) || 0, parseInt(nums[1], 10) || 0, parseInt(nums[2], 10) || 0];
      }
      return [255, 255, 255];
    }
    function isLight(colorStr) {
      if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit') return true;
      var rgb = parseRgb(colorStr);
      var lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
      return lum > 0.52;
    }
    var effectiveRootBg = getEffectiveBg(root);
    var isRootLight = isLight(effectiveRootBg);
    var items = root.querySelectorAll('.wto-faq-item, .wto-faq-row');
    items.forEach(function(item) {
      var itemComp = window.getComputedStyle(item);
      var itemBg = (itemComp.backgroundColor && itemComp.backgroundColor !== 'transparent' && itemComp.backgroundColor !== 'rgba(0, 0, 0, 0)')
        ? itemComp.backgroundColor
        : effectiveRootBg;
      var isItemLight = isLight(itemBg);
      var btn = item.querySelector('.wto-faq-question-btn');
      if (btn) {
        var btnComp = window.getComputedStyle(btn);
        if (isItemLight && isLight(btnComp.color)) {
          btn.style.setProperty('color', '#0f172a', 'important');
        }
      }
      var ans = item.querySelector('.wto-faq-answer-inner, .wto-faq-answer-panel');
      if (ans) {
        var ansComp = window.getComputedStyle(ans);
        if (isItemLight && isLight(ansComp.color)) {
          ans.style.setProperty('color', '#334155', 'important');
        }
      }
      if (isItemLight) {
        var borderComp = window.getComputedStyle(item);
        var bColor = borderComp.borderColor;
        if (bColor && (bColor === 'rgba(255, 255, 255, 0.1)' || bColor.indexOf('255, 255, 255') !== -1)) {
          item.style.setProperty('border-color', '#e2e8f0', 'important');
        }
      }
    });
    var heading = root.querySelector('.wto-faq-heading, h2, h3');
    if (heading && isRootLight && isLight(window.getComputedStyle(heading).color)) {
      heading.style.setProperty('color', '#0f172a', 'important');
    }
    var desc = root.querySelector('.wto-faq-description');
    if (desc && isRootLight && isLight(window.getComputedStyle(desc).color)) {
      desc.style.setProperty('color', '#64748b', 'important');
    }
    var banner = root.querySelector('.wto-faq-support-banner');
    if (banner) {
      var bannerComp = window.getComputedStyle(banner);
      var bannerBg = (bannerComp.backgroundColor && bannerComp.backgroundColor !== 'transparent' && bannerComp.backgroundColor !== 'rgba(0, 0, 0, 0)')
        ? bannerComp.backgroundColor
        : effectiveRootBg;
      if (isLight(bannerBg)) {
        var sp = banner.querySelector('span');
        if (sp && isLight(window.getComputedStyle(sp).color)) {
          sp.style.setProperty('color', '#0f172a', 'important');
        }
        banner.style.setProperty('border-color', '#e2e8f0', 'important');
      }
    }
    var searchInput = root.querySelector('.wto-faq-search-input');
    if (searchInput && isRootLight) {
      var sComp = window.getComputedStyle(searchInput);
      if (isLight(sComp.backgroundColor) && isLight(sComp.color)) {
        searchInput.style.setProperty('color', '#0f172a', 'important');
        searchInput.style.setProperty('border-color', '#e2e8f0', 'important');
      }
    }
  }

  function initFaq(root) {
    if (!root) return;
    var scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll('.wto-faq-container, .wto-faq-root').forEach(function(container){
      autoAdaptFaqContrast(container);
      if (container.getAttribute('data-wto-faq-init') === '1') return;
      container.setAttribute('data-wto-faq-init', '1');

      var mode = container.getAttribute('data-mode') || (container.getAttribute('data-allow-multiple') === '1' ? 'multiple' : 'single');
      var rows = Array.prototype.slice.call(container.querySelectorAll('.wto-faq-row, .wto-faq-item'));

      function toggleRow(row, forceOpen) {
        var isOpen = row.classList.contains('is-open');
        var willOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;
        var btn = row.querySelector('.wto-faq-question-btn');
        var ans = row.querySelector('.wto-faq-answer-panel');

        if (willOpen && mode === 'single') {
          rows.forEach(function(other){
            if (other !== row && other.classList.contains('is-open')) {
              other.classList.remove('is-open');
              var oBtn = other.querySelector('.wto-faq-question-btn');
              var oAns = other.querySelector('.wto-faq-answer-panel');
              if (oBtn) oBtn.setAttribute('aria-expanded', 'false');
              if (oAns) oAns.style.maxHeight = '0px';
            }
          });
        }

        row.classList.toggle('is-open', willOpen);
        if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (ans) {
          if (willOpen) {
            ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
          } else {
            ans.style.maxHeight = '0px';
          }
        }
      }

      rows.forEach(function(row){
        var btn = row.querySelector('.wto-faq-question-btn');
        if (btn) {
          btn.addEventListener('click', function(e){
            e.preventDefault();
            toggleRow(row);
          });
        }
      });

      var expandAllBtn = container.querySelector('.wto-faq-expand-all, .wto-faq-expand-all-btn');
      var collapseAllBtn = container.querySelector('.wto-faq-collapse-all, .wto-faq-collapse-all-btn');
      if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function(e){
          e.preventDefault();
          rows.forEach(function(r){ toggleRow(r, true); });
        });
      }
      if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function(e){
          e.preventDefault();
          rows.forEach(function(r){ toggleRow(r, false); });
        });
      }

      var searchInput = container.querySelector('.wto-faq-search-input');
      var noRes = container.querySelector('.wto-faq-no-results, .wto-faq-empty-search');
      if (searchInput) {
        searchInput.addEventListener('input', function(){
          var q = searchInput.value.toLowerCase().trim();
          var visibleCount = 0;
          rows.forEach(function(r){
            var qText = (r.getAttribute('data-question') || (r.querySelector('.wto-faq-question-btn')?.textContent || '')).toLowerCase();
            var aText = (r.getAttribute('data-answer') || (r.querySelector('.wto-faq-answer-panel')?.textContent || '')).toLowerCase();
            var matches = !q || qText.indexOf(q) !== -1 || aText.indexOf(q) !== -1;
            r.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });
          if (noRes) noRes.style.display = visibleCount === 0 ? 'block' : 'none';
        });
      }

      var catBtns = container.querySelectorAll('.wto-faq-cat-btn, .wto-faq-cat-tag');
      catBtns.forEach(function(cb){
        cb.addEventListener('click', function(e){
          e.preventDefault();
          catBtns.forEach(function(b){ b.classList.remove('is-active'); });
          cb.classList.add('is-active');
          var cat = cb.getAttribute('data-cat') || 'all';
          var visibleCount = 0;
          rows.forEach(function(r){
            var rCat = r.getAttribute('data-category') || '';
            var matches = cat === 'all' || rCat === cat;
            r.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });
          if (noRes) noRes.style.display = visibleCount === 0 ? 'block' : 'none';
        });
      });

      var showMoreBtn = container.querySelector('.wto-faq-show-more-btn');
      if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function(e){
          e.preventDefault();
          rows.forEach(function(r){ r.classList.remove('wto-faq-row-hidden'); r.style.display = ''; });
          showMoreBtn.style.display = 'none';
        });
      }
    });
  }

  function initDynamicWidgets(root){
    try {
      var scope = root && root.querySelectorAll ? root : document;

      // 1. Initialize any standalone countdown widgets
      scope.querySelectorAll('.wto-countdown-root, [data-wto-countdown="1"]').forEach(function(cd){
        initCountdown(cd);
      });

      // 2. Initialize any announcement bars or popups
      initAnnouncementPopup(scope);

      // 3. Initialize any FAQ accordion widgets
      initFaq(scope);

      // 4. Initialize any widgets with data-wto-widget
      scope.querySelectorAll('[data-wto-widget]').forEach(function(el){
        var widgetId = el.getAttribute('data-wto-widget');
        if (!widgetId) return;

        // Check storage for widget definition and enabled state
        var widgetData = getStorageWidget(widgetId);
        if (widgetData && widgetData.enabled === false) {
          el.style.display = 'none';
          el.innerHTML = '';
          return;
        }

        // If countdown inside or matches:
        var cd = el.matches && el.matches('.wto-countdown-root, [data-wto-countdown="1"]') ? el : el.querySelector('.wto-countdown-root, [data-wto-countdown="1"]');
        if (cd) {
          initCountdown(cd);
          return;
        }

        // If announcement or popup inside or matches:
        var ap = el.matches && el.matches('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]') ? el : el.querySelector('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]');
        if (ap) {
          initAnnouncementPopup(el);
          return;
        }

        // If FAQ inside or matches:
        var faq = el.matches && el.matches('.wto-faq-container, .wto-faq-root') ? el : el.querySelector('.wto-faq-container, .wto-faq-root');
        if (faq) {
          initFaq(el);
          return;
        }

        // If reviews inside:
        if (el.querySelector('.wto-widget-container, .wto-card-inner, .wto-carousel-track')) {
          attachInteractivity(el);
          return;
        }

        // If pending or empty, request render
        if (widgetData) {
          window.dispatchEvent(new CustomEvent('wto-render-widget-request', { detail: { el: el, widget: widgetData } }));
        }
      });
    } catch(err) {
      console.warn('[WTOWidgetRuntime] error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ initDynamicWidgets(); });
  } else {
    initDynamicWidgets();
  }

  window.addEventListener('wto-preview-ready', function(){ initDynamicWidgets(); });
  window.addEventListener('wto-widget-saved', function(){ initDynamicWidgets(); });
  setInterval(function(){ initDynamicWidgets(); }, 1500);
})();
`;
