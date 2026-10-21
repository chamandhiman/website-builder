"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Megaphone,
  Gift,
  Volume2,
  Info,
  Bell,
  Tag,
  Check,
  Clock,
  Leaf,
  Sparkles,
  ExternalLink,
  Monitor,
  Smartphone,
  ChevronDown,
  Calendar,
  Sliders,
  Palette,
  Eye,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { nanoid } from "nanoid";
import { useBuilder } from "@/lib/builder/store";
import type { CustomEmbedItem } from "@/lib/builder/customEmbedsUtils";
import type { FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";

export interface AnnouncementBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedToEdit?: CustomEmbedItem | null;
  onSaved?: () => void;
}

export type AnnouncementTemplateKey =
  | "classic"
  | "with_button"
  | "information"
  | "success"
  | "seasonal"
  | "minimal"
  | "gradient"
  | "countdown"
  | "announcement_link"
  | "multiline";

export interface AnnouncementTemplateDef {
  key: AnnouncementTemplateKey;
  number: number;
  name: string;
  defaultText: string;
  defaultHeadline?: string;
  defaultIcon: string;
  defaultBg: string;
  defaultTextColor: string;
  hasButton: boolean;
  defaultBtnText?: string;
  defaultBtnBg?: string;
  defaultBtnTextColor?: string;
  defaultLinkText?: string;
}

export const ANNOUNCEMENT_10_TEMPLATES: AnnouncementTemplateDef[] = [
  {
    key: "classic",
    number: 1,
    name: "Classic",
    defaultText: "2027 Winter and Spring Schedules are now open for enrollment!",
    defaultIcon: "megaphone",
    defaultBg: "#4A1525", // Deep burgundy wine
    defaultTextColor: "#FFFFFF",
    hasButton: false,
  },
  {
    key: "with_button",
    number: 2,
    name: "With Button",
    defaultText: "New Student Discount! Save 20% on Enrollment!",
    defaultIcon: "gift",
    defaultBg: "#FFFFFF",
    defaultTextColor: "#18181B",
    hasButton: true,
    defaultBtnText: "Learn More",
    defaultBtnBg: "#FACC15",
    defaultBtnTextColor: "#18181B",
  },
  {
    key: "information",
    number: 3,
    name: "Information",
    defaultHeadline: "Important Update",
    defaultText: "New office hours from Jan 1, 2027.",
    defaultIcon: "info",
    defaultBg: "#1D4ED8", // Royal blue
    defaultTextColor: "#FFFFFF",
    hasButton: true,
    defaultBtnText: "View Details",
    defaultBtnBg: "#FFFFFF",
    defaultBtnTextColor: "#1D4ED8",
  },
  {
    key: "success",
    number: 4,
    name: "Success",
    defaultHeadline: "Enroll Now for Spring 2027",
    defaultText: "Limited Seats Available!",
    defaultIcon: "check",
    defaultBg: "#059669", // Emerald green
    defaultTextColor: "#FFFFFF",
    hasButton: true,
    defaultBtnText: "Register Now",
    defaultBtnBg: "#FFFFFF",
    defaultBtnTextColor: "#059669",
  },
  {
    key: "seasonal",
    number: 5,
    name: "Seasonal",
    defaultHeadline: "Halloween Special",
    defaultText: "Get 15% off on all courses!",
    defaultIcon: "gift",
    defaultBg: "#EA580C", // Vibrant festive orange
    defaultTextColor: "#FFFFFF",
    hasButton: true,
    defaultBtnText: "View Offers",
    defaultBtnBg: "#18181B",
    defaultBtnTextColor: "#FFFFFF",
  },
  {
    key: "minimal",
    number: 6,
    name: "Minimal",
    defaultText: "Limited Time Offer: Free Driving Guide with Enrollment!",
    defaultIcon: "megaphone",
    defaultBg: "#FFFFFF",
    defaultTextColor: "#18181B",
    hasButton: false,
  },
  {
    key: "gradient",
    number: 7,
    name: "Gradient",
    defaultText: "Special Offer! Save 15% on your first driving lesson.",
    defaultIcon: "none",
    defaultBg: "linear-gradient(90deg, #9333EA 0%, #EC4899 100%)",
    defaultTextColor: "#FFFFFF",
    hasButton: true,
    defaultBtnText: "Get Started",
    defaultBtnBg: "#FFFFFF",
    defaultBtnTextColor: "#18181B",
  },
  {
    key: "countdown",
    number: 8,
    name: "Countdown",
    defaultText: "Spring Enrollment Ends In:",
    defaultIcon: "clock",
    defaultBg: "#111114",
    defaultTextColor: "#FFFFFF",
    hasButton: true,
    defaultBtnText: "Enroll Now",
    defaultBtnBg: "#EF4444",
    defaultBtnTextColor: "#FFFFFF",
  },
  {
    key: "announcement_link",
    number: 9,
    name: "Announcement + Link",
    defaultText: "2027 Classes Are Open",
    defaultLinkText: "Check Locations Near You →",
    defaultIcon: "leaf",
    defaultBg: "#F0FDF4", // Mint light
    defaultTextColor: "#14532D",
    hasButton: false,
  },
  {
    key: "multiline",
    number: 10,
    name: "Multi-line",
    defaultHeadline: "New Classes Now Open!",
    defaultText: "Join Michigan's most trusted driving school. Enroll today and start your journey.",
    defaultIcon: "megaphone",
    defaultBg: "#FFFFFF",
    defaultTextColor: "#18181B",
    hasButton: true,
    defaultBtnText: "Get Started",
    defaultBtnBg: "#FACC15",
    defaultBtnTextColor: "#18181B",
  },
];

