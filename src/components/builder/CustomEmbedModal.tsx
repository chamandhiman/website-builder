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
} from "lucide-react";
import { toast } from "sonner";
import {
  type CustomEmbedItem,
  createCustomHtmlSection,
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

  // Determine active plugin type (whatsapp, youtube, maps, language, accessibility, custom_html, etc.)
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
      if (lower.includes("back to top")) return "back_to_top";
      if (lower.includes("announcement")) return "announcement";
      if (lower.includes("review")) return "reviews";
      return "custom_html";
    }
    return initialPluginType || "custom_html";
  }, [embedToEdit, initialPluginType]);

  // Form State
  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<PlacementChoice>("floating_bottom_right");
  const [html, setHtml] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WhatsApp specific state
  const [waPhone, setWaPhone] = useState("+1 234 567 8900");
  const [waMessage, setWaMessage] = useState("Hello! I am visiting your website and have a question.");
  const [waAgent, setWaAgent] = useState("Customer Support");
  const [waGreeting, setWaGreeting] = useState("How can we help you today?");
  const [waPosition, setWaPosition] = useState<FloatingPosition>("bottom_right");

  // YouTube specific state
  const [ytUrl, setYtUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [ytAutoplay, setYtAutoplay] = useState(false);
  const [ytMute, setYtMute] = useState(false);

  // Google Maps specific state
  const [mapLocation, setMapLocation] = useState("1600 Amphitheatre Parkway, Mountain View, CA");
  const [mapHeight, setMapHeight] = useState("360px");

  // Language Switcher state
  const [langDefault, setLangDefault] = useState("en");
  const [langSupported, setLangSupported] = useState(["en", "es", "fr", "de"]);
  const [langPosition, setLangPosition] = useState<FloatingPosition>("bottom_left");
  const [langTheme, setLangTheme] = useState<"dark" | "light" | "glass">("dark");

  // Accessibility state
  const [a11yPosition, setA11yPosition] = useState<FloatingPosition>("bottom_left");
  const [a11yContrast, setA11yContrast] = useState(true);
  const [a11yFontSize, setA11yFontSize] = useState(true);
  const [a11yDyslexia, setA11yDyslexia] = useState(true);

  // Initialize form state
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit) {
      setName(embedToEdit.name);
      setHtml(embedToEdit.html);

      if (embedToEdit.displayType === "site_wide") {
        setPlacement(embedToEdit.sharedType === "footer" ? "site_wide_footer" : "site_wide_header");
      } else if (embedToEdit.displayType === "floating") {
        const pos = embedToEdit.floatingRecord?.position || embedToEdit.floatingPosition || "bottom_right";
        if (pos === "bottom_left") setPlacement("floating_bottom_left");
        else if (pos === "bottom_center") setPlacement("floating_bottom_center");
        else if (pos === "top_right") setPlacement("floating_top_right");
        else if (pos === "top_left") setPlacement("floating_top_left");
        else setPlacement("floating_bottom_right");
      } else {
        setPlacement("inline_page");
      }

      // Pre-populate plugin specific records
      if (embedToEdit.floatingRecord) {
        const cfg = embedToEdit.floatingRecord.config || {};
        if (embedToEdit.pluginType === "whatsapp" || embedToEdit.floatingRecord.type === "whatsapp_chat") {
          setWaPhone(cfg.phoneNumber || "+1 234 567 8900");
          setWaMessage(cfg.prefilledMessage || "Hello! I am visiting your website and have a question.");
          setWaAgent(cfg.agentName || "Customer Support");
          setWaGreeting(cfg.greetingText || "How can we help you today?");
          setWaPosition(embedToEdit.floatingRecord.position || "bottom_right");
        } else if (embedToEdit.pluginType === "language" || embedToEdit.floatingRecord.type === "language_switcher") {
          setLangDefault(cfg.defaultLanguage || "en");
          setLangSupported(cfg.supportedLanguages || ["en", "es", "fr", "de"]);
          setLangPosition(embedToEdit.floatingRecord.position || "bottom_left");
          setLangTheme(cfg.theme || "dark");
        } else if (embedToEdit.pluginType === "accessibility" || embedToEdit.floatingRecord.type === "accessibility") {
          setA11yPosition(embedToEdit.floatingRecord.position || "bottom_left");
        }
      }

      if (embedToEdit.html) {
        if (embedToEdit.pluginType === "youtube") {
          const match = embedToEdit.html.match(/src=["']([^"']+)["']/i);
          if (match) setYtUrl(match[1]);
        } else if (embedToEdit.pluginType === "maps") {
          const match = embedToEdit.html.match(/q=([^&"']+)/i);
          if (match) setMapLocation(decodeURIComponent(match[1]));
        }
      }
    } else {
      // Default creation state based on initialPluginType
      switch (initialPluginType) {
        case "whatsapp":
          setName("WhatsApp Chat");
          setPlacement("floating_bottom_right");
          setWaPosition("bottom_right");
          break;
        case "youtube":
          setName("YouTube Video");
          setPlacement("site_wide_header");
          setYtUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
          break;
        case "maps":
          setName("Google Maps");
          setPlacement("inline_page");
          setMapLocation("1600 Amphitheatre Parkway, Mountain View, CA");
          break;
        case "language":
          setName("Language Switcher");
          setPlacement("floating_bottom_left");
          setLangPosition("bottom_left");
          break;
        case "accessibility":
          setName("Accessibility Toolbar");
          setPlacement("floating_bottom_left");
          setA11yPosition("bottom_left");
          break;
        case "contact":
          setName("Floating Contact Button");
          setPlacement("floating_bottom_right");
          break;
        case "back_to_top":
          setName("Back to Top");
          setPlacement("floating_bottom_right");
          break;
        case "announcement":
          setName("Announcement Popup");
          setPlacement("site_wide_header");
          break;
        case "reviews":
          setName("Google Reviews");
          setPlacement("inline_page");
          break;
        case "vimeo":
          setName("Vimeo Video");
          setPlacement("inline_page");
          break;
        case "store_locator":
          setName("Store Locator");
          setPlacement("inline_page");
          break;
        default:
          setName("Custom HTML");
          setPlacement("site_wide_header");
          setHtml("");
          break;
      }
    }
    setPreviewDevice("desktop");
  }, [isOpen, embedToEdit, initialPluginType]);

  if (!isOpen || !project) return null;

  const pages = project.pages || [];

  // Helper to extract clean YouTube embed URL
  const getCleanYtEmbedUrl = (raw: string) => {
    let videoId = "";
    if (raw.includes("embed/")) {
      videoId = raw.split("embed/")[1]?.split("?")[0] || "";
    } else if (raw.includes("watch?v=")) {
      videoId = raw.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (raw.includes("youtu.be/")) {
      videoId = raw.split("youtu.be/")[1]?.split("?")[0] || "";
    } else {
      videoId = raw;
    }
    const params = new URLSearchParams();
    if (ytAutoplay) params.set("autoplay", "1");
    if (ytMute) params.set("mute", "1");
    const paramStr = params.toString() ? `?${params.toString()}` : "";
    return `https://www.youtube.com/embed/${videoId}${paramStr}`;
  };

  // Helper to get Google Maps embed URL
  const getMapsEmbedUrl = (query: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  // Form submit / save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const finalName = name.trim() || "Plugin";
    setIsSubmitting(true);

    try {
      // ── A. WhatsApp Chat ───────────────────────────────────────────
      if (pluginType === "whatsapp") {
        const cleanPhone = waPhone.replace(/[^\d+]/g, "");
        const waFw: FloatingWidgetRecord = {
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
            prefilledMessage: waMessage,
            agentName: waAgent,
            greetingText: waGreeting,
            buttonLabel: "Chat with us",
            buttonColor: "#25D366",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existingList = cur.floatingWidgets || [];
          const idx = existingList.findIndex((fw) => fw.id === waFw.id || fw.type === "whatsapp_chat");
          const nextList = idx >= 0
            ? existingList.map((fw, i) => (i === idx ? waFw : fw))
            : [...existingList, waFw];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: nextList },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved WhatsApp Chat plugin`);
        onSaved?.();
        onClose();
        return;
      }

      // ── B. Language Switcher ───────────────────────────────────────
      if (pluginType === "language") {
        const langFw: FloatingWidgetRecord = {
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
            layout: "pill",
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existingList = cur.floatingWidgets || [];
          const idx = existingList.findIndex((fw) => fw.id === langFw.id || fw.type === "language_switcher");
          const nextList = idx >= 0
            ? existingList.map((fw, i) => (i === idx ? langFw : fw))
            : [...existingList, langFw];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: nextList },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Language Switcher plugin`);
        onSaved?.();
        onClose();
        return;
      }

      // ── C. Accessibility Toolbar ──────────────────────────────────
      if (pluginType === "accessibility") {
        const a11yFw: FloatingWidgetRecord = {
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
            features: {
              contrast: a11yContrast,
              fontSize: a11yFontSize,
              dyslexia: a11yDyslexia,
            },
          },
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existingList = cur.floatingWidgets || [];
          const idx = existingList.findIndex((fw) => fw.id === a11yFw.id || fw.type === "accessibility");
          const nextList = idx >= 0
            ? existingList.map((fw, i) => (i === idx ? a11yFw : fw))
            : [...existingList, a11yFw];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: nextList },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved Accessibility Toolbar plugin`);
        onSaved?.();
        onClose();
        return;
      }

      // ── D. Back to Top / Floating Contact ──────────────────────────
      if (pluginType === "back_to_top" || pluginType === "contact") {
        const fType = pluginType === "back_to_top" ? "back_to_top" : "floating_contact";
        const fwRec: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-${fType}-${nanoid(8)}`,
          type: fType,
          name: finalName,
          enabled: true,
          position: "bottom_right",
          offsetX: 20,
          offsetY: 20,
          showOnDesktop: true,
          showOnMobile: true,
          pageTargeting: "all",
          config: {},
          createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const existingList = cur.floatingWidgets || [];
          const idx = existingList.findIndex((fw) => fw.id === fwRec.id || fw.type === fType);
          const nextList = idx >= 0
            ? existingList.map((fw, i) => (i === idx ? fwRec : fw))
            : [...existingList, fwRec];
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, floatingWidgets: nextList },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved "${finalName}"`);
        onSaved?.();
        onClose();
        return;
      }

      // ── E. YouTube Video Embed ─────────────────────────────────────
      let generatedHtml = html;
      if (pluginType === "youtube") {
        const embedUrl = getCleanYtEmbedUrl(ytUrl);
        generatedHtml = `<div class="wto-youtube-plugin-wrapper" style="width:100%;max-width:1000px;margin:0 auto;aspect-ratio:16/9;border-radius:14px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.4);"><iframe width="100%" height="100%" src="${embedUrl}" title="${finalName}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:0;width:100%;height:100%;"></iframe></div>`;
      } else if (pluginType === "maps") {
        const mapUrl = getMapsEmbedUrl(mapLocation);
        generatedHtml = `<div class="wto-map-plugin-wrapper" style="width:100%;height:${mapHeight};border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.3);"><iframe width="100%" height="100%" src="${mapUrl}" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style="border:0;width:100%;height:100%;"></iframe></div>`;
      }

      if (!generatedHtml.trim()) {
        toast.error("Please enter embed code or configure the plugin");
        return;
      }

      const isSiteWide = placement === "site_wide_header" || placement === "site_wide_footer";
      const isFloating = placement.startsWith("floating_");

      if (isFloating) {
        const targetPos: FloatingPosition =
          placement === "floating_bottom_left"
            ? "bottom_left"
            : placement === "floating_bottom_center"
            ? "bottom_center"
            : placement === "floating_top_right"
            ? "top_right"
            : placement === "floating_top_left"
            ? "top_left"
            : "bottom_right";

        const floatingRecord: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-${nanoid(8)}`,
          type: "custom_embed",
          name: finalName,
          enabled: true,
          position: targetPos,
          offsetX: 20,
          offsetY: 20,
          pageTargeting: "all",
          showOnDesktop: true,
          showOnMobile: true,
          snippetHtml: generatedHtml,
          config: { html: generatedHtml },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const filtered = (cur.floatingWidgets || []).filter((fw) => fw.id !== floatingRecord.id);
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                floatingWidgets: [...filtered, floatingRecord],
              },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved floating plugin "${finalName}"`);
      } else if (isSiteWide) {
        const isHeader = placement === "site_wide_header";
        const secId = isHeader ? SHARED_HEADER_SECTION_ID : SHARED_FOOTER_SECTION_ID;
        const newSection = createCustomHtmlSection({
          id: secId,
          name: finalName,
          html: generatedHtml,
        });
        newSection.shared = isHeader ? "header" : "footer";

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                ...(isHeader
                  ? { sharedHeader: newSection }
                  : { sharedFooter: newSection }),
              },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved site-wide plugin "${finalName}"`);
      } else {
        // Inline on page
        const secId = embedToEdit?.sectionId || `plugin-${nanoid(8)}`;
        const newSection = createCustomHtmlSection({
          id: secId,
          name: finalName,
          html: generatedHtml,
        });

        const targetPage = defaultPageId || currentPageId || pages[0]?.id;
        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const updatedPages = (cur.pages || []).map((p) => {
            if (p.id === targetPage) {
              const currentSections = p.sections || [];
              const exists = currentSections.some((sec) => sec.id === secId);
              const nextSections = exists
                ? currentSections.map((sec) => (sec.id === secId ? newSection : sec))
                : [...currentSections, newSection];
              return { ...p, sections: nextSections };
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
        if (targetPage) selectPage(targetPage);
        selectSection(secId);
        persistWithStatus();
        toast.success(`Saved plugin "${finalName}"`);
      }

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
            {pluginType === "whatsapp" ? (
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
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27272A] border border-zinc-700 text-[#FACC15] font-mono text-base font-bold shadow-xs">
                &lt;/&gt;
              </span>
            )}
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {embedToEdit ? `Configure ${embedToEdit.name}` : `Add ${name || "Plugin"}`}
              </h2>
              <p className="text-xs text-zinc-400">
                {pluginType === "whatsapp"
                  ? "Connect visitors directly to WhatsApp with a floating chat button."
                  : pluginType === "youtube"
                  ? "Embed responsive YouTube videos anywhere on your website."
                  : pluginType === "maps"
                  ? "Show your business location or interactive Google Map."
                  : pluginType === "language"
                  ? "Floating language selector for website localization."
                  : pluginType === "accessibility"
                  ? "WCAG & ADA accessibility toolbar for contrast, fonts, and sizing."
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
              {/* Plugin Name */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Plugin Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. WhatsApp Chat, YouTube Video"
                  className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                />
              </div>

              {/* 1. WHATSAPP SPECIFIC FIELDS */}
              {pluginType === "whatsapp" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      WhatsApp Phone Number (with Country Code)
                    </label>
                    <input
                      type="text"
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
                      placeholder="Hello! I have a question about your services."
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
                        placeholder="Customer Support"
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Position
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
                </>
              )}

              {/* 2. YOUTUBE SPECIFIC FIELDS */}
              {pluginType === "youtube" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      YouTube Video URL or Embed Link
                    </label>
                    <input
                      type="text"
                      value={ytUrl}
                      onChange={(e) => setYtUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Placement
                    </label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value as PlacementChoice)}
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                    >
                      <option value="site_wide_header">🌐 Global Header (Site-wide)</option>
                      <option value="site_wide_footer">🌐 Global Footer (Site-wide)</option>
                      <option value="inline_page">📄 Inline on this page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ytAutoplay}
                        onChange={(e) => setYtAutoplay(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15] focus:ring-0"
                      />
                      <span>Autoplay</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ytMute}
                        onChange={(e) => setYtMute(e.target.checked)}
                        className="rounded border-zinc-700 text-[#FACC15] focus:ring-0"
                      />
                      <span>Mute</span>
                    </label>
                  </div>
                </>
              )}

              {/* 3. GOOGLE MAPS SPECIFIC FIELDS */}
              {pluginType === "maps" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Location / Address
                    </label>
                    <input
                      type="text"
                      value={mapLocation}
                      onChange={(e) => setMapLocation(e.target.value)}
                      placeholder="e.g. Times Square, New York, NY"
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FACC15]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Placement
                      </label>
                      <select
                        value={placement}
                        onChange={(e) => setPlacement(e.target.value as PlacementChoice)}
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="inline_page">📄 Inline on this page</option>
                        <option value="site_wide_footer">🌐 Global Footer (Site-wide)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Height
                      </label>
                      <input
                        type="text"
                        value={mapHeight}
                        onChange={(e) => setMapHeight(e.target.value)}
                        placeholder="360px"
                        className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 4. LANGUAGE SWITCHER SPECIFIC FIELDS */}
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
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white mb-1.5">
                        Position
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
                </>
              )}

              {/* 5. ACCESSIBILITY SPECIFIC FIELDS */}
              {pluginType === "accessibility" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Position
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

                  <div className="space-y-2 pt-1">
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
                  </div>
                </>
              )}

              {/* 6. CUSTOM HTML / RAW EMBED FIELDS */}
              {(pluginType === "custom_html" || (!["whatsapp", "youtube", "maps", "language", "accessibility"].includes(pluginType))) && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Where to Add
                    </label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value as PlacementChoice)}
                      className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white outline-none focus:border-[#FACC15]"
                    >
                      <option value="site_wide_header">🌐 Site-wide (Header)</option>
                      <option value="site_wide_footer">🌐 Site-wide (Footer)</option>
                      <option value="floating_bottom_right">💬 Floating - Bottom Right</option>
                      <option value="floating_bottom_left">💬 Floating - Bottom Left</option>
                      <option value="floating_bottom_center">💬 Floating - Bottom Center</option>
                      <option value="floating_top_right">💬 Floating - Top Right</option>
                      <option value="floating_top_left">💬 Floating - Top Left</option>
                      <option value="inline_page">📄 Inline on this page</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1.5">
                      Embed Code
                    </label>
                    <textarea
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      placeholder={`<iframe width="100%" height="400" src="https://..." frameborder="0" allowfullscreen></iframe>`}
                      className="h-44 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-[#FACC15] resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}
            </div>

            {/* ── RIGHT COLUMN: Preview Frame ── */}
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

              {/* Simulated Website Frame */}
              <div
                className={`relative flex-1 rounded-xl border border-[#28282C] bg-[#0E0E10] overflow-hidden flex flex-col shadow-inner min-h-[320px] transition-all duration-200 mx-auto w-full ${
                  previewDevice === "mobile" ? "max-w-[280px]" : "max-w-full"
                }`}
              >
                {/* Mock Browser Navbar */}
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

                {/* Preview Display Area */}
                <div className="relative flex-1 p-3 flex flex-col overflow-y-auto bg-[#0A0A0C]">
                  {/* WhatsApp Preview */}
                  {pluginType === "whatsapp" && (
                    <div className="relative h-full min-h-[220px] flex flex-col justify-end">
                      <div
                        className={`absolute ${
                          waPosition.includes("left") ? "left-3" : "right-3"
                        } ${waPosition.includes("top") ? "top-3" : "bottom-3"} flex flex-col items-${
                          waPosition.includes("left") ? "start" : "end"
                        } gap-2`}
                      >
                        <div className="rounded-2xl bg-[#1F2C34] text-white p-3 border border-emerald-500/30 shadow-xl max-w-[210px] text-left">
                          <p className="text-[11px] font-bold text-emerald-400">{waAgent}</p>
                          <p className="text-[10px] text-zinc-200 mt-0.5">{waGreeting}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* YouTube Preview */}
                  {pluginType === "youtube" && (
                    <div className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-video flex items-center justify-center">
                      <iframe
                        src={getCleanYtEmbedUrl(ytUrl)}
                        title="YouTube Preview"
                        className="w-full h-full border-none"
                      />
                    </div>
                  )}

                  {/* Google Maps Preview */}
                  {pluginType === "maps" && (
                    <div className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-black h-48 flex items-center justify-center">
                      <iframe
                        src={getMapsEmbedUrl(mapLocation)}
                        title="Google Maps Preview"
                        className="w-full h-full border-none"
                      />
                    </div>
                  )}

                  {/* Language Switcher Preview */}
                  {pluginType === "language" && (
                    <div className="relative h-full min-h-[200px] flex items-center justify-center">
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

                  {/* Accessibility Preview */}
                  {pluginType === "accessibility" && (
                    <div className="relative h-full min-h-[200px] flex items-center justify-center">
                      <div
                        className={`absolute ${
                          a11yPosition.includes("left") ? "left-3" : "right-3"
                        } ${a11yPosition.includes("top") ? "top-3" : "bottom-3"}`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#9333EA] text-white shadow-lg">
                          <Accessibility className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom HTML Preview */}
                  {(pluginType === "custom_html" || (!["whatsapp", "youtube", "maps", "language", "accessibility"].includes(pluginType))) && (
                    <div className="w-full flex-1 min-h-[180px] flex flex-col justify-center">
                      {html.trim() ? (
                        <div
                          className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-black/60 p-3 text-xs text-white"
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-8">
                          <Code2 className="h-8 w-8 text-zinc-600 mb-2 opacity-50" />
                          <p className="text-xs">Paste your embed code to preview</p>
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
              <span>{embedToEdit ? "Save Changes" : "Save Plugin"}</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
