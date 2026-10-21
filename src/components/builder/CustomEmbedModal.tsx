"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useBuilder,
  SHARED_HEADER_SECTION_ID,
  SHARED_FOOTER_SECTION_ID,
} from "@/lib/builder/store";
import {
  X,
  Code2,
  Globe,
  Monitor,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Accessibility,
  MapPin,
  Youtube,
  Phone,
  ArrowUp,
  Megaphone,
  Star,
  Check,
  Bot,
  Layers,
  Sparkles,
  Palette,
  Bell,
  Link as LinkIcon,
  Eye,
  Compass,
  Gift,
  Percent,
  Info,
  Shield,
  CircleOff,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  type CustomEmbedItem,
  createCustomHtmlSection,
  createYouTubeSection,
  createMapSection,
} from "@/lib/builder/customEmbedsUtils";
import type { FloatingPosition, FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";
import { nanoid } from "nanoid";
import { WhatsAppChatModal } from "./WhatsAppChatModal";
import { AccessibilityToolbarModal } from "./AccessibilityToolbarModal";
import { AnnouncementBarModal } from "./AnnouncementBarModal";
import { StandardFloatingPluginModal } from "./floating-plugins/StandardFloatingPluginModal";

export interface CustomEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedToEdit?: CustomEmbedItem | null;
  initialPluginType?: string | null;
  defaultPageId?: string | null;
  onSaved?: () => void;
}

type PlacementChoice =
  | "site_wide_header"
  | "site_wide_footer"
  | "floating_bottom_right"
  | "floating_bottom_left"
  | "floating_bottom_center"
  | "floating_top_right"
  | "floating_top_left"
  | "inline_page";

// ── ANNOUNCEMENT BAR DESIGNS (Matching Mockup 1) ─────────────────────────
export interface AnnouncementTemplateItem {
  key: string;
  name: string;
  label: string;
  bgColor: string;
  textColor: string;
  icon: string;
  iconColor: string;
  text: string;
  btnText: string;
  btnBg: string;
  btnTextColor: string;
  showButton: boolean;
  border?: string;
}

export const ANNOUNCEMENT_TEMPLATES: AnnouncementTemplateItem[] = [
  {
    key: "classic",
    name: "Classic",
    label: "Style 1 - Classic",
    bgColor: "#4A1525", // Dark burgundy / deep wine
    textColor: "#FFFFFF",
    icon: "megaphone",
    iconColor: "#FFFFFF",
    text: "2027 Winter and Spring Schedules are now open!",
    btnText: "",
    btnBg: "#FACC15",
    btnTextColor: "#18181B",
    showButton: false,
  },
  {
    key: "with_button",
    name: "With Button",
    label: "Style 2 - With Button",
    bgColor: "#522121", // Dark rust / red-brown
    textColor: "#FFFFFF",
    icon: "none",
    iconColor: "#FFFFFF",
    text: "New Student Discount — Save 20% on Enrollment!",
    btnText: "Learn More",
    btnBg: "#FACC15",
    btnTextColor: "#18181B",
    showButton: true,
  },
  {
    key: "info",
    name: "Info",
    label: "Style 3 - Info",
    bgColor: "#1D64D8", // Vibrant blue
    textColor: "#FFFFFF",
    icon: "info",
    iconColor: "#93C5FD",
    text: "Important Update — New office hours from Jan 1, 2027",
    btnText: "",
    btnBg: "#FFFFFF",
    btnTextColor: "#1D64D8",
    showButton: false,
  },
  {
    key: "success",
    name: "Success",
    label: "Style 4 - Success",
    bgColor: "#16803C", // Emerald green
    textColor: "#FFFFFF",
    icon: "check",
    iconColor: "#86EFAC",
    text: "Enroll Now for Spring 2027 — Limited Seats Available!",
    btnText: "",
    btnBg: "#FFFFFF",
    btnTextColor: "#16803C",
    showButton: false,
  },
  {
    key: "seasonal",
    name: "Seasonal",
    label: "Style 5 - Seasonal",
    bgColor: "#EA580C", // Bright orange
    textColor: "#FFFFFF",
    icon: "gift",
    iconColor: "#FED7AA",
    text: "Halloween Special — Get 15% off on all courses!",
    btnText: "View Offers",
    btnBg: "#FFFFFF",
    btnTextColor: "#C2410C",
    showButton: true,
  },
  {
    key: "minimal",
    name: "Minimal",
    label: "Style 6 - Minimal",
    bgColor: "#18181B", // Dark zinc / charcoal
    textColor: "#F4F4F5",
    icon: "shield",
    iconColor: "#A1A1AA",
    text: "COVID-19 Safety Measures — Learn about our safety guidelines.",
    btnText: "Read More",
    btnBg: "#FFFFFF",
    btnTextColor: "#18181B",
    showButton: true,
    border: "1px solid #27272A",
  },
];

// Helper to render icon component inside template card
function renderTemplateIcon(icon: string, className = "h-4 w-4") {
  switch (icon) {
    case "megaphone":
      return <Megaphone className={className} />;
    case "bell":
      return <Bell className={className} />;
    case "star":
      return <Star className={`${className} fill-current`} />;
    case "gift":
      return <Gift className={className} />;
    case "percent":
      return <Percent className={className} />;
    case "info":
      return <Info className={className} />;
    case "check":
      return <Check className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "shield":
      return <Shield className={className} />;
    default:
      return null;
  }
}

// ── POPUP DESIGNS ────────────────────────────────────────────────────────
interface PopupTemplateItem {
  key: string;
  name: string;
  label: string;
  bgColor: string;
  textColor: string;
  headline: string;
  message: string;
  btnText: string;
  btnBg: string;
  btnTextColor: string;
}

const POPUP_TEMPLATES: PopupTemplateItem[] = [
  {
    key: "discount",
    name: "Discount Offer",
    label: "Special Discount",
    bgColor: "#1A1A1E",
    textColor: "#F4F4F5",
    headline: "Get 20% Off Today!",
    message: "Subscribe now and receive an instant discount code on your next purchase.",
    btnText: "Claim Coupon",
    btnBg: "#FACC15",
    btnTextColor: "#18181B",
  },
  {
    key: "newsletter",
    name: "Newsletter",
    label: "Join Newsletter",
    bgColor: "#161B26",
    textColor: "#F4F4F5",
    headline: "Stay in the Loop",
    message: "Get weekly insights, product updates, and special tips delivered to your inbox.",
    btnText: "Subscribe Free",
    btnBg: "#3B82F6",
    btnTextColor: "#FFFFFF",
  },
  {
    key: "flash_sale",
    name: "Flash Sale",
    label: "Flash Sale Alert",
    bgColor: "#2A1414",
    textColor: "#F4F4F5",
    headline: "Flash Sale Ends Soon!",
    message: "Save up to 40% on all premium plans. Offer valid for the next 24 hours.",
    btnText: "Shop Sale",
    btnBg: "#EF4444",
    btnTextColor: "#FFFFFF",
  },
  {
    key: "minimal",
    name: "Minimal Notice",
    label: "Clean Notification",
    bgColor: "#18181B",
    textColor: "#F4F4F5",
    headline: "Important Announcement",
    message: "We have upgraded our platform with new features. Check out what is new.",
    btnText: "Learn More",
    btnBg: "#FFFFFF",
    btnTextColor: "#18181B",
  },
];

