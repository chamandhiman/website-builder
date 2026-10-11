import { nanoid } from "nanoid";
import type { WidgetInstanceRecord } from "./widgetService";

export type CountdownTimerMode = "date" | "personal" | "counter" | "recurring";
export type CountdownTimerStyle = "classic" | "cards" | "minimal" | "flip" | "modern";
export type CountdownNumberAnimation = "none" | "fade" | "slide" | "flip";
export type CountdownPosition = "inline" | "full_width" | "top_bar" | "bottom_bar";
export type CountdownExpiryAction = "hide" | "message" | "redirect" | "restart";

export interface CountdownConfig {
  type: "countdown";
  template: string; // e.g. "sales", "flash_sale", etc.

  // 1. Timer Mode Settings
  timerMode: CountdownTimerMode;
  targetDate: string; // "YYYY-MM-DD"
  targetTime: string; // "HH:mm"
  timezone: string; // "local" | "UTC" | "America/New_York" | "Europe/London" | "Asia/Kolkata"
  targetTimestamp?: number; // Exact synchronized absolute target deadline (epoch ms)
  adminStartTime?: number; // When widget timer was started/saved in admin (epoch ms)

  // Personal (Evergreen)
  durationValue: number; // e.g. 15
  durationUnit: "minutes" | "hours" | "days";
  persistVisitor: boolean; // persist timer per visitor via localStorage

  // Number Counter
  counterStart: number;
  counterEnd: number;
  counterDirection: "up" | "down";
  counterDurationSeconds: number;

  // Recurring
  recurringIntervalHours: number; // e.g. 24

  // 2. Heading / Content
  showBadge: boolean;
  badgeText: string;
  badgeIcon: string; // "fire" | "zap" | "rocket" | "sparkles" | "gift" | "clock"
  heading: string;
  description: string;
  headingBold: boolean;
  headingItalic: boolean;
  headingUnderline?: boolean;
  descBold?: boolean;
  descItalic?: boolean;
  descUnderline?: boolean;
  contentAlign: "left" | "center" | "right";

  // 3. Countdown Display Units
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  showLabels: boolean;
  labelDays: string;
  labelHours: string;
  labelMinutes: string;
  labelSeconds: string;

  // 4. Timer Styles & Number Animation
  timerStyle: CountdownTimerStyle;
  animation: CountdownNumberAnimation;

  // 5. CTA / Actions
  showCTA: boolean;
  ctaText: string;
  ctaUrl: string;
  ctaTarget: "_blank" | "_self";
  ctaStyle: "primary" | "secondary" | "outline" | "glow";

  // 6. After Countdown Ends
  expiryAction: CountdownExpiryAction;
  expiryMessage: string;
  expiryRedirectUrl: string;

  // 7. Position
  position: CountdownPosition;
  sticky: boolean;
  showCloseButton: boolean;

  // 8. Theme / Design
  colors: {
    background: string;
    text: string;
    secondaryText: string;
    numberColor: string;
    labelColor: string;
    cardBackground: string;
    cardBorder: string;
    badgeBackground: string;
    badgeText: string;
    buttonBackground: string;
    buttonText: string;
  };

  typography: {
    fontFamily: string;
    headingSize: number; // px
    timerSize: number; // px
    labelSize: number; // px
    descriptionSize: number; // px
  };

  spacing: {
    padding: number; // px
    gap: number; // px
    borderRadius: number; // px
  };

  effects: {
    shadow: boolean;
    border: boolean;
    borderColor: string;
  };
}

export interface CountdownTemplateItem {
  key: string;
  name: string;
  description: string;
  category: "promotional" | "urgency" | "launch" | "sticky" | "evergreen";
  badge: string;
  config: CountdownConfig;
}

// Generate default future target date (+3 days at 23:59)
export function getDefaultTargetDate(): { date: string; time: string } {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: "23:59",
  };
}

