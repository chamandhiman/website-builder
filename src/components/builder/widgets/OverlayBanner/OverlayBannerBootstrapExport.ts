import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import {
  defaultOverlayBannerWidgetData,
  isOverlayBannerWidgetData,
  type OverlayBannerWidgetData,
} from "./OverlayBannerTypes";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildOverlayBannerBootstrapMarkup(
  data: WidgetData,
  context?: WidgetExportContext
): string {
  const bannerData: OverlayBannerWidgetData = isOverlayBannerWidgetData(data)
    ? data
    : defaultOverlayBannerWidgetData;

  const content = { ...defaultOverlayBannerWidgetData.content, ...(bannerData.content || {}) };
  const style = { ...defaultOverlayBannerWidgetData.style, ...(bannerData.style || {}) };
  const variant = bannerData.variant || "Centered Hero Banner";

  const isLeft = variant === "Left-Aligned Editorial" || style.alignment === "left";
  const isRight = style.alignment === "right";
  const isMinimal = variant === "Minimal Page Header";
  const isParallax = variant === "Parallax Visual Banner" || Boolean(style.fixedBackground);

  const minHeight = isMinimal ? "340px" : (style.minHeight || "560px");
  const paddingY = isMinimal ? "60px" : (style.paddingY || "100px");
  const alignmentClass = isLeft ? "text-start" : isRight ? "text-end" : "text-center";
  const justifyClass = isLeft ? "justify-content-start" : isRight ? "justify-content-end" : "justify-content-center";

  const overlayBg = style.overlayGradient
    ? (style.gradientOverlay || `linear-gradient(180deg, rgba(5,7,13,${Number(style.overlayOpacity ?? 0.6) * 0.7}) 0%, rgba(5,7,13,${style.overlayOpacity ?? 0.6}) 100%)`)
    : (style.overlayColor || "#05070D");
  const overlayOpacity = style.overlayGradient ? 1 : (style.overlayOpacity ?? 0.6);

  const bgAttachment = isParallax ? "fixed" : "scroll";
  const bgImgUrl = content.backgroundImage || defaultOverlayBannerWidgetData.content.backgroundImage || "";

  const sectionId = `overlay-banner-${Math.random().toString(36).substring(2, 9)}`;

  const html = `
<section id="${sectionId}" data-wto-overlay-banner="1" class="builder-overlay-banner wto-overlay-banner position-relative overflow-hidden w-100 d-flex align-items-center" style="min-height: ${minHeight}; padding: ${paddingY} 0; background-image: url('${escapeHtml(bgImgUrl)}'); background-size: cover; background-position: center center; background-repeat: no-repeat; background-attachment: ${bgAttachment}; width: 100% !important; max-width: 100% !important; margin: 0 !important;">
  <!-- Color / Gradient Dark Overlay -->
  <div class="position-absolute top-0 start-0 w-100 h-100" style="background: ${overlayBg}; opacity: ${overlayOpacity}; pointer-events: none; z-index: 1;"></div>

  <!-- Content Container -->
  <div class="container position-relative" style="z-index: 2;">
    <div class="row ${justifyClass}">
      <div class="col-12 col-lg-10 ${alignmentClass}" style="max-width: ${style.contentMaxWidth || "880px"};">
        ${
          content.showBadge && content.badge
            ? `<div class="mb-3">
                <span class="d-inline-flex align-items-center px-3 py-1 rounded-pill fw-semibold text-uppercase" style="font-size: 0.78rem; letter-spacing: 0.08em; color: ${escapeHtml(style.badgeColor || "#FACC15")}; background-color: ${escapeHtml(style.badgeBg || "rgba(250,204,21,0.14)")}; border: 1px solid ${escapeHtml(style.badgeBorder || "rgba(250,204,21,0.3)")};">
                  ${escapeHtml(content.badge)}
                </span>
              </div>`
            : ""
        }

        <h1 class="fw-bold mb-3 display-4 lh-tight" style="color: ${escapeHtml(style.titleColor || "#FFFFFF")}; font-size: ${isMinimal ? "2.3rem" : (style.titleFontSize || "2.85rem")}; letter-spacing: -0.02em;">
          ${escapeHtml(content.title || "")}
        </h1>

        ${
          content.showSubtitle && content.subtitle
            ? `<p class="lead mb-4 mx-auto" style="color: ${escapeHtml(style.subtitleColor || "#D1D5DB")}; font-size: ${isMinimal ? "1.05rem" : (style.subtitleFontSize || "1.2rem")}; max-width: 720px; line-height: 1.65; ${isLeft ? "margin-left: 0 !important;" : ""}">
                ${escapeHtml(content.subtitle)}
              </p>`
            : ""
        }

        ${
          (content.showPrimaryButton && content.primaryButtonText) || (content.showSecondaryButton && content.secondaryButtonText)
            ? `<div class="d-flex flex-wrap gap-3 ${justifyClass} ${isLeft ? "justify-content-start" : ""}">
                ${
                  content.showPrimaryButton && content.primaryButtonText
                    ? `<a href="${escapeHtml(content.primaryButtonUrl || "#")}" class="btn fw-semibold px-4 py-2.5 rounded-pill shadow-sm" style="background-color: ${escapeHtml(style.primaryBtnBg || "#FACC15")}; color: ${escapeHtml(style.primaryBtnColor || "#111827")}; border: none; font-size: 0.95rem; text-decoration: none;">
                        ${escapeHtml(content.primaryButtonText)}
                      </a>`
                    : ""
                }
                ${
                  content.showSecondaryButton && content.secondaryButtonText
                    ? `<a href="${escapeHtml(content.secondaryButtonUrl || "#")}" class="btn fw-semibold px-4 py-2.5 rounded-pill" style="background-color: ${escapeHtml(style.secondaryBtnBg || "rgba(255,255,255,0.12)")}; color: ${escapeHtml(style.secondaryBtnColor || "#FFFFFF")}; border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(8px); font-size: 0.95rem; text-decoration: none;">
                        ${escapeHtml(content.secondaryButtonText)}
                      </a>`
                    : ""
                }
              </div>`
            : ""
        }
      </div>
    </div>
  </div>
</section>
`;

  return html.trim();
}
