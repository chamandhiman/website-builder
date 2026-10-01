import type { WidgetData } from "../widgetRegistry";
import { createContainerChildItem, type ContainerChildItem, getContainerChildWidgetData, buildContainerChildData } from "../Container/ContainerTypes";
import { getAssetValue, type BuilderAssetEntry } from "@/lib/builder/image-storage";
import { DEFAULT_HERO_PADDING, DEFAULT_ZERO_SPACING } from "../spacing";

export interface HeroContentGroup extends Record<string, unknown> {
  children?: ContainerChildItem[];
  badge?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  trustText?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  mediaAlt?: string;
  mediaSrc?: BuilderAssetEntry;
  statsVisible?: boolean;
  statsValue?: string;
  statsLabel?: string;
}

export interface HeroStyleGroup extends Record<string, unknown> {
  backgroundType?: "solid" | "gradient" | "image" | "video";
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  headingColor?: string;
  textColor?: string;
  buttonStyle?: "solid" | "outline" | "ghost";
  buttonColor?: string;
  accentColor?: string;
  borderRadius?: string;
  shadow?: string;
  paddingY?: number;
  statsBackgroundColor?: string;
  statsTextColor?: string;
  statsBorderRadius?: string;
  statsPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  statsOffsetTop?: string;
  statsOffsetRight?: string;
  statsOffsetBottom?: string;
  statsOffsetLeft?: string;
  statsWidth?: string;
  glowVisible?: boolean;
  glowColorA?: string;
  glowColorB?: string;
  glowOpacity?: number;
  glowBlur?: string;
  glowSizeA?: string;
  glowSizeB?: string;
  glowPositionATop?: string;
  glowPositionALeft?: string;
  glowPositionBBottom?: string;
  glowPositionBRight?: string;
  overlayEnabled?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  videoSrc?: string;
  videoPoster?: string;
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoShowControls?: boolean;
  videoType?: "uploaded" | "youtube" | "vimeo";
  youtubeUrl?: string;
  vimeoUrl?: string;
  gradientType?: "linear" | "radial";
  gradientDirection?: string;
  gradientStart?: string;
  gradientMid?: string;
  gradientEnd?: string;
  gradientOpacity?: number;
  heroHeight?: string;
  heroMinHeight?: string;
  verticalAlignment?: "top" | "center" | "bottom";
  contentMaxWidth?: string;
  headingFontSize?: string;
  buttonRadius?: string;
  sectionPadding?: string;
  imageFit?: "cover" | "contain" | "fill";
  imageWidth?: string;
  imageRadius?: string;
  imageShadow?: string;
  badgeText?: string;
  roleText?: string;
  introductionText?: string;
  profileImageSrc?: string;
  profileImageShape?: "circle" | "rounded" | "square";
  socialLinks?: string;
  availabilityBadge?: string;
  experienceBadge?: string;
  productImageSrc?: string;
  productImageRadius?: string;
  productImageShadow?: string;
  splitImagePosition?: "left" | "right";
}

export interface HeroLayoutGroup extends Record<string, unknown> {
  align?: "left" | "center" | "right";
  columns?: "split" | "stacked";
  containerWidth?: "narrow" | "standard" | "wide";
  contentWidth?: "narrow" | "standard" | "wide";
  imagePosition?: "right" | "left" | "bottom";
  padding?: unknown;
  margin?: unknown;
}

export interface HeroResponsiveGroup extends Record<string, unknown> {
  mobileStack?: boolean;
  hideImageOnMobile?: boolean;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  mobilePadding?: string;
}

export interface HeroAnimationGroup extends Record<string, unknown> {
  enabled?: boolean;
  type?: "none" | "fade" | "slide-up" | "zoom";
  duration?: number;
  delay?: number;
}

export interface HeroAdvancedGroup extends Record<string, unknown> {
  id?: string;
  className?: string;
  dataAttributes?: Record<string, string>;
  customCss?: string;
  visibility?: boolean;
}

export interface HeroWidgetData extends WidgetData {
  id: string;
  type: string;
  variant: string;
  content: HeroContentGroup;
  style: HeroStyleGroup;
  layout: HeroLayoutGroup;
  responsive: HeroResponsiveGroup;
  animation: HeroAnimationGroup;
  advanced: HeroAdvancedGroup;
}

export function isHeroWidgetData(data: WidgetData): data is HeroWidgetData {
  return data.type === "hero";
}

