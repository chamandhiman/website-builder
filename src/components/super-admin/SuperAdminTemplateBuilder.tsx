"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/lib/auth";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { getTemplate, saveAsTemplate } from "@/services/templates";
import { toast } from "sonner";
import { getAllWidgetRegistrations, getWidgetRegistration, getWidgetBootstrapExport } from "@/components/builder/widgets/widgetRegistry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Plus, Trash2, Copy, ChevronUp, ChevronDown, Save, X } from "lucide-react";

type CreateSearch = {
  templateName?: string;
  templateCategory?: string;
};

export function SuperAdminTemplateBuilder({ 
  templateId, 
  templateName, 
  templateCategory 
}: { 
  templateId?: string; 
  templateName?: string; 
  templateCategory?: string; 
}) {
  const navigate = useNavigate();
  const { user, authReady } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
  const [name, setName] = useState(templateName || "");
  const [category, setCategory] = useState(templateCategory || "");

  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const currentProjectId = useBuilder((s) => s.currentProjectId);
  const selectedSectionId = useBuilder((s) => s.selectedSectionId);

  const page = project?.pages?.[0];
  const templateWidgets = useMemo(() => {
    if (!page) return [];
    return page.sections
      .map((section) => section.widgetInstance)
      .filter((item): item is NonNullable<typeof item> => !!item);
  }, [page?.sections]);

  useEffect(() => {
    if (!authReady) return;

    if (import.meta.env.DEV) {
      console.log("[TemplateBuilder] Debug:", {
        uid: user?.id,
        email: user?.email,
        role: user?.role,
        templateName,
        templateCategory,
      });
    }

    const init = async () => {
      try {
        const resolvedName = templateName || "New Template";
        const resolvedCategory = templateCategory || "";
        setName(resolvedName);
        setCategory(resolvedCategory);
        const projectId = useBuilder.getState().createTemplateProject(resolvedName);
        useBuilder.getState();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [authReady, templateName, templateCategory, user]);

  const handleAddWidget = (typeOrId: string) => {
    useBuilder.getState().addTemplateWidget(typeOrId);
    setWidgetPickerOpen(false);
  };

  const handleDuplicateWidget = (sectionId: string) => {
    const currentProject = useBuilder.getState().currentProject();
    const page = currentProject?.pages?.find((p) => p.id === currentProject.currentPageId);
    if (!page) return;
    const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex < 0) return;
    const section = page.sections[sectionIndex];
    if (!section.widgetInstance) return;
    const newWidget = { ...section.widgetInstance, id: `${section.widgetInstance.type}-${Math.random().toString(36).slice(2, 8)}` };
    const newSectionId = useBuilder.getState().addTemplateWidget(newWidget.type, sectionIndex + 1);
    const newPage = useBuilder.getState().currentProject()?.pages?.find((p) => p.id === currentProject.currentPageId);
    const newSection = newPage?.sections.find((s) => s.id === newSectionId);
    if (newSection?.widgetInstance) {
      useBuilder.getState().updateWidgetInstance(newSection.widgetInstance.id, newWidget);
    }
  };

  const handleDeleteWidget = (sectionId: string) => {
    useBuilder.getState().removeSection(sectionId);
  };

  const handleMoveWidget = (sectionId: string, direction: "up" | "down") => {
    const currentProject = useBuilder.getState().currentProject();
    const page = currentProject?.pages?.find((p) => p.id === currentProject.currentPageId);
    if (!page) return;
    const index = page.sections.findIndex((s) => s.id === sectionId);
    if (index < 0) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= page.sections.length) return;
    useBuilder.getState().moveSection(sectionId, newIndex);
  };

  const handleSaveTemplate = async () => {
    if (!user || !currentProjectId) return;
    const currentProject = useBuilder.getState().currentProject();
    const currentPage = currentProject?.pages?.find((p) => p.id === currentProject.currentPageId);
    if (!currentPage) return;

    const widgets = currentPage.sections
      .map((section) => section.widgetInstance)
      .filter((item): item is NonNullable<typeof item> => !!item);

    if (widgets.length === 0) {
      toast.error("Add at least one widget before saving.");
      return;
    }

    setSaving(true);
    try {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await saveAsTemplate({
        name,
        slug,
        category,
        widgets,
        uid: user.id,
      });
      toast.success("Template saved");
      navigate({ to: "/super-admin/templates" });
    } catch (err) {
      console.error("Failed to save template:", err);
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleExit = () => {
    navigate({ to: "/super-admin/templates" });
  };

  if (!authReady || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#171717] text-[#F5F5F5]">
        <CenteredLoader message="Preparing template builder..." details="This will only take a moment." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#171717] text-[#F5F5F5]">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={handleExit} className="mt-4 text-[#FACC15] underline">
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const registrations = getAllWidgetRegistrations();

  return (
    <div className="flex h-screen w-full flex-col bg-[#171717] text-[#F5F5F5]">
      <div className="flex items-center justify-between border-b border-[#363636] bg-[#1F1F1F] px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#F5F5F5]">Template Builder</span>
          <span className="text-xs text-[#969696]">|</span>
          <span className="text-xs text-[#D0D0D0]">{name || "Untitled"}</span>
          <span className="text-xs text-[#969696]">Category: {category || "Uncategorized"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveTemplate}
            disabled={saving || templateWidgets.length === 0}
            className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-8 rounded-md text-xs font-medium"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Template"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExit}
            className="h-8 rounded-md text-xs text-[#D0D0D0] hover:text-[#F5F5F5] hover:bg-[#242424]"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Exit
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-w-0">
        <div className="flex w-64 flex-col border-r border-[#363636] bg-[#1F1F1F]">
          <div className="border-b border-[#363636] p-3">
            <Button
              size="sm"
              onClick={() => setWidgetPickerOpen(true)}
              className="w-full bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-8 rounded-md text-xs font-medium"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Widget
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {templateWidgets.length === 0 ? (
                <div className="px-2 py-6 text-center text-xs text-[#969696]">
                  No widgets yet. Add widgets to build your template.
                </div>
              ) : (
                templateWidgets.map((widget, index) => {
                  const registration = getWidgetRegistration(widget.type);
                  return (
                    <div
                      key={widget.id}
                      className={`flex items-center gap-1 rounded-md border px-2 py-1.5 ${
                        selectedSectionId === widget.id
                          ? "border-[#FACC15]/40 bg-[#FACC15]/10"
                          : "border-transparent bg-[#171717] hover:border-[#363636]"
                      }`}
                    >
                      <button
                        type="button"
                        className="cursor-grab text-[#646464] hover:text-[#F5F5F5]"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </button>
                      <div
                        className="flex-1 truncate text-xs text-[#F5F5F5] cursor-pointer"
                        onClick={() => useBuilder.getState().selectSection(widget.id)}
                      >
                        {registration?.displayName || widget.type}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveWidget(widget.id, "up")}
                          disabled={index === 0}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-[#969696] hover:text-[#F5F5F5] disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveWidget(widget.id, "down")}
                          disabled={index === templateWidgets.length - 1}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-[#969696] hover:text-[#F5F5F5] disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateWidget(widget.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-[#969696] hover:text-[#F5F5F5]"
                          title="Duplicate"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWidget(widget.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between border-b border-[#363636] bg-[#1F1F1F] px-4 py-2">
            <div className="text-xs text-[#969696]">
              {templateWidgets.length} widget{templateWidgets.length !== 1 ? "s" : ""} in template
            </div>
          </div>
          <div className="canvas-workspace flex flex-1 min-h-0 overflow-auto">
            <div className="flex flex-1 min-h-0 items-center justify-center p-6">
              <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#2B2B2B] bg-white shadow-2xl">
                <iframe
                  title="Template Preview"
                  sandbox=""
                  className="h-full w-full border-0"
                  srcDoc={buildTemplatePreviewSrcDoc(project, selectedSectionId)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 border-l border-[#363636] bg-[#1F1F1F]">
          <div className="border-b border-[#363636] px-4 py-3">
            <h3 className="text-xs font-semibold text-[#F5F5F5]">Properties</h3>
            <p className="text-[10px] text-[#969696]">Select a widget to edit its properties.</p>
          </div>
          <div className="p-4 text-xs text-[#969696]">
            {selectedSectionId ? (
              <p>Widget selected: {selectedSectionId}</p>
            ) : (
              <p>No widget selected. Click a widget in the canvas or widget list to edit its properties.</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={widgetPickerOpen} onOpenChange={setWidgetPickerOpen}>
        <DialogContent className="max-h-[calc(100vh-64px)] w-[calc(100vw-32px)] max-w-[520px] overflow-hidden rounded-[20px] border border-[#363636] bg-[#1F1F1F] p-0 shadow-2xl">
          <DialogHeader className="border-b border-[#363636] px-5 pb-4 pt-5">
            <DialogTitle className="text-base font-semibold text-[#F5F5F5]">Add Widget</DialogTitle>
            <DialogDescription className="text-xs text-[#969696]">
              Choose a widget to add to this template.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="grid grid-cols-2 gap-2 p-4">
              {registrations.map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleAddWidget(reg.type)}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border border-[#363636] bg-[#171717] p-4 text-center transition hover:border-[#FACC15] hover:text-[#FACC15]"
                >
                  <span className="text-xs font-medium text-[#F5F5F5]">{reg.displayName}</span>
                  <span className="text-[10px] text-[#969696] capitalize">{reg.category}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="border-t border-[#363636] px-5 py-3">
            <Button variant="ghost" onClick={() => setWidgetPickerOpen(false)} className="text-[#969696] hover:text-[#F5F5F5] hover:bg-[#242424] h-8 px-3 rounded-md text-xs">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildTemplatePreviewSrcDoc(project: any, selectedId: string | null): string {
  const page = project?.pages?.find((p: any) => p.id === project.currentPageId);
  const sections = page?.sections ?? [];
  const sectionHtml = sections
    .filter((s: any) => !s.collapsed)
    .map((s: any) => {
      const styleStr = s.style ? `style="${Object.entries(s.style).map(([k, v]) => `${k}:${v}`).join(";")}"` : "";
      const selectedClass = selectedId === s.id ? " wto-selected" : "";
      const rawHtml = s.widgetInstance ? getWidgetBootstrapExport(s.widgetInstance.type, s.widgetInstance, { editorMode: true }) || s.html : s.html;
      return `<div data-wto-section="${s.id}" class="wto-section${selectedClass}" ${styleStr}>${rawHtml}</div>`;
    })
    .join("\n");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"></head><body class="m-0 p-0">${sectionHtml}</body></html>`;
}