// Color Swatches matching mockup
export const BG_COLOR_SWATCHES = [
  { value: "#4A1525", label: "Burgundy" },
  { value: "#DC2626", label: "Red" },
  { value: "#1D4ED8", label: "Blue" },
  { value: "#0891B2", label: "Cyan" },
  { value: "#059669", label: "Green" },
  { value: "#EA580C", label: "Orange" },
  { value: "#9333EA", label: "Purple" },
  { value: "#18181B", label: "Dark" },
  { value: "#FFFFFF", label: "White" },
  { value: "linear-gradient(90deg, #9333EA 0%, #EC4899 100%)", label: "Gradient" },
];

export const TEXT_COLOR_SWATCHES = [
  { value: "#FFFFFF", label: "White" },
  { value: "#18181B", label: "Dark" },
  { value: "#FACC15", label: "Yellow" },
  { value: "#14532D", label: "Green" },
];

export const BUTTON_COLOR_SWATCHES = [
  { value: "#FACC15", label: "Yellow", textColor: "#18181B" },
  { value: "#FFFFFF", label: "White", textColor: "#18181B" },
  { value: "#18181B", label: "Dark", textColor: "#FFFFFF" },
  { value: "#EF4444", label: "Red", textColor: "#FFFFFF" },
];

export const ICON_OPTIONS = [
  { key: "megaphone", label: "Megaphone", icon: Megaphone },
  { key: "gift", label: "Gift", icon: Gift },
  { key: "bullhorn", label: "Speaker", icon: Volume2 },
  { key: "info", label: "Info", icon: Info },
  { key: "bell", label: "Bell", icon: Bell },
  { key: "tag", label: "Tag", icon: Tag },
  { key: "check", label: "Check", icon: Check },
  { key: "leaf", label: "Leaf", icon: Leaf },
  { key: "sparkles", label: "Sparkles", icon: Sparkles },
  { key: "none", label: "None", icon: X },
];