function resolveImageSource(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value !== null) {
    const assetValue = getAssetValue(value as BuilderAssetEntry);
    if (assetValue) {
      return assetValue;
    }

    const maybe = value as Record<string, unknown>;
    if (typeof maybe.url === "string" && maybe.url.trim()) {
      return maybe.url.trim();
    }
    if (typeof maybe.src === "string" && maybe.src.trim()) {
      return maybe.src.trim();
    }
    if (typeof maybe.value === "string" && maybe.value.trim()) {
      return maybe.value.trim();
    }
  }

  return "";
}

function buildHeroChildItemsFromLegacy(heroData: HeroWidgetData): ContainerChildItem[] {
  const content = heroData.content as HeroContentGroup;
  const style = heroData.style;
  const children: ContainerChildItem[] = [];

  if (content.badge) {
    children.push(
      createContainerChildItem("text", {
        id: "badge",
        data: {
          content: { text: String(content.badge) },
          style: { color: String(style.headingColor ?? style.textColor ?? "#0f172a") },
          advanced: { visibility: true },
        },
      }),
    );
  }

  if (content.heading) {
    children.push(
      createContainerChildItem("heading", {
        id: "heading",
        data: {
          content: { text: String(content.heading) },
          style: { color: String(style.headingColor ?? style.textColor ?? "#0f172a") },
          advanced: { visibility: true },
        },
      }),
    );
  }

  if (content.subheading) {
    children.push(
      createContainerChildItem("text", {
        id: "subheading",
        data: {
          content: { text: String(content.subheading) },
          advanced: { visibility: true },
        },
      }),
    );
  }

  if (content.description) {
    children.push(
      createContainerChildItem("text", {
        id: "description",
        data: {
          content: { text: String(content.description) },
          advanced: { visibility: true },
        },
      }),
    );
  }

  if (content.ctaPrimaryLabel) {
    children.push(
      createContainerChildItem("button", {
        id: "primaryButton",
        data: {
          content: {
            text: String(content.ctaPrimaryLabel),
            url: String(content.ctaPrimaryHref ?? "#"),
          },
          style: { display: "inline" },
          advanced: { visibility: true },
        },
      }),
    );
  }

  if (content.ctaSecondaryLabel) {
    children.push(
      createContainerChildItem("button", {
        id: "secondaryButton",
        data: {
          content: {
            text: String(content.ctaSecondaryLabel),
            url: String(content.ctaSecondaryHref ?? "#"),
          },
          style: { display: "inline" },
          advanced: { visibility: true },
        },
      }),
    );
  }

  children.push(
    createContainerChildItem("text", {
      id: "trustText",
      data: {
        content: { text: String(content.trustText ?? "No coding required • Fully responsive • Export ready") },
        style: { color: String(style.textColor ?? "#94a3b8") },
        advanced: { visibility: true },
      },
    }),
  );

  const imageSrc = resolveImageSource(content.mediaSrc);
  if (imageSrc.trim()) {
    children.push(
      createContainerChildItem("image", {
        id: "image",
        data: {
          content: {
            src: imageSrc,
            alt: String(content.mediaAlt ?? "Hero illustration"),
          },
          advanced: { visibility: true },
        },
      }),
    );
  }

  const hasStatsText = (typeof content.statsValue === "string" && content.statsValue.trim().length > 0) || (typeof content.statsLabel === "string" && content.statsLabel.trim().length > 0);
  if (content.statsVisible || hasStatsText) {
    children.push(
      createContainerChildItem("container", {
        id: "statsCard",
        data: {
          style: {
            top: String(style.statsOffsetTop ?? "1.5rem"),
            right: String(style.statsOffsetRight ?? "1rem"),
            bottom: String(style.statsOffsetBottom ?? ""),
            left: String(style.statsOffsetLeft ?? ""),
            width: String(style.statsWidth ?? "min(240px, 55%)"),
            padding: "1rem 1.2rem",
            borderRadius: String(style.statsBorderRadius ?? "1.5rem"),
            backgroundColor: String(style.statsBackgroundColor ?? "rgba(15,23,42,0.86)"),
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 40px 100px rgba(15,23,42,0.45)",
            color: String(style.statsTextColor ?? "#f8fafc"),
          },
          advanced: { visibility: true },
        },
      }),
    );
    children.push(
      createContainerChildItem("text", {
        id: "statsValue",
        data: {
          content: { text: String(content.statsValue ?? "") },
          style: { fontSize: "32px", fontWeight: "800" },
          advanced: { visibility: true },
        },
      }),
    );
    children.push(
      createContainerChildItem("text", {
        id: "statsMeta",
        data: {
          content: { text: String(content.statsLabel ?? "") },
          style: { color: "#cbd5e1", fontSize: "15px" },
          advanced: { visibility: true },
        },
      }),
    );
  }

  if (style.glowVisible) {
    children.push(
      createContainerChildItem("container", {
        id: "glowA",
        data: {
          style: {
            width: String(style.glowSizeA ?? "260px"),
            height: String(style.glowSizeA ?? "260px"),
            top: String(style.glowPositionATop ?? "-10%"),
            left: String(style.glowPositionALeft ?? "-14%"),
            backgroundColor: String(style.glowColorA ?? "rgba(56,189,248,0.35)"),
            opacity: style.glowOpacity ?? 0.9,
            filter: `blur(${String(style.glowBlur ?? "80px")})`,
            zIndex: 0,
          },
          advanced: { visibility: true },
        },
      }),
    );
    children.push(
      createContainerChildItem("container", {
        id: "glowB",
        data: {
          style: {
            width: String(style.glowSizeB ?? "240px"),
            height: String(style.glowSizeB ?? "240px"),
            bottom: String(style.glowPositionBBottom ?? "-14%"),
            right: String(style.glowPositionBRight ?? "-8%"),
            backgroundColor: String(style.glowColorB ?? "rgba(124,58,237,0.45)"),
            opacity: style.glowOpacity ?? 0.9,
            filter: `blur(${String(style.glowBlur ?? "80px")})`,
            zIndex: 0,
          },
          advanced: { visibility: true },
        },
      }),
    );
  }

  return children;
}

