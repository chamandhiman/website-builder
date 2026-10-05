import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultPricingWidgetData, isPricingWidgetData } from "./PricingTypes";
import { buildPricingBootstrapMarkup } from "./PricingBootstrapExport";

export interface PricingProps {
  data: WidgetData;
}

export function Pricing({ data = defaultPricingWidgetData }: PricingProps) {
  const pricingData = isPricingWidgetData(data) ? data : defaultPricingWidgetData;
  if (pricingData.advanced?.visibility === false) return null;

  const markup = buildPricingBootstrapMarkup(pricingData, { editorMode: true });

  return (
    <BaseWidget
      data={pricingData}
      widgetType="pricing"
      title="Pricing"
      variantLabel={pricingData.variant}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div
        className="wto-pricing-react-host w-full"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </BaseWidget>
  );
}
