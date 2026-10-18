import type { Project, PageSection, Page } from "./store";
import { nanoid } from "nanoid";
import { createWidgetInstance } from "@/components/builder/widgets/widgetRegistry";
import type { FloatingWidgetRecord, FloatingPosition } from "./floatingWidgetsTypes";

export type EmbedDisplayType = "inline" | "floating" | "site_wide";
export type EmbedPlacementScope = "site_wide" | "page_specific" | "floating";

export interface CustomEmbedItem {
  id: string;
  name: string;
  pluginType?: string;
  html: string;
  hidden: boolean;
  displayType: EmbedDisplayType;
  placementScope: EmbedPlacementScope;
  placementLabel: string;
  sectionId?: string;
  floatingId?: string;
  pageId?: string;
  pageName?: string;
  pageSlug?: string;
  isShared: boolean;
  sharedType?: "header" | "footer";
  widgetInstanceId?: string;
  detectedWidgetId?: string | null;
  snippetType: "iframe" | "script" | "wto-widget" | "html" | "empty";
  floatingPosition?: FloatingPosition;
  floatingRecord?: FloatingWidgetRecord;
}

/**
 * Checks if a section is a Custom HTML / Embed / Plugin widget.
 */
export function isCustomHtmlSection(sec: PageSection | null | undefined): boolean {
  if (!sec) return false;
  if (sec.widgetInstance?.type === "custom-html") return true;
  if (sec.widgetInstance?.type === "google-reviews") return true;
  if (sec.widgetInstance?.type === "map") return true;
  if (sec.templateId && (
    sec.templateId.toLowerCase().includes("custom-html") ||
    sec.templateId.toLowerCase().includes("google-review") ||
    sec.templateId.toLowerCase().includes("map")
  )) return true;
  if (sec.name && (
    sec.name.toLowerCase().includes("custom html") ||
    sec.name.toLowerCase().includes("custom embed") ||
    sec.name.toLowerCase().includes("youtube") ||
    sec.name.toLowerCase().includes("google map")
  )) return true;
  return false;
}

/**
 * Extracts raw HTML/embed code from a section safely.
 */
export function getSectionEmbedHtml(sec: PageSection): string {
  const w = sec.widgetInstance as any;
  if (w?.data && w.data.content?.html !== undefined) {
    return String(w.data.content.html || "");
  }
  if (w?.content && w.content.html !== undefined) {
    return String(w.content.html || "");
  }
  return String(sec.html || "");
}

/**
 * Formats a floating position identifier into a human-readable label.
 */
export function formatFloatingPositionLabel(pos?: string): string {
  switch (pos) {
    case "bottom_right":
      return "Bottom Right";
    case "bottom_left":
      return "Bottom Left";
    case "bottom_center":
      return "Bottom Center";
    case "top_right":
      return "Top Right";
    case "top_left":
      return "Top Left";
    case "top_center":
      return "Top Center";
    case "top_fixed":
      return "Top Fixed";
    case "bottom_fixed":
      return "Bottom Fixed";
    default:
      return "Floating Overlay";
  }
}

/**
 * Detects snippet type for preview badge.
 */
export function detectSnippetType(html: string): "iframe" | "script" | "wto-widget" | "html" | "empty" {
  if (!html || !html.trim()) return "empty";
  const trimmed = html.trim().toLowerCase();
  if (trimmed.includes("data-wto-widget")) return "wto-widget";
  if (trimmed.includes("<iframe")) return "iframe";
  if (trimmed.includes("<script")) return "script";
  return "html";
}

/**
 * Detects WTO widget ID if present in embed code.
 */
export function detectWtoWidgetId(html: string): string | null {
  if (!html) return null;
  const match = html.match(/data-wto-widget=(?:["']|&quot;)?([^"'\s>&;]+)(?:["']|&quot;)?/i);
  return match ? match[1] : null;
}

function resolvePluginTypeFromSection(name: string, html: string): string {
  const lowerName = name.toLowerCase();
  const lowerHtml = html.toLowerCase();
  if (lowerName.includes("youtube") || lowerHtml.includes("youtube.com") || lowerHtml.includes("youtu.be")) {
    return "youtube";
  }
  if (lowerName.includes("map") || lowerHtml.includes("maps.google") || lowerHtml.includes("google.com/maps")) {
    return "maps";
  }
  if (lowerName.includes("whatsapp") || lowerHtml.includes("wa.me") || lowerHtml.includes("whatsapp")) {
    return "whatsapp";
  }
  if (lowerName.includes("review") || lowerHtml.includes("google-review")) {
    return "reviews";
  }
  return "custom_html";
}

