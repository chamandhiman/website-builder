import React from "react";
import type { AssistantState } from "@/services/voiceAssistant/voiceTypes";
import { Mic, MicOff, Sparkles, Check, AlertTriangle, Loader2 } from "lucide-react";

interface SiriOrbProps {
  state: AssistantState;
  onClick: () => void;
  size?: number; // diameter in pixels
  className?: string;
  isListening?: boolean;
}

export const SiriOrb: React.FC<SiriOrbProps> = ({
  state,
  onClick,
  size = 56,
  className = "",
  isListening = false,
}) => {
  // Determine state-specific glow and gradient styling
  const getStateColors = () => {
    switch (state) {
      case "listening":
      case "resuming":
        return {
          glow: "from-cyan-500/80 via-blue-600/80 to-fuchsia-600/80",
          ring: "border-cyan-400/60 shadow-[0_0_35px_rgba(56,189,248,0.65)]",
          core: "from-blue-500 via-indigo-600 to-purple-600",
          speed: "animate-spin-slow",
          pulsing: "animate-pulse",
        };
      case "speaking":
        return {
          glow: "from-fuchsia-500/80 via-pink-600/80 to-purple-600/80",
          ring: "border-fuchsia-400/60 shadow-[0_0_35px_rgba(217,70,239,0.7)]",
          core: "from-fuchsia-600 via-purple-700 to-pink-600",
          speed: "animate-pulse",
          pulsing: "animate-pulse",
        };
      case "observing":
      case "planning":
      case "executing":
        return {
          glow: "from-indigo-500/80 via-purple-600/80 to-pink-500/80",
          ring: "border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.7)]",
          core: "from-indigo-600 via-purple-700 to-pink-600",
          speed: "animate-spin",
          pulsing: "animate-ping-slow",
        };
      case "paused":
        return {
          glow: "from-amber-500/60 via-yellow-600/60 to-orange-500/60",
          ring: "border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]",
          core: "from-amber-700 via-orange-800 to-yellow-700",
          speed: "animate-none",
          pulsing: "animate-none",
        };
      case "confirming":
        return {
          glow: "from-amber-500/80 via-orange-600/80 to-yellow-500/80",
          ring: "border-amber-400/70 shadow-[0_0_35px_rgba(245,158,11,0.65)]",
          core: "from-amber-600 via-orange-700 to-yellow-600",
          speed: "animate-pulse",
          pulsing: "animate-pulse",
        };
      case "success":
        return {
          glow: "from-emerald-400/80 via-teal-500/80 to-cyan-500/80",
          ring: "border-emerald-400/70 shadow-[0_0_35px_rgba(16,185,129,0.7)]",
          core: "from-emerald-500 via-teal-600 to-cyan-600",
          speed: "animate-none",
          pulsing: "animate-bounce-short",
        };
      case "error":
        return {
          glow: "from-rose-500/80 via-red-600/80 to-orange-500/80",
          ring: "border-rose-400/70 shadow-[0_0_35px_rgba(244,63,94,0.7)]",
          core: "from-rose-600 via-red-700 to-orange-600",
          speed: "animate-none",
          pulsing: "animate-pulse",
        };
      case "idle":
      default:
        return {
          glow: "from-blue-500/50 via-purple-600/50 to-pink-500/50",
          ring: "border-indigo-400/40 shadow-[0_0_22px_rgba(99,102,241,0.45)]",
          core: "from-blue-600 via-indigo-700 to-purple-800",
          speed: "animate-none",
          pulsing: "animate-none",
        };
    }
  };

  const colors = getStateColors();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle Siri Voice Assistant (Alt+V)"
      title="Siri Voice Assistant (Alt + V)"
      className={`group relative flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-108 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-black ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient blur aura */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr ${colors.glow} blur-xl transition-all duration-700 group-hover:blur-2xl ${
          state === "listening" ? "scale-130 opacity-90" : "scale-100 opacity-60"
        }`}
      />

      {/* Orbiting Chromatic Aura Ring */}
      <div
        className={`absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-500 to-cyan-400 opacity-70 blur-sm transition-all duration-500 ${
          state === "listening" || state === "planning" || state === "executing" || state === "observing" ? "animate-spin-slow opacity-100" : "opacity-40"
        }`}
      />

      {/* Core orb body with multi-layer organic mesh gradient */}
      <div
        className={`relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-tr ${colors.core} shadow-inner transition-all duration-300`}
      >
        {/* Internal fluid gradient highlights */}
        <div
          className={`absolute -top-1/2 -left-1/2 h-[200%] w-[200%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.45),transparent_60%)] pointer-events-none transition-transform duration-700 ${
            state === "listening" ? "animate-spin-reverse-slow" : ""
          }`}
        />

        {/* State Icon Indicator */}
        <div className="relative z-20 flex items-center justify-center text-white drop-shadow-md">
          {state === "listening" || state === "resuming" ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute h-8 w-8 animate-ping rounded-full bg-white/40" />
              <Mic className="h-6 w-6 text-white drop-shadow" />
            </div>
          ) : state === "speaking" ? (
            <Sparkles className="h-6 w-6 text-white drop-shadow animate-pulse" />
          ) : state === "observing" || state === "planning" || state === "executing" ? (
            <Loader2 className="h-6 w-6 animate-spin text-white drop-shadow" />
          ) : state === "confirming" ? (
            <AlertTriangle className="h-6 w-6 text-amber-200 drop-shadow animate-bounce" />
          ) : state === "success" ? (
            <Check className="h-6 w-6 text-emerald-100 drop-shadow" />
          ) : state === "error" ? (
            <MicOff className="h-6 w-6 text-rose-200 drop-shadow" />
          ) : state === "paused" ? (
            <MicOff className="h-6 w-6 text-amber-200 drop-shadow" />
          ) : (
            <Sparkles className="h-6 w-6 text-white/90 drop-shadow transition-transform duration-300 group-hover:scale-115 group-hover:rotate-12" />
          )}
        </div>
      </div>
    </button>
  );
};
