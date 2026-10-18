import React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  RotateCcw,
  Code2,
} from "lucide-react";

export interface WidgetStudioHeaderProps {
  widgetName: string;
  onWidgetNameChange: (name: string) => void;
  status: "draft" | "published" | string;
  icon: React.ReactNode;
  iconBgClass?: string;
  previewDevice?: "desktop" | "mobile" | "tablet" | string;
  onPreviewDeviceChange?: (device: "desktop" | "mobile") => void;
  onResetPreview?: () => void;
  onOpenEmbed: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving?: boolean;
  publishing?: boolean;
  hasUnsavedChanges?: boolean;
}

export function WidgetStudioHeader({
  widgetName,
  onWidgetNameChange,
  status,
  icon,
  iconBgClass = "bg-[#25d366]/15 border-[#25d366]/30 text-[#25d366]",
  previewDevice = "desktop",
  onPreviewDeviceChange,
  onResetPreview,
  onOpenEmbed,
  onSaveDraft,
  onPublish,
  saving = false,
  publishing = false,
  hasUnsavedChanges = false,
}: WidgetStudioHeaderProps) {
  const navigate = useNavigate();
  const isPublished = status === "published";

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Left: Back button + Divider + Icon + Editable Name + Status Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/widgets" as any })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 transition text-xs font-semibold cursor-pointer"
          title="Back to Plugins"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Plugins</span>
        </button>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${iconBgClass}`}
          >
            {icon}
          </div>
          <input
            type="text"
            value={widgetName}
            onChange={(e) => onWidgetNameChange(e.target.value)}
            className="bg-transparent hover:bg-zinc-900/60 focus:bg-zinc-900 px-2 py-0.5 rounded text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-white/20 max-w-[180px] sm:max-w-[240px] truncate"
            title="Click to rename widget"
          />
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
            isPublished
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPublished ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          {isPublished ? "Published" : "Draft"}
        </span>

        {hasUnsavedChanges && (
          <span className="hidden xl:inline text-[11px] text-amber-400 font-medium">
            • Unsaved
          </span>
        )}
      </div>

      {/* Center: Desktop / Mobile Device Switcher */}
      {onPreviewDeviceChange && (
        <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => onPreviewDeviceChange("desktop")}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === "desktop"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onPreviewDeviceChange("mobile")}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === "mobile"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      )}

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        {onResetPreview && (
          <button
            type="button"
            onClick={onResetPreview}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Reload Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenEmbed}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs flex items-center gap-1.5 border border-zinc-800 cursor-pointer"
          title="Get embed code"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Embed</span>
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:opacity-90 text-zinc-950 font-bold text-xs transition shadow-md shadow-[#22c55e]/20 disabled:opacity-50 cursor-pointer"
        >
          {publishing ? "Publishing…" : "Publish Live"}
        </button>
      </div>
    </header>
  );
}
