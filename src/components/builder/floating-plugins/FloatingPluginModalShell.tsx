"use client";

import React, { useState } from "react";
import { X, Monitor, Smartphone } from "lucide-react";

export interface FloatingPluginModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  description: string;
  previewMode: "desktop" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "mobile") => void;
  renderPreview: (mode: "desktop" | "mobile") => React.ReactNode;
  onSave: () => void | Promise<void>;
  isSaving?: boolean;
  saveButtonText?: string;
  children: React.ReactNode;
}

export function FloatingPluginModalShell({
  isOpen,
  onClose,
  icon,
  iconBg = "bg-[#7C3AED]",
  title,
  description,
  previewMode,
  onPreviewModeChange,
  renderPreview,
  onSave,
  isSaving = false,
  saveButtonText = "Save Plugin",
  children,
}: FloatingPluginModalShellProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] rounded-2xl bg-[#0D0D10] text-[#F5F5F5] border border-[#27272A] shadow-2xl overflow-hidden">
        {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#222225] px-6 py-4 bg-[#141417]">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Squircle Icon */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${iconBg}`}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {title}
              </h2>
              <p className="text-xs text-zinc-400 truncate">
                {description}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-[#222226] hover:text-white transition shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── TWO-COLUMN BODY ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row min-h-0">
          {/* ── LEFT COLUMN: CONFIGURATION AREA ───────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 bg-[#121215]">
            {children}
          </div>

          {/* ── RIGHT COLUMN: LIVE WEBSITE PREVIEW ─────────────────────────────── */}
          <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#222225] bg-[#0A0A0C] p-5 sm:p-6 flex flex-col justify-start overflow-y-auto scrollbar-thin">
            {/* Preview Header with Desktop / Mobile Toggles */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white tracking-wide">
                Live Preview
              </span>

              {/* Viewport switch matching mockup */}
              <div className="flex items-center gap-1 rounded-lg bg-[#18181C] p-1 border border-[#27272A]">
                <button
                  type="button"
                  onClick={() => onPreviewModeChange("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition ${
                    previewMode === "desktop"
                      ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPreviewModeChange("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition ${
                    previewMode === "mobile"
                      ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Preview Frame Canvas */}
            <div className="flex-1 flex items-center justify-center min-h-[360px]">
              {renderPreview(previewMode)}
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ──────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#222225] px-6 py-4 bg-[#141417]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-[#2E2E33] bg-[#1A1A1E] text-xs font-semibold text-zinc-300 hover:text-white hover:bg-[#222226] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center justify-center min-w-[120px] px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-xs font-bold text-zinc-950 shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
