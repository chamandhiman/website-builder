import React from "react";
import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import {
  type YouTubeWidgetData,
  defaultYouTubeWidgetData,
  isYouTubeWidgetData,
  extractYouTubeId,
} from "./YouTubeTypes";
import { buildYouTubeBootstrapMarkup } from "./YouTubeBootstrapExport";

export function YouTube({ data = defaultYouTubeWidgetData }: { data: WidgetData }) {
  const d: YouTubeWidgetData = isYouTubeWidgetData(data) ? data : defaultYouTubeWidgetData;
  const markup = buildYouTubeBootstrapMarkup(d, { editorMode: true });

  if (d.advanced?.visibility === false) return null;

  return (
    <BaseWidget
      data={d}
      widgetType="youtube"
      title="YouTube Video"
      variantLabel={d.content.aspectRatio}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div className="wto-youtube-host w-full" dangerouslySetInnerHTML={{ __html: markup }} />
    </BaseWidget>
  );
}
