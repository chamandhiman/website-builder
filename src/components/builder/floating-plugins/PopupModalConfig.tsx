"use client";

import React from "react";
import { Layers, Check, Tag, Mail, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface PopupModalConfigData {
  template: "discount" | "newsletter" | "announcement";
  headline: string;
  message: string;
  ctaLabel: string;
  ctaUrl: string;
  backgroundColor: string;
  textColor: string;
  btnBgColor: string;
  btnTextColor: string;
  showOnDesktop: boolean;
  showOnMobile: boolean;
}

interface PopupModalConfigProps {
  data: PopupModalConfigData;
  onChange: (data: PopupModalConfigData) => void;
}

export function PopupModalConfig({ data, onChange }: PopupModalConfigProps) {
  const update = (patch: Partial<PopupModalConfigData>) => {
    onChange({ ...data, ...patch });
  };

  const handleTemplateSelect = (tpl: "discount" | "newsletter" | "announcement") => {
    if (tpl === "discount") {
      update({
        template: tpl,
        headline: "Limited Time Offer — 20% Off",
        message: "Join today and enjoy 20% off all your website building plans with coupon SAVE20.",
        ctaLabel: "Claim Discount",
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        btnBgColor: "#7137D8",
        btnTextColor: "#FFFFFF",
      });
    } else if (tpl === "newsletter") {
      update({
        template: tpl,
        headline: "Stay in the Loop",
        message: "Subscribe to our weekly newsletter for the latest design tips and product releases.",
        ctaLabel: "Subscribe Now",
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        btnBgColor: "#7137D8",
        btnTextColor: "#FFFFFF",
      });
    } else {
      update({
        template: tpl,
        headline: "Important Announcement",
        message: "We have upgraded our platform with new features. Check out what is new!",
        ctaLabel: "Learn More",
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        btnBgColor: "#7137D8",
        btnTextColor: "#FFFFFF",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. POPUP TEMPLATE ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
          Popup Template
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {(
            [
              { key: "discount", label: "Special Offer", icon: Tag },
              { key: "newsletter", label: "Newsletter", icon: Mail },
              { key: "announcement", label: "Alert / Notice", icon: AlertCircle },
            ] as const
          ).map((t) => {
            const isSelected = data.template === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTemplateSelect(t.key)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition ${
                  isSelected
                    ? "border-2 border-[#7137D8] bg-[#EDE9FE] shadow-sm text-[#7137D8] font-bold"
                    : "border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569]"
                }`}
              >
                <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-[#7137D8]" : "text-[#64748B]"}`} />
                <span className="text-xs font-semibold truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. CONTENT ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
          Popup Content
        </label>
        <div>
          <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
            Headline
          </span>
          <input
            type="text"
            value={data.headline}
            onChange={(e) => update({ headline: e.target.value })}
            placeholder="Special Offer"
            className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]"
          />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
            Message
          </span>
          <textarea
            value={data.message}
            onChange={(e) => update({ message: e.target.value })}
            placeholder="Write your popup text here..."
            rows={2}
            className="w-full p-3 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
              Button Label
            </span>
            <input
              type="text"
              value={data.ctaLabel}
              onChange={(e) => update({ ctaLabel: e.target.value })}
              placeholder="Claim Offer"
              className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
              Button Link URL
            </span>
            <input
              type="text"
              value={data.ctaUrl}
              onChange={(e) => update({ ctaUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#000000] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]"
            />
          </div>
        </div>
      </div>

      {/* ── 3. COLORS ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
          Appearance & Colors
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
              Modal Background
            </span>
            <div className="flex items-center gap-2 h-10 px-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
              <input
                type="color"
                value={data.backgroundColor}
                onChange={(e) => update({ backgroundColor: e.target.value })}
                className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-xs text-[#000000] font-mono">{data.backgroundColor}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#334155] block mb-1.5">
              Button Color
            </span>
            <div className="flex items-center gap-2 h-10 px-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
              <input
                type="color"
                value={data.btnBgColor}
                onChange={(e) => update({ btnBgColor: e.target.value })}
                className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-xs text-[#000000] font-mono">{data.btnBgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. DISPLAY OPTIONS ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#111827] tracking-wide block">
          Display Options
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        </div>
      </div>
    </div>
  );
}

export function renderPopupModalPreviewElement(data: PopupModalConfigData) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs z-30 animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: data.backgroundColor,
          color: data.textColor,
        }}
        className="w-full max-w-[260px] rounded-2xl p-4 shadow-2xl border border-[#E2E8F0] text-center space-y-2 relative"
      >
        <span className="absolute top-2.5 right-2.5 text-[#64748B] hover:text-[#000000] cursor-pointer text-xs">
          ✕
        </span>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE9FE] text-[#7137D8] mb-0.5">
          <Tag className="h-4 w-4" />
        </div>
        <h4 style={{ color: data.textColor || "#000000" }} className="text-xs font-bold leading-tight">
          {data.headline || "Special Offer"}
        </h4>
        <p style={{ color: data.textColor ? `${data.textColor}CC` : "#475569" }} className="text-[10px] leading-snug line-clamp-2">
          {data.message || "Sign up now for exclusive discounts."}
        </p>
        <div className="pt-1">
          <span
            style={{
              backgroundColor: data.btnBgColor,
              color: data.btnTextColor,
            }}
            className="inline-block w-full py-1.5 rounded-lg text-xs font-bold shadow-md cursor-pointer"
          >
            {data.ctaLabel || "Learn More"}
          </span>
        </div>
      </div>
    </div>
  );
}
