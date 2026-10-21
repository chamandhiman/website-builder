"use client";

import React from "react";
import { Accessibility, LayoutGrid, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";
import type { AccessibilityToolbarStyle } from "../AccessibilityToolbarModal";
import { TOOLBAR_COLORS, getA11yHumanIconSvg } from "../AccessibilityToolbarModal";

export interface AccessibilityConfigData {
  toolbarStyle: AccessibilityToolbarStyle;
  toolbarColor: string;
  position: FloatingPosition;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  showByDefault: boolean;
  features: {
    textResize: boolean;
    highContrast: boolean;
    readableFont: boolean;
    keyboardNav: boolean;
    stopAnimations: boolean;
    reset: boolean;
  };
}

interface AccessibilityConfigProps {
  data: AccessibilityConfigData;
  onChange: (data: AccessibilityConfigData) => void;
}

export function AccessibilityConfig({ data, onChange }: AccessibilityConfigProps) {
  const update = (patch: Partial<AccessibilityConfigData>) => {
    onChange({ ...data, ...patch });
  };

  const toggleFeature = (key: keyof AccessibilityConfigData["features"]) => {
    update({
      features: {
        ...data.features,
        [key]: !data.features[key],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. ACCESSIBILITY CONTROLS ─────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Enabled Accessibility Tools
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(
            [
              { key: "textResize", label: "Text Resize (A+/A-)" },
              { key: "highContrast", label: "High Contrast" },
              { key: "readableFont", label: "Dyslexia Font" },
              { key: "keyboardNav", label: "Keyboard Nav" },
              { key: "stopAnimations", label: "Stop Animations" },
              { key: "reset", label: "Reset Settings" },
            ] as const
          ).map((feat) => {
            const isEnabled = data.features[feat.key];
            return (
              <button
                key={feat.key}
                type="button"
                onClick={() => toggleFeature(feat.key)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition text-left ${
                  isEnabled
                    ? "border border-[#FACC15] bg-[#1A1A20] text-white"
                    : "border border-[#27272A] bg-[#151518] text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <span className="text-xs font-semibold truncate">{feat.label}</span>
                {isEnabled && <Check className="h-3.5 w-3.5 text-[#FACC15] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. TOOLBAR STYLE ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Toolbar Button Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { key: "circle", label: "Round Circle" },
              { key: "square", label: "Rounded Box" },
              { key: "text_button", label: "Pill with Text" },
              { key: "minimal", label: "Glass Minimal" },
            ] as const
          ).map((s) => {
            const isSelected = data.toolbarStyle === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => update({ toolbarStyle: s.key })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition ${
                  isSelected
                    ? "border-2 border-[#FACC15] bg-[#1A1A20] shadow-sm text-white"
                    : "border border-[#27272A] bg-[#151518] hover:border-zinc-600 text-zinc-400"
                }`}
              >
                <span className="mb-1 text-xs">
                  {s.key === "circle" ? "◯" : s.key === "square" ? "▢" : s.key === "text_button" ? "▭" : "◇"}
                </span>
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
              { key: "bottom_left", label: "Left Bottom" },
              { key: "bottom_right", label: "Right Bottom" },
              { key: "middle_left", label: "Middle Left" },
              { key: "middle_right", label: "Middle Right" },
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
        <div>
          <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
            Toolbar Color
          </span>
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {TOOLBAR_COLORS.map((swatch) => {
              const isSelected = data.toolbarColor.toLowerCase() === swatch.value.toLowerCase();
              return (
                <button
                  key={swatch.value}
                  type="button"
                  onClick={() => update({ toolbarColor: swatch.value })}
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
            <span className="text-xs font-semibold text-zinc-200">Open by Default</span>
            <Switch
              checked={data.showByDefault}
              onCheckedChange={(checked) => update({ showByDefault: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function renderAccessibilityPreviewElement(data: AccessibilityConfigData) {
  const isWhite = data.toolbarColor.toLowerCase() === "#ffffff";
  const fg = isWhite ? "#111111" : "#FFFFFF";

  return (
    <div className="flex flex-col items-start gap-2 animate-in fade-in duration-200">
      {/* Trigger Button */}
      {data.toolbarStyle === "text_button" ? (
        <div
          style={{ backgroundColor: data.toolbarColor, color: fg }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border border-white/20"
        >
          <span
            dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg(fg, 16) }}
            className="flex items-center justify-center"
          />
          <span>Accessibility</span>
        </div>
      ) : (
        <div
          style={{ backgroundColor: data.toolbarColor, color: fg }}
          className={`flex h-11 w-11 items-center justify-center shadow-xl border border-white/20 cursor-pointer ${
            data.toolbarStyle === "square"
              ? "rounded-xl"
              : data.toolbarStyle === "minimal"
              ? "rounded-xl bg-zinc-900/90 text-white backdrop-blur-md"
              : "rounded-full"
          }`}
        >
          <span
            dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg(fg, 20) }}
            className="flex items-center justify-center"
          />
        </div>
      )}

      {/* Mini flyout preview if open */}
      {data.showByDefault && (
        <div className="w-[190px] rounded-xl bg-white p-2 text-zinc-900 shadow-2xl border border-zinc-200 text-[11px] font-semibold space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide px-1 pb-1 border-b border-zinc-100">
            Accessibility Menu
          </div>
          {data.features.textResize && (
            <div className="flex justify-between items-center px-1.5 py-1 rounded bg-zinc-50">
              <span>Text Size</span>
              <span className="font-bold text-blue-600">A+ / A-</span>
            </div>
          )}
          {data.features.highContrast && (
            <div className="flex justify-between items-center px-1.5 py-1 rounded bg-zinc-50">
              <span>Contrast</span>
              <span>◐</span>
            </div>
          )}
          {data.features.readableFont && (
            <div className="flex justify-between items-center px-1.5 py-1 rounded bg-zinc-50">
              <span>Dyslexia Font</span>
              <span className="font-serif">TT</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
