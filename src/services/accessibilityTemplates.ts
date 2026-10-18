import { nanoid } from "nanoid";
import type { WidgetInstanceRecord } from "./widgetService";

export type AccessibilityDisplayStyle =
  | "floating_icon"
  | "floating_icon_with_label"
  | "compact_toolbar"
  | "expandable_panel";

export type AccessibilityPosition =
  | "bottom_right"
  | "bottom_left"
  | "top_right"
  | "top_left";

export type AccessibilityTheme = "dark" | "light" | "system";
export type AccessibilityPanelAnimation = "slide" | "fade" | "scale" | "none";
export type AccessibilityShadow = "none" | "soft" | "medium" | "intense";
export type AccessibilityContrastMode = "none" | "high_contrast" | "inverted" | "grayscale";

export interface AccessibilityAppearanceConfig {
  template: string;
  displayStyle: AccessibilityDisplayStyle;
  position: AccessibilityPosition;
  offsetX: number;
  offsetY: number;
  buttonSize: number;
  iconSize: number;
  buttonLabel: string;
  panelWidth: number;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  cardBgColor: string;
  borderRadius: number;
  shadowIntensity: AccessibilityShadow;
  showTooltip: boolean;
  tooltipText: string;
  panelAnimation: AccessibilityPanelAnimation;
  theme: AccessibilityTheme;
}

export interface AccessibilityFeaturesConfig {
  textResize: boolean;
  lineSpacing: boolean;
  letterSpacing: boolean;
  readableFont: boolean;
  highlightHeadings: boolean;
  highlightLinks: boolean;
  readingGuide: boolean;
  largeCursor: boolean;
  highContrast: boolean;
  darkContrast: boolean;
  monochrome: boolean;
  reducedMotion: boolean;
  screenReaderFriendly: boolean;
}

export interface AccessibilityBehaviorConfig {
  rememberPreferences: boolean;
  defaultTextScale: number; // e.g. 100
  defaultContrast: AccessibilityContrastMode;
  visibleOnDesktop: boolean;
  visibleOnMobile: boolean;
  contentScopeSelector: string; // e.g. "body" or empty
  hotkeyEnabled: boolean; // Alt + A
}

export interface AccessibilityConfig {
  appearance: AccessibilityAppearanceConfig;
  features: AccessibilityFeaturesConfig;
  behavior: AccessibilityBehaviorConfig;
}

export interface AccessibilityTemplateItem {
  key: string;
  name: string;
  description: string;
  badge: string;
  config: AccessibilityConfig;
}

export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  appearance: {
    template: "modern_floating",
    displayStyle: "floating_icon",
    position: "bottom_right",
    offsetX: 24,
    offsetY: 24,
    buttonSize: 58,
    iconSize: 28,
    buttonLabel: "Accessibility",
    panelWidth: 420,
    backgroundColor: "#0f172a",
    textColor: "#f8fafc",
    accentColor: "#38bdf8",
    cardBgColor: "#1e293b",
    borderRadius: 16,
    shadowIntensity: "medium",
    showTooltip: true,
    tooltipText: "Accessibility Options (Alt + A)",
    panelAnimation: "slide",
    theme: "dark",
  },
  features: {
    textResize: true,
    lineSpacing: true,
    letterSpacing: true,
    readableFont: true,
    highlightHeadings: true,
    highlightLinks: true,
    readingGuide: true,
    largeCursor: true,
    highContrast: true,
    darkContrast: true,
    monochrome: true,
    reducedMotion: true,
    screenReaderFriendly: true,
  },
  behavior: {
    rememberPreferences: true,
    defaultTextScale: 100,
    defaultContrast: "none",
    visibleOnDesktop: true,
    visibleOnMobile: true,
    contentScopeSelector: "",
    hotkeyEnabled: true,
  },
};

export const ACCESSIBILITY_TEMPLATES: Record<string, AccessibilityTemplateItem> = {
  modern_floating: {
    key: "modern_floating",
    name: "Modern Floating Button",
    description: "Sleek dark navy floating icon with cyan highlights and full accessibility toolkit.",
    badge: "Popular",
    config: {
      ...DEFAULT_ACCESSIBILITY_CONFIG,
      appearance: {
        ...DEFAULT_ACCESSIBILITY_CONFIG.appearance,
        template: "modern_floating",
        displayStyle: "floating_icon",
        position: "bottom_right",
        backgroundColor: "#0f172a",
        textColor: "#f8fafc",
        accentColor: "#38bdf8",
        cardBgColor: "#1e293b",
        borderRadius: 16,
      },
    },
  },
  pill_with_label: {
    key: "pill_with_label",
    name: "Pill with Label",
    description: "Prominent rounded badge showing both the accessibility icon and clear text label.",
    badge: "High Visibility",
    config: {
      ...DEFAULT_ACCESSIBILITY_CONFIG,
      appearance: {
        ...DEFAULT_ACCESSIBILITY_CONFIG.appearance,
        template: "pill_with_label",
        displayStyle: "floating_icon_with_label",
        position: "bottom_right",
        buttonLabel: "Accessibility",
        backgroundColor: "#18181b",
        textColor: "#ffffff",
        accentColor: "#facc15",
        cardBgColor: "#27272a",
        borderRadius: 9999,
      },
    },
  },
  high_contrast_yellow: {
    key: "high_contrast_yellow",
    name: "High Contrast Amber",
    description: "Ultra-visible black and amber design built for maximum clarity and compliance.",
    badge: "WCAG AAA Ready",
    config: {
      ...DEFAULT_ACCESSIBILITY_CONFIG,
      appearance: {
        ...DEFAULT_ACCESSIBILITY_CONFIG.appearance,
        template: "high_contrast_yellow",
        displayStyle: "floating_icon_with_label",
        position: "bottom_left",
        buttonLabel: "Accessibility Menu",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        accentColor: "#f59e0b",
        cardBgColor: "#171717",
        borderRadius: 12,
        shadowIntensity: "intense",
      },
    },
  },
  clean_light: {
    key: "clean_light",
    name: "Clean Light Theme",
    description: "Crisp white floating icon with royal blue accents for light-themed websites.",
    badge: "Light Mode",
    config: {
      ...DEFAULT_ACCESSIBILITY_CONFIG,
      appearance: {
        ...DEFAULT_ACCESSIBILITY_CONFIG.appearance,
        template: "clean_light",
        displayStyle: "floating_icon",
        position: "bottom_right",
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
        accentColor: "#2563eb",
        cardBgColor: "#f8fafc",
        borderRadius: 16,
        theme: "light",
      },
    },
  },
};

export const ACCESSIBILITY_TEMPLATE_LIST = Object.values(ACCESSIBILITY_TEMPLATES);

/**
 * Creates a new Accessibility Widget instance record.
 */
export function createNewAccessibilityWidget(
  name: string = "Accessibility Widget",
  templateKey: string = "modern_floating"
): WidgetInstanceRecord<AccessibilityConfig> {
  const tpl = ACCESSIBILITY_TEMPLATES[templateKey] || ACCESSIBILITY_TEMPLATES.modern_floating;
  const now = new Date().toISOString();
  const id = `wgt_acc_${nanoid(8)}`;

  return {
    id,
    type: "accessibility",
    name,
    status: "draft",
    enabled: true,
    source: {
      provider: "accessibility" as any,
    },
    selectedReviews: [],
    config: JSON.parse(JSON.stringify(tpl.config)),
    createdAt: now,
    updatedAt: now,
  };
}