export function calculateTargetTimestamp(
  config: Partial<CountdownConfig>,
  options?: { forceRecalculate?: boolean; baseStartTime?: number }
): number {
  // If a valid targetTimestamp exists and we are not forcing a recalculate, always return the authoritative saved timestamp
  if (!options?.forceRecalculate && typeof config.targetTimestamp === "number" && config.targetTimestamp > 0) {
    return config.targetTimestamp;
  }

  const mode = config.timerMode || "date";
  const now = options?.baseStartTime || config.adminStartTime || Date.now();

  if (mode === "date") {
    const targetDate = config.targetDate || "";
    const targetTime = config.targetTime || "23:59";
    const timezone = config.timezone || "local";

    if (!targetDate) {
      return now + 3 * 86400000;
    }

    const [year, month, day] = targetDate.split("-").map(Number);
    const [hours, minutes] = (targetTime || "23:59").split(":").map(Number);

    if (timezone === "UTC") {
      return Date.UTC(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0);
    }
    if (timezone === "local" || !timezone) {
      const d = new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0);
      return d.getTime();
    }

    try {
      const isoString = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
      const tempDate = new Date(`${isoString}Z`);
      const invDate = new Date(tempDate.toLocaleString("en-US", { timeZone: timezone }));
      const diff = tempDate.getTime() - invDate.getTime();
      return tempDate.getTime() + diff;
    } catch (_) {
      const d = new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0, 0);
      return d.getTime();
    }
  }

  if (mode === "personal") {
    const val = Number(config.durationValue || 15);
    const unit = config.durationUnit || "minutes";
    const durationMs = val * (unit === "days" ? 86400000 : unit === "hours" ? 3600000 : 60000);
    const startTime = options?.baseStartTime || (options?.forceRecalculate ? Date.now() : config.adminStartTime) || Date.now();
    return startTime + durationMs;
  }

  if (mode === "recurring") {
    const recurringHrs = Math.max(0.1, Number(config.recurringIntervalHours || 24));
    const cycleMs = recurringHrs * 3600000;
    return Math.ceil(now / cycleMs) * cycleMs;
  }

  return now + 3 * 86400000;
}

const defaultTargets = getDefaultTargetDate();

