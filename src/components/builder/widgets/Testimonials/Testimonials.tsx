import { useEffect, useRef } from "react";
import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultTestimonialsWidgetData, isTestimonialsWidgetData } from "./TestimonialsTypes";
import { buildTestimonialsBootstrapMarkup } from "./TestimonialsBootstrapExport";
import { attachWidgetInteractivity } from "@/lib/widget-runtime/wtoWidgetRuntime";

export function Testimonials({ data = defaultTestimonialsWidgetData }: { data: WidgetData }) {
  const d = isTestimonialsWidgetData(data) ? data : defaultTestimonialsWidgetData;
  const containerRef = useRef<HTMLDivElement>(null);
  if (d.advanced?.visibility === false) return null;
  const markup = buildTestimonialsBootstrapMarkup(d, { editorMode: true });

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = attachWidgetInteractivity(containerRef.current);
    return cleanup;
  }, [markup]);

  return (
    <BaseWidget data={d} widgetType="testimonials" title="Testimonials" variantLabel={d.variant} wrapperClassName="w-full" contentClassName="overflow-visible" disableSectionWidthStyle={true} as="div">
      <div ref={containerRef} className="wto-testimonials-host w-full" dangerouslySetInnerHTML={{ __html: markup }} />
    </BaseWidget>
  );
}
