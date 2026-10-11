import { nanoid } from "nanoid";
import type { WidgetInstanceRecord } from "./widgetService";

export type AnnouncementPopupMode = "bar" | "popup";

export type AnnouncementBarPosition =
  | "top_fixed"
  | "bottom_fixed"
  | "top_flow"
  | "bottom_flow"
  | "fixed_top"
  | "fixed_bottom";

export type PopupTriggerType =
  | "immediate"
  | "delay"
  | "scroll"
  | "exit_intent"
  | "manual";

export type PopupFrequencyType =
  | "always"
  | "session"
  | "daily"
  | "weekly"
  | "monthly"
  | "once";

export interface AnnouncementPopupContent {
  headline: string;
  description: string;
  showBadge?: boolean;
  badgeText?: string;
  icon?: string;
  showCloseButton?: boolean;
}

export interface AnnouncementPopupButtonItem {
  enabled: boolean;
  text: string;
  url: string;
  openInNewTab?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export interface AnnouncementPopupButtons {
  primary?: AnnouncementPopupButtonItem;
  secondary?: AnnouncementPopupButtonItem;
  [key: string]: any;
}

export interface AnnouncementPopupImageConfig {
  enabled?: boolean;
  url?: string;
  alt?: string;
  position?: "left" | "right" | "top" | "none";
  [key: string]: any;
}

export interface AnnouncementBarPositionConfig {
  position: AnnouncementBarPosition | string;
  sticky: boolean;
  contained: boolean;
  maxWidth: number;
  zIndex?: number;
  showReopenButton?: boolean;
  reopenButtonText?: string;
  [key: string]: any;
}

export interface AnnouncementPopupButton {
  show: boolean;
  text: string;
  url: string;
  target: "_blank" | "_self";
  style: "primary" | "secondary" | "outline";
  [key: string]: any;
}

export interface AnnouncementPopupCountdown {
  enabled: boolean;
  timerMode: "date" | "personal";
  targetDate?: string; // YYYY-MM-DD
  targetTime?: string; // HH:MM
  timezone?: string;
  durationValue?: number;
  durationUnit?: "minutes" | "hours" | "days";
  targetTimestamp?: number;
  adminStartTime?: number;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  labelDays?: string;
  labelHours?: string;
  labelMinutes?: string;
  labelSeconds?: string;
  completionMessage?: string;
  [key: string]: any;
}

export interface AnnouncementPopupCoupon {
  enabled: boolean;
  code: string;
  discountText: string;
  copyButtonText: string;
  copiedText: string;
  buttonText?: string;
  [key: string]: any;
}

export interface AnnouncementPopupSchedule {
  enabled: boolean;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timezone?: string;
  [key: string]: any;
}

export interface AnnouncementPopupDisplayRules {
  trigger: "immediate" | "delay" | "scroll" | "exit_intent" | "manual";
  delaySeconds: number;
  scrollPercentage: number;
  frequency: "always" | "session" | "daily" | "weekly" | "monthly" | "once";
  pageTargeting: "all" | "include" | "exclude";
  targetedPaths: string[];
  deviceVisibility: "all" | "desktop_only" | "mobile_only";
  schedule: AnnouncementPopupSchedule;

  triggerDelaySeconds?: number;
  triggerScrollPercent?: number;
  scheduleEnabled?: boolean;
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  dismissPersistence?: boolean;
  [key: string]: any;
}

export interface AnnouncementPopupConfig {
  type: "announcement_popup";
  displayMode: AnnouncementPopupMode;
  template: string;
  
  // Content
  headline: string;
  description: string;
  showBadge: boolean;
  badgeText: string;
  badgeIcon: "fire" | "zap" | "gift" | "bell" | "tag" | "sparkles" | "truck" | "rocket" | "none";
  iconEmoji: string;
  showCloseButton: boolean;
  closeAction: "dismiss" | "hide";
  
  // Buttons
  primaryButton: AnnouncementPopupButton;
  secondaryButton: AnnouncementPopupButton;
  
  // Media
  showImage: boolean;
  imageUrl: string;
  imageAlt: string;
  imagePosition: "left" | "right" | "top" | "none";
  
  // Interactive Add-ons
  countdown: AnnouncementPopupCountdown;
  coupon: AnnouncementPopupCoupon;
  
  // Position & Layout
  barPosition: AnnouncementBarPositionConfig;
  barLayout: "full_width" | "contained";
  sticky: boolean;
  zIndex: number;
  
  // Display Rules & Targeting
  displayRules: AnnouncementPopupDisplayRules;
  
  // Design & Appearance
  colors: {
    background: string;
    textColor: string;
    headingColor: string;
    primaryBtnBg: string;
    primaryBtnText: string;
    secondaryBtnBg: string;
    secondaryBtnText: string;
    borderColor: string;
    overlayColor: string;
    overlayOpacity: number;
    badgeBg: string;
    badgeText: string;
    badgeBackground?: string;
    badgeTextColor?: string;
    linkColor: string;
    [key: string]: any;
  };
  
