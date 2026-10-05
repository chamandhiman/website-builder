import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultContactWidgetData, isContactWidgetData } from "./ContactTypes";
import { buildContactBootstrapMarkup } from "./ContactBootstrapExport";

export interface ContactProps {
  data: WidgetData;
}

export function Contact({ data = defaultContactWidgetData }: ContactProps) {
  const contactData = isContactWidgetData(data) ? data : defaultContactWidgetData;
  if (contactData.advanced?.visibility === false) return null;

  const markup = buildContactBootstrapMarkup(contactData, { editorMode: true });

  return (
    <BaseWidget
      data={contactData}
      widgetType="contact"
      title="Contact"
      variantLabel={contactData.variant}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div
        className="wto-contact-react-host w-full"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </BaseWidget>
  );
}
