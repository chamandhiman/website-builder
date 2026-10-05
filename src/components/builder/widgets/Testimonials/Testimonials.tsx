import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultTestimonialsWidgetData, isTestimonialsWidgetData } from "./TestimonialsTypes";
import { buildTestimonialsBootstrapMarkup } from "./TestimonialsBootstrapExport";

export function Testimonials({ data = defaultTestimonialsWidgetData }: { data: WidgetData }) {
  const d = isTestimonialsWidgetData(data) ? data : defaultTestimonialsWidgetData;
  if (d.advanced?.visibility === false) return null;
  const markup = buildTestimonialsBootstrapMarkup(d, { editorMode: true });
  return (
    <BaseWidget data={d} widgetType="testimonials" title="Testimonials" variantLabel={d.variant} wrapperClassName="w-full" contentClassName="overflow-visible" disableSectionWidthStyle={true} as="div">
      <div className="wto-testimonials-host w-full" dangerouslySetInnerHTML={{ __html: markup }} />
    </BaseWidget>
  );
}