  typography: {
    fontFamily: string;
    headingSize: number; // px
    bodySize: number; // px
    headingWeight: "600" | "700" | "800" | "900";
    bodyWeight: "400" | "500" | "600";
    textAlign: "left" | "center" | "right";
    lineHeight: number;
    letterSpacing: number; // px
    fontWeight?: string;
    headingItalic?: boolean;
    headingUnderline?: boolean;
    bodyBold?: boolean;
    bodyItalic?: boolean;
    bodyUnderline?: boolean;
    [key: string]: any;
  };
  
  layout: {
    width?: number; // px (for popup or contained bar)
    maxWidth?: number; // px
    barPaddingY?: number; // px
    barPaddingX?: number; // px
    paddingY?: number; // px
    paddingX?: number; // px
    popupPadding?: number; // px
    popupWidth?: number; // px
    popupMaxHeight?: number | string;
    borderRadius?: number; // px
    borderWidth?: number; // px
    shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | string;
    [key: string]: any;
  };
  
  // Nested property compatibility (used by Studio Editor and Runtime)
  content?: AnnouncementPopupContent;
  buttons?: AnnouncementPopupButtons;
  image?: AnnouncementPopupImageConfig;
  position?: any;

  animation: {
    type: "fade" | "slide_down" | "slide_up" | "scale" | "none";
    durationMs: number;
    [key: string]: any;
  };
}

export interface AnnouncementPopupTemplateItem {
  key: string;
  name: string;
  description: string;
  displayMode: AnnouncementPopupMode;
  category: "sales" | "announcement" | "leads" | "seasonal";
  badge: string;
  config: AnnouncementPopupConfig;
}

/**
 * Normalizes any announcement bar or popup config object so that both
 * root-level properties (e.g. cfg.headline) and nested properties (e.g. cfg.content.headline)
 * are guaranteed to exist, preventing runtime undefined errors.
 */
export function normalizeAnnouncementPopupConfig(raw: any): AnnouncementPopupConfig {
  if (!raw) return raw;
  const cfg = { ...raw };

  // Content
  cfg.content = {
    headline: raw.content?.headline ?? raw.headline ?? "Special Offer",
    description: raw.content?.description ?? raw.description ?? "",
    showBadge: raw.content?.showBadge ?? raw.showBadge ?? false,
    badgeText: raw.content?.badgeText ?? raw.badgeText ?? "",
    icon: raw.content?.icon ?? raw.iconEmoji ?? "",
    showCloseButton: raw.content?.showCloseButton ?? raw.showCloseButton ?? true,
    ...(raw.content || {}),
  };

  cfg.headline = cfg.content.headline;
  cfg.description = cfg.content.description;
  cfg.showBadge = cfg.content.showBadge;
  cfg.badgeText = cfg.content.badgeText;
  cfg.iconEmoji = cfg.content.icon;
  cfg.showCloseButton = cfg.content.showCloseButton;

  // Buttons
  cfg.buttons = {
    primary: {
      enabled: raw.buttons?.primary?.enabled ?? raw.primaryButton?.show ?? true,
      text: raw.buttons?.primary?.text ?? raw.primaryButton?.text ?? "Learn More",
      url: raw.buttons?.primary?.url ?? raw.primaryButton?.url ?? "#",
      openInNewTab: raw.buttons?.primary?.openInNewTab ?? (raw.primaryButton?.target === "_blank"),
      backgroundColor: raw.buttons?.primary?.backgroundColor ?? raw.colors?.primaryBtnBg ?? "#ffc21a",
      textColor: raw.buttons?.primary?.textColor ?? raw.colors?.primaryBtnText ?? "#18181b",
      ...(raw.buttons?.primary || {}),
    },
    secondary: {
      enabled: raw.buttons?.secondary?.enabled ?? raw.secondaryButton?.show ?? false,
      text: raw.buttons?.secondary?.text ?? raw.secondaryButton?.text ?? "Dismiss",
      url: raw.buttons?.secondary?.url ?? raw.secondaryButton?.url ?? "#",
      openInNewTab: raw.buttons?.secondary?.openInNewTab ?? (raw.secondaryButton?.target === "_blank"),
      backgroundColor: raw.buttons?.secondary?.backgroundColor ?? raw.colors?.secondaryBtnBg ?? "#27272a",
      textColor: raw.buttons?.secondary?.textColor ?? raw.colors?.secondaryBtnText ?? "#f4f4f5",
      ...(raw.buttons?.secondary || {}),
    },
    ...(raw.buttons || {}),
  };

  cfg.primaryButton = {
    show: cfg.buttons.primary.enabled,
    text: cfg.buttons.primary.text,
    url: cfg.buttons.primary.url,
    target: cfg.buttons.primary.openInNewTab ? "_blank" : "_self",
    style: "primary",
  };

  cfg.secondaryButton = {
    show: cfg.buttons.secondary.enabled,
    text: cfg.buttons.secondary.text,
    url: cfg.buttons.secondary.url,
    target: cfg.buttons.secondary.openInNewTab ? "_blank" : "_self",
    style: "secondary",
  };

  // Image
  cfg.image = {
    enabled: raw.image?.enabled ?? raw.showImage ?? false,
    url: raw.image?.url ?? raw.imageUrl ?? "",
    alt: raw.image?.alt ?? raw.imageAlt ?? "",
    position: raw.image?.position ?? (raw.imagePosition === "none" ? "top" : raw.imagePosition) ?? "top",
    ...(raw.image || {}),
  };
  cfg.showImage = cfg.image.enabled;
  cfg.imageUrl = cfg.image.url;
  cfg.imageAlt = cfg.image.alt;
  cfg.imagePosition = cfg.image.position;

  // Bar Position
  if (typeof raw.barPosition === "string" || !raw.barPosition) {
    const rawPos = typeof raw.barPosition === "string" ? raw.barPosition : "fixed_top";
    const mappedPos =
      rawPos === "top_fixed" ? "fixed_top" :
      rawPos === "bottom_fixed" ? "fixed_bottom" :
      rawPos === "top_flow" ? "flow_top" :
      rawPos === "bottom_flow" ? "flow_bottom" :
      rawPos;
    cfg.barPosition = {
      position: mappedPos as AnnouncementBarPosition,
      sticky: raw.sticky ?? true,
      contained: raw.barLayout === "contained",
      maxWidth: 1200,
      zIndex: raw.zIndex ?? 99999,
      showReopenButton: false,
      reopenButtonText: "Open Bar",
    };
  } else {
    const rawPos = raw.barPosition.position ?? "fixed_top";
    const mappedPos =
      rawPos === "top_fixed" ? "fixed_top" :
      rawPos === "bottom_fixed" ? "fixed_bottom" :
      rawPos === "top_flow" ? "flow_top" :
      rawPos === "bottom_flow" ? "flow_bottom" :
      rawPos;
    cfg.barPosition = {
      position: mappedPos as AnnouncementBarPosition,
      sticky: raw.barPosition.sticky ?? raw.sticky ?? true,
      contained: raw.barPosition.contained ?? (raw.barLayout === "contained"),
      maxWidth: raw.barPosition.maxWidth ?? 1200,
      zIndex: raw.barPosition.zIndex ?? raw.zIndex ?? 99999,
      showReopenButton: raw.barPosition.showReopenButton ?? false,
      reopenButtonText: raw.barPosition.reopenButtonText ?? "Open Bar",
      ...raw.barPosition,
    };
  }

  // Layout
  cfg.layout = {
    width: raw.layout?.width ?? raw.layout?.popupWidth ?? 520,
    maxWidth: raw.layout?.maxWidth ?? 520,
    popupWidth: raw.layout?.popupWidth ?? raw.layout?.width ?? 520,
    popupMaxHeight: raw.layout?.popupMaxHeight ?? 650,
    barPaddingY: raw.layout?.barPaddingY ?? raw.layout?.paddingY ?? 14,
    barPaddingX: raw.layout?.barPaddingX ?? raw.layout?.paddingX ?? 20,
    paddingY: raw.layout?.paddingY ?? raw.layout?.barPaddingY ?? 14,
    paddingX: raw.layout?.paddingX ?? raw.layout?.barPaddingX ?? 20,
    popupPadding: raw.layout?.popupPadding ?? 24,
    borderRadius: raw.layout?.borderRadius ?? 16,
    borderWidth: raw.layout?.borderWidth ?? 1,
    shadow: raw.layout?.shadow ?? "lg",
    ...(raw.layout || {}),
  };

  // Colors
  cfg.colors = {
    background: raw.colors?.background ?? "#18181b",
    textColor: raw.colors?.textColor ?? "#e4e4e7",
    headingColor: raw.colors?.headingColor ?? "#ffffff",
    borderColor: raw.colors?.borderColor ?? "#27272a",
    badgeBackground: raw.colors?.badgeBackground ?? raw.colors?.badgeBg ?? "#ef4444",
    badgeTextColor: raw.colors?.badgeTextColor ?? raw.colors?.badgeText ?? "#ffffff",
    badgeBg: raw.colors?.badgeBg ?? raw.colors?.badgeBackground ?? "#ef4444",
    badgeText: raw.colors?.badgeText ?? raw.colors?.badgeTextColor ?? "#ffffff",
    primaryBtnBg: raw.colors?.primaryBtnBg ?? "#ffc21a",
    primaryBtnText: raw.colors?.primaryBtnText ?? "#18181b",
    secondaryBtnBg: raw.colors?.secondaryBtnBg ?? "#27272a",
    secondaryBtnText: raw.colors?.secondaryBtnText ?? "#f4f4f5",
    overlayColor: raw.colors?.overlayColor ?? "#000000",
    overlayOpacity: raw.colors?.overlayOpacity ?? 0.65,
    linkColor: raw.colors?.linkColor ?? "#ffc21a",
    ...(raw.colors || {}),
  };

  // Typography
  cfg.typography = {
    fontFamily: raw.typography?.fontFamily ?? "Inter, sans-serif",
    headingSize: raw.typography?.headingSize ?? 18,
    bodySize: raw.typography?.bodySize ?? 14,
    headingWeight: raw.typography?.headingWeight ?? "700",
    bodyWeight: raw.typography?.bodyWeight ?? "400",
    textAlign: raw.typography?.textAlign ?? "center",
    lineHeight: raw.typography?.lineHeight ?? 1.4,
    letterSpacing: raw.typography?.letterSpacing ?? 0,
    ...(raw.typography || {}),
  };

  // Countdown
  cfg.countdown = {
    enabled: Boolean(raw.countdown?.enabled),
    timerMode: raw.countdown?.timerMode ?? "personal",
    durationValue: raw.countdown?.durationValue ?? 24,
    durationUnit: raw.countdown?.durationUnit ?? "hours",
    targetTimestamp: raw.countdown?.targetTimestamp ?? Date.now() + 86400000,
    showDays: raw.countdown?.showDays ?? true,
    showHours: raw.countdown?.showHours ?? true,
    showMinutes: raw.countdown?.showMinutes ?? true,
    showSeconds: raw.countdown?.showSeconds ?? true,
    labelDays: raw.countdown?.labelDays ?? "d",
    labelHours: raw.countdown?.labelHours ?? "h",
    labelMinutes: raw.countdown?.labelMinutes ?? "m",
    labelSeconds: raw.countdown?.labelSeconds ?? "s",
    completionMessage: raw.countdown?.completionMessage ?? "Offer has ended",
    ...(raw.countdown || {}),
  };

  // Coupon
  cfg.coupon = {
    enabled: Boolean(raw.coupon?.enabled),
    code: raw.coupon?.code ?? "SAVE20",
    discountText: raw.coupon?.discountText ?? "20% OFF",
    copyButtonText: raw.coupon?.copyButtonText ?? raw.coupon?.buttonText ?? "Copy Code",
    buttonText: raw.coupon?.buttonText ?? raw.coupon?.copyButtonText ?? "Copy Code",
    copiedText: raw.coupon?.copiedText ?? "Copied!",
    ...(raw.coupon || {}),
  };

  // Display Rules
  cfg.displayRules = {
    trigger: raw.displayRules?.trigger ?? "immediate",
    delaySeconds: raw.displayRules?.delaySeconds ?? raw.displayRules?.triggerDelaySeconds ?? 2,
    triggerDelaySeconds: raw.displayRules?.triggerDelaySeconds ?? raw.displayRules?.delaySeconds ?? 2,
    scrollPercentage: raw.displayRules?.scrollPercentage ?? raw.displayRules?.triggerScrollPercent ?? 30,
    triggerScrollPercent: raw.displayRules?.triggerScrollPercent ?? raw.displayRules?.scrollPercentage ?? 30,
    frequency: raw.displayRules?.frequency ?? "always",
    pageTargeting: raw.displayRules?.pageTargeting ?? "all",
    targetedPaths: raw.displayRules?.targetedPaths ?? [],
    deviceVisibility: raw.displayRules?.deviceVisibility ?? "all",
    dismissPersistence: raw.displayRules?.dismissPersistence ?? true,
    schedule: raw.displayRules?.schedule ?? { enabled: false },
    scheduleEnabled: raw.displayRules?.scheduleEnabled ?? raw.displayRules?.schedule?.enabled ?? false,
    scheduleStartTime: raw.displayRules?.scheduleStartTime ?? raw.displayRules?.schedule?.startDate ?? "",
    scheduleEndTime: raw.displayRules?.scheduleEndTime ?? raw.displayRules?.schedule?.endDate ?? "",
    ...(raw.displayRules || {}),
  };

  return cfg;
}

export const DEFAULT_BAR_POSITION: AnnouncementBarPositionConfig = {
  position: "fixed_top",
  sticky: true,
  contained: false,
  maxWidth: 1200,
  zIndex: 9999,
  showReopenButton: false,
  reopenButtonText: "Open Bar",
};

// Default base config
export const DEFAULT_ANNOUNCEMENT_POPUP_CONFIG: AnnouncementPopupConfig = {
  type: "announcement_popup",
  displayMode: "bar",
  template: "sale_bar",
  headline: "Summer Flash Sale! Get 25% Off Storewide",
  description: "Limited time offer. Use coupon code SUMMER25 at checkout.",
  showBadge: true,
  badgeText: "LIMITED TIME",
  badgeIcon: "fire",
  iconEmoji: "🔥",
  showCloseButton: true,
  closeAction: "dismiss",
  primaryButton: {
    show: true,
    text: "Shop the Sale",
    url: "#shop",
    target: "_self",
    style: "primary",
  },
  secondaryButton: {
    show: false,
    text: "Learn More",
    url: "#learn",
    target: "_self",
    style: "secondary",
  },
  showImage: false,
  imageUrl: "",
  imageAlt: "Promotion Banner",
  imagePosition: "none",
  countdown: {
    enabled: false,
    timerMode: "personal",
    durationValue: 24,
    durationUnit: "hours",
  },
  coupon: {
    enabled: false,
    code: "SUMMER25",
    discountText: "25% OFF",
    copyButtonText: "Copy Code",
    copiedText: "Copied!",
  },
  barPosition: { ...DEFAULT_BAR_POSITION },
  barLayout: "full_width",
  sticky: true,
  zIndex: 9999,
  displayRules: {
    trigger: "immediate",
    delaySeconds: 0,
    scrollPercentage: 0,
    frequency: "always",
    pageTargeting: "all",
    targetedPaths: [],
    deviceVisibility: "all",
    schedule: {
      enabled: false,
    },
  },
  colors: {
    background: "#18181b",
    textColor: "#e4e4e7",
    headingColor: "#ffffff",
    primaryBtnBg: "#ffc21a",
    primaryBtnText: "#18181b",
    secondaryBtnBg: "#27272a",
    secondaryBtnText: "#f4f4f5",
    borderColor: "#27272a",
    overlayColor: "#000000",
    overlayOpacity: 0.65,
    badgeBg: "#ef4444",
    badgeText: "#ffffff",
    linkColor: "#ffc21a",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headingSize: 15,
    bodySize: 13,
    headingWeight: "700",
    bodyWeight: "500",
    textAlign: "center",
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  layout: {
    width: 600,
    maxWidth: 1200,
    barPaddingY: 10,
    barPaddingX: 16,
    popupPadding: 28,
    borderRadius: 0,
    borderWidth: 1,
    shadow: "md",
  },
  animation: {
    type: "slide_down",
    durationMs: 300,
  },
};

// ================= 12 READY-MADE ELFSIGHT-STYLE TEMPLATES =================
export const ANNOUNCEMENT_POPUP_TEMPLATES: Record<string, AnnouncementPopupTemplateItem> = {
  // 1. Sale & Discount Bar
  sale_bar: {
    key: "sale_bar",
    name: "Sale & Discount Bar",
    description: "High-contrast promotional notification strip with CTA button and active discount badge.",
    displayMode: "bar",
    category: "sales",
    badge: "Popular",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "bar",
      template: "sale_bar",
      headline: "Summer Sale! Get 25% off selected products.",
      description: "Applies automatically at checkout. Don't miss out!",
      showBadge: true,
      badgeText: "25% OFF",
      badgeIcon: "fire",
      iconEmoji: "🔥",
      barPosition: { ...DEFAULT_BAR_POSITION },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#09090b",
        headingColor: "#ffffff",
        textColor: "#a1a1aa",
        primaryBtnBg: "#facc15",
        primaryBtnText: "#000000",
        badgeBg: "#ef4444",
        badgeText: "#ffffff",
        borderColor: "#27272a",
      },
      primaryButton: {
        show: true,
        text: "Claim Discount",
        url: "#sale",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 2. Free Shipping Bar
  free_shipping_bar: {
    key: "free_shipping_bar",
    name: "Free Shipping Bar",
    description: "Inform visitors about free delivery thresholds to boost average order value.",
    displayMode: "bar",
    category: "sales",
    badge: "E-Commerce",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "bar",
      template: "free_shipping_bar",
      headline: "Free Express Shipping on all orders over $50!",
      description: "Order within the next 4 hours for same-day dispatch.",
      showBadge: true,
      badgeText: "FREE DELIVERY",
      badgeIcon: "truck",
      iconEmoji: "🚚",
      barPosition: { ...DEFAULT_BAR_POSITION },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#064e3b",
        headingColor: "#ffffff",
        textColor: "#a7f3d0",
        primaryBtnBg: "#34d399",
        primaryBtnText: "#064e3b",
        badgeBg: "#059669",
        badgeText: "#ffffff",
        borderColor: "#047857",
      },
      primaryButton: {
        show: true,
        text: "Shop Now",
        url: "#shop",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 3. Limited-Time Offer Bar (with Live Countdown)
  limited_time_bar: {
    key: "limited_time_bar",
    name: "Limited-Time Offer Bar",
    description: "Promotional urgency strip featuring an embedded countdown timer.",
    displayMode: "bar",
    category: "sales",
    badge: "Urgency",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "bar",
      template: "limited_time_bar",
      headline: "Flash Sale Ends Soon — Up to 40% Off!",
      description: "Hurry! Prices go back to regular once timer hits zero.",
      showBadge: true,
      badgeText: "DEAL ENDS IN",
      badgeIcon: "zap",
      iconEmoji: "⚡",
      barPosition: { ...DEFAULT_BAR_POSITION },
      countdown: {
        enabled: true,
        timerMode: "personal",
        durationValue: 12,
        durationUnit: "hours",
        adminStartTime: Date.now(),
        targetTimestamp: Date.now() + 12 * 3600000,
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#1c1917",
        headingColor: "#fafaf9",
        textColor: "#d6d3d1",
        primaryBtnBg: "#ea580c",
        primaryBtnText: "#ffffff",
        badgeBg: "#f97316",
        badgeText: "#ffffff",
        borderColor: "#44403c",
      },
      primaryButton: {
        show: true,
        text: "Grab Deal",
        url: "#deals",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 4. Website Announcement Bar
  website_announcement_bar: {
    key: "website_announcement_bar",
    name: "Website Announcement",
    description: "Keep visitors informed about major updates, service status, or new features.",
    displayMode: "bar",
    category: "announcement",
    badge: "Notice",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "bar",
      template: "website_announcement_bar",
      headline: "We have updated our website and client portal.",
      description: "Enjoy faster navigation, refreshed designs, and new account tools.",
      showBadge: true,
      badgeText: "WHAT'S NEW",
      badgeIcon: "sparkles",
      iconEmoji: "✨",
      barPosition: { ...DEFAULT_BAR_POSITION },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#1e1b4b",
        headingColor: "#ffffff",
        textColor: "#c7d2fe",
        primaryBtnBg: "#6366f1",
        primaryBtnText: "#ffffff",
        badgeBg: "#4f46e5",
        badgeText: "#ffffff",
        borderColor: "#3730a3",
      },
      primaryButton: {
        show: true,
        text: "Explore What's New",
        url: "#updates",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 5. Product Launch Bar
  product_launch_bar: {
    key: "product_launch_bar",
    name: "Product Launch Bar",
    description: "Spotlight a brand new release, flagship product, or version 2.0 release.",
    displayMode: "bar",
    category: "announcement",
    badge: "Launch",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "bar",
      template: "product_launch_bar",
      headline: "Introducing CloudFlow 2.0 — Our Biggest Update Ever",
      description: "Built for speed, real-time collaboration, and next-gen workflows.",
      showBadge: true,
      badgeText: "NEW RELEASE",
      badgeIcon: "rocket",
      iconEmoji: "🚀",
      barPosition: { ...DEFAULT_BAR_POSITION },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#0f172a",
        headingColor: "#f8fafc",
        textColor: "#94a3b8",
        primaryBtnBg: "#38bdf8",
        primaryBtnText: "#0f172a",
        badgeBg: "#0284c7",
        badgeText: "#ffffff",
        borderColor: "#1e293b",
      },
      primaryButton: {
        show: true,
        text: "Try Version 2.0",
        url: "#launch",
        target: "_blank",
        style: "primary",
      },
    },
  },

  // 6. Holiday & Event Bar
  holiday_event_bar: {
    key: "holiday_event_bar",
    name: "Holiday & Event Bar",
    description: "Festive celebration banner for Diwali, New Year, Black Friday, or seasonal events.",
    displayMode: "bar",
    category: "seasonal",
    badge: "Festive",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "bar",
      template: "holiday_event_bar",
      headline: "Festive Season Celebrations — Special Gift With Every Purchase!",
      description: "Enjoy limited holiday packs and exclusive gift wrapping on all orders.",
      showBadge: true,
      badgeText: "FESTIVE SPECIAL",
      badgeIcon: "gift",
      iconEmoji: "🎁",
      barPosition: { ...DEFAULT_BAR_POSITION },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#450a0a",
        headingColor: "#fef2f2",
        textColor: "#fecaca",
        primaryBtnBg: "#fbbf24",
        primaryBtnText: "#450a0a",
        badgeBg: "#dc2626",
        badgeText: "#ffffff",
        borderColor: "#7f1d1d",
      },
      primaryButton: {
        show: true,
        text: "Claim Gift",
        url: "#holiday",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 7. Welcome Popup
  welcome_popup: {
    key: "welcome_popup",
    name: "Welcome Popup",
    description: "Delight first-time visitors with an inviting modal, warm greeting, and welcome CTA.",
    displayMode: "popup",
    category: "announcement",
    badge: "Modal",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "popup",
      template: "welcome_popup",
      headline: "Welcome to Our Community!",
      description: "We are thrilled to have you here. Browse our latest creative tools, handcrafted templates, and helpful tutorials.",
      showBadge: true,
      badgeText: "WELCOME",
      badgeIcon: "sparkles",
      iconEmoji: "👋",
      showImage: true,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Team Welcome",
      imagePosition: "top",
      displayRules: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.displayRules,
        trigger: "delay",
        delaySeconds: 2,
        frequency: "session",
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#18181b",
        headingColor: "#ffffff",
        textColor: "#a1a1aa",
        primaryBtnBg: "#ffc21a",
        primaryBtnText: "#18181b",
        secondaryBtnBg: "#27272a",
        secondaryBtnText: "#e4e4e7",
        borderColor: "#3f3f46",
      },
      layout: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.layout,
        width: 480,
        borderRadius: 20,
        popupPadding: 24,
      },
      primaryButton: {
        show: true,
        text: "Explore Products",
        url: "#catalog",
        target: "_self",
        style: "primary",
      },
      secondaryButton: {
        show: true,
        text: "Take a Quick Tour",
        url: "#tour",
        target: "_self",
        style: "secondary",
      },
    },
  },

  // 8. Discount Popup (with Coupon Code Copy)
  discount_popup: {
    key: "discount_popup",
    name: "Discount Popup",
    description: "Display an exclusive coupon code with single-click clipboard copying to maximize conversions.",
    displayMode: "popup",
    category: "sales",
    badge: "Coupon",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "popup",
      template: "discount_popup",
      headline: "Here is 15% Off Your First Purchase!",
      description: "Use the promo code below during checkout to save instantly on your entire basket.",
      showBadge: true,
      badgeText: "SPECIAL OFFER",
      badgeIcon: "tag",
      iconEmoji: "🏷️",
      coupon: {
        enabled: true,
        code: "WELCOME15",
        discountText: "15% OFF",
        copyButtonText: "Copy Code",
        copiedText: "Code Copied!",
      },
      displayRules: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.displayRules,
        trigger: "delay",
        delaySeconds: 3,
        frequency: "session",
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#09090b",
        headingColor: "#ffffff",
        textColor: "#a1a1aa",
        primaryBtnBg: "#22c55e",
        primaryBtnText: "#000000",
        badgeBg: "#15803d",
        badgeText: "#ffffff",
        borderColor: "#27272a",
      },
      layout: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.layout,
        width: 440,
        borderRadius: 20,
        popupPadding: 28,
      },
      primaryButton: {
        show: true,
        text: "Shop & Apply Code",
        url: "#shop",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 9. Newsletter Promotion Popup
  newsletter_popup: {
    key: "newsletter_popup",
    name: "Newsletter Promotion",
    description: "Promote email subscription with perks, insider deals, and configurable sign-up link.",
    displayMode: "popup",
    category: "leads",
    badge: "Newsletter",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "popup",
      template: "newsletter_popup",
      headline: "Join Our VIP Newsletter",
      description: "Subscribe to receive weekly curated web design insights, free downloadable templates, and early-bird discounts.",
      showBadge: true,
      badgeText: "STAY IN THE LOOP",
      badgeIcon: "bell",
      iconEmoji: "💌",
      showImage: true,
      imageUrl: "https://images.unsplash.com/photo-1579208575657-c595a053b9b7?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Newsletter Graphic",
      imagePosition: "top",
      displayRules: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.displayRules,
        trigger: "scroll",
        scrollPercentage: 40,
        frequency: "weekly",
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#111827",
        headingColor: "#f9fafb",
        textColor: "#9ca3af",
        primaryBtnBg: "#3b82f6",
        primaryBtnText: "#ffffff",
        badgeBg: "#1d4ed8",
        badgeText: "#ffffff",
        borderColor: "#1f2937",
      },
      layout: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.layout,
        width: 460,
        borderRadius: 20,
        popupPadding: 24,
      },
      primaryButton: {
        show: true,
        text: "Join VIP Newsletter",
        url: "#newsletter-signup",
        target: "_blank",
        style: "primary",
      },
    },
  },

