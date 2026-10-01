import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/super-admin/settings")({
  component: SuperAdminSettings,
});

function SuperAdminSettings() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Settings</h1>
        <p className="mt-1 text-sm text-[#969696]">Super Admin account and template settings.</p>
      </div>

      <Card className="border-[#363636] bg-[#1F1F1F] p-6">
        <h2 className="text-base font-semibold text-[#F5F5F5]">Account</h2>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#969696]">Email</p>
            <p className="mt-1 text-sm text-[#F5F5F5]">{user?.email || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#969696]">Role</p>
            <p className="mt-1 text-sm text-[#F5F5F5] capitalize">{user?.role || "—"}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={async () => { await logout(); }}
            className="border-[#363636] text-[#F5F5F5] hover:bg-[#242424]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </Card>

      <Card className="border-[#363636] bg-[#1F1F1F] p-6">
        <h2 className="text-base font-semibold text-[#F5F5F5]">Template Settings</h2>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#969696]">Default Visibility</p>
            <p className="mt-1 text-sm text-[#F5F5F5]">New templates are created as Draft by default.</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#969696]">Published Templates</p>
            <p className="mt-1 text-sm text-[#F5F5F5]">Published templates are available to all users.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
