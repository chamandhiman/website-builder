import { nanoid } from "nanoid";
import type { WidgetInstanceRecord } from "./widgetService";

export type WhatsAppChatTemplateKey =
  | "classic_whatsapp"
  | "friendly_greeting"
  | "business_card"
  | "minimal_button";

export type WhatsAppPosition = "bottom_right" | "bottom_left";
export type WhatsAppEntranceAnimation = "none" | "fade_in" | "slide_up" | "bounce";
export type WhatsAppAttentionAnimation = "none" | "subtle_pulse" | "subtle_bounce";
export type WhatsAppLayoutStyle = "floating_button" | "button_with_greeting" | "contact_card";

export interface WhatsAppChatContentConfig {
  phoneNumber: string; // International phone number digits only (e.g. 14155552671)
  buttonLabel: string; // e.g. "Chat on WhatsApp"
  greetingText: string; // e.g. "Hi! How can we help you today?"
  prefilledMessage: string; // e.g. "Hi, I would like to know more about your services."
  agentName: string; // e.g. "Support Team"
  agentAvatarUrl: string; // avatar photo URL
  statusLabel: string; // e.g. "Usually replies in minutes" or "Online"
  workingHoursNotice: string; // e.g. "We usually reply Monday–Friday"
  showWorkingHoursNotice: boolean;
}

export interface WhatsAppChatAppearanceConfig {
  template: WhatsAppChatTemplateKey;
  layoutStyle: WhatsAppLayoutStyle;
  buttonColor: string; // e.g. "#25d366" (WhatsApp green)
  buttonTextColor: string; // e.g. "#ffffff"
  iconSize: number; // e.g. 28 (20-40)
  buttonDiameter: number; // e.g. 60 (48-72)
  borderRadius: number; // e.g. 50 (round) or 16
  greetingBgColor: string; // e.g. "#ffffff"
  greetingTextColor: string; // e.g. "#1f2937"
  position: WhatsAppPosition; // "bottom_right" | "bottom_left"
  offsetX: number; // px from screen edge (e.g. 20)
  offsetY: number; // px from screen bottom edge (e.g. 20)
  showTooltip: boolean; // whether tooltip appears on hover
  customTooltipText: string; // e.g. "Chat with us"
  entranceAnimation: WhatsAppEntranceAnimation;
  attentionAnimation: WhatsAppAttentionAnimation;
  theme: "light" | "dark" | "custom";
}

export interface WhatsAppChatBehaviorConfig {
  openInNewTab: boolean;
  prefillMessage: boolean;
  showGreetingBubble: boolean;
  greetingDelaySec: number; // delay before greeting pops up (e.g. 3)
  autoDismissGreetingSec: number; // 0 = never auto-dismiss
  visibleOnDesktop: boolean;
  visibleOnMobile: boolean;
}

export interface WhatsAppChatConfig {
  content: WhatsAppChatContentConfig;
  appearance: WhatsAppChatAppearanceConfig;
  behavior: WhatsAppChatBehaviorConfig;
}

export interface WhatsAppChatTemplateItem {
  key: WhatsAppChatTemplateKey;
  name: string;
  description: string;
  badge: string;
  config: WhatsAppChatConfig;
}

/**
 * Normalizes a raw phone number input by extracting only digits.
 * Handles raw inputs, spaces, plus signs, brackets, dashes, or full URL inputs.
 */
export function normalizeWhatsAppPhone(rawPhone?: string): string {
  if (!rawPhone) return "";
  const str = String(rawPhone).trim();
  // If an entire WhatsApp link or query was pasted (e.g. ?phone=... or wa.me/...)
  const urlMatch = str.match(/(?:phone=|wa\.me\/)(\d+)/i);
  if (urlMatch) {
    return urlMatch[1];
  }
  return str.replace(/\D/g, "");
}

/**
 * Validates whether the normalized string is a valid international WhatsApp number (7-15 digits).
 */
