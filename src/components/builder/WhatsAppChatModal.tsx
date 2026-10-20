"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  MessageCircle,
  Upload,
  Check,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useBuilder } from "@/lib/builder/store";
import type { CustomEmbedItem } from "@/lib/builder/customEmbedsUtils";
import type { FloatingPosition, FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";
import {
  normalizeWhatsAppPhone,
  isValidWhatsAppPhone,
  createWhatsAppUrl,
} from "@/services/whatsappChatTemplates";
import { getWhatsAppButtonIconSvg } from "@/lib/builder/floatingWidgetsRenderer";

/**
 * Formats a phone number as (123)-456-7890 strictly allowing up to 10 digits only.
 */
export function formatTenDigitPhoneNumber(input: string = ""): string {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedToEdit?: CustomEmbedItem | null;
  onSaved?: () => void;
}

export type WhatsAppButtonStyleKey =
  | "whatsapp_standard"
  | "bubble_dots"
  | "oval_dots"
  | "phone"
  | "whatsapp_solid";

export const COUNTRY_CALLING_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "US / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
];

export const COLOR_SWATCHES = [
  { value: "#25D366", label: "Green", isLight: false },
  { value: "#FFFFFF", label: "White", isLight: true },
  { value: "#111111", label: "Black", isLight: false },
  { value: "#EF4444", label: "Red", isLight: false },
  { value: "#3B82F6", label: "Blue", isLight: false },
  { value: "#8B5CF6", label: "Purple", isLight: false },
  { value: "#EC4899", label: "Pink", isLight: false },
];

