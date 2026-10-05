import React, { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetPropertyComponentProps } from "../widgetRegistry";
import { defaultPricingWidgetData, isPricingWidgetData, type PricingTier, type PricingWidgetData } from "./PricingTypes";
import { Plus, Trash2, ChevronDown, ChevronUp, Star } from "lucide-react";
import { nanoid } from "nanoid";

export function PricingProperties({ widgetId }: WidgetPropertyComponentProps) {
  const currentProject = useBuilder((s) => s.currentProject());
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);

  const currentPage = currentProject?.pages.find((p) => p.id === currentProject.currentPageId) ?? currentProject?.pages[0];
  const section = currentPage?.sections.find((sec) => sec.widgetInstance?.id === widgetId);
  const widget = section?.widgetInstance;

  const pricingData: PricingWidgetData = widget && isPricingWidgetData(widget) ? widget : defaultPricingWidgetData;
  const [activeTab, setActiveTab] = useState<"tiers" | "billing" | "style">("tiers");
  const [expandedTierId, setExpandedTierId] = useState<string | null>(pricingData.content.tiers[0]?.id ?? null);

  const updateContent = (partialContent: Partial<PricingWidgetData["content"]>) => {
    if (!widget) return;
    updateWidgetInstance(widgetId, {
      ...pricingData,
      content: {
        ...pricingData.content,
        ...partialContent,
      },
    } as any);
  };

  const updateStyle = (partialStyle: Partial<PricingWidgetData["style"]>) => {
    if (!widget) return;
    updateWidgetInstance(widgetId, {
      ...pricingData,
      style: {
        ...pricingData.style,
        ...partialStyle,
      },
    } as any);
  };

  const handleAddTier = () => {
    const newTier: PricingTier = {
      id: nanoid(6),
      name: "New Plan",
      badge: "",
      priceMonthly: "$49",
      priceAnnual: "$39",
      periodMonthly: "/month",
      periodAnnual: "/month, billed yearly",
      description: "Customized solution for expanding business needs.",
      features: ["Custom feature 1", "Custom feature 2", "24/7 Support line"],
      buttonText: "Choose Plan",
      buttonLink: "#contact",
      isPopular: false,
    };
    updateContent({
      tiers: [...pricingData.content.tiers, newTier],
    });
    setExpandedTierId(newTier.id);
  };

  const handleRemoveTier = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pricingData.content.tiers.length <= 1) return;
    updateContent({
      tiers: pricingData.content.tiers.filter((t) => t.id !== id),
    });
  };

  const handleUpdateTier = (id: string, updates: Partial<PricingTier>) => {
    updateContent({
      tiers: pricingData.content.tiers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    });
  };

  const handleAddFeature = (tierId: string) => {
    const tier = pricingData.content.tiers.find((t) => t.id === tierId);
    if (!tier) return;
    handleUpdateTier(tierId, {
      features: [...tier.features, "New feature inclusion"],
    });
  };

  const handleUpdateFeature = (tierId: string, index: number, value: string) => {
    const tier = pricingData.content.tiers.find((t) => t.id === tierId);
    if (!tier) return;
    const next = [...tier.features];
    next[index] = value;
    handleUpdateTier(tierId, { features: next });
  };

  const handleRemoveFeature = (tierId: string, index: number) => {
    const tier = pricingData.content.tiers.find((t) => t.id === tierId);
    if (!tier) return;
    const next = tier.features.filter((_, i) => i !== index);
    handleUpdateTier(tierId, { features: next });
  };

  return (
    <div className="flex flex-col space-y-4 p-3 text-xs text-[#D4D4D8]">
      {/* Tabs */}
      <div className="flex rounded-md border border-[#27272A] bg-[#18181B] p-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("tiers")}
          className={`flex-1 rounded py-1 text-center font-medium ${
            activeTab === "tiers" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:text-[#E4E4E7]"
          }`}
        >
          Plans ({pricingData.content.tiers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("billing")}
          className={`flex-1 rounded py-1 text-center font-medium ${
            activeTab === "billing" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:text-[#E4E4E7]"
          }`}
        >
          Billing & Header
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("style")}
          className={`flex-1 rounded py-1 text-center font-medium ${
            activeTab === "style" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:text-[#E4E4E7]"
          }`}
        >
          Style & Colors
        </button>
      </div>

      {activeTab === "tiers" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Pricing Plans</span>
            <button
              type="button"
              onClick={handleAddTier}
              className="flex items-center gap-1 rounded bg-[#FACC15] px-2 py-0.5 text-[11px] font-semibold text-[#111111] hover:bg-[#FDE047]"
            >
              <Plus className="h-3 w-3" /> Add Plan
            </button>
          </div>

          <div className="space-y-2">
            {pricingData.content.tiers.map((tier) => {
              const isExpanded = expandedTierId === tier.id;
              return (
                <div key={tier.id} className="rounded-lg border border-[#27272A] bg-[#18181B] overflow-hidden">
                  <div
                    className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-[#202024]"
                    onClick={() => setExpandedTierId(isExpanded ? null : tier.id)}
                  >
                    <div className="flex items-center gap-2">
                      {tier.isPopular && <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />}
                      <div>
                        <div className="font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                          {tier.name}
                          {tier.badge && (
                            <span className="rounded bg-[#FACC15]/20 text-[#FACC15] text-[9px] px-1.5 py-0.2 font-bold">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#A1A1AA]">
                          {tier.priceMonthly}/mo {tier.priceAnnual ? `• ${tier.priceAnnual}/yr` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {pricingData.content.tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveTier(tier.id, e)}
                          className="p-1 text-[#71717A] hover:text-red-400"
                          title="Delete plan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-[#71717A]" /> : <ChevronDown className="h-4 w-4 text-[#71717A]" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="space-y-2.5 border-t border-[#27272A] p-3 bg-[#111113]">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#71717A]">Plan Title</label>
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => handleUpdateTier(tier.id, { name: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717A]">Badge Tag</label>
                          <input
                            type="text"
                            value={tier.badge || ""}
                            onChange={(e) => handleUpdateTier(tier.id, { badge: e.target.value })}
                            placeholder="e.g. POPULAR"
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#71717A]">Monthly Price</label>
                          <input
                            type="text"
                            value={tier.priceMonthly}
                            onChange={(e) => handleUpdateTier(tier.id, { priceMonthly: e.target.value })}
                            placeholder="$49"
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717A]">Annual Price</label>
                          <input
                            type="text"
                            value={tier.priceAnnual}
                            onChange={(e) => handleUpdateTier(tier.id, { priceAnnual: e.target.value })}
                            placeholder="$39"
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#71717A]">Description</label>
                        <input
                          type="text"
                          value={tier.description}
                          onChange={(e) => handleUpdateTier(tier.id, { description: e.target.value })}
                          className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-[#71717A]">Button Label</label>
                          <input
                            type="text"
                            value={tier.buttonText}
                            onChange={(e) => handleUpdateTier(tier.id, { buttonText: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717A]">Button Link</label>
                          <input
                            type="text"
                            value={tier.buttonLink}
                            onChange={(e) => handleUpdateTier(tier.id, { buttonLink: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tier.isPopular ?? false}
                          onChange={(e) => handleUpdateTier(tier.id, { isPopular: e.target.checked })}
                          className="rounded text-[#FACC15]"
                        />
                        <span className="font-semibold text-[#FAFAFA]">Highlight as Most Popular</span>
                      </label>

                      {/* Features List */}
                      <div className="pt-2 border-t border-[#27272A]">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase">Included Features</label>
                          <button
                            type="button"
                            onClick={() => handleAddFeature(tier.id)}
                            className="text-[10px] text-[#FACC15] hover:underline"
                          >
                            + Add Feature
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {tier.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleUpdateFeature(tier.id, fIdx, e.target.value)}
                                className="w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(tier.id, fIdx)}
                                className="p-1 text-[#71717A] hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === "billing" ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Header Copy</span>
            <div>
              <label className="text-[10px] text-[#71717A]">Eyebrow</label>
              <input
                type="text"
                value={pricingData.content.eyebrow || ""}
                onChange={(e) => updateContent({ eyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2.5 py-1.5 text-xs text-[#FAFAFA] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Main Heading</label>
              <input
                type="text"
                value={pricingData.content.heading || ""}
                onChange={(e) => updateContent({ heading: e.target.value })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2.5 py-1.5 text-xs text-[#FAFAFA] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Description</label>
              <textarea
                rows={2}
                value={pricingData.content.description || ""}
                onChange={(e) => updateContent({ description: e.target.value })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2.5 py-1.5 text-xs text-[#FAFAFA] outline-none"
              />
            </div>
          </div>

          {/* Billing Switch Controls */}
          <div className="space-y-2.5 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Billing Toggle</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pricingData.content.showBillingToggle ?? true}
                onChange={(e) => updateContent({ showBillingToggle: e.target.checked })}
                className="rounded text-[#FACC15]"
              />
              <span>Show Monthly / Annual Toggle</span>
            </label>

            <div>
              <label className="text-[10px] text-[#71717A]">Active Mode</label>
              <select
                value={pricingData.content.billingCycle || "monthly"}
                onChange={(e) => updateContent({ billingCycle: e.target.value as any })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2 py-1.5 text-xs text-[#FAFAFA] outline-none"
              >
                <option value="monthly">Monthly Cycle</option>
                <option value="annual">Annual Cycle (Discounted)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#71717A]">Annual Discount Badge</label>
              <input
                type="text"
                value={pricingData.content.annualDiscountBadge || ""}
                onChange={(e) => updateContent({ annualDiscountBadge: e.target.value })}
                placeholder="e.g. Save 20%"
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2 py-1.5 text-xs text-[#FAFAFA] outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Colors & Accents</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#71717A]">Popular Border</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={pricingData.style.popularCardBorderColor || "#facc15"}
                  onChange={(e) => updateStyle({ popularCardBorderColor: e.target.value })}
                  className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[11px] font-mono">{pricingData.style.popularCardBorderColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Popular Button</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={pricingData.style.popularButtonBg || "#facc15"}
                  onChange={(e) => updateStyle({ popularButtonBg: e.target.value })}
                  className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[11px] font-mono">{pricingData.style.popularButtonBg}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Card BG</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={pricingData.style.cardBackgroundColor || "#f8fafc"}
                  onChange={(e) => updateStyle({ cardBackgroundColor: e.target.value })}
                  className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[11px] font-mono">{pricingData.style.cardBackgroundColor}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Checkmark Icon</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={pricingData.style.featureCheckColor || "#10b981"}
                  onChange={(e) => updateStyle({ featureCheckColor: e.target.value })}
                  className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[11px] font-mono">{pricingData.style.featureCheckColor}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
