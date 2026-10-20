import type { WidgetData } from "../widgetRegistry";

export interface YouTubeContent extends Record<string, unknown> {
  videoUrl: string;
  widthMode: "full" | "custom";
  maxWidth: string; // e.g. "900px", "1000px", "1200px"
  aspectRatio: "16/9" | "4/3" | "1/1" | "21/9" | "custom";
  customHeight: string; // e.g. "450px"
  borderRadius: number; // e.g. 14
  paddingTop: number; // e.g. 32
  paddingBottom: number; // e.g. 32
  marginTop?: number; // e.g. 0
  marginBottom?: number; // e.g. 0
  alignment: "center" | "left" | "right";
  autoplay: boolean;
  mute: boolean;
  showControls: boolean;
  loop: boolean;
}

export interface YouTubeWidgetData extends WidgetData {
  content: YouTubeContent;
}

export const defaultYouTubeWidgetData: YouTubeWidgetData = {
  id: "youtube-default",
  type: "youtube",
  variant: "Default",
  content: {
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
    mute: false,
    showControls: true,
    loop: false,
  },
  style: {},
  layout: {},
  responsive: {},
  animation: {},
  advanced: {},
};

export function isYouTubeWidgetData(data: WidgetData): data is YouTubeWidgetData {
  return data?.type === "youtube";
}

/**
 * Extracts 11-character YouTube video ID from various YouTube URL formats or pasted iframe codes.
 */
export function extractYouTubeId(url: string = ""): string | null {
  if (!url || typeof url !== "string") return null;
  let trimmed = url.trim();
  // Support pasted <iframe ... src="..."></iframe>
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    trimmed = srcMatch[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

export function buildYouTubeEmbedUrl(videoId: string, content?: Partial<YouTubeContent>): string {
  if (!videoId) return "";
  const params = new URLSearchParams();
  if (content?.autoplay) params.set("autoplay", "1");
  if (content?.mute || content?.autoplay) params.set("mute", "1");
  if (content?.showControls === false) params.set("controls", "0");
  if (content?.loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }
  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ""}`;
}
