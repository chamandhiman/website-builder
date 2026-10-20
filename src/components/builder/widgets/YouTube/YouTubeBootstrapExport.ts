import type { WidgetExportContext } from "../widgetRegistry";
import {
  type YouTubeWidgetData,
  defaultYouTubeWidgetData,
  isYouTubeWidgetData,
  extractYouTubeId,
} from "./YouTubeTypes";

export function buildYouTubeBootstrapMarkup(
  data: any,
  context?: WidgetExportContext
): string {
  const d: YouTubeWidgetData = isYouTubeWidgetData(data) ? data : defaultYouTubeWidgetData;
  const {
    videoUrl,
    widthMode,
    maxWidth,
    aspectRatio,
    customHeight,
    borderRadius,
    paddingTop,
    paddingBottom,
    marginTop,
    marginBottom,
    alignment,
    autoplay,
    mute,
    showControls,
    loop,
  } = d.content;

  const videoId = extractYouTubeId(videoUrl);
  const editorMode = Boolean(context?.editorMode);

  if (!videoId) {
    if (editorMode) {
      return `
        <section class="wto-youtube-section" style="padding-top: ${paddingTop}px; padding-bottom: ${paddingBottom}px; margin-top: ${marginTop || 0}px; margin-bottom: ${marginBottom || 0}px; width: 100%;">
          <div class="container" style="max-width: ${widthMode === "full" ? "100%" : maxWidth}; margin: 0 auto; padding: 0 16px;">
            <div style="background: #18181B; border: 2px dashed #3F3F46; border-radius: ${borderRadius}px; padding: 48px 24px; text-align: center; color: #A1A1AA; font-family: sans-serif;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E02424" stroke-width="2" style="margin: 0 auto 12px; display: block;"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              <h4 style="font-size: 14px; font-weight: 700; color: #F4F4F5; margin: 0 0 4px;">YouTube Video</h4>
              <p style="font-size: 12px; margin: 0; color: #71717A;">Enter a valid YouTube URL in the Properties panel to display your video.</p>
            </div>
          </div>
        </section>
      `;
    }
    return "";
  }

  const params = new URLSearchParams();
  if (autoplay) params.set("autoplay", "1");
  if (mute || autoplay) params.set("mute", "1");
  if (!showControls) params.set("controls", "0");
  if (loop && videoId) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }
  const paramStr = params.toString() ? `?${params.toString()}` : "";
  const embedUrl = `https://www.youtube.com/embed/${videoId}${paramStr}`;

  const containerMargin =
    alignment === "left"
      ? "margin: 0 auto 0 0;"
      : alignment === "right"
      ? "margin: 0 0 0 auto;"
      : "margin: 0 auto;";

  const sizingStyle =
    aspectRatio === "custom"
      ? `height: ${customHeight || "450px"}; width: 100%;`
      : `aspect-ratio: ${aspectRatio}; width: 100%;`;

  return `
    <section class="wto-youtube-section" style="padding-top: ${paddingTop}px; padding-bottom: ${paddingBottom}px; margin-top: ${marginTop || 0}px; margin-bottom: ${marginBottom || 0}px; width: 100%; background: transparent;">
      <div class="container" style="max-width: ${widthMode === "full" ? "100%" : maxWidth}; ${containerMargin} padding: 0 16px;">
        <div style="position: relative; ${sizingStyle} border-radius: ${borderRadius}px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.35); background: #000000;">
          <iframe
            src="${embedUrl}"
            title="YouTube Video Player"
            style="position: absolute; inset: 0; width: 100%; height: 100%; border: none; ${editorMode ? "pointer-events: none;" : ""}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  `;
}
