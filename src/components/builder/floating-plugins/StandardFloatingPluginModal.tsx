"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Phone,
  MessageCircle,
  Accessibility,
  Globe,
  Bot,
  Megaphone,
  Layers,
  ArrowUp,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useBuilder } from "@/lib/builder/store";
import type { CustomEmbedItem } from "@/lib/builder/customEmbedsUtils";
import type {
  FloatingWidgetRecord,
  FloatingWidgetType,
  FloatingPosition,
} from "@/lib/builder/floatingWidgetsTypes";
import { FloatingPluginModalShell } from "./FloatingPluginModalShell";
import { LiveWebsitePreviewFrame } from "./LiveWebsitePreviewFrame";
import { WhatsAppChatModal } from "../WhatsAppChatModal";

// Plugin Config Components & Renderers
import {
  FloatingContactConfig,
  renderFloatingContactPreviewElement,
  type ContactButtonConfigData,
} from "./FloatingContactConfig";
import {
  WhatsAppChatConfig,
  renderWhatsAppPreviewElement,
  type WhatsAppChatConfigData,
} from "./WhatsAppChatConfig";
import {
  AccessibilityConfig,
  renderAccessibilityPreviewElement,
  type AccessibilityConfigData,
} from "./AccessibilityConfig";
import {
  LanguageSwitcherConfig,
  renderLanguageSwitcherPreviewElement,
  type LanguageSwitcherConfigData,
} from "./LanguageSwitcherConfig";
import {
  ChatbotConfig,
  renderChatbotPreviewElement,
  type ChatbotConfigData,
} from "./ChatbotConfig";
import {
  AnnouncementBarConfig,
  renderAnnouncementBarPreviewElement,
  type AnnouncementBarConfigData,
} from "./AnnouncementBarConfig";
import {
  PopupModalConfig,
  renderPopupModalPreviewElement,
  type PopupModalConfigData,
} from "./PopupModalConfig";
import {
  BackToTopConfig,
  renderBackToTopPreviewElement,
  type BackToTopConfigData,
} from "./BackToTopConfig";
import {
  FloatingCustomEmbedConfig,
  renderFloatingCustomEmbedPreviewElement,
  type FloatingCustomEmbedConfigData,
} from "./FloatingCustomEmbedConfig";

export interface StandardFloatingPluginModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedToEdit?: CustomEmbedItem | null;
  initialPluginType?: string | null;
  onSaved?: () => void;
}

