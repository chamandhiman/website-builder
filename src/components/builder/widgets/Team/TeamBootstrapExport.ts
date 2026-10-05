import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import { getAssetValue, type BuilderAssetEntry } from "@/lib/builder/image-storage";
import {
  defaultTeamWidgetData,
  isTeamWidgetData,
  type TeamMember,
  type TeamWidgetData,
} from "./TeamTypes";

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
  return String(value || "team").replace(/[^a-zA-Z0-9_-]/g, "");
}

function attr(name: string, value: string | undefined, editorMode: boolean) {
  if (!editorMode || !value) return "";
  return ` ${name}="${escapeHtml(value)}"`;
}

function resolvePhotoSrc(photo: string | BuilderAssetEntry): string {
  if (typeof photo === "object" && photo !== null && "src" in photo) {
    return String(getAssetValue(photo) ?? "");
  }
  return String(photo || "");
}

export function buildTeamBootstrapMarkup(
  data: WidgetData = defaultTeamWidgetData,
  context?: WidgetExportContext,
): string {
  const editorMode = context?.editorMode === true;
  const teamData = isTeamWidgetData(data) ? data : defaultTeamWidgetData;
  if (teamData.advanced?.visibility === false) return "";

  const style = teamData.style ?? {};
  const content = teamData.content ?? { members: [] };
  const layout = teamData.layout ?? {};
  const members = Array.isArray(content.members) ? content.members : [];

  const mode = style.mode || (teamData.variant?.toLowerCase().includes("carousel") ? "carousel" : "static");
  const isCarousel = mode === "carousel";

  const teamClass = `wto-team-${escapeCssIdent(teamData.id)}`;
  const desktopCols = style.desktopColumns || 4;
  const tabletCols = style.tabletColumns || 2;
  const mobileCols = style.mobileColumns || 1;

  const bg = style.backgroundColor || "#ffffff";
  const cardBg = style.cardBackgroundColor || "#f8fafc";
  const cardRadius = style.cardBorderRadius || "16px";
  const cardBorderColor = style.cardBorderColor || "#e2e8f0";
  const cardBorderWidth = style.cardBorderWidth || "1px";
  const cardPadding = style.cardPadding || "20px";
  const cardShadow = style.cardShadow || "0 4px 20px rgba(0,0,0,0.04)";
  const cardGap = style.cardGap || "24px";
  const hoverLift = style.hoverLift || "6px";
  const photoHeight = style.photoHeight || "260px";
  const photoRadius = style.photoBorderRadius || "12px";

  const nameColor = style.nameColor || "#0f172a";
  const nameFontSize = style.nameFontSize || "18px";
  const roleColor = style.roleColor || "#d97706";
  const roleFontSize = style.roleFontSize || "13px";
  const bioColor = style.bioColor || "#64748b";
  const socialColor = style.socialIconColor || "#94a3b8";

  const padTop = layout.paddingTop || "64px";
  const padBottom = layout.paddingBottom || "64px";
  const padX = layout.paddingX || "24px";

  // Header markup
  const eyebrowHtml = content.eyebrow
    ? `<div class="wto-team-eyebrow"${attr("data-wto-widget-element-key", "eyebrow", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(content.eyebrow)}</div>`
    : "";
  const headingHtml = content.heading
    ? `<h2 class="wto-team-heading"${attr("data-wto-widget-element-key", "heading", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(content.heading)}</h2>`
    : "";
  const descHtml = content.description
    ? `<p class="wto-team-desc"${attr("data-wto-widget-element-key", "description", editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(content.description)}</p>`
    : "";

  const headerBlock =
    eyebrowHtml || headingHtml || descHtml
      ? `<div class="wto-team-header text-center mb-5">
          ${eyebrowHtml}
          ${headingHtml}
          ${descHtml}
        </div>`
      : "";

  // Members cards markup
  const renderCard = (m: TeamMember) => {
    const photoUrl = escapeHtml(resolvePhotoSrc(m.photo));
    const socialLinks = [];
    if (m.linkedin) {
      socialLinks.push(`<a href="${escapeHtml(m.linkedin)}" target="_blank" rel="noopener" class="wto-team-social-link" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`);
    }
    if (m.twitter) {
      socialLinks.push(`<a href="${escapeHtml(m.twitter)}" target="_blank" rel="noopener" class="wto-team-social-link" title="Twitter"><i class="fa-brands fa-x-twitter"></i></a>`);
    }
    if (m.github) {
      socialLinks.push(`<a href="${escapeHtml(m.github)}" target="_blank" rel="noopener" class="wto-team-social-link" title="GitHub"><i class="fa-brands fa-github"></i></a>`);
    }
    if (m.email) {
      socialLinks.push(`<a href="mailto:${escapeHtml(m.email)}" class="wto-team-social-link" title="Email"><i class="fa-solid fa-envelope"></i></a>`);
    }

    return `
      <div class="wto-team-card">
        <div class="wto-team-photo-wrap"${attr("data-wto-widget-element-key", `photo-${m.id}`, editorMode)}${attr("data-wto-widget-element-type", "image", editorMode)}>
          <img src="${photoUrl}" alt="${escapeHtml(m.alt || m.name)}" class="wto-team-photo" loading="lazy" />
        </div>
        <div class="wto-team-info">
          <h3 class="wto-team-name"${attr("data-wto-widget-element-key", `name-${m.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(m.name)}</h3>
          <div class="wto-team-role"${attr("data-wto-widget-element-key", `role-${m.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(m.role)}</div>
          ${m.bio ? `<p class="wto-team-bio"${attr("data-wto-widget-element-key", `bio-${m.id}`, editorMode)}${attr("data-wto-widget-element-type", "text", editorMode)}>${escapeHtml(m.bio)}</p>` : ""}
          ${socialLinks.length ? `<div class="wto-team-socials">${socialLinks.join("")}</div>` : ""}
        </div>
      </div>
    `.trim();
  };

  let contentMarkup = "";

  if (isCarousel) {
    // Carousel layout
    const slides = members.map((m) => `<div class="wto-carousel-slide" data-carousel-slide="1">${renderCard(m)}</div>`).join("\n");
    const dots = members.map((_, i) => `<button type="button" class="wto-carousel-dot${i === 0 ? " is-active" : ""}" data-carousel-dot="${i}" aria-label="Slide ${i + 1}"></button>`).join("");

    contentMarkup = `
      <div class="wto-team-carousel" data-wto-carousel="1" data-autoplay="${style.autoplay ? "1" : "0"}" data-autoplay-delay="${style.autoplayDelay || 4000}" data-loop="${style.loop !== false ? "1" : "0"}">
        <div class="wto-carousel-viewport">
          <div class="wto-carousel-track" data-carousel-track="1">
            ${slides}
          </div>
        </div>
        ${style.showArrows !== false ? `
          <button type="button" class="wto-carousel-arrow wto-carousel-prev" data-carousel-prev="1" aria-label="Previous">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button type="button" class="wto-carousel-arrow wto-carousel-next" data-carousel-next="1" aria-label="Next">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        ` : ""}
        ${style.showDots !== false ? `<div class="wto-carousel-dots" data-carousel-dots="1">${dots}</div>` : ""}
      </div>
    `.trim();
  } else {
    // Static Grid layout
    const cols = members
      .map(
        (m) => `
      <div class="wto-team-col">
        ${renderCard(m)}
      </div>
    `,
      )
      .join("\n");

    contentMarkup = `<div class="wto-team-grid">${cols}</div>`;
  }

  const css = `
<style>
.${teamClass} {
  background-color: ${escapeHtml(bg)};
  padding-top: ${escapeHtml(padTop)};
  padding-bottom: ${escapeHtml(padBottom)};
  padding-left: ${escapeHtml(padX)};
  padding-right: ${escapeHtml(padX)};
  box-sizing: border-box;
  font-family: inherit;
  width: 100%;
}
.${teamClass} .wto-team-container {
  max-width: 1240px;
  margin: 0 auto;
}
.${teamClass} .wto-team-eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${escapeHtml(roleColor)};
  background: rgba(217, 119, 6, 0.1);
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 12px;
}
.${teamClass} .wto-team-heading {
  font-size: 32px;
  font-weight: 800;
  color: ${escapeHtml(nameColor)};
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.${teamClass} .wto-team-desc {
  font-size: 15px;
  color: ${escapeHtml(bioColor)};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}
.${teamClass} .wto-team-grid {
  display: grid;
  grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr));
  gap: ${escapeHtml(cardGap)};
}
@media (max-width: 991px) {
  .${teamClass} .wto-team-grid {
    grid-template-columns: repeat(${tabletCols}, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .${teamClass} .wto-team-grid {
    grid-template-columns: repeat(${mobileCols}, minmax(0, 1fr));
  }
}
.${teamClass} .wto-team-card {
  background: ${escapeHtml(cardBg)};
  border: ${escapeHtml(cardBorderWidth)} solid ${escapeHtml(cardBorderColor)};
  border-radius: ${escapeHtml(cardRadius)};
  padding: ${escapeHtml(cardPadding)};
  box-shadow: ${escapeHtml(cardShadow)};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.${teamClass} .wto-team-card:hover {
  transform: translateY(-${escapeHtml(hoverLift)});
  box-shadow: 0 16px 32px rgba(0,0,0,0.08);
}
.${teamClass} .wto-team-photo-wrap {
  width: 100%;
  height: ${escapeHtml(photoHeight)};
  overflow: hidden;
  border-radius: ${escapeHtml(photoRadius)};
  background-color: #e2e8f0;
  margin-bottom: 16px;
}
.${teamClass} .wto-team-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.${teamClass} .wto-team-card:hover .wto-team-photo {
  transform: scale(1.04);
}
.${teamClass} .wto-team-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.${teamClass} .wto-team-name {
  font-size: ${escapeHtml(nameFontSize)};
  font-weight: 700;
  color: ${escapeHtml(nameColor)};
  margin: 0 0 4px;
}
.${teamClass} .wto-team-role {
  font-size: ${escapeHtml(roleFontSize)};
  font-weight: 600;
  color: ${escapeHtml(roleColor)};
  margin-bottom: 10px;
}
.${teamClass} .wto-team-bio {
  font-size: 13px;
  color: ${escapeHtml(bioColor)};
  line-height: 1.5;
  margin: 0 0 16px;
  flex: 1;
}
.${teamClass} .wto-team-socials {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid ${escapeHtml(cardBorderColor)};
}
.${teamClass} .wto-team-social-link {
  color: ${escapeHtml(socialColor)};
  font-size: 15px;
  text-decoration: none;
  transition: color 0.15s ease;
}
.${teamClass} .wto-team-social-link:hover {
  color: ${escapeHtml(roleColor)};
}

/* Carousel Styles */
.${teamClass} .wto-team-carousel {
  position: relative;
  overflow: hidden;
  padding: 10px 0 40px;
}
.${teamClass} .wto-carousel-viewport {
  overflow: hidden;
  width: 100%;
}
.${teamClass} .wto-carousel-track {
  display: flex;
  transition: transform 0.4s ease;
}
.${teamClass} .wto-carousel-slide {
  flex: 0 0 calc(33.333% - 16px);
  margin-right: 24px;
  box-sizing: border-box;
}
@media (max-width: 991px) {
  .${teamClass} .wto-carousel-slide {
    flex: 0 0 calc(50% - 12px);
  }
}
@media (max-width: 640px) {
  .${teamClass} .wto-carousel-slide {
    flex: 0 0 100%;
    margin-right: 0;
  }
}
.${teamClass} .wto-carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 10;
  transition: all 0.15s ease;
}
.${teamClass} .wto-carousel-arrow:hover {
  background: #0f172a;
  color: #ffffff;
}
.${teamClass} .wto-carousel-prev { left: 4px; }
.${teamClass} .wto-carousel-next { right: 4px; }
.${teamClass} .wto-carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}
.${teamClass} .wto-carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: #cbd5e1;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.${teamClass} .wto-carousel-dot.is-active {
  width: 24px;
  background: ${escapeHtml(roleColor)};
}
</style>
  `.trim();

  return `
${css}
<section class="wto-team ${teamClass}" aria-label="Team">
  <div class="wto-team-container">
    ${headerBlock}
    ${contentMarkup}
  </div>
</section>
  `.trim();
}
