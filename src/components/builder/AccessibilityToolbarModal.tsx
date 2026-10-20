"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Check,
  ChevronDown,
  RotateCcw,
  Type,
  Pause,
  Sliders,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useBuilder } from "@/lib/builder/store";
import type { CustomEmbedItem } from "@/lib/builder/customEmbedsUtils";
import type { FloatingPosition, FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";

export interface AccessibilityToolbarModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedToEdit?: CustomEmbedItem | null;
  onSaved?: () => void;
}

export type AccessibilityToolbarStyle = "circle" | "square" | "text_button" | "minimal";

export const TOOLBAR_COLORS = [
  { value: "#2563EB", label: "Blue", isLight: false },
  { value: "#8B5CF6", label: "Purple", isLight: false },
  { value: "#10B981", label: "Green", isLight: false },
  { value: "#EF4444", label: "Red", isLight: false },
  { value: "#F97316", label: "Orange", isLight: false },
  { value: "#111111", label: "Black", isLight: false },
  { value: "#FFFFFF", label: "White", isLight: true },
];

export function getA11yHumanIconSvg(color: string = "currentColor", size: number = 22): string {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" style="display:block; flex-shrink:0;"><path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>`;
}

export function AccessibilityToolbarModal({
  isOpen,
  onClose,
  embedToEdit,
  onSaved,
}: AccessibilityToolbarModalProps) {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // 1. Toolbar Style & Color
  const [toolbarStyle, setToolbarStyle] = useState<AccessibilityToolbarStyle>("circle");
  const [toolbarColor, setToolbarColor] = useState<string>("#2563EB");

  // 2. Position
  const [position, setPosition] = useState<"bottom_right" | "bottom_left" | "middle_right" | "middle_left">("bottom_right");

  // 3. Visibility
  const [pageTargeting, setPageTargeting] = useState<"all" | "custom">("all");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showOnDesktop, setShowOnDesktop] = useState(true);
  const [showOnMobile, setShowOnMobile] = useState(true);
  const [showByDefault, setShowByDefault] = useState(false);

  // Submission State
  const [isSaving, setIsSaving] = useState(false);

  // Interactive Live Preview Accessibility Toggles
  const [previewPanelOpen, setPreviewPanelOpen] = useState(true);
  const [previewTextScale, setPreviewTextScale] = useState(100); // 100, 115, 130
  const [previewHighContrast, setPreviewHighContrast] = useState(false);
  const [previewReadableFont, setPreviewReadableFont] = useState(false);
  const [previewKeyboardNav, setPreviewKeyboardNav] = useState(false);
  const [previewStopAnimations, setPreviewStopAnimations] = useState(false);

  // Available project pages
  const projectPages = useMemo(() => project?.pages || [], [project]);

  // Load saved values if editing
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit && embedToEdit.floatingRecord) {
      const fw = embedToEdit.floatingRecord;
      const cfg = fw.config || {};

      setToolbarStyle(cfg.toolbarStyle || "circle");
      setToolbarColor(cfg.toolbarColor || cfg.accentColor || "#2563EB");

      const validPositions: Array<"bottom_right" | "bottom_left" | "middle_right" | "middle_left"> = [
        "bottom_right",
        "bottom_left",
        "middle_right",
        "middle_left",
      ];
      if (validPositions.includes(fw.position as any)) {
        setPosition(fw.position as any);
      } else {
        setPosition("bottom_right");
      }

      setPageTargeting(fw.pageTargeting === "custom" ? "custom" : "all");
      setSelectedPages(fw.targetedPages || []);
      setShowOnDesktop(fw.showOnDesktop !== false);
      setShowOnMobile(fw.showOnMobile !== false);
      setShowByDefault(Boolean(cfg.showByDefault || cfg.initialOpen));
    } else {
      // Defaults matching mockup
      setToolbarStyle("circle");
      setToolbarColor("#2563EB");
      setPosition("bottom_right");
      setPageTargeting("all");
      setSelectedPages(projectPages.map((p) => p.id));
      setShowOnDesktop(true);
      setShowOnMobile(true);
      setShowByDefault(false);
    }

    // Reset preview test states
    setPreviewPanelOpen(true);
    setPreviewTextScale(100);
    setPreviewHighContrast(false);
    setPreviewReadableFont(false);
    setPreviewKeyboardNav(false);
    setPreviewStopAnimations(false);
  }, [isOpen, embedToEdit, projectPages]);

  if (!isOpen) return null;

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  // Reset preview controls
  const handlePreviewReset = () => {
    setPreviewTextScale(100);
    setPreviewHighContrast(false);
    setPreviewReadableFont(false);
    setPreviewKeyboardNav(false);
    setPreviewStopAnimations(false);
    toast.info("Accessibility settings reset in preview");
  };

  // Save Plugin
  const handleSave = async () => {
    if (!showOnDesktop && !showOnMobile) {
      toast.error("Please enable at least one device (Desktop or Mobile)");
      return;
    }

    if (pageTargeting === "custom" && selectedPages.length === 0) {
      toast.error("Please select at least one page under Selected Pages");
      return;
    }

    setIsSaving(true);

    try {
      const fwId = embedToEdit?.floatingId || embedToEdit?.id || `fw-a11y-${nanoid(8)}`;

      const fwRecord: FloatingWidgetRecord = {
        id: fwId,
        type: "accessibility",
        name: "Accessibility Toolbar",
        enabled: true,
        position: position as FloatingPosition,
        offsetX: 20,
        offsetY: 20,
        showOnDesktop,
        showOnMobile,
        pageTargeting,
        targetedPages: pageTargeting === "custom" ? selectedPages : undefined,
        config: {
          toolbarStyle,
          toolbarColor,
          accentColor: toolbarColor,
          buttonSize: toolbarStyle === "circle" ? 52 : 48,
          showByDefault,
          initialOpen: showByDefault,
          features: {
            textResize: true,
            highContrast: true,
            readableFont: true,
            keyboardNav: true,
            stopAnimations: true,
            reset: true,
          },
        },
        createdAt: embedToEdit?.floatingRecord?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        const existing = cur.floatingWidgets || [];
        const idx = existing.findIndex((w) => w.id === fwRecord.id);
        const next =
          idx >= 0
            ? existing.map((w, i) => (i === idx ? fwRecord : w))
            : [...existing, fwRecord];

        return {
          projects: {
            ...s.projects,
            [cur.id]: { ...cur, floatingWidgets: next },
          },
        };
      });

      await persistWithStatus();
      toast.success("Accessibility Toolbar plugin saved successfully!");
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("[AccessibilityToolbarModal] Save error:", err);
      toast.error(err?.message || "Failed to save Accessibility Toolbar plugin");
    } finally {
      setIsSaving(false);
    }
  };

  const isWhiteButton = toolbarColor.toLowerCase() === "#ffffff";
  const iconTextColor = isWhiteButton ? "#111111" : "#FFFFFF";

  // Helper to render toolbar trigger button
  const renderToolbarTrigger = (style: AccessibilityToolbarStyle, color: string, isPreview = false) => {
    const isWhite = color.toLowerCase() === "#ffffff";
    const fg = isWhite ? "#111111" : "#FFFFFF";

    switch (style) {
      case "circle":
        return (
          <div
            style={{ backgroundColor: color, color: fg }}
            className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform active:scale-95"
          >
            <span
              dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg(fg, 22) }}
              className="flex items-center justify-center"
            />
          </div>
        );

      case "square":
        return (
          <div
            style={{ backgroundColor: color, color: fg }}
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-lg transition-transform active:scale-95"
          >
            <span
              dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg(fg, 22) }}
              className="flex items-center justify-center"
            />
          </div>
        );

      case "text_button":
        return (
          <div
            style={{ backgroundColor: color, color: fg }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-lg font-bold text-xs transition-transform active:scale-95"
          >
            <span
              dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg(fg, 18) }}
              className="flex items-center justify-center"
            />
            <span>Accessibility</span>
          </div>
        );

      case "minimal":
      default:
        return (
          <div
            style={{
              backgroundColor: "rgba(24, 24, 27, 0.85)",
              color: fg,
              borderColor: color,
            }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border shadow-lg backdrop-blur-md transition-transform active:scale-95"
          >
            <span
              dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg(fg, 20) }}
              className="flex items-center justify-center"
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] rounded-2xl bg-[#121214] text-[#F5F5F5] border border-[#27272A] shadow-2xl overflow-hidden">
        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[#222225] px-6 py-4 bg-[#151518]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md">
              <span
                dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg("#FFFFFF", 24) }}
                className="flex items-center justify-center"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {embedToEdit ? "Edit Accessibility Toolbar" : "Add Accessibility Toolbar"}
              </h2>
              <p className="text-xs text-zinc-400">
                Add an accessibility toolbar to your website. Help all users browse your website easily.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-[#222226] hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── MAIN CONTENT (2 COLUMNS) ────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* ── LEFT COLUMN: CONFIGURATION ─────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 bg-[#121214]">
            {/* 1. TOOLBAR STYLE SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  1
                </span>
                <h3 className="text-sm font-bold text-white">Toolbar Style</h3>
              </div>
              <p className="text-xs text-zinc-400">Choose a toolbar style and color.</p>

              {/* 4 Style Cards matching Mockup */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { key: "circle", label: "Circle Icon" },
                    { key: "square", label: "Square Icon" },
                    { key: "text_button", label: "Text Button" },
                    { key: "minimal", label: "Minimal" },
                  ] as const
                ).map((styleItem) => {
                  const isSelected = toolbarStyle === styleItem.key;
                  return (
                    <button
                      key={styleItem.key}
                      type="button"
                      onClick={() => setToolbarStyle(styleItem.key)}
                      className={`relative flex flex-col items-center justify-between p-3.5 rounded-xl transition ${
                        isSelected
                          ? "border-2 border-[#FACC15] bg-[#1E1E24] shadow-sm"
                          : "border border-[#2B2B30] bg-[#16161A] hover:border-zinc-500"
                      }`}
                    >
                      {/* Check badge on selected */}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-xs bg-[#FACC15] text-zinc-950">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}

                      {/* Icon preview */}
                      <div className="my-2 flex items-center justify-center h-12">
                        {renderToolbarTrigger(styleItem.key, toolbarColor)}
                      </div>

                      <span
                        className={`text-xs font-semibold mt-1 ${
                          isSelected ? "text-[#FACC15]" : "text-zinc-300"
                        }`}
                      >
                        {styleItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Toolbar Color Swatches */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-zinc-300 mb-2.5">Toolbar Color</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {TOOLBAR_COLORS.map((swatch) => {
                    const isSelected = toolbarColor.toLowerCase() === swatch.value.toLowerCase();
                    return (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => setToolbarColor(swatch.value)}
                        title={swatch.label}
                        style={{ backgroundColor: swatch.value }}
                        className={`h-7 w-7 rounded-full transition-transform active:scale-95 ${
                          isSelected
                            ? "ring-2 ring-[#FACC15] ring-offset-2 ring-offset-[#121214] scale-110"
                            : "border border-zinc-700/60 hover:scale-105"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. POSITION SECTION */}
            <div className="space-y-4 pt-2 border-t border-[#1F1F24]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  2
                </span>
                <h3 className="text-sm font-bold text-white">Position</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Choose where to show the accessibility toolbar.
              </p>

              {/* 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { key: "bottom_right", label: "Bottom Right" },
                    { key: "bottom_left", label: "Bottom Left" },
                    { key: "middle_right", label: "Middle Right" },
                    { key: "middle_left", label: "Middle Left" },
                  ] as const
                ).map((posItem) => {
                  const isSelected = position === posItem.key;
                  return (
                    <button
                      key={posItem.key}
                      type="button"
                      onClick={() => setPosition(posItem.key)}
                      className={`relative flex flex-col items-center justify-between p-3 rounded-xl transition ${
                        isSelected
                          ? "border-2 border-[#FACC15] bg-[#1E1E24] shadow-sm"
                          : "border border-[#2B2B30] bg-[#16161A] hover:border-zinc-500"
                      }`}
                    >
                      {/* Check badge on selected */}
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-xs bg-[#FACC15] text-zinc-950">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}

                      {/* Miniature screen diagram with blue icon */}
                      <div className="h-14 w-full max-w-[100px] rounded-md bg-[#0D0D10] border border-[#2B2B32] relative p-1 mb-2">
                        <div className="h-1.5 w-full bg-[#1F1F26] rounded-xs mb-1" />
                        <div
                          style={{ backgroundColor: toolbarColor }}
                          className={`absolute flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)] ${
                            posItem.key === "bottom_right"
                              ? "bottom-1.5 right-1.5 h-3.5 w-3.5"
                              : posItem.key === "bottom_left"
                              ? "bottom-1.5 left-1.5 h-3.5 w-3.5"
                              : posItem.key === "middle_right"
                              ? "top-1/2 -translate-y-1/2 right-1.5 h-3.5 w-3.5"
                              : "top-1/2 -translate-y-1/2 left-1.5 h-3.5 w-3.5"
                          }`}
                        >
                          <span
                            dangerouslySetInnerHTML={{ __html: getA11yHumanIconSvg("#FFFFFF", 8) }}
                            className="flex items-center justify-center"
                          />
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-[#FACC15]" : "text-zinc-300"
                        }`}
                      >
                        {posItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. VISIBILITY SECTION */}
            <div className="space-y-4 pt-2 border-t border-[#1F1F24]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FACC15] text-zinc-950 text-xs font-black">
                  3
                </span>
                <h3 className="text-sm font-bold text-white">Visibility</h3>
              </div>
              <p className="text-xs text-zinc-400">Choose where to display the toolbar.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Show On: All Pages vs Selected Pages */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-zinc-300 mb-1">Show On</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="radio"
                      name="a11yPageTargeting"
                      checked={pageTargeting === "all"}
                      onChange={() => setPageTargeting("all")}
                      className="accent-[#FACC15] h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>All Pages</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="radio"
                      name="a11yPageTargeting"
                      checked={pageTargeting === "custom"}
                      onChange={() => {
                        setPageTargeting("custom");
                        if (selectedPages.length === 0 && projectPages.length > 0) {
                          setSelectedPages([projectPages[0].id]);
                        }
                      }}
                      className="accent-[#FACC15] h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Selected Pages</span>
                  </label>

                  {pageTargeting === "custom" && (
                    <div className="mt-2 p-2 rounded-lg bg-[#18181C] border border-[#2B2B32] max-h-32 overflow-y-auto space-y-1.5 scrollbar-thin">
                      {projectPages.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 text-[11px] text-zinc-300 cursor-pointer hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPages.includes(p.id)}
                            onChange={() => togglePageSelection(p.id)}
                            className="accent-[#FACC15] h-3 w-3 rounded cursor-pointer"
                          />
                          <span className="truncate">{p.name || p.slug || "Untitled Page"}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Show on Devices */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-zinc-300 mb-1">
                    Show on Devices
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={showOnDesktop}
                      onChange={(e) => setShowOnDesktop(e.target.checked)}
                      className="accent-[#FACC15] h-3.5 w-3.5 rounded cursor-pointer"
                    />
                    <span>Desktop</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                    <input
                      type="checkbox"
                      checked={showOnMobile}
                      onChange={(e) => setShowOnMobile(e.target.checked)}
                      className="accent-[#FACC15] h-3.5 w-3.5 rounded cursor-pointer"
                    />
                    <span>Mobile</span>
                  </label>
                </div>

                {/* Auto Show / Hide */}
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-zinc-300 mb-1">
                    Auto Show / Hide
                  </span>
                  <div className="flex items-center gap-2.5">
                    <Switch
                      checked={showByDefault}
                      onCheckedChange={setShowByDefault}
                      className="data-[state=checked]:bg-[#2563EB]"
                    />
                    <span className="text-xs text-zinc-200">Show by default</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Users can open/close the toolbar anytime.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: LIVE WEBSITE PREVIEW ─────────────────────────── */}
          <div className="w-full lg:w-[480px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#222225] bg-[#0E0E10] p-6 flex flex-col justify-between">
            <div>
              {/* Realistic Browser Window Frame */}
              <div className="mx-auto rounded-xl border border-[#2B2B32] bg-[#141418] shadow-2xl overflow-hidden w-full max-w-[440px]">
                {/* Browser Address Bar */}
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A20] border-b border-[#25252C]">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
                    <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
                    <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="flex-1 rounded-md bg-[#0D0D10] px-2 py-0.5 text-[10px] text-zinc-400 truncate text-center font-mono">
                    https://yourwebsite.com
                  </div>
                </div>

                {/* Simulated Website Canvas */}
                <div
                  style={{
                    fontSize: `${previewTextScale}%`,
                    filter: previewHighContrast ? "contrast(180%) brightness(110%)" : "none",
                    fontFamily: previewReadableFont
                      ? "Arial, Helvetica, sans-serif"
                      : "inherit",
                    transition: previewStopAnimations ? "none" : "all 0.2s ease",
                  }}
                  className={`relative h-[390px] p-4 flex flex-col justify-between overflow-hidden select-none ${
                    previewHighContrast
                      ? "bg-black text-yellow-300"
                      : "bg-gradient-to-b from-[#1C1C24] via-[#121216] to-[#0A0A0C] text-white"
                  } ${previewKeyboardNav ? "ring-2 ring-yellow-400 ring-inset" : ""}`}
                >
                  {/* Website Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black tracking-wider text-white">LOGO</span>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-300 font-medium">
                      <span className={previewKeyboardNav ? "outline outline-1 outline-yellow-400 px-1" : ""}>
                        Home
                      </span>
                      <span className={previewKeyboardNav ? "outline outline-1 outline-yellow-400 px-1" : ""}>
                        About
                      </span>
                      <span className={previewKeyboardNav ? "outline outline-1 outline-yellow-400 px-1" : ""}>
                        Services
                      </span>
                      <span className={previewKeyboardNav ? "outline outline-1 outline-yellow-400 px-1" : ""}>
                        Contact
                      </span>
                      <span className="rounded-md bg-[#FACC15] px-2 py-0.5 font-bold text-zinc-950 text-[9px]">
                        Get Started
                      </span>
                    </div>
                  </div>

                  {/* Website Hero Section */}
                  <div className="my-auto space-y-2 text-center px-2">
                    <h4
                      style={{ fontSize: `${(18 * previewTextScale) / 100}px` }}
                      className="font-black text-white leading-tight"
                    >
                      Build Your Dream Website
                    </h4>
                    <p
                      style={{ fontSize: `${(11 * previewTextScale) / 100}px` }}
                      className="text-zinc-400 line-clamp-2 max-w-[260px] mx-auto"
                    >
                      Create stunning websites with our easy to use builder. No coding required.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        className={`rounded-lg bg-[#FACC15] px-4 py-1.5 text-xs font-bold text-zinc-950 shadow-sm ${
                          previewKeyboardNav ? "ring-2 ring-black" : ""
                        }`}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>

                  {/* ── THE LIVE FLOATING TRIGGER BUTTON IN PREVIEW ── */}
                  <div
                    onClick={() => setPreviewPanelOpen(!previewPanelOpen)}
                    title="Click to toggle Accessibility Tools"
                    className={`absolute z-30 cursor-pointer pointer-events-auto transition-all duration-300 ${
                      position === "bottom_right"
                        ? "bottom-4 right-4"
                        : position === "bottom_left"
                        ? "bottom-4 left-4"
                        : position === "middle_right"
                        ? "top-1/2 -translate-y-1/2 right-4"
                        : "top-1/2 -translate-y-1/2 left-4"
                    }`}
                  >
                    {renderToolbarTrigger(toolbarStyle, toolbarColor, true)}
                  </div>

                  {/* ── THE INTERACTIVE ACCESSIBILITY TOOLS FLYOUT PANEL ── */}
                  {previewPanelOpen && (
                    <div
                      className={`absolute z-40 w-[210px] rounded-xl bg-white text-zinc-900 shadow-2xl p-2.5 border border-zinc-200 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 ${
                        position === "bottom_right"
                          ? "bottom-16 right-3"
                          : position === "bottom_left"
                          ? "bottom-16 left-3"
                          : position === "middle_right"
                          ? "top-1/2 -translate-y-1/2 right-16"
                          : "top-1/2 -translate-y-1/2 left-16"
                      }`}
                    >
                      {/* Flyout Header */}
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-100">
                        <span className="text-[11px] font-bold text-zinc-900">
                          Accessibility Tools
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewPanelOpen(false);
                          }}
                          className="h-4 w-4 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* 7 Actual Working Tools matching Mockup */}
                      <div className="space-y-1 text-[10px]">
                        {/* 1. Increase Text Size */}
                        <button
                          type="button"
                          onClick={() => setPreviewTextScale((s) => Math.min(145, s + 15))}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left ${
                            previewTextScale > 100
                              ? "bg-blue-50 text-blue-700 font-bold"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <span className="font-bold">A+</span>
                          <span>Increase Text Size</span>
                        </button>

                        {/* 2. Decrease Text Size */}
                        <button
                          type="button"
                          onClick={() => setPreviewTextScale((s) => Math.max(85, s - 15))}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left ${
                            previewTextScale < 100
                              ? "bg-blue-50 text-blue-700 font-bold"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <span className="font-bold">A-</span>
                          <span>Decrease Text Size</span>
                        </button>

                        {/* 3. High Contrast */}
                        <button
                          type="button"
                          onClick={() => setPreviewHighContrast(!previewHighContrast)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left ${
                            previewHighContrast
                              ? "bg-zinc-900 text-yellow-300 font-bold"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <span className="font-bold">◐</span>
                          <span>High Contrast</span>
                        </button>

                        {/* 4. Readable Font */}
                        <button
                          type="button"
                          onClick={() => setPreviewReadableFont(!previewReadableFont)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left ${
                            previewReadableFont
                              ? "bg-blue-50 text-blue-700 font-bold font-sans"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <span className="font-bold">TT</span>
                          <span>Readable Font</span>
                        </button>

                        {/* 5. Keyboard Navigation */}
                        <button
                          type="button"
                          onClick={() => setPreviewKeyboardNav(!previewKeyboardNav)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left ${
                            previewKeyboardNav
                              ? "bg-blue-50 text-blue-700 font-bold"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <span>⌨</span>
                          <span>Keyboard Navigation</span>
                        </button>

                        {/* 6. Stop Animations */}
                        <button
                          type="button"
                          onClick={() => setPreviewStopAnimations(!previewStopAnimations)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition text-left ${
                            previewStopAnimations
                              ? "bg-blue-50 text-blue-700 font-bold"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                          }`}
                        >
                          <span>⏸</span>
                          <span>Stop Animations</span>
                        </button>

                        {/* 7. Reset Settings */}
                        <button
                          type="button"
                          onClick={handlePreviewReset}
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-600 transition text-left font-medium"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Reset Settings</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Note on live behavior */}
            <div className="mt-4 p-3 rounded-xl bg-[#141418] border border-[#222228] text-[11px] text-zinc-400">
              <span className="font-semibold text-zinc-200">Interactive Preview:</span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Click any tool inside the preview panel above to test font scaling, high contrast, readable font, and animation freezing in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-[#222225] px-6 py-4 bg-[#151518]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl border border-zinc-700 bg-transparent text-xs font-bold text-white hover:bg-zinc-800 transition active:scale-95"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-zinc-950 text-xs font-extrabold shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving Plugin..." : "Save Plugin"}
          </button>
        </div>
      </div>
    </div>
  );
}
