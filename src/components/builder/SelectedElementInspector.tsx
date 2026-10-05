"use client";

import { useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Sparkles,
  ChevronLeft,
  X,
  Link,
  ImageIcon,
  Type,
  Plus,
  Minus,
  Check,
  Palette,
} from "lucide-react";
import { toast } from "sonner";

interface SelectedElementInspectorProps {
  selectedElement: NonNullable<ReturnType<typeof useBuilder.getState>["selectedElement"]>;
  sectionName?: string;
  onClose: () => void;
}

const CURATED_SWATCHES = [
  "#FFFFFF",
  "#FACC15",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#94A3B8",
  "#0B0C10",
];

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Poppins", value: "Poppins, ui-sans-serif, system-ui, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Montserrat", value: "Montserrat, ui-sans-serif, system-ui, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
];

const FONT_WEIGHTS = [
  { label: "Light (300)", value: "300" },
  { label: "Regular (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "SemiBold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "ExtraBold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

function normalizeColorToHex(value?: string): string {
  if (!value) return "#FFFFFF";
  const str = String(value).trim();
  if (str.startsWith("#")) return str;
  const rgb = /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(str);
  if (rgb) {
    const r = Number(rgb[1]).toString(16).padStart(2, "0");
    const g = Number(rgb[2]).toString(16).padStart(2, "0");
    const b = Number(rgb[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return "#FFFFFF";
}

function parsePxNumber(val?: string, fallback = 16): number {
  if (!val) return fallback;
  const num = parseFloat(String(val).replace(/px/i, "").trim());
  return isNaN(num) ? fallback : Math.round(num);
}

export function SelectedElementInspector({
  selectedElement,
  sectionName,
  onClose,
}: SelectedElementInspectorProps) {
  const selectedElementStyle = useBuilder((s) => s.selectedElementStyle) || {};
  const selectElement = useBuilder((s) => s.selectElement);
  const replaceColorGlobally = useBuilder((s) => s.replaceColorGlobally);

  const tag = (selectedElement.tag || selectedElement.elementType || "element").toLowerCase();
  const isImage = tag === "img" || selectedElement.kind === "image" || selectedElement.elementType === "image";
  const isButtonOrLink = tag === "a" || tag === "button" || selectedElement.kind === "link" || selectedElement.elementType === "button";
  const isHeading = /^h[1-6]$/.test(tag) || selectedElement.elementType === "heading";
  const isText =
    isHeading ||
    ["p", "span", "strong", "em", "b", "i", "small", "blockquote", "cite", "label", "li"].includes(tag) ||
    selectedElement.kind === "text" ||
    selectedElement.elementType === "text" ||
    isButtonOrLink ||
    Boolean(selectedElement.textContent);

  // Local state initialized from selectedElement & selectedElementStyle
  const [content, setContent] = useState(() => selectedElement.textContent ?? "");
  const [href, setHref] = useState(() => selectedElement.href ?? "");
  const [src, setSrc] = useState(() => selectedElement.src ?? "");
  const [alt, setAlt] = useState(() => selectedElement.alt ?? "");

  const [fontFamily, setFontFamily] = useState(() => selectedElementStyle.fontFamily || "Inter");
  const [fontSize, setFontSize] = useState(() => selectedElementStyle.fontSize || (isHeading ? "40px" : "16px"));
  const [fontWeight, setFontWeight] = useState(() => selectedElementStyle.fontWeight || (isHeading ? "700" : "400"));
  const [color, setColor] = useState(() => normalizeColorToHex(selectedElementStyle.color || selectedElementStyle.textColor));
  const [textAlign, setTextAlign] = useState(() => selectedElementStyle.textAlign || "left");
  const [lineHeight, setLineHeight] = useState(() => selectedElementStyle.lineHeight || "1.4");
  const [letterSpacing, setLetterSpacing] = useState(() => selectedElementStyle.letterSpacing || "0px");
  const [textTransform, setTextTransform] = useState(() => selectedElementStyle.textTransform || "none");
  const [isBold, setIsBold] = useState(() => parseInt(selectedElementStyle.fontWeight || "400", 10) >= 600);
  const [isItalic, setIsItalic] = useState(() => (selectedElementStyle.fontStyle || "").includes("italic"));
  const [isUnderline, setIsUnderline] = useState(() => (selectedElementStyle.textDecoration || "").includes("underline"));
  const [isStrike, setIsStrike] = useState(() => (selectedElementStyle.textDecoration || "").includes("line-through"));

  // Keep state synced when selectedElement changes
  useEffect(() => {
    setContent(selectedElement.textContent ?? "");
    setHref(selectedElement.href ?? "");
    setSrc(selectedElement.src ?? "");
    setAlt(selectedElement.alt ?? "");
  }, [selectedElement.textContent, selectedElement.href, selectedElement.src, selectedElement.alt]);

  useEffect(() => {
    if (selectedElementStyle.fontFamily) setFontFamily(selectedElementStyle.fontFamily);
    if (selectedElementStyle.fontSize) setFontSize(selectedElementStyle.fontSize);
    if (selectedElementStyle.fontWeight) {
      setFontWeight(selectedElementStyle.fontWeight);
      setIsBold(parseInt(selectedElementStyle.fontWeight, 10) >= 600);
    }
    if (selectedElementStyle.color || selectedElementStyle.textColor) {
      setColor(normalizeColorToHex(selectedElementStyle.color || selectedElementStyle.textColor));
    }
    if (selectedElementStyle.textAlign) setTextAlign(selectedElementStyle.textAlign);
    if (selectedElementStyle.lineHeight) setLineHeight(selectedElementStyle.lineHeight);
    if (selectedElementStyle.letterSpacing) setLetterSpacing(selectedElementStyle.letterSpacing);
    if (selectedElementStyle.textTransform) setTextTransform(selectedElementStyle.textTransform);
    if (selectedElementStyle.fontStyle) setIsItalic(selectedElementStyle.fontStyle.includes("italic"));
    if (selectedElementStyle.textDecoration) {
      setIsUnderline(selectedElementStyle.textDecoration.includes("underline"));
      setIsStrike(selectedElementStyle.textDecoration.includes("line-through"));
    }
  }, [selectedElementStyle]);

  // Communication with preview iframe
  const sendPreviewMessage = (type: string, payload: Record<string, unknown>) => {
    const iframe = document.querySelector("iframe[title='preview']") as HTMLIFrameElement | null;
    iframe?.contentWindow?.postMessage({ __wto: true, type, payload }, "*");
  };

  const applyStylePatch = (patch: Record<string, string>) => {
    sendPreviewMessage("update-selected-element-style", {
      sectionId: selectedElement.sectionId,
      stylePatch: patch,
    });
    useBuilder.getState().setSelectedElementStyle({
      ...(selectedElementStyle || {}),
      ...patch,
    });
    if (selectedElement.widgetId && (selectedElement.childId || selectedElement.elementKey)) {
      useBuilder.getState().updateWidgetElementStyle(
        selectedElement.sectionId || "",
        selectedElement.parentWidgetId || selectedElement.widgetId,
        selectedElement.childId || selectedElement.elementKey || "",
        selectedElement.elementKey ?? null,
        patch
      );
    }
  };

  const handleContentChange = (newText: string) => {
    setContent(newText);
    sendPreviewMessage("update-selected-element-content", {
      sectionId: selectedElement.sectionId,
      text: newText,
    });
    if (selectedElement.widgetId && (selectedElement.childId || selectedElement.elementKey)) {
      useBuilder.getState().updateWidgetElementContent(
        selectedElement.sectionId || "",
        selectedElement.parentWidgetId || selectedElement.widgetId,
        selectedElement.childId || selectedElement.elementKey || "",
        selectedElement.elementKey ?? null,
        { text: newText }
      );
    }
  };

  const handleHrefChange = (newHref: string) => {
    setHref(newHref);
    sendPreviewMessage("update-selected-element-href", {
      sectionId: selectedElement.sectionId,
      href: newHref,
    });
  };

  const handleColorChange = (newColor: string) => {
    const hex = normalizeColorToHex(newColor);
    setColor(hex);
    applyStylePatch({ color: hex, textColor: hex });
  };

  const handleApplyGlobalColor = () => {
    const from = normalizeColorToHex(selectedElementStyle.color || selectedElementStyle.textColor);
    if (!from || !color || from.toLowerCase() === color.toLowerCase()) {
      toast.info("Select a different color first to replace globally.");
      return;
    }
    replaceColorGlobally(from, color);
    sendPreviewMessage("global-color-replace", {
      fromColor: from,
      toColor: color,
    });
    toast.success(`Replaced ${from.toUpperCase()} with ${color.toUpperCase()} globally across all templates!`);
  };

  const handleFontSizeAdjust = (delta: number) => {
    const currentNum = parsePxNumber(fontSize, 16);
    const nextNum = Math.max(8, Math.min(160, currentNum + delta));
    const nextVal = `${nextNum}px`;
    setFontSize(nextVal);
    applyStylePatch({ fontSize: nextVal });
  };

  const toggleBold = () => {
    const next = !isBold;
    setIsBold(next);
    const weight = next ? "700" : "400";
    setFontWeight(weight);
    applyStylePatch({ fontWeight: weight });
  };

  const toggleItalic = () => {
    const next = !isItalic;
    setIsItalic(next);
    applyStylePatch({ fontStyle: next ? "italic" : "normal" });
  };

  const toggleUnderline = () => {
    const next = !isUnderline;
    setIsUnderline(next);
    const parts = [];
    if (next) parts.push("underline");
    if (isStrike) parts.push("line-through");
    applyStylePatch({ textDecoration: parts.length ? parts.join(" ") : "none" });
  };

  const toggleStrike = () => {
    const next = !isStrike;
    setIsStrike(next);
    const parts = [];
    if (isUnderline) parts.push("underline");
    if (next) parts.push("line-through");
    applyStylePatch({ textDecoration: parts.length ? parts.join(" ") : "none" });
  };

  const handleAlignment = (align: string) => {
    setTextAlign(align);
    applyStylePatch({ textAlign: align });
  };

  const handleTransform = (transform: string) => {
    setTextTransform(transform);
    applyStylePatch({ textTransform: transform });
  };

  const tagBadge = tag ? tag.toUpperCase() : "ELEMENT";

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#141414] text-[#F4F4F5]">
      {/* Sleek Top Navigation Bar */}
      <div className="shrink-0 border-b border-[#262626] bg-[#171717] px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] transition hover:text-[#FACC15]"
            title="Return to section properties"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="truncate max-w-[130px]">{sectionName || "Section"}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="rounded-md border border-[#FACC15]/30 bg-[#FACC15]/10 px-2 py-0.5 text-[10px] font-bold text-[#FACC15] tracking-wider">
              {tagBadge}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-[#71717A] transition hover:bg-[#242424] hover:text-[#F4F4F5]"
              title="Deselect element"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Properties Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
        {/* 1. Content & Text Editor */}
        {isText && (
          <div className="rounded-xl border border-[#262626] bg-[#181818] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Text Content
              </label>
            </div>
            <textarea
              className="w-full min-h-[64px] max-h-[140px] resize-y rounded-lg border border-[#2D2D2D] bg-[#131313] p-2.5 text-xs text-[#F4F4F5] placeholder-[#71717A] outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/30"
              value={content}
              placeholder="Enter text..."
              onChange={(e) => handleContentChange(e.target.value)}
            />
          </div>
        )}

        {/* Link / Button Action */}
        {isButtonOrLink && (
          <div className="rounded-xl border border-[#262626] bg-[#181818] p-3 space-y-2">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
              <Link className="h-3 w-3 text-[#FACC15]" />
              Link Destination (Href)
            </label>
            <input
              type="text"
              className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2.5 text-xs text-[#F4F4F5] placeholder-[#71717A] outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/30"
              value={href}
              placeholder="#section or https://..."
              onChange={(e) => handleHrefChange(e.target.value)}
            />
          </div>
        )}

        {/* Image Source & Alt */}
        {isImage && (
          <div className="rounded-xl border border-[#262626] bg-[#181818] p-3 space-y-3">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
              <ImageIcon className="h-3 w-3 text-[#FACC15]" />
              Image Source
            </label>
            <input
              type="text"
              className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2.5 text-xs text-[#F4F4F5] placeholder-[#71717A] outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/30"
              value={src}
              placeholder="Image URL or data URI"
              onChange={(e) => {
                setSrc(e.target.value);
                sendPreviewMessage("update-selected-element-style", {
                  sectionId: selectedElement.sectionId,
                  stylePatch: { src: e.target.value },
                });
              }}
            />
            <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">
              Alt Description
            </label>
            <input
              type="text"
              className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2.5 text-xs text-[#F4F4F5] placeholder-[#71717A] outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/30"
              value={alt}
              placeholder="Image description"
              onChange={(e) => {
                setAlt(e.target.value);
                sendPreviewMessage("update-selected-element-style", {
                  sectionId: selectedElement.sectionId,
                  stylePatch: { alt: e.target.value },
                });
              }}
            />
          </div>
        )}

        {/* 2. Accessible Typography Panel */}
        {isText && (
          <div className="rounded-xl border border-[#262626] bg-[#181818] p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F4F4F5] uppercase tracking-wider">
                <Type className="h-3.5 w-3.5 text-[#FACC15]" />
                Typography
              </label>
            </div>

            {/* Font Family */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Font Family</label>
              <select
                className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  applyStylePatch({ fontFamily: e.target.value });
                }}
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.label} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Size with steppers */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#94A3B8]">Font Size</label>
                <div className="flex items-center rounded-lg border border-[#2D2D2D] bg-[#131313] p-0.5">
                  <button
                    type="button"
                    onClick={() => handleFontSizeAdjust(-2)}
                    className="flex h-7 w-7 items-center justify-center rounded text-[#94A3B8] transition hover:bg-[#202020] hover:text-[#F4F4F5]"
                    title="Decrease size"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="text"
                    className="h-7 w-full flex-1 bg-transparent px-1 text-center text-xs font-semibold text-[#F4F4F5] outline-none"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(e.target.value);
                      applyStylePatch({ fontSize: e.target.value });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleFontSizeAdjust(2)}
                    className="flex h-7 w-7 items-center justify-center rounded text-[#94A3B8] transition hover:bg-[#202020] hover:text-[#F4F4F5]"
                    title="Increase size"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#94A3B8]">Weight</label>
                <select
                  className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                  value={fontWeight}
                  onChange={(e) => {
                    setFontWeight(e.target.value);
                    applyStylePatch({ fontWeight: e.target.value });
                  }}
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w.value} value={w.value}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alignments Segmented Control */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Text Alignment</label>
              <div className="grid grid-cols-4 gap-1 rounded-lg border border-[#2D2D2D] bg-[#131313] p-1">
                {[
                  { value: "left", icon: AlignLeft, label: "Left" },
                  { value: "center", icon: AlignCenter, label: "Center" },
                  { value: "right", icon: AlignRight, label: "Right" },
                  { value: "justify", icon: AlignJustify, label: "Justify" },
                ].map(({ value, icon: Icon, label }) => {
                  const isActive = textAlign === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAlignment(value)}
                      className={`flex h-7 items-center justify-center rounded-md transition ${
                        isActive
                          ? "bg-[#27272A] text-[#FACC15] shadow-xs"
                          : "text-[#71717A] hover:bg-[#1E1E1E] hover:text-[#E4E4E7]"
                      }`}
                      title={`Align ${label}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formatting Style Toggles */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Text Formatting</label>
              <div className="grid grid-cols-4 gap-1 rounded-lg border border-[#2D2D2D] bg-[#131313] p-1">
                <button
                  type="button"
                  onClick={toggleBold}
                  className={`flex h-7 items-center justify-center rounded-md transition ${
                    isBold ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:bg-[#1E1E1E] hover:text-[#E4E4E7]"
                  }`}
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleItalic}
                  className={`flex h-7 items-center justify-center rounded-md transition ${
                    isItalic ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:bg-[#1E1E1E] hover:text-[#E4E4E7]"
                  }`}
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleUnderline}
                  className={`flex h-7 items-center justify-center rounded-md transition ${
                    isUnderline ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:bg-[#1E1E1E] hover:text-[#E4E4E7]"
                  }`}
                  title="Underline"
                >
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleStrike}
                  className={`flex h-7 items-center justify-center rounded-md transition ${
                    isStrike ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:bg-[#1E1E1E] hover:text-[#E4E4E7]"
                  }`}
                  title="Strikethrough"
                >
                  <Strikethrough className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Text Transform Control */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Transform</label>
              <div className="grid grid-cols-4 gap-1 rounded-lg border border-[#2D2D2D] bg-[#131313] p-1">
                {[
                  { value: "none", label: "Aa", title: "Normal" },
                  { value: "uppercase", label: "AA", title: "Uppercase" },
                  { value: "lowercase", label: "aa", title: "Lowercase" },
                  { value: "capitalize", label: "Ab", title: "Capitalize" },
                ].map(({ value, label, title }) => {
                  const isActive = textTransform === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleTransform(value)}
                      className={`flex h-7 items-center justify-center rounded-md text-xs font-semibold transition ${
                        isActive
                          ? "bg-[#27272A] text-[#FACC15] shadow-xs"
                          : "text-[#71717A] hover:bg-[#1E1E1E] hover:text-[#E4E4E7]"
                      }`}
                      title={title}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Line Height & Letter Spacing */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#94A3B8]">Line Height</label>
                <select
                  className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                  value={lineHeight}
                  onChange={(e) => {
                    setLineHeight(e.target.value);
                    applyStylePatch({ lineHeight: e.target.value });
                  }}
                >
                  <option value="1">1.0 Tight</option>
                  <option value="1.15">1.15 Heading</option>
                  <option value="1.25">1.25 Snug</option>
                  <option value="1.4">1.4 Normal</option>
                  <option value="1.6">1.6 Relaxed</option>
                  <option value="1.8">1.8 Loose</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#94A3B8]">Letter Spacing</label>
                <input
                  type="text"
                  className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                  value={letterSpacing}
                  placeholder="0px"
                  onChange={(e) => {
                    setLetterSpacing(e.target.value);
                    applyStylePatch({ letterSpacing: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Text Color & Global Color Replacement */}
        {isText && (
          <div className="rounded-xl border border-[#262626] bg-[#181818] p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#F4F4F5] uppercase tracking-wider">
                <Palette className="h-3.5 w-3.5 text-[#FACC15]" />
                Text Color
              </label>
              <span className="font-mono text-xs font-bold text-[#FACC15]">{color.toUpperCase()}</span>
            </div>

            {/* Real-time Color Picker Row */}
            <div className="flex items-center gap-2">
              <label className="relative flex h-8.5 w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#3A3A3C] shadow-sm transition hover:scale-105">
                <input
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
                <span
                  className="h-5 w-5 rounded-full border border-white/60 shadow-xs"
                  style={{ backgroundColor: color }}
                />
              </label>

              <input
                type="text"
                className="h-8.5 flex-1 rounded-lg border border-[#2D2D2D] bg-[#131313] px-2.5 font-mono text-xs font-bold uppercase text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                value={color}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  if (!val.startsWith("#") && /^[0-9a-fA-F]{3,6}$/.test(val)) val = `#${val}`;
                  setColor(val);
                  if (/^#[0-9a-fA-F]{6}$/i.test(val) || /^#[0-9a-fA-F]{3}$/i.test(val)) {
                    applyStylePatch({ color: val, textColor: val });
                  }
                }}
              />
            </div>

            {/* Quick Swatches Grid */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-[#94A3B8]">Quick Palette Swatches</label>
              <div className="grid grid-cols-5 gap-1.5">
                {CURATED_SWATCHES.map((swatch) => {
                  const isSelected = color.toLowerCase() === swatch.toLowerCase();
                  return (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => handleColorChange(swatch)}
                      className={`relative flex h-7 items-center justify-center rounded-md border transition-all ${
                        isSelected
                          ? "border-[#FACC15] ring-2 ring-[#FACC15]/40 scale-105"
                          : "border-white/10 hover:border-white/40"
                      }`}
                      style={{ backgroundColor: swatch }}
                      title={swatch}
                    >
                      {isSelected && (
                        <Check
                          className={`h-3 w-3 ${swatch === "#FFFFFF" || swatch === "#FACC15" ? "text-black" : "text-white"}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Globally Button */}
            <button
              type="button"
              onClick={handleApplyGlobalColor}
              className="mt-1 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[#FACC15]/40 bg-[#FACC15]/10 text-xs font-semibold text-[#FACC15] transition hover:bg-[#FACC15]/20 hover:border-[#FACC15]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Apply Color Globally to All Templates
            </button>
          </div>
        )}

        {/* 4. Spacing & Shape Panel */}
        <div className="rounded-xl border border-[#262626] bg-[#181818] p-3 space-y-3">
          <label className="text-[11px] font-semibold text-[#F4F4F5] uppercase tracking-wider block border-b border-[#242424] pb-2">
            Spacing & Shape
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Padding</label>
              <input
                type="text"
                className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                value={selectedElementStyle.padding || ""}
                placeholder="e.g. 8px 16px"
                onChange={(e) => applyStylePatch({ padding: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Margin</label>
              <input
                type="text"
                className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                value={selectedElementStyle.margin || ""}
                placeholder="e.g. 0 0 12px 0"
                onChange={(e) => applyStylePatch({ margin: e.target.value })}
              />
            </div>
          </div>

          {(isButtonOrLink || isImage || tag === "div") && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#94A3B8]">Border Radius</label>
              <input
                type="text"
                className="h-8.5 w-full rounded-lg border border-[#2D2D2D] bg-[#131313] px-2 text-xs text-[#F4F4F5] outline-none transition focus:border-[#FACC15]"
                value={selectedElementStyle.borderRadius || ""}
                placeholder="e.g. 8px, 9999px"
                onChange={(e) => applyStylePatch({ borderRadius: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
