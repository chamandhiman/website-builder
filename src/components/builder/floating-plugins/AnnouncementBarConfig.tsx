"use client";

import React from "react";
import { Megaphone, Bell, Star, Gift, Info, Check, Sparkles, LayoutGrid } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";
import { ANNOUNCEMENT_TEMPLATES, type AnnouncementTemplateItem } from "../CustomEmbedModal";

export interface AnnouncementBarConfigData {
  template: string;
  headline: string;
  text: string;
  icon: string;
  ctaLabel: string;
  ctaUrl: string;
  openNewTab: boolean;
  backgroundColor: string;
  textColor: string;
  btnBgColor: string;
  btnTextColor: string;
  position: FloatingPosition; // top_fixed or bottom_fixed
  showOnDesktop: boolean;
  showOnMobile: boolean;
  allowDismiss: boolean;
}

interface AnnouncementBarConfigProps {
  data: AnnouncementBarConfigData;
  onChange: (data: AnnouncementBarConfigData) => void;
}

export function AnnouncementBarConfig({ data, onChange }: AnnouncementBarConfigProps) {
  const update = (patch: Partial<AnnouncementBarConfigData>) => {
    onChange({ ...data, ...patch });
  };

  const applyTemplate = (tpl: AnnouncementTemplateItem) => {
    update({
      template: tpl.key,
      backgroundColor: tpl.bgColor,
      textColor: tpl.textColor,
      text: tpl.text,
      icon: tpl.icon,
      ctaLabel: tpl.showButton ? tpl.btnText : "",
      btnBgColor: tpl.btnBg,
      btnTextColor: tpl.btnTextColor,
    });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. PRE-DESIGNED TEMPLATES ─────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Preset Styles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ANNOUNCEMENT_TEMPLATES.map((tpl) => {
            const isSelected = data.template === tpl.key;
            return (
              <button
                key={tpl.key}
                type="button"
                onClick={() => applyTemplate(tpl)}
                style={{ backgroundColor: tpl.bgColor, color: tpl.textColor }}
                className={`flex items-center justify-between p-2.5 rounded-xl transition text-xs font-bold shadow-xs ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-offset-[#121215] ring-[#FACC15]"
                    : "opacity-85 hover:opacity-100"
                }`}
              >
                <span className="truncate">{tpl.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. MESSAGE CONTENT ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Banner Content
        </label>
        <div>
          <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
            Announcement Message
          </span>
          <textarea
            value={data.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="2027 Winter and Spring Schedules are now open for enrollment!"
            rows={2}
            className="w-full p-3 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Button Label (Optional)
            </span>
            <input
              type="text"
              value={data.ctaLabel}
              onChange={(e) => update({ ctaLabel: e.target.value })}
              placeholder="Learn More"
              className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Button Link URL
            </span>
            <input
              type="text"
              value={data.ctaUrl}
              onChange={(e) => update({ ctaUrl: e.target.value })}
              placeholder="https://example.com/special-offer"
              className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>
        </div>
      </div>

      {/* ── 3. PLACEMENT & COLORS ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Placement & Colors
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Placement */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Banner Position
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update({ position: "top_fixed" })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  data.position === "top_fixed"
                    ? "border-2 border-[#FACC15] bg-[#1A1A20] text-white"
                    : "border border-[#27272A] bg-[#151518] text-zinc-400"
                }`}
              >
                <span>Sticky Top</span>
              </button>
              <button
                type="button"
                onClick={() => update({ position: "bottom_fixed" })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  data.position === "bottom_fixed"
                    ? "border-2 border-[#FACC15] bg-[#1A1A20] text-white"
                    : "border border-[#27272A] bg-[#151518] text-zinc-400"
                }`}
              >
                <span>Sticky Bottom</span>
              </button>
            </div>
          </div>

          {/* Color pickers */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                Bar Color
              </span>
              <div className="flex items-center gap-2 h-10 px-2 rounded-xl bg-[#17171A] border border-[#2B2B30]">
                <input
                  type="color"
                  value={data.backgroundColor}
                  onChange={(e) => update({ backgroundColor: e.target.value })}
                  className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-xs text-white font-mono">{data.backgroundColor}</span>
              </div>
            </div>

            <div className="flex-1">
              <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
                Button Color
              </span>
              <div className="flex items-center gap-2 h-10 px-2 rounded-xl bg-[#17171A] border border-[#2B2B30]">
                <input
                  type="color"
                  value={data.btnBgColor}
                  onChange={(e) => update({ btnBgColor: e.target.value })}
                  className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
                <span className="text-xs text-white font-mono">{data.btnBgColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DISPLAY OPTIONS ────────────────────────────────────────────── */}
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
            <span className="text-xs font-semibold text-zinc-200">Close Button</span>
            <Switch
              checked={data.allowDismiss}
              onCheckedChange={(checked) => update({ allowDismiss: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function renderAnnouncementBarPreviewElement(data: AnnouncementBarConfigData) {
  return (
    <div
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
      }}
      className="w-full py-2.5 px-4 shadow-md flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-center gap-2 min-w-0 flex-1 text-center">
        <Megaphone className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{data.text || "Announcement banner text"}</span>
        {data.ctaLabel && (
          <span
            style={{
              backgroundColor: data.btnBgColor,
              color: data.btnTextColor,
            }}
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-1 shadow-xs"
          >
            {data.ctaLabel}
          </span>
        )}
      </div>

      {data.allowDismiss && (
        <span className="text-xs opacity-75 hover:opacity-100 cursor-pointer shrink-0">✕</span>
      )}
    </div>
  );
}
