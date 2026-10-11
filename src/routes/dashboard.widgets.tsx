import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/widgets")({
  component: DashboardWidgetsLayout,
});

function DashboardWidgetsLayout() {
  return <Outlet />;
}