  // 10. Exit-Intent Popup
  exit_intent_popup: {
    key: "exit_intent_popup",
    name: "Exit-Intent Popup",
    description: "Capture abandoning visitors before they close the tab with a high-value retention offer.",
    displayMode: "popup",
    category: "sales",
    badge: "Exit Intent",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "popup",
      template: "exit_intent_popup",
      headline: "Wait! Don't Leave Empty Handed",
      description: "Take an extra 10% off your cart before you go. This special offer is only valid right now.",
      showBadge: true,
      badgeText: "BEFORE YOU GO",
      badgeIcon: "fire",
      iconEmoji: "🛑",
      coupon: {
        enabled: true,
        code: "STAY10",
        discountText: "10% EXTRA OFF",
        copyButtonText: "Copy Discount",
        copiedText: "Copied!",
      },
      displayRules: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.displayRules,
        trigger: "exit_intent",
        frequency: "daily",
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#18181b",
        headingColor: "#ffffff",
        textColor: "#a1a1aa",
        primaryBtnBg: "#ef4444",
        primaryBtnText: "#ffffff",
        badgeBg: "#b91c1c",
        badgeText: "#ffffff",
        borderColor: "#27272a",
      },
      layout: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.layout,
        width: 480,
        borderRadius: 20,
        popupPadding: 28,
      },
      primaryButton: {
        show: true,
        text: "Apply Discount & Stay",
        url: "#checkout",
        target: "_self",
        style: "primary",
      },
      secondaryButton: {
        show: true,
        text: "No thanks, I'll pay full price",
        url: "#close",
        target: "_self",
        style: "secondary",
      },
    },
  },

  // 11. Product Promotion Popup
  product_promo_popup: {
    key: "product_promo_popup",
    name: "Product Promotion Popup",
    description: "Showcase a specific product with high-res photo, pricing, feature highlights, and order button.",
    displayMode: "popup",
    category: "sales",
    badge: "Showcase",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "popup",
      template: "product_promo_popup",
      headline: "Meet the Studio Master Wireless Pro",
      description: "Active noise cancellation, 40-hour battery life, and studio-grade acoustics. Now only $149 (was $199).",
      showBadge: true,
      badgeText: "FEATURED DEAL",
      badgeIcon: "tag",
      iconEmoji: "🎧",
      showImage: true,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      imageAlt: "Studio Headphones",
      imagePosition: "top",
      displayRules: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.displayRules,
        trigger: "delay",
        delaySeconds: 4,
        frequency: "session",
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#0c0a09",
        headingColor: "#fafaf9",
        textColor: "#a8a29e",
        primaryBtnBg: "#f59e0b",
        primaryBtnText: "#000000",
        badgeBg: "#d97706",
        badgeText: "#ffffff",
        borderColor: "#292524",
      },
      layout: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.layout,
        width: 460,
        borderRadius: 20,
        popupPadding: 24,
      },
      primaryButton: {
        show: true,
        text: "Order Now — Save $50",
        url: "#product",
        target: "_self",
        style: "primary",
      },
    },
  },

  // 12. Custom Message Popup
  custom_message_popup: {
    key: "custom_message_popup",
    name: "Custom Message Popup",
    description: "Versatile announcement modal supporting headline, description, custom buttons, and clean dismissal.",
    displayMode: "popup",
    category: "announcement",
    badge: "Flexible",
    config: {
      ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG,
      displayMode: "popup",
      template: "custom_message_popup",
      headline: "Important Community Update",
      description: "Our annual user summit is taking place this Friday. Register for free live streaming, Q&A sessions, and exclusive networking rooms.",
      showBadge: true,
      badgeText: "OFFICIAL NOTICE",
      badgeIcon: "bell",
      iconEmoji: "📢",
      showImage: false,
      displayRules: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.displayRules,
        trigger: "immediate",
        frequency: "session",
      },
      colors: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.colors,
        background: "#18181b",
        headingColor: "#ffffff",
        textColor: "#d4d4d8",
        primaryBtnBg: "#8b5cf6",
        primaryBtnText: "#ffffff",
        secondaryBtnBg: "#27272a",
        secondaryBtnText: "#a1a1aa",
        badgeBg: "#7c3aed",
        badgeText: "#ffffff",
        borderColor: "#3f3f46",
      },
      layout: {
        ...DEFAULT_ANNOUNCEMENT_POPUP_CONFIG.layout,
        width: 500,
        borderRadius: 20,
        popupPadding: 28,
      },
      primaryButton: {
        show: true,
        text: "Reserve Virtual Seat",
        url: "#register",
        target: "_blank",
        style: "primary",
      },
      secondaryButton: {
        show: true,
        text: "View Summit Schedule",
        url: "#agenda",
        target: "_self",
        style: "secondary",
      },
    },
  },
};

