import type { WidgetData, WidgetExportContext } from "../widgetRegistry";
import { defaultProgressWidgetData, isProgressWidgetData, clampProgress } from "./ProgressTypes";

const escape = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

export function buildProgressBootstrapMarkup(data: WidgetData = defaultProgressWidgetData, _context?: WidgetExportContext): string {
  const progress = isProgressWidgetData(data) ? data : defaultProgressWidgetData;
  const value = clampProgress(progress.content.value);
  const label = escape(progress.content.label || "Skill");
  const color = escape(String(progress.style.color || "#38bdf8"));
  const background = escape(String(progress.style.backgroundColor || "rgba(255,255,255,.12)"));
  const height = escape(String(progress.style.height || "8px"));
  const radius = escape(String(progress.style.borderRadius || "999px"));
  const textColor = escape(String(progress.style.textColor || "#ffffff"));
  const fontSize = escape(String(progress.style.fontSize || "13px"));
  return `<div class="wto-progress" style="padding:0 0 12px;">
    <div style="display:flex;justify-content:space-between;gap:12px;color:${textColor};font-size:${fontSize};line-height:1.4;margin-bottom:7px;"><span>${label}</span>${progress.content.showValue !== false ? `<span>${value}%</span>` : ""}</div>
    <div role="progressbar" aria-label="${label}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" style="height:${height};background:${background};border-radius:${radius};overflow:hidden;"><div style="width:${value}%;height:100%;background:${color};border-radius:${radius};transition:width 300ms ease;"></div></div>
  </div>`;
}
