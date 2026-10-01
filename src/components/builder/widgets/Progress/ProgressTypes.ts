import type { WidgetData } from "../widgetRegistry";

export interface ProgressContent extends Record<string, unknown> {
  label?: string;
  value?: number;
  showValue?: boolean;
}

export interface ProgressStyle extends Record<string, unknown> {
  color?: string;
  backgroundColor?: string;
  height?: string;
  borderRadius?: string;
  textColor?: string;
  fontSize?: string;
}

export interface ProgressWidgetData extends WidgetData {
  type: "progress";
  content: ProgressContent;
  style: ProgressStyle;
}

export function isProgressWidgetData(value: unknown): value is ProgressWidgetData {
  return Boolean(value && typeof value === "object" && (value as { type?: string }).type === "progress");
}

export const defaultProgressWidgetData: ProgressWidgetData = {
  id: "progress-default",
  type: "progress",
  variant: "Bar",
  content: { label: "UI/UX Design", value: 85, showValue: true },
  style: {
    color: "#38bdf8",
    backgroundColor: "rgba(255,255,255,.12)",
    height: "8px",
    borderRadius: "999px",
    textColor: "#ffffff",
    fontSize: "13px",
  },
  layout: { paddingTop: "0px", paddingBottom: "12px" },
  responsive: {},
  animation: { enabled: false, type: "none", duration: 400, delay: 0 },
  advanced: { id: "", className: "", visibility: true },
};

export function clampProgress(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, number)) : 0;
}
