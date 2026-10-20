import React from "react";
import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import {
  type StoreLocatorWidgetData,
  defaultStoreLocatorWidgetData,
  isStoreLocatorWidgetData,
} from "./StoreLocatorTypes";
import { buildStoreLocatorBootstrapMarkup } from "./StoreLocatorBootstrapExport";

export function StoreLocator({ data = defaultStoreLocatorWidgetData }: { data: WidgetData }) {
  const d: StoreLocatorWidgetData = isStoreLocatorWidgetData(data)
    ? data
    : defaultStoreLocatorWidgetData;

  const markup = buildStoreLocatorBootstrapMarkup(d, { editorMode: true });

  if (d.advanced?.visibility === false) return null;

  return (
    <BaseWidget
      data={d}
      widgetType="store_locator"
      title="Store Locator"
      variantLabel={d.content.layout}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div className="wto-store-locator-host w-full" dangerouslySetInnerHTML={{ __html: markup }} />
    </BaseWidget>
  );
}
