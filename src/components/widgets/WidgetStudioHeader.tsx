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
  iconBgClass = "bg-[#7137D8]/10 border-[#7137D8]/20 text-[#7137D8]",
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
    <header className="h-14 border-b border-[#E2E8F0] bg-white px-4 flex items-center justify-between shrink-0 z-30 select-none shadow-2xs">
      {/* Left: Back button + Divider + Icon + Editable Name + Status Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/widgets" as any })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#111827] border border-[#E2E8F0] hover:border-[#CBD5E1] transition text-xs font-semibold cursor-pointer shadow-2xs"
          title="Back to Plugins"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back to Plugins</span>
        </button>

        <div className="h-4 w-px bg-[#E2E8F0]" />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs ${iconBgClass}`}
          >
            {icon}
          </div>
          <input
            type="text"
            value={widgetName}
            onChange={(e) => onWidgetNameChange(e.target.value)}
            className="bg-transparent hover:bg-[#F8FAFC] focus:bg-white px-2 py-1 rounded-lg text-sm font-bold text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#7137D8] border border-transparent focus:border-[#7137D8] max-w-[180px] sm:max-w-[240px] truncate transition"
            title="Click to rename widget"
          />
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 ${
            isPublished
              ? "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]"
              : "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPublished ? "bg-[#16A34A]" : "bg-[#D97706]"
            }`}
          />
          {isPublished ? "Published" : "Draft"}
        </span>

        {hasUnsavedChanges && (
          <span className="hidden xl:inline text-[11px] text-[#D97706] font-semibold bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A]">
            • Unsaved changes
          </span>
        )}
      </div>

      {/* Center: Desktop / Mobile Device Switcher */}
      {onPreviewDeviceChange && (
        <div className="hidden md:flex items-center bg-[#F1F5F9] border border-[#E2E8F0] p-0.5 rounded-xl">
          <button
            type="button"
            onClick={() => onPreviewDeviceChange("desktop")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === "desktop"
                ? "bg-white text-[#7137D8] shadow-xs font-bold"
                : "text-[#64748B] hover:text-[#111827]"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onPreviewDeviceChange("mobile")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === "mobile"
                ? "bg-white text-[#7137D8] shadow-xs font-bold"
                : "text-[#64748B] hover:text-[#111827]"
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
            className="p-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] border border-[#E2E8F0] hover:border-[#CBD5E1] transition cursor-pointer shadow-2xs"
            title="Reload Preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenEmbed}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] hover:text-[#111827] font-semibold text-xs flex items-center gap-1.5 border border-[#E2E8F0] hover:border-[#CBD5E1] cursor-pointer shadow-2xs transition"
          title="Get embed code"
        >
          <Code2 className="w-3.5 h-3.5 text-[#7137D8]" />
          <span>Embed</span>
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#94A3B8] text-[#111827] font-bold text-xs transition disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {publishing ? "Publishing…" : "Publish Live"}
        </button>
      </div>
    </header>
  );
}
