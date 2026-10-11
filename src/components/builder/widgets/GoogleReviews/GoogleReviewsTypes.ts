import type { WidgetData } from "../widgetRegistry";

export interface GoogleReviewsEmbedContent extends Record<string, unknown> {
  widgetId: string; // e.g. "wgt_google_8f73ab29"
  widgetName?: string;
  status?: "published" | "draft";
}

export interface GoogleReviewsWidgetData extends WidgetData {
  type: "google-reviews";
  content: GoogleReviewsEmbedContent;
  style: Record<string, unknown>;
}

export const defaultGoogleReviewsWidgetData: GoogleReviewsWidgetData = {
  id: "google-reviews-placeholder",
  type: "google-reviews",
  variant: "Dynamic Embed",
  content: {
    widgetId: "wgt_google_default",
    widgetName: "My Google Reviews",
    status: "published",
  },
  style: {},
  layout: {
    paddingTop: "40px",
    paddingBottom: "40px",
    paddingX: "20px",
  },
  responsive: {},
  animation: {},
  advanced: {
    visibility: true,
  },
};

export function isGoogleReviewsWidgetData(data: unknown): data is GoogleReviewsWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as WidgetData).type === "google-reviews"
  );
}