export function isValidWhatsAppPhone(phone?: string): boolean {
  const digits = normalizeWhatsAppPhone(phone);
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Constructs the official WhatsApp Click to Chat URL:
 * https://wa.me/PHONE_NUMBER?text=ENCODED_MESSAGE
 */
export function createWhatsAppUrl(phoneNumber: string, message?: string): string {
  const phone = normalizeWhatsAppPhone(phoneNumber);
  if (!isValidWhatsAppPhone(phone)) {
    throw new Error("Please configure a valid WhatsApp phone number with country code.");
  }
  const cleanMessage = String(message || "").trim();
  const text = cleanMessage ? encodeURIComponent(cleanMessage) : "";
  return `https://wa.me/${phone}${text ? `?text=${text}` : ""}`;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppChatConfig = {
  content: {
    phoneNumber: "",
    buttonLabel: "Chat on WhatsApp",
    greetingText: "Hi! How can we help you today?",
    prefilledMessage: "Hi, I would like to know more about your services.",
    agentName: "Support Team",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    statusLabel: "Usually replies in minutes",
    workingHoursNotice: "We usually reply Monday–Friday",
    showWorkingHoursNotice: true,
  },
  appearance: {
    template: "friendly_greeting",
    layoutStyle: "button_with_greeting",
    buttonColor: "#25d366",
    buttonTextColor: "#ffffff",
    iconSize: 28,
    buttonDiameter: 60,
    borderRadius: 50,
    greetingBgColor: "#ffffff",
    greetingTextColor: "#1f2937",
    position: "bottom_right",
    offsetX: 24,
    offsetY: 24,
    showTooltip: true,
    customTooltipText: "Chat with us",
    entranceAnimation: "slide_up",
    attentionAnimation: "subtle_pulse",
    theme: "light",
  },
  behavior: {
    openInNewTab: true,
    prefillMessage: true,
    showGreetingBubble: true,
    greetingDelaySec: 3,
    autoDismissGreetingSec: 0,
    visibleOnDesktop: true,
    visibleOnMobile: true,
  },
};

export const WHATSAPP_CHAT_TEMPLATES: Record<WhatsAppChatTemplateKey, WhatsAppChatTemplateItem> = {
  friendly_greeting: {
    key: "friendly_greeting",
    name: "Friendly Greeting",
    description: "Floating WhatsApp button with a warm welcome bubble and team avatar that engages visitors.",
    badge: "Most Popular",
    config: {
      ...DEFAULT_WHATSAPP_CONFIG,
      appearance: {
        ...DEFAULT_WHATSAPP_CONFIG.appearance,
        template: "friendly_greeting",
        layoutStyle: "button_with_greeting",
        buttonColor: "#25d366",
        attentionAnimation: "subtle_pulse",
      },
    },
  },

  classic_whatsapp: {
    key: "classic_whatsapp",
    name: "Classic WhatsApp",
    description: "The familiar circular floating WhatsApp button with subtle pulse animation and quick tooltip.",
    badge: "Official Style",
    config: {
      ...DEFAULT_WHATSAPP_CONFIG,
      appearance: {
        ...DEFAULT_WHATSAPP_CONFIG.appearance,
        template: "classic_whatsapp",
        layoutStyle: "floating_button",
        buttonColor: "#25d366",
        buttonDiameter: 60,
        iconSize: 30,
        attentionAnimation: "subtle_pulse",
      },
      behavior: {
        ...DEFAULT_WHATSAPP_CONFIG.behavior,
        showGreetingBubble: false,
      },
    },
  },

  business_card: {
    key: "business_card",
    name: "Business Contact Card",
    description: "Expandable contact card with agent profile, online badge, working hours, and direct chat action.",
    badge: "Professional",
    config: {
      ...DEFAULT_WHATSAPP_CONFIG,
      content: {
        ...DEFAULT_WHATSAPP_CONFIG.content,
        buttonLabel: "Start WhatsApp Chat",
        agentName: "Customer Support Team",
        statusLabel: "Usually replies in minutes",
        greetingText: "Have questions about our pricing or products? Tap below to chat directly with our team on WhatsApp.",
      },
      appearance: {
        ...DEFAULT_WHATSAPP_CONFIG.appearance,
        template: "business_card",
        layoutStyle: "contact_card",
        buttonColor: "#25d366",
        buttonDiameter: 58,
        attentionAnimation: "none",
      },
      behavior: {
        ...DEFAULT_WHATSAPP_CONFIG.behavior,
        showGreetingBubble: true,
        greetingDelaySec: 2,
      },
    },
  },

  minimal_button: {
    key: "minimal_button",
    name: "Minimal Floating Button",
    description: "Compact, unobtrusive floating button with clean typography, ideal for modern eCommerce stores.",
    badge: "Clean",
    config: {
      ...DEFAULT_WHATSAPP_CONFIG,
      appearance: {
        ...DEFAULT_WHATSAPP_CONFIG.appearance,
        template: "minimal_button",
        layoutStyle: "floating_button",
        buttonColor: "#128c7e",
        buttonDiameter: 52,
        iconSize: 24,
        attentionAnimation: "none",
        offsetX: 20,
        offsetY: 20,
      },
      behavior: {
        ...DEFAULT_WHATSAPP_CONFIG.behavior,
        showGreetingBubble: false,
      },
    },
  },
};

export const WHATSAPP_CHAT_TEMPLATE_LIST = Object.values(WHATSAPP_CHAT_TEMPLATES);

/**
 * Normalizes WhatsApp Chat configuration with safe fallback defaults.
 */
export function normalizeWhatsAppConfig(raw?: Partial<WhatsAppChatConfig> | null): WhatsAppChatConfig {
  if (!raw) return JSON.parse(JSON.stringify(DEFAULT_WHATSAPP_CONFIG));

  return {
    content: {
      ...DEFAULT_WHATSAPP_CONFIG.content,
      ...(raw.content || {}),
      phoneNumber: normalizeWhatsAppPhone(raw.content?.phoneNumber || ""),
    },
    appearance: {
      ...DEFAULT_WHATSAPP_CONFIG.appearance,
      ...(raw.appearance || {}),
    },
    behavior: {
      ...DEFAULT_WHATSAPP_CONFIG.behavior,
      ...(raw.behavior || {}),
    },
  };
}

/**
 * Factory function to create a new WhatsApp Live Chat widget record.
 */
export function createNewWhatsAppChatWidget(
  name = "WhatsApp Live Chat",
  templateKey: WhatsAppChatTemplateKey = "friendly_greeting",
  customPhone = ""
): WidgetInstanceRecord<WhatsAppChatConfig> {
  const tpl = WHATSAPP_CHAT_TEMPLATES[templateKey] || WHATSAPP_CHAT_TEMPLATES.friendly_greeting;
  const now = new Date().toISOString();
  const id = `wgt_wa_${nanoid(8)}`;

  const config = normalizeWhatsAppConfig(JSON.parse(JSON.stringify(tpl.config)));
  if (customPhone) {
    config.content.phoneNumber = normalizeWhatsAppPhone(customPhone);
  }

  return {
    id,
    type: "whatsapp_chat",
    name: name.trim() || tpl.name,
    status: "draft",
    enabled: true,
    source: null,
    selectedReviews: [],
    config,
    createdAt: now,
    updatedAt: now,
  };
}
