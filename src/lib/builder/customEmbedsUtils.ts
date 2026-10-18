import type { Project, PageSection, Page } from "./store";
import { nanoid } from "nanoid";
import { createWidgetInstance } from "@/components/builder/widgets/widgetRegistry";
import type { FloatingWidgetRecord, FloatingPosition } from "./floatingWidgetsTypes";

export type EmbedDisplayType = "inline" | "floating" | "site_wide";
export type EmbedPlacementScope = "site_wide" | "page_specific" | "floating";

export interface CustomEmbedItem {
  id: string;
  name: string;
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
 * Checks if a section is a Custom HTML / Embed widget.
 */
export function isCustomHtmlSection(sec: PageSection | null | undefined): boolean {
  if (!sec) return false;
  if (sec.widgetInstance?.type === "custom-html") return true;
  if (sec.templateId && sec.templateId.toLowerCase().includes("custom-html")) return true;
  if (sec.name && (sec.name.toLowerCase().includes("custom html") || sec.name.toLowerCase().includes("custom embed"))) return true;
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

/**
 * Retrieves all Custom HTML / Embed widgets belonging strictly to the specified project.
 * Scoped 100% to this project ID / site.
 * Covers: Site-wide embeds (Header/Footer), Inline page embeds, and Floating embeds.
 */
export function getProjectCustomEmbeds(project: Project | null | undefined): CustomEmbedItem[] {
  if (!project) return [];
  const items: CustomEmbedItem[] = [];

  // 1. Shared Global Header
  if (project.sharedHeader && isCustomHtmlSection(project.sharedHeader)) {
    const sec = project.sharedHeader;
    const html = getSectionEmbedHtml(sec);
    items.push({
      id: sec.id,
      sectionId: sec.id,
      name: sec.name || "Custom HTML (Header)",
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
        items.push({
          id: sec.id,
          sectionId: sec.id,
          name: sec.name || "Custom HTML / Embed",
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
    items.push({
      id: sec.id,
      sectionId: sec.id,
      name: sec.name || "Custom HTML (Footer)",
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

  // 4. Floating Embeds
  (project.floatingWidgets || []).forEach((fw: FloatingWidgetRecord) => {
    if (fw.type === "custom_embed" || fw.snippetHtml) {
      const html = String(fw.snippetHtml || fw.config?.html || "");
      items.push({
        id: fw.id,
        floatingId: fw.id,
        name: fw.name || "Floating Custom Embed",
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
    }
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
