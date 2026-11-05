import React, { useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { FloatingWidgetRecord, FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";
import {
  MessageCircle,
  Code2,
  Trash2,
  Check,
  Save,
  Phone,
  Settings,
  HelpCircle,
  Eye,
  Sliders,
  X,
  Layers,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

interface FloatingWidgetPropertiesProps {
  widget: FloatingWidgetRecord;
  onClose?: () => void;
}

export function FloatingWidgetProperties({ widget, onClose }: FloatingWidgetPropertiesProps) {
  const addOrUpdateFloatingWidget = useBuilder((s) => s.addOrUpdateFloatingWidget);
  const removeFloatingWidget = useBuilder((s) => s.removeFloatingWidget);
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  const [name, setName] = useState(widget.name || "Floating Widget");
  const [position, setPosition] = useState<FloatingPosition>(widget.position || "bottom_right");
  const [offsetX, setOffsetX] = useState(widget.offsetX ?? 20);
  const [offsetY, setOffsetY] = useState(widget.offsetY ?? 20);
  const [showOnDesktop, setShowOnDesktop] = useState(widget.showOnDesktop !== false);
  const [showOnMobile, setShowOnMobile] = useState(widget.showOnMobile !== false);

  // Snippet & Script URL
  const rawSnippet = widget.snippetHtml || widget.config?.html || "";
  const initialScriptUrl =
    widget.config?.scriptUrl ||
    rawSnippet.match(/src=["']([^"']+)["']/i)?.[1] ||
    "";
  const [snippetHtml, setSnippetHtml] = useState(rawSnippet);
  const [scriptUrl, setScriptUrl] = useState(initialScriptUrl);

  // WhatsApp specific fields
  const isWhatsApp =
    widget.type === "whatsapp_chat" ||
    (widget.type === "custom_embed" && /whatsapp|wa\.me/i.test(snippetHtml + (widget.name || "")));

  const [phoneNumber, setPhoneNumber] = useState(
    widget.config?.phoneNumber ||
      snippetHtml.match(/data-phone=["']([^"']+)["']/i)?.[1] ||
      ""
  );
  const [agentName, setAgentName] = useState(
    widget.config?.agentName ||
      snippetHtml.match(/data-agent(?:-name)?=["']([^"']+)["']/i)?.[1] ||
      "Customer Support"
  );
  const [greetingText, setGreetingText] = useState(
    widget.config?.greetingText ||
      widget.config?.prefilledMessage ||
      snippetHtml.match(/data-message=["']([^"']+)["']/i)?.[1] ||
      "Hi there! How can we help you today?"
  );
  const [buttonLabel, setButtonLabel] = useState(widget.config?.buttonLabel || "Chat with us");
  const [buttonColor, setButtonColor] = useState(widget.config?.buttonColor || "#25D366");
  const [buttonStyle, setButtonStyle] = useState(widget.config?.buttonStyle || "whatsapp_standard");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Keep state in sync if widget changes
  useEffect(() => {
    setName(widget.name || "Floating Widget");
    setPosition(widget.position || "bottom_right");
    setOffsetX(widget.offsetX ?? 20);
    setOffsetY(widget.offsetY ?? 20);
    setShowOnDesktop(widget.showOnDesktop !== false);
    setShowOnMobile(widget.showOnMobile !== false);

    const s = widget.snippetHtml || widget.config?.html || "";
    setSnippetHtml(s);
    setScriptUrl(widget.config?.scriptUrl || s.match(/src=["']([^"']+)["']/i)?.[1] || "");

    setPhoneNumber(widget.config?.phoneNumber || s.match(/data-phone=["']([^"']+)["']/i)?.[1] || "");
    setAgentName(widget.config?.agentName || s.match(/data-agent(?:-name)?=["']([^"']+)["']/i)?.[1] || "Customer Support");
    setGreetingText(widget.config?.greetingText || widget.config?.prefilledMessage || s.match(/data-message=["']([^"']+)["']/i)?.[1] || "Hi there! How can we help you today?");
    setButtonLabel(widget.config?.buttonLabel || "Chat with us");
    setButtonColor(widget.config?.buttonColor || "#25D366");
    setButtonStyle(widget.config?.buttonStyle || "whatsapp_standard");
  }, [widget.id]);

  const handleScriptUrlChange = (newUrl: string) => {
    setScriptUrl(newUrl);
    if (newUrl.trim()) {
      if (snippetHtml.includes("<script")) {
        const updatedSnippet = snippetHtml.replace(/src=["'][^"']*["']/i, `src="${newUrl.trim()}"`);
        setSnippetHtml(updatedSnippet);
      } else {
        const generated = `<script src="${newUrl.trim()}" async></script>`;
        setSnippetHtml(generated);
      }
    }
  };

  const handleSave = () => {
    setSaveStatus("saving");

    let finalSnippet = snippetHtml.trim();
    if (scriptUrl.trim()) {
      if (finalSnippet.includes("<script")) {
        finalSnippet = finalSnippet.replace(/src=["'][^"']*["']/i, `src="${scriptUrl.trim()}"`);
      } else if (!finalSnippet) {
        finalSnippet = `<script src="${scriptUrl.trim()}" async></script>`;
      }
    }

    const updatedConfig: Record<string, any> = {
      ...(widget.config || {}),
      scriptUrl: scriptUrl.trim(),
      html: finalSnippet,
      phoneNumber: phoneNumber.trim(),
      agentName: agentName.trim(),
      greetingText: greetingText.trim(),
      prefilledMessage: greetingText.trim(),
      buttonLabel: buttonLabel.trim(),
      buttonColor,
      buttonStyle,
    };

    const updated: FloatingWidgetRecord = {
      ...widget,
      name: name.trim() || widget.name,
      position,
      offsetX,
      offsetY,
      showOnDesktop,
      showOnMobile,
      snippetHtml: finalSnippet,
      config: updatedConfig,
      updatedAt: Date.now(),
    };

    addOrUpdateFloatingWidget(updated);
    persistWithStatus();

    // Trigger canvas preview refresh
    try {
      window.dispatchEvent(new CustomEvent("wto-widget-saved", { detail: { widgetId: widget.id } }));
      window.postMessage({ type: "WTO_FLOATING_WIDGET_SAVED", widgetId: widget.id }, "*");
    } catch (_) {}

    setTimeout(() => {
      setSaveStatus("saved");
      toast.success("Widget configuration updated!");
    }, 200);

    setTimeout(() => {
      setSaveStatus("idle");
    }, 2500);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${widget.name || 'this widget'}"?`)) {
      removeFloatingWidget(widget.id);
      persistWithStatus();
      toast.success("Widget removed from site");
      onClose?.();
    }
  };

  return (
    <div className="flex h-full flex-col bg-white text-[#334155] text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 bg-[#F8FAFC]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            {isWhatsApp ? (
              <MessageCircle className="w-4 h-4" />
            ) : (
              <Code2 className="w-4 h-4 text-[#7137D8]" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-[#111827] text-xs truncate">
              {name || (isWhatsApp ? "WhatsApp Live Chat" : "Floating Widget")}
            </h3>
            <span className="text-[10px] text-[#64748B] font-medium">
              Floating Widget &bull; <span className="text-emerald-400 font-semibold">Active</span>
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#F1F5F9] transition"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Widget Name */}
        <div>
          <label className="text-[11px] font-semibold text-[#334155] block mb-1">
            Widget Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. WhatsApp Live Chat"
            className="w-full h-8 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]/20"
          />
        </div>

        {/* Script URL Field */}
        <div>
          <label className="text-[11px] font-semibold text-[#334155] block mb-1">
            Embed Script URL
          </label>
          <input
            type="text"
            value={scriptUrl}
            onChange={(e) => handleScriptUrlChange(e.target.value)}
            placeholder="e.g. https://widgets.webtoolocean.com/whatsapp.js"
            className="w-full h-8 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs font-mono text-[#7137D8] placeholder-zinc-600 outline-none transition focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]/20"
          />
          <p className="text-[10px] text-[#94A3B8] mt-1">
            Source URL of the embed script. Edits automatically sync with the embed configuration.
          </p>
        </div>

        {/* WhatsApp Specific Properties */}
        {isWhatsApp && (
          <div className="space-y-3 pt-3 border-t border-[#E2E8F0]/80">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat Settings</span>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full h-8 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              />
              <p className="text-[10px] text-[#94A3B8] mt-1">Include country code (e.g. +1 for US, +44 for UK)</p>
            </div>

            {/* Agent Name */}
            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                Agent / Support Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Customer Support"
                className="w-full h-8 rounded-lg border border-[#E2E8F0] bg-white px-2.5 text-xs text-white placeholder-zinc-600 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              />
            </div>

            {/* Greeting / Prefilled Message */}
            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                Greeting / Prefilled Message
              </label>
              <textarea
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                placeholder="Hi there! How can we help you today?"
                rows={2}
                className="w-full p-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-white placeholder-zinc-600 outline-none resize-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              />
            </div>

            {/* Button Color Preset Picker */}
            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1.5">
                Button Color
              </label>
              <div className="flex items-center gap-2">
                {[
                  { color: "#25D366", label: "WhatsApp Green" },
                  { color: "#128C7E", label: "Dark Green" },
                  { color: "#075E54", label: "Forest" },
                  { color: "#111827", label: "Midnight" },
                  { color: "#2563EB", label: "Blue" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setButtonColor(c.color)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      buttonColor.toLowerCase() === c.color.toLowerCase()
                        ? "border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)] ring-2 ring-emerald-400"
                        : "border-[#CBD5E1] hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="w-6 h-6 rounded-full border border-[#CBD5E1] bg-transparent cursor-pointer ml-1"
                  title="Custom Color"
                />
              </div>
            </div>
          </div>
        )}

        {/* Position & Offsets */}
        <div className="space-y-3 pt-3 border-t border-[#E2E8F0]/80">
          <label className="text-[11px] font-semibold text-[#334155] block">
            Position on Screen
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              { id: "bottom_right", label: "Bottom Right" },
              { id: "bottom_left", label: "Bottom Left" },
              { id: "middle_right", label: "Middle Right" },
              { id: "middle_left", label: "Middle Left" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPosition(p.id as FloatingPosition)}
                className={`py-1.5 px-2.5 rounded-lg border text-center font-medium transition ${
                  position === p.id
                    ? "bg-amber-400 text-zinc-950 font-bold border-[#7137D8] shadow-sm"
                    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-white hover:border-[#CBD5E1]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>Offset X</span>
                <span className="font-mono text-white">{offsetX}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>Offset Y</span>
                <span className="font-mono text-white">{offsetY}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Device Visibility */}
        <div className="space-y-2 pt-3 border-t border-[#E2E8F0]/80">
          <label className="text-[11px] font-semibold text-[#334155] block">
            Device Visibility
          </label>
          <div className="flex items-center gap-4 text-xs text-[#334155]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOnDesktop}
                onChange={(e) => setShowOnDesktop(e.target.checked)}
                className="rounded border-[#CBD5E1] accent-amber-400"
              />
              <span>Desktop</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOnMobile}
                onChange={(e) => setShowOnMobile(e.target.checked)}
                className="rounded border-[#CBD5E1] accent-amber-400"
              />
              <span>Mobile</span>
            </label>
          </div>
        </div>

        {/* Raw Embed Code Textarea (Expandable) */}
        <div className="space-y-1.5 pt-3 border-t border-[#E2E8F0]/80">
          <label className="text-[11px] font-semibold text-[#334155] block">
            Raw Embed HTML / Snippet
          </label>
          <textarea
            value={snippetHtml}
            onChange={(e) => {
              setSnippetHtml(e.target.value);
              const matched = e.target.value.match(/src=["']([^"']+)["']/i)?.[1];
              if (matched) setScriptUrl(matched);
            }}
            placeholder="<script src='...'></script>"
            rows={3}
            spellCheck={false}
            className="w-full p-2 font-mono text-xs bg-white border border-[#E2E8F0] rounded-lg text-amber-200 outline-none resize-y transition focus:border-[#7137D8]"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#161618] space-y-2.5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer select-none flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 ${
            saveStatus === "saved"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)] border border-emerald-400/40"
              : saveStatus === "saving"
              ? "bg-amber-500 text-zinc-950 opacity-90"
              : "bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-[0_2px_12px_rgba(251,191,36,0.35)] border border-amber-300/80"
          }`}
        >
          {saveStatus === "saved" ? (
            <>
              <Check className="w-4 h-4 stroke-[3] text-white" />
              <span>Saved &amp; Updated</span>
            </>
          ) : saveStatus === "saving" ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Update Widget</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2 px-4 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Widget</span>
        </button>
      </div>
    </div>
  );
}

