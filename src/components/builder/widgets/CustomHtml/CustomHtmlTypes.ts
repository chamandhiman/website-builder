import type { WidgetData } from "../widgetRegistry";

export interface CustomHtmlContent extends Record<string, unknown> {
  html: string;
}

export interface CustomHtmlWidgetData extends WidgetData {
  type: "custom-html";
  variant: "default";
  content: CustomHtmlContent;
}

export const defaultCustomHtmlWidgetData: CustomHtmlWidgetData = {
  id: "custom-html-default",
  type: "custom-html",
  variant: "default",
  content: {
    html: "",
  },
  style: {},
  layout: {},
  responsive: {},
  animation: {},
  advanced: {},
};

export function isCustomHtmlWidgetData(data: WidgetData): data is CustomHtmlWidgetData {
  return data.type === "custom-html";
}
