import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import {
  defaultTestimonialsWidgetData,
  isTestimonialsWidgetData,
  type TestimonialItem,
  type TestimonialsWidgetData,
} from "./TestimonialsTypes";

function escapeHtml(v: string | number | boolean | undefined | null) {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeCssIdent(v: string) {
  return String(v || "testimonials").replace(/[^a-zA-Z0-9_-]/g, "");
}

function attr(name: string, value: string | undefined, editorMode: boolean) {
  if (!editorMode || !value) return "";
  return ` ${name}="${escapeHtml(value)}"`;
}

function buildStars(rating: number, starColor: string) {
  const clamped = Math.min(5, Math.max(0, Math.round(rating)));
  const filled = "★".repeat(clamped);
  const empty = "☆".repeat(5 - clamped);
  return `<div class="wto-test-stars" style="color:${starColor};font-size:16px;letter-spacing:2px;">${filled}${empty}</div>`;
}

export function buildTestimonialsBootstrapMarkup(
  data: WidgetData = defaultTestimonialsWidgetData,
  context?: WidgetExportContext,
): string {
  const editorMode = context?.editorMode === true;
  const d = isTestimonialsWidgetData(data) ? data : defaultTestimonialsWidgetData;
  if (d.advanced?.visibility === false) return "";

  const st = d.style ?? {};
  const ct = d.content ?? { items: [] };
  const lo = d.layout ?? {};
  const items = Array.isArray(ct.items) ? ct.items : [];

  const mode = st.mode || (d.variant?.toLowerCase().includes("carousel") ? "carousel" : "static");
  const isCarousel = mode === "carousel";
  const cls = `wto-test-${escapeCssIdent(d.id)}`;

  const bg = st.backgroundColor || "#0f172a";
  const cardBg = st.cardBackgroundColor || "#1e293b";
  const cardRadius = st.cardBorderRadius || "16px";
  const cardBorderColor = st.cardBorderColor || "#334155";
  const cardBorderWidth = st.cardBorderWidth || "1px";
  const cardPad = st.cardPadding || "28px";
  const cardShadow = st.cardShadow || "0 4px 24px rgba(0,0,0,0.15)";
  const cardGap = st.cardGap || "24px";
  const hoverLift = st.hoverLift || "6px";
  const quoteColor = st.quoteColor || "#cbd5e1";
  const quoteFontSize = st.quoteFontSize || "14px";
  const nameColor = st.nameColor || "#f1f5f9";
  const nameFontSize = st.nameFontSize || "16px";
  const roleColor = st.roleColor || "#64748b";
  const starColor = st.starColor || "#facc15";
  const avatarSize = st.avatarSize || "52px";
  const avatarRadius = st.avatarBorderRadius || "9999px";
  const desktopCols = st.desktopColumns || 3;

  const padTop = lo.paddingTop || "72px";
  const padBottom = lo.paddingBottom || "72px";
  const padX = lo.paddingX || "24px";

  // Header
  const eyebrowHtml = ct.eyebrow
    ? `<div class="wto-test-eyebrow"${attr("data-wto-widget-element-key", "eyebrow", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(ct.eyebrow)}</div>`
    : "";
  const headingHtml = ct.heading
    ? `<h2 class="wto-test-heading"${attr("data-wto-widget-element-key", "heading", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(ct.heading)}</h2>`
    : "";
  const descHtml = ct.description
    ? `<p class="wto-test-desc"${attr("data-wto-widget-element-key", "description", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(ct.description)}</p>`
    : "";

  const headerBlock = eyebrowHtml || headingHtml || descHtml
    ? `<div class="wto-test-header text-center mb-5">${eyebrowHtml}${headingHtml}${descHtml}</div>`
    : "";

  const renderCard = (item: TestimonialItem) => `
    <div class="wto-test-card">
      ${item.rating ? buildStars(item.rating, starColor) : ""}
      <blockquote class="wto-test-quote"${attr("data-wto-widget-element-key", `quote-${item.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>
        "${escapeHtml(item.quote)}"
      </blockquote>
      <div class="wto-test-author">
        <img
          src="${escapeHtml(item.avatar)}"
          alt="${escapeHtml(item.name)}"
          class="wto-test-avatar"
          loading="lazy"
          ${attr("data-wto-widget-element-key", `avatar-${item.id}`, editorMode)}
          ${attr("data-wto-widget-element-type", "image", editorMode)}
        />
        <div class="wto-test-author-info">
          <div class="wto-test-name"${attr("data-wto-widget-element-key", `name-${item.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(item.name)}</div>
          <div class="wto-test-role"${attr("data-wto-widget-element-key", `role-${item.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(item.role)}${item.company ? `, ${escapeHtml(item.company)}` : ""}</div>
        </div>
      </div>
    </div>
  `.trim();

  let contentMarkup = "";
  if (isCarousel) {
    const slides = items.map((item) => `<div class="wto-carousel-slide" data-carousel-slide="1">${renderCard(item)}</div>`).join("\n");
    const dots = items.map((_, i) => `<button type="button" class="wto-carousel-dot${i === 0 ? " is-active" : ""}" data-carousel-dot="${i}" aria-label="Slide ${i + 1}"></button>`).join("");
    contentMarkup = `
      <div class="wto-test-carousel" data-wto-carousel="1" data-autoplay="${st.autoplay ? "1" : "0"}" data-autoplay-delay="${st.autoplayDelay || 5000}" data-loop="${st.loop !== false ? "1" : "0"}">
        <div class="wto-carousel-viewport"><div class="wto-carousel-track" data-carousel-track="1">${slides}</div></div>
        ${st.showArrows !== false ? `<button type="button" class="wto-carousel-arrow wto-carousel-prev" data-carousel-prev="1" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button><button type="button" class="wto-carousel-arrow wto-carousel-next" data-carousel-next="1" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>` : ""}
        ${st.showDots !== false ? `<div class="wto-carousel-dots" data-carousel-dots="1">${dots}</div>` : ""}
      </div>`;
  } else {
    const cols = items.map((item) => `<div class="wto-test-col">${renderCard(item)}</div>`).join("\n");
    contentMarkup = `<div class="wto-test-grid">${cols}</div>`;
  }

  const css = `<style>
.${cls}{background:${escapeHtml(bg)};padding-top:${escapeHtml(padTop)};padding-bottom:${escapeHtml(padBottom)};padding-left:${escapeHtml(padX)};padding-right:${escapeHtml(padX)};box-sizing:border-box;font-family:inherit;width:100%;}
.${cls} .wto-test-container{max-width:1240px;margin:0 auto;}
.${cls} .wto-test-eyebrow{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:${escapeHtml(starColor)};background:rgba(250,204,21,.12);padding:4px 12px;border-radius:9999px;margin-bottom:12px;}
.${cls} .wto-test-heading{font-size:32px;font-weight:800;color:${escapeHtml(nameColor)};letter-spacing:-.02em;margin-bottom:8px;}
.${cls} .wto-test-desc{font-size:15px;color:${escapeHtml(roleColor)};max-width:600px;margin:0 auto;line-height:1.6;}
.${cls} .wto-test-grid{display:grid;grid-template-columns:repeat(${desktopCols},minmax(0,1fr));gap:${escapeHtml(cardGap)};}
@media(max-width:991px){.${cls} .wto-test-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:640px){.${cls} .wto-test-grid{grid-template-columns:1fr;}}
.${cls} .wto-test-card{background:${escapeHtml(cardBg)};border:${escapeHtml(cardBorderWidth)} solid ${escapeHtml(cardBorderColor)};border-radius:${escapeHtml(cardRadius)};padding:${escapeHtml(cardPad)};box-shadow:${escapeHtml(cardShadow)};display:flex;flex-direction:column;gap:20px;height:100%;box-sizing:border-box;transition:transform .2s ease,box-shadow .2s ease;}
.${cls} .wto-test-card:hover{transform:translateY(-${escapeHtml(hoverLift)});box-shadow:0 16px 40px rgba(0,0,0,.25);}
.${cls} .wto-test-stars{margin-bottom:4px;}
.${cls} .wto-test-quote{font-size:${escapeHtml(quoteFontSize)};color:${escapeHtml(quoteColor)};line-height:1.7;margin:0;font-style:italic;flex:1;}
.${cls} .wto-test-author{display:flex;align-items:center;gap:12px;margin-top:auto;padding-top:16px;border-top:1px solid ${escapeHtml(cardBorderColor)};}
.${cls} .wto-test-avatar{width:${escapeHtml(avatarSize)};height:${escapeHtml(avatarSize)};border-radius:${escapeHtml(avatarRadius)};object-fit:cover;flex-shrink:0;border:2px solid ${escapeHtml(cardBorderColor)};}
.${cls} .wto-test-name{font-size:${escapeHtml(nameFontSize)};font-weight:700;color:${escapeHtml(nameColor)};margin-bottom:2px;}
.${cls} .wto-test-role{font-size:12px;color:${escapeHtml(roleColor)};}
/* Carousel */
.${cls} .wto-test-carousel{position:relative;overflow:hidden;padding-bottom:40px;}
.${cls} .wto-carousel-viewport{overflow:hidden;width:100%;}
.${cls} .wto-carousel-track{display:flex;transition:transform .4s ease;}
.${cls} .wto-carousel-slide{flex:0 0 calc(33.333% - 16px);margin-right:24px;box-sizing:border-box;}
@media(max-width:991px){.${cls} .wto-carousel-slide{flex:0 0 calc(50% - 12px);}}
@media(max-width:640px){.${cls} .wto-carousel-slide{flex:0 0 100%;margin-right:0;}}
.${cls} .wto-carousel-arrow{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:9999px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;transition:all .15s ease;}
.${cls} .wto-carousel-arrow:hover{background:${escapeHtml(starColor)};color:#0f172a;border-color:${escapeHtml(starColor)};}
.${cls} .wto-carousel-prev{left:4px;} .${cls} .wto-carousel-next{right:4px;}
.${cls} .wto-carousel-dots{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:24px;}
.${cls} .wto-carousel-dot{width:10px;height:10px;border-radius:9999px;background:rgba(255,255,255,.25);border:none;cursor:pointer;transition:all .2s ease;}
.${cls} .wto-carousel-dot.is-active{width:24px;background:${escapeHtml(starColor)};}
</style>`;

  return `${css}
<section class="wto-testimonials ${cls}" aria-label="Testimonials">
  <div class="wto-test-container">
    ${headerBlock}
    ${contentMarkup}
  </div>
</section>`.trim();
}
