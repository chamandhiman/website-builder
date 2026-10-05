import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultMapWidgetData, isMapWidgetData } from "./MapTypes";
import { buildMapBootstrapMarkup } from "./MapBootstrapExport";

export interface MapProps {
  data: WidgetData;
}

export function MapWidget({ data = defaultMapWidgetData }: MapProps) {
  const mapData = isMapWidgetData(data) ? data : defaultMapWidgetData;
  if (mapData.advanced?.visibility === false) return null;

  const markup = buildMapBootstrapMarkup(mapData, { editorMode: true });

  return (
    <BaseWidget
      data={mapData}
      widgetType="map"
      title="Google Map"
      variantLabel={mapData.variant}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div
        className="wto-map-react-host w-full"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </BaseWidget>
  );
}
