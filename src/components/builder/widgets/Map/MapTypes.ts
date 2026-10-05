import type { WidgetData } from "../widgetRegistry";

export type MapVariant =
  | "Full Width Clean"
  | "Split with Card"
  | "Dark Mode Map"
  | "Rounded Boxed";

export interface MapContentGroup extends Record<string, unknown> {
  embedCode?: string;
  mapUrl?: string;
  height?: string;
  showCard?: boolean;
  showAddress?: boolean;
  showPhone?: boolean;
  showHours?: boolean;
  showButton?: boolean;
  cardTitle?: string;
  cardAddress?: string;
  cardPhone?: string;
  cardHours?: string;
  cardButtonText?: string;
  cardButtonUrl?: string;
  cardPosition?: "bottom-left" | "top-left" | "bottom-right" | "top-right";
}

export interface MapStyleGroup extends Record<string, unknown> {
  backgroundColor?: string;
  filter?: "none" | "grayscale" | "contrast" | "dark";
  borderRadius?: string;
  cardBg?: string;
  cardTextColor?: string;
  cardSubtitleColor?: string;
  cardAccentColor?: string;
  cardBorderRadius?: string;
  cardShadow?: boolean;
}

export interface MapLayoutGroup extends Record<string, unknown> {
  containerMode?: "fluid" | "container" | "custom";
  maxWidth?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingX?: string;
}

export interface MapResponsiveGroup extends Record<string, unknown> {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export interface MapAnimationGroup extends Record<string, unknown> {
  enabled?: boolean;
  type?: string;
  duration?: number;
  delay?: number;
}

export interface MapAdvancedGroup extends Record<string, unknown> {
  id?: string;
  className?: string;
  visibility?: boolean;
}

export interface MapWidgetData extends WidgetData {
  type: "map";
  variant: MapVariant;
  content: MapContentGroup;
  style: MapStyleGroup;
  layout: MapLayoutGroup;
  responsive: MapResponsiveGroup;
  animation: MapAnimationGroup;
  advanced: MapAdvancedGroup;
}

export function isMapWidgetData(value: unknown): value is MapWidgetData {
  return Boolean(value && typeof value === "object" && (value as { type?: string }).type === "map");
}

export const DEFAULT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25436351886!2d-74.11976373099953!3d40.69766374940564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1689712345678!5m2!1sen!2s";

export function extractMapSrc(input?: string): string {
  if (!input) return DEFAULT_MAP_URL;
  const trimmed = input.trim();
  if (!trimmed) return DEFAULT_MAP_URL;

  // If user pasted full iframe tag: <iframe ... src="..." ...>
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }

  // If user pasted direct URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
    return trimmed;
  }

  return DEFAULT_MAP_URL;
}

export const defaultMapWidgetData: MapWidgetData = {
  id: "map-default",
  type: "map",
  variant: "Full Width Clean",
  content: {
    embedCode: `<iframe src="${DEFAULT_MAP_URL}" width="100%" height="480" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    mapUrl: DEFAULT_MAP_URL,
    height: "480px",
    showCard: false,
    showAddress: true,
    showPhone: true,
    showHours: true,
    showButton: true,
    cardTitle: "Main Headquarters",
    cardAddress: "123 Business Avenue, Suite 500, New York, NY 10001",
    cardPhone: "+1 (555) 123-4567",
    cardHours: "Mon – Fri: 9:00 AM – 6:00 PM",
    cardButtonText: "Open in Google Maps",
    cardButtonUrl: "https://maps.google.com/?q=New+York,+NY",
    cardPosition: "bottom-left",
  },
  style: {
    backgroundColor: "#ffffff",
    filter: "none",
    borderRadius: "0px",
    cardBg: "rgba(255, 255, 255, 0.95)",
    cardTextColor: "#111827",
    cardSubtitleColor: "#4b5563",
    cardAccentColor: "#FACC15",
    cardBorderRadius: "14px",
    cardShadow: true,
  },
  layout: {
    containerMode: "fluid",
    maxWidth: "100%",
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingX: "0px",
  },
  responsive: {
    hideOnMobile: false,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
  animation: { enabled: false, type: "none", duration: 300, delay: 0 },
  advanced: { id: "", className: "", visibility: true },
};