export function getHeroChildItems(heroData: HeroWidgetData): ContainerChildItem[] {
  const children = Array.isArray(heroData.content.children) ? heroData.content.children : [];
  return children.length > 0 ? children : buildHeroChildItemsFromLegacy(heroData);
}

export function getVariantBackground(variant: string, style: Record<string, unknown>) {
  if (variant === "Image Background") {
    if (style.backgroundImage && typeof style.backgroundImage === "string") {
      return {
        backgroundImage: `url(${style.backgroundImage})`,
        backgroundSize: style.backgroundSize || "cover",
        backgroundPosition: style.backgroundPosition || "center",
        backgroundRepeat: style.backgroundRepeat || "no-repeat",
      };
    }
    return {
      background: style.backgroundColor || "#0f172a",
    };
  }

  if (variant === "Video Background") {
    return {
      background: "#0f172a",
    };
  }

  if (variant === "Gradient") {
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

  if (variant === "Dark") {
    return {
      background: style.backgroundColor || "#050505",
    };
  }

  if (variant === "Product/SaaS") {
    return {
      background: style.backgroundColor || "#ffffff",
    };
  }

  if (variant === "Personal/Portfolio") {
    return {
      background: style.backgroundColor || "#f8fafc",
    };
  }

  if (variant === "Split Layout") {
    return {
      background: style.backgroundColor || "#ffffff",
    };
  }

  if (variant === "Centered") {
    if (style.backgroundImage && typeof style.backgroundImage === "string") {
      return {
        backgroundImage: `url(${style.backgroundImage})`,
        backgroundSize: style.backgroundSize || "cover",
        backgroundPosition: style.backgroundPosition || "center",
        backgroundRepeat: style.backgroundRepeat || "no-repeat",
      };
    }
    return {
      background: style.backgroundColor || "#0f172a",
    };
  }

  return {
    background: style.backgroundColor || "#0f172a",
  };
}

export function getVariantHeadingStyle(variant: string, style: Record<string, unknown>) {
  const commonDark = {
    textColor: style.headingColor || "#ffffff",
    fontSize: style.headingFontSize || "48px",
    fontWeight: "800",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  };

  if (variant === "Image Background" || variant === "Video Background" || variant === "Dark" || variant === "Centered") {
    return commonDark;
  }

  if (variant === "Gradient") {
    return {
      textColor: style.headingColor || "#f8fafc",
      fontSize: style.headingFontSize || "48px",
      fontWeight: "800",
      lineHeight: "0.95",
      letterSpacing: "-0.04em",
    };
  }

  if (variant === "Product/SaaS") {
    return {
      textColor: style.headingColor || "#0f172a",
      fontSize: style.headingFontSize || "44px",
      fontWeight: "800",
      lineHeight: "1.1",
      letterSpacing: "-0.02em",
    };
  }

  if (variant === "Personal/Portfolio") {
    return {
      textColor: style.headingColor || "#0f172a",
      fontSize: style.headingFontSize || "48px",
      fontWeight: "800",
      lineHeight: "1.1",
      letterSpacing: "-0.02em",
    };
  }

  if (variant === "Split Layout") {
    return {
      textColor: style.headingColor || "#0f172a",
      fontSize: style.headingFontSize || "48px",
      fontWeight: "800",
      lineHeight: "1.1",
      letterSpacing: "-0.02em",
    };
  }

  return commonDark;
}

export function getVariantTextStyle(variant: string, style: Record<string, unknown>) {
  if (variant === "Image Background" || variant === "Video Background" || variant === "Dark" || variant === "Centered") {
    return {
      textColor: style.textColor || "#cbd5e1",
      fontSize: "16px",
      lineHeight: "1.7",
    };
  }

  if (variant === "Product/SaaS" || variant === "Personal/Portfolio" || variant === "Split Layout") {
    return {
      textColor: style.textColor || "#475569",
      fontSize: "16px",
      lineHeight: "1.7",
    };
  }

  if (variant === "Gradient") {
    return {
      textColor: style.textColor || "#e2e8f0",
      fontSize: "16px",
      lineHeight: "1.7",
    };
  }

  return {
    textColor: style.textColor || "#94a3b8",
    fontSize: "16px",
    lineHeight: "1.85",
  };
}

export function getVariantButtonStyle(variant: string, childId: string, style: Record<string, unknown>) {
  const baseStyle: Record<string, unknown> = {
    borderRadius: style.buttonRadius || "999px",
    shadow: true,
  };

  if (childId === "primaryButton") {
    if (variant === "Image Background" || variant === "Video Background" || variant === "Dark" || variant === "Centered") {
      return {
        ...baseStyle,
        variant: "Solid",
        color: "Custom",
        customColor: style.buttonColor || "#2F80ED",
        fontWeight: "700",
        background: style.buttonColor || "#2F80ED",
      };
    }

    if (variant === "Product/SaaS" || variant === "Personal/Portfolio" || variant === "Split Layout") {
      return {
        ...baseStyle,
        variant: "Solid",
        color: "Custom",
        customColor: style.buttonColor || "#2F80ED",
        fontWeight: "700",
        background: style.buttonColor || "#2F80ED",
      };
    }

    return {
      ...baseStyle,
      variant: "Gradient",
      color: "Custom",
      customColor: style.buttonColor || "#7c3aed",
      fontWeight: "700",
      background: "linear-gradient(90deg, #7c3aed, #ec4899, #f97316)",
    };
  }

  if (childId === "secondaryButton") {
    if (variant === "Image Background" || variant === "Video Background" || variant === "Dark" || variant === "Centered") {
      return {
        ...baseStyle,
        variant: "Outline",
        color: "Custom",
        customColor: "#ffffff",
        borderWidth: "1px",
        backgroundColor: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
      };
    }

    if (variant === "Product/SaaS" || variant === "Personal/Portfolio" || variant === "Split Layout") {
      return {
        ...baseStyle,
        variant: "Outline",
        color: "Custom",
        customColor: style.buttonColor || "#2F80ED",
        borderWidth: "1px",
        backgroundColor: "transparent",
      };
    }

    return {
      ...baseStyle,
      variant: "Outline",
      color: "Custom",
      customColor: "rgba(255,255,255,0.88)",
      borderWidth: "1px",
      backgroundColor: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
    };
  }

  return baseStyle;
}

export function getVariantImageStyle(variant: string, style: Record<string, unknown>) {
  if (variant === "Product/SaaS") {
    return {
      width: "100%",
      height: "auto",
      objectFit: style.imageFit || "cover",
      borderRadius: style.productImageRadius || style.borderRadius || "24px",
      boxShadow: style.productImageShadow || "0 40px 100px rgba(0,0,0,0.12)",
    };
  }

  if (variant === "Personal/Portfolio") {
    const shape = style.profileImageShape || "circle";
    const radiusMap = { circle: "50%", rounded: "24px", square: "16px" };
    return {
      width: style.imageWidth || "100%",
      height: "auto",
      objectFit: style.imageFit || "cover",
      borderRadius: radiusMap[shape as keyof typeof radiusMap] || "50%",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    };
  }

  if (variant === "Split Layout") {
    return {
      width: style.imageWidth || "100%",
      height: "100%",
      objectFit: style.imageFit || "cover",
      borderRadius: style.imageRadius || style.borderRadius || "0px",
      boxShadow: style.imageShadow || "none",
    };
  }

  if (variant === "Gradient") {
    return {
      width: "100%",
      height: "auto",
      objectFit: style.imageFit || "contain",
      borderRadius: style.imageRadius || "24px",
      boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
    };
  }

  return {
    width: "100%",
    height: "auto",
    objectFit: style.imageFit || "cover",
    borderRadius: style.borderRadius || "32px",
  };
}

export function normalizeHeroChildItem(heroData: HeroWidgetData, child: ContainerChildItem): ContainerChildItem {
  const childData = getContainerChildWidgetData(child);
  const variant = heroData.variant ?? "Image Background";

  const injectedChildData = {
    ...childData,
    content: { ...(childData.content ?? {}) },
    style: { ...(childData.style ?? {}) },
    layout: { ...(childData.layout ?? {}) },
    responsive: { ...(childData.responsive ?? {}) },
    animation: { ...(childData.animation ?? {}) },
    advanced: { ...(childData.advanced ?? {}) },
    variant: childData.variant,
  };

  if (child.type === "heading") {
    const headingStyle = getVariantHeadingStyle(variant, heroData.style as Record<string, unknown>);
    injectedChildData.style = {
      ...injectedChildData.style,
      textColor: injectedChildData.style?.textColor ?? headingStyle.textColor,
      fontSize: injectedChildData.style?.fontSize ?? headingStyle.fontSize,
      fontWeight: injectedChildData.style?.fontWeight ?? headingStyle.fontWeight,
      lineHeight: injectedChildData.style?.lineHeight ?? headingStyle.lineHeight,
      letterSpacing: injectedChildData.style?.letterSpacing ?? (headingStyle as any).letterSpacing,
    };
    if ((injectedChildData.style as any)?.gradientStart) {
      injectedChildData.variant = injectedChildData.variant ?? "Gradient";
    }
  }

  if (child.id === "badge") {
    injectedChildData.style = {
      ...injectedChildData.style,
      color: injectedChildData.style?.color ?? "#e0e7ff",
      backgroundColor: injectedChildData.style?.backgroundColor ?? "rgba(124,58,237,0.18)",
      borderRadius: injectedChildData.style?.borderRadius ?? "999px",
      padding: injectedChildData.style?.padding ?? "0.65rem 1rem",
      fontSize: injectedChildData.style?.fontSize ?? "12px",
      fontWeight: injectedChildData.style?.fontWeight ?? "700",
      letterSpacing: injectedChildData.style?.letterSpacing ?? "0.14em",
      textTransform: injectedChildData.style?.textTransform ?? "uppercase",
    };
  }

  if (child.id === "subheading") {
    const textStyle = getVariantTextStyle(variant, heroData.style as Record<string, unknown>);
    injectedChildData.style = {
      ...injectedChildData.style,
      color: injectedChildData.style?.color ?? textStyle.textColor,
      fontSize: injectedChildData.style?.fontSize ?? textStyle.fontSize,
      lineHeight: injectedChildData.style?.lineHeight ?? textStyle.lineHeight,
    };
  }

  if (child.id === "description") {
    const textStyle = getVariantTextStyle(variant, heroData.style as Record<string, unknown>);
    injectedChildData.style = {
      ...injectedChildData.style,
      color: injectedChildData.style?.color ?? textStyle.textColor,
      fontSize: injectedChildData.style?.fontSize ?? textStyle.fontSize,
      lineHeight: injectedChildData.style?.lineHeight ?? textStyle.lineHeight,
    };
  }

  if (child.type === "button") {
    const btnStyle = getVariantButtonStyle(variant, child.id, heroData.style as Record<string, unknown>);
    injectedChildData.style = {
      ...injectedChildData.style,
      borderRadius: injectedChildData.style?.borderRadius ?? btnStyle.borderRadius,
      shadow: injectedChildData.style?.shadow ?? btnStyle.shadow,
    };

    if (child.id === "primaryButton") {
      injectedChildData.variant = injectedChildData.variant ?? btnStyle.variant;
      injectedChildData.content = {
        ...injectedChildData.content,
        text: injectedChildData.content?.text ?? "Get Started Free",
        url: String(injectedChildData.content?.url ?? "#"),
      };
      injectedChildData.style = {
        ...injectedChildData.style,
        variant: injectedChildData.style?.variant ?? btnStyle.variant,
        color: injectedChildData.style?.color ?? btnStyle.color,
        customColor: injectedChildData.style?.customColor ?? btnStyle.customColor,
        fontWeight: injectedChildData.style?.fontWeight ?? btnStyle.fontWeight,
        background: injectedChildData.style?.background ?? btnStyle.background,
      };
    }

    if (child.id === "secondaryButton") {
      injectedChildData.variant = injectedChildData.variant ?? btnStyle.variant;
      injectedChildData.content = {
        ...injectedChildData.content,
        text: injectedChildData.content?.text ?? "Learn more",
        url: String(injectedChildData.content?.url ?? "#"),
      };
      injectedChildData.style = {
        ...injectedChildData.style,
        variant: injectedChildData.style?.variant ?? btnStyle.variant,
        color: injectedChildData.style?.color ?? btnStyle.color,
        customColor: injectedChildData.style?.customColor ?? btnStyle.customColor,
        borderWidth: injectedChildData.style?.borderWidth ?? (btnStyle as any).borderWidth,
        backgroundColor: injectedChildData.style?.backgroundColor ?? (btnStyle as any).backgroundColor,
        backdropFilter: injectedChildData.style?.backdropFilter ?? (btnStyle as any).backdropFilter,
      };
    }
  }

  if (child.type === "image") {
    const imgStyle = getVariantImageStyle(variant, heroData.style as Record<string, unknown>);
    const defaultSrc = variant === "Personal/Portfolio"
      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
      : variant === "Product/SaaS"
        ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
        : "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";
    injectedChildData.content = {
      ...injectedChildData.content,
      src: injectedChildData.content?.src ?? defaultSrc,
      alt: injectedChildData.content?.alt ?? (variant === "Personal/Portfolio" ? "Profile photo" : "Hero illustration"),
    };
    injectedChildData.style = {
      ...injectedChildData.style,
      width: injectedChildData.style?.width ?? imgStyle.width,
      height: injectedChildData.style?.height ?? imgStyle.height,
      objectFit: injectedChildData.style?.objectFit ?? imgStyle.objectFit,
      borderRadius: injectedChildData.style?.borderRadius ?? imgStyle.borderRadius,
      boxShadow: injectedChildData.style?.boxShadow ?? imgStyle.boxShadow,
    };
    injectedChildData.layout = {
      ...injectedChildData.layout,
      alignment: injectedChildData.layout?.alignment ?? "center",
    };
  }

  return {
    ...child,
    data: buildContainerChildData({
      content: injectedChildData.content,
      style: injectedChildData.style,
      layout: injectedChildData.layout,
      responsive: injectedChildData.responsive,
      animation: injectedChildData.animation,
      advanced: injectedChildData.advanced,
      variant: injectedChildData.variant,
    }),
  };
}

const defaultHeroChildren: ContainerChildItem[] = [
  createContainerChildItem("text", {
    id: "badge",
    data: {
      content: { text: "New standard" },
      style: { color: "#0f172a" },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("heading", {
    id: "heading",
    data: {
      content: { text: "Hero Widget V2" },
      style: { color: "#0f172a" },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("text", {
    id: "subheading",
    data: {
      content: { text: "A Bootstrap-first foundation for future widgets." },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("text", {
    id: "description",
    data: {
      content: { text: "Create polished hero sections with the shared property panel foundation." },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("button", {
    id: "primaryButton",
    data: {
      content: { text: "Get started", url: "#" },
      style: { display: "inline" },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("button", {
    id: "secondaryButton",
    data: {
      content: { text: "Learn more", url: "#" },
      style: { display: "inline" },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("image", {
    id: "image",
    data: {
      content: {
        src: {
          sourceType: "stock",
          src: "https://plus.unsplash.com/premium_photo-1723291237759-99f918377002",
          url: "https://plus.unsplash.com/premium_photo-1723291237759-99f918377002",
          filename: "hero-stock-preview.jpg",
          provider: "Builder stock preview",
          attribution: "",
          isPreview: true,
          isWatermarked: true,
        },
        alt: "Hero illustration",
      },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("container", {
    id: "glowA",
    data: {
      style: {
        width: "260px",
        height: "260px",
        top: "-10%",
        left: "-14%",
        backgroundColor: "rgba(56,189,248,0.35)",
        opacity: 0.9,
        filter: "blur(80px)",
        zIndex: 0,
      },
      advanced: { visibility: true },
    },
  }),
  createContainerChildItem("container", {
    id: "glowB",
    data: {
      style: {
        width: "240px",
        height: "240px",
        bottom: "-14%",
        right: "-8%",
        backgroundColor: "rgba(124,58,237,0.45)",
        opacity: 0.9,
        filter: "blur(80px)",
        zIndex: 0,
      },
      advanced: { visibility: true },
    },
  }),
];

export const defaultHeroWidgetData: HeroWidgetData = {
  id: "hero-widget-v2",
  type: "hero",
  variant: "Image Background",
  content: {
    children: defaultHeroChildren,
    statsVisible: false,
  },
  style: {
    backgroundType: "image",
    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    overlayEnabled: true,
    overlayColor: "#000000",
    overlayOpacity: 0.45,
    headingColor: "#ffffff",
    textColor: "#cbd5e1",
    buttonStyle: "solid",
    buttonColor: "#2F80ED",
    accentColor: "#2F80ED",
    borderRadius: "1rem",
    shadow: "sm",
    paddingY: 6,
    statsBackgroundColor: "rgba(15,23,42,0.86)",
    statsTextColor: "#f8fafc",
    statsBorderRadius: "1.5rem",
    statsOffsetTop: "1.5rem",
    statsOffsetRight: "1rem",
    statsWidth: "240px",
    glowVisible: false,
    glowColorA: "rgba(56,189,248,0.35)",
    glowColorB: "rgba(124,58,237,0.45)",
    glowOpacity: 0.9,
    glowBlur: "80px",
    glowSizeA: "260px",
    glowSizeB: "240px",
    glowPositionATop: "-10%",
    glowPositionALeft: "-14%",
    glowPositionBBottom: "-14%",
    glowPositionBRight: "-8%",
  },
  layout: {
    align: "center",
    columns: "stacked",
    containerWidth: "standard",
    contentWidth: "standard",
    imagePosition: "right",
    padding: DEFAULT_HERO_PADDING,
    margin: DEFAULT_ZERO_SPACING,
  },
  responsive: {
    mobileStack: true,
    hideImageOnMobile: false,
    hideOnMobile: false,
    hideOnTablet: false,
    hideOnDesktop: false,
    mobilePadding: "1rem",
  },
  animation: {
    enabled: false,
    type: "none",
    duration: 400,
    delay: 0,
  },
  advanced: {
    id: "hero-widget-v2",
    className: "",
    dataAttributes: {},
    customCss: "",
    visibility: true,
  },
};

export function getVariantDefaultData(variant: string): HeroWidgetData {
  const base = {
    id: `hero-${variant.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2, 8)}`,
    type: "hero",
    variant,
    content: {
      children: [] as ContainerChildItem[],
      statsVisible: false,
    } as HeroContentGroup,
    style: {} as HeroStyleGroup,
    layout: {
      align: "center",
      columns: "stacked",
      containerWidth: "standard",
      contentWidth: "standard",
      imagePosition: "right",
      padding: DEFAULT_HERO_PADDING,
      margin: DEFAULT_ZERO_SPACING,
    } as HeroLayoutGroup,
    responsive: {
      mobileStack: true,
      hideImageOnMobile: false,
      hideOnMobile: false,
      hideOnTablet: false,
      hideOnDesktop: false,
      mobilePadding: "1rem",
    } as HeroResponsiveGroup,
    animation: {
      enabled: false,
      type: "none",
      duration: 400,
      delay: 0,
    } as HeroAnimationGroup,
    advanced: {
      id: `hero-${variant.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      className: "",
      dataAttributes: {},
      customCss: "",
      visibility: true,
    } as HeroAdvancedGroup,
  } as HeroWidgetData;

  switch (variant) {
    case "Image Background": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "New standard" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "Build something remarkable" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "Launch faster with a production-ready hero section." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Easily customize this block from the property panel. Change the background, overlay, and CTAs without touching code." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Get started", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "View case studies", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          backgroundType: "image",
          backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          overlayEnabled: true,
          overlayColor: "#000000",
          overlayOpacity: 0.45,
          headingColor: "#ffffff",
          textColor: "#cbd5e1",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          borderRadius: "1rem",
        },
        layout: {
          ...base.layout,
          align: "center",
        },
      };
    }

    case "Split Layout": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "New collection" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "Designed for modern teams" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "A clean split layout that keeps your message and visual in perfect balance." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Use the property panel to swap the image, adjust spacing, and change alignment." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Get started", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "Learn more", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("image", {
          id: "image",
          data: {
            content: {
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
              alt: "Split layout image",
            },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          backgroundColor: "#ffffff",
          headingColor: "#0f172a",
          textColor: "#475569",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          imageFit: "cover",
          imageWidth: "100%",
          imageRadius: "0px",
          imageShadow: "none",
          splitImagePosition: "right",
        },
        layout: {
          ...base.layout,
          align: "left",
          columns: "split",
          imagePosition: "right",
        },
      };
    }

    case "Centered": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "Coming soon" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "The future of content" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "A centered hero with a full-width background image and no foreground image clutter." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Focus attention on your message with a clean centered layout." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Get started", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "Contact sales", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          backgroundType: "image",
          backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          overlayEnabled: true,
          overlayColor: "#000000",
          overlayOpacity: 0.5,
          headingColor: "#ffffff",
          textColor: "#cbd5e1",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          heroHeight: "100vh",
          heroMinHeight: "560px",
          verticalAlignment: "center",
          contentMaxWidth: "720px",
          headingFontSize: "52px",
          buttonRadius: "999px",
        },
        layout: {
          ...base.layout,
          align: "center",
        },
      };
    }

    case "Video Background": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "Immersive" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "See it in motion" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "A real video background with a customizable overlay and centered content." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Choose YouTube, Vimeo, or upload your own video file." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Start free trial", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "Watch demo", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          videoType: "youtube",
          youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=0",
          overlayEnabled: true,
          overlayColor: "#000000",
          overlayOpacity: 0.55,
          headingColor: "#ffffff",
          textColor: "#cbd5e1",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          videoAutoplay: true,
          videoMuted: true,
          videoLoop: true,
          videoShowControls: false,
          heroHeight: "100vh",
          heroMinHeight: "560px",
          verticalAlignment: "center",
          contentMaxWidth: "720px",
          headingFontSize: "52px",
          buttonRadius: "999px",
        },
        layout: {
          ...base.layout,
          align: "center",
        },
      };
    }

    case "Gradient": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "Analytics" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "Data-driven growth" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "A real gradient background with a foreground product image on the right." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Customize gradient colors, direction, and the right-side illustration from the property panel." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Get started", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "View docs", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("image", {
          id: "image",
          data: {
            content: {
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
              alt: "Analytics dashboard",
            },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          gradientType: "linear",
          gradientDirection: "135deg",
          gradientStart: "#0f172a",
          gradientMid: "#1e3a8a",
          gradientEnd: "#2563eb",
          gradientOpacity: 1,
          headingColor: "#f8fafc",
          textColor: "#e2e8f0",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#60a5fa",
          imageFit: "contain",
          imageRadius: "24px",
          imageShadow: "0 40px 100px rgba(0,0,0,0.25)",
        },
        layout: {
          ...base.layout,
          align: "left",
          columns: "split",
          containerWidth: "wide",
        },
      };
    }

    case "Dark": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "Performance" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "Ship with confidence" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "A deliberate dark visual system with optional glow and accent highlights." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Edit the background color, accent color, and glow settings to match your brand." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Get started", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "View documentation", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("image", {
          id: "image",
          data: {
            content: {
              src: "https://images.unsplash.com/photo-1550751827-4bd374c3a6f6?auto=format&fit=crop&w=1200&q=80",
              alt: "Dark product preview",
            },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          backgroundColor: "#050505",
          headingColor: "#ffffff",
          textColor: "#94a3b8",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          glowVisible: true,
          glowColorA: "rgba(56,189,248,0.35)",
          glowColorB: "rgba(124,58,237,0.45)",
          glowOpacity: 0.9,
          glowBlur: "80px",
          glowSizeA: "260px",
          glowSizeB: "240px",
          glowPositionATop: "-10%",
          glowPositionALeft: "-14%",
          glowPositionBBottom: "-14%",
          glowPositionBRight: "-8%",
          imageFit: "cover",
          imageRadius: "24px",
          imageShadow: "0 40px 100px rgba(0,0,0,0.5)",
        },
        layout: {
          ...base.layout,
          align: "left",
        },
      };
    }

    case "Product/SaaS": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "New release" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "Build better websites" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "without writing code." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "Create polished marketing pages in minutes using the property panel." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "Start building", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "View demo", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("image", {
          id: "image",
          data: {
            content: {
              src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
              alt: "Product dashboard",
            },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          backgroundColor: "#ffffff",
          headingColor: "#0f172a",
          textColor: "#475569",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          productImageRadius: "24px",
          productImageShadow: "0 40px 100px rgba(0,0,0,0.12)",
        },
        layout: {
          ...base.layout,
          align: "left",
        },
      };
    }

    case "Personal/Portfolio": {
      const children: ContainerChildItem[] = [
        createContainerChildItem("text", {
          id: "badge",
          data: {
            content: { text: "Hello, I'm" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("heading", {
          id: "heading",
          data: {
            content: { text: "Alex Morgan" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "subheading",
          data: {
            content: { text: "Product Designer" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("text", {
          id: "description",
          data: {
            content: { text: "I craft clean digital experiences for startups and established brands." },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "primaryButton",
          data: {
            content: { text: "View work", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("button", {
          id: "secondaryButton",
          data: {
            content: { text: "Contact me", url: "#" },
            style: { display: "inline" },
            advanced: { visibility: true },
          },
        }),
        createContainerChildItem("image", {
          id: "image",
          data: {
            content: {
              src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
              alt: "Profile photo",
            },
            advanced: { visibility: true },
          },
        }),
      ];
      return {
        ...base,
        content: { ...base.content, children },
        style: {
          ...base.style,
          backgroundColor: "#f8fafc",
          headingColor: "#0f172a",
          textColor: "#475569",
          buttonStyle: "solid",
          buttonColor: "#2F80ED",
          accentColor: "#2F80ED",
          profileImageShape: "circle",
          imageFit: "cover",
          imageWidth: "320px",
          imageRadius: "50%",
          imageShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
        layout: {
          ...base.layout,
          align: "left",
        },
      };
    }

    default:
      return base;
  }
}
