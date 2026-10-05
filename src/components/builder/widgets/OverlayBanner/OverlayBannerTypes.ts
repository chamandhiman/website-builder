import type { WidgetData } from "../widgetRegistry";

export type OverlayBannerVariant =
  | "Centered Hero Banner"
  | "Left-Aligned Editorial"
  | "Minimal Page Header"
  | "Parallax Visual Banner";

export interface OverlayBannerContent extends Record<string, unknown> {
  badge?: string;
  showBadge?: boolean;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  showPrimaryButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  showSecondaryButton?: boolean;
  backgroundImage?: string;
}

export interface OverlayBannerStyle extends Record<string, unknown> {
  overlayColor?: string;
  overlayOpacity?: number;
  overlayGradient?: boolean;
  gradientOverlay?: string;
  alignment?: "center" | "left" | "right";
  minHeight?: string;
  paddingY?: string;
  textColor?: string;
  titleColor?: string;
  titleFontSize?: string;
  subtitleColor?: string;
  subtitleFontSize?: string;
  badgeColor?: string;
  badgeBg?: string;
  badgeBorder?: string;
  primaryBtnBg?: string;
  primaryBtnColor?: string;
  secondaryBtnBg?: string;
  secondaryBtnColor?: string;
  fixedBackground?: boolean;
  contentMaxWidth?: string;
  glassCard?: boolean;
}

export interface OverlayBannerWidgetData extends WidgetData {
  type: "overlay-banner";
  content: OverlayBannerContent;
  style: OverlayBannerStyle;
  variant: OverlayBannerVariant;
}

export const defaultOverlayBannerWidgetData: OverlayBannerWidgetData = {
  id: "overlay-banner-default",
  type: "overlay-banner",
  variant: "Centered Hero Banner",
  content: {
    showBadge: true,
    badge: "Exclusive Architecture & Design",
    title: "Crafting Extraordinary Spaces That Inspire",
    showSubtitle: true,
    subtitle:
      "Explore premier architectural masterworks and signature estates curated for those who value timeless sophistication.",
    showPrimaryButton: true,
    primaryButtonText: "Explore Properties",
    primaryButtonUrl: "#listings",
    showSecondaryButton: true,
    secondaryButtonText: "Book Consultation",
    secondaryButtonUrl: "#contact",
    backgroundImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  },
  style: {
    overlayColor: "#05070D",
    overlayOpacity: 0.6,
    overlayGradient: true,
    gradientOverlay: "linear-gradient(180deg, rgba(5,7,13,0.4) 0%, rgba(5,7,13,0.85) 100%)",
    alignment: "center",
    minHeight: "560px",
    paddingY: "100px",
    textColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    titleFontSize: "46px",
    subtitleColor: "#D1D5DB",
    subtitleFontSize: "18px",
    badgeColor: "#FACC15",
    badgeBg: "rgba(250, 204, 21, 0.12)",
    badgeBorder: "rgba(250, 204, 21, 0.3)",
    primaryBtnBg: "#FACC15",
    primaryBtnColor: "#111827",
    secondaryBtnBg: "rgba(255, 255, 255, 0.12)",
    secondaryBtnColor: "#FFFFFF",
    fixedBackground: false,
    contentMaxWidth: "860px",
    glassCard: false,
  },
  layout: {
    containerMode: "fluid",
    horizontalPadding: "0px",
    maxWidth: "100%",
  },
  responsive: {},
  animation: {},
  advanced: {},
};

export function isOverlayBannerWidgetData(data: unknown): data is OverlayBannerWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as WidgetData).type === "overlay-banner"
  );
}
