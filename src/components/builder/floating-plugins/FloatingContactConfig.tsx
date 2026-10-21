"use client";

import React, { useRef } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  MoreHorizontal,
  LayoutGrid,
  Upload,
  ChevronDown,
  Globe,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";

export type ContactButtonStyleKey = "phone" | "whatsapp" | "email" | "chat" | "more";
export type ContactButtonSize = "small" | "medium" | "large";

export interface ContactButtonConfigData {
  style: ContactButtonStyleKey;
  contactType: "phone" | "whatsapp" | "email" | "url";
  contactValue: string;
  position: FloatingPosition;
  size: ContactButtonSize;
  color: string;
  tooltipText: string;
  customIconUrl?: string;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  showTooltip: boolean;
}

interface FloatingContactConfigProps {
  data: ContactButtonConfigData;
  onChange: (data: ContactButtonConfigData) => void;
}

export const CONTACT_COLOR_SWATCHES = [
  { value: "#2563EB", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EF4444", label: "Red" },
  { value: "#F97316", label: "Orange" },
  { value: "#FACC15", label: "Yellow" },
];

export function FloatingContactConfig({ data, onChange }: FloatingContactConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<ContactButtonConfigData>) => {
    onChange({ ...data, ...patch });
  };

  const handleStyleSelect = (style: ContactButtonStyleKey) => {
    let nextContactType = data.contactType;
    let nextTooltip = data.tooltipText;
    let nextColor = data.color;

    if (style === "phone") {
      nextContactType = "phone";
      nextTooltip = "Call Us";
      nextColor = "#2563EB";
    } else if (style === "whatsapp") {
      nextContactType = "whatsapp";
      nextTooltip = "Chat on WhatsApp";
      nextColor = "#10B981";
    } else if (style === "email") {
      nextContactType = "email";
      nextTooltip = "Email Us";
      nextColor = "#2563EB";
    } else if (style === "chat") {
      nextContactType = "url";
      nextTooltip = "Live Chat";
      nextColor = "#8B5CF6";
    } else if (style === "more") {
      nextTooltip = "More Options";
      nextColor = "#3F3F46";
    }

    update({
      style,
      contactType: nextContactType,
      tooltipText: nextTooltip,
      color: nextColor,
    });
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
      {/* ── 1. BUTTON STYLE ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Button Style
        </label>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {/* Phone */}
          <button
            type="button"
            onClick={() => handleStyleSelect("phone")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition ${
              data.style === "phone"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm"
                : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 hover:bg-[#1A1A1E]"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0284C7] text-white shadow-xs mb-1.5">
              <Phone className="h-4 w-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                data.style === "phone" ? "text-white" : "text-zinc-400"
              }`}
            >
              Phone
            </span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => handleStyleSelect("whatsapp")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition ${
              data.style === "whatsapp"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm"
                : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 hover:bg-[#1A1A1E]"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs mb-1.5">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                data.style === "whatsapp" ? "text-white" : "text-zinc-400"
              }`}
            >
              WhatsApp
            </span>
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={() => handleStyleSelect("email")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition ${
              data.style === "email"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm"
                : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 hover:bg-[#1A1A1E]"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0284C7] text-white shadow-xs mb-1.5">
              <Mail className="h-4 w-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                data.style === "email" ? "text-white" : "text-zinc-400"
              }`}
            >
              Email
            </span>
          </button>

          {/* Chat */}
          <button
            type="button"
            onClick={() => handleStyleSelect("chat")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition ${
              data.style === "chat"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm"
                : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 hover:bg-[#1A1A1E]"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-xs mb-1.5">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                data.style === "chat" ? "text-white" : "text-zinc-400"
              }`}
            >
              Chat
            </span>
          </button>

          {/* More */}
          <button
            type="button"
            onClick={() => handleStyleSelect("more")}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition ${
              data.style === "more"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm"
                : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 hover:bg-[#1A1A1E]"
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#27272A] text-white shadow-xs mb-1.5">
              <MoreHorizontal className="h-4 w-4" />
            </span>
            <span
              className={`text-xs font-semibold ${
                data.style === "more" ? "text-white" : "text-zinc-400"
              }`}
            >
              More
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. CONTACT DETAILS ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Contact Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Contact Type */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-zinc-300">Contact Type</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                {data.contactType === "phone" ? (
                  <Phone className="h-4 w-4" />
                ) : data.contactType === "whatsapp" ? (
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                ) : data.contactType === "email" ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
              </div>
              <select
                value={data.contactType}
                onChange={(e) => update({ contactType: e.target.value as any })}
                className="w-full h-11 pl-9 pr-8 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white focus:outline-none focus:border-[#FACC15] appearance-none cursor-pointer"
              >
                <option value="phone" className="bg-[#17171A] text-white">
                  Phone
                </option>
                <option value="whatsapp" className="bg-[#17171A] text-white">
                  WhatsApp
                </option>
                <option value="email" className="bg-[#17171A] text-white">
                  Email
                </option>
                <option value="url" className="bg-[#17171A] text-white">
                  Custom Link / Chat
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Contact Value / Phone Number */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-zinc-300">
                {data.contactType === "phone"
                  ? "Phone Number"
                  : data.contactType === "whatsapp"
                  ? "WhatsApp Number"
                  : data.contactType === "email"
                  ? "Email Address"
                  : "Link URL"}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                {data.contactType === "email" ? (
                  <Mail className="h-4 w-4" />
                ) : data.contactType === "url" ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
              </div>
              <input
                type={data.contactType === "email" ? "email" : "text"}
                value={data.contactValue}
                onChange={(e) => update({ contactValue: e.target.value })}
                placeholder={
                  data.contactType === "phone"
                    ? "+91 98765 43210"
                    : data.contactType === "whatsapp"
                    ? "+91 98765 43210"
                    : data.contactType === "email"
                    ? "support@example.com"
                    : "https://example.com"
                }
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>
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
          {/* Button Size */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Button Size
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#17171A] border border-[#2B2B30]">
              {(["small", "medium", "large"] as const).map((sz) => {
                const isSelected = data.size === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => update({ size: sz })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      isSelected
                        ? "border border-[#FACC15] bg-[#222228] text-white shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Button Color */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Button Color
            </span>
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {CONTACT_COLOR_SWATCHES.map((swatch) => {
                const isSelected = data.color.toLowerCase() === swatch.value.toLowerCase();
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => update({ color: swatch.value })}
                    style={{ backgroundColor: swatch.value }}
                    className={`h-7 w-7 rounded-full transition-transform ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-offset-[#121215] ring-[#FACC15] scale-110"
                        : "hover:scale-105 opacity-90 hover:opacity-100"
                    }`}
                    title={swatch.label}
                  />
                );
              })}

              {/* Rainbow / Custom color picker input */}
              <label
                className="relative h-7 w-7 rounded-full cursor-pointer overflow-hidden border border-zinc-600 hover:scale-105 transition"
                style={{
                  background:
                    "conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)",
                }}
                title="Custom Color"
              >
                <input
                  type="color"
                  value={data.color}
                  onChange={(e) => update({ color: e.target.value })}
                  className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Tooltip Text */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-zinc-300">Tooltip Text</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            </div>
            <input
              type="text"
              value={data.tooltipText}
              onChange={(e) => update({ tooltipText: e.target.value })}
              placeholder="Call Us"
              className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Custom Icon (Optional) */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Custom Icon (Optional)
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-11 border border-dashed border-[#2E2E34] hover:border-zinc-500 rounded-xl bg-[#17171A] px-3 flex items-center justify-center gap-2 cursor-pointer transition text-zinc-400 hover:text-white"
            >
              <Upload className="h-3.5 w-3.5" />
              <div className="text-left">
                <span className="text-xs font-semibold block text-zinc-200">Upload Icon</span>
                <span className="text-[9px] text-zinc-500 block leading-none">
                  SVG, PNG, JPG (max 2MB)
                </span>
              </div>
            </div>
            {data.customIconUrl && (
              <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="text-emerald-400 font-semibold">Custom icon loaded</span>
                <button
                  type="button"
                  onClick={() => update({ customIconUrl: undefined })}
                  className="text-rose-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 5. DISPLAY OPTIONS ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Display Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Show on Desktop */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171A] border border-[#27272A]">
            <span className="text-xs font-semibold text-zinc-200">Show on Desktop</span>
            <Switch
              checked={data.showOnDesktop}
              onCheckedChange={(checked) => update({ showOnDesktop: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>

          {/* Show on Mobile */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171A] border border-[#27272A]">
            <span className="text-xs font-semibold text-zinc-200">Show on Mobile</span>
            <Switch
              checked={data.showOnMobile}
              onCheckedChange={(checked) => update({ showOnMobile: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>

          {/* Show Tooltip */}
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

export function renderFloatingContactPreviewElement(data: ContactButtonConfigData) {
  const sizePx = data.size === "small" ? 42 : data.size === "large" ? 54 : 48;
  const iconPx = data.size === "small" ? 18 : data.size === "large" ? 24 : 20;

  const renderIcon = () => {
    if (data.customIconUrl) {
      return (
        <img
          src={data.customIconUrl}
          alt="icon"
          className="object-contain"
          style={{ width: iconPx, height: iconPx }}
        />
      );
    }
    if (data.style === "whatsapp" || data.contactType === "whatsapp") {
      return <MessageCircle style={{ width: iconPx, height: iconPx }} className="fill-current" />;
    }
    if (data.style === "email" || data.contactType === "email") {
      return <Mail style={{ width: iconPx, height: iconPx }} />;
    }
    if (data.style === "chat") {
      return <MessageCircle style={{ width: iconPx, height: iconPx }} />;
    }
    if (data.style === "more") {
      return <MoreHorizontal style={{ width: iconPx, height: iconPx }} />;
    }
    return <Phone style={{ width: iconPx, height: iconPx }} className="fill-current" />;
  };

  const isLightBg = data.color.toLowerCase() === "#ffffff" || data.color.toLowerCase() === "#facc15";
  const textColor = isLightBg ? "#09090B" : "#FFFFFF";

  return (
    <div className="flex flex-col items-end gap-1.5 animate-in fade-in duration-200">
      {/* Tooltip bubble */}
      {data.showTooltip && data.tooltipText && (
        <div className="rounded-lg bg-[#0F172A] text-white px-2.5 py-1 text-[11px] font-bold shadow-xl border border-zinc-700/50 whitespace-nowrap">
          {data.tooltipText}
        </div>
      )}

      {/* Button */}
      <div
        style={{
          width: sizePx,
          height: sizePx,
          backgroundColor: data.color,
          color: textColor,
        }}
        className="rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        {renderIcon()}
      </div>
    </div>
  );
}