/**
 * Retrieves all plugins and custom embeds belonging strictly to the specified project.
 * Scoped 100% to this project ID / site.
 * Covers: Site-wide embeds (Header/Footer), Inline page embeds, and Floating widgets.
 */
export function getProjectCustomEmbeds(project: Project | null | undefined): CustomEmbedItem[] {
  if (!project) return [];
  const items: CustomEmbedItem[] = [];

  // 1. Shared Global Header
  if (project.sharedHeader && isCustomHtmlSection(project.sharedHeader)) {
    const sec = project.sharedHeader;
    const html = getSectionEmbedHtml(sec);
    const pType = resolvePluginTypeFromSection(sec.name || "", html);
    items.push({
      id: sec.id,
      sectionId: sec.id,
      name: sec.name || (pType === "youtube" ? "YouTube Video" : pType === "maps" ? "Google Maps" : "Custom HTML (Header)"),
      pluginType: pType,
      html,
      hidden: Boolean(sec.hidden),
      displayType: "site_wide",
      placementScope: "site_wide",
      placementLabel: "Global Header",
      pageId: "shared-header",
      pageName: "Global Header",
      pageSlug: "global",
      isShared: true,
      sharedType: "header",
      widgetInstanceId: sec.widgetInstance?.id,
      detectedWidgetId: detectWtoWidgetId(html),
      snippetType: detectSnippetType(html),
    });
  }

  // 2. Page Sections (Inline Embeds)
  (project.pages || []).forEach((page: Page) => {
    (page.sections || []).forEach((sec: PageSection) => {
      if (isCustomHtmlSection(sec)) {
        const html = getSectionEmbedHtml(sec);
        const pType = resolvePluginTypeFromSection(sec.name || "", html);
        items.push({
          id: sec.id,
          sectionId: sec.id,
          name: sec.name || (pType === "youtube" ? "YouTube Video" : pType === "maps" ? "Google Maps" : "Custom HTML / Embed"),
          pluginType: pType,
          html,
          hidden: Boolean(sec.hidden),
          displayType: "inline",
          placementScope: "page_specific",
          placementLabel: page.name || page.slug || "Page",
          pageId: page.id,
          pageName: page.name || page.slug || "Untitled Page",
          pageSlug: page.slug || "page",
          isShared: false,
          widgetInstanceId: sec.widgetInstance?.id,
          detectedWidgetId: detectWtoWidgetId(html),
          snippetType: detectSnippetType(html),
        });
      }
    });
  });

  // 3. Shared Global Footer
  if (project.sharedFooter && isCustomHtmlSection(project.sharedFooter)) {
    const sec = project.sharedFooter;
    const html = getSectionEmbedHtml(sec);
    const pType = resolvePluginTypeFromSection(sec.name || "", html);
    items.push({
      id: sec.id,
      sectionId: sec.id,
      name: sec.name || (pType === "youtube" ? "YouTube Video" : pType === "maps" ? "Google Maps" : "Custom HTML (Footer)"),
      pluginType: pType,
      html,
      hidden: Boolean(sec.hidden),
      displayType: "site_wide",
      placementScope: "site_wide",
      placementLabel: "Global Footer",
      pageId: "shared-footer",
      pageName: "Global Footer",
      pageSlug: "global",
      isShared: true,
      sharedType: "footer",
      widgetInstanceId: sec.widgetInstance?.id,
      detectedWidgetId: detectWtoWidgetId(html),
      snippetType: detectSnippetType(html),
    });
  }

  // 4. Floating Widgets (All active / configured floating widgets)
  (project.floatingWidgets || []).forEach((fw: FloatingWidgetRecord) => {
    let defaultName = "Floating Widget";
    let pType = fw.type as string;

    if (fw.type === "whatsapp_chat") {
      defaultName = "WhatsApp Chat";
      pType = "whatsapp";
    } else if (fw.type === "language_switcher") {
      defaultName = "Language Switcher";
      pType = "language";
    } else if (fw.type === "accessibility") {
      defaultName = "Accessibility Toolbar";
      pType = "accessibility";
    } else if (fw.type === "back_to_top") {
      defaultName = "Back to Top";
      pType = "back_to_top";
    } else if (fw.type === "floating_contact") {
      defaultName = "Floating Contact";
      pType = "contact";
    } else if (fw.type === "announcement_popup") {
      defaultName = "Announcement Popup";
      pType = "announcement";
    } else if (fw.type === "custom_embed") {
      defaultName = "Custom HTML";
      pType = "custom_html";
    }

    const html = String(fw.snippetHtml || fw.config?.html || "");

    items.push({
      id: fw.id,
      floatingId: fw.id,
      name: fw.name || defaultName,
      pluginType: pType,
      html,
      hidden: !fw.enabled,
      displayType: "floating",
      placementScope: "floating",
      placementLabel: formatFloatingPositionLabel(fw.position),
      pageId: "floating",
      pageName: "Floating Overlay",
      pageSlug: "floating",
      isShared: true,
      floatingPosition: fw.position,
      floatingRecord: fw,
      detectedWidgetId: detectWtoWidgetId(html),
      snippetType: detectSnippetType(html),
    });
  });

  return items;
}

