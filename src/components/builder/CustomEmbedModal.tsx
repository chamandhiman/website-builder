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
} from "lucide-react";
import { toast } from "sonner";
import {
  type CustomEmbedItem,
  createCustomHtmlSection,
  createYouTubeSection,
  createMapSection,
} from "@/lib/builder/customEmbedsUtils";
import type { FloatingPosition, FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";
import { nanoid } from "nanoid";

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

export function CustomEmbedModal({
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

  // Common Form State
  const [name, setName] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Floating Contact Button specific state (Strictly user-provided, NO demo defaults)
  const [contactPhone, setContactPhone] = useState("");
  const [contactAction, setContactAction] = useState<"phone" | "whatsapp" | "email">("phone");
  const [contactLabel, setContactLabel] = useState("Call Us");
  const [contactColor, setContactColor] = useState("#FACC15");
  const [contactTextColor, setContactTextColor] = useState("#111111");
  const [contactPosition, setContactPosition] = useState<FloatingPosition>("bottom_right");
  const [contactShowDesktop, setContactShowDesktop] = useState(true);
  const [contactShowMobile, setContactShowMobile] = useState(true);

  // WhatsApp specific state (Strictly user-provided, NO demo defaults)
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [waAgent, setWaAgent] = useState("Customer Support");
  const [waGreeting, setWaGreeting] = useState("");
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

  // Announcement Bar & Popup state
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [announcementBtnLabel, setAnnouncementBtnLabel] = useState("Learn More");
  const [announcementPosition, setAnnouncementPosition] = useState<FloatingPosition>("top_fixed");
  const [announcementBg, setAnnouncementBg] = useState("#1E1E24");
  const [announcementTextColor, setAnnouncementTextColor] = useState("#FFFFFF");

  // Chatbot state
  const [botName, setBotName] = useState("AI Assistant");
  const [botWelcome, setBotWelcome] = useState("Hi there! How can I help you today?");
  const [botPosition, setBotPosition] = useState<FloatingPosition>("bottom_right");
  const [botColor, setBotColor] = useState("#2563EB");

  // YouTube Video Page Section specific state
  const [ytUrl, setYtUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [ytAspectRatio, setYtAspectRatio] = useState("16/9");
  const [ytMaxWidth, setYtMaxWidth] = useState("1000px");
  const [ytAutoplay, setYtAutoplay] = useState(false);
  const [ytMute, setYtMute] = useState(false);
  const [ytControls, setYtControls] = useState(true);

  // Google Maps Page Section specific state
  const [mapAddress, setMapAddress] = useState("");
  const [mapHeight, setMapHeight] = useState("380px");
  const [mapMaxWidth, setMapMaxWidth] = useState("1000px");
  const [mapZoom, setMapZoom] = useState(13);

  // Custom HTML state
  const [customPlacement, setCustomPlacement] = useState<PlacementChoice>("site_wide_header");
  const [customHtml, setCustomHtml] = useState("");

  // Populate form values from existing record or defaults
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit) {
      setName(embedToEdit.name);

      if (embedToEdit.floatingRecord) {
        const fw = embedToEdit.floatingRecord;
        const cfg = fw.config || {};

        if (pluginType === "contact" || fw.type === "floating_contact") {
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
        } else if (pluginType === "announcement" || pluginType === "popup" || fw.type === "announcement_popup") {
          setAnnouncementText(cfg.text || cfg.message || "");
          setAnnouncementLink(cfg.linkUrl || cfg.ctaUrl || "");
          setAnnouncementBtnLabel(cfg.ctaLabel || cfg.buttonLabel || "Learn More");
          setAnnouncementPosition(fw.position || "top_fixed");
          setAnnouncementBg(cfg.backgroundColor || "#1E1E24");
          setAnnouncementTextColor(cfg.textColor || "#FFFFFF");
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
      // Default creation state
      switch (pluginType) {
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
        case "announcement":
          setName("Announcement Bar");
          setAnnouncementText("Special promotion this week! Use code SAVE20 at checkout.");
          setAnnouncementPosition("top_fixed");
          break;
        case "popup":
          setName("Announcement Popup");
          setAnnouncementText("Subscribe to our newsletter for exclusive updates.");
          setAnnouncementPosition("bottom_right");
          break;
        case "chatbot":
          setName("AI Chatbot");
          setBotPosition("bottom_right");
          break;
        case "youtube":
          setName("YouTube Video");
          setYtUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
          break;
        case "maps":
          setName("Google Maps");
          setMapAddress("1600 Amphitheatre Parkway, Mountain View, CA");
          break;
        default:
          setName("Custom HTML / Embed");
          setCustomHtml("");
          setCustomPlacement("site_wide_header");
          break;
      }
    }
    setPreviewDevice("desktop");
  }, [isOpen, embedToEdit, pluginType]);

  if (!isOpen || !project) return null;

  const pages = project.pages || [];
  const targetPageId = defaultPageId || currentPageId || pages[0]?.id;

  // Helper for YouTube embed link in preview
  const getCleanYtEmbedUrl = (raw: string) => {
    let videoId = "";
    if (raw.includes("embed/")) {
      videoId = raw.split("embed/")[1]?.split("?")[0] || "";
    } else if (raw.includes("watch?v=")) {
      videoId = raw.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (raw.includes("youtu.be/")) {
      videoId = raw.split("youtu.be/")[1]?.split("?")[0] || "";
    } else {
      videoId = raw.trim();
    }
    const params = new URLSearchParams();
    if (ytAutoplay) params.set("autoplay", "1");
    if (ytMute) params.set("mute", "1");
    if (!ytControls) params.set("controls", "0");
    const paramStr = params.toString() ? `?${params.toString()}` : "";
    return `https://www.youtube.com/embed/${videoId}${paramStr}`;
  };

  // Helper for Google Maps embed URL in preview
  const getMapsEmbedUrl = (query: string) => {
    if (!query) return "";
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;
  };

  // Save handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const finalName = name.trim() || "Plugin";
    setIsSubmitting(true);

    try {
      // ══════════════════════════════════════════════════════════════
      // CATEGORY 1: FLOATING PLUGINS (Rendered in Floating Overlay)
      // ══════════════════════════════════════════════════════════════

      // 1. Floating Contact Button
      if (pluginType === "contact") {
        if (!contactPhone.trim()) {
          toast.error("Please enter a phone number or contact target");
          setIsSubmitting(false);
          return;
        }

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
            phoneNumber: contactPhone.trim(),
            actionValue: contactPhone.trim(),
            label: contactLabel.trim() || "Call Us",
            buttonColor: contactColor,
            textColor: contactTextColor,
            iconType: contactAction,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id || w.type === "floating_contact");
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

      // 2. WhatsApp Live Chat
      if (pluginType === "whatsapp") {
        if (!waPhone.trim()) {
          toast.error("Please enter your WhatsApp phone number with country code");
          setIsSubmitting(false);
          return;
        }

        const cleanPhone = waPhone.replace(/[^\d+]/g, "");
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
            phoneNumber: cleanPhone,
            prefilledMessage: waMessage.trim(),
            agentName: waAgent.trim() || "Support Team",
            greetingText: waGreeting.trim(),
            buttonLabel: "Chat with us",
            buttonColor: waColor,
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id || w.type === "whatsapp_chat");
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved WhatsApp Chat`);
        onSaved?.();
        onClose();
        return;
      }

      // 3. Accessibility Toolbar
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
          const idx = existing.findIndex((w) => w.id === fwRec.id || w.type === "accessibility");
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

      // 4. Language Switcher
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
          const idx = existing.findIndex((w) => w.id === fwRec.id || w.type === "language_switcher");
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

      // 5. Announcement Bar & Popup
      if (pluginType === "announcement" || pluginType === "popup") {
        if (!announcementText.trim()) {
          toast.error("Please enter announcement text");
          setIsSubmitting(false);
          return;
        }

        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-ann-${nanoid(8)}`,
          type: "announcement_popup",
          name: finalName,
          enabled: true,
          position: announcementPosition,
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {
            text: announcementText.trim(),
            linkUrl: announcementLink.trim(),
            ctaLabel: announcementBtnLabel.trim(),
            backgroundColor: announcementBg,
            textColor: announcementTextColor,
            layout: pluginType === "popup" ? "modal" : "banner",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existing = cur.floatingWidgets || [];
          const idx = existing.findIndex((w) => w.id === fwRec.id || w.type === "announcement_popup");
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved ${pluginType === "popup" ? "Popup" : "Announcement Bar"}`);
        onSaved?.();
        onClose();
        return;
      }

      // 6. Chatbot
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
          const idx = existing.findIndex((w) => w.id === fwRec.id || w.type === "chatbot");
          const next = idx >= 0 ? existing.map((w, i) => (i === idx ? fwRec : w)) : [...existing, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: next },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Chatbot`);
        onSaved?.();
        onClose();
        return;
      }

      // ══════════════════════════════════════════════════════════════
      // CATEGORY 2: PAGE SECTIONS (Draggable Page Sections)
      // ══════════════════════════════════════════════════════════════

      // 7. YouTube Video Page Section
      if (pluginType === "youtube") {
        if (!ytUrl.trim()) {
          toast.error("Please enter a YouTube video URL");
          setIsSubmitting(false);
          return;
        }

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

        // If editing existing section
        if (embedToEdit?.sectionId) {
          updateSection(embedToEdit.sectionId, {
            name: sec.name,
            html: sec.html,
            widgetInstance: sec.widgetInstance,
          });
        } else {
          // Insert into current page sections
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
        toast.success(`Added YouTube Video section to page`);
        onSaved?.();
        onClose();
        return;
      }

      // 8. Google Maps Page Section
      if (pluginType === "maps") {
        if (!mapAddress.trim()) {
          toast.error("Please enter a location address or Google Maps embed link");
          setIsSubmitting(false);
          return;
        }

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
        toast.success(`Added Google Maps section to page`);
        onSaved?.();
        onClose();
        return;
      }

      // 9. Custom HTML / Script
      if (!customHtml.trim()) {
        toast.error("Please enter custom HTML or embed code");
        setIsSubmitting(false);
        return;
      }

      const isSiteWide = customPlacement === "site_wide_header" || customPlacement === "site_wide_footer";
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
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const filtered = (cur.floatingWidgets || []).filter((w) => w.id !== fwRec.id);
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: [...filtered, fwRec] },
            },
          };
        });
      } else if (isSiteWide) {
        const isHeader = customPlacement === "site_wide_header";
        const secId = isHeader ? SHARED_HEADER_SECTION_ID : SHARED_FOOTER_SECTION_ID;
        const newSec = createCustomHtmlSection({
          id: secId,
          name: finalName,
          html: customHtml.trim(),
        });
        newSec.shared = isHeader ? "header" : "footer";

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                ...(isHeader ? { sharedHeader: newSec } : { sharedFooter: newSec }),
              },
            },
          };
        });
      } else {
        const secId = embedToEdit?.sectionId || `custom-${nanoid(8)}`;
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
    } catch (err: any) {
      console.error("[CustomEmbedModal] Save error:", err);
      toast.error(err?.message || "Failed to save plugin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2B30] bg-[#121214] text-[#F5F5F5] shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#222225] bg-[#161619] px-6 py-4">
          <div className="flex items-center gap-3">
            {pluginType === "contact" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FACC15] text-zinc-950 shadow-sm">
                <Phone className="h-5 w-5" />
              </span>
            ) : pluginType === "whatsapp" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
                <MessageCircle className="h-5 w-5" />
              </span>
            ) : pluginType === "youtube" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E02424] text-white shadow-sm">
                <Youtube className="h-5 w-5" />
              </span>
            ) : pluginType === "maps" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#34A853] text-white shadow-sm">
                <MapPin className="h-5 w-5" />
              </span>
            ) : pluginType === "language" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                <Globe className="h-5 w-5" />
              </span>
            ) : pluginType === "accessibility" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9333EA] text-white shadow-sm">
                <Accessibility className="h-5 w-5" />
              </span>
            ) : pluginType === "announcement" || pluginType === "popup" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706] text-white shadow-sm">
                <Megaphone className="h-5 w-5" />
              </span>
            ) : pluginType === "chatbot" ? (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27272A] border border-zinc-700 text-[#FACC15] font-mono text-base font-bold shadow-xs">
                &lt;/&gt;
              </span>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {embedToEdit ? `Configure ${embedToEdit.name}` : `Add ${name || "Component"}`}
                </h2>
                {["youtube", "maps"].includes(pluginType) ? (
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/30">
                    Page Section
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Floating Plugin
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {pluginType === "contact"
                  ? "Floating button linking visitors to your phone, WhatsApp, or email."
                  : pluginType === "whatsapp"
                  ? "Floating WhatsApp button with customizable greeting bubble and number."
                  : pluginType === "youtube"
                  ? "Draggable page section embedding a responsive YouTube video player."
                  : pluginType === "maps"
                  ? "Draggable page section displaying an interactive Google Map location."
                  : pluginType === "language"
                  ? "Floating language selector for website localization."
                  : pluginType === "accessibility"
                  ? "WCAG & ADA compliant accessibility controls toolbar."
                  : pluginType === "announcement"
                  ? "Fixed top or bottom announcement banner across pages."
                  : pluginType === "popup"
                  ? "Modal announcement popup for promotions and alerts."
                  : pluginType === "chatbot"
                  ? "Floating interactive AI chatbot assistant."
                  : "Embed custom HTML, iframe, or scripts into your website."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / 2-Column Form & Preview */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* ── LEFT COLUMN: Configuration Form ── */}
            <div className="space-y-4">
              {/* Plugin / Section Name */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  {["youtube", "maps"].includes(pluginType) ? "Section Name" : "Plugin Name"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Floating Contact, YouTube Video, Google Maps"
                  className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                />
              </div>

              {/* 1. FLOATING CONTACT BUTTON (Plugin-specific, NO iframe) */}
              {pluginType === "contact" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Contact Action
                      </label>
                      <select
                        value={contactAction}
                        onChange={(e) => setContactAction(e.target.value as any)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="phone">📞 Phone Call (tel:)</option>
                        <option value="whatsapp">💬 WhatsApp Message</option>
                        <option value="email">✉️ Send Email (mailto:)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        {contactAction === "email" ? "Email Address" : "Phone Number"}
                      </label>
                      <input
                        type={contactAction === "email" ? "email" : "tel"}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder={contactAction === "email" ? "contact@yourdomain.com" : "+1 234 567 8900"}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={contactLabel}
                        onChange={(e) => setContactLabel(e.target.value)}
                        placeholder="Call Us"
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Floating Position
                      </label>
                      <select
                        value={contactPosition}
                        onChange={(e) => setContactPosition(e.target.value as FloatingPosition)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="bottom_right">Bottom Right</option>
                        <option value="bottom_left">Bottom Left</option>
                        <option value="top_right">Top Right</option>
                        <option value="top_left">Top Left</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Theme Color Preset
                    </label>
                    <div className="flex items-center gap-2">
                      {[
                        { bg: "#FACC15", text: "#111111", label: "Yellow Accent" },
                        { bg: "#25D366", text: "#FFFFFF", label: "WhatsApp Green" },
                        { bg: "#2563EB", text: "#FFFFFF", label: "Royal Blue" },
                        { bg: "#18181B", text: "#FACC15", label: "Dark Amber" },
                      ].map((preset) => (
                        <button
                          key={preset.bg + preset.text}
                          type="button"
                          onClick={() => {
                            setContactColor(preset.bg);
                            setContactTextColor(preset.text);
                          }}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                            contactColor === preset.bg
                              ? "border-[#FACC15] bg-[#18181B] text-[#FACC15]"
                              : "border-zinc-800 bg-[#18181B] text-zinc-400 hover:text-white"
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/20"
                            style={{ background: preset.bg }}
                          />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactShowDesktop}
                        onChange={(e) => setContactShowDesktop(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Show on Desktop</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactShowMobile}
                        onChange={(e) => setContactShowMobile(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Show on Mobile</span>
                    </label>
                  </div>
                </>
              )}

              {/* 2. WHATSAPP LIVE CHAT */}
              {pluginType === "whatsapp" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      WhatsApp Phone Number (with Country Code)
                    </label>
                    <input
                      type="tel"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Pre-filled Message
                    </label>
                    <input
                      type="text"
                      value={waMessage}
                      onChange={(e) => setWaMessage(e.target.value)}
                      placeholder="Hello! I have a question regarding your services."
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        value={waAgent}
                        onChange={(e) => setWaAgent(e.target.value)}
                        placeholder="Support Team"
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Floating Position
                      </label>
                      <select
                        value={waPosition}
                        onChange={(e) => setWaPosition(e.target.value as FloatingPosition)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="bottom_right">Bottom Right</option>
                        <option value="bottom_left">Bottom Left</option>
                        <option value="top_right">Top Right</option>
                        <option value="top_left">Top Left</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Greeting Bubble Message
                    </label>
                    <input
                      type="text"
                      value={waGreeting}
                      onChange={(e) => setWaGreeting(e.target.value)}
                      placeholder="Hi there! How can we help you today?"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </>
              )}

              {/* 3. ACCESSIBILITY TOOLBAR */}
              {pluginType === "accessibility" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Floating Position
                      </label>
                      <select
                        value={a11yPosition}
                        onChange={(e) => setA11yPosition(e.target.value as FloatingPosition)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="bottom_left">Bottom Left</option>
                        <option value="bottom_right">Bottom Right</option>
                        <option value="top_left">Top Left</option>
                        <option value="top_right">Top Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Button Accent Color
                      </label>
                      <select
                        value={a11yColor}
                        onChange={(e) => setA11yColor(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="#9333EA">Purple (#9333EA)</option>
                        <option value="#3B82F6">Blue (#3B82F6)</option>
                        <option value="#FACC15">Yellow (#FACC15)</option>
                        <option value="#18181B">Dark (#18181B)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <span className="block text-xs font-semibold text-white">Supported Features</span>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={a11yContrast}
                        onChange={(e) => setA11yContrast(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>High Contrast Mode</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={a11yFontSize}
                        onChange={(e) => setA11yFontSize(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Text Resizing Controls</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={a11yDyslexia}
                        onChange={(e) => setA11yDyslexia(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Dyslexia-Friendly Typography</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={a11yInvert}
                        onChange={(e) => setA11yInvert(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Invert Colors</span>
                    </label>
                  </div>
                </>
              )}

              {/* 4. LANGUAGE SWITCHER */}
              {pluginType === "language" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Default Language
                      </label>
                      <select
                        value={langDefault}
                        onChange={(e) => setLangDefault(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Spanish (Español)</option>
                        <option value="fr">French (Français)</option>
                        <option value="de">German (Deutsch)</option>
                        <option value="it">Italian (Italiano)</option>
                        <option value="pt">Portuguese (Português)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Floating Position
                      </label>
                      <select
                        value={langPosition}
                        onChange={(e) => setLangPosition(e.target.value as FloatingPosition)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="bottom_left">Bottom Left</option>
                        <option value="bottom_right">Bottom Right</option>
                        <option value="top_right">Top Right</option>
                        <option value="top_left">Top Left</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Theme Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["dark", "light", "glass"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setLangTheme(t)}
                          className={`rounded-lg border py-2 text-xs font-bold capitalize transition ${
                            langTheme === t
                              ? "border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                              : "border-zinc-800 bg-[#18181B] text-zinc-400 hover:text-white"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-normal pt-1 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                    ℹ️ Language Switcher enables visitors to change language. Page routing or custom localized content maps to each language choice.
                  </p>
                </>
              )}

              {/* 5. ANNOUNCEMENT BAR & POPUP */}
              {(pluginType === "announcement" || pluginType === "popup") && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Announcement Text
                    </label>
                    <textarea
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="e.g. Special offer this week! Get 20% off all plans with code SAVE20."
                      className="h-20 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] p-3 text-xs text-white outline-none focus:border-[#FACC15] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Button Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={announcementBtnLabel}
                        onChange={(e) => setAnnouncementBtnLabel(e.target.value)}
                        placeholder="Claim Offer"
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={announcementLink}
                        onChange={(e) => setAnnouncementLink(e.target.value)}
                        placeholder="https://..."
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Display Placement
                      </label>
                      <select
                        value={announcementPosition}
                        onChange={(e) => setAnnouncementPosition(e.target.value as FloatingPosition)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="top_fixed">Top Fixed Banner</option>
                        <option value="bottom_fixed">Bottom Fixed Banner</option>
                        <option value="bottom_right">Floating Bottom Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Banner Background
                      </label>
                      <select
                        value={announcementBg}
                        onChange={(e) => setAnnouncementBg(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="#1E1E24">Dark Slate (#1E1E24)</option>
                        <option value="#FACC15">Vibrant Yellow (#FACC15)</option>
                        <option value="#2563EB">Royal Blue (#2563EB)</option>
                        <option value="#DC2626">Crimson Red (#DC2626)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* 6. CHATBOT */}
              {pluginType === "chatbot" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Bot Name
                    </label>
                    <input
                      type="text"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      placeholder="AI Assistant"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Welcome Greeting Message
                    </label>
                    <input
                      type="text"
                      value={botWelcome}
                      onChange={(e) => setBotWelcome(e.target.value)}
                      placeholder="Hi there! How can I help you today?"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Floating Position
                      </label>
                      <select
                        value={botPosition}
                        onChange={(e) => setBotPosition(e.target.value as FloatingPosition)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="bottom_right">Bottom Right</option>
                        <option value="bottom_left">Bottom Left</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Primary Color
                      </label>
                      <select
                        value={botColor}
                        onChange={(e) => setBotColor(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="#2563EB">Blue (#2563EB)</option>
                        <option value="#9333EA">Purple (#9333EA)</option>
                        <option value="#FACC15">Yellow (#FACC15)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* 7. YOUTUBE VIDEO (PAGE SECTION) */}
              {pluginType === "youtube" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      YouTube Video URL
                    </label>
                    <input
                      type="text"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Aspect Ratio
                      </label>
                      <select
                        value={ytAspectRatio}
                        onChange={(e) => setYtAspectRatio(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="16/9">16:9 (Standard Widescreen)</option>
                        <option value="4/3">4:3 (Classic)</option>
                        <option value="1/1">1:1 (Square)</option>
                        <option value="9/16">9:16 (Shorts / Vertical)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Section Layout Width
                      </label>
                      <select
                        value={ytMaxWidth}
                        onChange={(e) => setYtMaxWidth(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="1000px">Contained (1000px)</option>
                        <option value="1280px">Wide (1280px)</option>
                        <option value="100%">Full Width</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ytAutoplay}
                        onChange={(e) => setYtAutoplay(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Autoplay</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ytMute}
                        onChange={(e) => setYtMute(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Mute Audio</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ytControls}
                        onChange={(e) => setYtControls(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15]"
                      />
                      <span>Player Controls</span>
                    </label>
                  </div>

                  <p className="text-[11px] text-zinc-400 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                    📌 <strong>Page Section:</strong> YouTube Video inserts into the page canvas where it can be dragged, reordered, and selected like any other section.
                  </p>
                </>
              )}

              {/* 8. GOOGLE MAPS (PAGE SECTION) */}
              {pluginType === "maps" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Location Address or Place
                    </label>
                    <input
                      type="text"
                      value={mapAddress}
                      onChange={(e) => setMapAddress(e.target.value)}
                      placeholder="e.g. 1600 Amphitheatre Pkwy, Mountain View, CA"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Map Height
                      </label>
                      <select
                        value={mapHeight}
                        onChange={(e) => setMapHeight(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="300px">Compact (300px)</option>
                        <option value="380px">Medium (380px)</option>
                        <option value="480px">Large (480px)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Zoom Level
                      </label>
                      <select
                        value={mapZoom}
                        onChange={(e) => setMapZoom(Number(e.target.value))}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value={11}>City Level (11)</option>
                        <option value={13}>Neighborhood Level (13)</option>
                        <option value={15}>Street Level (15)</option>
                        <option value={17}>Building Level (17)</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                    📌 <strong>Page Section:</strong> Google Maps inserts into your page layout as an interactive section that visitors can browse.
                  </p>
                </>
              )}

              {/* 9. CUSTOM HTML / EMBED CODE */}
              {pluginType === "custom_html" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Where to Place
                    </label>
                    <select
                      value={customPlacement}
                      onChange={(e) => setCustomPlacement(e.target.value as PlacementChoice)}
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                    >
                      <option value="site_wide_header">🌐 Global Header (Site-wide)</option>
                      <option value="site_wide_footer">🌐 Global Footer (Site-wide)</option>
                      <option value="inline_page">📄 Inline on Current Page</option>
                      <option value="floating_bottom_right">💬 Floating Overlay - Bottom Right</option>
                      <option value="floating_bottom_left">💬 Floating Overlay - Bottom Left</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Custom HTML, iframe or Script Code
                    </label>
                    <textarea
                      value={customHtml}
                      onChange={(e) => setCustomHtml(e.target.value)}
                      placeholder={`<iframe width="100%" height="400" src="https://..." frameborder="0"></iframe>`}
                      className="h-44 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] p-3 text-xs font-mono text-zinc-200 outline-none focus:border-[#FACC15] resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* ── RIGHT COLUMN: Live Interactive Preview Frame ── */}
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-white">Live Preview</span>
                <div className="flex items-center gap-1 rounded-lg border border-[#2A2A2E] bg-[#18181B] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      previewDevice === "desktop"
                        ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="h-3 w-3" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      previewDevice === "mobile"
                        ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Simulated Device Frame */}
              <div
                className={`relative flex-1 rounded-xl border border-[#28282C] bg-[#0E0E10] overflow-hidden flex flex-col shadow-inner min-h-[340px] transition-all duration-200 mx-auto w-full ${
                  previewDevice === "mobile" ? "max-w-[280px]" : "max-w-full"
                }`}
              >
                {/* Browser Navbar Mock */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161619] px-3 py-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-white tracking-wider">PREVIEW</span>
                    {previewDevice === "desktop" && (
                      <div className="flex items-center gap-2 text-[9px] text-zinc-400 ml-2">
                        <span>Home</span>
                        <span>About</span>
                        <span>Services</span>
                        <span>Contact</span>
                      </div>
                    )}
                  </div>
                  <span className="rounded bg-[#FACC15] px-2 py-0.5 text-[9px] font-bold text-zinc-950">
                    Live
                  </span>
                </div>

                {/* Simulated Content Area */}
                <div className="relative flex-1 p-3 flex flex-col overflow-y-auto bg-[#0A0A0C]">
                  {/* Floating Contact Preview */}
                  {pluginType === "contact" && (
                    <div className="relative h-full min-h-[240px] flex flex-col justify-end">
                      <div
                        className={`absolute ${
                          contactPosition.includes("left") ? "left-3" : "right-3"
                        } ${contactPosition.includes("top") ? "top-3" : "bottom-3"}`}
                      >
                        <div
                          className="flex items-center gap-2 rounded-full px-4 py-2 font-bold shadow-xl text-xs cursor-pointer hover:scale-105 transition-transform"
                          style={{ background: contactColor, color: contactTextColor }}
                        >
                          <Phone className="h-4 w-4" />
                          <span>{contactLabel || "Call Us"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Preview */}
                  {pluginType === "whatsapp" && (
                    <div className="relative h-full min-h-[240px] flex flex-col justify-end">
                      <div
                        className={`absolute ${
                          waPosition.includes("left") ? "left-3" : "right-3"
                        } ${waPosition.includes("top") ? "top-3" : "bottom-3"} flex flex-col items-${
                          waPosition.includes("left") ? "start" : "end"
                        } gap-2`}
                      >
                        {waGreeting && (
                          <div className="rounded-2xl bg-[#1F2C34] text-white p-3 border border-emerald-500/30 shadow-xl max-w-[210px] text-left">
                            <p className="text-[11px] font-bold text-emerald-400">{waAgent}</p>
                            <p className="text-[10px] text-zinc-200 mt-0.5">{waGreeting}</p>
                          </div>
                        )}
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                          style={{ background: waColor }}
                        >
                          <MessageCircle className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* YouTube Page Section Preview */}
                  {pluginType === "youtube" && (
                    <div className="w-full flex-1 flex flex-col justify-center">
                      <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video shadow-2xl flex items-center justify-center">
                        <iframe
                          src={getCleanYtEmbedUrl(ytUrl)}
                          title="YouTube Preview"
                          className="w-full h-full border-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Google Maps Page Section Preview */}
                  {pluginType === "maps" && (
                    <div className="w-full flex-1 flex flex-col justify-center">
                      <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-black h-48 shadow-2xl flex items-center justify-center">
                        {mapAddress.trim() ? (
                          <iframe
                            src={getMapsEmbedUrl(mapAddress)}
                            title="Google Maps Preview"
                            className="w-full h-full border-none"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center text-zinc-500 p-4">
                            <MapPin className="h-8 w-8 text-zinc-600 mb-2 opacity-60" />
                            <p className="text-xs">Enter a location to preview map</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Accessibility Preview */}
                  {pluginType === "accessibility" && (
                    <div className="relative h-full min-h-[220px] flex items-center justify-center">
                      <div
                        className={`absolute ${
                          a11yPosition.includes("left") ? "left-3" : "right-3"
                        } ${a11yPosition.includes("top") ? "top-3" : "bottom-3"}`}
                      >
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg cursor-pointer"
                          style={{ background: a11yColor }}
                        >
                          <Accessibility className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Language Switcher Preview */}
                  {pluginType === "language" && (
                    <div className="relative h-full min-h-[220px] flex items-center justify-center">
                      <div
                        className={`absolute ${
                          langPosition.includes("left") ? "left-3" : "right-3"
                        } ${langPosition.includes("top") ? "top-3" : "bottom-3"}`}
                      >
                        <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-[#18181B] px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span>English</span>
                          <span className="text-[10px] text-zinc-400">▼</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Announcement Bar Preview */}
                  {(pluginType === "announcement" || pluginType === "popup") && (
                    <div className="w-full flex-1 flex flex-col justify-start pt-2">
                      <div
                        className="w-full rounded-lg p-2.5 shadow-md flex items-center justify-between text-xs"
                        style={{ background: announcementBg, color: announcementTextColor }}
                      >
                        <span className="truncate">{announcementText || "Announcement text here"}</span>
                        {announcementBtnLabel && (
                          <span className="rounded bg-[#FACC15] px-2 py-0.5 text-[10px] font-bold text-zinc-950 shrink-0 ml-2">
                            {announcementBtnLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Chatbot Preview */}
                  {pluginType === "chatbot" && (
                    <div className="relative h-full min-h-[240px] flex flex-col justify-end">
                      <div
                        className={`absolute ${
                          botPosition.includes("left") ? "left-3" : "right-3"
                        } bottom-3 flex flex-col items-end gap-2`}
                      >
                        <div className="rounded-2xl bg-[#1E1E22] text-white p-3 border border-zinc-700 shadow-xl max-w-[200px] text-left">
                          <p className="text-[11px] font-bold text-blue-400">{botName}</p>
                          <p className="text-[10px] text-zinc-200 mt-0.5">{botWelcome}</p>
                        </div>
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg cursor-pointer"
                          style={{ background: botColor }}
                        >
                          <Bot className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom HTML Preview */}
                  {pluginType === "custom_html" && (
                    <div className="w-full flex-1 flex flex-col justify-center">
                      {customHtml.trim() ? (
                        <div
                          className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-black/60 p-3 text-xs text-white"
                          dangerouslySetInnerHTML={{ __html: customHtml }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-8">
                          <Code2 className="h-8 w-8 text-zinc-600 mb-2 opacity-50" />
                          <p className="text-xs">Paste HTML or embed code to preview</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-[#222225] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#333338] bg-[#18181B] px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#FACC15] px-5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-[#FDE047] shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>{embedToEdit ? "Save Changes" : ["youtube", "maps"].includes(pluginType) ? "Insert Section" : "Save Plugin"}</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
