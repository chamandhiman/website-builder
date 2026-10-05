import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getTemplate } from "@/services/templates";
import { useBuilder, type PageSection } from "@/lib/builder/store";
import { getWidgetRegistration, getWidgetBootstrapExport } from "@/components/builder/widgets/widgetRegistry";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { toast } from "sonner";

export const Route = createFileRoute("/super-admin/templates/$templateId/edit")({
  component: SuperAdminTemplateEdit,
});

function SuperAdminTemplateEdit() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAndRedirect() {
      try {
        const template = await getTemplate(templateId);
        if (cancelled) return;
        if (!template) {
          setError("Template not found");
          toast.error("Template not found");
          navigate({ to: "/super-admin/templates" });
          return;
        }

        const projectId = useBuilder.getState().createTemplateProject(template.name);
        const state = useBuilder.getState();
        const project = state.currentProject();
        const page = project?.pages?.[0];

        if (project) {
          let updatedPages = project.pages;
          if (template.pages && template.pages.length > 0) {
            updatedPages = template.pages;
          } else if (page && template.widgets?.length > 0) {
            const sections: PageSection[] = template.widgets.map((widget) => {
              const reg = getWidgetRegistration(widget.type);
              let html = "";
              try {
                html = getWidgetBootstrapExport(widget.type, widget);
              } catch {
                html = `<section class="py-5"><div class="container text-center">${reg?.displayName ?? widget.type}</div></section>`;
              }
              return {
                id: widget.id,
                templateId: "",
                name: reg?.displayName || widget.type,
                html,
                widgetInstance: widget as any,
                animation: { type: "fade-up" as const, duration: 700, delay: 0 },
              };
            });

            updatedPages = project.pages.map((p) =>
              p.id === page.id ? { ...p, sections } : p
            );
          }

          useBuilder.setState((s) => ({
            projects: {
              ...s.projects,
              [project.id]: {
                ...project,
                pages: updatedPages,
                currentPageId: updatedPages[0]?.id || project.currentPageId,
              },
            },
          }));
          useBuilder.getState().persist();
        }

        navigate({
          to: "/editor/$projectId",
          params: { projectId },
          search: {
            templateMode: "true",
            templateId: template.id,
            templateName: template.name,
            templateCategory: template.category,
          } as any,
        });
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load template for edit:", err);
        setError("Failed to load template");
        toast.error("Failed to open template in editor");
      }
    }

    void loadAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [templateId, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#171717] text-[#F5F5F5]">
      <CenteredLoader
        message={error ? error : "Loading template into builder…"}
        details={error ? "Redirecting back to templates list." : "Preparing all widget sections and properties."}
      />
    </div>
  );
}
