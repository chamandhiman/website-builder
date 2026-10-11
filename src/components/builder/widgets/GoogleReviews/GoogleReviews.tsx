import { useEffect, useRef, useState } from "react";
import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultGoogleReviewsWidgetData, isGoogleReviewsWidgetData } from "./GoogleReviewsTypes";
import { buildGoogleReviewsBootstrapMarkup } from "./GoogleReviewsBootstrapExport";
import { getWidget, type WidgetInstanceRecord } from "@/services/widgetService";
import { attachWidgetInteractivity } from "@/lib/widget-runtime/wtoWidgetRuntime";

export function GoogleReviews({ data = defaultGoogleReviewsWidgetData }: { data: WidgetData }) {
  const d = isGoogleReviewsWidgetData(data) ? data : defaultGoogleReviewsWidgetData;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = (d.content?.widgetId as string) || "wgt_google_default";
  const [liveWidget, setLiveWidget] = useState<WidgetInstanceRecord | null>(null);

  useEffect(() => {
    let mounted = true;
    getWidget(widgetId).then((w) => {
      if (mounted && w) {
        setLiveWidget(w);
      }
    });

    const handleSaved = (e: any) => {
      if (e?.detail?.widgetId === widgetId) {
        getWidget(widgetId).then((w) => {
          if (mounted && w) setLiveWidget(w);
        });
      }
    };
    window.addEventListener("wto-widget-saved", handleSaved);
    return () => {
      mounted = false;
      window.removeEventListener("wto-widget-saved", handleSaved);
    };
  }, [widgetId]);

  const markup = buildGoogleReviewsBootstrapMarkup(d, { editorMode: true });

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = attachWidgetInteractivity(containerRef.current);
    return cleanup;
  }, [markup, liveWidget]);

  if (d.advanced?.visibility === false) return null;

  return (
    <BaseWidget
      data={d}
      widgetType="google-reviews"
      title="Google Reviews"
      variantLabel="Dynamic Widget"
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div ref={containerRef} className="wto-google-reviews-host w-full" dangerouslySetInnerHTML={{ __html: markup }} />
    </BaseWidget>
  );
}
