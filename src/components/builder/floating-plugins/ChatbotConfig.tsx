"use client";

import React from "react";
import { Bot, LayoutGrid } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";

export interface ChatbotConfigData {
  botName: string;
  welcomeMessage: string;
  primaryColor: string;
  position: FloatingPosition;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  showWelcomeBubble: boolean;
}

interface ChatbotConfigProps {
  data: ChatbotConfigData;
  onChange: (data: ChatbotConfigData) => void;
}

export const CHATBOT_COLOR_SWATCHES = [
  { value: "#2563EB", label: "Blue" },
  { value: "#7C3AED", label: "Purple" },
  { value: "#10B981", label: "Green" },
  { value: "#0284C7", label: "Sky" },
  { value: "#F97316", label: "Orange" },
  { value: "#111111", label: "Black" },
];

export function ChatbotConfig({ data, onChange }: ChatbotConfigProps) {
  const update = (patch: Partial<ChatbotConfigData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. BOT IDENTITY ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-white tracking-wide block">
          Chatbot Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Assistant Name
            </span>
            <input
              type="text"
              value={data.botName}
              onChange={(e) => update({ botName: e.target.value })}
              placeholder="AI Assistant"
              className="w-full h-11 px-3.5 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
              Accent Color
            </span>
            <div className="flex items-center gap-2 flex-wrap pt-1.5">
              {CHATBOT_COLOR_SWATCHES.map((swatch) => {
                const isSelected = data.primaryColor.toLowerCase() === swatch.value.toLowerCase();
                return (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => update({ primaryColor: swatch.value })}
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

        {/* Welcome Message */}
        <div>
          <span className="text-[11px] font-semibold text-zinc-300 block mb-1.5">
            Initial Welcome Greeting
          </span>
          <textarea
            value={data.welcomeMessage}
            onChange={(e) => update({ welcomeMessage: e.target.value })}
            placeholder="Hi there! How can I help you today?"
            rows={2}
            className="w-full p-3 rounded-xl border border-[#2B2B30] bg-[#17171A] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#FACC15] resize-none"
          />
        </div>
      </div>

      {/* ── 2. BUTTON POSITION ────────────────────────────────────────────── */}
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

      {/* ── 3. DISPLAY OPTIONS ────────────────────────────────────────────── */}
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
            <span className="text-xs font-semibold text-zinc-200">Greeting Bubble</span>
            <Switch
              checked={data.showWelcomeBubble}
              onCheckedChange={(checked) => update({ showWelcomeBubble: checked })}
              className="data-[state=checked]:bg-[#FACC15]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function renderChatbotPreviewElement(data: ChatbotConfigData) {
  return (
    <div className="flex flex-col items-end gap-2 animate-in fade-in duration-200">
      {/* Welcome bubble */}
      {data.showWelcomeBubble && (
        <div className="rounded-xl bg-[#18181B] text-white p-2.5 max-w-[190px] shadow-2xl border border-zinc-700 text-left">
          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
            {data.botName || "AI Assistant"}
          </div>
          <div className="text-[11px] leading-snug font-medium text-zinc-200">
            {data.welcomeMessage || "Hi there! How can I help you today?"}
          </div>
        </div>
      )}

      {/* Bot Button */}
      <div
        style={{ backgroundColor: data.primaryColor }}
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl cursor-pointer transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        <Bot className="h-6 w-6 stroke-[2]" />
      </div>
    </div>
  );
}
