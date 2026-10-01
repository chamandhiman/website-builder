import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/templates")({
  component: SuperAdminTemplatesLayout,
});

function SuperAdminTemplatesLayout() {
  return <Outlet />;
}
