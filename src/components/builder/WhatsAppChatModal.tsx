"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Check,
  ChevronDown,
  Monitor,
  Smartphone,
  Paintbrush,
  SlidersHorizontal,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useBuilder } from "@/lib/builder/store";
import type { CustomEmbedItem } from "@/lib/builder/customEmbedsUtils";
import type { FloatingPosition, FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";
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
  { value: "#128C7E", label: "Teal", isLight: false },
  { value: "#111111", label: "Black", isLight: false },
  { value: "#2563EB", label: "Blue", isLight: false },
  { value: "#8B5CF6", label: "Purple", isLight: false },
  { value: "#EF4444", label: "Red", isLight: false },
  { value: "#F97316", label: "Orange", isLight: false },
  { value: "#FFFFFF", label: "White", isLight: true },
];

export function WhatsAppChatModal({
  isOpen,
  onClose,
  embedToEdit,
  onSaved,
}: WhatsAppChatModalProps) {
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // ── MODAL TAB STATE ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"design" | "preferences">("design");

  // ── TAB ONE: DESIGN (WhatsApp Contact Details & Button Style) ──────────────
  const [countryCode, setCountryCode] = useState("+91");
  const [rawPhone, setRawPhone] = useState("");
  const [agentName, setAgentName] = useState("Customer Support");
  const [prefilledMessage, setPrefilledMessage] = useState(
    "Hello! I have a question about your services."
  );
  const [buttonStyle, setButtonStyle] = useState<WhatsAppButtonStyleKey>("whatsapp_standard");

  // ── TAB TWO: PREFERENCES (Appearance, Position & Visibility) ───────────────
  const [buttonColor, setButtonColor] = useState("#25D366");
  const [buttonSize, setButtonSize] = useState<"small" | "medium" | "large">("medium");
  const [tooltipText, setTooltipText] = useState("Chat with us 👋");
  const [position, setPosition] = useState<FloatingPosition>("bottom_right");
  const [showOnDesktop, setShowOnDesktop] = useState(true);
  const [showOnMobile, setShowOnMobile] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);

  // ── PREVIEW & SUBMISSION STATE ─────────────────────────────────────────────
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const customColorInputRef = useRef<HTMLInputElement>(null);

  // Initialize or re-populate when modal opens or embedToEdit changes
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("design");

    if (embedToEdit && embedToEdit.floatingRecord) {
      const fw = embedToEdit.floatingRecord;
      const cfg = fw.config || {};

      // Phone extraction
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
      setButtonSize(cfg.buttonSize || "medium");
      setTooltipText(cfg.tooltipText || cfg.greetingText || "Chat with us 👋");

      const validPositions: FloatingPosition[] = [
        "bottom_right",
        "bottom_left",
        "middle_right",
        "middle_left",
      ];
      if (validPositions.includes(fw.position as any)) {
        setPosition(fw.position);
      } else {
        setPosition("bottom_right");
      }

      setShowOnDesktop(fw.showOnDesktop ?? true);
      setShowOnMobile(fw.showOnMobile ?? true);
      setShowTooltip(cfg.showTooltip ?? true);
    } else {
      // Default initial values for new plugin
      setCountryCode("+91");
      setRawPhone("");
      setAgentName("Customer Support");
      setPrefilledMessage("Hello! I have a question about your services.");
      setButtonStyle("whatsapp_standard");
      setButtonColor("#25D366");
      setButtonSize("medium");
      setTooltipText("Chat with us 👋");
      setPosition("bottom_right");
      setShowOnDesktop(true);
      setShowOnMobile(true);
      setShowTooltip(true);
    }
  }, [isOpen, embedToEdit]);

  if (!isOpen) return null;

  // ── SAVE HANDLER ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    const digits = rawPhone.replace(/\D/g, "");
    if (!digits || digits.length < 7) {
      toast.error("Please enter a valid WhatsApp phone number (minimum 7 digits)");
      setActiveTab("design");
      return;
    }

    setIsSaving(true);
    try {
      const now = Date.now();
      const cleanCountryCode = countryCode.trim();
      const fullPhone = `${cleanCountryCode}${digits}`;
      const recordId = embedToEdit?.floatingId || `flt_wa_${nanoid(8)}`;

      const fwRec: FloatingWidgetRecord = {
        id: recordId,
        type: "whatsapp_chat",
        name: "WhatsApp Chat",
        enabled: true,
        position: position,
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: showOnDesktop,
        showOnMobile: showOnMobile,
        pageTargeting: "all",
        config: {
          countryCode: cleanCountryCode,
          rawPhone: rawPhone,
          phoneNumber: fullPhone,
          agentName: agentName.trim() || "Customer Support",
          prefilledMessage: prefilledMessage.trim(),
          buttonStyle: buttonStyle,
          buttonColor: buttonColor,
          buttonSize: buttonSize,
          buttonLabel: "Chat with us",
          tooltipText: tooltipText.trim() || "Chat with us 👋",
          showTooltip: showTooltip,
        },
        createdAt: embedToEdit?.floatingRecord?.createdAt || now,
        updatedAt: now,
      };

      // Persist directly into the website builder store
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
      toast.success("Saved WhatsApp Chat");
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("[WhatsAppChatModal] Save error:", err);
      toast.error(err?.message || "Failed to save plugin");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview sizing calculations
  const isWhite = buttonColor.toLowerCase() === "#ffffff";
  const iconColor = isWhite ? "#111111" : "#FFFFFF";
  const btnPx = buttonSize === "small" ? "h-11 w-11" : buttonSize === "large" ? "h-16 w-16" : "h-13 w-13";
  const isHiddenInCurrentPreview =
    (previewMode === "desktop" && !showOnDesktop) || (previewMode === "mobile" && !showOnMobile);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] rounded-2xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl overflow-hidden">
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* WhatsApp Green Squircle */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
              <span
                dangerouslySetInnerHTML={{
                  __html: getWhatsAppButtonIconSvg("whatsapp_standard", "#FFFFFF"),
                }}
                className="w-6 h-6 flex items-center justify-center"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight truncate">
                WhatsApp Chat
              </h2>
              <p className="text-xs text-zinc-500 truncate">
                Connect with visitors in real-time using WhatsApp messaging.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── TWO-COLUMN BODY ───────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row min-h-0">
          {/* ── LEFT COLUMN: TAB CONTROLS & CONFIGURATION ──────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin bg-white">
            {/* ── TWO SEPARATE TABS HEADER: DESIGN & PREFERENCES ─────────────── */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === "design"
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80"
                }`}
              >
                <Paintbrush className="h-4 w-4" />
                <span>Design</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === "preferences"
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Preferences</span>
              </button>
            </div>

            {/* ── TAB ONE: DESIGN ────────────────────────────────────────────── */}
            {activeTab === "design" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 1. WHATSAPP DETAILS */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    WhatsApp Details
                  </label>

                  {/* Phone Number with Country Selector */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs font-semibold text-zinc-700">Phone Number</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-zinc-200 focus-within:border-[#FACC15] focus-within:ring-2 focus-within:ring-yellow-400/20 bg-white transition shadow-xs">
                      <div className="relative shrink-0 border-r border-zinc-200 bg-zinc-50">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-11 pl-3 pr-8 bg-transparent text-xs font-semibold text-zinc-800 focus:outline-none cursor-pointer appearance-none"
                        >
                          {COUNTRY_CALLING_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-white text-zinc-900">
                              {c.flag} {c.code} ({c.country})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={rawPhone}
                        onChange={(e) =>
                          setRawPhone(formatTenDigitPhoneNumber(e.target.value))
                        }
                        placeholder="(123)-456-7890"
                        maxLength={14}
                        className="h-11 flex-1 bg-transparent px-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Enter your phone number. Visitors clicking the chat button will directly message this WhatsApp number.
                    </p>
                  </div>

                  {/* Pre-filled Message */}
                  <div>
                    <span className="text-xs font-semibold text-zinc-700 block mb-1.5">
                      Pre-filled Message
                    </span>
                    <textarea
                      value={prefilledMessage}
                      onChange={(e) => setPrefilledMessage(e.target.value)}
                      placeholder="Hello! I have a question about your services."
                      rows={3}
                      className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-400/20 resize-none transition shadow-xs"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      This message will be pre-typed into the visitor's WhatsApp chat input when they click the button.
                    </p>
                  </div>
                </div>

                {/* 2. BUTTON DESIGN SELECTION CARDS */}
                <div className="space-y-3 pt-2 border-t border-zinc-100">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    1. Chat Button Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(
                      [
                        { key: "whatsapp_standard", label: "Standard" },
                        { key: "bubble_dots", label: "Bubble" },
                        { key: "oval_dots", label: "Dots" },
                        { key: "phone", label: "Call / WA" },
                        { key: "whatsapp_solid", label: "Solid" },
                      ] as const
                    ).map((s) => {
                      const isSelected = buttonStyle === s.key;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setButtonStyle(s.key)}
                          className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl transition ${
                            isSelected
                              ? "border-2 border-[#FACC15] bg-yellow-50/30 shadow-xs"
                              : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                          }`}
                        >
                          {/* Checkmark indicator for selected design */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 shadow-xs">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Miniature Button Representation */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: getWhatsAppButtonIconSvg(s.key, "#25D366"),
                            }}
                            className="mb-2 flex items-center justify-center h-8 w-8"
                          />
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-zinc-900" : "text-zinc-600"
                            }`}
                          >
                            {s.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB TWO: PREFERENCES ───────────────────────────────────────── */}
            {activeTab === "preferences" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 1. BUTTON POSITION */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    2. Button Position
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { key: "bottom_right", label: "Right Bottom" },
                        { key: "bottom_left", label: "Left Bottom" },
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
                          className={`relative flex flex-col items-center justify-between p-3 rounded-xl transition ${
                            isSelected
                              ? "border-2 border-[#FACC15] bg-yellow-50/30 shadow-xs"
                              : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 shadow-xs">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Miniature Screen Diagram with Position Dot */}
                          <div className="h-12 w-full max-w-[84px] rounded-md bg-zinc-100 border border-zinc-200 relative p-1 mb-2">
                            <div className="h-1 w-full bg-zinc-300/80 rounded-xs mb-1" />
                            <div
                              className={`absolute h-2.5 w-2.5 rounded-full bg-[#25D366] shadow-xs ${
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
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-zinc-900" : "text-zinc-600"
                            }`}
                          >
                            {posItem.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. APPEARANCE */}
                <div className="space-y-4 pt-2 border-t border-zinc-100">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    3. Appearance
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Button Color Swatches & Custom Picker */}
                    <div>
                      <span className="text-xs font-semibold text-zinc-700 block mb-2">
                        Button Color
                      </span>
                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        {COLOR_SWATCHES.map((swatch) => {
                          const isSelected = buttonColor.toLowerCase() === swatch.value.toLowerCase();
                          return (
                            <button
                              key={swatch.value}
                              type="button"
                              onClick={() => setButtonColor(swatch.value)}
                              style={{ backgroundColor: swatch.value }}
                              className={`h-7 w-7 rounded-full border border-zinc-300 transition-transform ${
                                isSelected
                                  ? "ring-2 ring-offset-2 ring-offset-white ring-[#2563EB] scale-110 shadow-xs"
                                  : "hover:scale-105 opacity-90 hover:opacity-100"
                              }`}
                              title={swatch.label}
                            />
                          );
                        })}

                        {/* Custom Color Rainbow Picker Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => customColorInputRef.current?.click()}
                            style={{
                              background:
                                "conic-gradient(from 180deg at 50% 50%, #EF4444, #F59E0B, #10B981, #06B6D4, #3B82F6, #8B5CF6, #EF4444)",
                            }}
                            className="h-7 w-7 rounded-full border border-zinc-300 hover:scale-105 transition-transform shadow-xs"
                            title="Custom Color"
                          />
                          <input
                            ref={customColorInputRef}
                            type="color"
                            value={buttonColor}
                            onChange={(e) => setButtonColor(e.target.value)}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Button Size */}
                    <div>
                      <span className="text-xs font-semibold text-zinc-700 block mb-2">
                        Button Size
                      </span>
                      <div className="flex items-center gap-2">
                        {(
                          [
                            { key: "small", label: "Small" },
                            { key: "medium", label: "Medium" },
                            { key: "large", label: "Large" },
                          ] as const
                        ).map((sizeItem) => {
                          const isSelected = buttonSize === sizeItem.key;
                          return (
                            <button
                              key={sizeItem.key}
                              type="button"
                              onClick={() => setButtonSize(sizeItem.key)}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                                isSelected
                                  ? "border border-[#2563EB] bg-blue-50 text-[#2563EB] shadow-xs"
                                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              {sizeItem.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Tooltip / Hover Label */}
                  <div>
                    <span className="text-xs font-semibold text-zinc-700 block mb-1.5">
                      4. Text & Message (Tooltip / Hover Label)
                    </span>
                    <input
                      type="text"
                      value={tooltipText}
                      onChange={(e) => setTooltipText(e.target.value)}
                      placeholder="Chat with us 👋"
                      className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-400/20 transition shadow-xs"
                    />
                  </div>
                </div>

                {/* 3. DISPLAY OPTIONS */}
                <div className="space-y-3 pt-2 border-t border-zinc-100">
                  <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                    5. Display Options
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-xs font-semibold text-zinc-800">Show on Desktop</span>
                      <Switch
                        checked={showOnDesktop}
                        onCheckedChange={setShowOnDesktop}
                        className="data-[state=checked]:bg-[#2563EB]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-xs font-semibold text-zinc-800">Show on Mobile</span>
                      <Switch
                        checked={showOnMobile}
                        onCheckedChange={setShowOnMobile}
                        className="data-[state=checked]:bg-[#2563EB]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                      <span className="text-xs font-semibold text-zinc-800">Show Tooltip</span>
                      <Switch
                        checked={showTooltip}
                        onCheckedChange={setShowTooltip}
                        className="data-[state=checked]:bg-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: FIXED LIVE WEBSITE PREVIEW ───────────────────── */}
          <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-200 bg-[#FAFAFA] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto scrollbar-thin">
            <div>
              {/* Preview Header & Controls */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                    Live Preview
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    See how the WhatsApp chat button will look on your website.
                  </p>
                </div>

                {/* Desktop / Mobile Switch */}
                <div className="flex items-center gap-1 rounded-xl bg-zinc-200/70 p-1 border border-zinc-300">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      previewMode === "desktop"
                        ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      previewMode === "mobile"
                        ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Realistic Website Mockup Frame */}
              <div className="w-full flex justify-center items-center py-2">
                <div
                  className={`rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-xl overflow-hidden relative select-none transition-all duration-200 ${
                    previewMode === "desktop"
                      ? "w-full max-w-[460px]"
                      : "w-[290px] border-zinc-300"
                  }`}
                >
                  {/* Website Mockup Navbar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 bg-white">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FACC15] text-zinc-950 shadow-xs">
                        <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                      </span>
                      <span className="font-extrabold text-xs tracking-tight text-[#0F172A]">
                        WebTool<span className="text-[#0284C7]">Ocean</span>
                      </span>
                    </div>

                    {previewMode === "desktop" && (
                      <div className="hidden sm:flex items-center gap-2.5 text-[10px] font-semibold text-zinc-500">
                        <span>Home</span>
                        <span className="flex items-center gap-0.5">
                          Tools <ChevronDown className="h-2.5 w-2.5 text-zinc-400" />
                        </span>
                        <span>Blog</span>
                        <span>About</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className="rounded-full bg-[#0284C7] px-3 py-1 text-[10px] font-bold text-white shadow-xs"
                    >
                      Contact Us
                    </button>
                  </div>

                  {/* Website Mockup Hero Content */}
                  <div className="relative min-h-[300px] bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E0E7FF]/30 p-5 flex items-center justify-between overflow-hidden">
                    {/* Left text */}
                    <div className="relative z-10 max-w-[190px] space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] leading-tight tracking-tight">
                        Build Your <br />
                        <span className="text-[#2563EB]">Dream Website</span>
                      </h3>
                      <p className="text-[10px] font-medium text-zinc-500">
                        Simple. Fast. Powerful.
                      </p>
                      <div className="pt-1.5">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full bg-[#0284C7] px-3.5 py-1 text-[10px] font-bold text-white shadow-xs"
                        >
                          <span>Get Started</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>

                    {/* Right Laptop Illustration (Desktop mode only) */}
                    {previewMode === "desktop" && (
                      <div className="relative z-0 hidden sm:block w-[170px]">
                        <div className="rounded-xl border border-zinc-200 bg-white p-1.5 shadow-md">
                          <div className="h-20 rounded-lg bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 p-1.5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <div className="h-1.5 w-10 rounded-full bg-blue-200" />
                              <div className="flex gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="h-6 rounded bg-white shadow-xs p-1" />
                              <div className="h-6 rounded bg-blue-500/10 p-1 flex items-center justify-center">
                                <span className="text-[7px] font-bold text-blue-600">Active</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 h-1 rounded-b-md bg-zinc-300 mx-auto w-[110%]" />
                        </div>
                      </div>
                    )}

                    {/* ── FLOATING WHATSAPP CHAT BUTTON IN PREVIEW ─────────────── */}
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
                      {isHiddenInCurrentPreview ? (
                        <div className="rounded-lg bg-zinc-900/90 text-white px-2.5 py-1 text-[10px] font-semibold shadow-md">
                          Hidden on {previewMode === "desktop" ? "Desktop" : "Mobile"}
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5 animate-in fade-in duration-150">
                          {/* Tooltip bubble preview */}
                          {showTooltip && (
                            <div className="rounded-xl bg-white px-3 py-2 text-zinc-900 text-xs font-medium max-w-[170px] shadow-lg border border-zinc-200/90 flex flex-col gap-0.5">
                              <div className="flex items-center justify-between text-[9px] font-bold text-[#059669] uppercase tracking-wider">
                                <span>{agentName || "Customer Support"}</span>
                                <span className="text-zinc-400 hover:text-zinc-600 cursor-pointer ml-2">×</span>
                              </div>
                              <div className="text-[11px] leading-snug font-semibold text-zinc-800">
                                {tooltipText || "Chat with us 👋"}
                              </div>
                            </div>
                          )}

                          {/* WhatsApp Floating Button */}
                          <div
                            style={{ backgroundColor: buttonColor, color: iconColor }}
                            className={`relative flex items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105 border-2 border-white/20 ${btnPx}`}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: getWhatsAppButtonIconSvg(buttonStyle, iconColor),
                              }}
                              className="w-5 h-5 flex items-center justify-center"
                            />
                            {/* Unread Message Badge */}
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white border border-white shadow-xs">
                              1
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Live Preview Notice matching mockup */}
            <div className="mt-4 rounded-xl bg-[#FEFCE8] border border-[#FEF08A] px-3.5 py-2.5 text-xs text-[#854D0E] flex items-center gap-2 shadow-xs">
              <span className="text-base shrink-0">💡</span>
              <span className="font-medium">
                This is a live preview. Changes you make on the left will update here immediately.
              </span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ─────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-200 px-6 py-4 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center min-w-[130px] px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-xs font-bold text-zinc-950 shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Plugin"}
          </button>
        </div>
      </div>
    </div>
  );
}
