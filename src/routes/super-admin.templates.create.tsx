import { createFileRoute } from "@tanstack/react-router";
import { CreateTemplatePage } from "@/components/super-admin/CreateTemplatePage";

export const Route = createFileRoute("/super-admin/templates/create")({
  component: SuperAdminTemplateCreateRoute,
});

function SuperAdminTemplateCreateRoute() {
  return <CreateTemplatePage />;
}
