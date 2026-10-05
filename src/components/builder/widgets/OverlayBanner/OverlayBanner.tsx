import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultOverlayBannerWidgetData, isOverlayBannerWidgetData } from "./OverlayBannerTypes";
import { buildOverlayBannerBootstrapMarkup } from "./OverlayBannerBootstrapExport";

export interface OverlayBannerProps {
  data: WidgetData;
}

export function OverlayBanner({ data = defaultOverlayBannerWidgetData }: OverlayBannerProps) {
  const bannerData = isOverlayBannerWidgetData(data) ? data : defaultOverlayBannerWidgetData;
  if (bannerData.advanced?.visibility === false) return null;

  const markup = buildOverlayBannerBootstrapMarkup(bannerData, { editorMode: true });

  return (
    <BaseWidget
      data={bannerData}
      widgetType="overlay-banner"
      title="Background Image overlay text banner"
      variantLabel={bannerData.variant}
      wrapperClassName="w-full !p-0 !m-0"
      contentClassName="overflow-visible w-full !p-0 !m-0"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div
        className="wto-overlay-banner-host w-full !p-0 !m-0"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </BaseWidget>
  );
}
