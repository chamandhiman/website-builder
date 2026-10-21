"use client";

import React, { useRef } from "react";
import { MessageCircle, LayoutGrid, ChevronDown, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";
import {
  COUNTRY_CALLING_CODES,
  formatTenDigitPhoneNumber,
  type WhatsAppButtonStyleKey,
} from "../WhatsAppChatModal";
import { getWhatsAppButtonIconSvg } from "@/lib/builder/floatingWidgetsRenderer";

export interface WhatsAppChatConfigData {
  countryCode: string;
  phoneNumber: string;
  agentName: string;
  prefilledMessage: string;
  buttonStyle: WhatsAppButtonStyleKey;
  buttonColor: string;
  buttonLabel: string;
  position: FloatingPosition;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  showTooltip: boolean;
  tooltipText: string;
  customIconUrl?: string;
}

interface WhatsAppChatConfigProps {
  data: WhatsAppChatConfigData;
  onChange: (data: WhatsAppChatConfigData) => void;
}

export const WA_COLOR_SWATCHES = [
  { value: "#25D366", label: "Green" },
  { value: "#128C7E", label: "Teal" },
  { value: "#111111", label: "Black" },
  { value: "#2563EB", label: "Blue" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EF4444", label: "Red" },
  { value: "#FFFFFF", label: "White" },
];

export function WhatsAppChatConfig({ data, onChange }: WhatsAppChatConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<WhatsAppChatConfigData>) => {
    onChange({ ...data, ...patch });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Icon image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update({ customIconUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. WHATSAPP DETAILS ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          WhatsApp Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Phone Number with Country Code */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-zinc-300">WhatsApp Phone</span>
              <span className="text-rose-400">*</span>
            </div>
            <div className="flex rounded-xl overflow-hidden border border-[#2B2B30] focus-within:border-[#FACC15] transition bg-[#17171A]">
              <div className="relative shrink-0 border-r border-[#2B2B30]">
                <select
                  value={data.countryCode}
                  onChange={(e) => update({ countryCode: e.target.value })}
                  className="h-11 pl-3 pr-7 bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer appearance-none"
                >
                  {COUNTRY_CALLING_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#17171A] text-white">
                      {c.code} ({c.country})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              </div>
              <input
                type="tel"
                value={data.phoneNumber}
                onChange={(e) => update({ phoneNumber: formatTenDigitPhoneNumber(e.target.value) })}
                placeholder="(123)-456-7890"
                maxLength={14}
                className="h-11 flex-1 bg-transparent px-3 text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Agent Name */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-zinc-300">Agent / Support Name</span>
            </div>
            <input
              type="text"
              value={data.agentName}
              onChange={(e) => update({ agentName: e.target.value })}
              placeholder="Customer Support"
              className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>
        </div>

        {/* Pre-filled Message */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
            Pre-filled Message
          </span>
          <textarea
            value={data.prefilledMessage}
            onChange={(e) => update({ prefilledMessage: e.target.value })}
            placeholder="Hello! I have a question about your services."
            rows={2}
            className="w-full p-3 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15] resize-none"
          />
        </div>
      </div>

      {/* ── 2. BUTTON STYLE ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Button Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(
            [
              { key: "whatsapp_standard", label: "Standard" },
              { key: "bubble_dots", label: "Bubble" },
              { key: "oval_dots", label: "Dots" },
              { key: "phone", label: "Call / WA" },
              { key: "whatsapp_solid", label: "Solid" },
            ] as const
          ).map((s) => {
            const isSelected = data.buttonStyle === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => update({ buttonStyle: s.key })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition ${
                  isSelected
                    ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm text-white"
                    : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 text-zinc-400"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: getWhatsAppButtonIconSvg(s.key, isSelected ? "#FACC15" : "#25D366"),
                  }}
                  className="mb-1.5"
                />
                <span className="text-xs font-semibold truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. BUTTON POSITION ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Button Position
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { key: "bottom_right", label: "Right Bottom" },
              { key: "bottom_left", label: "Left Bottom" },
              { key: "middle_right", label: "Middle Right" },
              { key: "middle_left", label: "Middle Left" },
            ] as const
          ).map((posItem) => {
            const isSelected = data.position === posItem.key;
            return (
              <button
                key={posItem.key}
                type="button"
                onClick={() => update({ position: posItem.key })}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                  isSelected
                    ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm text-white"
                    : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 text-zinc-400"
                }`}
              >
                <LayoutGrid
                  className={`h-4 w-4 shrink-0 ${
                    isSelected ? "text-[#FACC15]" : "text-zinc-500"
                  }`}
                />
                <span className="text-xs font-semibold truncate">{posItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. APPEARANCE ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Appearance
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button Color */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Button Color
            </span>
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {WA_COLOR_SWATCHES.map((swatch) => {
                const isSelected = data.buttonColor.toLowerCase() === swatch.value.toLowerCase();
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => update({ buttonColor: swatch.value })}
                    style={{ backgroundColor: swatch.value }}
                    className={`h-7 w-7 rounded-full border border-zinc-700 transition-transform ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-offset-[#121215] ring-[#FACC15] scale-110"
                        : "hover:scale-105 opacity-90 hover:opacity-100"
                    }`}
                    title={swatch.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Tooltip Text */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Tooltip / Hover Label
            </span>
            <input
              type="text"
              value={data.tooltipText}
              onChange={(e) => update({ tooltipText: e.target.value })}
              placeholder="Chat with us 👋"
              className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>
        </div>
      </div>

      {/* ── 5. DISPLAY OPTIONS ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Display Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171A] border border-[#27272A]">
            <span className="text-xs font-semibold text-zinc-200">Show on Desktop</span>
            <Switch
              checked={data.showOnDesktop}
              onCheckedChange={(checked) => update({ showOnDesktop: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171A] border border-[#27272A]">
            <span className="text-xs font-semibold text-zinc-200">Show on Mobile</span>
            <Switch
              checked={data.showOnMobile}
              onCheckedChange={(checked) => update({ showOnMobile: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171A] border border-[#27272A]">
            <span className="text-xs font-semibold text-zinc-200">Show Tooltip</span>
            <Switch
              checked={data.showTooltip}
              onCheckedChange={(checked) => update({ showTooltip: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function renderWhatsAppPreviewElement(data: WhatsAppChatConfigData) {
  const isWhite = data.buttonColor.toLowerCase() === "#ffffff";
  const iconColor = isWhite ? "#111111" : "#FFFFFF";

  return (
    <div className="flex flex-col items-end gap-1.5 animate-in fade-in duration-200">
      {/* Tooltip bubble */}
      {data.showTooltip && (
        <div className="rounded-xl bg-white p-2 text-zinc-900 text-xs font-medium max-w-[170px] shadow-xl border border-zinc-200">
          <div className="text-[9px] font-bold text-[#059669] uppercase tracking-wider">
            {data.agentName || "Customer Support"}
          </div>
          <div className="text-[11px] leading-snug font-semibold mt-0.5">
            {data.tooltipText || "Chat with us 👋"}
          </div>
        </div>
      )}

      {/* Button */}
      <div
        style={{ backgroundColor: data.buttonColor, color: iconColor }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full shadow-2xl cursor-pointer transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        <span
          dangerouslySetInnerHTML={{
            __html: getWhatsAppButtonIconSvg(data.buttonStyle, iconColor),
          }}
          className="w-6 h-6 flex items-center justify-center"
        />

        {/* Unread badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white border border-white shadow-xs">
          1
        </span>
      </div>
    </div>
  );
}
