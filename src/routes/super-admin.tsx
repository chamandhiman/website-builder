import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { MainLayout } from "@/components/layout/MainLayout";
import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/super-admin")({
  component: SuperAdminRootLayout,
});

function SuperAdminRootLayout() {
  const { user, authReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady) return;
    if (!user || user.role !== "super_admin") {
      navigate({ to: "/dashboard" as never });
    }
  }, [authReady, user, navigate]);

  if (!authReady) {
    return (
      <MainLayout hideHeader hasSidebar>
        <CenteredLoader message="Loading Super Admin…" details="Verifying access." />
      </MainLayout>
    );
  }

  if (!user || user.role !== "super_admin") {
    return null;
  }

  return (
    <SuperAdminLayout>
      <Outlet />
    </SuperAdminLayout>
  );
}