export function StandardFloatingPluginModal({
  isOpen,
  onClose,
  embedToEdit,
  initialPluginType,
  onSaved,
}: StandardFloatingPluginModalProps) {
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // Viewport mode: desktop vs mobile
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);

  // Determine active plugin category
  const activePluginType = useMemo(() => {
    if (embedToEdit) {
      if (embedToEdit.pluginType) return embedToEdit.pluginType;
      const lower = (embedToEdit.name || "").toLowerCase();
      if (lower.includes("whatsapp")) return "whatsapp";
      if (lower.includes("accessibility") || lower.includes("a11y")) return "accessibility";
      if (lower.includes("language")) return "language";
      if (lower.includes("announcement")) return "announcement";
      if (lower.includes("popup")) return "popup";
      if (lower.includes("chatbot") || lower.includes("bot")) return "chatbot";
      if (lower.includes("top")) return "back_to_top";
      if (lower.includes("contact")) return "contact";
      if (embedToEdit.floatingRecord?.type) {
        const t = embedToEdit.floatingRecord.type;
        if (t === "whatsapp_chat") return "whatsapp";
        if (t === "floating_contact") return "contact";
        if (t === "accessibility") return "accessibility";
        if (t === "language_switcher") return "language";
        if (t === "chatbot") return "chatbot";
        if (t === "announcement_popup") return "announcement";
        if (t === "back_to_top") return "back_to_top";
        if (t === "custom_embed") return "custom_embed";
      }
    }
    return initialPluginType || "contact";
  }, [embedToEdit, initialPluginType]);

  // ── INDIVIDUAL PLUGIN STATES ──────────────────────────────────────────────

  // 1. Floating Contact
  const [contactData, setContactData] = useState<ContactButtonConfigData>({
    style: "phone",
    contactType: "phone",
    contactValue: "+91 98765 43210",
    position: "bottom_right",
    size: "medium",
    color: "#2563EB",
    tooltipText: "Call Us",
    showOnDesktop: true,
    showOnMobile: true,
    showTooltip: true,
  });

  // 2. WhatsApp Chat
  const [waData, setWaData] = useState<WhatsAppChatConfigData>({
    countryCode: "+91",
    phoneNumber: "",
    agentName: "Customer Support",
    prefilledMessage: "Hello! I have a question about your services.",
    buttonStyle: "whatsapp_standard",
    buttonColor: "#25D366",
    buttonLabel: "Chat with us",
    position: "bottom_right",
    showOnDesktop: true,
    showOnMobile: true,
    showTooltip: true,
    tooltipText: "Chat with us 👋",
  });

  // 3. Accessibility
  const [a11yData, setA11yData] = useState<AccessibilityConfigData>({
    toolbarStyle: "circle",
    toolbarColor: "#2563EB",
    position: "bottom_left",
    showOnDesktop: true,
    showOnMobile: true,
    showByDefault: false,
    features: {
      textResize: true,
      highContrast: true,
      readableFont: true,
      keyboardNav: true,
      stopAnimations: true,
      reset: true,
    },
  });

  // 4. Language Switcher
  const [langData, setLangData] = useState<LanguageSwitcherConfigData>({
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "fr", "de"],
    layout: "floating_pill",
    theme: "dark",
    position: "top_right",
    showOnDesktop: true,
    showOnMobile: true,
    showFlags: true,
  });

  // 5. Chatbot
  const [botData, setBotData] = useState<ChatbotConfigData>({
    botName: "AI Assistant",
    welcomeMessage: "Hi there! How can I help you today?",
    primaryColor: "#2563EB",
    position: "bottom_right",
    showOnDesktop: true,
    showOnMobile: true,
    showWelcomeBubble: true,
  });

  // 6. Announcement Bar
  const [annData, setAnnData] = useState<AnnouncementBarConfigData>({
    template: "classic",
    headline: "",
    text: "2027 Winter and Spring Schedules are now open for enrollment!",
    icon: "megaphone",
    ctaLabel: "",
    ctaUrl: "",
    openNewTab: true,
    backgroundColor: "#4A1525",
    textColor: "#FFFFFF",
    btnBgColor: "#FACC15",
    btnTextColor: "#18181B",
    position: "top_fixed",
    showOnDesktop: true,
    showOnMobile: true,
    allowDismiss: true,
  });

  // 7. Popup Modal
  const [popupData, setPopupData] = useState<PopupModalConfigData>({
    template: "discount",
    headline: "Limited Time Offer — 20% Off",
    message: "Join today and enjoy 20% off all your website building plans with coupon SAVE20.",
    ctaLabel: "Claim Discount",
    ctaUrl: "",
    backgroundColor: "#18181B",
    textColor: "#FFFFFF",
    btnBgColor: "#FACC15",
    btnTextColor: "#09090B",
    showOnDesktop: true,
    showOnMobile: true,
  });

  // 8. Back to Top
  const [bttData, setBttData] = useState<BackToTopConfigData>({
    shape: "round",
    backgroundColor: "#1F1F23",
    textColor: "#FACC15",
    position: "bottom_right",
    showOnDesktop: true,
    showOnMobile: true,
  });

  // 9. Custom Embed
  const [embedData, setEmbedData] = useState<FloatingCustomEmbedConfigData>({
    name: "Floating Custom Embed",
    snippetHtml: `<div style="padding: 12px 16px; background: rgba(20,20,24,0.92); border: 1px solid rgba(250,204,21,0.4); border-radius: 12px; color: #fff; font-family: sans-serif; font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">\n  <strong>Floating Notice</strong>\n  <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 11px;">Custom floating embed preview.</p>\n</div>`,
    position: "bottom_right",
    showOnDesktop: true,
    showOnMobile: true,
  });

  // Initialize or re-populate when modal opens or item changes
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit && embedToEdit.floatingRecord) {
      const fw = embedToEdit.floatingRecord;
      const cfg = fw.config || {};

      if (activePluginType === "contact" || fw.type === "floating_contact") {
        setContactData({
          style: cfg.style || (cfg.actionType as any) || "phone",
          contactType: cfg.actionType || "phone",
          contactValue: cfg.actionValue || cfg.phoneNumber || "",
          position: fw.position || "bottom_right",
          size: cfg.size || "medium",
          color: cfg.buttonColor || "#2563EB",
          tooltipText: cfg.label || cfg.tooltipText || "Call Us",
          customIconUrl: cfg.customIconUrl,
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
          showTooltip: cfg.showTooltip ?? true,
        });
      } else if (activePluginType === "whatsapp" || fw.type === "whatsapp_chat") {
        setWaData({
          countryCode: cfg.countryCode || "+91",
          phoneNumber: cfg.phoneNumber || "",
          agentName: cfg.agentName || "Customer Support",
          prefilledMessage: cfg.prefilledMessage || "Hello! I have a question about your services.",
          buttonStyle: cfg.buttonStyle || "whatsapp_standard",
          buttonColor: cfg.buttonColor || "#25D366",
          buttonLabel: cfg.buttonLabel || "Chat with us",
          position: fw.position || "bottom_right",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
          showTooltip: cfg.showTooltip ?? true,
          tooltipText: cfg.tooltipText || "Chat with us 👋",
          customIconUrl: cfg.customIconUrl,
        });
      } else if (activePluginType === "accessibility" || fw.type === "accessibility") {
        setA11yData({
          toolbarStyle: cfg.toolbarStyle || "circle",
          toolbarColor: cfg.toolbarColor || cfg.accentColor || "#2563EB",
          position: fw.position || "bottom_left",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
          showByDefault: Boolean(cfg.showByDefault || cfg.initialOpen),
          features: cfg.features || {
            textResize: true,
            highContrast: true,
            readableFont: true,
            keyboardNav: true,
            stopAnimations: true,
            reset: true,
          },
        });
      } else if (activePluginType === "language" || fw.type === "language_switcher") {
        setLangData({
          defaultLanguage: cfg.defaultLanguage || "en",
          supportedLanguages: cfg.supportedLanguages || (cfg.languages ? cfg.languages.map((l: any) => l.code) : ["en", "es", "fr", "de"]),
          layout: cfg.layout || "floating_pill",
          theme: cfg.theme || "dark",
          position: fw.position || "top_right",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
          showFlags: cfg.showFlags ?? true,
        });
      } else if (activePluginType === "chatbot" || fw.type === "chatbot") {
        setBotData({
          botName: cfg.botName || "AI Assistant",
          welcomeMessage: cfg.welcomeMessage || "Hi there! How can I help you today?",
          primaryColor: cfg.primaryColor || "#2563EB",
          position: fw.position || "bottom_right",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
          showWelcomeBubble: cfg.showWelcomeBubble ?? true,
        });
      } else if (activePluginType === "announcement" || fw.type === "announcement_popup") {
        setAnnData({
          template: cfg.template || "classic",
          headline: cfg.headline || "",
          text: cfg.text || cfg.message || "2027 Winter and Spring Schedules are now open for enrollment!",
          icon: cfg.icon || "megaphone",
          ctaLabel: cfg.ctaLabel || cfg.buttonLabel || cfg.buttonText || "",
          ctaUrl: cfg.ctaUrl || cfg.linkUrl || "",
          openNewTab: cfg.linkNewTab !== false,
          backgroundColor: cfg.backgroundColor || "#4A1525",
          textColor: cfg.textColor || "#FFFFFF",
          btnBgColor: cfg.btnBgColor || cfg.buttonBgColor || "#FACC15",
          btnTextColor: cfg.btnTextColor || cfg.buttonTextColor || "#18181B",
          position: fw.position === "bottom_fixed" ? "bottom_fixed" : "top_fixed",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
          allowDismiss: cfg.allowDismiss !== false,
        });
      } else if (activePluginType === "popup") {
        setPopupData({
          template: cfg.template || "discount",
          headline: cfg.headline || "Limited Time Offer — 20% Off",
          message: cfg.message || cfg.text || "",
          ctaLabel: cfg.ctaLabel || cfg.buttonLabel || "Claim Discount",
          ctaUrl: cfg.ctaUrl || cfg.linkUrl || "",
          backgroundColor: cfg.backgroundColor || "#18181B",
          textColor: cfg.textColor || "#FFFFFF",
          btnBgColor: cfg.btnBgColor || cfg.buttonBgColor || "#FACC15",
          btnTextColor: cfg.btnTextColor || cfg.buttonTextColor || "#09090B",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
        });
      } else if (activePluginType === "back_to_top" || fw.type === "back_to_top") {
        setBttData({
          shape: cfg.shape === "rounded_square" ? "rounded_square" : "round",
          backgroundColor: cfg.backgroundColor || "#1F1F23",
          textColor: cfg.textColor || "#FACC15",
          position: fw.position || "bottom_right",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
        });
      } else if (activePluginType === "custom_embed" || fw.type === "custom_embed") {
        setEmbedData({
          name: fw.name || "Floating Custom Embed",
          snippetHtml: fw.snippetHtml || cfg.html || "",
          position: fw.position || "bottom_right",
          showOnDesktop: fw.showOnDesktop ?? true,
          showOnMobile: fw.showOnMobile ?? true,
        });
      }
    }
  }, [isOpen, embedToEdit, activePluginType]);

  // ── HEADER INFO ───────────────────────────────────────────────────────────
  const getShellHeader = () => {
    switch (activePluginType) {
      case "contact":
        return {
          icon: <Phone className="h-5 w-5" />,
          iconBg: "bg-[#7C3AED]", // matches purple squircle in mockup!
          title: "Floating Contact Button",
          description: "Add a floating contact button to help visitors reach you easily.",
        };
      case "whatsapp":
        return {
          icon: <MessageCircle className="h-5 w-5" />,
          iconBg: "bg-[#25D366]",
          title: "WhatsApp Chat",
          description: "Connect with visitors in real-time using WhatsApp messaging.",
        };
      case "accessibility":
        return {
          icon: <Accessibility className="h-5 w-5" />,
          iconBg: "bg-[#2563EB]",
          title: "Accessibility Toolbar",
          description: "Improve website accessibility with WCAG-compliant tools.",
        };
      case "language":
        return {
          icon: <Globe className="h-5 w-5" />,
          iconBg: "bg-[#2563EB]",
          title: "Language Switcher",
          description: "Let visitors select and change website language with a floating widget.",
        };
      case "chatbot":
        return {
          icon: <Bot className="h-5 w-5" />,
          iconBg: "bg-[#4F46E5]",
          title: "AI Chatbot",
          description: "Floating AI conversational assistant for automated customer support.",
        };
      case "announcement":
        return {
          icon: <Megaphone className="h-5 w-5" />,
          iconBg: "bg-[#D97706]",
          title: "Announcement Bar",
          description: "Display a sticky top or bottom banner for sales, updates and alerts.",
        };
      case "popup":
        return {
          icon: <Layers className="h-5 w-5" />,
          iconBg: "bg-[#EC4899]",
          title: "Popup Modal",
          description: "Engaging popup modal for announcements, special offers and lead generation.",
        };
      case "back_to_top":
        return {
          icon: <ArrowUp className="h-5 w-5" />,
          iconBg: "bg-[#4F46E5]",
          title: "Back to Top",
          description: "Floating scroll-to-top button that appears smoothly as visitors scroll.",
        };
      case "custom_embed":
      default:
        return {
          icon: <Code2 className="h-5 w-5" />,
          iconBg: "bg-[#3F3F46]",
          title: "Floating Custom Embed",
          description: "Position custom HTML or third-party floating code snippets at screen corners.",
        };
    }
  };

  const shellHeader = getShellHeader();

  // ── SAVE LOGIC ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const now = Date.now();
      let fwRec: FloatingWidgetRecord;

      if (activePluginType === "contact") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_contact_${nanoid(8)}`,
          type: "floating_contact",
          name: "Floating Contact Button",
          enabled: true,
          position: contactData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: contactData.showOnDesktop,
          showOnMobile: contactData.showOnMobile,
          pageTargeting: "all",
          config: {
            style: contactData.style,
            actionType: contactData.contactType,
            actionValue: contactData.contactValue.trim(),
            phoneNumber: contactData.contactValue.trim(),
            label: contactData.tooltipText.trim() || "Call Us",
            buttonColor: contactData.color,
            textColor: contactData.color.toLowerCase() === "#ffffff" ? "#111111" : "#FFFFFF",
            size: contactData.size,
            showTooltip: contactData.showTooltip,
            customIconUrl: contactData.customIconUrl,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "whatsapp") {
        if (!waData.phoneNumber.trim()) {
          toast.error("Please enter a WhatsApp phone number");
          setIsSaving(false);
          return;
        }
        fwRec = {
          id: embedToEdit?.floatingId || `flt_wa_${nanoid(8)}`,
          type: "whatsapp_chat",
          name: "WhatsApp Live Chat",
          enabled: true,
          position: waData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: waData.showOnDesktop,
          showOnMobile: waData.showOnMobile,
          pageTargeting: "all",
          config: {
            countryCode: waData.countryCode,
            phoneNumber: `${waData.countryCode}${waData.phoneNumber.replace(/\D/g, "")}`,
            rawPhone: waData.phoneNumber,
            agentName: waData.agentName.trim() || "Customer Support",
            prefilledMessage: waData.prefilledMessage.trim(),
            buttonStyle: waData.buttonStyle,
            buttonColor: waData.buttonColor,
            buttonLabel: waData.buttonLabel || "Chat with us",
            tooltipText: waData.tooltipText || "Chat with us 👋",
            showTooltip: waData.showTooltip,
            customIconUrl: waData.customIconUrl,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "accessibility") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_a11y_${nanoid(8)}`,
          type: "accessibility",
          name: "Accessibility Toolbar",
          enabled: true,
          position: a11yData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: a11yData.showOnDesktop,
          showOnMobile: a11yData.showOnMobile,
          pageTargeting: "all",
          config: {
            toolbarStyle: a11yData.toolbarStyle,
            toolbarColor: a11yData.toolbarColor,
            accentColor: a11yData.toolbarColor,
            showByDefault: a11yData.showByDefault,
            initialOpen: a11yData.showByDefault,
            features: a11yData.features,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "language") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_lang_${nanoid(8)}`,
          type: "language_switcher",
          name: "Language Switcher",
          enabled: true,
          position: langData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: langData.showOnDesktop,
          showOnMobile: langData.showOnMobile,
          pageTargeting: "all",
          config: {
            defaultLanguage: langData.defaultLanguage,
            supportedLanguages: langData.supportedLanguages,
            layout: langData.layout,
            theme: langData.theme,
            showFlags: langData.showFlags,
            languages: langData.supportedLanguages.map((code) => ({
              code,
              name: code.toUpperCase(),
              flag: "🌐",
            })),
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "chatbot") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_bot_${nanoid(8)}`,
          type: "chatbot",
          name: botData.botName || "AI Chatbot",
          enabled: true,
          position: botData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: botData.showOnDesktop,
          showOnMobile: botData.showOnMobile,
          pageTargeting: "all",
          config: {
            botName: botData.botName.trim() || "AI Assistant",
            welcomeMessage: botData.welcomeMessage.trim(),
            primaryColor: botData.primaryColor,
            showWelcomeBubble: botData.showWelcomeBubble,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "announcement") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_ann_${nanoid(8)}`,
          type: "announcement_popup",
          name: "Announcement Bar",
          enabled: true,
          position: annData.position,
          offsetX: 0,
          offsetY: 0,
          showOnDesktop: annData.showOnDesktop,
          showOnMobile: annData.showOnMobile,
          pageTargeting: "all",
          config: {
            template: annData.template,
            headline: annData.headline.trim(),
            text: annData.text.trim(),
            icon: annData.icon,
            ctaLabel: annData.ctaLabel.trim(),
            ctaUrl: annData.ctaUrl.trim(),
            linkNewTab: annData.openNewTab,
            backgroundColor: annData.backgroundColor,
            textColor: annData.textColor,
            btnBgColor: annData.btnBgColor,
            btnTextColor: annData.btnTextColor,
            showCloseButton: annData.allowDismiss,
            allowDismiss: annData.allowDismiss,
            layout: "banner",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "popup") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_pop_${nanoid(8)}`,
          type: "announcement_popup",
          name: "Popup Modal",
          enabled: true,
          position: "bottom_right",
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: popupData.showOnDesktop,
          showOnMobile: popupData.showOnMobile,
          pageTargeting: "all",
          config: {
            template: popupData.template,
            headline: popupData.headline.trim(),
            text: popupData.message.trim(),
            ctaLabel: popupData.ctaLabel.trim(),
            ctaUrl: popupData.ctaUrl.trim(),
            backgroundColor: popupData.backgroundColor,
            textColor: popupData.textColor,
            btnBgColor: popupData.btnBgColor,
            btnTextColor: popupData.btnTextColor,
            layout: "modal",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else if (activePluginType === "back_to_top") {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_btt_${nanoid(8)}`,
          type: "back_to_top",
          name: "Back to Top",
          enabled: true,
          position: bttData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: bttData.showOnDesktop,
          showOnMobile: bttData.showOnMobile,
          pageTargeting: "all",
          config: {
            shape: bttData.shape,
            backgroundColor: bttData.backgroundColor,
            textColor: bttData.textColor,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      } else {
        fwRec = {
          id: embedToEdit?.floatingId || `flt_custom_${nanoid(8)}`,
          type: "custom_embed",
          name: embedData.name.trim() || "Floating Custom Embed",
          enabled: true,
          position: embedData.position,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: embedData.showOnDesktop,
          showOnMobile: embedData.showOnMobile,
          pageTargeting: "all",
          snippetHtml: embedData.snippetHtml.trim(),
          config: { html: embedData.snippetHtml.trim() },
          createdAt: embedToEdit?.floatingRecord?.createdAt || now,
          updatedAt: now,
        };
      }

      // Persist to store
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
      toast.success(`Saved ${shellHeader.title}`);
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("[StandardFloatingPluginModal] Save error:", err);
      toast.error(err?.message || "Failed to save plugin");
    } finally {
      setIsSaving(false);
    }
  };

  // ── PREVIEW RENDERER ──────────────────────────────────────────────────────
  const renderPreviewContent = (mode: "desktop" | "mobile") => {
    switch (activePluginType) {
      case "contact":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={contactData.position}
            showOnDesktop={contactData.showOnDesktop}
            showOnMobile={contactData.showOnMobile}
            emptyWarning={!contactData.contactValue.trim() ? "Enter contact number/details" : undefined}
          >
            {renderFloatingContactPreviewElement(contactData)}
          </LiveWebsitePreviewFrame>
        );

      case "whatsapp":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={waData.position}
            showOnDesktop={waData.showOnDesktop}
            showOnMobile={waData.showOnMobile}
            emptyWarning={!waData.phoneNumber.trim() ? "Enter your WhatsApp phone number" : undefined}
          >
            {renderWhatsAppPreviewElement(waData)}
          </LiveWebsitePreviewFrame>
        );

      case "accessibility":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={a11yData.position}
            showOnDesktop={a11yData.showOnDesktop}
            showOnMobile={a11yData.showOnMobile}
          >
            {renderAccessibilityPreviewElement(a11yData)}
          </LiveWebsitePreviewFrame>
        );

      case "language":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={langData.position}
            showOnDesktop={langData.showOnDesktop}
            showOnMobile={langData.showOnMobile}
          >
            {renderLanguageSwitcherPreviewElement(langData)}
          </LiveWebsitePreviewFrame>
        );

      case "chatbot":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={botData.position}
            showOnDesktop={botData.showOnDesktop}
            showOnMobile={botData.showOnMobile}
          >
            {renderChatbotPreviewElement(botData)}
          </LiveWebsitePreviewFrame>
        );

      case "announcement":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={annData.position}
            showOnDesktop={annData.showOnDesktop}
            showOnMobile={annData.showOnMobile}
          >
            {renderAnnouncementBarPreviewElement(annData)}
          </LiveWebsitePreviewFrame>
        );

      case "popup":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position="center_modal"
            showOnDesktop={popupData.showOnDesktop}
            showOnMobile={popupData.showOnMobile}
          >
            {renderPopupModalPreviewElement(popupData)}
          </LiveWebsitePreviewFrame>
        );

      case "back_to_top":
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={bttData.position}
            showOnDesktop={bttData.showOnDesktop}
            showOnMobile={bttData.showOnMobile}
          >
            {renderBackToTopPreviewElement(bttData)}
          </LiveWebsitePreviewFrame>
        );

      case "custom_embed":
      default:
        return (
          <LiveWebsitePreviewFrame
            mode={mode}
            position={embedData.position}
            showOnDesktop={embedData.showOnDesktop}
            showOnMobile={embedData.showOnMobile}
          >
            {renderFloatingCustomEmbedPreviewElement(embedData)}
          </LiveWebsitePreviewFrame>
        );
    }
  };

  if (isOpen && activePluginType === "whatsapp") {
    return (
      <WhatsAppChatModal
        isOpen={isOpen}
        onClose={onClose}
        embedToEdit={embedToEdit}
        onSaved={onSaved}
      />
    );
  }

  return (
    <FloatingPluginModalShell
      isOpen={isOpen}
      onClose={onClose}
      icon={shellHeader.icon}
      iconBg={shellHeader.iconBg}
      title={shellHeader.title}
      description={shellHeader.description}
      previewMode={previewMode}
      onPreviewModeChange={setPreviewMode}
      renderPreview={renderPreviewContent}
      onSave={handleSave}
      isSaving={isSaving}
    >
      {/* ── PLUGIN-SPECIFIC CONFIGURATION SETTINGS ── */}
      {activePluginType === "contact" && (
        <FloatingContactConfig data={contactData} onChange={setContactData} />
      )}
      {activePluginType === "whatsapp" && (
        <WhatsAppChatConfig data={waData} onChange={setWaData} />
      )}
      {activePluginType === "accessibility" && (
        <AccessibilityConfig data={a11yData} onChange={setA11yData} />
      )}
      {activePluginType === "language" && (
        <LanguageSwitcherConfig data={langData} onChange={setLangData} />
      )}
      {activePluginType === "chatbot" && (
        <ChatbotConfig data={botData} onChange={setBotData} />
      )}
      {activePluginType === "announcement" && (
        <AnnouncementBarConfig data={annData} onChange={setAnnData} />
      )}
      {activePluginType === "popup" && (
        <PopupModalConfig data={popupData} onChange={setPopupData} />
      )}
      {activePluginType === "back_to_top" && (
        <BackToTopConfig data={bttData} onChange={setBttData} />
      )}
      {activePluginType === "custom_embed" && (
        <FloatingCustomEmbedConfig data={embedData} onChange={setEmbedData} />
      )}
    </FloatingPluginModalShell>
  );
}
