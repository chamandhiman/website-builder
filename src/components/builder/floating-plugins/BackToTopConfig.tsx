"use client";

import React from "react";
import { ArrowUp, LayoutGrid } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";

export interface BackToTopConfigData {
  shape: "round" | "rounded_square";
  backgroundColor: string;
  textColor: string;
  position: FloatingPosition;
  showOnDesktop: boolean;
  showOnMobile: boolean;
}

interface BackToTopConfigProps {
  data: BackToTopConfigData;
  onChange: (data: BackToTopConfigData) => void;
}

export function BackToTopConfig({ data, onChange }: BackToTopConfigProps) {
  const update = (patch: Partial<BackToTopConfigData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. BUTTON SHAPE ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Button Shape
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update({ shape: "round" })}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl transition ${
              data.shape === "round"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] text-white"
                : "border border-[#27272A] bg-[#151518] text-zinc-400"
            }`}
          >
            <span className="h-6 w-6 rounded-full border border-zinc-500 flex items-center justify-center">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold">Circular (Round)</span>
          </button>

          <button
            type="button"
            onClick={() => update({ shape: "rounded_square" })}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl transition ${
              data.shape === "rounded_square"
                ? "border-2 border-[#FACC15] bg-[#1A1A20] text-white"
                : "border border-[#27272A] bg-[#151518] text-zinc-400"
            }`}
          >
            <span className="h-6 w-6 rounded-md border border-zinc-500 flex items-center justify-center">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold">Rounded Square</span>
          </button>
        </div>
      </div>

      {/* ── 2. BUTTON POSITION ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Button Position
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: "bottom_right", label: "Right Bottom" },
              { key: "bottom_left", label: "Left Bottom" },
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

      {/* ── 3. COLORS ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Appearance & Colors
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Background Color
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

          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Arrow Icon Color
            </span>
            <div className="flex items-center gap-2 h-10 px-2 rounded-xl bg-[#17171A] border border-[#2B2B30]">
              <input
                type="color"
                value={data.textColor}
                onChange={(e) => update({ textColor: e.target.value })}
                className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-xs text-white font-mono">{data.textColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DISPLAY OPTIONS ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Display Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>
      </div>
    </div>
  );
}

export function renderBackToTopPreviewElement(data: BackToTopConfigData) {
  const roundedClass = data.shape === "round" ? "rounded-full" : "rounded-xl";
  return (
    <div
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
      }}
      className={`h-11 w-11 ${roundedClass} flex items-center justify-center shadow-xl border border-white/10 cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-in fade-in duration-200`}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.5]" />
    </div>
  );
}
