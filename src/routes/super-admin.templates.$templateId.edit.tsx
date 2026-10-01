import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminTemplateBuilder } from "@/components/super-admin/SuperAdminTemplateBuilder";

export const Route = createFileRoute("/super-admin/templates/$templateId/edit")({
  component: SuperAdminTemplateEdit,
});

function SuperAdminTemplateEdit() {
  const { templateId } = Route.useParams();
  return <SuperAdminTemplateBuilder templateId={templateId} />;
}
