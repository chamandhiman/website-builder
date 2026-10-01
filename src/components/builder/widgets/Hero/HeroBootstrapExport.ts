import { createWidgetInstance, getWidgetBootstrapExport, type WidgetData } from "../widgetRegistry";
import { getContainerChildWidgetData, type ContainerChildItem } from "../Container/ContainerTypes";
import { defaultHeroWidgetData, getHeroChildItems, isHeroWidgetData, normalizeHeroChildItem } from "./HeroTypes";
import { getResponsiveSpacingCss, resolveHeroLayoutMargin, resolveHeroLayoutPadding } from "../spacing";

function serializeStyle(style: Record<string, unknown>) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}:${String(value)};`)
    .join("");
}

function getElementType(type: string) {
  if (type === "heading" || type === "text") return "text";
  if (type === "button") return "button";
  if (type === "image") return "image";
  return "container";
}

export function buildHeroBootstrapMarkup(
  data: WidgetData = defaultHeroWidgetData
): string {
  const heroData = isHeroWidgetData(data) ? data : defaultHeroWidgetData;
  const style = heroData.style;
  const layout = {
    ...heroData.layout,
    padding: resolveHeroLayoutPadding(heroData.layout.padding),
    margin: resolveHeroLayoutMargin(heroData.layout.margin),
  };

  const variant =
    heroData.variant === "Split Layout"
      ? "split"
      : heroData.variant === "Centered"
      ? "centered"
      : heroData.variant === "Video Background"
      ? "video"
      : heroData.variant === "Gradient"
      ? "gradient"
      : heroData.variant === "Dark"
      ? "dark"
      : heroData.variant === "Product/SaaS"
      ? "product-saas"
      : heroData.variant === "Personal/Portfolio"
      ? "personal-portfolio"
      : "classic";

  const alignClass =
    layout.align === "center"
      ? "text-center"
      : layout.align === "right"
      ? "text-end"
      : "text-start";

  const buttonAlignClass =
    layout.align === "center"
      ? "justify-content-center"
      : layout.align === "right"
      ? "justify-content-end"
      : "justify-content-start";

  const spacingClass = `wto-hero-space-${String(heroData.id || "hero").replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const spacingCss = getResponsiveSpacingCss(layout as Record<string, unknown>, spacingClass);

  const isImageBg = heroData.variant === "Image Background";
  const isVideoBg = heroData.variant === "Video Background";
  const isCentered = heroData.variant === "Centered";
  const isGradient = heroData.variant === "Gradient";
  const isDark = heroData.variant === "Dark";
  const isProduct = heroData.variant === "Product/SaaS";
  const isPersonal = heroData.variant === "Personal/Portfolio";
  const isSplit = heroData.variant === "Split Layout";

  const heroStyles = [
    `background:${style.backgroundColor ?? "#f8fafc"};`,
    `color:${style.textColor ?? "#0f172a"};`,
    "width:100%;",
    "box-sizing:border-box;",
  ].join("");

  const children = getHeroChildItems(heroData);
  const bodyChildren = children.filter(
    (child) =>
      child.type !== "button" &&
      child.type !== "image" &&
      child.id !== "statsCard" &&
      child.id !== "statsValue" &&
      child.id !== "statsMeta" &&
      child.id !== "glowA" &&
      child.id !== "glowB"
  );
  const buttonChildren = children.filter((child) => child.type === "button");
  const imageChildren = children.filter((child) => child.type === "image");
  const statsWrapperChild = children.find((child) => child.id === "statsCard");
  const statsValueChild = children.find((child) => child.id === "statsValue");
  const statsMetaChild = children.find((child) => child.id === "statsMeta");
  const glowChildren: typeof children = [];
  const trustChild = children.find((child) => child.id === "trustText");

  const getVariantWrapperClass = (child: { id: string; type: string }) => {
    if (child.id === "badge") return "hero-badge-wrapper";
    if (child.id === "heading") return "hero-heading-wrapper";
    if (child.id === "image") return "hero-image-inner";
    if (child.id === "statsValue") return "hero-stats-card__value";
    if (child.id === "statsMeta") return "hero-stats-card__meta";
    return "hero-copy-block";
  };

  const renderChildHtml = (child: {
    id: string;
    type: string;
    data?: Record<string, unknown>;
  }): string => {
    const normalizedChild = normalizeHeroChildItem(heroData, child as ContainerChildItem);
    const childData = getContainerChildWidgetData(normalizedChild);

    if (child.id === "statsCard") {
      return `
        <div
          data-wto-parent-widget-id="${heroData.id}"
          data-wto-child-id="${child.id}"
          data-wto-widget-element-key="${child.id}"
          data-wto-widget-element-type="container"
          class="hero-stats-card"
          style="${serializeStyle(childData.style)}"
        >
          ${statsValueChild ? renderChildHtml(statsValueChild) : ""}
          ${statsMetaChild ? renderChildHtml(statsMetaChild) : ""}
        </div>
      `;
    }

    const childInstance = createWidgetInstance(child.type, {
      content: childData.content,
      style: childData.style,
      layout: childData.layout,
      responsive: childData.responsive,
      animation: childData.animation,
      advanced: childData.advanced,
      variant: childData.variant,
    } as Partial<WidgetData>);

    const childHtml = getWidgetBootstrapExport(child.type, childInstance) || "";
    const wrapperClass = getVariantWrapperClass(child);
    const classAttribute = wrapperClass ? ` class="${wrapperClass}"` : "";

    return `
      <div
        data-wto-parent-widget-id="${heroData.id}"
        data-wto-child-id="${child.id}"
        data-wto-widget-element-key="${child.id}"
        data-wto-widget-element-type="${getElementType(child.type)}"
        ${classAttribute}
      >
        ${childHtml}
      </div>
    `;
  };

  const glowHtml = glowChildren.map(renderChildHtml).join("");
  const statsHtml = statsWrapperChild ? renderChildHtml(statsWrapperChild) : "";
  const bodyHtml = bodyChildren.map(renderChildHtml).join("");
  const buttonHtml = buttonChildren.map(renderChildHtml).join("");
  const imageHtml = imageChildren.map(renderChildHtml).join("");
  const buttonsMarkup = buttonHtml
    ? `
      <div class="d-flex gap-3 flex-wrap ${buttonAlignClass}">
        ${buttonHtml}
      </div>
    `
    : "";

  const overlayEnabled = (style as any).overlayEnabled ?? false;
  const overlayColor = (style as any).overlayColor ?? "#000000";
  const overlayOpacity = (style as any).overlayOpacity ?? 0.5;
  const overlayHtml =
    (isImageBg || isVideoBg || isCentered) && overlayEnabled
      ? `<div style="position:absolute;inset:0;background:${overlayColor};opacity:${overlayOpacity};z-index:1;pointer-events:none;"></div>`
      : "";

  const videoHtml =
    isVideoBg && ((style as any).videoSrc || (style as any).youtubeUrl || (style as any).vimeoUrl)
      ? (() => {
          const videoType = (style as any).videoType || "uploaded";
          if (videoType === "youtube") {
            const youtubeUrl = String((style as any).youtubeUrl || "");
            const embedUrl = youtubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");
            return `<iframe src="${embedUrl}" style="position:absolute;inset:0;width:100%;height:100%;border:none;object-fit:cover;z-index:0;pointer-events:none;" allow="autoplay; encrypted-media" allowfullscreen title="Background video"></iframe>`;
          }
          if (videoType === "vimeo") {
            const vimeoUrl = String((style as any).vimeoUrl || "");
            const embedUrl = vimeoUrl.replace("vimeo.com/", "player.vimeo.com/video/");
            const autoplay = (style as any).videoAutoplay ?? true;
            const muted = (style as any).videoMuted ?? true;
            const loop = (style as any).videoLoop ?? true;
            const controls = (style as any).videoShowControls ?? false;
            return `<iframe src="${embedUrl}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}" style="position:absolute;inset:0;width:100%;height:100%;border:none;object-fit:cover;z-index:0;pointer-events:none;" allow="autoplay; fullscreen" allowfullscreen title="Background video"></iframe>`;
          }
          const videoSrc = String((style as any).videoSrc || "");
          return `<video autoplay=${(style as any).videoAutoplay ?? true} muted=${(style as any).videoMuted ?? true} loop=${(style as any).videoLoop ?? true} controls=${(style as any).videoShowControls ?? false} poster="${(style as any).videoPoster || ""}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;"><source src="${videoSrc}" /></video>`;
        })()
      : "";

  const bgImageStyle =
    (isImageBg || isCentered) && (style as any).backgroundImage
      ? `background-image:url(${(style as any).backgroundImage});background-size:${(style as any).backgroundSize || "cover"};background-position:${(style as any).backgroundPosition || "center"};background-repeat:${(style as any).backgroundRepeat || "no-repeat"};`
      : "";

  const gradientStyle =
    isGradient
      ? (() => {
          const direction = (style as any).gradientDirection || "135deg";
          const start = (style as any).gradientStart || "#0f172a";
          const mid = (style as any).gradientMid;
          const end = (style as any).gradientEnd || "#2563eb";
          const opacity = (style as any).gradientOpacity ?? 1;
          const gradientValue = mid
            ? `linear-gradient(${direction}, ${start} 0%, ${mid} 50%, ${end} 100%)`
            : `linear-gradient(${direction}, ${start}, ${end})`;
          return `background:${gradientValue};opacity:${opacity};`;
        })()
      : "";

  const contentMaxWidthStyle =
    (isCentered || isVideoBg) && (style as any).contentMaxWidth
      ? `max-width:${(style as any).contentMaxWidth};margin-left:auto;margin-right:auto;`
      : "";

  const verticalAlignStyle =
    (isCentered || isVideoBg) && (style as any).verticalAlignment && (style as any).verticalAlignment !== "center"
      ? `align-items:${(style as any).verticalAlignment};`
      : "";

  const sectionHeightStyle =
    (style as any).heroMinHeight
      ? `min-height:${(style as any).heroMinHeight};`
      : "";

  const variantSectionClass = `builder-hero builder-hero--${heroData.variant.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  if (variant === "centered") {
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${bgImageStyle}${gradientStyle}${sectionHeightStyle}"
>
  ${overlayHtml}
  ${videoHtml}
  <div class="container" style="position:relative;z-index:2;">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-xl-8">
        <div class="text-center" style="${contentMaxWidthStyle}${verticalAlignStyle}">
          ${bodyHtml}
          ${buttonsMarkup}
          ${trustChild ? renderChildHtml(trustChild) : ""}
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  if (variant === "video") {
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${sectionHeightStyle}"
>
  ${videoHtml}
  ${overlayHtml}
  <div class="container" style="position:relative;z-index:2;">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-xl-8">
        <div class="text-center" style="${contentMaxWidthStyle}${verticalAlignStyle}">
          ${bodyHtml}
          ${buttonsMarkup}
          ${trustChild ? renderChildHtml(trustChild) : ""}
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  if (variant === "gradient") {
    const imageRadius = (style as any).imageRadius || "24px";
    const imageShadow = (style as any).imageShadow || "0 40px 100px rgba(0,0,0,0.25)";
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${gradientStyle}${sectionHeightStyle}"
>
  <div class="container" style="position:relative;z-index:2;">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <div class="${alignClass}">
          ${bodyHtml}
          ${buttonsMarkup}
        </div>
      </div>

      <div class="col-lg-6">
        <div class="position-relative">
          ${glowHtml}
          <div class="position-relative" style="border-radius:${imageRadius};overflow:hidden;box-shadow:${imageShadow};">
            ${imageHtml}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  if (variant === "dark") {
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${sectionHeightStyle}"
>
  <div class="container" style="position:relative;z-index:2;">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <div class="${alignClass}">
          ${bodyHtml}
          ${buttonsMarkup}
        </div>
      </div>

      <div class="col-lg-6">
        <div class="position-relative">
          ${glowHtml}
          <div class="position-relative" style="border-radius:${(style as any).imageRadius || "24px"};overflow:hidden;border:1px solid rgba(255,255,255,0.1);box-shadow:${(style as any).imageShadow || "0 40px 100px rgba(0,0,0,0.5)"};">
            ${imageHtml}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  if (variant === "product-saas") {
    const productImageRadius = (style as any).productImageRadius || "24px";
    const productImageShadow = (style as any).productImageShadow || "0 40px 100px rgba(0,0,0,0.12)";
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${sectionHeightStyle}"
>
  <div class="container" style="position:relative;z-index:2;">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <div class="${alignClass}">
          ${bodyHtml}
          ${buttonsMarkup}
        </div>
      </div>

      <div class="col-lg-6">
        <div class="position-relative">
          <div class="position-relative" style="border-radius:${productImageRadius};overflow:hidden;border:1px solid #e2e8f0;box-shadow:${productImageShadow};">
            ${imageHtml}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  if (variant === "personal-portfolio") {
    const imageRadius = (style as any).imageRadius || "50%";
    const imageWidth = (style as any).imageWidth || "320px";
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${sectionHeightStyle}"
>
  <div class="container" style="position:relative;z-index:2;">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <div class="${alignClass}">
          ${bodyHtml}
          ${buttonsMarkup}
        </div>
      </div>

      <div class="col-lg-6">
        <div class="d-flex justify-content-center ${alignClass}">
          <div class="position-relative" style="border-radius:${imageRadius};overflow:hidden;border:4px solid #fff;box-shadow:0 20px 60px rgba(0,0,0,0.15);max-width:${imageWidth};width:100%;">
            ${imageHtml}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  if (variant === "split") {
    const imagePosition = (style as any).splitImagePosition || (layout as any).imagePosition || "right";
    const reverseClass = imagePosition === "left" ? "flex-row-reverse" : "";
    return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}"
>
  <div class="container" style="position:relative;z-index:2;">
    <div class="row g-0 align-items-stretch overflow-hidden border shadow-lg ${reverseClass}" style="border-radius:16px;">
      <div class="col-lg-6 d-flex align-items-center" style="background:${(style as any).backgroundColor || "#ffffff"};">
        <div class="w-100 p-4 p-md-5">
          <div class="${alignClass}">
            ${bodyHtml}
            ${buttonsMarkup}
          </div>
        </div>
      </div>

      <div class="col-lg-6 position-relative">
        <div class="h-100 position-relative" style="min-height:360px;">
          ${imageHtml}
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  const overlayEnabledClassic = (style as any).overlayEnabled ?? false;
  const overlayColorClassic = (style as any).overlayColor ?? "#000000";
  const overlayOpacityClassic = (style as any).overlayOpacity ?? 0.5;
  const overlayHtmlClassic =
    isImageBg && overlayEnabledClassic
      ? `<div style="position:absolute;inset:0;background:${overlayColorClassic};opacity:${overlayOpacityClassic};z-index:1;pointer-events:none;"></div>`
      : "";

  const bgImageStyleClassic =
    isImageBg && (style as any).backgroundImage
      ? `background-image:url(${(style as any).backgroundImage});background-size:${(style as any).backgroundSize || "cover"};background-position:${(style as any).backgroundPosition || "center"};background-repeat:no-repeat;`
      : "";

  return `
${spacingCss ? `<style>${spacingCss}</style>` : ""}
<section
  class="${variantSectionClass} ${spacingClass}"
  style="${heroStyles}${bgImageStyleClassic}"
>
  ${overlayHtmlClassic}
  ${isVideoBg && (style as any).videoSrc ? `<video autoplay=${(style as any).videoAutoplay ?? true} muted=${(style as any).videoMuted ?? true} loop=${(style as any).videoLoop ?? true} controls=${(style as any).videoShowControls ?? false} poster="${(style as any).videoPoster || ""}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;"><source src="${(style as any).videoSrc}" /></video>` : ""}
  <div class="container">
    <div class="row align-items-center g-5 ${isProduct || isPersonal ? "flex-row-reverse" : ""}">
      <div class="col-lg-7 ${isDark || isProduct || isPersonal ? "col-lg-6" : ""}">
        <div class="${alignClass}">
          ${bodyHtml}
          ${buttonHtml ? (trustChild ? renderChildHtml(trustChild) : "") : ""}
        </div>
      </div>

      <div class="col-lg-5 ${isDark || isProduct || isPersonal ? "col-lg-6" : ""}">
        <div class="hero-image-column position-relative">
          ${glowHtml}
          <div class="hero-image-frame">
            ${imageHtml}
          </div>
          ${statsHtml}
        </div>
      </div>
    </div>
  </div>
</section>
`;
}
