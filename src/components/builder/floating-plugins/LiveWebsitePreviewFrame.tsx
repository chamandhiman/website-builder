"use client";

import React from "react";
import { GraduationCap, ChevronDown, Menu, ArrowRight } from "lucide-react";
import type { FloatingPosition } from "@/lib/builder/floatingWidgetsTypes";

export interface LiveWebsitePreviewFrameProps {
  mode: "desktop" | "mobile";
  position?: FloatingPosition | "center_modal";
  showOnDesktop?: boolean;
  showOnMobile?: boolean;
  emptyWarning?: string;
  children: React.ReactNode;
}

export function LiveWebsitePreviewFrame({
  mode,
  position = "bottom_right",
  showOnDesktop = true,
  showOnMobile = true,
  emptyWarning,
  children,
}: LiveWebsitePreviewFrameProps) {
  const isHiddenOnCurrentDevice =
    (mode === "desktop" && !showOnDesktop) || (mode === "mobile" && !showOnMobile);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom_left":
        return "bottom-4 left-4 items-start";
      case "middle_right":
        return "top-1/2 -translate-y-1/2 right-4 items-end";
      case "middle_left":
        return "top-1/2 -translate-y-1/2 left-4 items-start";
      case "top_right":
        return "top-16 right-4 items-end";
      case "top_left":
        return "top-16 left-4 items-start";
      case "top_fixed":
        return "top-0 left-0 right-0 w-full";
      case "bottom_fixed":
        return "bottom-0 left-0 right-0 w-full";
      case "center_modal":
        return "inset-0 flex items-center justify-center p-4";
      case "bottom_right":
      default:
        return "bottom-4 right-4 items-end";
    }
  };

  const isFixedBanner = position === "top_fixed" || position === "bottom_fixed";
  const isCenterModal = position === "center_modal";

  return (
    <div className="w-full flex justify-center items-center">
      {mode === "desktop" ? (
        /* ── DESKTOP FRAME ──────────────────────────────────────────────────── */
        <div className="w-full max-w-[480px] xl:max-w-[500px] rounded-2xl border border-zinc-800 bg-white text-zinc-900 shadow-2xl overflow-hidden relative select-none">
          {/* WebToolOcean Website Navigation Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-white/95 backdrop-blur-xs">
            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FACC15] text-zinc-950 shadow-xs">
                <GraduationCap className="h-4 w-4 stroke-[2.5]" />
              </span>
              <span className="font-extrabold text-sm tracking-tight text-[#0F172A]">
                WebTool<span className="text-[#0284C7]">Ocean</span>
              </span>
            </div>

            {/* Nav links */}
            <div className="hidden sm:flex items-center gap-3.5 text-[11px] font-semibold text-zinc-600">
              <span className="hover:text-zinc-900 cursor-pointer">Home</span>
              <span className="flex items-center gap-0.5 hover:text-zinc-900 cursor-pointer">
                Tools <ChevronDown className="h-3 w-3 text-zinc-400" />
              </span>
              <span className="hover:text-zinc-900 cursor-pointer">Blog</span>
              <span className="hover:text-zinc-900 cursor-pointer">About</span>
            </div>

            {/* Blue Contact Us Button */}
            <button
              type="button"
              className="rounded-full bg-[#0284C7] hover:bg-[#0369A1] px-3.5 py-1 text-[11px] font-bold text-white shadow-xs transition"
            >
              Contact Us
            </button>
          </div>

          {/* Website Hero Section with Laptop Graphic */}
          <div className="relative min-h-[320px] bg-gradient-to-br from-[#F8FAFC] via-[#EEF2F6] to-[#E0E7FF]/40 p-6 flex items-center justify-between overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-blue-100/60 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-indigo-100/60 blur-2xl pointer-events-none" />

            {/* Hero Left Copy */}
            <div className="relative z-10 max-w-[210px] space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight tracking-tight">
                Build Your <br />
                <span className="text-[#2563EB]">Dream Website</span>
              </h3>
              <p className="text-[11px] font-medium text-zinc-500">
                Simple. Fast. Powerful.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-[#0284C7] px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#0369A1] transition"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Hero Right: Laptop Graphic */}
            <div className="relative z-0 hidden sm:block w-[190px]">
              <div className="rounded-xl border border-zinc-300 bg-white p-2 shadow-xl">
                <div className="h-24 rounded-lg bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 p-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-12 rounded-full bg-blue-200" />
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-8 rounded bg-white shadow-xs p-1">
                      <div className="h-1.5 w-8 bg-zinc-200 rounded-full" />
                    </div>
                    <div className="h-8 rounded bg-blue-500/10 p-1 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-blue-600">Active</span>
                    </div>
                  </div>
                </div>
                {/* Laptop Base */}
                <div className="mt-1 h-1.5 rounded-b-md bg-zinc-300 mx-auto w-[110%]" />
              </div>
            </div>

            {/* ── LIVE FLOATING WIDGET SLOT ─────────────────────────────────── */}
            <div
              className={`absolute z-20 flex flex-col pointer-events-auto transition-all duration-300 ${getPositionClasses()} ${
                isFixedBanner || isCenterModal ? "" : ""
              }`}
            >
              {isHiddenOnCurrentDevice ? (
                <div className="rounded-xl bg-zinc-900/90 border border-zinc-700 px-3 py-1.5 text-[11px] font-semibold text-zinc-300 shadow-lg backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Hidden on Desktop</span>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Empty warning overlay if required info is not provided */}
            {emptyWarning && !isHiddenOnCurrentDevice && (
              <div className="absolute inset-x-3 bottom-3 z-30 rounded-xl bg-amber-500/95 backdrop-blur-xs px-3 py-1.5 text-center text-[10px] font-bold text-zinc-950 shadow-md">
                {emptyWarning}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── MOBILE PHONE FRAME ─────────────────────────────────────────────── */
        <div className="w-[280px] sm:w-[300px] rounded-[36px] border-4 border-zinc-700 bg-white text-zinc-900 shadow-2xl overflow-hidden relative select-none">
          {/* Phone Top Speaker & Camera Notch */}
          <div className="h-5 bg-zinc-900 flex items-center justify-center relative">
            <div className="h-1 w-12 bg-zinc-600 rounded-full" />
            <div className="absolute right-6 h-1.5 w-1.5 bg-zinc-700 rounded-full" />
          </div>

          {/* WebToolOcean Mobile Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-100 bg-white">
            <div className="flex items-center gap-1">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#FACC15] text-zinc-950">
                <GraduationCap className="h-3 w-3 stroke-[2.5]" />
              </span>
              <span className="font-extrabold text-xs tracking-tight text-[#0F172A]">
                WebTool<span className="text-[#0284C7]">Ocean</span>
              </span>
            </div>
            <Menu className="h-4 w-4 text-zinc-700" />
          </div>

          {/* Mobile Hero Content */}
          <div className="relative h-[380px] bg-gradient-to-br from-[#F8FAFC] via-[#EEF2F6] to-[#E0E7FF]/40 p-4 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2 text-center pt-3">
              <h3 className="text-lg font-black text-[#0F172A] leading-tight">
                Build Your <br />
                <span className="text-[#2563EB]">Dream Website</span>
              </h3>
              <p className="text-[10px] font-medium text-zinc-500">
                Simple. Fast. Powerful.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0284C7] px-3.5 py-1 text-[10px] font-bold text-white shadow-xs">
                  <span>Get Started</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>

            {/* Compact Graphic on Mobile */}
            <div className="mx-auto w-[180px] rounded-lg border border-zinc-200 bg-white p-2 shadow-sm my-auto">
              <div className="h-14 rounded bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 p-1.5 flex flex-col justify-between">
                <div className="h-1.5 w-8 rounded-full bg-blue-200" />
                <div className="h-4 rounded bg-blue-500/10 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-blue-600">Mobile Ready</span>
                </div>
              </div>
            </div>

            {/* ── LIVE FLOATING WIDGET SLOT ─────────────────────────────────── */}
            <div
              className={`absolute z-20 flex flex-col pointer-events-auto transition-all duration-300 ${getPositionClasses()}`}
            >
              {isHiddenOnCurrentDevice ? (
                <div className="rounded-xl bg-zinc-900/90 border border-zinc-700 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 shadow-lg backdrop-blur-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Hidden on Mobile</span>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Empty warning overlay if required info is not provided */}
            {emptyWarning && !isHiddenOnCurrentDevice && (
              <div className="absolute inset-x-2 bottom-2 z-30 rounded-lg bg-amber-500/95 backdrop-blur-xs px-2 py-1 text-center text-[9px] font-bold text-zinc-950 shadow-md">
                {emptyWarning}
              </div>
            )}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-4 bg-zinc-900 flex items-center justify-center">
            <div className="h-1 w-20 bg-zinc-600 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
