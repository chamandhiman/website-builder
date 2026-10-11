import { Flame, Zap, Rocket, Gift } from "lucide-react";
import type { CountdownTemplateItem } from "@/services/countdownTemplates";

/** Mini Visual Preview for Countdown Template Card */
export function TemplateCardPreview({ tpl }: { tpl: CountdownTemplateItem }) {
  const cfg = tpl.config;
  const colors = cfg.colors;
  const isMinimal = cfg.timerStyle === "minimal";
  const isFlip = cfg.timerStyle === "flip";

  return (
    <div
      className="p-4 rounded-xl border relative overflow-hidden transition-all flex flex-col items-center justify-center min-h-[140px] text-center"
      style={{
        backgroundColor: colors.background || "#18181b",
        borderColor: colors.cardBorder || "#3f3f46",
      }}
    >
      {/* Badge */}
      {cfg.showBadge && cfg.badgeText && (
        <div
          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 shadow-sm"
          style={{
            backgroundColor: colors.badgeBackground || "#ef4444",
            color: colors.badgeText || "#ffffff",
          }}
        >
          {cfg.badgeIcon === "fire" && <Flame className="w-2.5 h-2.5" />}
          {cfg.badgeIcon === "zap" && <Zap className="w-2.5 h-2.5" />}
          {cfg.badgeIcon === "rocket" && <Rocket className="w-2.5 h-2.5" />}
          {cfg.badgeIcon === "gift" && <Gift className="w-2.5 h-2.5" />}
          <span>{cfg.badgeText.length > 24 ? cfg.badgeText.slice(0, 22) + "…" : cfg.badgeText}</span>
        </div>
      )}

      {/* Heading */}
      <div
        className="text-xs font-bold truncate max-w-[220px] mb-2"
        style={{ color: colors.text || "#ffffff" }}
      >
        {cfg.heading}
      </div>

      {/* Digits Display */}
      <div className="flex items-center gap-1.5 my-1">
        {cfg.showDays && (
          <div
            className={`px-2 py-1 rounded text-xs font-mono font-bold ${
              isFlip ? "border border-zinc-700 shadow-inner" : ""
            }`}
            style={{
              backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
              color: colors.numberColor || "#facc15",
            }}
          >
            02<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelDays || "d"}</span>
          </div>
        )}
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            isFlip ? "border border-zinc-700 shadow-inner" : ""
          }`}
          style={{
            backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
            color: colors.numberColor || "#facc15",
          }}
        >
          14<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelHours || "h"}</span>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            isFlip ? "border border-zinc-700 shadow-inner" : ""
          }`}
          style={{
            backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
            color: colors.numberColor || "#facc15",
          }}
        >
          35<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelMinutes || "m"}</span>
        </div>
        <div
          className={`px-2 py-1 rounded text-xs font-mono font-bold ${
            isFlip ? "border border-zinc-700 shadow-inner" : ""
          }`}
          style={{
            backgroundColor: isMinimal ? "transparent" : colors.cardBackground || "#27272a",
            color: colors.numberColor || "#facc15",
          }}
        >
          48<span className="text-[8px] block text-zinc-400 font-sans">{cfg.labelSeconds || "s"}</span>
        </div>
      </div>

      {/* CTA Button */}
      {cfg.showCTA && (
        <div
          className="mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm"
          style={{
            backgroundColor: colors.buttonBackground || "#facc15",
            color: colors.buttonText || "#000000",
          }}
        >
          {cfg.ctaText}
        </div>
      )}
    </div>
  );
}
