import type { WidgetData } from "../widgetRegistry";
import { PropertyPanel } from "@/components/builder/property-panel/PropertyPanel";
import { ColorControl, NumberControl, TextControl, ToggleControl } from "@/components/builder/property-controls";
import { defaultProgressWidgetData, isProgressWidgetData, type ProgressWidgetData } from "./ProgressTypes";

export function ProgressProperties({ value = defaultProgressWidgetData, onChange, onClose }: { value: WidgetData; onChange: (next: WidgetData) => void; onClose?: () => void }) {
  const progress = isProgressWidgetData(value) ? value : defaultProgressWidgetData;
  const updateContent = (patch: Partial<ProgressWidgetData["content"]>) => onChange({ ...progress, content: { ...progress.content, ...patch } });
  const updateStyle = (patch: Partial<ProgressWidgetData["style"]>) => onChange({ ...progress, style: { ...progress.style, ...patch } });
  return (
    <PropertyPanel
      title="Progress"
      onClose={onClose}
      content={<div className="space-y-2.5"><TextControl label="Skill name" value={String(progress.content.label ?? "")} onChange={(label) => updateContent({ label })} /><NumberControl label="Progress" value={Number(progress.content.value ?? 0)} min={0} max={100} onChange={(value) => updateContent({ value })} /><ToggleControl label="Show percentage" checked={progress.content.showValue !== false} onChange={(showValue) => updateContent({ showValue })} /></div>}
      style={<div className="space-y-2.5"><ColorControl label="Progress color" value={String(progress.style.color ?? "#38bdf8")} onChange={(color) => updateStyle({ color })} /><ColorControl label="Track color" value={String(progress.style.backgroundColor ?? "#334155")} onChange={(backgroundColor) => updateStyle({ backgroundColor })} /><TextControl label="Bar height" value={String(progress.style.height ?? "8px")} onChange={(height) => updateStyle({ height })} /><TextControl label="Border radius" value={String(progress.style.borderRadius ?? "999px")} onChange={(borderRadius) => updateStyle({ borderRadius })} /><ColorControl label="Label color" value={String(progress.style.textColor ?? "#ffffff")} onChange={(textColor) => updateStyle({ textColor })} /><TextControl label="Typography size" value={String(progress.style.fontSize ?? "13px")} onChange={(fontSize) => updateStyle({ fontSize })} /></div>}
    />
  );
}
