import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SuperAdminTemplateBuilder } from "@/components/super-admin/SuperAdminTemplateBuilder";

export const Route = createFileRoute("/super-admin/templates/create")({
  component: SuperAdminTemplateCreateRoute,
});

function SuperAdminTemplateCreateRoute() {
  const search = useSearch();
  const templateName = (search as any)?.templateName as string | undefined;
  const templateCategory = (search as any)?.templateCategory as string | undefined;

  return <SuperAdminTemplateBuilder templateName={templateName} templateCategory={templateCategory} />;
}
