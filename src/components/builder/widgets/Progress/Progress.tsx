import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { buildProgressBootstrapMarkup } from "./ProgressBootstrapExport";
import { defaultProgressWidgetData, isProgressWidgetData } from "./ProgressTypes";

export function Progress({ data = defaultProgressWidgetData }: { data: WidgetData }) {
  const progress = isProgressWidgetData(data) ? data : defaultProgressWidgetData;
  if (progress.advanced.visibility === false) return null;
  return (
    <BaseWidget data={progress} widgetType="progress" title="Progress" variantLabel={progress.variant} wrapperClassName="w-full" contentClassName="overflow-visible">
      <div className="w-full" dangerouslySetInnerHTML={{ __html: buildProgressBootstrapMarkup(progress, { editorMode: true }) }} />
    </BaseWidget>
  );
}
