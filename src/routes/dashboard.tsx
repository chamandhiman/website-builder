import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth";
import { useBuilder } from "@/lib/builder/store";
import { DashboardThemeProvider } from "@/lib/dashboard-theme";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, authReady } = useAuth();
  const navigate = useNavigate();
  const setShowProjectDashboard = useBuilder((s) => s.setShowProjectDashboard);
  const hydrated = useBuilder((s) => s.hydrated);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      navigate({
        to: "/",
      });
      return;
    }
    if (user.role === "super_admin") {
      navigate({ to: "/super-admin" as never });
    }
  }, [authReady, user, navigate]);

  useEffect(() => {
    if (!hydrated) {
      useBuilder.getState().hydrate();
    }
  }, [hydrated]);

  useEffect(() => {
    if (!authReady) return;
    setShowProjectDashboard(true);
  }, [authReady, setShowProjectDashboard]);

  if (!authReady || !user) {
    return (
      <MainLayout hideHeader hasSidebar={false}>
        <CenteredLoader message="Preparing your website builder…" details="This will only take a moment." />
      </MainLayout>
    );
  }

  return (
    <DashboardThemeProvider>
      <MainLayout hideHeader hasSidebar={false}>
        <AppSidebar>
          <Outlet />
        </AppSidebar>
      </MainLayout>
    </DashboardThemeProvider>
  );
}