// Helper to calculate default 7 days from now formatted for input type="datetime-local"
function getDefaultCountdownDateTime(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(23, 59, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AnnouncementBarModal({
  isOpen,
  onClose,
  embedToEdit,
  onSaved,
}: AnnouncementBarModalProps) {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // Active Left Column Tab: "design" or "preferences"
  const [activeTab, setActiveTab] = useState<"design" | "preferences">("design");

  // Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<AnnouncementTemplateKey>("classic");

  // Form Content
  const [text, setText] = useState("2027 Winter and Spring Schedules are now open for enrollment!");
  const [headline, setHeadline] = useState("");
  const [icon, setIcon] = useState<string>("megaphone");

  // Action / Button
  const [buttonText, setButtonText] = useState("Learn More");
  const [buttonUrl, setButtonUrl] = useState("https://");
  const [openNewTab, setOpenNewTab] = useState(true);
  const [linkText, setLinkText] = useState("Check Locations Near You →");

  // Countdown specific
  const [countdownDate, setCountdownDate] = useState(getDefaultCountdownDateTime());
  const [countdownUnits, setCountdownUnits] = useState({ days: 12, hours: 5, mins: 30, secs: 20 });

  // Styles
  const [bgColor, setBgColor] = useState("#4A1525");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [buttonBg, setButtonBg] = useState("#FACC15");
  const [buttonTextColor, setButtonTextColor] = useState("#18181B");

  // Position & Targeting
  const [position, setPosition] = useState<"top_fixed" | "bottom_fixed">("top_fixed");
  const [pageTargeting, setPageTargeting] = useState<"all" | "custom">("all");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showOnDesktop, setShowOnDesktop] = useState(true);
  const [showOnMobile, setShowOnMobile] = useState(true);

  // Display Options
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [allowDismiss, setAllowDismiss] = useState(true);
  const [animateSlideDown, setAnimateSlideDown] = useState(true);

  // UI State
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomPagesOpen, setIsCustomPagesOpen] = useState(false);

  // Track if user has custom-edited text so template switches don't accidentally wipe it
  const isUserEditedText = useRef(false);

  // Always reset to Design tab on modal open
  useEffect(() => {
    if (isOpen) {
      setActiveTab("design");
    }
  }, [isOpen]);

  // Countdown live ticker calculation
  useEffect(() => {
    if (selectedTemplate !== "countdown") return;

    const calculateRemaining = () => {
      const target = new Date(countdownDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((target - now) / 1000));
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;
      setCountdownUnits({ days, hours, mins, secs });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [selectedTemplate, countdownDate]);

  // Load existing configuration when editing
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit) {
      const fw = embedToEdit.floatingRecord;
      const cfg = fw?.config || {};

      const tpl = (cfg.template as AnnouncementTemplateKey) || "classic";
      setSelectedTemplate(tpl);
      setText(cfg.text || cfg.message || cfg.headline || "2027 Winter and Spring Schedules are now open for enrollment!");
      setHeadline(cfg.headline || "");
      setIcon(cfg.icon || "megaphone");
      setButtonText(cfg.buttonText || cfg.ctaLabel || "Learn More");
      setButtonUrl(cfg.linkUrl || "https://");
      setOpenNewTab(cfg.linkNewTab !== false);
      setLinkText(cfg.linkText || "Check Locations Near You →");
      setCountdownDate(cfg.countdownDate || getDefaultCountdownDateTime());

      setBgColor(cfg.backgroundColor || "#4A1525");
      setTextColor(cfg.textColor || "#FFFFFF");
      setButtonBg(cfg.btnBgColor || "#FACC15");
      setButtonTextColor(cfg.btnTextColor || "#18181B");

      setPosition(fw?.position === "bottom_fixed" ? "bottom_fixed" : "top_fixed");
      setPageTargeting(fw?.pageTargeting === "custom" ? "custom" : "all");
      setSelectedPages(fw?.targetedPages || []);
      setShowOnDesktop(fw?.showOnDesktop !== false);
      setShowOnMobile(fw?.showOnMobile !== false);

      setShowCloseButton(cfg.showCloseButton !== false);
      setAllowDismiss(cfg.allowDismiss !== false);
      setAnimateSlideDown(cfg.animation === "slide_down" || cfg.animation === undefined);
      isUserEditedText.current = true;
    } else {
      // New announcement defaults
      setSelectedTemplate("classic");
      setText("2027 Winter and Spring Schedules are now open for enrollment!");
      setHeadline("");
      setIcon("megaphone");
      setButtonText("Learn More");
      setButtonUrl("https://");
      setOpenNewTab(true);
      setLinkText("Check Locations Near You →");
      setCountdownDate(getDefaultCountdownDateTime());
      setBgColor("#4A1525");
      setTextColor("#FFFFFF");
      setButtonBg("#FACC15");
      setButtonTextColor("#18181B");
      setPosition("top_fixed");
      setPageTargeting("all");
      setSelectedPages([]);
      setShowOnDesktop(true);
      setShowOnMobile(true);
      setShowCloseButton(true);
      setAllowDismiss(true);
      setAnimateSlideDown(true);
      isUserEditedText.current = false;
    }
  }, [isOpen, embedToEdit]);

  // When template card is clicked: update template & set smart compatible defaults
  const handleSelectTemplate = (tplKey: AnnouncementTemplateKey) => {
    setSelectedTemplate(tplKey);
    const def = ANNOUNCEMENT_10_TEMPLATES.find((t) => t.key === tplKey);
    if (!def) return;

    setBgColor(def.defaultBg);
    setTextColor(def.defaultTextColor);
    setIcon(def.defaultIcon);

    if (def.defaultHeadline) {
      setHeadline(def.defaultHeadline);
    }
    if (def.defaultBtnText) {
      setButtonText(def.defaultBtnText);
    }
    if (def.defaultBtnBg) {
      setButtonBg(def.defaultBtnBg);
    }
    if (def.defaultBtnTextColor) {
      setButtonTextColor(def.defaultBtnTextColor);
    }
    if (def.defaultLinkText) {
      setLinkText(def.defaultLinkText);
    }

    // Only set default text if user hasn't explicitly customized their text yet
    if (!isUserEditedText.current) {
      setText(def.defaultText);
    }
  };

  const handleTextChange = (val: string) => {
    setText(val);
    isUserEditedText.current = true;
  };

  const currentTplDef = useMemo(() => {
    return ANNOUNCEMENT_10_TEMPLATES.find((t) => t.key === selectedTemplate) || ANNOUNCEMENT_10_TEMPLATES[0];
  }, [selectedTemplate]);

  // Render icon inside miniature cards or preview
  const renderIconElem = (iconKey: string, size = 16, color?: string) => {
    const iconColor = color || textColor;
    switch (iconKey) {
      case "megaphone":
        return <Megaphone size={size} color={iconColor} className="flex-shrink-0" />;
      case "gift":
        return <Gift size={size} color={iconColor} className="flex-shrink-0" />;
      case "bullhorn":
        return <Volume2 size={size} color={iconColor} className="flex-shrink-0" />;
      case "info":
        return <Info size={size} color={iconColor} className="flex-shrink-0" />;
      case "bell":
        return <Bell size={size} color={iconColor} className="flex-shrink-0" />;
      case "tag":
        return <Tag size={size} color={iconColor} className="flex-shrink-0" />;
      case "check":
        return <Check size={size} color={iconColor} className="flex-shrink-0 stroke-[2.5]" />;
      case "clock":
        return <Clock size={size} color={iconColor} className="flex-shrink-0" />;
      case "leaf":
        return <Leaf size={size} color={iconColor} className="flex-shrink-0" />;
      case "sparkles":
        return <Sparkles size={size} color={iconColor} className="flex-shrink-0" />;
      case "none":
        return null;
      default:
        return null;
    }
  };

  // Save Plugin Handler
  const handleSave = async () => {
    if (!text.trim()) {
      toast.error("Announcement text is required");
      return;
    }

    if (!showOnDesktop && !showOnMobile) {
      toast.error("Please enable at least one device (Desktop or Mobile)");
      return;
    }

    if (pageTargeting === "custom" && selectedPages.length === 0) {
      toast.error("Please select at least one page under Selected Pages");
      return;
    }

    setIsSaving(true);

    try {
      const fwId = embedToEdit?.floatingId || embedToEdit?.id || `fw-ann-${nanoid(8)}`;
      const targetTs = countdownDate ? new Date(countdownDate).getTime() : undefined;

      const fwRecord: FloatingWidgetRecord = {
        id: fwId,
        type: "announcement_popup",
        name: `Announcement Bar (${currentTplDef.name})`,
        enabled: true,
        position,
        offsetX: 0,
        offsetY: 0,
        showOnDesktop,
        showOnMobile,
        pageTargeting,
        targetedPages: pageTargeting === "custom" ? selectedPages : undefined,
        config: {
          template: selectedTemplate,
          text: text.trim(),
          headline: headline.trim(),
          icon,
          buttonText: buttonText.trim(),
          linkUrl: buttonUrl.trim(),
          linkNewTab: openNewTab,
          linkText: linkText.trim(),
          countdownDate,
          countdownTarget: targetTs,
          backgroundColor: bgColor,
          textColor,
          btnBgColor: buttonBg,
          btnTextColor: buttonTextColor,
          showCloseButton,
          allowDismiss,
          animation: animateSlideDown ? "slide_down" : "none",
          layout: "banner",
        },
        createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        const existing = cur.floatingWidgets || [];
        const idx = existing.findIndex((w) => w.id === fwRecord.id);
        const next =
          idx >= 0
            ? existing.map((w, i) => (i === idx ? fwRecord : w))
            : [...existing, fwRecord];

        return {
          projects: {
            ...s.projects,
            [cur.id]: { ...cur, floatingWidgets: next },
          },
        };
      });

      await persistWithStatus();
      toast.success("Announcement Bar saved successfully!");
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("[AnnouncementBarModal] Save error:", err);
      toast.error(err?.message || "Failed to save Announcement Bar plugin");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-[1320px] max-h-[94vh] flex flex-col bg-[#12141A] border border-[#232733] rounded-2xl shadow-2xl text-zinc-100 overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232733] bg-[#161822] flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-purple-900/40 text-white flex-shrink-0">
              <Megaphone size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                {embedToEdit ? "Edit Announcement Bar" : "Add Announcement Bar"}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customize your announcement bar design and preferences with instant live preview.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── TWO-COLUMN BODY ─────────────────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[480px_1fr] overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#232733] min-h-0">
          {/* ── LEFT COLUMN: CONFIGURATION (DESIGN + PREFERENCES TABS) ─────────── */}
          <div className="flex flex-col h-full overflow-hidden bg-[#101217]">
            {/* Tab Navigation Strip */}
            <div className="flex items-center gap-2 p-3 border-b border-[#232733] bg-[#14161F] flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "design"
                    ? "bg-[#FACC15] text-zinc-950 shadow-md shadow-yellow-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-[#1C202C]"
                }`}
              >
                <Sparkles size={14} className={activeTab === "design" ? "text-zinc-950" : "text-zinc-400"} />
                <span>Design</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    activeTab === "design" ? "bg-black/15 text-zinc-950" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  10
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preferences")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "preferences"
                    ? "bg-[#FACC15] text-zinc-950 shadow-md shadow-yellow-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-[#1C202C]"
                }`}
              >
                <Sliders size={14} className={activeTab === "preferences" ? "text-zinc-950" : "text-zinc-400"} />
                <span>Preferences</span>
              </button>
            </div>

            {/* TAB 1: DESIGN — 10 Template Cards Only */}
            {activeTab === "design" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar bg-[#101217]">
                <div className="mb-2 px-0.5">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Select Template Preset
                  </span>
                </div>

                {ANNOUNCEMENT_10_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplate === tpl.key;

                  return (
                    <div
                      key={tpl.key}
                      onClick={() => handleSelectTemplate(tpl.key)}
                      className={`group relative p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? "border-[#FACC15] bg-[#1C1F2B] ring-1 ring-[#FACC15]/50 shadow-md"
                          : "border-[#232733] bg-[#141720] hover:border-zinc-700 hover:bg-[#181B26]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Switch Indicator (behaves like radio) */}
                        <div className="flex items-center gap-2 flex-shrink-0 w-28">
                          <Switch
                            checked={isSelected}
                            onCheckedChange={() => handleSelectTemplate(tpl.key)}
                            className="data-[state=checked]:bg-[#FACC15] scale-75 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className={`text-xs font-semibold whitespace-nowrap ${isSelected ? "text-white" : "text-zinc-400"}`}>
                            {tpl.number}. {tpl.name}
                          </span>
                        </div>

                        {/* Realistic Mini Announcement Bar Preview */}
                        <div
                          className="flex-1 min-w-0 rounded-lg px-2.5 py-1.5 text-[11px] font-medium flex items-center justify-between gap-1.5 shadow-sm border border-black/10 overflow-hidden"
                          style={{
                            background: tpl.defaultBg,
                            color: tpl.defaultTextColor,
                          }}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                            {tpl.defaultIcon !== "none" && (
                              <span className="flex-shrink-0 opacity-90">
                                {renderIconElem(tpl.defaultIcon, 13, tpl.defaultTextColor)}
                              </span>
                            )}
                            <span className="truncate leading-tight">
                              {tpl.defaultHeadline ? (
                                <strong className="mr-1">{tpl.defaultHeadline}:</strong>
                              ) : null}
                              {tpl.defaultText}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Countdown Pill Badges Preview */}
                            {tpl.key === "countdown" && (
                              <div className="flex items-center gap-0.5 text-[9px] text-white">
                                <span className="bg-black/50 px-1 py-0.5 rounded font-mono font-bold">12d</span>
                                <span className="bg-black/50 px-1 py-0.5 rounded font-mono font-bold">05h</span>
                              </div>
                            )}

                            {/* Inline Link Preview */}
                            {tpl.key === "announcement_link" && (
                              <span className="underline font-bold text-[10px] whitespace-nowrap text-emerald-800">
                                {tpl.defaultLinkText}
                              </span>
                            )}

                            {/* Button Preview */}
                            {tpl.hasButton && tpl.defaultBtnText && (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-sm"
                                style={{
                                  background: tpl.defaultBtnBg,
                                  color: tpl.defaultBtnTextColor,
                                }}
                              >
                                {tpl.defaultBtnText}
                              </span>
                            )}

                            {/* Close Button Preview */}
                            <span className="opacity-60 hover:opacity-100 text-[11px] leading-none ml-0.5">✕</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: PREFERENCES — Compact Organized Settings */}
            {activeTab === "preferences" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#101217]">
                {/* 1. Content */}
                <div className="p-3.5 rounded-xl bg-[#161922] border border-[#252A38] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Content
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Text & Icons</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Announcement Text <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => handleTextChange(e.target.value)}
                      placeholder="e.g. 2027 Winter and Spring Schedules are now open for enrollment!"
                      className="w-full bg-[#1A1D27] border border-[#2E3547] focus:border-[#FACC15] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Optional Icon */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-semibold text-zinc-300 block">Icon (Optional)</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {ICON_OPTIONS.map((opt) => {
                        const IconComp = opt.icon;
                        const isChosen = icon === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setIcon(isChosen ? "none" : opt.key)}
                            title={opt.label}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                              isChosen
                                ? "border-[#FACC15] bg-[#222736] text-[#FACC15] ring-1 ring-[#FACC15]"
                                : "border-[#2E3547] bg-[#1A1D27] text-zinc-400 hover:text-white hover:border-zinc-600"
                            }`}
                          >
                            <IconComp size={15} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title / Headline where supported */}
                  {(selectedTemplate === "multiline" ||
                    selectedTemplate === "information" ||
                    selectedTemplate === "success" ||
                    selectedTemplate === "seasonal") && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-semibold text-zinc-300 block">
                        Title / Supporting Headline
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. Important Update / New Classes"
                        className="w-full bg-[#1A1D27] border border-[#2E3547] focus:border-[#FACC15] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Inline Link Text where supported */}
                  {selectedTemplate === "announcement_link" && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-semibold text-zinc-300 block">Link Text</label>
                      <input
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        placeholder="e.g. Check Locations Near You →"
                        className="w-full bg-[#1A1D27] border border-[#2E3547] focus:border-[#FACC15] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Action (Conditional on button / link support) */}
                {(currentTplDef.hasButton || selectedTemplate === "announcement_link") && (
                  <div className="p-3.5 rounded-xl bg-[#161922] border border-[#252A38] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Action & Link
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">CTA Button</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentTplDef.hasButton && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 block">Button Text</label>
                          <input
                            type="text"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="e.g. Learn More"
                            className="w-full bg-[#1A1D27] border border-[#2E3547] focus:border-[#FACC15] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                          />
                        </div>
                      )}

                      <div className={`space-y-1.5 ${!currentTplDef.hasButton ? "sm:col-span-2" : ""}`}>
                        <label className="text-xs font-semibold text-zinc-300 block">Destination URL</label>
                        <input
                          type="text"
                          value={buttonUrl}
                          onChange={(e) => setButtonUrl(e.target.value)}
                          placeholder="https://"
                          className="w-full bg-[#1A1D27] border border-[#2E3547] focus:border-[#FACC15] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none pt-1">
                      <input
                        type="checkbox"
                        checked={openNewTab}
                        onChange={(e) => setOpenNewTab(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FACC15] cursor-pointer"
                      />
                      <span>Open link in a new tab</span>
                    </label>
                  </div>
                )}

                {/* 3. Appearance */}
                <div className="p-3.5 rounded-xl bg-[#161922] border border-[#252A38] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Appearance
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Colors & Theme</span>
                  </div>

                  {/* Background Color */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-300 block">Background Color</label>
                      <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]">
                        {bgColor}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {BG_COLOR_SWATCHES.map((swatch, idx) => {
                        const isSelected = bgColor === swatch.value;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setBgColor(swatch.value)}
                            title={swatch.label}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              isSelected
                                ? "ring-2 ring-white ring-offset-2 ring-offset-[#161922] scale-110"
                                : "border-white/20 hover:scale-105"
                            }`}
                            style={{ background: swatch.value }}
                          />
                        );
                      })}
                      {/* Custom Color Input */}
                      <label
                        className="relative flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-zinc-500 hover:border-white cursor-pointer overflow-hidden transition-colors"
                        title="Pick custom color"
                      >
                        <input
                          type="color"
                          value={bgColor.startsWith("#") ? bgColor : "#4A1525"}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <span className="text-[10px] text-zinc-400 font-bold">+</span>
                      </label>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-2 pt-1 border-t border-[#232733]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-300 block">Text Color</label>
                      <span className="text-[10px] text-zinc-400 font-mono">{textColor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {TEXT_COLOR_SWATCHES.map((swatch, idx) => {
                        const isSelected = textColor === swatch.value;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTextColor(swatch.value)}
                            title={swatch.label}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              isSelected
                                ? "ring-2 ring-white ring-offset-2 ring-offset-[#161922] scale-110"
                                : "border-white/20 hover:scale-105"
                            }`}
                            style={{ background: swatch.value }}
                          />
                        );
                      })}
                      <label
                        className="relative flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-zinc-500 hover:border-white cursor-pointer overflow-hidden transition-colors"
                        title="Pick custom text color"
                      >
                        <input
                          type="color"
                          value={textColor.startsWith("#") ? textColor : "#FFFFFF"}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <span className="text-[10px] text-zinc-400 font-bold">+</span>
                      </label>
                    </div>
                  </div>

                  {/* Button Colors (where relevant) */}
                  {currentTplDef.hasButton && (
                    <div className="space-y-2 pt-1 border-t border-[#232733]">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300 block">Button Style</label>
                        <span className="text-[10px] text-zinc-400 font-mono">{buttonBg}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {BUTTON_COLOR_SWATCHES.map((swatch, idx) => {
                          const isSelected = buttonBg === swatch.value;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setButtonBg(swatch.value);
                                setButtonTextColor(swatch.textColor);
                              }}
                              title={swatch.label}
                              className={`w-6 h-6 rounded-full border transition-all ${
                                isSelected
                                  ? "ring-2 ring-white ring-offset-2 ring-offset-[#161922] scale-110"
                                  : "border-white/20 hover:scale-105"
                              }`}
                              style={{ background: swatch.value }}
                            />
                          );
                        })}
                        <label
                          className="relative flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-zinc-500 hover:border-white cursor-pointer overflow-hidden transition-colors"
                          title="Pick custom button color"
                        >
                          <input
                            type="color"
                            value={buttonBg.startsWith("#") ? buttonBg : "#FACC15"}
                            onChange={(e) => setButtonBg(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <span className="text-[10px] text-zinc-400 font-bold">+</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Placement */}
                <div className="p-3.5 rounded-xl bg-[#161922] border border-[#252A38] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Placement
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Position on Page</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPosition("top_fixed")}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        position === "top_fixed"
                          ? "border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                          : "border-[#2E3547] bg-[#1A1D27] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span>Top of Website</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPosition("bottom_fixed")}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        position === "bottom_fixed"
                          ? "border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                          : "border-[#2E3547] bg-[#1A1D27] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span>Bottom of Website</span>
                    </button>
                  </div>
                </div>

                {/* 5. Visibility */}
                <div className="p-3.5 rounded-xl bg-[#161922] border border-[#252A38] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Visibility
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Targeting & Devices</span>
                  </div>

                  {/* Target Pages */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 block">Show On</label>
                    <select
                      value={pageTargeting}
                      onChange={(e) => setPageTargeting(e.target.value as "all" | "custom")}
                      className="w-full bg-[#1A1D27] border border-[#2E3547] text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#FACC15]"
                    >
                      <option value="all">All Pages</option>
                      <option value="custom">Selected Pages</option>
                    </select>

                    {pageTargeting === "custom" && (
                      <div className="pt-2 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => setIsCustomPagesOpen(!isCustomPagesOpen)}
                          className="flex items-center justify-between w-full text-xs text-zinc-300 bg-[#1A1D27] px-3 py-1.5 rounded border border-[#2E3547]"
                        >
                          <span>
                            {selectedPages.length === 0
                              ? "Select pages..."
                              : `${selectedPages.length} page(s) selected`}
                          </span>
                          <ChevronDown size={14} />
                        </button>

                        {isCustomPagesOpen && (
                          <div className="max-h-28 overflow-y-auto p-2 bg-[#1A1D27] rounded border border-[#2E3547] space-y-1 text-xs">
                            {project?.pages?.map((p) => {
                              const isChecked = selectedPages.includes(p.id);
                              return (
                                <label
                                  key={p.id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setSelectedPages(selectedPages.filter((id) => id !== p.id));
                                      } else {
                                        setSelectedPages([...selectedPages, p.id]);
                                      }
                                    }}
                                    className="w-3.5 h-3.5 rounded accent-[#FACC15]"
                                  />
                                  <span className="text-zinc-200">{p.name || p.slug || "Page"}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Device Targeting */}
                  <div className="space-y-1.5 pt-2 border-t border-[#232733]">
                    <label className="text-xs font-semibold text-zinc-300 block">Show on Devices</label>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          checked={showOnDesktop}
                          onChange={(e) => setShowOnDesktop(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#FACC15] cursor-pointer"
                        />
                        <span>Desktop</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-zinc-200 select-none">
                        <input
                          type="checkbox"
                          checked={showOnMobile}
                          onChange={(e) => setShowOnMobile(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#FACC15] cursor-pointer"
                        />
                        <span>Mobile</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 6. Behavior */}
                <div className="p-3.5 rounded-xl bg-[#161922] border border-[#252A38] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Behavior
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">Interaction & Animation</span>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-200 select-none">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={showCloseButton}
                        onChange={(e) => setShowCloseButton(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FACC15] cursor-pointer"
                      />
                      <span>Show Close Button</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={allowDismiss}
                        onChange={(e) => setAllowDismiss(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FACC15] cursor-pointer"
                      />
                      <span>Allow Dismiss (Remember for 7 days)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={animateSlideDown}
                        onChange={(e) => setAnimateSlideDown(e.target.checked)}
                        className="w-4 h-4 rounded accent-[#FACC15] cursor-pointer"
                      />
                      <span>Animate Slide In</span>
                    </label>
                  </div>
                </div>

                {/* 7. Countdown (Conditional on Countdown design) */}
                {selectedTemplate === "countdown" && (
                  <div className="p-3.5 rounded-xl bg-[#161922] border border-[#FACC15]/30 space-y-3 shadow-md shadow-yellow-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                        <Clock size={13} />
                        <span>Countdown Timer</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">Live ticker</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#FACC15]" />
                        <span>End Date and Time</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={countdownDate}
                        onChange={(e) => setCountdownDate(e.target.value)}
                        className="w-full bg-[#1A1D27] border border-[#2E3547] focus:border-[#FACC15] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 bg-[#1A1D27] p-2 rounded-lg border border-[#2E3547]">
                      <span>Remaining:</span>
                      <span className="font-mono font-bold text-white tracking-wide">
                        {countdownUnits.days}d {countdownUnits.hours}h {countdownUnits.mins}m {countdownUnits.secs}s
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: FIXED LIVE PREVIEW ──────────────────────────────── */}
          <div className="flex flex-col h-full overflow-hidden bg-[#0A0C10] p-5 space-y-4">
            {/* Live Preview Top Control Bar */}
            <div className="flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Live Preview
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
              </div>

              {/* Desktop / Mobile Switcher */}
              <div className="flex items-center gap-1 rounded-lg bg-[#181B26] p-1 border border-[#272B3A]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    previewDevice === "desktop"
                      ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Monitor size={14} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    previewDevice === "mobile"
                      ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Smartphone size={14} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Browser Mockup Canvas Frame */}
            <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar pt-2">
              <div
                className={`w-full rounded-xl border border-[#2D3344] bg-[#0A0C10] shadow-2xl overflow-hidden transition-all duration-300 ${
                  previewDevice === "mobile" ? "max-w-[375px]" : "w-full"
                }`}
              >
                {/* Browser Mockup Top Header */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-[#1A1E29] border-b border-black/30 text-zinc-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono tracking-tight truncate max-w-[200px]">
                    https://courtesydrivingschool.com
                  </div>
                  <div className="w-8" />
                </div>

                {/* Container for Website Mockup + Live Announcement Bar */}
                <div className="relative flex flex-col bg-[#1A1A1E] text-white">
                  {/* Announcement Bar at Top Position */}
                  {position === "top_fixed" && (
                    <div
                      className={`w-full py-2.5 px-4 flex items-center justify-between gap-3 text-xs font-medium z-10 transition-all ${
                        animateSlideDown ? "animate-in slide-in-from-top-3 duration-300" : ""
                      }`}
                      style={{ background: bgColor, color: textColor }}
                    >
                      <div className="flex items-center gap-2 min-w-0 mx-auto text-center flex-wrap justify-center">
                        {icon !== "none" && <span>{renderIconElem(icon, 15, textColor)}</span>}

                        {/* Multiline Headline */}
                        {selectedTemplate === "multiline" && headline && (
                          <strong className="block w-full sm:inline sm:w-auto font-bold mr-1">{headline}</strong>
                        )}

                        {/* Information / Success headline */}
                        {(selectedTemplate === "information" ||
                          selectedTemplate === "success" ||
                          selectedTemplate === "seasonal") &&
                          headline && <strong className="font-bold mr-1">{headline}:</strong>}

                        <span className="leading-snug">{text}</span>

                        {/* Dynamic Countdown Badges */}
                        {selectedTemplate === "countdown" && (
                          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold ml-1.5">
                            <span className="bg-black/60 px-1.5 py-0.5 rounded text-white shadow-inner">
                              {String(countdownUnits.days).padStart(2, "0")}d
                            </span>
                            <span className="bg-black/60 px-1.5 py-0.5 rounded text-white shadow-inner">
                              {String(countdownUnits.hours).padStart(2, "0")}h
                            </span>
                            <span className="bg-black/60 px-1.5 py-0.5 rounded text-white shadow-inner">
                              {String(countdownUnits.mins).padStart(2, "0")}m
                            </span>
                            <span className="bg-black/60 px-1.5 py-0.5 rounded text-white shadow-inner">
                              {String(countdownUnits.secs).padStart(2, "0")}s
                            </span>
                          </div>
                        )}

                        {/* Announcement + Link */}
                        {selectedTemplate === "announcement_link" && (
                          <span className="underline font-bold text-xs ml-1 hover:opacity-80 cursor-pointer">
                            {linkText}
                          </span>
                        )}

                        {/* Action Button */}
                        {currentTplDef.hasButton && buttonText && (
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold shadow transition-opacity cursor-pointer ml-1 whitespace-nowrap"
                            style={{ background: buttonBg, color: buttonTextColor }}
                          >
                            {buttonText}
                          </span>
                        )}
                      </div>

                      {showCloseButton && (
                        <button
                          type="button"
                          className="opacity-70 hover:opacity-100 text-xs px-1 leading-none transition-opacity flex-shrink-0"
                          title="Dismiss announcement"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}

                  {/* Simulated Website Header & Hero Canvas */}
                  <div className="p-4 bg-gradient-to-b from-[#2B303C] to-[#1F232B]">
                    {/* Simulated Navbar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FACC15] text-zinc-950 font-black flex items-center justify-center text-xs">
                          G
                        </div>
                        <span className="font-extrabold text-xs tracking-wider uppercase text-white">
                          {previewDevice === "mobile" ? "Courtesy" : "Courtesy Driving School"}
                        </span>
                      </div>

                      {previewDevice === "desktop" ? (
                        <div className="flex items-center gap-4 text-[11px] text-zinc-300 font-medium">
                          <span className="text-white font-semibold">Home</span>
                          <span className="hover:text-white">About</span>
                          <span className="hover:text-white">Services</span>
                          <span className="hover:text-white">Locations</span>
                          <span className="hover:text-white">FAQ</span>
                          <span className="hover:text-white">Contact</span>
                          <span className="bg-[#FACC15] text-zinc-950 font-bold px-2.5 py-1 rounded text-[10px]">
                            STUDENT PORTAL
                          </span>
                        </div>
                      ) : (
                        <div className="text-zinc-300 text-sm font-bold">☰</div>
                      )}
                    </div>

                    {/* Simulated Hero Banner Section */}
                    <div
                      className="py-8 sm:py-10 text-center relative rounded-lg mt-3 overflow-hidden bg-cover bg-center border border-white/5 shadow-inner"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80')",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
                      <div className="relative z-10 px-4">
                        <h1 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                          Michigan Driver's Training
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-200 mt-1.5 max-w-md mx-auto drop-shadow">
                          Michigan's most trusted driving school for over 50 years
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Announcement Bar at Bottom Position */}
                  {position === "bottom_fixed" && (
                    <div
                      className={`w-full py-2.5 px-4 flex items-center justify-between gap-3 text-xs font-medium z-10 transition-all ${
                        animateSlideDown ? "animate-in slide-in-from-bottom-3 duration-300" : ""
                      }`}
                      style={{ background: bgColor, color: textColor }}
                    >
                      <div className="flex items-center gap-2 min-w-0 mx-auto text-center flex-wrap justify-center">
                        {icon !== "none" && <span>{renderIconElem(icon, 15, textColor)}</span>}
                        {headline && <strong className="font-bold mr-1">{headline}</strong>}
                        <span className="leading-snug">{text}</span>
                        {selectedTemplate === "countdown" && (
                          <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold ml-1">
                            <span className="bg-black/60 px-1 py-0.5 rounded text-white">{countdownUnits.days}d</span>
                            <span className="bg-black/60 px-1 py-0.5 rounded text-white">{countdownUnits.hours}h</span>
                            <span className="bg-black/60 px-1 py-0.5 rounded text-white">{countdownUnits.mins}m</span>
                            <span className="bg-black/60 px-1 py-0.5 rounded text-white">{countdownUnits.secs}s</span>
                          </div>
                        )}
                        {currentTplDef.hasButton && buttonText && (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold shadow"
                            style={{ background: buttonBg, color: buttonTextColor }}
                          >
                            {buttonText}
                          </span>
                        )}
                      </div>
                      {showCloseButton && (
                        <button type="button" className="opacity-70 hover:opacity-100 text-xs px-1 leading-none">
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODAL FOOTER ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#232733] bg-[#161822] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-lg bg-[#FACC15] hover:bg-[#EAB308] text-zinc-950 text-xs font-bold shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Plugin"}
          </button>
        </div>
      </div>
    </div>
  );
}