/**
 * Creates a complete PageSection representation for a Custom HTML widget.
 */
export function createCustomHtmlSection({
  name,
  html,
  id,
}: {
  name: string;
  html: string;
  id?: string;
}): PageSection {
  const sectionId = id || `custom-html-${nanoid(8)}`;
  const widgetInstance = createWidgetInstance("custom-html-v1", {
    id: sectionId,
    content: { html },
  });

  return {
    id: sectionId,
    templateId: "custom-html-v1",
    name: name.trim() || "Custom HTML / Embed",
    html,
    widgetInstance: {
      id: sectionId,
      type: "custom-html",
      variant: "default",
      content: { html },
      style: {},
      layout: {},
      responsive: {},
      animation: {},
      advanced: {},
    } as any,
    animation: { type: "fade-up", duration: 700, delay: 0 },
  };
}

/**
 * Creates a complete PageSection representation for a YouTube Video widget.
 */
export function createYouTubeSection({
  name,
  url,
  aspectRatio = "16/9",
  maxWidth = "1000px",
  autoplay = false,
  mute = false,
  showControls = true,
  loop = false,
  id,
}: {
  name?: string;
  url: string;
  aspectRatio?: string;
  maxWidth?: string;
  autoplay?: boolean;
  mute?: boolean;
  showControls?: boolean;
  loop?: boolean;
  id?: string;
}): PageSection {
  const sectionId = id || `youtube-${nanoid(8)}`;
  let videoId = "";
  if (url.includes("embed/")) {
    videoId = url.split("embed/")[1]?.split("?")[0] || "";
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  } else {
    videoId = url.trim();
  }

  const params = new URLSearchParams();
  if (autoplay) params.set("autoplay", "1");
  if (mute) params.set("mute", "1");
  if (!showControls) params.set("controls", "0");
  if (loop && videoId) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }
  const paramStr = params.toString() ? `?${params.toString()}` : "";
  const embedUrl = `https://www.youtube.com/embed/${videoId}${paramStr}`;

  const html = `<section class="wto-youtube-section py-8" style="width: 100%; background: transparent;">
  <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 16px;">
    <div style="position: relative; width: 100%; aspect-ratio: ${aspectRatio}; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.35);">
      <iframe src="${embedUrl}" title="${name || 'YouTube Video'}" style="position: absolute; inset: 0; width: 100%; height: 100%; border: none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</section>`;

  return {
    id: sectionId,
    templateId: "custom-html-v1",
    name: name?.trim() || "YouTube Video",
    html,
    widgetInstance: {
      id: sectionId,
      type: "custom-html",
      variant: "youtube",
      content: { html, youtubeUrl: url, aspectRatio, maxWidth, autoplay, mute, showControls, loop },
      style: {},
      layout: {},
      responsive: {},
      animation: {},
      advanced: {},
    } as any,
    animation: { type: "fade-up", duration: 700, delay: 0 },
  };
}

/**
 * Creates a complete PageSection representation for a Google Maps widget.
 */
export function createMapSection({
  name,
  address,
  height = "380px",
  maxWidth = "100%",
  zoom = 13,
  id,
}: {
  name?: string;
  address: string;
  height?: string;
  maxWidth?: string;
  zoom?: number;
  id?: string;
}): PageSection {
  const sectionId = id || `map-${nanoid(8)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  const html = `<section class="wto-map-section py-8" style="width: 100%; background: transparent;">
  <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 16px;">
    <div style="position: relative; width: 100%; height: ${height}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.25);">
      <iframe src="${mapEmbedUrl}" title="${name || 'Google Map'}" style="width: 100%; height: 100%; border: none;" scrolling="no"></iframe>
    </div>
  </div>
</section>`;

  return {
    id: sectionId,
    templateId: "custom-html-v1",
    name: name?.trim() || "Google Maps",
    html,
    widgetInstance: {
      id: sectionId,
      type: "custom-html",
      variant: "maps",
      content: { html, address, height, maxWidth, zoom },
      style: {},
      layout: {},
      responsive: {},
      animation: {},
      advanced: {},
    } as any,
    animation: { type: "fade-up", duration: 700, delay: 0 },
  };
}
