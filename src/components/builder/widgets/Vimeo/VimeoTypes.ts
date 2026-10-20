import type { WidgetData } from "../widgetRegistry";

export interface VimeoContent extends Record<string, unknown> {
  videoUrl: string;
  widthMode: "full" | "custom";
  maxWidth: string; // e.g. "1000px"
  aspectRatio: "16/9" | "4/3" | "1/1" | "21/9" | "custom";
  customHeight: string; // e.g. "450px"
  borderRadius: number; // e.g. 14
  paddingTop: number; // e.g. 32
  paddingBottom: number; // e.g. 32
  marginTop?: number; // e.g. 0
  marginBottom?: number; // e.g. 0
  alignment: "center" | "left" | "right";
  autoplay: boolean;
  loop: boolean;
  color: string; // Hex color for vimeo player controls e.g. "#1AB7EA"
}

export interface VimeoWidgetData extends WidgetData {
  content: VimeoContent;
}

export const defaultVimeoWidgetData: VimeoWidgetData = {
  id: "vimeo-default",
  type: "vimeo",
  variant: "Default",
  content: {
    videoUrl: "https://vimeo.com/76979871",
    widthMode: "custom",
    maxWidth: "1000px",
    aspectRatio: "16/9",
    customHeight: "450px",
    borderRadius: 14,
    paddingTop: 32,
    paddingBottom: 32,
    marginTop: 0,
    marginBottom: 0,
    alignment: "center",
    autoplay: false,
    loop: false,
    color: "#1AB7EA",
  },
  style: {},
  layout: {},
  responsive: {},
  animation: {},
  advanced: {},
};

export function isVimeoWidgetData(data: WidgetData): data is VimeoWidgetData {
  return data?.type === "vimeo";
}

/**
 * Extracts Vimeo video ID from various Vimeo URL formats or pasted iframe codes.
 */
export function extractVimeoId(url: string = ""): string | null {
  if (!url || typeof url !== "string") return null;
  let trimmed = url.trim();
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    trimmed = srcMatch[1];
  }
  if (/^\d+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|))(\d+)/i
  );
  return match ? match[1] : null;
}

export function buildVimeoEmbedUrl(videoId: string, content?: Partial<VimeoContent>): string {
  if (!videoId) return "";
  const params = new URLSearchParams();
  if (content?.autoplay) {
    params.set("autoplay", "1");
    params.set("muted", "1");
  }
  if (content?.loop) params.set("loop", "1");
  if (content?.color) params.set("color", content.color.replace("#", ""));
  const query = params.toString();
  return `https://player.vimeo.com/video/${videoId}${query ? `?${query}` : ""}`;
}
