import type { WidgetData } from "../widgetRegistry";

export interface CustomHtmlContent extends Record<string, unknown> {
  html: string;
  widthMode?: "full" | "custom";
  maxWidth?: string;
  heightMode?: "auto" | "custom";
  customHeight?: string;
  borderRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
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
    widthMode: "full",
    maxWidth: "1000px",
    heightMode: "auto",
    customHeight: "400px",
    borderRadius: 0,
    paddingTop: 24,
    paddingBottom: 24,
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
