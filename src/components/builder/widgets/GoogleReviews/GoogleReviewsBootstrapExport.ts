import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import {
  defaultGoogleReviewsWidgetData,
  isGoogleReviewsWidgetData,
  type GoogleReviewsWidgetData,
} from "./GoogleReviewsTypes";
import { renderGoogleReviewsHtml } from "@/lib/widget-runtime/wtoWidgetRuntime";
import { getWidget, createNewGoogleReviewsWidget } from "@/services/widgetService";

function escapeHtml(v: string | number | boolean | undefined | null) {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildGoogleReviewsBootstrapMarkup(
  data: WidgetData = defaultGoogleReviewsWidgetData,
  context?: WidgetExportContext,
): string {
  const d = isGoogleReviewsWidgetData(data) ? data : defaultGoogleReviewsWidgetData;
  if (d.advanced?.visibility === false) return "";

  const widgetId = (d.content?.widgetId as string) || "wgt_google_default";
  const widgetName = (d.content?.widgetName as string) || "My Google Reviews";

  // Check if we have cached local widget data
  let localWidget = null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("wto_dynamic_widgets_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        localWidget = parsed[widgetId];
      }
    } catch (e) {}
  }

  // If we have published/draft widget configuration, render the live dynamic HTML representation
  if (localWidget) {
    const rendered = renderGoogleReviewsHtml(localWidget);
    return `
      <section class="wto-google-reviews-section wto-google-reviews" data-wto-widget="${escapeHtml(widgetId)}">
        ${rendered.html}
      </section>
    `.trim();
  }

  // Fallback default dynamic representation
  const defaultSample = createNewGoogleReviewsWidget(widgetName);
  defaultSample.id = widgetId;
  const rendered = renderGoogleReviewsHtml(defaultSample);

  return `
    <section class="wto-google-reviews-section wto-google-reviews" data-wto-widget="${escapeHtml(widgetId)}">
      ${rendered.html}
    </section>
  `.trim();
}