export function CustomEmbedModal(props: CustomEmbedModalProps) {
  const isFloatingPlugin = useMemo(() => {
    if (props.embedToEdit) {
      if (props.embedToEdit.displayType === "floating" || props.embedToEdit.floatingRecord) return true;
      const pt = props.embedToEdit.pluginType || "";
      if (
        [
          "contact",
          "whatsapp",
          "accessibility",
          "language",
          "chatbot",
          "announcement",
          "popup",
          "back_to_top",
          "custom_embed",
        ].includes(pt)
      ) {
        return true;
      }
      const lower = (props.embedToEdit.name || "").toLowerCase();
      if (
        lower.includes("whatsapp") ||
        lower.includes("accessibility") ||
        lower.includes("a11y") ||
        lower.includes("language") ||
        lower.includes("announcement") ||
        lower.includes("popup") ||
        lower.includes("chatbot") ||
        lower.includes("contact") ||
        lower.includes("back to top")
      ) {
        return true;
      }
    }
    if (props.initialPluginType) {
      return [
        "contact",
        "whatsapp",
        "accessibility",
        "language",
        "chatbot",
        "announcement",
        "popup",
        "back_to_top",
        "custom_embed",
      ].includes(props.initialPluginType);
    }
    return false;
  }, [props.embedToEdit, props.initialPluginType]);

  const isAnnouncement = useMemo(() => {
    if (props.embedToEdit) {
      if (props.embedToEdit.pluginType === "announcement") return true;
      const lower = (props.embedToEdit.name || "").toLowerCase();
      if (lower.includes("announcement")) return true;
      if (props.embedToEdit.floatingRecord?.type === "announcement_popup") {
        if (props.embedToEdit.floatingRecord?.config?.layout !== "modal") return true;
      }
    }
    return props.initialPluginType === "announcement";
  }, [props.embedToEdit, props.initialPluginType]);

  if (props.isOpen && isAnnouncement) {
    return (
      <AnnouncementBarModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        embedToEdit={props.embedToEdit}
        onSaved={props.onSaved}
      />
    );
  }

  if (props.isOpen && isFloatingPlugin) {
    return (
      <StandardFloatingPluginModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        embedToEdit={props.embedToEdit}
        initialPluginType={props.initialPluginType}
        onSaved={props.onSaved}
      />
    );
  }

  return <CustomEmbedModalInner {...props} />;
}

