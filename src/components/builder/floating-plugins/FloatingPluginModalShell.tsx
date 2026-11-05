"use client";

import React from "react";
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
  iconBg = "bg-[#7137D8]",
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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] rounded-2xl bg-white text-[#111827] border border-[#E2E8F0] shadow-2xl overflow-hidden">
        {/* ── TOP HEADER ──────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Squircle Icon */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${iconBg}`}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight truncate">
                {title}
              </h2>
              <p className="text-xs text-[#64748B] truncate">
                {description}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#111827] transition shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── TWO-COLUMN BODY ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row min-h-0">
          {/* ── LEFT COLUMN: CONFIGURATION AREA ───────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin bg-white text-[#111827]">
            {children}
          </div>

          {/* ── RIGHT COLUMN: LIVE WEBSITE PREVIEW ─────────────────────────────── */}
          <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] bg-[#F8FAFC] p-5 sm:p-6 flex flex-col justify-start overflow-y-auto scrollbar-thin">
            {/* Preview Header with Desktop / Mobile Toggles */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-[#111827] tracking-wide">
                Live Preview
              </span>

              {/* Viewport switch */}
              <div className="flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1 border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => onPreviewModeChange("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    previewMode === "desktop"
                      ? "bg-white text-[#7137D8] shadow-xs"
                      : "text-[#64748B] hover:text-[#111827]"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </button>

                <button
                  type="button"
                  onClick={() => onPreviewModeChange("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    previewMode === "mobile"
                      ? "bg-white text-[#7137D8] shadow-xs"
                      : "text-[#64748B] hover:text-[#111827]"
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
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4 bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#334155] hover:text-[#111827] hover:bg-[#F8FAFC] transition disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center justify-center min-w-[120px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving..." : saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