export const ANNOUNCEMENT_POPUP_TEMPLATE_LIST = Object.values(ANNOUNCEMENT_POPUP_TEMPLATES);

/**
 * Creates a brand new announcement bar or popup widget record.
 */
export function createNewAnnouncementPopupWidget(
  name = "My Announcement Bar",
  templateKey = "sale_bar",
  displayMode: AnnouncementPopupMode = "bar"
): WidgetInstanceRecord<AnnouncementPopupConfig> {
  const tpl = ANNOUNCEMENT_POPUP_TEMPLATES[templateKey] || ANNOUNCEMENT_POPUP_TEMPLATES.sale_bar;
  const id = `wgt_announcement_${nanoid(8)}`;
  const now = new Date().toISOString();

  const rawCfg = JSON.parse(JSON.stringify(tpl.config));
  rawCfg.displayMode = displayMode;

  if (rawCfg.countdown?.enabled) {
    rawCfg.countdown.adminStartTime = Date.now();
    rawCfg.countdown.targetTimestamp = Date.now() + (rawCfg.countdown.durationValue || 12) * 3600000;
  }

  const cfg: AnnouncementPopupConfig = normalizeAnnouncementPopupConfig(rawCfg);

  return {
    id,
    type: "announcement_popup",
    name: name.trim() || tpl.name,
    status: "draft",
    source: {
      provider: "google",
      businessName: "Announcement & Popup",
    } as any,
    selectedReviews: [],
    config: cfg,
    createdAt: now,
    updatedAt: now,
  };
}
