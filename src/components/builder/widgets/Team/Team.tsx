import type { WidgetData } from "../widgetRegistry";
import { BaseWidget } from "../BaseWidget";
import { defaultTeamWidgetData, isTeamWidgetData } from "./TeamTypes";
import { buildTeamBootstrapMarkup } from "./TeamBootstrapExport";

export interface TeamProps {
  data: WidgetData;
}

export function Team({ data = defaultTeamWidgetData }: TeamProps) {
  const teamData = isTeamWidgetData(data) ? data : defaultTeamWidgetData;
  if (teamData.advanced?.visibility === false) return null;

  const markup = buildTeamBootstrapMarkup(teamData, { editorMode: true });

  return (
    <BaseWidget
      data={teamData}
      widgetType="team"
      title="Team"
      variantLabel={teamData.variant}
      wrapperClassName="w-full"
      contentClassName="overflow-visible"
      disableSectionWidthStyle={true}
      as="div"
    >
      <div
        className="wto-team-react-host w-full"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </BaseWidget>
  );
}
