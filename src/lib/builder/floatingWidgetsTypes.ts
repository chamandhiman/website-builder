import { nanoid } from "nanoid";

export type FloatingWidgetType =
  | "whatsapp_chat"
  | "chatbot"
  | "accessibility"
  | "language_switcher"
  | "back_to_top"
  | "floating_contact"
  | "announcement_popup"
  | "custom_embed";

export type FloatingPosition =
  | "bottom_right"
  | "bottom_left"
  | "bottom_center"
  | "top_right"
  | "top_left"
  | "top_center"
  | "top_fixed"
  | "bottom_fixed"
  | "middle_right"
  | "middle_left";

export interface FloatingWidgetRecord {
  id: string;
  type: FloatingWidgetType;
  name: string;
  enabled: boolean;
  position: FloatingPosition;
  offsetX: number;
  offsetY: number;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  pageTargeting: "all" | "homepage_only" | "custom";
  targetedPages?: string[];
  config: Record<string, any>;
  snippetHtml?: string;
  createdAt?: number;
  updatedAt?: number;
}

export const FLOATING_WIDGET_CATALOG: Array<{
  type: FloatingWidgetType;
  name: string;
  category: string;
  description: string;
  defaultPosition: FloatingPosition;
  badge: string;
}> = [
  {
    type: "whatsapp_chat",
    name: "WhatsApp Live Chat",
    category: "Communication",
    description: "Floating WhatsApp button with customizable greeting bubble, agent name, and direct messaging.",
    defaultPosition: "bottom_right",
    badge: "Popular",
  },
  {
    type: "accessibility",
    name: "Accessibility Toolbar",
    category: "Compliance",
    description: "ADA & WCAG compliant floating accessibility toolbar with high contrast, text resizing, and dyslexia font.",
    defaultPosition: "bottom_left",
    badge: "Essential",
  },
  {
    type: "language_switcher",
    name: "Language Switcher",
    category: "Localization",
    description: "Floating multi-language switcher supporting auto-detection, flags, and custom translated page links.",
    defaultPosition: "top_right",
    badge: "Global",
  },
  {
    type: "back_to_top",
    name: "Back to Top",
    category: "Navigation",
    description: "Floating scroll-to-top button that appears automatically as visitors scroll down your website.",
    defaultPosition: "bottom_right",
    badge: "Navigation",
  },
  {
    type: "floating_contact",
    name: "Floating Contact Button",
    category: "Lead Generation",
    description: "Quick-action floating button connecting visitors directly to your phone, email, booking, or contact form.",
    defaultPosition: "bottom_right",
    badge: "Action",
  },
  {
    type: "custom_embed",
    name: "Floating Custom Embed",
    category: "Advanced",
    description: "Position custom HTML, chatbot widgets, or third-party floating code snippets at any screen corner.",
    defaultPosition: "bottom_right",
    badge: "Custom",
  },
];

/**
 * Creates default configuration for a new floating widget.
 */
export function createDefaultFloatingWidget(
  type: FloatingWidgetType,
  name?: string
): FloatingWidgetRecord {
  const id = `flt_${type}_${nanoid(6)}`;
  const now = Date.now();

  switch (type) {
    case "whatsapp_chat":
      return {
        id,
        type,
        name: name || "WhatsApp Live Chat",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          phoneNumber: "",
          countryCode: "+91",
          rawPhone: "",
          agentName: "Customer Support",
          prefilledMessage: "Hello! I have a question about your services.",
          buttonStyle: "whatsapp_standard",
          buttonColor: "#25D366",
          buttonLabel: "Chat with us",
          labelPosition: "hover",
          showTooltip: true,
          tooltipText: "Chat with us 👋",
        },
        createdAt: now,
        updatedAt: now,
      };

    case "accessibility":
      return {
        id,
        type,
        name: name || "Accessibility Toolbar",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          toolbarStyle: "circle",
          toolbarColor: "#2563EB",
          accentColor: "#2563EB",
          buttonSize: 52,
          showByDefault: false,
          initialOpen: false,
          features: {
            textResize: true,
            highContrast: true,
            readableFont: true,
            keyboardNav: true,
            stopAnimations: true,
            reset: true,
          },
        },
        createdAt: now,
        updatedAt: now,
      };

    case "language_switcher":
      return {
        id,
        type,
        name: name || "Language Switcher",
        enabled: true,
        position: "top_right",
        offsetX: 24,
        offsetY: 24,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          layout: "floating_pill",
          showFlags: true,
          showNativeNames: true,
          theme: "dark",
          languages: [
            { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", enabled: true, isDefault: true },
            { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", enabled: true },
            { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", enabled: true },
            { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", enabled: true },
          ],
        },
        createdAt: now,
        updatedAt: now,
      };

    case "back_to_top":
      return {
        id,
        type,
        name: name || "Back to Top",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          scrollThreshold: 280,
          backgroundColor: "#1F1F23",
          textColor: "#FACC15",
          shape: "round",
          size: 46,
          iconType: "arrow",
        },
        createdAt: now,
        updatedAt: now,
      };

    case "floating_contact":
      return {
        id,
        type,
        name: name || "Quick Contact Button",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          actionType: "phone",
          phoneNumber: "",
          actionValue: "",
          label: "Call Now",
          buttonColor: "#FACC15",
          textColor: "#111111",
          iconType: "phone",
        },
        createdAt: now,
        updatedAt: now,
      };

    case "chatbot":
      return {
        id,
        type,
        name: name || "AI Chatbot",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          botName: "AI Assistant",
          welcomeMessage: "Hi there! How can I help you today?",
          primaryColor: "#2563EB",
        },
        createdAt: now,
        updatedAt: now,
      };

    case "announcement_popup":
      return {
        id,
        type,
        name: name || "Announcement Bar",
        enabled: true,
        position: "top_fixed",
        offsetX: 0,
        offsetY: 0,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {
          template: "classic",
          text: "2027 Winter and Spring Schedules are now open for enrollment!",
          icon: "megaphone",
          backgroundColor: "#4A1525",
          textColor: "#FFFFFF",
          btnBgColor: "#FACC15",
          btnTextColor: "#18181B",
          showCloseButton: true,
          allowDismiss: true,
          animation: "slide_down",
          layout: "banner",
        },
        createdAt: now,
        updatedAt: now,
      };

    case "custom_embed":
      return {
        id,
        type,
        name: name || "Floating Custom Embed",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        snippetHtml: `<div style="padding: 12px 16px; background: rgba(20,20,22,0.92); border: 1px solid rgba(250,204,21,0.4); border-radius: 12px; color: #fff; font-family: sans-serif; font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">\n  <strong>Floating Notice</strong>\n  <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 11px;">Custom floating embed preview.</p>\n</div>`,
        config: {},
        createdAt: now,
        updatedAt: now,
      };

    default:
      return {
        id,
        type,
        name: name || "Floating Widget",
        enabled: true,
        position: "bottom_right",
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all",
        config: {},
        createdAt: now,
        updatedAt: now,
      };
  }
}
