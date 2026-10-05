import React, { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetPropertyComponentProps } from "../widgetRegistry";
import {
  defaultOverlayBannerWidgetData,
  isOverlayBannerWidgetData,
  type OverlayBannerVariant,
  type OverlayBannerWidgetData,
} from "./OverlayBannerTypes";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Image as ImageIcon,
  Type,
  Layers,
  Palette,
  Sliders,
  ChevronDown,
} from "lucide-react";

export function OverlayBannerProperties({
  value,
  onChange,
  onClose,
}: WidgetPropertyComponentProps) {
  const bannerData: OverlayBannerWidgetData = isOverlayBannerWidgetData(value)
    ? value
    : defaultOverlayBannerWidgetData;

  const content = { ...defaultOverlayBannerWidgetData.content, ...(bannerData.content || {}) };
  const style = { ...defaultOverlayBannerWidgetData.style, ...(bannerData.style || {}) };
  const currentVariant: OverlayBannerVariant = bannerData.variant || "Centered Hero Banner";

  const [activeTab, setActiveTab] = useState<"content" | "style" | "overlay">("content");

  const updateContent = (patch: Partial<typeof content>) => {
    onChange({
      ...bannerData,
      content: { ...content, ...patch },
    });
  };

  const updateStyle = (patch: Partial<typeof style>) => {
    onChange({
      ...bannerData,
      style: { ...style, ...patch },
    });
  };

  const setVariant = (variant: OverlayBannerVariant) => {
    const patchStyle: Partial<typeof style> = {};
    if (variant === "Left-Aligned Editorial") {
      patchStyle.alignment = "left";
      patchStyle.contentMaxWidth = "760px";
    } else if (variant === "Minimal Page Header") {
      patchStyle.alignment = "center";
      patchStyle.minHeight = "340px";
      patchStyle.paddingY = "60px";
    } else if (variant === "Parallax Visual Banner") {
      patchStyle.fixedBackground = true;
      patchStyle.alignment = "center";
    } else {
      patchStyle.alignment = "center";
      patchStyle.minHeight = "560px";
      patchStyle.paddingY = "100px";
      patchStyle.fixedBackground = false;
    }

    onChange({
      ...bannerData,
      variant,
      style: { ...style, ...patchStyle },
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#141416] text-[#F4F4F5] text-xs">
      {/* Header */}
      <div className="shrink-0 border-b border-[#26262B] bg-[#18181B] px-3.5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#27272A] text-[#FACC15]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-[13px] font-semibold text-[#F4F4F5]">Overlay Text Banner</h3>
              <p className="text-[10px] text-[#A1A1AA]">Background image + overlay text banner</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1 text-[#71717A] hover:bg-[#27272A] hover:text-[#F4F4F5]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="mt-3 flex rounded-lg bg-[#111113] p-1 border border-[#27272A]">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`flex-1 rounded-md py-1.5 text-center text-[11px] font-medium transition ${
              activeTab === "content"
                ? "bg-[#27272A] text-[#F4F4F5] shadow-xs"
                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            Content
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("overlay")}
            className={`flex-1 rounded-md py-1.5 text-center text-[11px] font-medium transition ${
              activeTab === "overlay"
                ? "bg-[#27272A] text-[#F4F4F5] shadow-xs"
                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            Overlay & Image
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`flex-1 rounded-md py-1.5 text-center text-[11px] font-medium transition ${
              activeTab === "style"
                ? "bg-[#27272A] text-[#F4F4F5] shadow-xs"
                : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            Styling
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Style Variant Selector */}
        <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Layout Style
          </label>
          <select
            value={currentVariant}
            onChange={(e) => setVariant(e.target.value as OverlayBannerVariant)}
            className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] px-2.5 py-2 text-xs text-[#F4F4F5] outline-none focus:border-[#FACC15]"
          >
            <option value="Centered Hero Banner">Centered Hero Banner</option>
            <option value="Left-Aligned Editorial">Left-Aligned Editorial</option>
            <option value="Minimal Page Header">Minimal Page Header (Inner Pages)</option>
            <option value="Parallax Visual Banner">Parallax Visual Banner</option>
          </select>
        </div>

        {activeTab === "content" && (
          <>
            {/* Badge / Eyebrow */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Eyebrow Badge
                </label>
                <input
                  type="checkbox"
                  checked={content.showBadge}
                  onChange={(e) => updateContent({ showBadge: e.target.checked })}
                  className="rounded border-[#3F3F46] accent-[#FACC15]"
                />
              </div>
              {content.showBadge && (
                <input
                  type="text"
                  value={content.badge || ""}
                  onChange={(e) => updateContent({ badge: e.target.value })}
                  placeholder="e.g. Exclusive Collection"
                  className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] px-2.5 py-2 text-xs text-[#F4F4F5] outline-none focus:border-[#FACC15]"
                />
              )}
            </div>

            {/* Main Headline */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Main Headline
              </label>
              <textarea
                value={content.title || ""}
                onChange={(e) => updateContent({ title: e.target.value })}
                rows={2}
                placeholder="Enter title..."
                className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] p-2.5 text-xs text-[#F4F4F5] outline-none focus:border-[#FACC15]"
              />
            </div>

            {/* Subtitle */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  Subtitle Description
                </label>
                <input
                  type="checkbox"
                  checked={content.showSubtitle}
                  onChange={(e) => updateContent({ showSubtitle: e.target.checked })}
                  className="rounded border-[#3F3F46] accent-[#FACC15]"
                />
              </div>
              {content.showSubtitle && (
                <textarea
                  value={content.subtitle || ""}
                  onChange={(e) => updateContent({ subtitle: e.target.value })}
                  rows={3}
                  placeholder="Enter supporting description..."
                  className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] p-2.5 text-xs text-[#F4F4F5] outline-none focus:border-[#FACC15]"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Call to Action Buttons
              </label>

              {/* Primary Button */}
              <div className="space-y-1.5 border-t border-[#27272A] pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#E4E4E7]">Primary Button</span>
                  <input
                    type="checkbox"
                    checked={content.showPrimaryButton}
                    onChange={(e) => updateContent({ showPrimaryButton: e.target.checked })}
                    className="rounded border-[#3F3F46] accent-[#FACC15]"
                  />
                </div>
                {content.showPrimaryButton && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={content.primaryButtonText || ""}
                      onChange={(e) => updateContent({ primaryButtonText: e.target.value })}
                      placeholder="Label"
                      className="rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1.5 text-xs text-[#F4F4F5] outline-none"
                    />
                    <input
                      type="text"
                      value={content.primaryButtonUrl || ""}
                      onChange={(e) => updateContent({ primaryButtonUrl: e.target.value })}
                      placeholder="#url"
                      className="rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1.5 text-xs text-[#F4F4F5] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Secondary Button */}
              <div className="space-y-1.5 border-t border-[#27272A] pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#E4E4E7]">Secondary Button</span>
                  <input
                    type="checkbox"
                    checked={content.showSecondaryButton}
                    onChange={(e) => updateContent({ showSecondaryButton: e.target.checked })}
                    className="rounded border-[#3F3F46] accent-[#FACC15]"
                  />
                </div>
                {content.showSecondaryButton && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={content.secondaryButtonText || ""}
                      onChange={(e) => updateContent({ secondaryButtonText: e.target.value })}
                      placeholder="Label"
                      className="rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1.5 text-xs text-[#F4F4F5] outline-none"
                    />
                    <input
                      type="text"
                      value={content.secondaryButtonUrl || ""}
                      onChange={(e) => updateContent({ secondaryButtonUrl: e.target.value })}
                      placeholder="#url"
                      className="rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1.5 text-xs text-[#F4F4F5] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "overlay" && (
          <>
            {/* Background Image */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Background Image URL
              </label>
              <input
                type="text"
                value={content.backgroundImage || ""}
                onChange={(e) => updateContent({ backgroundImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] px-2.5 py-2 text-xs text-[#F4F4F5] outline-none focus:border-[#FACC15]"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#A1A1AA]">Fixed Parallax Scroll</span>
                <input
                  type="checkbox"
                  checked={Boolean(style.fixedBackground)}
                  onChange={(e) => updateStyle({ fixedBackground: e.target.checked })}
                  className="rounded border-[#3F3F46] accent-[#FACC15]"
                />
              </div>
            </div>

            {/* Dark / Gradient Overlay Controls */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Overlay Filter
              </label>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#E4E4E7]">Gradient Overlay</span>
                <input
                  type="checkbox"
                  checked={Boolean(style.overlayGradient)}
                  onChange={(e) => updateStyle({ overlayGradient: e.target.checked })}
                  className="rounded border-[#3F3F46] accent-[#FACC15]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#A1A1AA]">Overlay Opacity</span>
                  <span className="text-[11px] font-mono text-[#FACC15]">
                    {Math.round((style.overlayOpacity ?? 0.6) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={style.overlayOpacity ?? 0.6}
                  onChange={(e) => updateStyle({ overlayOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-[#FACC15]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#A1A1AA]">Overlay Tint Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.overlayColor || "#05070D"}
                    onChange={(e) => updateStyle({ overlayColor: e.target.value })}
                    className="h-7 w-7 rounded border border-[#3F3F46] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={style.overlayColor || "#05070D"}
                    onChange={(e) => updateStyle({ overlayColor: e.target.value })}
                    className="flex-1 rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1 text-xs text-[#F4F4F5] outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "style" && (
          <>
            {/* Text Alignment */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Alignment
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => updateStyle({ alignment: align })}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium capitalize transition ${
                      style.alignment === align
                        ? "border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                        : "border-[#27272A] bg-[#111113] text-[#A1A1AA] hover:text-[#F4F4F5]"
                    }`}
                  >
                    {align === "left" && <AlignLeft className="h-3.5 w-3.5" />}
                    {align === "center" && <AlignCenter className="h-3.5 w-3.5" />}
                    {align === "right" && <AlignRight className="h-3.5 w-3.5" />}
                    {align}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-3">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Colors & Accent
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#A1A1AA]">Title Color</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={style.titleColor || "#FFFFFF"}
                      onChange={(e) => updateStyle({ titleColor: e.target.value })}
                      className="h-6 w-6 rounded border border-[#3F3F46] bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={style.titleColor || "#FFFFFF"}
                      onChange={(e) => updateStyle({ titleColor: e.target.value })}
                      className="w-full rounded border border-[#2B2B30] bg-[#111113] px-1.5 py-1 text-[11px] text-[#F4F4F5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#A1A1AA]">Primary Button Bg</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={style.primaryBtnBg || "#FACC15"}
                      onChange={(e) => updateStyle({ primaryBtnBg: e.target.value })}
                      className="h-6 w-6 rounded border border-[#3F3F46] bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={style.primaryBtnBg || "#FACC15"}
                      onChange={(e) => updateStyle({ primaryBtnBg: e.target.value })}
                      className="w-full rounded border border-[#2B2B30] bg-[#111113] px-1.5 py-1 text-[11px] text-[#F4F4F5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Height & Spacing */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-3 space-y-2.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Height & Padding
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#A1A1AA]">Min Height</span>
                  <input
                    type="text"
                    value={style.minHeight || "560px"}
                    onChange={(e) => updateStyle({ minHeight: e.target.value })}
                    className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1.5 text-xs text-[#F4F4F5]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1AA]">Padding Y</span>
                  <input
                    type="text"
                    value={style.paddingY || "100px"}
                    onChange={(e) => updateStyle({ paddingY: e.target.value })}
                    className="w-full rounded-lg border border-[#2B2B30] bg-[#111113] px-2 py-1.5 text-xs text-[#F4F4F5]"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