function CustomEmbedModalInner({
  isOpen,
  onClose,
  embedToEdit,
  initialPluginType,
  defaultPageId,
  onSaved,
}: CustomEmbedModalProps) {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const currentPageId = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId]?.currentPageId : null));
  const updateSection = useBuilder((s) => s.updateSection);
  const selectSection = useBuilder((s) => s.selectSection);
  const selectPage = useBuilder((s) => s.selectPage);
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // Determine active plugin type
  const pluginType = useMemo(() => {
    if (embedToEdit) {
      if (embedToEdit.pluginType) return embedToEdit.pluginType;
      const lower = embedToEdit.name.toLowerCase();
      if (lower.includes("whatsapp")) return "whatsapp";
      if (lower.includes("youtube")) return "youtube";
      if (lower.includes("map")) return "maps";
      if (lower.includes("language") || lower.includes("translate")) return "language";
      if (lower.includes("accessibility") || lower.includes("a11y")) return "accessibility";
      if (lower.includes("contact")) return "contact";
      if (lower.includes("chatbot") || lower.includes("bot")) return "chatbot";
      if (lower.includes("back to top")) return "back_to_top";
      if (lower.includes("banner") || lower.includes("announcement")) return "announcement";
      if (lower.includes("popup")) return "popup";
      return "custom_html";
    }
    return initialPluginType || "custom_html";
  }, [embedToEdit, initialPluginType]);

  // Modal Step State: 1 = Choose Design, 2 = Configure Settings, 3 = Preview & Save
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Common Form State
  const [name, setName] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings Vertical Sub-tab in Step 2
  const [activeSettingsTab, setActiveSettingsTab] = useState<
    "content" | "style" | "icon" | "link" | "visibility" | "position" | "animation"
  >("content");

  // Announcement Bar specific state
  const [selectedAnnouncementTemplate, setSelectedAnnouncementTemplate] = useState<string>("classic");
  const [announcementText, setAnnouncementText] = useState("2027 Winter and Spring Schedules are now open for enrollment!");
  const [announcementIcon, setAnnouncementIcon] = useState<string>("megaphone");
  const [announcementIconColor, setAnnouncementIconColor] = useState<string>("#FFFFFF");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [announcementLinkNewTab, setAnnouncementLinkNewTab] = useState(true);
  const [announcementBtnLabel, setAnnouncementBtnLabel] = useState("");
  const [announcementBg, setAnnouncementBg] = useState("#4A1525");
  const [announcementTextColor, setAnnouncementTextColor] = useState("#FFFFFF");
  const [announcementBtnBg, setAnnouncementBtnBg] = useState("#FACC15");
  const [announcementBtnTextColor, setAnnouncementBtnTextColor] = useState("#18181B");
  const [announcementPosition, setAnnouncementPosition] = useState<FloatingPosition>("top_fixed");
  const [announcementShowDesktop, setAnnouncementShowDesktop] = useState(true);
  const [announcementShowMobile, setAnnouncementShowMobile] = useState(true);
  const [announcementShowClose, setAnnouncementShowClose] = useState(true);
  const [announcementAnimation, setAnnouncementAnimation] = useState<"none" | "slide_down" | "fade_in">("slide_down");
  const [announcementPageTargeting, setAnnouncementPageTargeting] = useState<"all" | "custom">("all");

  // Popup specific state
  const [selectedPopupTemplate, setSelectedPopupTemplate] = useState<string>("discount");
  const [popupHeadline, setPopupHeadline] = useState("Get 20% Off Today!");
  const [popupMessage, setPopupMessage] = useState("Subscribe now and receive an instant discount code on your next purchase.");
  const [popupBtnLabel, setPopupBtnLabel] = useState("Claim Coupon");
  const [popupBg, setPopupBg] = useState("#1A1A1E");
  const [popupTextColor, setPopupTextColor] = useState("#F4F4F5");
  const [popupBtnBg, setPopupBtnBg] = useState("#FACC15");
  const [popupBtnTextColor, setPopupBtnTextColor] = useState("#18181B");

  // Floating Contact Button specific state
  const [contactPhone, setContactPhone] = useState("");
  const [contactAction, setContactAction] = useState<"phone" | "whatsapp" | "email">("phone");
  const [contactLabel, setContactLabel] = useState("Call Us");
  const [contactColor, setContactColor] = useState("#FACC15");
  const [contactTextColor, setContactTextColor] = useState("#111111");
  const [contactPosition, setContactPosition] = useState<FloatingPosition>("bottom_right");
  const [contactShowDesktop, setContactShowDesktop] = useState(true);
  const [contactShowMobile, setContactShowMobile] = useState(true);

  // WhatsApp specific state
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [waAgent, setWaAgent] = useState("Customer Support");
  const [waGreeting, setWaGreeting] = useState("Hi! How can we help you today?");
  const [waPosition, setWaPosition] = useState<FloatingPosition>("bottom_right");
  const [waColor, setWaColor] = useState("#25D366");

  // Accessibility specific state
  const [a11yPosition, setA11yPosition] = useState<FloatingPosition>("bottom_left");
  const [a11yContrast, setA11yContrast] = useState(true);
  const [a11yFontSize, setA11yFontSize] = useState(true);
  const [a11yDyslexia, setA11yDyslexia] = useState(true);
  const [a11yInvert, setA11yInvert] = useState(true);
  const [a11yColor, setA11yColor] = useState("#9333EA");

  // Language Switcher state
  const [langDefault, setLangDefault] = useState("en");
  const [langSupported, setLangSupported] = useState(["en", "es", "fr", "de"]);
  const [langPosition, setLangPosition] = useState<FloatingPosition>("bottom_left");
  const [langTheme, setLangTheme] = useState<"dark" | "light" | "glass">("dark");

  // Chatbot state
  const [botName, setBotName] = useState("AI Assistant");
  const [botWelcome, setBotWelcome] = useState("Hi there! How can I help you today?");
  const [botPosition, setBotPosition] = useState<FloatingPosition>("bottom_right");
  const [botColor, setBotColor] = useState("#2563EB");

  // YouTube Video state
  const [ytUrl, setYtUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [ytAspectRatio, setYtAspectRatio] = useState("16/9");
  const [ytMaxWidth, setYtMaxWidth] = useState("1000px");
  const [ytAutoplay, setYtAutoplay] = useState(false);
  const [ytMute, setYtMute] = useState(false);
  const [ytControls, setYtControls] = useState(true);

  // Google Maps state
  const [mapAddress, setMapAddress] = useState("");
  const [mapHeight, setMapHeight] = useState("380px");
  const [mapMaxWidth, setMapMaxWidth] = useState("1000px");
  const [mapZoom, setMapZoom] = useState(13);

  // Custom HTML state
  const [customPlacement, setCustomPlacement] = useState<PlacementChoice>("site_wide_header");
  const [customHtml, setCustomHtml] = useState("");

  // Initialize or populate form
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit) {
      // Editing existing plugin -> open directly at Step 2 (Configure Settings)
      setStep(2);
      setName(embedToEdit.name);

      if (embedToEdit.floatingRecord) {
        const fw = embedToEdit.floatingRecord;
        const cfg = fw.config || {};

        if (pluginType === "announcement" || fw.type === "announcement_popup") {
          setSelectedAnnouncementTemplate(cfg.template || "classic");
          setAnnouncementText(cfg.text || cfg.message || cfg.headline || "Special Announcement");
          setAnnouncementIcon(cfg.icon || "megaphone");
          setAnnouncementIconColor(cfg.iconColor || cfg.textColor || "#FFFFFF");
          setAnnouncementLink(cfg.linkUrl || cfg.ctaUrl || "");
          setAnnouncementLinkNewTab(cfg.linkNewTab !== false);
          setAnnouncementBtnLabel(cfg.ctaLabel || cfg.buttonLabel || cfg.buttonText || "");
          setAnnouncementBg(cfg.backgroundColor || "#4A1525");
          setAnnouncementTextColor(cfg.textColor || "#FFFFFF");
          setAnnouncementBtnBg(cfg.btnBgColor || cfg.buttonBgColor || "#FACC15");
          setAnnouncementBtnTextColor(cfg.btnTextColor || cfg.buttonTextColor || "#18181B");
          setAnnouncementPosition(fw.position || "top_fixed");
          setAnnouncementShowDesktop(fw.showOnDesktop ?? true);
          setAnnouncementShowMobile(fw.showOnMobile ?? true);
          setAnnouncementShowClose(cfg.showCloseButton !== false);
          setAnnouncementAnimation(cfg.animation || "slide_down");
          setAnnouncementPageTargeting(fw.pageTargeting === "custom" ? "custom" : "all");
        } else if (pluginType === "popup") {
          setSelectedPopupTemplate(cfg.template || "discount");
          setPopupHeadline(cfg.headline || "Special Offer");
          setPopupMessage(cfg.message || cfg.text || "");
          setPopupBtnLabel(cfg.ctaLabel || cfg.buttonLabel || "Learn More");
          setPopupBg(cfg.backgroundColor || "#1A1A1E");
          setPopupTextColor(cfg.textColor || "#F4F4F5");
        } else if (pluginType === "contact" || fw.type === "floating_contact") {
          setContactPhone(cfg.phoneNumber || cfg.actionValue || "");
          setContactAction(cfg.actionType || "phone");
          setContactLabel(cfg.label || "Call Us");
          setContactColor(cfg.buttonColor || "#FACC15");
          setContactTextColor(cfg.textColor || "#111111");
          setContactPosition(fw.position || "bottom_right");
          setContactShowDesktop(fw.showOnDesktop ?? true);
          setContactShowMobile(fw.showOnMobile ?? true);
        } else if (pluginType === "whatsapp" || fw.type === "whatsapp_chat") {
          setWaPhone(cfg.phoneNumber || "");
          setWaMessage(cfg.prefilledMessage || "");
          setWaAgent(cfg.agentName || "Customer Support");
          setWaGreeting(cfg.greetingText || "");
          setWaPosition(fw.position || "bottom_right");
          setWaColor(cfg.buttonColor || "#25D366");
        } else if (pluginType === "accessibility" || fw.type === "accessibility") {
          setA11yPosition(fw.position || "bottom_left");
          setA11yContrast(cfg.features?.highContrast ?? true);
          setA11yFontSize(cfg.features?.textResize ?? true);
          setA11yDyslexia(cfg.features?.readableFont ?? true);
          setA11yInvert(cfg.features?.invertColors ?? true);
          setA11yColor(cfg.accentColor || "#9333EA");
        } else if (pluginType === "language" || fw.type === "language_switcher") {
          setLangDefault(cfg.defaultLanguage || "en");
          setLangSupported(cfg.supportedLanguages || ["en", "es", "fr", "de"]);
          setLangPosition(fw.position || "bottom_left");
          setLangTheme(cfg.theme || "dark");
        } else if (pluginType === "chatbot" || fw.type === "chatbot") {
          setBotName(cfg.botName || "AI Assistant");
          setBotWelcome(cfg.welcomeMessage || "Hi there! How can I help you today?");
          setBotPosition(fw.position || "bottom_right");
          setBotColor(cfg.primaryColor || "#2563EB");
        } else {
          setCustomHtml(fw.snippetHtml || cfg.html || "");
        }
      }

      if (embedToEdit.sectionId && embedToEdit.html) {
        if (pluginType === "youtube") {
          const match = embedToEdit.html.match(/src=["']([^"']+)["']/i);
          if (match) setYtUrl(match[1]);
        } else if (pluginType === "maps") {
          const match = embedToEdit.html.match(/q=([^&"']+)/i);
          if (match) setMapAddress(decodeURIComponent(match[1]));
        } else {
          setCustomHtml(embedToEdit.html);
        }
      }
    } else {
      // Creation mode -> start at Step 1 (Choose Design) for announcement, popup, etc.
      // For YouTube, Maps, Custom HTML which have no template gallery, start at Step 2
      if (["youtube", "maps", "custom_html"].includes(pluginType)) {
        setStep(2);
      } else {
        setStep(1);
      }

      switch (pluginType) {
        case "announcement":
          setName("Announcement Bar");
          applyAnnouncementTemplate(ANNOUNCEMENT_TEMPLATES[0]);
          break;
        case "popup":
          setName("Announcement Popup");
          applyPopupTemplate(POPUP_TEMPLATES[0]);
          break;
        case "contact":
          setName("Floating Contact Button");
          setContactPhone("");
          setContactAction("phone");
          setContactLabel("Call Us");
          setContactPosition("bottom_right");
          break;
        case "whatsapp":
          setName("WhatsApp Live Chat");
          setWaPhone("");
          setWaMessage("");
          setWaGreeting("Hi! How can we help you today?");
          setWaPosition("bottom_right");
          break;
        case "accessibility":
          setName("Accessibility Toolbar");
          setA11yPosition("bottom_left");
          break;
        case "language":
          setName("Language Switcher");
          setLangPosition("bottom_left");
          break;
        case "chatbot":
          setName("AI Chatbot");
          setBotPosition("bottom_right");
          break;
        case "youtube":
          setName("YouTube Video");
          break;
        case "maps":
          setName("Google Maps");
          break;
        default:
          setName("Custom HTML / Embed");
          setCustomHtml("");
          setCustomPlacement("site_wide_header");
          break;
      }
    }
    setPreviewDevice("desktop");
    setActiveSettingsTab("content");
  }, [isOpen, embedToEdit, pluginType]);

  // Apply chosen template to form fields
  const applyAnnouncementTemplate = (tpl: AnnouncementTemplateItem) => {
    setSelectedAnnouncementTemplate(tpl.key);
    setAnnouncementBg(tpl.bgColor);
    setAnnouncementTextColor(tpl.textColor);
    setAnnouncementIcon(tpl.icon);
    setAnnouncementIconColor(tpl.iconColor);
    setAnnouncementText(tpl.text);
    setAnnouncementBtnLabel(tpl.btnText);
    setAnnouncementBtnBg(tpl.btnBg);
    setAnnouncementBtnTextColor(tpl.btnTextColor);
  };

  const applyPopupTemplate = (tpl: PopupTemplateItem) => {
    setSelectedPopupTemplate(tpl.key);
    setPopupBg(tpl.bgColor);
    setPopupTextColor(tpl.textColor);
    setPopupHeadline(tpl.headline);
    setPopupMessage(tpl.message);
    setPopupBtnLabel(tpl.btnText);
    setPopupBtnBg(tpl.btnBg);
    setPopupBtnTextColor(tpl.btnTextColor);
  };

  if (!isOpen || !project) return null;

  const pages = project.pages || [];
  const targetPageId = defaultPageId || currentPageId || pages[0]?.id;

  // Validation before advancing to Step 3
  const handleValidateStep2 = () => {
    if (pluginType === "announcement") {
      if (!announcementText.trim()) {
        toast.error("Please enter announcement text");
        return false;
      }
    } else if (pluginType === "popup") {
      if (!popupHeadline.trim() && !popupMessage.trim()) {
        toast.error("Please enter popup headline or message");
        return false;
      }
    } else if (pluginType === "contact") {
      if (!contactPhone.trim()) {
        toast.error("Please enter a phone number or target");
        return false;
      }
    } else if (pluginType === "whatsapp") {
      if (!waPhone.trim()) {
        toast.error("Please enter a WhatsApp phone number");
        return false;
      }
    } else if (pluginType === "youtube") {
      if (!ytUrl.trim()) {
        toast.error("Please enter a YouTube video URL");
        return false;
      }
    } else if (pluginType === "maps") {
      if (!mapAddress.trim()) {
        toast.error("Please enter a location or address");
        return false;
      }
    } else if (pluginType === "custom_html") {
      if (!customHtml.trim()) {
        toast.error("Please enter HTML or script code");
        return false;
      }
    }
    return true;
  };

  // Save handler (Step 3 Save Plugin button)
  const handleSave = () => {
    if (isSubmitting) return;

    if (!handleValidateStep2()) {
      setStep(2);
      return;
    }

    const finalName = name.trim() || "Plugin";
    setIsSubmitting(true);

    try {
      // 1. ANNOUNCEMENT BAR
      if (pluginType === "announcement") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-ann-${nanoid(8)}`,
          type: "announcement_popup",
          name: finalName,
          enabled: true,
          position: announcementPosition,
          offsetX: 0,
          offsetY: 0,
          showOnDesktop: announcementShowDesktop,
          showOnMobile: announcementShowMobile,
          pageTargeting: announcementPageTargeting,
          targetedPages: announcementPageTargeting === "custom" && targetPageId ? [targetPageId] : undefined,
          config: {
            template: selectedAnnouncementTemplate,
            text: announcementText.trim(),
            icon: announcementIcon,
            iconColor: announcementIconColor,
            linkUrl: announcementLink.trim(),
            linkNewTab: announcementLinkNewTab,
            ctaLabel: announcementBtnLabel.trim(),
            buttonText: announcementBtnLabel.trim(),
            backgroundColor: announcementBg,
            textColor: announcementTextColor,
            btnBgColor: announcementBtnBg,
            btnTextColor: announcementBtnTextColor,
            showCloseButton: announcementShowClose,
            animation: announcementAnimation,
            layout: "banner",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Announcement Bar`);
        onSaved?.();
        onClose();
        return;
      }

      // 2. POPUP
      if (pluginType === "popup") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-pop-${nanoid(8)}`,
          type: "announcement_popup",
          name: finalName,
          enabled: true,
          position: "bottom_right",
          offsetX: 24,
          offsetY: 24,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {
            template: selectedPopupTemplate,
            headline: popupHeadline.trim(),
            text: popupMessage.trim(),
            ctaLabel: popupBtnLabel.trim(),
            backgroundColor: popupBg,
            textColor: popupTextColor,
            btnBgColor: popupBtnBg,
            btnTextColor: popupBtnTextColor,
            layout: "modal",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Popup`);
        onSaved?.();
        onClose();
        return;
      }

      // 3. CONTACT BUTTON
      if (pluginType === "contact") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-contact-${nanoid(8)}`,
          type: "floating_contact",
          name: finalName,
          enabled: true,
          position: contactPosition,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: contactShowDesktop,
          showOnMobile: contactShowMobile,
          pageTargeting: "all",
          config: {
            actionType: contactAction,
            actionValue: contactPhone.trim(),
            phoneNumber: contactPhone.trim(),
            label: contactLabel.trim(),
            buttonColor: contactColor,
            textColor: contactTextColor,
            showDesktop: contactShowDesktop,
            showMobile: contactShowMobile,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Floating Contact Button`);
        onSaved?.();
        onClose();
        return;
      }

      // 4. WHATSAPP
      if (pluginType === "whatsapp") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-wa-${nanoid(8)}`,
          type: "whatsapp_chat",
          name: finalName,
          enabled: true,
          position: waPosition,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {
            phoneNumber: waPhone.trim(),
            prefilledMessage: waMessage.trim(),
            agentName: waAgent.trim(),
            greetingText: waGreeting.trim(),
            buttonColor: waColor,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved WhatsApp Live Chat`);
        onSaved?.();
        onClose();
        return;
      }

      // 5. ACCESSIBILITY
      if (pluginType === "accessibility") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-a11y-${nanoid(8)}`,
          type: "accessibility",
          name: finalName,
          enabled: true,
          position: a11yPosition,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {
            accentColor: a11yColor,
            features: {
              contrast: a11yContrast,
              fontSize: a11yFontSize,
              dyslexia: a11yDyslexia,
              invert: a11yInvert,
            },
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Accessibility Toolbar`);
        onSaved?.();
        onClose();
        return;
      }

      // 6. LANGUAGE SWITCHER
      if (pluginType === "language") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-lang-${nanoid(8)}`,
          type: "language_switcher",
          name: finalName,
          enabled: true,
          position: langPosition,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {
            defaultLanguage: langDefault,
            supportedLanguages: langSupported,
            theme: langTheme,
            showFlags: true,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Language Switcher`);
        onSaved?.();
        onClose();
        return;
      }

      // 7. CHATBOT
      if (pluginType === "chatbot") {
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-bot-${nanoid(8)}`,
          type: "chatbot",
          name: finalName,
          enabled: true,
          position: botPosition,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {
            botName: botName.trim() || "AI Assistant",
            welcomeMessage: botWelcome.trim(),
            primaryColor: botColor,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id);
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved AI Chatbot`);
        onSaved?.();
        onClose();
        return;
      }

      // 8. YOUTUBE VIDEO
      if (pluginType === "youtube") {
        const sec = createYouTubeSection({
          id: embedToEdit?.sectionId,
          name: finalName,
          url: ytUrl.trim(),
          aspectRatio: ytAspectRatio,
          maxWidth: ytMaxWidth,
          autoplay: ytAutoplay,
          mute: ytMute,
          showControls: ytControls,
        });

        if (embedToEdit?.sectionId) {
          updateSection(embedToEdit.sectionId, {
            name: sec.name,
            html: sec.html,
            widgetInstance: sec.widgetInstance,
          });
        } else {
          useBuilder.setState((s) => {
            const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
            if (!cur) return s;
            const updatedPages = (cur.pages || []).map((p) => {
              if (p.id === targetPageId) {
                return { ...p, sections: [...(p.sections || []), sec] };
              }
              return p;
            });
            return {
              projects: {
                ...s.projects,
                [cur.id]: { ...cur, pages: updatedPages },
              },
            };
          });
          if (targetPageId) selectPage(targetPageId);
          selectSection(sec.id);
        }

        persistWithStatus();
        toast.success(`Added YouTube Video to page`);
        onSaved?.();
        onClose();
        return;
      }

      // 9. GOOGLE MAPS
      if (pluginType === "maps") {
        const sec = createMapSection({
          id: embedToEdit?.sectionId,
          name: finalName,
          address: mapAddress.trim(),
          height: mapHeight,
          maxWidth: mapMaxWidth,
          zoom: mapZoom,
        });

        if (embedToEdit?.sectionId) {
          updateSection(embedToEdit.sectionId, {
            name: sec.name,
            html: sec.html,
            widgetInstance: sec.widgetInstance,
          });
        } else {
          useBuilder.setState((s) => {
            const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
            if (!cur) return s;
            const updatedPages = (cur.pages || []).map((p) => {
              if (p.id === targetPageId) {
                return { ...p, sections: [...(p.sections || []), sec] };
              }
              return p;
            });
            return {
              projects: {
                ...s.projects,
                [cur.id]: { ...cur, pages: updatedPages },
              },
            };
          });
          if (targetPageId) selectPage(targetPageId);
          selectSection(sec.id);
        }

        persistWithStatus();
        toast.success(`Added Google Maps to page`);
        onSaved?.();
        onClose();
        return;
      }

      // 10. CUSTOM HTML
      if (pluginType === "custom_html") {
        const isFloating = customPlacement.startsWith("floating_");
        if (isFloating) {
          const targetPos: FloatingPosition =
            customPlacement === "floating_bottom_left"
              ? "bottom_left"
              : customPlacement === "floating_top_right"
              ? "top_right"
              : customPlacement === "floating_top_left"
              ? "top_left"
              : "bottom_right";

          const fwRec: FloatingWidgetRecord = {
            id: embedToEdit?.floatingId || `fw-custom-${nanoid(8)}`,
            type: "custom_embed",
            name: finalName,
            enabled: true,
            position: targetPos,
            offsetX: 20,
            offsetY: 20,
            showOnDesktop: true,
            showOnMobile: true,
            pageTargeting: "all",
            snippetHtml: customHtml.trim(),
            config: { html: customHtml.trim() },
            createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
            updatedAt: Date.now(),
          };

          useBuilder.setState((s) => {
            const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
            if (!cur) return s;
            const existing = cur.floatingWidgets || [];
            const idx = existing.findIndex((w) => w.id === fwRec.id);
            const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
            return {
              projects: {
                ...s.projects,
                [cur.id]: { ...cur, floatingWidgets: next },
              },
            };
          });
        } else {
          // Page section
          const secId = embedToEdit?.sectionId || `sec-${nanoid(8)}`;
          const newSec = createCustomHtmlSection({
            id: secId,
            name: finalName,
            html: customHtml.trim(),
          });
          useBuilder.setState((s) => {
            const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
            if (!cur) return s;
            const updatedPages = (cur.pages || []).map((p) => {
              if (p.id === targetPageId) {
                return { ...p, sections: [...(p.sections || []), newSec] };
              }
              return p;
            });
            return {
              projects: {
                ...s.projects,
                [cur.id]: { ...cur, pages: updatedPages },
              },
            };
          });
          if (targetPageId) selectPage(targetPageId);
          selectSection(secId);
        }

        persistWithStatus();
        toast.success(`Saved "${finalName}"`);
        onSaved?.();
        onClose();
        return;
      }
    } catch (err: any) {
      console.error("[CustomEmbedModal] Save error:", err);
      toast.error(err?.message || "Failed to save plugin");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Header Title & Subtitle helper
  const getHeaderInfo = () => {
    const pluginTitle =
      pluginType === "announcement"
        ? "Announcement Bar"
        : pluginType === "popup"
        ? "Popup"
        : pluginType === "whatsapp"
        ? "WhatsApp Chat"
        : pluginType === "contact"
        ? "Floating Contact"
        : pluginType === "accessibility"
        ? "Accessibility Toolbar"
        : pluginType === "language"
        ? "Language Switcher"
        : pluginType === "chatbot"
        ? "AI Chatbot"
        : pluginType === "youtube"
        ? "YouTube Video"
        : pluginType === "maps"
        ? "Google Maps"
        : "Custom Plugin";

    if (step === 1) {
      return {
        title: `Add ${pluginTitle}`,
        subtitle: `Choose a design for your ${pluginTitle.toLowerCase()}.`,
      };
    } else if (step === 2) {
      return {
        title: `Add ${pluginTitle}`,
        subtitle: `Customize your ${pluginTitle.toLowerCase()} settings.`,
      };
    } else {
      return {
        title: `Add ${pluginTitle}`,
        subtitle: `Preview your ${pluginTitle.toLowerCase()} and save.`,
      };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2B30] bg-[#121214] text-[#F5F5F5] shadow-2xl overflow-hidden">
        {/* ── TOP HEADER (Matching Mockups 1, 2, 3) ───────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#222225] bg-[#161619] px-6 py-4">
          <div className="flex items-center gap-3.5">
            {/* Top Left Plugin Icon */}
            {pluginType === "announcement" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/15 border border-[#D97706]/30 text-[#FACC15] shadow-xs">
                <Megaphone className="h-5 w-5" />
              </span>
            ) : pluginType === "popup" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-xs">
                <Layers className="h-5 w-5" />
              </span>
            ) : pluginType === "whatsapp" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] shadow-xs">
                <MessageCircle className="h-5 w-5" />
              </span>
            ) : pluginType === "contact" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0284C7]/15 border border-[#0284C7]/30 text-[#38BDF8] shadow-xs">
                <Phone className="h-5 w-5" />
              </span>
            ) : pluginType === "accessibility" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/15 border border-purple-600/30 text-purple-300 shadow-xs">
                <Accessibility className="h-5 w-5" />
              </span>
            ) : pluginType === "language" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 border border-blue-600/30 text-blue-300 shadow-xs">
                <Globe className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-[#FACC15] shadow-xs">
                <Code2 className="h-5 w-5" />
              </span>
            )}

            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {headerInfo.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {headerInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── STEP 1: CHOOSE A DESIGN (Matching Mockup 1) ─────────────── */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {pluginType === "announcement" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ANNOUNCEMENT_TEMPLATES.map((tpl) => {
                  const isSelected = selectedAnnouncementTemplate === tpl.key;
                  return (
                    <div
                      key={tpl.key}
                      onClick={() => applyAnnouncementTemplate(tpl)}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-2 border-[#FACC15] bg-[#1A1A1E] shadow-xl shadow-[#FACC15]/5"
                          : "border-zinc-800 bg-[#161619] hover:border-zinc-700 hover:bg-[#19191D]"
                      }`}
                    >
                      {/* Checkmark Badge for Selected Card */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 shadow-md z-10">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Miniature Announcement Bar Preview */}
                      <div
                        style={{
                          backgroundColor: tpl.bgColor,
                          color: tpl.textColor,
                          border: tpl.border,
                        }}
                        className="flex min-h-[58px] items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-md"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {tpl.icon !== "none" && (
                            <span
                              className="shrink-0 flex items-center justify-center"
                              style={{ color: tpl.iconColor }}
                            >
                              {renderTemplateIcon(tpl.icon, "h-4 w-4")}
                            </span>
                          )}
                          <span className="text-xs font-semibold truncate leading-tight">
                            {tpl.text}
                          </span>
                        </div>
                        {tpl.showButton && tpl.btnText && (
                          <span
                            style={{
                              backgroundColor: tpl.btnBg,
                              color: tpl.btnTextColor,
                            }}
                            className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold shadow-xs whitespace-nowrap"
                          >
                            {tpl.btnText}
                          </span>
                        )}
                      </div>

                      {/* Card Label */}
                      <span className="mt-3 text-xs font-bold text-zinc-300 group-hover:text-white transition">
                        {tpl.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : pluginType === "popup" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POPUP_TEMPLATES.map((tpl) => {
                  const isSelected = selectedPopupTemplate === tpl.key;
                  return (
                    <div
                      key={tpl.key}
                      onClick={() => applyPopupTemplate(tpl)}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-2 border-[#FACC15] bg-[#1A1A1E] shadow-xl shadow-[#FACC15]/5"
                          : "border-zinc-800 bg-[#161619] hover:border-zinc-700 hover:bg-[#19191D]"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 shadow-md z-10">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                      <div
                        style={{
                          backgroundColor: tpl.bgColor,
                          color: tpl.textColor,
                        }}
                        className="rounded-xl p-4 border border-zinc-700/60 shadow-md space-y-2"
                      >
                        <h4 className="text-xs font-bold">{tpl.headline}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {tpl.message}
                        </p>
                        <span
                          style={{
                            backgroundColor: tpl.btnBg,
                            color: tpl.btnTextColor,
                          }}
                          className="inline-block rounded-md px-2.5 py-1 text-[10px] font-bold shadow-xs mt-1"
                        >
                          {tpl.btnText}
                        </span>
                      </div>
                      <span className="mt-3 text-xs font-bold text-zinc-300 group-hover:text-white transition">
                        {tpl.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-400 text-sm">
                Click Next to configure settings for {name || "this plugin"}.
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: CONFIGURE SETTINGS (Matching Mockup 2) ──────────── */}
        {step === 2 && (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Vertical Sub-Tabs */}
            <div className="w-44 shrink-0 border-r border-[#222225] bg-[#141416] p-3 space-y-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => setActiveSettingsTab("content")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "content"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Megaphone className="h-4 w-4" />
                <span>Content</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab("style")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "style"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Palette className="h-4 w-4" />
                <span>Style</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab("icon")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "icon"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Icon</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab("link")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "link"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <LinkIcon className="h-4 w-4" />
                <span>Link</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab("visibility")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "visibility"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Visibility</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab("position")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "position"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Compass className="h-4 w-4" />
                <span>Position</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsTab("animation")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  activeSettingsTab === "animation"
                    ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Animation</span>
              </button>
            </div>

            {/* Right Settings Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#121214]">
              {pluginType === "announcement" ? (
                <>
                  {/* TAB: CONTENT */}
                  {activeSettingsTab === "content" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Announcement Text
                        </label>
                        <textarea
                          rows={3}
                          value={announcementText}
                          onChange={(e) => setAnnouncementText(e.target.value)}
                          placeholder="2027 Winter and Spring Schedules are now open for enrollment!"
                          className="w-full rounded-xl border border-zinc-800 bg-[#17171A] p-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20 leading-relaxed"
                        />
                      </div>

                      {/* Icon selector pills */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Icon
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { id: "none", label: "None", icon: CircleOff },
                            { id: "megaphone", label: "Megaphone", icon: Megaphone },
                            { id: "bell", label: "Bell", icon: Bell },
                            { id: "star", label: "Star", icon: Star },
                            { id: "gift", label: "Gift", icon: Gift },
                            { id: "percent", label: "Percent", icon: Percent },
                            { id: "info", label: "Info", icon: Info },
                            { id: "check", label: "Check", icon: Check },
                            { id: "shield", label: "Shield", icon: Shield },
                          ].map((ic) => {
                            const isSelected = announcementIcon === ic.id;
                            const IconCmp = ic.icon;
                            return (
                              <button
                                key={ic.id}
                                type="button"
                                onClick={() => setAnnouncementIcon(ic.id)}
                                title={ic.label}
                                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                                  isSelected
                                    ? "border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15] shadow-sm"
                                    : "border-zinc-800 bg-[#17171A] text-zinc-400 hover:text-white hover:border-zinc-700"
                                }`}
                              >
                                <IconCmp className="h-4 w-4" />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Link URL (Optional) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Link (Optional)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={announcementLink}
                            onChange={(e) => setAnnouncementLink(e.target.value)}
                            placeholder="https://"
                            className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                          />
                          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={announcementLinkNewTab}
                              onChange={(e) => setAnnouncementLinkNewTab(e.target.checked)}
                              className="rounded border-zinc-700 text-[#FACC15] focus:ring-0"
                            />
                            <span>Open in new tab</span>
                          </label>
                        </div>
                      </div>

                      {/* Button Text (Optional) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Button Text (Optional)
                        </label>
                        <input
                          type="text"
                          value={announcementBtnLabel}
                          onChange={(e) => setAnnouncementBtnLabel(e.target.value)}
                          placeholder="Learn More"
                          className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB: STYLE */}
                  {activeSettingsTab === "style" && (
                    <div className="space-y-4">
                      {/* Background Color */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Background Color
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={announcementBg}
                            onChange={(e) => setAnnouncementBg(e.target.value)}
                            className="h-9 w-12 rounded-lg border border-zinc-800 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={announcementBg}
                            onChange={(e) => setAnnouncementBg(e.target.value)}
                            className="h-9 w-28 rounded-xl border border-zinc-800 bg-[#17171A] px-3 font-mono text-xs text-zinc-100"
                          />
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              "#4A1525",
                              "#522121",
                              "#1D64D8",
                              "#16803C",
                              "#EA580C",
                              "#18181B",
                              "#09090B",
                              "#D97706",
                            ].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setAnnouncementBg(c)}
                                style={{ backgroundColor: c }}
                                className="h-6 w-6 rounded-full border border-white/20 transition hover:scale-110"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Text Color */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Text Color
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={announcementTextColor}
                            onChange={(e) => setAnnouncementTextColor(e.target.value)}
                            className="h-9 w-12 rounded-lg border border-zinc-800 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={announcementTextColor}
                            onChange={(e) => setAnnouncementTextColor(e.target.value)}
                            className="h-9 w-28 rounded-xl border border-zinc-800 bg-[#17171A] px-3 font-mono text-xs text-zinc-100"
                          />
                        </div>
                      </div>

                      {/* Icon Color */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Icon Color
                        </label>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={announcementIconColor}
                            onChange={(e) => setAnnouncementIconColor(e.target.value)}
                            className="h-9 w-12 rounded-lg border border-zinc-800 bg-transparent cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={announcementIconColor}
                            onChange={(e) => setAnnouncementIconColor(e.target.value)}
                            className="h-9 w-28 rounded-xl border border-zinc-800 bg-[#17171A] px-3 font-mono text-xs text-zinc-100"
                          />
                        </div>
                      </div>

                      {/* Button Colors */}
                      <div className="rounded-xl border border-zinc-800 bg-[#161619] p-3.5 space-y-3">
                        <span className="text-xs font-bold text-zinc-300">
                          Button Appearance
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">
                              Button Background
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={announcementBtnBg}
                                onChange={(e) => setAnnouncementBtnBg(e.target.value)}
                                className="h-8 w-10 rounded border border-zinc-700 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={announcementBtnBg}
                                onChange={(e) => setAnnouncementBtnBg(e.target.value)}
                                className="h-8 w-24 rounded-lg border border-zinc-800 bg-[#17171A] px-2 font-mono text-xs text-zinc-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] text-zinc-400 mb-1">
                              Button Text Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={announcementBtnTextColor}
                                onChange={(e) => setAnnouncementBtnTextColor(e.target.value)}
                                className="h-8 w-10 rounded border border-zinc-700 bg-transparent cursor-pointer"
                              />
                              <input
                                type="text"
                                value={announcementBtnTextColor}
                                onChange={(e) => setAnnouncementBtnTextColor(e.target.value)}
                                className="h-8 w-24 rounded-lg border border-zinc-800 bg-[#17171A] px-2 font-mono text-xs text-zinc-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: ICON */}
                  {activeSettingsTab === "icon" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Select Icon
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { id: "none", label: "No Icon", icon: CircleOff },
                            { id: "megaphone", label: "Megaphone", icon: Megaphone },
                            { id: "bell", label: "Bell", icon: Bell },
                            { id: "star", label: "Star", icon: Star },
                            { id: "gift", label: "Gift", icon: Gift },
                            { id: "percent", label: "Percent", icon: Percent },
                            { id: "info", label: "Information", icon: Info },
                            { id: "check", label: "Checkmark", icon: Check },
                            { id: "shield", label: "Shield / Security", icon: Shield },
                          ].map((ic) => {
                            const isSelected = announcementIcon === ic.id;
                            const IconCmp = ic.icon;
                            return (
                              <button
                                key={ic.id}
                                type="button"
                                onClick={() => setAnnouncementIcon(ic.id)}
                                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                                  isSelected
                                    ? "border-[#FACC15] bg-[#FACC15]/10 text-white"
                                    : "border-zinc-800 bg-[#17171A] text-zinc-400 hover:text-white hover:border-zinc-700"
                                }`}
                              >
                                <IconCmp className="h-4 w-4 shrink-0 text-[#FACC15]" />
                                <span className="text-xs font-semibold truncate">{ic.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: LINK */}
                  {activeSettingsTab === "link" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Call-to-Action Link URL
                        </label>
                        <input
                          type="url"
                          value={announcementLink}
                          onChange={(e) => setAnnouncementLink(e.target.value)}
                          placeholder="https://example.com/special-offer"
                          className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#161619] p-3.5">
                        <div>
                          <p className="text-xs font-bold text-white">Open in New Tab</p>
                          <p className="text-[11px] text-zinc-400">Target _blank for external URLs</p>
                        </div>
                        <Switch
                          checked={announcementLinkNewTab}
                          onCheckedChange={setAnnouncementLinkNewTab}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Button Text Label
                        </label>
                        <input
                          type="text"
                          value={announcementBtnLabel}
                          onChange={(e) => setAnnouncementBtnLabel(e.target.value)}
                          placeholder="Learn More"
                          className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB: VISIBILITY */}
                  {activeSettingsTab === "visibility" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#161619] p-3.5">
                        <div>
                          <p className="text-xs font-bold text-white">Show on Desktop</p>
                          <p className="text-[11px] text-zinc-400">Display on screens larger than 768px</p>
                        </div>
                        <Switch
                          checked={announcementShowDesktop}
                          onCheckedChange={setAnnouncementShowDesktop}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#161619] p-3.5">
                        <div>
                          <p className="text-xs font-bold text-white">Show on Mobile</p>
                          <p className="text-[11px] text-zinc-400">Display on smartphones and compact screens</p>
                        </div>
                        <Switch
                          checked={announcementShowMobile}
                          onCheckedChange={setAnnouncementShowMobile}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#161619] p-3.5">
                        <div>
                          <p className="text-xs font-bold text-white">Dismiss / Close Button</p>
                          <p className="text-[11px] text-zinc-400">Allow visitors to close the announcement bar (✕)</p>
                        </div>
                        <Switch
                          checked={announcementShowClose}
                          onCheckedChange={setAnnouncementShowClose}
                        />
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-[#161619] p-3.5 space-y-2">
                        <p className="text-xs font-bold text-white">Page Targeting</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setAnnouncementPageTargeting("all")}
                            className={`rounded-lg py-2 text-xs font-bold transition ${
                              announcementPageTargeting === "all"
                                ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                                : "bg-[#18181C] text-zinc-400 hover:text-white"
                            }`}
                          >
                            All Pages
                          </button>
                          <button
                            type="button"
                            onClick={() => setAnnouncementPageTargeting("custom")}
                            className={`rounded-lg py-2 text-xs font-bold transition ${
                              announcementPageTargeting === "custom"
                                ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                                : "bg-[#18181C] text-zinc-400 hover:text-white"
                            }`}
                          >
                            Current Page Only
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: POSITION */}
                  {activeSettingsTab === "position" && (
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Announcement Bar Placement
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAnnouncementPosition("top_fixed")}
                          className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all ${
                            announcementPosition === "top_fixed"
                              ? "border-2 border-[#FACC15] bg-[#1A1A1E] text-white shadow-md"
                              : "border-zinc-800 bg-[#161619] text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-[#FACC15]">
                            <ArrowUp className="h-5 w-5" />
                          </span>
                          <span className="text-xs font-bold text-white">Top of Website</span>
                          <span className="text-[11px] text-zinc-400">
                            Sticks to the very top above the navbar
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAnnouncementPosition("bottom_fixed")}
                          className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all ${
                            announcementPosition === "bottom_fixed"
                              ? "border-2 border-[#FACC15] bg-[#1A1A1E] text-white shadow-md"
                              : "border-zinc-800 bg-[#161619] text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-[#FACC15]">
                            <Compass className="h-5 w-5" />
                          </span>
                          <span className="text-xs font-bold text-white">Bottom of Website</span>
                          <span className="text-[11px] text-zinc-400">
                            Fixed banner floating along bottom edge
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB: ANIMATION */}
                  {activeSettingsTab === "animation" && (
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Entrance Animation
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "none", label: "None", desc: "Shows immediately" },
                          { id: "slide_down", label: "Slide Down", desc: "Smooth entrance from top" },
                          { id: "fade_in", label: "Fade In", desc: "Gradual opacity fade" },
                        ].map((a) => {
                          const isSelected = announcementAnimation === a.id;
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => setAnnouncementAnimation(a.id as any)}
                              className={`rounded-2xl border p-4 text-left transition-all ${
                                isSelected
                                  ? "border-2 border-[#FACC15] bg-[#1A1A1E] shadow-sm text-white"
                                  : "border-zinc-800 bg-[#161619] text-zinc-400 hover:text-white hover:border-zinc-700"
                              }`}
                            >
                              <span className="text-xs font-bold block text-white mb-0.5">{a.label}</span>
                              <span className="text-[11px] text-zinc-400">{a.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : pluginType === "contact" ? (
                /* CONTACT SETTINGS */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Phone Number or Target
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={contactLabel}
                      onChange={(e) => setContactLabel(e.target.value)}
                      placeholder="Call Us"
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Button Color
                    </label>
                    <input
                      type="color"
                      value={contactColor}
                      onChange={(e) => setContactColor(e.target.value)}
                      className="h-9 w-12 rounded-lg border border-zinc-800 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              ) : pluginType === "whatsapp" ? (
                /* WHATSAPP SETTINGS */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      WhatsApp Phone Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Support Agent Name
                    </label>
                    <input
                      type="text"
                      value={waAgent}
                      onChange={(e) => setWaAgent(e.target.value)}
                      placeholder="Customer Support"
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Pre-filled Message
                    </label>
                    <input
                      type="text"
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Hello, I have a question about your services."
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              ) : pluginType === "youtube" ? (
                /* YOUTUBE SETTINGS */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </div>
              ) : pluginType === "maps" ? (
                /* MAPS SETTINGS */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Location Address or Place Name
                    </label>
                    <input
                      type="text"
                      value={mapAddress}
                      onChange={(e) => setMapAddress(e.target.value)}
                      placeholder="1600 Amphitheatre Parkway, Mountain View, CA"
                      className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] px-3 text-xs text-zinc-100 outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </div>
              ) : (
                /* CUSTOM HTML */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      HTML / Script Code
                    </label>
                    <textarea
                      rows={6}
                      value={customHtml}
                      onChange={(e) => setCustomHtml(e.target.value)}
                      placeholder="<script>...</script> or <div>...</div>"
                      className="w-full rounded-xl border border-zinc-800 bg-[#17171A] p-3 font-mono text-xs text-zinc-100 outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: PREVIEW & SAVE (Matching Mockup 3) ──────────────── */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#121214]">
            {/* Device Switcher Controls */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Device Preview</p>
                <p className="text-[11px] text-zinc-400">See how your plugin renders on sample devices</p>
              </div>

              <div className="flex items-center rounded-xl bg-[#1A1A1E] border border-zinc-800 p-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    previewDevice === "desktop"
                      ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    previewDevice === "mobile"
                      ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Realistic Browser Window Frame (Mockup 3) */}
            <div
              className={`mx-auto rounded-2xl border border-zinc-800 bg-[#17171A] shadow-2xl overflow-hidden transition-all duration-300 ${
                previewDevice === "mobile" ? "max-w-[340px]" : "max-w-2xl"
              }`}
            >
              {/* Browser Window Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#1E1E22] px-3.5 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="rounded-full bg-[#141416] px-4 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                  https://mywebsite.com
                </div>
                <div className="w-8" />
              </div>

              {/* Browser Viewport with Announcement Bar + Website Skeleton */}
              <div className="relative min-h-[300px] flex flex-col bg-[#0F0F11]">
                {/* Announcement Bar at Top */}
                {pluginType === "announcement" && announcementPosition === "top_fixed" && (
                  <div
                    style={{
                      backgroundColor: announcementBg,
                      color: announcementTextColor,
                    }}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-center shadow-md animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
                      {announcementIcon !== "none" && (
                        <span style={{ color: announcementIconColor }} className="shrink-0">
                          {renderTemplateIcon(announcementIcon, "h-4 w-4")}
                        </span>
                      )}
                      <span className="text-xs font-semibold truncate leading-tight">
                        {announcementText}
                      </span>
                    </div>

                    {announcementBtnLabel && (
                      <span
                        style={{
                          backgroundColor: announcementBtnBg,
                          color: announcementBtnTextColor,
                        }}
                        className="shrink-0 rounded-md px-3 py-1 text-[11px] font-bold shadow-xs whitespace-nowrap"
                      >
                        {announcementBtnLabel}
                      </span>
                    )}

                    {announcementShowClose && (
                      <span className="shrink-0 text-xs opacity-70 hover:opacity-100 cursor-pointer ml-1">
                        ✕
                      </span>
                    )}
                  </div>
                )}

                {/* Sample Website Content Skeleton (Matching Mockup 3) */}
                <div className="p-5 space-y-4 flex-1">
                  {/* Mock Navbar */}
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <div className="h-4 w-20 rounded-md bg-zinc-700/60" />
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-8 rounded-full bg-zinc-800" />
                      <div className="h-2 w-8 rounded-full bg-zinc-800" />
                      <div className="h-2 w-8 rounded-full bg-zinc-800" />
                      <div className="h-4 w-12 rounded-md bg-[#FACC15]/40" />
                    </div>
                  </div>

                  {/* Mock Hero Banner */}
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-4 space-y-2.5">
                    <div className="h-4 w-3/4 rounded-md bg-zinc-700/80" />
                    <div className="h-2.5 w-1/2 rounded-full bg-zinc-800" />
                    <div className="h-6 w-20 rounded-lg bg-[#FACC15] mt-2" />
                  </div>

                  {/* Mock Grid Cards */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="h-16 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2 space-y-1.5">
                      <div className="h-3 w-3 rounded-full bg-blue-500/50" />
                      <div className="h-2 w-10 rounded-full bg-zinc-800" />
                    </div>
                    <div className="h-16 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2 space-y-1.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                      <div className="h-2 w-10 rounded-full bg-zinc-800" />
                    </div>
                    <div className="h-16 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2 space-y-1.5">
                      <div className="h-3 w-3 rounded-full bg-purple-500/50" />
                      <div className="h-2 w-10 rounded-full bg-zinc-800" />
                    </div>
                  </div>
                </div>

                {/* Announcement Bar at Bottom */}
                {pluginType === "announcement" && announcementPosition === "bottom_fixed" && (
                  <div
                    style={{
                      backgroundColor: announcementBg,
                      color: announcementTextColor,
                    }}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-center shadow-md animate-in fade-in duration-200 mt-auto"
                  >
                    <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
                      {announcementIcon !== "none" && (
                        <span style={{ color: announcementIconColor }} className="shrink-0">
                          {renderTemplateIcon(announcementIcon, "h-4 w-4")}
                        </span>
                      )}
                      <span className="text-xs font-semibold truncate leading-tight">
                        {announcementText}
                      </span>
                    </div>

                    {announcementBtnLabel && (
                      <span
                        style={{
                          backgroundColor: announcementBtnBg,
                          color: announcementBtnTextColor,
                        }}
                        className="shrink-0 rounded-md px-3 py-1 text-[11px] font-bold shadow-xs whitespace-nowrap"
                      >
                        {announcementBtnLabel}
                      </span>
                    )}

                    {announcementShowClose && (
                      <span className="shrink-0 text-xs opacity-70 hover:opacity-100 cursor-pointer ml-1">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL FOOTER BUTTONS ─────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#222225] bg-[#161619] px-6 py-4">
          {/* Left Action Button */}
          {step === 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-[#1A1A1E] px-5 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  // If editing existing, Cancel/close or go to Step 1 if supported
                  if (["youtube", "maps", "custom_html"].includes(pluginType)) {
                    onClose();
                  } else {
                    setStep(1);
                  }
                } else if (step === 3) {
                  setStep(2);
                }
              }}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#1A1A1E] px-5 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          )}

          {/* Right Action Button */}
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 rounded-xl bg-[#FACC15] px-6 py-2 text-xs font-bold text-zinc-950 transition hover:bg-[#FDE047] shadow-md shadow-[#FACC15]/20 active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : step === 2 ? (
            <button
              type="button"
              onClick={() => {
                if (handleValidateStep2()) {
                  setStep(3);
                }
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#FACC15] px-6 py-2 text-xs font-bold text-zinc-950 transition hover:bg-[#FDE047] shadow-md shadow-[#FACC15]/20 active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#FACC15] px-6 py-2 text-xs font-bold text-zinc-950 transition hover:bg-[#FDE047] shadow-md shadow-[#FACC15]/20 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Save Plugin</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
