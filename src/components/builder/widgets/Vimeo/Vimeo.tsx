import React from "react";
import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import {
  type VimeoWidgetData,
  defaultVimeoWidgetData,
  isVimeoWidgetData,
} from "./VimeoTypes";
import { buildVimeoBootstrapMarkup } from "./VimeoBootstrapExport";

export function Vimeo({ data = defaultVimeoWidgetData }: { data: WidgetData }) {
  const d: VimeoWidgetData = isVimeoWidgetData(data) ? data : defaultVimeoWidgetData;
  const markup = buildVimeoBootstrapMarkup(d, { editorMode: true });

  if (d.advanced?.visibility === false) return null;

  return (
    <BaseWidget
      data={d}
      widgetType="vimeo"
      title="Vimeo Video"
      variantLabel={d.content.aspectRatio}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div className="wto-vimeo-host w-full" dangerouslySetInnerHTML={{ __html: markup }} />
    </BaseWidget>
  );
}
