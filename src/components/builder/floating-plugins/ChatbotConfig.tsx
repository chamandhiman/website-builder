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
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
          Chatbot Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
              Assistant Name
            </span>
            <input
              type="text"
              value={data.botName}
              onChange={(e) => update({ botName: e.target.value })}
              placeholder="AI Assistant"
              className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
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
                    className={`h-7 w-7 rounded-full border border-[#CBD5E1] transition-transform ${
                      isSelected
                        ? "ring-2 ring-2 ring-offset-2 ring-offset-white ring-[#7137D8] scale-110"
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
          <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
            Initial Welcome Greeting
          </span>
          <textarea
            value={data.welcomeMessage}
            onChange={(e) => update({ welcomeMessage: e.target.value })}
            placeholder="Hi there! How can I help you today?"
            rows={2}
            className="w-full p-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8] resize-none"
          />
        </div>
      </div>

      {/* ── 2. BUTTON POSITION ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
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
                    ? "border-2 border-[#7137D8] bg-[#EDE9FE] shadow-sm text-[#7137D8] font-bold"
                    : "border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569]"
                }`}
              >
                <LayoutGrid
                  className={`h-4 w-4 shrink-0 ${
                    isSelected ? "text-[#7137D8]" : "text-[#64748B]"
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
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
          Display Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#000000]">Show on Desktop</span>
            <Switch
              checked={data.showOnDesktop}
              onCheckedChange={(checked) => update({ showOnDesktop: checked })}
              className="data-[state=checked]:bg-[#7137D8]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#000000]">Show on Mobile</span>
            <Switch
              checked={data.showOnMobile}
              onCheckedChange={(checked) => update({ showOnMobile: checked })}
              className="data-[state=checked]:bg-[#7137D8]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#000000]">Greeting Bubble</span>
            <Switch
              checked={data.showWelcomeBubble}
              onCheckedChange={(checked) => update({ showWelcomeBubble: checked })}
              className="data-[state=checked]:bg-[#7137D8]"
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
        <div className="rounded-xl bg-white text-[#000000] p-2.5 max-w-[190px] shadow-xl border border-[#CBD5E1] text-left">
          <div className="text-[9px] font-bold text-[#7137D8] uppercase tracking-wider mb-0.5">
            {data.botName || "AI Assistant"}
          </div>
          <div className="text-[11px] leading-snug font-medium text-[#000000]">
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
