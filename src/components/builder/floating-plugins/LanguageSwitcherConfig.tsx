"use client";

import React from "react";
import { Globe, LayoutGrid, Check, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";

export interface LanguageItem {
  code: string;
  name: string;
  flag: string;
}

export const ALL_AVAILABLE_LANGUAGES: LanguageItem[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
];

export interface LanguageSwitcherConfigData {
  defaultLanguage: string;
  supportedLanguages: string[];
  layout: "floating_pill" | "dropdown" | "compact_flags";
  theme: "dark" | "light" | "glass";
  position: FloatingPosition;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  showFlags: boolean;
}

interface LanguageSwitcherConfigProps {
  data: LanguageSwitcherConfigData;
  onChange: (data: LanguageSwitcherConfigData) => void;
}

export function LanguageSwitcherConfig({ data, onChange }: LanguageSwitcherConfigProps) {
  const update = (patch: Partial<LanguageSwitcherConfigData>) => {
    onChange({ ...data, ...patch });
  };

  const toggleLanguage = (code: string) => {
    let next = [...data.supportedLanguages];
    if (next.includes(code)) {
      if (next.length === 1) return; // Keep at least one
      next = next.filter((c) => c !== code);
      if (data.defaultLanguage === code) {
        update({ supportedLanguages: next, defaultLanguage: next[0] });
        return;
      }
    } else {
      next.push(code);
    }
    update({ supportedLanguages: next });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. SUPPORTED LANGUAGES ────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Select Supported Languages
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ALL_AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = data.supportedLanguages.includes(lang.code);
            const isDefault = data.defaultLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                  isSelected
                    ? "border border-[#FACC15] bg-[#1A1A20] text-white"
                    : "border border-[#27272A] bg-[#151518] text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{lang.flag}</span>
                  <span className="text-xs font-semibold truncate">{lang.name}</span>
                </div>
                {isDefault ? (
                  <span className="text-[9px] bg-[#FACC15] text-zinc-950 font-bold px-1 rounded-sm">
                    DEF
                  </span>
                ) : isSelected ? (
                  <Check className="h-3.5 w-3.5 text-[#FACC15] shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. SWITCHER STYLE & THEME ─────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Switcher Style & Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Layout */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Layout Style
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#17171A] border border-[#2B2B30]">
              {(
                [
                  { key: "floating_pill", label: "Pill" },
                  { key: "dropdown", label: "Dropdown" },
                  { key: "compact_flags", label: "Flags" },
                ] as const
              ).map((l) => {
                const isSelected = data.layout === l.key;
                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => update({ layout: l.key })}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                      isSelected
                        ? "border border-[#FACC15] bg-[#222228] text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Color Theme
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#17171A] border border-[#2B2B30]">
              {(
                [
                  { key: "dark", label: "Dark" },
                  { key: "light", label: "Light" },
                  { key: "glass", label: "Glass" },
                ] as const
              ).map((t) => {
                const isSelected = data.theme === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => update({ theme: t.key })}
                    className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      isSelected
                        ? "border border-[#FACC15] bg-[#222228] text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
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
              { key: "top_right", label: "Top Right" },
              { key: "top_left", label: "Top Left" },
              { key: "bottom_right", label: "Bottom Right" },
              { key: "bottom_left", label: "Bottom Left" },
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
            <span className="text-xs font-semibold text-zinc-200">Show Flag Icons</span>
            <Switch
              checked={data.showFlags}
              onCheckedChange={(checked) => update({ showFlags: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function renderLanguageSwitcherPreviewElement(data: LanguageSwitcherConfigData) {
  const currentLang =
    ALL_AVAILABLE_LANGUAGES.find((l) => l.code === data.defaultLanguage) ||
    ALL_AVAILABLE_LANGUAGES[0];

  const bgStyle =
    data.theme === "light"
      ? "bg-white text-zinc-900 border-zinc-200 shadow-xl"
      : data.theme === "glass"
      ? "bg-zinc-900/80 backdrop-blur-md text-white border-white/20 shadow-xl"
      : "bg-[#18181B] text-white border-zinc-700 shadow-2xl";

  return (
    <div className="animate-in fade-in duration-200">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition-transform hover:scale-105 ${bgStyle}`}
      >
        {data.showFlags && <span>{currentLang.flag}</span>}
        <span>{currentLang.name}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </div>
    </div>
  );
}