export function WhatsAppChatModal({
  isOpen,
  onClose,
  embedToEdit,
  onSaved,
}: WhatsAppChatModalProps) {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // Form State
  const [countryCode, setCountryCode] = useState("+91");
  const [rawPhone, setRawPhone] = useState("");
  const [agentName, setAgentName] = useState("Customer Support");
  const [prefilledMessage, setPrefilledMessage] = useState("Hello! I have a question about your services.");

  // Style State
  const [buttonStyle, setButtonStyle] = useState<WhatsAppButtonStyleKey>("whatsapp_standard");
  const [buttonColor, setButtonColor] = useState("#25D366");
  const [buttonLabel, setButtonLabel] = useState("Chat with us");
  const [labelPosition, setLabelPosition] = useState<"hover" | "always" | "hidden">("hover");
  const [customIconUrl, setCustomIconUrl] = useState<string>("");

  // Position State
  const [position, setPosition] = useState<"bottom_right" | "bottom_left" | "middle_right" | "middle_left">("bottom_right");

  // Visibility State
  const [pageTargeting, setPageTargeting] = useState<"all" | "custom">("all");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showOnDesktop, setShowOnDesktop] = useState(true);
  const [showOnMobile, setShowOnMobile] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipText, setTooltipText] = useState("Chat with us 👋");

  // Submission State
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available project pages
  const projectPages = useMemo(() => project?.pages || [], [project]);

  // Initialize or re-populate when modal opens or embedToEdit changes
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit && embedToEdit.floatingRecord) {
      const fw = embedToEdit.floatingRecord;
      const cfg = fw.config || {};

      // Phone extraction (strictly 10 digits formatted)
      const storedPhone = String(cfg.phoneNumber || "").trim();
      const matchedCode = COUNTRY_CALLING_CODES.find((c) => storedPhone.startsWith(c.code));
      let digits = "";
      if (matchedCode) {
        setCountryCode(matchedCode.code);
        digits = storedPhone.slice(matchedCode.code.length).replace(/\D/g, "").slice(0, 10);
      } else if (cfg.countryCode && cfg.rawPhone) {
        setCountryCode(cfg.countryCode);
        digits = String(cfg.rawPhone).replace(/\D/g, "").slice(0, 10);
      } else {
        setCountryCode("+91");
        digits = storedPhone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
      }
      setRawPhone(formatTenDigitPhoneNumber(digits));

      setAgentName(cfg.agentName || "Customer Support");
      setPrefilledMessage(cfg.prefilledMessage || "Hello! I have a question about your services.");
      setButtonStyle(cfg.buttonStyle || "whatsapp_standard");
      setButtonColor(cfg.buttonColor || "#25D366");
      setButtonLabel(cfg.buttonLabel || "Chat with us");
      setLabelPosition(cfg.labelPosition || "hover");
      setCustomIconUrl(cfg.customIconUrl || "");

      // Position
      const validPositions: Array<"bottom_right" | "bottom_left" | "middle_right" | "middle_left"> = [
        "bottom_right",
        "bottom_left",
        "middle_right",
        "middle_left",
      ];
      if (validPositions.includes(fw.position as any)) {
        setPosition(fw.position as any);
      } else {
        setPosition("bottom_right");
      }

      // Visibility
      setPageTargeting(fw.pageTargeting === "custom" ? "custom" : "all");
      setSelectedPages(fw.targetedPages || []);
      setShowOnDesktop(fw.showOnDesktop !== false);
      setShowOnMobile(fw.showOnMobile !== false);
      setShowTooltip(cfg.showTooltip !== false);
      setTooltipText(cfg.tooltipText || cfg.greetingText || "Chat with us 👋");
    } else {
      // Default initial state
      setCountryCode("+91");
      setRawPhone("");
      setAgentName("Customer Support");
      setPrefilledMessage("Hello! I have a question about your services.");
      setButtonStyle("whatsapp_standard");
      setButtonColor("#25D366");
      setButtonLabel("Chat with us");
      setLabelPosition("hover");
      setCustomIconUrl("");
      setPosition("bottom_right");
      setPageTargeting("all");
      setSelectedPages(projectPages.map((p) => p.id));
      setShowOnDesktop(true);
      setShowOnMobile(true);
      setShowTooltip(true);
      setTooltipText("Chat with us 👋");
    }
  }, [isOpen, embedToEdit, projectPages]);

  if (!isOpen) return null;

  // Normalized clean phone (strictly 10 numbers)
  const cleanDigits = rawPhone.replace(/\D/g, "").slice(0, 10);
  const isPhoneValid = cleanDigits.length === 10;
  const combinedPhone = `${countryCode}${cleanDigits}`;
  const waClickUrl = isPhoneValid
    ? createWhatsAppUrl(combinedPhone, prefilledMessage)
    : "javascript:void(0)";

  // Handle custom icon upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/svg+xml", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Please upload a PNG, SVG, or JPEG file");
      return;
    }

    if (file.size > 200 * 1024) {
      toast.error("File size must be 200KB or less");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomIconUrl(dataUrl);
        toast.success("Custom icon uploaded");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // Toggle page in selected pages checklist
  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  // Save Plugin
  const handleSave = async () => {
    if (!cleanDigits) {
      toast.error("Please enter a WhatsApp phone number");
      return;
    }

    if (cleanDigits.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number in format (123)-456-7890");
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
      const fwId = embedToEdit?.floatingId || embedToEdit?.id || `fw-wa-${nanoid(8)}`;

      const fwRecord: FloatingWidgetRecord = {
        id: fwId,
        type: "whatsapp_chat",
        name: "WhatsApp Chat",
        enabled: true,
        position: position as FloatingPosition,
        offsetX: 20,
        offsetY: 20,
        showOnDesktop,
        showOnMobile,
        pageTargeting,
        targetedPages: pageTargeting === "custom" ? selectedPages : undefined,
        config: {
          phoneNumber: combinedPhone,
          countryCode,
          rawPhone: cleanDigits,
          formattedPhone: rawPhone,
          agentName: agentName.trim() || "Customer Support",
          prefilledMessage: prefilledMessage.trim(),
          buttonStyle,
          buttonColor,
          buttonLabel: buttonLabel.trim() || "Chat with us",
          labelPosition,
          customIconUrl,
          showTooltip,
          tooltipText: tooltipText.trim() || "Chat with us 👋",
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
      toast.success("WhatsApp Chat plugin saved successfully!");
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("[WhatsAppChatModal] Save error:", err);
      toast.error(err?.message || "Failed to save WhatsApp Chat plugin");
    } finally {
      setIsSaving(false);
    }
  };

  // Render button icon in modal and preview
  const isWhiteButton = buttonColor.toLowerCase() === "#ffffff";
  const iconColor = isWhiteButton ? "#111111" : "#FFFFFF";

  const renderCurrentIcon = (size = 20) => {
    if (customIconUrl) {
      return (
        <img
          src={customIconUrl}
          alt="WhatsApp"
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      );
    }
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: getWhatsAppButtonIconSvg(buttonStyle, iconColor),
        }}
        style={{
          display: "inline-flex",
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] rounded-2xl bg-[#121214] text-[#F5F5F5] border border-[#27272A] shadow-2xl overflow-hidden">
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[#222225] px-6 py-4 bg-[#151518]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md">
              <span
                dangerouslySetInnerHTML={{
                  __html: getWhatsAppButtonIconSvg("whatsapp_standard", "#FFFFFF"),
                }}
                className="w-6 h-6 flex items-center justify-center"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {embedToEdit ? "Edit WhatsApp Chat" : "Add WhatsApp Chat"}
              </h2>
              <p className="text-xs text-zinc-400">
                Add a WhatsApp chat button to your website. Configure the settings below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-[#222226] hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── MAIN CONTENT (2 COLUMNS) ────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* ── LEFT COLUMN: CONFIGURATION ─────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 bg-[#121214]">
            {/* 1. CONTENT SECTION */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  1
                </span>
                <h3 className="text-sm font-bold text-white">Content</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number with Country Code */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                    WhatsApp Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-[#2E2E33] focus-within:border-[#FACC15] transition">
                    <div className="relative shrink-0 bg-[#1A1A1E] border-r border-[#2E2E33]">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-10 pl-3 pr-7 bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer appearance-none"
                      >
                        {COUNTRY_CALLING_CODES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-[#1A1A1E] text-white">
                            {c.code} ({c.country})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={rawPhone}
                      onChange={(e) => setRawPhone(formatTenDigitPhoneNumber(e.target.value))}
                      placeholder="(123)-456-7890"
                      maxLength={14}
                      className="h-10 flex-1 bg-[#1A1A1E] px-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Enter your 10-digit WhatsApp number (e.g. (123)-456-7890).
                  </p>
                </div>

                {/* Support Agent Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                    Support Agent Name <span className="text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Customer Support"
                    className="h-10 w-full rounded-lg bg-[#1A1A1E] px-3.5 text-xs text-white placeholder-zinc-500 border border-[#2E2E33] focus:border-[#FACC15] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Pre-filled Message */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                  Pre-filled Message <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={prefilledMessage}
                  onChange={(e) => setPrefilledMessage(e.target.value)}
                  placeholder="Hello! I have a question about your services."
                  className="h-10 w-full rounded-lg bg-[#1A1A1E] px-3.5 text-xs text-white placeholder-zinc-500 border border-[#2E2E33] focus:border-[#FACC15] focus:outline-none transition"
                />
              </div>
            </div>

            {/* 2. STYLE SECTION */}
            <div className="space-y-4 pt-1 border-t border-[#1F1F24]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  2
                </span>
                <h3 className="text-sm font-bold text-white">Style</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Sub-column: Button Style & Color */}
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs font-medium text-zinc-300 mb-2">Button Style</span>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {(
                        [
                          { key: "whatsapp_standard", title: "WhatsApp" },
                          { key: "bubble_dots", title: "Chat Bubble" },
                          { key: "oval_dots", title: "Message Bubble" },
                          { key: "phone", title: "Phone" },
                          { key: "whatsapp_solid", title: "WhatsApp Badge" },
                        ] as const
                      ).map((styleItem) => {
                        const isSelected = buttonStyle === styleItem.key;
                        return (
                          <button
                            key={styleItem.key}
                            type="button"
                            onClick={() => setButtonStyle(styleItem.key)}
                            title={styleItem.title}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                              isSelected
                                ? "border-2 border-[#FACC15] bg-[#222228] text-white shadow-sm"
                                : "border border-[#2B2B32] bg-[#18181C] text-zinc-300 hover:border-zinc-500 hover:text-white"
                            }`}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: getWhatsAppButtonIconSvg(
                                  styleItem.key,
                                  isSelected ? "#25D366" : "#A1A1AA"
                                ),
                              }}
                              className="w-5 h-5 flex items-center justify-center"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-zinc-300 mb-2">Button Color</span>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {COLOR_SWATCHES.map((swatch) => {
                        const isSelected = buttonColor.toLowerCase() === swatch.value.toLowerCase();
                        return (
                          <button
                            key={swatch.value}
                            type="button"
                            onClick={() => setButtonColor(swatch.value)}
                            title={swatch.label}
                            style={{ backgroundColor: swatch.value }}
                            className={`h-7 w-7 rounded-full transition-transform active:scale-95 ${
                              isSelected
                                ? "ring-2 ring-[#FACC15] ring-offset-2 ring-offset-[#121214] scale-110"
                                : "border border-zinc-700/60 hover:scale-105"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Sub-column: Label, Label Position, Custom Icon */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                      Button Label <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                      placeholder="Chat with us"
                      className="h-10 w-full rounded-lg bg-[#1A1A1E] px-3.5 text-xs text-white placeholder-zinc-500 border border-[#2E2E33] focus:border-[#FACC15] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                      Label Position
                    </label>
                    <div className="relative">
                      <select
                        value={labelPosition}
                        onChange={(e) => setLabelPosition(e.target.value as any)}
                        className="h-10 w-full rounded-lg bg-[#1A1A1E] pl-3.5 pr-8 text-xs text-white border border-[#2E2E33] focus:border-[#FACC15] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="hover" className="bg-[#1A1A1E] text-white">
                          Show on Hover
                        </option>
                        <option value="always" className="bg-[#1A1A1E] text-white">
                          Always Show
                        </option>
                        <option value="hidden" className="bg-[#1A1A1E] text-white">
                          Hidden
                        </option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
                      Custom Icon <span className="text-zinc-500 font-normal">(Optional)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/svg+xml,image/jpeg,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1A1A1E] border border-[#2E2E33] hover:border-zinc-500 text-xs font-medium text-white transition active:scale-95"
                      >
                        <Upload className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Upload Icon</span>
                      </button>
                      {customIconUrl ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={customIconUrl}
                            alt="Uploaded icon"
                            className="h-7 w-7 object-contain rounded bg-zinc-800 p-0.5 border border-zinc-700"
                          />
                          <button
                            type="button"
                            onClick={() => setCustomIconUrl("")}
                            className="text-[11px] text-red-400 hover:text-red-300 underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">PNG, SVG (max 200KB)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. POSITION SECTION */}
            <div className="space-y-3 pt-1 border-t border-[#1F1F24]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  3
                </span>
                <h3 className="text-sm font-bold text-white">Position</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Choose where to show the WhatsApp button on your website.
              </p>

              {/* 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { key: "bottom_right", label: "Bottom Right" },
                    { key: "bottom_left", label: "Bottom Left" },
                    { key: "middle_right", label: "Middle Right" },
                    { key: "middle_left", label: "Middle Left" },
                  ] as const
                ).map((posItem) => {
                  const isSelected = position === posItem.key;
                  return (
                    <button
                      key={posItem.key}
                      type="button"
                      onClick={() => setPosition(posItem.key)}
                      className={`flex flex-col items-center justify-between p-3 rounded-xl transition ${
                        isSelected
                          ? "border-2 border-[#FACC15] bg-[#1E1E24] shadow-sm"
                          : "border border-[#2B2B30] bg-[#16161A] hover:border-zinc-500"
                      }`}
                    >
                      {/* Miniature screen diagram */}
                      <div className="h-14 w-full max-w-[100px] rounded-md bg-[#0D0D10] border border-[#2B2B32] relative p-1 mb-2">
                        <div className="h-1.5 w-full bg-[#1F1F26] rounded-xs mb-1" />
                        {/* Position Indicator Dot */}
                        <div
                          className={`absolute h-2.5 w-2.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366] ${
                            posItem.key === "bottom_right"
                              ? "bottom-1.5 right-1.5"
                              : posItem.key === "bottom_left"
                              ? "bottom-1.5 left-1.5"
                              : posItem.key === "middle_right"
                              ? "top-1/2 -translate-y-1/2 right-1.5"
                              : "top-1/2 -translate-y-1/2 left-1.5"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-[#FACC15]" : "text-zinc-300"
                        }`}
                      >
                        {posItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. VISIBILITY SECTION */}
            <div className="space-y-4 pt-1 border-t border-[#1F1F24]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  4
                </span>
                <h3 className="text-sm font-bold text-white">Visibility</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Show On: All Pages vs Selected Pages */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-zinc-300 mb-1">Show On</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="radio"
                      name="pageTargeting"
                      checked={pageTargeting === "all"}
                      onChange={() => setPageTargeting("all")}
                      className="accent-[#FACC15] h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>All Pages</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="radio"
                      name="pageTargeting"
                      checked={pageTargeting === "custom"}
                      onChange={() => {
                        setPageTargeting("custom");
                        if (selectedPages.length === 0 && projectPages.length > 0) {
                          setSelectedPages([projectPages[0].id]);
                        }
                      }}
                      className="accent-[#FACC15] h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Selected Pages</span>
                  </label>

                  {pageTargeting === "custom" && (
                    <div className="mt-2 p-2 rounded-lg bg-[#18181C] border border-[#2B2B32] max-h-32 overflow-y-auto space-y-1.5 scrollbar-thin">
                      {projectPages.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 text-[11px] text-zinc-300 cursor-pointer hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPages.includes(p.id)}
                            onChange={() => togglePageSelection(p.id)}
                            className="accent-[#FACC15] h-3 w-3 rounded cursor-pointer"
                          />
                          <span className="truncate">{p.name || p.slug || "Untitled Page"}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Show on Devices */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-zinc-300 mb-1">
                    Show on Devices
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={showOnDesktop}
                      onChange={(e) => setShowOnDesktop(e.target.checked)}
                      className="accent-[#FACC15] h-3.5 w-3.5 rounded cursor-pointer"
                    />
                    <span>Desktop</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={showOnMobile}
                      onChange={(e) => setShowOnMobile(e.target.checked)}
                      className="accent-[#FACC15] h-3.5 w-3.5 rounded cursor-pointer"
                    />
                    <span>Mobile</span>
                  </label>
                </div>

                {/* Show Tooltip / Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-300">
                      Show Tooltip / Message
                    </span>
                    <Switch
                      checked={showTooltip}
                      onCheckedChange={setShowTooltip}
                      className="data-[state=checked]:bg-[#25D366]"
                    />
                  </div>

                  {showTooltip && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 rounded-lg bg-[#1A1A1E] border border-[#2E2E33] px-2.5 py-1.5 focus-within:border-[#FACC15] transition">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white text-[10px]">
                          💬
                        </span>
                        <input
                          type="text"
                          value={tooltipText}
                          onChange={(e) => setTooltipText(e.target.value)}
                          placeholder="Chat with us"
                          className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">This text will show on hover</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: LIVE WEBSITE PREVIEW ─────────────────────────── */}
          <div className="w-full lg:w-[460px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#222225] bg-[#0E0E10] p-6 flex flex-col justify-between">
            <div>
              {/* Realistic Browser Window Frame */}
              <div className="mx-auto rounded-xl border border-[#2B2B32] bg-[#141418] shadow-2xl overflow-hidden w-full max-w-[420px]">
                {/* Browser Address Bar */}
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A20] border-b border-[#25252C]">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                    <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="flex-1 rounded-md bg-[#0D0D10] px-2 py-0.5 text-[10px] text-zinc-400 truncate text-center font-mono">
                    https://yourwebsite.com
                  </div>
                </div>

                {/* Simulated Website Canvas */}
                <div className="relative h-[360px] bg-gradient-to-b from-[#1C1C24] via-[#121216] to-[#0A0A0C] p-4 flex flex-col justify-between overflow-hidden">
                  {/* Website Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black tracking-wider text-white">LOGO</span>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-300 font-medium">
                      <span>Home</span>
                      <span>About</span>
                      <span>Services</span>
                      <span>Contact</span>
                      <span className="rounded-md bg-[#FACC15] px-2 py-0.5 font-bold text-zinc-950 text-[9px]">
                        Get Started
                      </span>
                    </div>
                  </div>

                  {/* Website Hero Section */}
                  <div className="my-auto space-y-2 text-center px-2">
                    <h4 className="text-lg font-black text-white leading-tight">
                      Build Your Dream Website
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 max-w-[260px] mx-auto">
                      Create stunning websites with our easy to use builder. No coding required.
                    </p>
                    <div className="pt-2">
                      <span className="inline-block rounded-lg bg-[#FACC15] px-4 py-1.5 text-xs font-bold text-zinc-950 shadow-sm">
                        Get Started
                      </span>
                    </div>
                  </div>

                  {/* ── THE LIVE FLOATING WHATSAPP BUTTON IN PREVIEW ── */}
                  <div
                    className={`absolute z-20 flex flex-col pointer-events-auto transition-all duration-300 ${
                      position === "bottom_right"
                        ? "bottom-4 right-4 items-end"
                        : position === "bottom_left"
                        ? "bottom-4 left-4 items-start"
                        : position === "middle_right"
                        ? "top-1/2 -translate-y-1/2 right-4 items-end"
                        : "top-1/2 -translate-y-1/2 left-4 items-start"
                    }`}
                  >
                    {/* Tooltip bubble preview */}
                    {showTooltip && (
                      <div
                        className={`mb-2 rounded-xl bg-white p-2.5 shadow-xl text-zinc-900 text-xs font-medium max-w-[170px] animate-in fade-in slide-in-from-bottom-2 ${
                          position.includes("left") ? "rounded-bl-xs" : "rounded-br-xs"
                        }`}
                      >
                        <div className="text-[9px] font-bold text-[#059669] uppercase tracking-wide">
                          {agentName || "Customer Support"}
                        </div>
                        <div className="text-[11px] leading-snug font-semibold mt-0.5">
                          {tooltipText || "Chat with us 👋"}
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Action Button */}
                    <div
                      style={{
                        backgroundColor: buttonColor,
                        color: iconColor,
                      }}
                      className={`relative inline-flex items-center gap-2 rounded-full shadow-lg transition-transform hover:scale-105 ${
                        labelPosition === "always" ? "px-3.5 py-2.5" : "p-3"
                      } ${isWhiteButton ? "border border-zinc-300" : ""}`}
                    >
                      {/* Icon */}
                      {renderCurrentIcon(20)}

                      {/* Optional Always Label */}
                      {labelPosition === "always" && (
                        <span className="text-xs font-bold whitespace-nowrap">
                          {buttonLabel || "Chat with us"}
                        </span>
                      )}

                      {/* Unread Message Badge '1' */}
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white border border-white shadow-xs">
                        1
                      </span>
                    </div>
                  </div>

                  {/* Warning overlay if phone number is empty */}
                  {!isPhoneValid && (
                    <div className="absolute inset-x-2 bottom-2 z-30 rounded-lg bg-amber-500/90 backdrop-blur-xs px-2.5 py-1.5 text-center text-[10px] font-bold text-zinc-950 flex items-center justify-center gap-1.5 shadow-md">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>Enter a valid WhatsApp phone number to activate widget</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Note on Click to Chat */}
            <div className="mt-4 p-3 rounded-xl bg-[#141418] border border-[#222228] text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-200">Click-to-Chat URL:</span>
              <div className="font-mono text-[10px] text-emerald-400 truncate mt-0.5">
                {isPhoneValid ? waClickUrl : "https://wa.me/[phone]?text=[message]"}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-[#222225] px-6 py-4 bg-[#151518]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl border border-zinc-700 bg-transparent text-xs font-bold text-white hover:bg-zinc-800 transition active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-zinc-950 text-xs font-extrabold shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving Plugin..." : "Save Plugin"}
          </button>
        </div>
      </div>
    </div>
  );
}
