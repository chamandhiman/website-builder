import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  Eye,
  Smartphone,
  Monitor,
  Sparkles,
  MessageCircle,
  Accessibility,
  Globe,
  ArrowUp,
  Phone,
  Code2,
  Check,
  Sliders,
  Settings2,
} from "lucide-react";
import { useBuilder } from "@/lib/builder/store";
import type { FloatingWidgetRecord, FloatingPosition, FloatingWidgetType } from "@/lib/builder/floatingWidgetsTypes";
import { createDefaultFloatingWidget } from "@/lib/builder/floatingWidgetsTypes";
import { toast } from "sonner";

interface FloatingWidgetConfigModalProps {
  widget: FloatingWidgetRecord | null;
  widgetType?: FloatingWidgetType;
  isOpen: boolean;
  onClose: () => void;
}

export function FloatingWidgetConfigModal({
  widget,
  widgetType,
  isOpen,
  onClose,
}: FloatingWidgetConfigModalProps) {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const addOrUpdateFloatingWidget = useBuilder((s) => s.addOrUpdateFloatingWidget);
  const removeFloatingWidget = useBuilder((s) => s.removeFloatingWidget);

  const [formData, setFormData] = useState<FloatingWidgetRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"settings" | "appearance" | "targeting">("settings");

  useEffect(() => {
    if (!isOpen) return;
    if (widget) {
      setFormData(JSON.parse(JSON.stringify(widget)));
    } else if (widgetType) {
      setFormData(createDefaultFloatingWidget(widgetType));
    }
  }, [widget, widgetType, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a widget name");
      return;
    }
    addOrUpdateFloatingWidget(formData);
    toast.success(`${formData.name} saved successfully!`);
    onClose();
  };

  const handleRemove = () => {
    if (confirm(`Are you sure you want to remove ${formData.name} from this website?`)) {
      removeFloatingWidget(formData.id);
      toast.success(`${formData.name} removed from website`);
      onClose();
    }
  };

  const pages = project?.pages || [];

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#2B2B2B] bg-[#141416] text-[#F5F5F5] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B2B2B] px-5 py-4 bg-[#18181A]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FACC15]/15 border border-[#FACC15]/30 text-[#FACC15]">
              {formData.type === "whatsapp_chat" && <MessageCircle className="h-5 w-5" />}
              {formData.type === "accessibility" && <Accessibility className="h-5 w-5" />}
              {formData.type === "language_switcher" && <Globe className="h-5 w-5" />}
              {formData.type === "back_to_top" && <ArrowUp className="h-5 w-5" />}
              {formData.type === "floating_contact" && <Phone className="h-5 w-5" />}
              {formData.type === "custom_embed" && <Code2 className="h-5 w-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {widget ? "Configure Floating Widget" : "Add Floating Widget"}
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  {formData.enabled ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-[11px] text-[#A1A1AA]">
                Floats automatically on top of your website without disrupting page layouts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#71717A] hover:bg-[#27272A] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#2B2B2B] bg-[#121214] px-5">
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
              activeTab === "settings"
                ? "border-[#FACC15] text-[#FACC15]"
                : "border-transparent text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Content & Action</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
              activeTab === "appearance"
                ? "border-[#FACC15] text-[#FACC15]"
                : "border-transparent text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Position & Corner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("targeting")}
            className={`flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
              activeTab === "targeting"
                ? "border-[#FACC15] text-[#FACC15]"
                : "border-transparent text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Visibility & Pages</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active status & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-[#D4D4D8]">Widget Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-3 text-xs text-white outline-none focus:border-[#FACC15]"
                placeholder="e.g. WhatsApp Customer Support"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#D4D4D8]">Status</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                className={`w-full h-8 rounded-lg border px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  formData.enabled
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.enabled ? "bg-emerald-400" : "bg-zinc-500"}`} />
                <span>{formData.enabled ? "Active on Website" : "Disabled (Hidden)"}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* WhatsApp Specific */}
              {formData.type === "whatsapp_chat" && (
                <div className="rounded-xl border border-[#2B2B2B] bg-[#18181A] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    <span>WhatsApp Details</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#A1A1AA]">Phone Number (with country code)</label>
                      <input
                        type="text"
                        value={formData.config.phoneNumber || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: { ...formData.config, phoneNumber: e.target.value },
                          })
                        }
                        placeholder="+1 555 123 4567"
                        className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#A1A1AA]">Agent / Team Name</label>
                      <input
                        type="text"
                        value={formData.config.agentName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: { ...formData.config, agentName: e.target.value },
                          })
                        }
                        placeholder="Customer Support"
                        className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#A1A1AA]">Greeting Bubble Message</label>
                    <input
                      type="text"
                      value={formData.config.greetingText || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          config: { ...formData.config, greetingText: e.target.value },
                        })
                      }
                      placeholder="Hi there! How can we help you today?"
                      className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#A1A1AA]">Prefilled Visitor Message</label>
                    <input
                      type="text"
                      value={formData.config.prefilledMessage || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          config: { ...formData.config, prefilledMessage: e.target.value },
                        })
                      }
                      placeholder="Hello! I would like to inquire about..."
                      className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              )}

              {/* Accessibility Specific */}
              {formData.type === "accessibility" && (
                <div className="rounded-xl border border-[#2B2B2B] bg-[#18181A] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Accessibility className="h-4 w-4 text-blue-400" />
                    <span>Accessibility Tools Enabled</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { key: "textResize", label: "Text Size Controls (A- / A+)" },
                      { key: "highContrast", label: "High Contrast / Dark Mode" },
                      { key: "readableFont", label: "Dyslexia Friendly Font" },
                      { key: "highlightLinks", label: "Highlight All Links" },
                      { key: "readingGuide", label: "Reading Ruler & Guide" },
                    ].map((feature) => {
                      const enabled = formData.config.features?.[feature.key] !== false;
                      return (
                        <label
                          key={feature.key}
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#141416] border border-[#2B2B2B] cursor-pointer hover:border-[#FACC15]/40 transition"
                        >
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => {
                              const nextFeatures = { ...formData.config.features, [feature.key]: e.target.checked };
                              setFormData({
                                ...formData,
                                config: { ...formData.config, features: nextFeatures },
                              });
                            }}
                            className="rounded border-[#2B2B2B] text-[#FACC15] focus:ring-0"
                          />
                          <span className="text-[11px] text-zinc-300">{feature.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Back to Top Specific */}
              {formData.type === "back_to_top" && (
                <div className="rounded-xl border border-[#2B2B2B] bg-[#18181A] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-amber-400" />
                    <span>Scroll Trigger & Style</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#A1A1AA]">Scroll Distance to Appear (px)</label>
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        step="50"
                        value={formData.config.scrollThreshold || 280}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: { ...formData.config, scrollThreshold: Number(e.target.value) },
                          })
                        }
                        className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#A1A1AA]">Button Shape</label>
                      <select
                        value={formData.config.shape || "round"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: { ...formData.config, shape: e.target.value },
                          })
                        }
                        className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="round">Circular (Round)</option>
                        <option value="rounded_square">Rounded Square</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Contact Specific */}
              {formData.type === "floating_contact" && (
                <div className="rounded-xl border border-[#2B2B2B] bg-[#18181A] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-400" />
                    <span>Action & Destination</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#A1A1AA]">Action Type</label>
                      <select
                        value={formData.config.actionType || "phone"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: { ...formData.config, actionType: e.target.value },
                          })
                        }
                        className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      >
                        <option value="phone">Phone Call (tel:)</option>
                        <option value="email">Email Message (mailto:)</option>
                        <option value="url">External Link / Booking Page</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#A1A1AA]">Phone / Email / URL</label>
                      <input
                        type="text"
                        value={formData.config.actionValue || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            config: { ...formData.config, actionValue: e.target.value },
                          })
                        }
                        placeholder="+1 555 123 4567 or mail@domain.com"
                        className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#A1A1AA]">Button Label</label>
                    <input
                      type="text"
                      value={formData.config.label || "Call Now"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          config: { ...formData.config, label: e.target.value },
                        })
                      }
                      className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                    />
                  </div>
                </div>
              )}

              {/* Custom Embed Specific */}
              {formData.type === "custom_embed" && (
                <div className="rounded-xl border border-[#2B2B2B] bg-[#18181A] p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-amber-400" />
                    <span>Floating Embed HTML / Script</span>
                  </h3>
                  <textarea
                    rows={6}
                    value={formData.snippetHtml || ""}
                    onChange={(e) => setFormData({ ...formData, snippetHtml: e.target.value })}
                    placeholder="<iframe ...></iframe> or custom chatbot widget script"
                    className="w-full font-mono rounded-lg border border-[#2B2B2B] bg-[#111113] p-3 text-xs text-amber-300 outline-none focus:border-[#FACC15]"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: POSITION & CORNER */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#D4D4D8] block mb-2">
                  Screen Anchor Corner
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto p-4 rounded-xl border border-[#2B2B2B] bg-[#111113]">
                  {[
                    { id: "top_left", label: "Top Left" },
                    { id: "top_right", label: "Top Right" },
                    { id: "bottom_left", label: "Bottom Left" },
                    { id: "bottom_right", label: "Bottom Right" },
                  ].map((corner) => {
                    const isSelected = formData.position === corner.id;
                    return (
                      <button
                        key={corner.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, position: corner.id as FloatingPosition })}
                        className={`h-16 rounded-xl border p-3 flex flex-col items-center justify-center gap-1 transition ${
                          isSelected
                            ? "border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15] font-bold shadow-xs"
                            : "border-[#2B2B2B] bg-[#18181A] text-[#A1A1AA] hover:border-zinc-600 hover:text-white"
                        }`}
                      >
                        <span className="text-xs">{corner.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Offsets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#A1A1AA]">Horizontal Offset (px from edge)</label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.offsetX}
                    onChange={(e) => setFormData({ ...formData, offsetX: Number(e.target.value) })}
                    className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#A1A1AA]">Vertical Offset (px from edge)</label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.offsetY}
                    onChange={(e) => setFormData({ ...formData, offsetY: Number(e.target.value) })}
                    className="w-full h-8 rounded-lg border border-[#2B2B2B] bg-[#1C1C1E] px-2.5 text-xs text-white outline-none focus:border-[#FACC15]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILITY & TARGETING */}
          {activeTab === "targeting" && (
            <div className="space-y-4">
              {/* Device Visibility */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#D4D4D8] block">Device Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showOnDesktop: !formData.showOnDesktop })}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition ${
                      formData.showOnDesktop
                        ? "border-[#FACC15]/40 bg-[#FACC15]/10 text-white"
                        : "border-[#2B2B2B] bg-[#18181A] text-zinc-500"
                    }`}
                  >
                    <Monitor className="h-4 w-4 text-[#FACC15]" />
                    <div className="text-left text-xs">
                      <span className="font-bold block">Desktop</span>
                      <span className="text-[10px] text-zinc-400">
                        {formData.showOnDesktop ? "Visible on computers" : "Hidden"}
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showOnMobile: !formData.showOnMobile })}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition ${
                      formData.showOnMobile
                        ? "border-[#FACC15]/40 bg-[#FACC15]/10 text-white"
                        : "border-[#2B2B2B] bg-[#18181A] text-zinc-500"
                    }`}
                  >
                    <Smartphone className="h-4 w-4 text-[#FACC15]" />
                    <div className="text-left text-xs">
                      <span className="font-bold block">Mobile & Tablets</span>
                      <span className="text-[10px] text-zinc-400">
                        {formData.showOnMobile ? "Visible on phones" : "Hidden"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Page Targeting */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#D4D4D8] block">Page Targeting</label>
                <div className="space-y-1.5">
                  {[
                    { id: "all", label: "All Pages on Website", desc: "Show on every page across the entire site" },
                    { id: "homepage_only", label: "Homepage Only", desc: "Only display when visitors are on the home page" },
                    { id: "custom", label: "Selected Pages", desc: "Choose specific pages where this widget appears" },
                  ].map((mode) => (
                    <label
                      key={mode.id}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                        formData.pageTargeting === mode.id
                          ? "border-[#FACC15]/40 bg-[#FACC15]/10 text-white"
                          : "border-[#2B2B2B] bg-[#18181A] text-[#A1A1AA] hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pageTargeting"
                        value={mode.id}
                        checked={formData.pageTargeting === mode.id}
                        onChange={() => setFormData({ ...formData, pageTargeting: mode.id as any })}
                        className="mt-0.5 text-[#FACC15] focus:ring-0"
                      />
                      <div>
                        <span className="text-xs font-bold block text-white">{mode.label}</span>
                        <span className="text-[10px] text-zinc-400">{mode.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.pageTargeting === "custom" && (
                  <div className="mt-2 p-3 rounded-xl border border-[#2B2B2B] bg-[#141416] space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-300 block">Select Target Pages:</span>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {pages.map((p) => {
                        const isChecked = (formData.targetedPages || []).includes(p.id);
                        return (
                          <label key={p.id} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = formData.targetedPages || [];
                                const next = e.target.checked
                                  ? [...current, p.id]
                                  : current.filter((id) => id !== p.id);
                                setFormData({ ...formData, targetedPages: next });
                              }}
                              className="rounded text-[#FACC15] focus:ring-0"
                            />
                            <span>{p.name} ({p.slug === "index" ? "/" : `/${p.slug}`})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2B2B2B] px-5 py-3 bg-[#18181A]">
          {widget ? (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove from Site</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#2B2B2B] px-3.5 py-1.5 text-xs font-medium text-[#A1A1AA] hover:bg-[#27272A] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FACC15] px-4 py-1.5 text-xs font-bold text-[#111111] hover:bg-[#FDE047] transition shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
