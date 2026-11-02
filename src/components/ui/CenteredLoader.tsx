import React, { type ReactNode } from "react";

export interface CenteredLoaderProps {
  /** Main loading title (defaults to "Getting things ready...") */
  message?: ReactNode;
  /** Supporting message (defaults to "Please wait a moment while we prepare your workspace.") */
  details?: ReactNode;
  /** Optional deterministic progress 0–100. If omitted, a smooth indeterminate bar is displayed */
  progress?: number;
  /** Additional wrapper CSS classes */
  className?: string;
}

export function CenteredLoader({
  message = "Getting things ready...",
  details = "Please wait a moment while we prepare your workspace.",
  progress,
  className = "",
}: CenteredLoaderProps) {
  const hasProgress = typeof progress === "number" && !Number.isNaN(progress);
  const clampedProgress = hasProgress ? Math.min(100, Math.max(0, progress)) : 0;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex min-h-screen w-full items-center justify-center overflow-hidden bg-white text-[#111827] select-none ${className}`}
    >
      <style>{`
        /* Smooth continuous 3D Y-axis flip with elegant pause */
        @keyframes wto-logo-flip {
          0% {
            transform: perspective(600px) rotateY(0deg);
          }
          /* One complete flip in ~1.35 seconds (40% of 3.4s cycle) */
          40% {
            transform: perspective(600px) rotateY(360deg);
          }
          /* Pause/rest stationary for ~2 seconds before next flip */
          100% {
            transform: perspective(600px) rotateY(360deg);
          }
        }

        .wto-logo-flip-icon {
          transform-style: preserve-3d;
          backface-visibility: visible;
          will-change: transform;
          animation: wto-logo-flip 3.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        /* Smooth indeterminate progress slide */
        @keyframes wto-indeterminate-slide {
          0% {
            left: -35%;
            width: 35%;
          }
          50% {
            left: 30%;
            width: 50%;
          }
          100% {
            left: 100%;
            width: 35%;
          }
        }

        .wto-indeterminate-bar {
          position: absolute;
          top: 0;
          bottom: 0;
          border-radius: 9999px;
          animation: wto-indeterminate-slide 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* Respect prefers-reduced-motion: disable 3D flip and sliding */
        @media (prefers-reduced-motion: reduce) {
          .wto-logo-flip-icon {
            animation: none !important;
            transform: none !important;
          }
          .wto-indeterminate-bar {
            animation: none !important;
            left: 0 !important;
            width: 60% !important;
          }
        }
      `}</style>

      {/* Center Branding & Loading Status Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full -mt-6 sm:-mt-10">
        
        {/* Soft squircle icon card with delicate lavender shadow */}
        <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-[26px] sm:rounded-[30px] bg-white border border-[#EDE9FE]/90 shadow-[0_16px_36px_-6px_rgba(113,55,216,0.18),0_6px_18px_-4px_rgba(213,43,189,0.10)] mb-6 sm:mb-7">
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center" style={{ perspective: "600px" }}>
            <img
              src="/logo-icon.png"
              alt="Website Builder Icon"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain wto-logo-flip-icon pointer-events-none drop-shadow-xs"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-3xl sm:text-[38px] font-extrabold tracking-tight text-[#0F172A] leading-tight">
          Website{" "}
          <span className="bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#FF6B2B] bg-clip-text text-transparent">
            Builder
          </span>
        </h1>
        <p className="mt-1.5 text-sm sm:text-base font-medium text-[#64748B] tracking-wide">
          by WebToolOcean
        </p>

        {/* Slim horizontal progress bar */}
        <div className="mt-8 sm:mt-9 w-full max-w-[340px] sm:max-w-[380px] h-2 sm:h-2.5 rounded-full bg-[#EDE9FE] overflow-hidden relative shadow-inner">
          {hasProgress ? (
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#F43F5E] transition-all duration-300 ease-out"
              style={{ width: `${clampedProgress}%` }}
            />
          ) : (
            <div className="wto-indeterminate-bar rounded-full bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#F43F5E]" />
          )}
        </div>

        {/* Loading Headings */}
        <h2 className="mt-7 sm:mt-8 text-xl sm:text-[22px] font-bold text-[#111827] tracking-tight">
          {message}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#64748B] max-w-sm font-normal leading-relaxed">
          {details}
        </p>
      </div>

      {/* Pastel lavender & pink bottom wave shapes (matching reference mockup) */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-[120px] sm:h-[180px] md:h-[220px]"
          viewBox="0 0 1440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Layer 1: Soft blush & lavender gradient */}
            <linearGradient id="wto-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.65" />
              <stop offset="45%" stopColor="#F3E8FF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.75" />
            </linearGradient>

            {/* Layer 2: Soft lavender & violet gradient */}
            <linearGradient id="wto-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.75" />
              <stop offset="55%" stopColor="#FCE7F3" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Back wave: rises softly on the left and swells into the right */}
          <path
            d="M0,140 C280,70 520,210 820,190 C1120,170 1280,95 1440,70 L1440,260 L0,260 Z"
            fill="url(#wto-wave-grad-1)"
          />

          {/* Front wave: gentle flowing curves with soft pink and lavender overlap */}
          <path
            d="M0,180 C260,110 480,240 760,220 C1060,200 1260,130 1440,110 L1440,260 L0,260 Z"
            fill="url(#wto-wave-grad-2)"
          />
        </svg>
      </div>
    </div>
  );
}
