import { BaseWidget } from "../BaseWidget";
import { defaultHeroWidgetData, getHeroChildItems, getVariantBackground, getVariantButtonStyle, getVariantHeadingStyle, getVariantImageStyle, getVariantTextStyle, isHeroWidgetData, normalizeHeroChildItem } from "./HeroTypes";
import type { WidgetData, ContainerChildItem } from "../widgetRegistry";
import { createWidgetInstance, getWidgetBootstrapExport, getWidgetRegistration } from "../widgetRegistry";
import { getResponsiveSpacingCss, resolveHeroLayoutMargin, resolveHeroLayoutPadding } from "../spacing";

function resolveVideoBackground(style: Record<string, unknown>) {
  const videoType = style.videoType || "uploaded";
  const youtubeUrl = String(style.youtubeUrl || "");
  const vimeoUrl = String(style.vimeoUrl || "");
  const videoSrc = String(style.videoSrc || "");
  const autoplay = style.videoAutoplay ?? true;
  const muted = style.videoMuted ?? true;
  const loop = style.videoLoop ?? true;
  const showControls = style.videoShowControls ?? false;
  const poster = String(style.videoPoster || "");

  if (videoType === "youtube" && youtubeUrl) {
    const embedUrl = youtubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");
    return (
      <iframe
        src={embedUrl}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Background video"
      />
    );
  }

  if (videoType === "vimeo" && vimeoUrl) {
    const embedUrl = vimeoUrl.replace("vimeo.com/", "player.vimeo.com/video/");
    return (
      <iframe
        src={`${embedUrl}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${showControls ? 1 : 0}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Background video"
      />
    );
  }

  if (videoSrc) {
    return (
      <video
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={showControls}
        poster={poster || undefined}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src={videoSrc} />
      </video>
    );
  }

  return null;
}

function resolveGradientBackground(style: Record<string, unknown>) {
  const direction = style.gradientDirection || "135deg";
  const start = style.gradientStart || "#0f172a";
  const mid = style.gradientMid || "#1e3a8a";
  const end = style.gradientEnd || "#2563eb";
  const opacity = style.gradientOpacity ?? 1;

  if (style.gradientMid) {
    return {
      background: `linear-gradient(${direction}, ${start} 0%, ${mid} 50%, ${end} 100%)`,
      opacity,
    };
  }

  return {
    background: `linear-gradient(${direction}, ${start}, ${end})`,
    opacity,
  };
}

function resolveOverlay(overlayEnabled: boolean, overlayColor: string, overlayOpacity: number) {
  if (!overlayEnabled) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: overlayColor,
        opacity: overlayOpacity,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

function renderChild(child: ContainerChildItem) {
  const normalized = normalizeHeroChildItem(heroData, child);
  const childData = getContainerChildWidgetData(normalized);
  const Component = (getWidgetRegistration(child.type) as any)?.component;
  if (!Component) return null;
  return <Component key={child.id} data={childData as WidgetData} />;
}

export function Hero({ data }: { data: WidgetData }) {
  const heroData = isHeroWidgetData(data) ? data : defaultHeroWidgetData;
  const variant = heroData.variant ?? "Image Background";
  const style = heroData.style as Record<string, unknown>;
  const layout = heroData.layout as Record<string, unknown>;

  const overlayEnabled = style.overlayEnabled ?? false;
  const overlayColor = String(style.overlayColor || "#000000");
  const overlayOpacity = Number(style.overlayOpacity ?? 0.5);

  const spacingBox = {
    padding: resolveHeroLayoutPadding(layout.padding),
    margin: resolveHeroLayoutMargin(layout.margin),
  };

  const children = getHeroChildItems(heroData);
  const bodyChildren = children.filter(
    (child) => child.type !== "button" && child.type !== "image" && child.id !== "statsCard" && child.id !== "statsValue" && child.id !== "statsMeta" && child.id !== "glowA" && child.id !== "glowB"
  );
  const buttonChildren = children.filter((child) => child.type === "button");
  const imageChildren = children.filter((child) => child.type === "image");
  const glowChildren = children.filter((child) => child.id === "glowA" || child.id === "glowB");
  const statsWrapperChild = children.find((child) => child.id === "statsCard");
  const trustChild = children.find((child) => child.id === "trustText");

  const contentAlignment = layout.align === "center" ? "text-center" : layout.align === "right" ? "text-end" : "text-start";
  const buttonAlignment = layout.align === "center" ? "justify-content-center" : layout.align === "right" ? "justify-content-end" : "justify-content-start";

  const sectionStyle: Record<string, unknown> = {
    width: "100%",
    color: "#e2e8f0",
    padding: spacingBox.padding,
    margin: spacingBox.margin,
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  const variantBackground = getVariantBackground(variant, style);
  Object.assign(sectionStyle, variantBackground);

  if (style.heroHeight && typeof style.heroHeight === "string") {
    sectionStyle.height = style.heroHeight;
  }
  if (style.heroMinHeight && typeof style.heroMinHeight === "string") {
    sectionStyle.minHeight = style.heroMinHeight;
  }
  if (style.verticalAlignment === "center") {
    sectionStyle.display = "flex";
    sectionStyle.alignItems = "center";
  } else if (style.verticalAlignment === "bottom") {
    sectionStyle.display = "flex";
    sectionStyle.alignItems = "flex-end";
  } else if (style.verticalAlignment === "top") {
    sectionStyle.display = "flex";
    sectionStyle.alignItems = "flex-start";
  }

  const isVideoVariant = variant === "Video Background";
  const isImageBgVariant = variant === "Image Background";
  const isCenteredVariant = variant === "Centered";
  const isGradientVariant = variant === "Gradient";
  const isDarkVariant = variant === "Dark";
  const isProductVariant = variant === "Product/SaaS";
  const isPersonalVariant = variant === "Personal/Portfolio";
  const isSplitVariant = variant === "Split Layout";

  const renderCenteredVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div className={`text-center ${style.contentMaxWidth ? `mx-auto` : ""}`} style={style.contentMaxWidth ? { maxWidth: String(style.contentMaxWidth) } : undefined}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <div className={`d-flex justify-content-center gap-3 flex-wrap mt-4`}>
                {buttonChildren.map((child) => renderChild(child))}
              </div>
            ) : null}

            {trustChild ? renderChild(trustChild) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideoVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div className={`text-center`} style={style.contentMaxWidth ? { maxWidth: String(style.contentMaxWidth), marginLeft: "auto", marginRight: "auto" } : undefined}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <div className={`d-flex justify-content-center gap-3 flex-wrap mt-4`}>
                {buttonChildren.map((child) => renderChild(child))}
              </div>
            ) : null}

            {trustChild ? renderChild(trustChild) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGradientVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div className={contentAlignment}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <div className={`d-flex gap-3 flex-wrap ${buttonAlignment} mt-4`}>
                {buttonChildren.map((child) => renderChild(child))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="position-relative">
            {glowChildren.map((child) => renderChild(child))}
            <div className="position-relative" style={{ borderRadius: String(style.imageRadius || "24px"), overflow: "hidden", boxShadow: String(style.imageShadow || "0 40px 100px rgba(0,0,0,0.25)") }}>
              {imageChildren.map((child) => renderChild(child))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImageBackgroundVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-7">
          <div className={contentAlignment}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <>
                <div className={`d-flex gap-3 flex-wrap ${buttonAlignment} hero-cta-group`}>
                  {buttonChildren.map((child) => renderChild(child))}
                </div>
                {trustChild ? renderChild(trustChild) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="hero-image-column position-relative">
            {glowChildren.map((child) => renderChild(child))}
            <div className="hero-image-frame">
              {imageChildren.map((child) => renderChild(child))}
            </div>
            {statsWrapperChild ? renderChild(statsWrapperChild) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDarkVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div className={contentAlignment}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <div className={`d-flex gap-3 flex-wrap ${buttonAlignment} mt-4`}>
                {buttonChildren.map((child) => renderChild(child))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="position-relative">
            {glowChildren.map((child) => renderChild(child))}
            <div className="hero-image-frame position-relative" style={{ borderRadius: String(style.imageRadius || "24px"), overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: String(style.imageShadow || "0 40px 100px rgba(0,0,0,0.5)") }}>
              {imageChildren.map((child) => renderChild(child))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div className={contentAlignment}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <div className={`d-flex gap-3 flex-wrap ${buttonAlignment} mt-4`}>
                {buttonChildren.map((child) => renderChild(child))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="position-relative">
            <div className="hero-image-frame position-relative" style={{ borderRadius: String(style.productImageRadius || "24px"), overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: String(style.productImageShadow || "0 40px 100px rgba(0,0,0,0.12)") }}>
              {imageChildren.map((child) => renderChild(child))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalVariant = () => (
    <div className="container" style={{ position: "relative", zIndex: 2 }}>
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div className={contentAlignment}>
            {bodyChildren.map((child) => renderChild(child))}

            {buttonChildren.length > 0 ? (
              <div className={`d-flex gap-3 flex-wrap ${buttonAlignment} mt-4`}>
                {buttonChildren.map((child) => renderChild(child))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-lg-6">
          <div className={`d-flex justify-content-center ${contentAlignment}`}>
            <div className="position-relative" style={{ borderRadius: String(style.imageRadius || "50%"), overflow: "hidden", border: "4px solid #fff", boxShadow: String(style.imageShadow || "0 20px 60px rgba(0,0,0,0.15)"), maxWidth: String(style.imageWidth || "320px"), width: "100%" }}>
              {imageChildren.map((child) => renderChild(child))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSplitVariant = () => {
    const imagePosition = style.splitImagePosition || layout.imagePosition || "right";
    const reverseClass = imagePosition === "left" ? "flex-row-reverse" : "";
    return (
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className={`row g-0 align-items-stretch overflow-hidden border shadow-lg ${reverseClass}`} style={{ borderRadius: "16px" }}>
          <div className="col-lg-6 d-flex align-items-center" style={{ background: style.backgroundColor || "#ffffff" }}>
            <div className="w-100 p-4 p-md-5">
              <div className={contentAlignment}>
                {bodyChildren.map((child) => renderChild(child))}

                {buttonChildren.length > 0 ? (
                  <div className={`d-flex gap-3 flex-wrap ${buttonAlignment} mt-4`}>
                    {buttonChildren.map((child) => renderChild(child))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="col-lg-6 position-relative">
            <div className="h-100 position-relative" style={{ minHeight: "360px" }}>
              {imageChildren.map((child) => renderChild(child))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseWidget
      data={heroData}
      widgetType="hero"
      title="Hero Widget"
      variantLabel={variant}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
    >
      <section
        className={[
          "builder-hero",
          `builder-hero--${variant.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          isSplitVariant ? "builder-hero--split" : "",
          isCenteredVariant ? "builder-hero--centered" : "",
        ].filter(Boolean).join(" ")}
        data-widget="hero-v2"
        data-hero-id={heroData.advanced.id ?? "hero-widget-v2"}
        style={sectionStyle}
      >
        {(isImageBgVariant || isVideoVariant || isCenteredVariant) && overlayEnabled && resolveOverlay(overlayEnabled, overlayColor, overlayOpacity)}
        {isVideoVariant && resolveVideoBackground(style)}

        {isCenteredVariant && renderCenteredVariant()}
        {isVideoVariant && renderVideoVariant()}
        {isGradientVariant && renderGradientVariant()}
        {isImageBgVariant && !isCenteredVariant && renderImageBackgroundVariant()}
        {isDarkVariant && renderDarkVariant()}
        {isProductVariant && renderProductVariant()}
        {isPersonalVariant && renderPersonalVariant()}
        {isSplitVariant && renderSplitVariant()}

        <style>{`
          .builder-hero {
            width: 100%;
            max-width: none;
            position: relative;
          }

          .builder-hero .container {
            width: 100%;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
          }

          .builder-hero--image-background {
            display: block;
            position: relative;
            overflow: hidden;
            color: #e2e8f0;
            min-height: 560px;
          }

          .builder-hero--video-background {
            display: block;
            position: relative;
            overflow: hidden;
            color: #e2e8f0;
            min-height: 560px;
          }

          .builder-hero--video-background video,
          .builder-hero--video-background iframe {
            object-fit: cover;
          }

          .builder-hero--gradient {
            display: block;
            position: relative;
            overflow: hidden;
            color: #e2e8f0;
          }

          .builder-hero--dark {
            display: block;
            position: relative;
            overflow: hidden;
            color: #e2e8f0;
          }

          .builder-hero--product-saas {
            display: block;
            position: relative;
            overflow: hidden;
            color: #0f172a;
          }

          .builder-hero--personal-portfolio {
            display: block;
            position: relative;
            overflow: hidden;
            color: #0f172a;
          }

          .builder-hero--split {
            display: block;
            position: relative;
            overflow: hidden;
          }

          .builder-hero--centered {
            display: block;
            position: relative;
            overflow: hidden;
            color: #e2e8f0;
          }

          .builder-hero--centered .container {
            position: relative;
            z-index: 2;
          }

          .builder-hero--split .row {
            min-height: 520px;
          }

          .builder-hero--split img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .builder-hero .hero-image-column {
            position: relative;
            min-height: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 2rem;
          }

          .builder-hero .hero-image-frame {
            position: relative;
            overflow: hidden;
            max-width: 540px;
            width: min(520px, 100%);
            height: auto;
            transition: transform 220ms ease;
          }

          .builder-hero .hero-image-frame:hover {
            transform: translateY(-4px);
          }

          .builder-hero .hero-image-inner,
          .builder-hero img {
            width: 100%;
            height: auto;
            min-height: 0;
            min-width: 100%;
            object-fit: cover;
            display: block;
          }

          .builder-hero .hero-stats-card {
            position: absolute;
            top: 1.5rem;
            right: 1rem;
            z-index: 2;
            width: min(240px, 55%);
            padding: 1rem 1.2rem;
            border-radius: 1.5rem;
            background: rgba(15,23,42,0.86);
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(24px);
            box-shadow: 0 40px 100px rgba(15,23,42,0.45);
            color: #f8fafc;
            pointer-events: none;
          }

          .builder-hero .hero-stats-card__label {
            color: #a5b4fc;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #4f46e5;
            margin-bottom: 0.55rem;
          }

          .builder-hero .hero-stats-card__value {
            font-size: 1.8rem;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 0.25rem;
          }

          .builder-hero .hero-stats-card__meta {
            font-size: 0.95rem;
            color: #475569;
          }

          .builder-hero .hero-cta-group {
            margin-top: 2rem;
          }

          .builder-hero .hero-cta-group a {
            min-width: 12rem;
            padding: 0.95rem 1.7rem !important;
            border-radius: 999px !important;
            font-weight: 700 !important;
            transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
          }

          .builder-hero .hero-cta-group a:hover {
            transform: translateY(-2px);
          }

          .builder-hero .hero-cta-group a:first-child {
            background: #2F80ED !important;
            border: 1px solid transparent !important;
            color: #fff !important;
            box-shadow: 0 16px 45px rgba(47,128,237,0.35) !important;
          }

          .builder-hero .hero-cta-group a:last-child {
            background: rgba(255,255,255,0.15) !important;
            border: 1px solid rgba(255,255,255,0.25) !important;
            color: #f8fafc !important;
            backdrop-filter: blur(15px);
          }

          .builder-hero .hero-trust-text {
            margin-top: 1.35rem;
            font-size: 0.95rem;
            letter-spacing: 0.02em;
          }

          @media (max-width: 991px) {
            .builder-hero,
            .builder-hero--image-background,
            .builder-hero--video-background,
            .builder-hero--gradient,
            .builder-hero--dark,
            .builder-hero--product-saas,
            .builder-hero--personal-portfolio,
            .builder-hero--split,
            .builder-hero--centered {
              min-height: auto;
            }

            .builder-hero--split .row {
              flex-direction: column;
            }

            .builder-hero--split img {
              min-height: 360px;
            }

            .builder-hero--product-saas .row,
            .builder-hero--personal-portfolio .row {
              flex-direction: column;
            }

            .builder-hero--product-saas .hero-image-frame,
            .builder-hero--personal-portfolio .hero-image-frame {
              max-width: 100%;
              margin-top: 2rem;
            }
          }
        `}</style>
      </section>
    </BaseWidget>
  );
}
