"use client";

import React from "react";
import { Code2, LayoutGrid } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";

export interface FloatingCustomEmbedConfigData {
  name: string;
  snippetHtml: string;
  position: FloatingPosition;
  showOnDesktop: boolean;
  showOnMobile: boolean;
}

interface FloatingCustomEmbedConfigProps {
  data: FloatingCustomEmbedConfigData;
  onChange: (data: FloatingCustomEmbedConfigData) => void;
}

export function FloatingCustomEmbedConfig({ data, onChange }: FloatingCustomEmbedConfigProps) {
  const update = (patch: Partial<FloatingCustomEmbedConfigData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. EMBED CODE ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Custom Code / Snippet
        </label>
        <div>
          <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
            Widget Name
          </span>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Custom Floating Embed"
            className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
          />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
            HTML / Floating Embed Snippet
          </span>
          <textarea
            value={data.snippetHtml}
            onChange={(e) => update({ snippetHtml: e.target.value })}
            placeholder="<div>Your floating code here...</div>"
            rows={5}
            className="w-full p-3 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-mono text-emerald-400 placeholder-zinc-500 focus:outline-none focus:border-[#FACC15] resize-none"
          />
        </div>
      </div>

      {/* ── 2. BUTTON POSITION ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Floating Position
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { key: "bottom_right", label: "Right Bottom" },
              { key: "bottom_left", label: "Left Bottom" },
              { key: "top_right", label: "Top Right" },
              { key: "top_left", label: "Top Left" },
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

      {/* ── 3. DISPLAY OPTIONS ────────────────────────────────────────────── */}
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

export function renderFloatingCustomEmbedPreviewElement(data: FloatingCustomEmbedConfigData) {
  if (!data.snippetHtml.trim()) {
    return (
      <div className="rounded-xl bg-zinc-900 border border-dashed border-zinc-700 p-3 text-center text-[11px] text-zinc-400">
        Enter HTML code to preview
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: data.snippetHtml }}
      className="animate-in fade-in duration-200 pointer-events-auto"
    />
  );
}