export const COUNTDOWN_TEMPLATES: Record<string, CountdownTemplateItem> = {
  sales: {
    key: "sales",
    name: "Sales Countdown",
    description: "Dark promotional banner with high-contrast cards and prominent CTA button.",
    category: "promotional",
    badge: "Most Popular",
    config: {
      type: "countdown",
      template: "sales",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: defaultTargets.time,
      timezone: "local",
      durationValue: 24,
      durationUnit: "hours",
      persistVisitor: true,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: true,
      badgeText: "SPECIAL OFFER 30% OFF",
      badgeIcon: "fire",
      heading: "Black Friday Mega Deal",
      description: "Hurry up! Save 30% on all premium plans before time runs out.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Minutes",
      labelSeconds: "Seconds",
      timerStyle: "cards",
      animation: "slide",
      showCTA: true,
      ctaText: "Claim Discount Now",
      ctaUrl: "https://example.com/deal",
      ctaTarget: "_blank",
      ctaStyle: "primary",
      expiryAction: "message",
      expiryMessage: "This offer has expired. Stay tuned for our next seasonal sale!",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#18181b",
        text: "#ffffff",
        secondaryText: "#a1a1aa",
        numberColor: "#facc15",
        labelColor: "#a1a1aa",
        cardBackground: "#27272a",
        cardBorder: "#3f3f46",
        badgeBackground: "#ef4444",
        badgeText: "#ffffff",
        buttonBackground: "#facc15",
        buttonText: "#000000",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 26,
        timerSize: 36,
        labelSize: 12,
        descriptionSize: 14,
      },
      spacing: {
        padding: 32,
        gap: 16,
        borderRadius: 16,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#3f3f46",
      },
    },
  },

  flash_sale: {
    key: "flash_sale",
    name: "Flash Sale",
    description: "Urgent red & amber styling with animated cards designed to drive immediate conversions.",
    category: "urgency",
    badge: "High Urgency",
    config: {
      type: "countdown",
      template: "flash_sale",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "18:00",
      timezone: "local",
      durationValue: 2,
      durationUnit: "hours",
      persistVisitor: false,
      counterStart: 50,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 120,
      recurringIntervalHours: 12,
      showBadge: true,
      badgeText: "LIGHTNING DEAL",
      badgeIcon: "zap",
      heading: "⚡ FLASH SALE ENDS SOON",
      description: "Stock is strictly limited. Prices revert back immediately at zero.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: false,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Mins",
      labelSeconds: "Secs",
      timerStyle: "cards",
      animation: "fade",
      showCTA: true,
      ctaText: "Shop Flash Deals",
      ctaUrl: "https://example.com/flash-sale",
      ctaTarget: "_blank",
      ctaStyle: "glow",
      expiryAction: "message",
      expiryMessage: "Flash sale has concluded! Next flash drop begins tomorrow at 10 AM.",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#09090b",
        text: "#ffffff",
        secondaryText: "#fca5a5",
        numberColor: "#ef4444",
        labelColor: "#f87171",
        cardBackground: "#1c1917",
        cardBorder: "#7f1d1d",
        badgeBackground: "#dc2626",
        badgeText: "#ffffff",
        buttonBackground: "#ef4444",
        buttonText: "#ffffff",
      },
      typography: {
        fontFamily: "Outfit, sans-serif",
        headingSize: 28,
        timerSize: 40,
        labelSize: 11,
        descriptionSize: 14,
      },
      spacing: {
        padding: 28,
        gap: 14,
        borderRadius: 14,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#b91c1c",
      },
    },
  },

  launch: {
    key: "launch",
    name: "Launch Countdown",
    description: "Spacious, centered modern launch design with clean typography and subscription CTA.",
    category: "launch",
    badge: "Clean & Spacious",
    config: {
      type: "countdown",
      template: "launch",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "12:00",
      timezone: "local",
      durationValue: 7,
      durationUnit: "days",
      persistVisitor: false,
      counterStart: 0,
      counterEnd: 1000,
      counterDirection: "up",
      counterDurationSeconds: 180,
      recurringIntervalHours: 48,
      showBadge: true,
      badgeText: "COMING VERY SOON",
      badgeIcon: "rocket",
      heading: "We Are Launching Soon",
      description: "Our all-new platform will be live in just a few days. Be the first to experience it.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Minutes",
      labelSeconds: "Seconds",
      timerStyle: "modern",
      animation: "slide",
      showCTA: true,
      ctaText: "Get Early Access",
      ctaUrl: "https://example.com/join",
      ctaTarget: "_blank",
      ctaStyle: "primary",
      expiryAction: "message",
      expiryMessage: "We have officially launched! Welcome aboard.",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#0f172a",
        text: "#f8fafc",
        secondaryText: "#94a3b8",
        numberColor: "#38bdf8",
        labelColor: "#64748b",
        cardBackground: "#1e293b",
        cardBorder: "#334155",
        badgeBackground: "#0284c7",
        badgeText: "#ffffff",
        buttonBackground: "#38bdf8",
        buttonText: "#0f172a",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 32,
        timerSize: 44,
        labelSize: 12,
        descriptionSize: 15,
      },
      spacing: {
        padding: 36,
        gap: 18,
        borderRadius: 20,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#334155",
      },
    },
  },

  event: {
    key: "event",
    name: "Event Countdown",
    description: "Sophisticated calendar event theme with purple/violet accents and registration button.",
    category: "promotional",
    badge: "Conferences & Webinars",
    config: {
      type: "countdown",
      template: "event",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "10:00",
      timezone: "local",
      durationValue: 5,
      durationUnit: "days",
      persistVisitor: false,
      counterStart: 0,
      counterEnd: 500,
      counterDirection: "up",
      counterDurationSeconds: 100,
      recurringIntervalHours: 72,
      showBadge: true,
      badgeText: "ANNUAL SUMMIT 2026",
      badgeIcon: "sparkles",
      heading: "Global Developer Conference",
      description: "Join 15,000+ creators, builders, and industry leaders online.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Mins",
      labelSeconds: "Secs",
      timerStyle: "cards",
      animation: "slide",
      showCTA: true,
      ctaText: "Register Your Seat",
      ctaUrl: "https://example.com/register",
      ctaTarget: "_blank",
      ctaStyle: "primary",
      expiryAction: "message",
      expiryMessage: "The keynote has started! Check the live stream.",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#181824",
        text: "#f3e8ff",
        secondaryText: "#c084fc",
        numberColor: "#c084fc",
        labelColor: "#a855f7",
        cardBackground: "#242038",
        cardBorder: "#4c1d95",
        badgeBackground: "#7c3aed",
        badgeText: "#ffffff",
        buttonBackground: "#a855f7",
        buttonText: "#ffffff",
      },
      typography: {
        fontFamily: "Outfit, sans-serif",
        headingSize: 26,
        timerSize: 36,
        labelSize: 11,
        descriptionSize: 14,
      },
      spacing: {
        padding: 30,
        gap: 16,
        borderRadius: 16,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#581c87",
      },
    },
  },

  minimal: {
    key: "minimal",
    name: "Minimal Countdown",
    description: "Ultra clean, distraction-free inline numbers with elegant subtle colon separators.",
    category: "promotional",
    badge: "Subtle & Sleek",
    config: {
      type: "countdown",
      template: "minimal",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "23:59",
      timezone: "local",
      durationValue: 24,
      durationUnit: "hours",
      persistVisitor: false,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: false,
      badgeText: "DEAL",
      badgeIcon: "clock",
      heading: "Seasonal Collection Closing",
      description: "Complimentary worldwide shipping on all orders placed before the counter reaches zero.",
      headingBold: false,
      headingItalic: false,
      contentAlign: "center",
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "d",
      labelHours: "h",
      labelMinutes: "m",
      labelSeconds: "s",
      timerStyle: "minimal",
      animation: "fade",
      showCTA: false,
      ctaText: "Explore",
      ctaUrl: "#",
      ctaTarget: "_self",
      ctaStyle: "secondary",
      expiryAction: "hide",
      expiryMessage: "Offer ended.",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "transparent",
        text: "#f4f4f5",
        secondaryText: "#71717a",
        numberColor: "#fafafa",
        labelColor: "#71717a",
        cardBackground: "transparent",
        cardBorder: "transparent",
        badgeBackground: "#27272a",
        badgeText: "#e4e4e7",
        buttonBackground: "#e4e4e7",
        buttonText: "#18181b",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 22,
        timerSize: 34,
        labelSize: 11,
        descriptionSize: 13,
      },
      spacing: {
        padding: 20,
        gap: 12,
        borderRadius: 8,
      },
      effects: {
        shadow: false,
        border: false,
        borderColor: "transparent",
      },
    },
  },

  bottom_sticky: {
    key: "bottom_sticky",
    name: "Bottom Sticky Countdown",
    description: "Compact floating bottom bar pinned to the screen bottom with dismiss button and CTA.",
    category: "sticky",
    badge: "Sticky Floating Bar",
    config: {
      type: "countdown",
      template: "bottom_sticky",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "23:59",
      timezone: "local",
      durationValue: 12,
      durationUnit: "hours",
      persistVisitor: false,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: true,
      badgeText: "ENDS TODAY",
      badgeIcon: "fire",
      heading: "Don't miss 25% OFF site-wide",
      description: "Code applied automatically at checkout.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "left",
      showDays: false,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "d",
      labelHours: "h",
      labelMinutes: "m",
      labelSeconds: "s",
      timerStyle: "cards",
      animation: "slide",
      showCTA: true,
      ctaText: "Shop Now",
      ctaUrl: "https://example.com/sale",
      ctaTarget: "_blank",
      ctaStyle: "primary",
      expiryAction: "hide",
      expiryMessage: "Sale concluded.",
      expiryRedirectUrl: "",
      position: "bottom_bar",
      sticky: true,
      showCloseButton: true,
      colors: {
        background: "#18181b",
        text: "#ffffff",
        secondaryText: "#a1a1aa",
        numberColor: "#fbbf24",
        labelColor: "#a1a1aa",
        cardBackground: "#27272a",
        cardBorder: "#3f3f46",
        badgeBackground: "#d97706",
        badgeText: "#ffffff",
        buttonBackground: "#fbbf24",
        buttonText: "#000000",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 18,
        timerSize: 24,
        labelSize: 10,
        descriptionSize: 12,
      },
      spacing: {
        padding: 16,
        gap: 12,
        borderRadius: 12,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#3f3f46",
      },
    },
  },

  top_sticky: {
    key: "top_sticky",
    name: "Top Sticky Countdown",
    description: "Header notice banner fixed to the top of the browser with urgent promo countdown.",
    category: "sticky",
    badge: "Top Announcement Bar",
    config: {
      type: "countdown",
      template: "top_sticky",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "23:59",
      timezone: "local",
      durationValue: 24,
      durationUnit: "hours",
      persistVisitor: false,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: true,
      badgeText: "SPECIAL NOTICE",
      badgeIcon: "zap",
      heading: "Weekend Clearance Event — Up to 50% OFF",
      description: "Free express shipping on all orders over $50.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "left",
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "D",
      labelHours: "H",
      labelMinutes: "M",
      labelSeconds: "S",
      timerStyle: "cards",
      animation: "fade",
      showCTA: true,
      ctaText: "View Deals",
      ctaUrl: "https://example.com/deals",
      ctaTarget: "_blank",
      ctaStyle: "primary",
      expiryAction: "hide",
      expiryMessage: "Deal expired.",
      expiryRedirectUrl: "",
      position: "top_bar",
      sticky: true,
      showCloseButton: true,
      colors: {
        background: "#09090b",
        text: "#f4f4f5",
        secondaryText: "#a1a1aa",
        numberColor: "#34d399",
        labelColor: "#a1a1aa",
        cardBackground: "#18181b",
        cardBorder: "#27272a",
        badgeBackground: "#059669",
        badgeText: "#ffffff",
        buttonBackground: "#10b981",
        buttonText: "#000000",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 17,
        timerSize: 22,
        labelSize: 10,
        descriptionSize: 12,
      },
      spacing: {
        padding: 14,
        gap: 12,
        borderRadius: 0,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#27272a",
      },
    },
  },

  flip: {
    key: "flip",
    name: "Flip Countdown",
    description: "Retro mechanical split-flap clock card styling with high contrast digit separators.",
    category: "promotional",
    badge: "Retro Mechanical Look",
    config: {
      type: "countdown",
      template: "flip",
      timerMode: "date",
      targetDate: defaultTargets.date,
      targetTime: "20:00",
      timezone: "local",
      durationValue: 48,
      durationUnit: "hours",
      persistVisitor: false,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: true,
      badgeText: "PREMIUM RELEASE",
      badgeIcon: "sparkles",
      heading: "New Drop Dropping Soon",
      description: "Limited collector's edition will be available strictly while supplies last.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Minutes",
      labelSeconds: "Seconds",
      timerStyle: "flip",
      animation: "flip",
      showCTA: true,
      ctaText: "Join Waitlist",
      ctaUrl: "https://example.com/waitlist",
      ctaTarget: "_blank",
      ctaStyle: "secondary",
      expiryAction: "message",
      expiryMessage: "The drop is live now!",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#121214",
        text: "#ffffff",
        secondaryText: "#9ca3af",
        numberColor: "#ffffff",
        labelColor: "#9ca3af",
        cardBackground: "#1e1e24",
        cardBorder: "#2e2e38",
        badgeBackground: "#4b5563",
        badgeText: "#ffffff",
        buttonBackground: "#e5e7eb",
        buttonText: "#111827",
      },
      typography: {
        fontFamily: "'Courier New', monospace",
        headingSize: 26,
        timerSize: 42,
        labelSize: 11,
        descriptionSize: 14,
      },
      spacing: {
        padding: 32,
        gap: 16,
        borderRadius: 12,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#2e2e38",
      },
    },
  },

  personal: {
    key: "personal",
    name: "Personal Countdown",
    description: "Evergreen timer that begins when each visitor opens the page and persists via localStorage.",
    category: "evergreen",
    badge: "Visitor Evergreen Timer",
    config: {
      type: "countdown",
      template: "personal",
      timerMode: "personal",
      targetDate: defaultTargets.date,
      targetTime: "23:59",
      timezone: "local",
      durationValue: 15,
      durationUnit: "minutes",
      persistVisitor: true,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: true,
      badgeText: "PERSONAL 15-MINUTE DISCOUNT",
      badgeIcon: "gift",
      heading: "Your Exclusive New Visitor Gift",
      description: "Enjoy $20 off your first purchase! Complete checkout before your personal timer expires.",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: false,
      showHours: false,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Mins",
      labelSeconds: "Secs",
      timerStyle: "modern",
      animation: "slide",
      showCTA: true,
      ctaText: "Apply $20 Coupon",
      ctaUrl: "https://example.com/checkout?code=WELCOME20",
      ctaTarget: "_blank",
      ctaStyle: "glow",
      expiryAction: "message",
      expiryMessage: "Your personal 15-minute voucher has expired.",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#0c0a09",
        text: "#fafaf9",
        secondaryText: "#a8a29e",
        numberColor: "#f97316",
        labelColor: "#fdba74",
        cardBackground: "#1c1917",
        cardBorder: "#44403c",
        badgeBackground: "#ea580c",
        badgeText: "#ffffff",
        buttonBackground: "#f97316",
        buttonText: "#000000",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 26,
        timerSize: 42,
        labelSize: 11,
        descriptionSize: 14,
      },
      spacing: {
        padding: 30,
        gap: 16,
        borderRadius: 18,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#44403c",
      },
    },
  },

  recurring: {
    key: "recurring",
    name: "Recurring Countdown",
    description: "Repeats automatically after reaching zero (e.g. daily deals, hourly flash drops).",
    category: "evergreen",
    badge: "Auto-Resetting Cycle",
    config: {
      type: "countdown",
      template: "recurring",
      timerMode: "recurring",
      targetDate: defaultTargets.date,
      targetTime: "23:59",
      timezone: "local",
      durationValue: 24,
      durationUnit: "hours",
      persistVisitor: false,
      counterStart: 100,
      counterEnd: 0,
      counterDirection: "down",
      counterDurationSeconds: 60,
      recurringIntervalHours: 24,
      showBadge: true,
      badgeText: "DAILY FLASH DROP",
      badgeIcon: "clock",
      heading: "Today's Featured Secret Drops",
      description: "Our inventory rotates automatically every 24 hours. Don't wait!",
      headingBold: true,
      headingItalic: false,
      contentAlign: "center",
      showDays: false,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      showLabels: true,
      labelDays: "Days",
      labelHours: "Hours",
      labelMinutes: "Minutes",
      labelSeconds: "Seconds",
      timerStyle: "cards",
      animation: "slide",
      showCTA: true,
      ctaText: "Browse Secret Vault",
      ctaUrl: "https://example.com/vault",
      ctaTarget: "_blank",
      ctaStyle: "primary",
      expiryAction: "restart",
      expiryMessage: "Resetting for the next cycle...",
      expiryRedirectUrl: "",
      position: "inline",
      sticky: false,
      showCloseButton: false,
      colors: {
        background: "#18181b",
        text: "#f4f4f5",
        secondaryText: "#a1a1aa",
        numberColor: "#a855f7",
        labelColor: "#c084fc",
        cardBackground: "#27272a",
        cardBorder: "#3f3f46",
        badgeBackground: "#9333ea",
        badgeText: "#ffffff",
        buttonBackground: "#a855f7",
        buttonText: "#ffffff",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        headingSize: 26,
        timerSize: 38,
        labelSize: 11,
        descriptionSize: 14,
      },
      spacing: {
        padding: 30,
        gap: 16,
        borderRadius: 16,
      },
      effects: {
        shadow: true,
        border: true,
        borderColor: "#3f3f46",
      },
    },
  },
};

export const TEMPLATE_LIST: CountdownTemplateItem[] = Object.values(COUNTDOWN_TEMPLATES);

/**
 * Creates a brand new countdown widget record ready to be saved in widgetService.
 */
export function createNewCountdownWidget(
  name: string = "My Countdown Timer",
  templateKey: string = "sales"
): WidgetInstanceRecord<CountdownConfig> {
  const tpl = COUNTDOWN_TEMPLATES[templateKey] || COUNTDOWN_TEMPLATES.sales;
  const id = `wgt_countdown_${nanoid(8)}`;
  const now = new Date().toISOString();
  const cfg: CountdownConfig = JSON.parse(JSON.stringify(tpl.config));

  const startTime = Date.now();
  cfg.adminStartTime = startTime;
  cfg.targetTimestamp = calculateTargetTimestamp(cfg, { forceRecalculate: true, baseStartTime: startTime });

  return {
    id,
    type: "countdown",
    name: name.trim() || tpl.name,
    status: "draft",
    source: {
      provider: "google", // standard structural compatibility with WidgetInstanceRecord
      businessName: "Countdown Timer",
    } as any,
    selectedReviews: [],
    config: cfg,
    createdAt: now,
    updatedAt: now,
  };
}
