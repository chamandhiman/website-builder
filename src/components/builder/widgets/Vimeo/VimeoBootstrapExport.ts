import type { WidgetExportContext } from "../widgetRegistry";
import {
  type VimeoWidgetData,
  defaultVimeoWidgetData,
  isVimeoWidgetData,
  extractVimeoId,
} from "./VimeoTypes";

export function buildVimeoBootstrapMarkup(
  data: any,
  context?: WidgetExportContext
): string {
  const d: VimeoWidgetData = isVimeoWidgetData(data) ? data : defaultVimeoWidgetData;
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
    loop,
    color,
  } = d.content;

  const videoId = extractVimeoId(videoUrl);
  const editorMode = Boolean(context?.editorMode);

  if (!videoId) {
    if (editorMode) {
      return `
        <section class="wto-vimeo-section" style="padding-top: ${paddingTop}px; padding-bottom: ${paddingBottom}px; margin-top: ${marginTop || 0}px; margin-bottom: ${marginBottom || 0}px; width: 100%;">
          <div class="container" style="max-width: ${widthMode === "full" ? "100%" : maxWidth}; margin: 0 auto; padding: 0 16px;">
            <div style="background: #18181B; border: 2px dashed #3F3F46; border-radius: ${borderRadius}px; padding: 48px 24px; text-align: center; color: #A1A1AA; font-family: sans-serif;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1AB7EA" stroke-width="2" style="margin: 0 auto 12px; display: block;"><rect width="20" height="15" x="2" y="4.5" rx="2"/><polygon points="10 9 15 12 10 15 10 9"/></svg>
              <h4 style="font-size: 14px; font-weight: 700; color: #F4F4F5; margin: 0 0 4px;">Vimeo Video</h4>
              <p style="font-size: 12px; margin: 0; color: #71717A;">Enter a valid Vimeo video URL in the Properties panel to display your video.</p>
            </div>
          </div>
        </section>
      `;
    }
    return "";
  }

  const cleanColor = (color || "#1AB7EA").replace("#", "");
  const params = new URLSearchParams();
  params.set("color", cleanColor);
  if (autoplay) {
    params.set("autoplay", "1");
    params.set("muted", "1");
  }
  if (loop) params.set("loop", "1");
  const embedUrl = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;

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
    <section class="wto-vimeo-section" style="padding-top: ${paddingTop}px; padding-bottom: ${paddingBottom}px; margin-top: ${marginTop || 0}px; margin-bottom: ${marginBottom || 0}px; width: 100%; background: transparent;">
      <div class="container" style="max-width: ${widthMode === "full" ? "100%" : maxWidth}; ${containerMargin} padding: 0 16px;">
        <div style="position: relative; ${sizingStyle} border-radius: ${borderRadius}px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.35); background: #000000;">
          <iframe
            src="${embedUrl}"
            title="Vimeo Video Player"
            style="position: absolute; inset: 0; width: 100%; height: 100%; border: none; ${editorMode ? "pointer-events: none;" : ""}"
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </div>
    </section>
  `;
}
