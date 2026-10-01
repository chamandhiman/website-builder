import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { getTemplatesForSuperAdmin } from "@/services/templates";
import { getAllWidgetRegistrations } from "@/components/builder/widgets/widgetRegistry";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Puzzle, CheckCircle2, XCircle, Pencil } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/")({
  component: SuperAdminHome,
});

function SuperAdminHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ total: number; published: number; drafts: number; widgetTypes: number }>({ total: 0, published: 0, drafts: 0, widgetTypes: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const templates = await getTemplatesForSuperAdmin();
        if (cancelled) return;
        const published = templates.filter((t) => t.status === "published").length;
        const drafts = templates.filter((t) => t.status === "draft").length;
        const widgetTypes = new Set(templates.flatMap((t) => t.widgets.map((w) => w.type))).size;
        setStats({ total: templates.length, published, drafts, widgetTypes });
        setRecent(templates.slice(0, 5));
      } catch (err) {
        console.error("[SuperAdmin] Failed to load dashboard stats:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const widgetRegistrations = useMemo(() => getAllWidgetRegistrations(), []);

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Super Admin</h1>
        <p className="text-sm text-[#969696]">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Templates", value: stats.total, Icon: Layers },
    { label: "Published", value: stats.published, Icon: CheckCircle2 },
    { label: "Drafts", value: stats.drafts, Icon: XCircle },
    { label: "Widget Types", value: stats.widgetTypes, Icon: Puzzle },
  ];

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#969696]">Welcome, {user?.name || "Super Admin"}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, Icon }) => (
          <Card key={label} className="border-[#363636] bg-[#1F1F1F] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FACC15]/10 text-[#FACC15]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F5F5F5]">{value}</p>
                <p className="text-xs text-[#969696]">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[#F5F5F5]">Recent Templates</h2>
        {recent.length === 0 ? (
          <Card className="border-[#363636] bg-[#1F1F1F] p-6 text-center">
            <p className="text-sm text-[#969696]">No templates yet. Create your first global widget template.</p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((template) => (
              <Card key={template.id} className="flex flex-col border-[#363636] bg-[#1F1F1F] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#F5F5F5]">{template.name}</p>
                    <p className="text-xs text-[#969696] capitalize">{template.category}</p>
                    <p className="text-[10px] text-[#646464]">{template.widgets?.length ?? 0} widgets</p>
                  </div>
                  <Badge
                    variant={template.status === "published" ? "default" : "secondary"}
                    className={
                      template.status === "published"
                        ? "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20"
                        : "bg-[#363636] text-[#969696] border-transparent"
                    }
                  >
                    {template.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#969696]">Updated: {template.updatedAt.toLocaleDateString()}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate({ to: "/super-admin/templates" as never })}
                    className="h-7 px-2 text-[10px] text-[#969696] hover:text-[#F5F5F5]"
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-[#F5F5F5]">Widget Registry</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {widgetRegistrations.map((widget) => (
            <Card key={widget.id} className="border-[#363636] bg-[#1F1F1F] p-4">
              <p className="text-sm font-semibold text-[#F5F5F5]">{widget.displayName}</p>
              <p className="text-xs text-[#969696]">{widget.supportedVariants.length} variants</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
