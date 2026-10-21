import React, { useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetData } from "../widgetRegistry";
import {
  type VimeoWidgetData,
  defaultVimeoWidgetData,
  isVimeoWidgetData,
  extractVimeoId,
  buildVimeoEmbedUrl,
} from "./VimeoTypes";
import { PropertyPanel } from "@/components/builder/property-panel/PropertyPanel";
import {
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";

interface VimeoPropertiesProps {
  value?: WidgetData;
  onChange?: (nextValue: WidgetData) => void;
  widgetId?: string;
  onClose?: () => void;
}

const ASPECT_RATIO_OPTIONS = [
  { label: "16:9 (Widescreen)", value: "16/9" },
  { label: "4:3 (Standard)", value: "4/3" },
  { label: "1:1 (Square)", value: "1/1" },
  { label: "21:9 (Ultrawide / Cinema)", value: "21/9" },
  { label: "Custom Height (Pixels)", value: "custom" },
];

export function VimeoProperties({
  value = defaultVimeoWidgetData,
  onChange,
  widgetId,
  onClose,
}: VimeoPropertiesProps) {
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);

  const resolvedWidget: VimeoWidgetData =
    value && isVimeoWidgetData(value) ? value : defaultVimeoWidgetData;

  const content = resolvedWidget.content;
  const [urlInput, setUrlInput] = useState(content.videoUrl || "");

  useEffect(() => {
    setUrlInput(content.videoUrl || "");
  }, [content.videoUrl]);

  const updateContent = (patch: Partial<typeof content>) => {
    const updated: VimeoWidgetData = {
      ...resolvedWidget,
      content: {
        ...content,
        ...patch,
      },
    };
    if (onChange) {
      onChange(updated);
    } else if (widgetId) {
      updateWidgetInstance(widgetId, updated as any);
    }
  };

  const videoId = extractVimeoId(urlInput);
  const isValid = Boolean(videoId);
  const embedUrl = videoId ? buildVimeoEmbedUrl(videoId, { autoplay: content.autoplay, loop: content.loop }) : "";

  return (
    <PropertyPanel title="Vimeo Video" icon={<Video className="h-4 w-4 text-[#1AB7EA]" />} onClose={onClose}>
      <div className="space-y-4 p-3.5 text-xs text-zinc-300">
        {/* Video URL Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
              Vimeo Video URL
            </label>
            {isValid ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 size={12} /> Valid Video
              </span>
            ) : urlInput.trim() ? (
              <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                <AlertCircle size={12} /> Invalid URL
              </span>
            ) : null}
          </div>

          <input
            type="text"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              updateContent({ videoUrl: e.target.value });
            }}
            placeholder="https://vimeo.com/76979871"
            className="w-full bg-[#18181B] border border-[#27272A] focus:border-[#FACC15] rounded-lg px-2.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
          />

          <p className="text-[10.5px] text-zinc-500 leading-tight">
            Supports standard Vimeo links, player.vimeo.com links, or pasted iframe code.
          </p>

          {/* Generated Embed URL & Copy */}
          {embedUrl && (
            <div className="space-y-1 pt-1">
              <label className="text-[10.5px] font-medium text-zinc-400 block">
                Generated Embed URL
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={embedUrl}
                  className="w-full bg-[#141416] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(embedUrl);
                    toast.success("Vimeo embed URL copied to clipboard");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition shrink-0"
                  title="Copy Embed URL"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {videoId && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-400">Video ID: {videoId}</span>
              <a
                href={`https://vimeo.com/${videoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#1AB7EA] hover:underline flex items-center gap-1"
              >
                <span>Open on Vimeo</span>
                <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>

        {/* Width & Alignment */}
        <div className="space-y-3 pt-3 border-t border-[#26262B]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
              Section Width
            </label>
            <div className="flex items-center bg-[#1A1A1E] p-0.5 rounded-lg border border-zinc-800 text-[10px]">
              <button
                type="button"
                onClick={() => updateContent({ widthMode: "custom" })}
                className={`px-2 py-1 rounded font-medium ${
                  content.widthMode === "custom" ? "bg-[#FACC15] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Custom Width
              </button>
              <button
                type="button"
                onClick={() => updateContent({ widthMode: "full" })}
                className={`px-2 py-1 rounded font-medium ${
                  content.widthMode === "full" ? "bg-[#FACC15] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Full Width
              </button>
            </div>
          </div>

          {content.widthMode === "custom" && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Max Width</span>
                <span className="font-mono text-white">{content.maxWidth}</span>
              </div>
              <input
                type="range"
                min="480"
                max="1440"
                step="20"
                value={parseInt(content.maxWidth, 10) || 1000}
                onChange={(e) => updateContent({ maxWidth: `${e.target.value}px` })}
                className="w-full accent-[#FACC15] cursor-pointer"
              />
            </div>
          )}

          {/* Alignment */}
          <div className="space-y-1 pt-1">
            <span className="text-[11px] text-zinc-400 block">Alignment</span>
            <div className="grid grid-cols-3 gap-1">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateContent({ alignment: align })}
                  className={`py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 capitalize transition-all ${
                    content.alignment === align
                      ? "border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15] font-bold"
                      : "border-zinc-800 bg-[#18181B] text-zinc-400 hover:text-white"
                  }`}
                >
                  {align === "left" && <AlignLeft size={13} />}
                  {align === "center" && <AlignCenter size={13} />}
                  {align === "right" && <AlignRight size={13} />}
                  <span>{align}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Height / Aspect Ratio */}
        <div className="space-y-2 pt-3 border-t border-[#26262B]">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide block">
            Height / Aspect Ratio
          </label>
          <select
            value={content.aspectRatio}
            onChange={(e) => updateContent({ aspectRatio: e.target.value as any })}
            className="w-full bg-[#18181B] border border-[#27272A] text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#FACC15]"
          >
            {ASPECT_RATIO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {content.aspectRatio === "custom" && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Pixel Height</span>
                <span className="font-mono text-white">{content.customHeight}</span>
              </div>
              <input
                type="range"
                min="240"
                max="900"
                step="10"
                value={parseInt(content.customHeight, 10) || 450}
                onChange={(e) => updateContent({ customHeight: `${e.target.value}px` })}
                className="w-full accent-[#FACC15] cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Border Radius & Spacing */}
        <div className="space-y-3 pt-3 border-t border-[#26262B]">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide block">
            Styling & Spacing
          </label>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Border Radius</span>
              <span className="font-mono text-white">{content.borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={content.borderRadius}
              onChange={(e) => updateContent({ borderRadius: parseInt(e.target.value, 10) || 0 })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Top Spacing (Padding)</span>
              <span className="font-mono text-white">{content.paddingTop}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="96"
              step="4"
              value={content.paddingTop}
              onChange={(e) => updateContent({ paddingTop: parseInt(e.target.value, 10) || 0 })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Bottom Spacing (Padding)</span>
              <span className="font-mono text-white">{content.paddingBottom}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="96"
              step="4"
              value={content.paddingBottom}
              onChange={(e) => updateContent({ paddingBottom: parseInt(e.target.value, 10) || 0 })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Top Margin</span>
              <span className="font-mono text-white">{content.marginTop || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="96"
              step="4"
              value={content.marginTop || 0}
              onChange={(e) => updateContent({ marginTop: parseInt(e.target.value, 10) || 0 })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Bottom Margin</span>
              <span className="font-mono text-white">{content.marginBottom || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="96"
              step="4"
              value={content.marginBottom || 0}
              onChange={(e) => updateContent({ marginBottom: parseInt(e.target.value, 10) || 0 })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 pt-3 border-t border-[#26262B]">
          <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide block">
            Options
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-[#18181B] border border-zinc-800 cursor-pointer hover:border-zinc-700">
            <span>Autoplay Video (Muted)</span>
            <input
              type="checkbox"
              checked={content.autoplay}
              onChange={(e) => updateContent({ autoplay: e.target.checked })}
              className="w-4 h-4 accent-[#FACC15]"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-[#18181B] border border-zinc-800 cursor-pointer hover:border-zinc-700">
            <span>Loop Video</span>
            <input
              type="checkbox"
              checked={content.loop}
              onChange={(e) => updateContent({ loop: e.target.checked })}
              className="w-4 h-4 accent-[#FACC15]"
            />
          </label>
        </div>
      </div>
    </PropertyPanel>
  );
}
