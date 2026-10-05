import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import {
  defaultPricingWidgetData,
  isPricingWidgetData,
  type PricingTier,
  type PricingWidgetData,
} from "./PricingTypes";

function escapeHtml(value: string | number | boolean | undefined | null) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeCssIdent(value: string) {
  return String(value || "pricing").replace(/[^a-zA-Z0-9_-]/g, "");
}

function attr(name: string, value: string | undefined, editorMode: boolean) {
  if (!editorMode || !value) return "";
  return ` ${name}="${escapeHtml(value)}"`;
}

export function buildPricingBootstrapMarkup(
  data: WidgetData = defaultPricingWidgetData,
  context?: WidgetExportContext,
): string {
  const editorMode = context?.editorMode === true;
  const pricingData = isPricingWidgetData(data) ? data : defaultPricingWidgetData;
  if (pricingData.advanced?.visibility === false) return "";

  const style = pricingData.style ?? {};
  const content = pricingData.content ?? { tiers: [] };
  const layout = pricingData.layout ?? {};
  const tiers = Array.isArray(content.tiers) ? content.tiers : [];

  const pricingClass = `wto-pricing-${escapeCssIdent(pricingData.id)}`;
  const desktopCols = style.desktopColumns || Math.min(tiers.length, 3) || 3;

  const bg = style.backgroundColor || "#ffffff";
  const cardBg = style.cardBackgroundColor || "#f8fafc";
  const cardRadius = style.cardBorderRadius || "20px";
  const cardBorderColor = style.cardBorderColor || "#e2e8f0";
  const cardBorderWidth = style.cardBorderWidth || "1px";
  const cardPadding = style.cardPadding || "32px 28px";

  const popularBorder = style.popularCardBorderColor || "#facc15";
  const popularBadgeBg = style.popularBadgeBg || "#facc15";
  const popularBadgeColor = style.popularBadgeColor || "#0f172a";

  const headingColor = style.headingColor || "#0f172a";
  const priceColor = style.priceColor || "#0f172a";
  const periodColor = style.periodColor || "#64748b";
  const featureTextColor = style.featureTextColor || "#334155";
  const featureCheckColor = style.featureCheckColor || "#10b981";

  const buttonBg = style.buttonBg || "#0f172a";
  const buttonColor = style.buttonColor || "#ffffff";
  const popularButtonBg = style.popularButtonBg || "#facc15";
  const popularButtonColor = style.popularButtonColor || "#0f172a";

  const padTop = layout.paddingTop || "64px";
  const padBottom = layout.paddingBottom || "64px";
  const padX = layout.paddingX || "24px";

  const isAnnual = content.billingCycle === "annual";

  // Header
  const eyebrowHtml = content.eyebrow
    ? `<div class="wto-pricing-eyebrow"${attr("data-wto-widget-element-key", "eyebrow", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(content.eyebrow)}</div>`
    : "";
  const headingHtml = content.heading
    ? `<h2 class="wto-pricing-heading"${attr("data-wto-widget-element-key", "heading", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(content.heading)}</h2>`
    : "";
  const descHtml = content.description
    ? `<p class="wto-pricing-desc"${attr("data-wto-widget-element-key", "description", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(content.description)}</p>`
    : "";

  const toggleHtml = content.showBillingToggle
    ? `
      <div class="wto-pricing-toggle-wrap">
        <span class="wto-pricing-toggle-label ${!isAnnual ? "is-active" : ""}">Monthly</span>
        <div class="wto-pricing-toggle-pill ${isAnnual ? "is-annual" : ""}">
          <div class="wto-pricing-toggle-handle"></div>
        </div>
        <span class="wto-pricing-toggle-label ${isAnnual ? "is-active" : ""}">
          Annual
          ${content.annualDiscountBadge ? `<span class="wto-pricing-discount-badge">${escapeHtml(content.annualDiscountBadge)}</span>` : ""}
        </span>
      </div>
    `.trim()
    : "";

  const headerBlock =
    eyebrowHtml || headingHtml || descHtml || toggleHtml
      ? `<div class="wto-pricing-header text-center mb-5">
          ${eyebrowHtml}
          ${headingHtml}
          ${descHtml}
          ${toggleHtml}
        </div>`
      : "";

  const renderTier = (tier: PricingTier) => {
    const isPopular = tier.isPopular === true;
    const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;
    const period = isAnnual ? (tier.periodAnnual || "/month") : (tier.periodMonthly || "/month");

    const badgeText = tier.badge || (isPopular ? "MOST POPULAR" : "");
    const badgeHtml = badgeText
      ? `<div class="wto-pricing-card-badge"${attr("data-wto-widget-element-key", `badge-${tier.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(badgeText)}</div>`
      : "";

    const featuresHtml = (tier.features || [])
      .map(
        (f, fIdx) => `
        <li class="wto-pricing-feature-item">
          <i class="fa-solid fa-check wto-pricing-check-icon"></i>
          <span${attr("data-wto-widget-element-key", `feature-${tier.id}-${fIdx}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(f)}</span>
        </li>
      `,
      )
      .join("\n");

    return `
      <div class="wto-pricing-col">
        <div class="wto-pricing-card ${isPopular ? "is-popular" : ""}">
          ${badgeHtml}
          <div class="wto-pricing-card-header">
            <h3 class="wto-pricing-plan-name"${attr("data-wto-widget-element-key", `title-${tier.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(tier.name)}</h3>
            <p class="wto-pricing-plan-desc"${attr("data-wto-widget-element-key", `desc-${tier.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(tier.description)}</p>
          </div>

          <div class="wto-pricing-price-wrap">
            <span class="wto-pricing-price"${attr("data-wto-widget-element-key", `price-${tier.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(price)}</span>
            <span class="wto-pricing-period"${attr("data-wto-widget-element-key", `period-${tier.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(period)}</span>
          </div>

          <div class="wto-pricing-btn-wrap">
            <a href="${escapeHtml(tier.buttonLink || "#contact")}" class="wto-pricing-btn ${isPopular ? "btn-popular" : "btn-standard"}"${attr("data-wto-widget-element-key", `btn-${tier.id}`, editorMode)}${attr("data-wto-widget-element-type", "button", editorMode)}>
              ${escapeHtml(tier.buttonText || "Get Started")}
            </a>
          </div>

          <div class="wto-pricing-divider"></div>

          <ul class="wto-pricing-features-list">
            ${featuresHtml}
          </ul>
        </div>
      </div>
    `.trim();
  };

  const cardsHtml = tiers.map(renderTier).join("\n");

  const css = `
<style>
.${pricingClass} {
  background-color: ${escapeHtml(bg)};
  padding-top: ${escapeHtml(padTop)};
  padding-bottom: ${escapeHtml(padBottom)};
  padding-left: ${escapeHtml(padX)};
  padding-right: ${escapeHtml(padX)};
  box-sizing: border-box;
  font-family: inherit;
  width: 100%;
}
.${pricingClass} .wto-pricing-container {
  max-width: 1240px;
  margin: 0 auto;
}
.${pricingClass} .wto-pricing-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d97706;
  background: rgba(217, 119, 6, 0.1);
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 12px;
}
.${pricingClass} .wto-pricing-heading {
  font-size: 34px;
  font-weight: 800;
  color: ${escapeHtml(headingColor)};
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.${pricingClass} .wto-pricing-desc {
  font-size: 15px;
  color: #64748b;
  max-width: 620px;
  margin: 0 auto 24px;
  line-height: 1.6;
}
.${pricingClass} .wto-pricing-toggle-wrap {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #f1f5f9;
  padding: 6px 16px;
  border-radius: 9999px;
  margin-top: 8px;
}
.${pricingClass} .wto-pricing-toggle-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.${pricingClass} .wto-pricing-toggle-label.is-active {
  color: #0f172a;
}
.${pricingClass} .wto-pricing-discount-badge {
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
  background: #facc15;
  padding: 2px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
}
.${pricingClass} .wto-pricing-toggle-pill {
  width: 44px;
  height: 24px;
  background: #cbd5e1;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
}
.${pricingClass} .wto-pricing-toggle-pill.is-annual {
  background: #0f172a;
}
.${pricingClass} .wto-pricing-toggle-handle {
  width: 18px;
  height: 18px;
  background: #ffffff;
  border-radius: 9999px;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
.${pricingClass} .wto-pricing-toggle-pill.is-annual .wto-pricing-toggle-handle {
  transform: translateX(20px);
}
.${pricingClass} .wto-pricing-grid {
  display: grid;
  grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr));
  gap: 28px;
  align-items: stretch;
}
@media (max-width: 991px) {
  .${pricingClass} .wto-pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .${pricingClass} .wto-pricing-grid {
    grid-template-columns: 1fr;
  }
}
.${pricingClass} .wto-pricing-card {
  position: relative;
  background: ${escapeHtml(cardBg)};
  border: ${escapeHtml(cardBorderWidth)} solid ${escapeHtml(cardBorderColor)};
  border-radius: ${escapeHtml(cardRadius)};
  padding: ${escapeHtml(cardPadding)};
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.${pricingClass} .wto-pricing-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(15,23,42,0.08);
}
.${pricingClass} .wto-pricing-card.is-popular {
  border: 2px solid ${escapeHtml(popularBorder)};
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(250,204,21,0.15);
}
.${pricingClass} .wto-pricing-card-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: ${escapeHtml(popularBadgeBg)};
  color: ${escapeHtml(popularBadgeColor)};
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 14px;
  border-radius: 9999px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  white-space: nowrap;
}
.${pricingClass} .wto-pricing-card-header {
  margin-bottom: 20px;
}
.${pricingClass} .wto-pricing-plan-name {
  font-size: 20px;
  font-weight: 700;
  color: ${escapeHtml(headingColor)};
  margin: 0 0 6px;
}
.${pricingClass} .wto-pricing-plan-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  min-height: 38px;
}
.${pricingClass} .wto-pricing-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 24px;
}
.${pricingClass} .wto-pricing-price {
  font-size: 42px;
  font-weight: 800;
  color: ${escapeHtml(priceColor)};
  letter-spacing: -0.03em;
  line-height: 1;
}
.${pricingClass} .wto-pricing-period {
  font-size: 13px;
  color: ${escapeHtml(periodColor)};
  font-weight: 500;
}
.${pricingClass} .wto-pricing-btn-wrap {
  margin-bottom: 24px;
}
.${pricingClass} .wto-pricing-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 13px 20px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  box-sizing: border-box;
  transition: all 0.15s ease;
}
.${pricingClass} .wto-pricing-btn.btn-standard {
  background: ${escapeHtml(buttonBg)};
  color: ${escapeHtml(buttonColor)};
}
.${pricingClass} .wto-pricing-btn.btn-standard:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
.${pricingClass} .wto-pricing-btn.btn-popular {
  background: ${escapeHtml(popularButtonBg)};
  color: ${escapeHtml(popularButtonColor)};
  box-shadow: 0 6px 16px rgba(250,204,21,0.3);
}
.${pricingClass} .wto-pricing-btn.btn-popular:hover {
  background: #eab308;
  transform: scale(1.02);
}
.${pricingClass} .wto-pricing-divider {
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 24px;
}
.${pricingClass} .wto-pricing-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.${pricingClass} .wto-pricing-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: ${escapeHtml(featureTextColor)};
  line-height: 1.4;
}
.${pricingClass} .wto-pricing-check-icon {
  color: ${escapeHtml(featureCheckColor)};
  font-size: 13px;
  margin-top: 2px;
  flex-shrink: 0;
}
</style>
  `.trim();

  return `
${css}
<section class="wto-pricing ${pricingClass}" aria-label="Pricing">
  <div class="wto-pricing-container">
    ${headerBlock}
    <div class="wto-pricing-grid">
      ${cardsHtml}
    </div>
  </div>
</section>
  `.trim();
}
