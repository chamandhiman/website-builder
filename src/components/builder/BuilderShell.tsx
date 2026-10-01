"use client";

import { useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/lib/auth";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { Canvas } from "./Canvas";
import { AddPageDialog } from "./AddPageDialog";
import { SeoDialog } from "./SeoDialog";
import { RightContextPanel } from "./RightContextPanel";
import { CanvasToolbar } from "./CanvasToolbar";
import type { Page } from "@/lib/builder/store";
import { AppNav } from "@/components/layout/AppNav";
import { Save, Eye, X, Plus, GripVertical, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { saveAsTemplate } from "@/services/templates";
import { getWidgetHtmlFromInstance, getAllWidgetRegistrations, getWidgetRegistration } from "@/components/builder/widgets/widgetRegistry";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BuilderShell({ templateMode, onExit }: { templateMode?: string; onExit?: () => void }) {
  const hydrate = useBuilder((s) => s.hydrate);
  const hydrated = useBuilder((s) => s.hydrated);
  const dark = useBuilder((s) => s.dark);
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const currentProjectId = useBuilder((s) => s.currentProjectId);
  const currentPageId = project?.currentPageId ?? null;
  const pages = project?.pages ?? null;
  const [localSeoModalPageId, setLocalSeoModalPageId] = useState<string | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const hasInitialProjectRef = useRef(false);
  const mounted = useMounted();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isTemplateMode = templateMode === "super_admin";

  const undo = useBuilder((s) => s.undo);
  const redo = useBuilder((s) => s.redo);

  const handleSelectPage = (pageId: string) => {
    useBuilder.getState().selectPage(pageId);
    if (currentProjectId) {
      window.history.replaceState(null, "", `/editor/${currentProjectId}?pageId=${pageId}`);
    }
  };

  const handleAddPage = (name: string, slug: string) => {
    const addPage = useBuilder.getState().addPage;
    const newId = addPage(name, slug);
    if (newId && currentProjectId) {
      window.history.replaceState(null, "", `/editor/${currentProjectId}?pageId=${newId}`);
    }
    return newId;
  };

  const handlePreview = () => {
    if (!project) return;
    const page = project.pages.find((p) => p.id === project.currentPageId) ?? project.pages[0];
    const widgets = page?.sections.map((s) => s.widgetInstance).filter((item): item is NonNullable<typeof item> => !!item) ?? [];
    if (widgets.length === 0) return;

    const html = widgets.map((w) => getWidgetHtmlFromInstance(w)).join("\n");
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      window.alert("Unable to open preview window. Please allow popups.");
      return;
    }
    previewWindow.document.open();
    previewWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Template Preview</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"></head><body class="m-0 p-0">${html}</body></html>`);
    previewWindow.document.close();
  };

  const handleSaveAsTemplate = async () => {
    if (!project || !user) return;
    const page = project.pages.find((p) => p.id === project.currentPageId) ?? project.pages[0];
    const widgets = page?.sections.map((s) => s.widgetInstance).filter((item): item is NonNullable<typeof item> => !!item) ?? [];
    if (widgets.length === 0) {
      window.alert("Add at least one widget before saving.");
      return;
    }

    const templateName = project.name.replace(/^Template:\s*/i, "").trim() || "Untitled Template";
    const slug = templateName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const category = "Template";

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const existingTemplateId = searchParams.get("templateId");
      await saveAsTemplate({
        name: templateName,
        slug,
        category,
        widgets,
        uid: user.id,
        existingTemplateId: existingTemplateId || undefined,
      });
      window.alert(existingTemplateId ? "Template updated successfully." : "Template saved successfully.");
      if (onExit) onExit();
      else navigate({ to: "/super-admin/templates" as never });
    } catch (err) {
      console.error("Failed to save template:", err);
      window.alert("Failed to save template.");
    }
  };

  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);

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

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || !project) return;
    if (!hasInitialProjectRef.current) {
      hasInitialProjectRef.current = true;
      return;
    }
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
  }, [project, hydrated]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onBeforeUnload = () => {};
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hydrated]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (isTemplateMode) {
    const page = project?.pages?.find((p) => p.id === project.currentPageId);
    const templateWidgets = page?.sections.map((s) => s.widgetInstance).filter((item): item is NonNullable<typeof item> => !!item) ?? [];
    const registrations = getAllWidgetRegistrations();

    return (
      <div className="builder-shell flex h-screen w-full flex-col bg-[#171717] text-[#F5F5F5]">
        <div className="flex items-center justify-between border-b border-[#FACC15]/30 bg-[#FACC15]/10 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FACC15]">
              Template Builder
            </span>
            <span className="text-xs text-[#D0D0D0]">Assemble a reusable collection of widgets.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSaveAsTemplate}
              className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-8 rounded-md text-xs font-medium"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Template
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onExit || (() => navigate({ to: "/super-admin/templates" as never }))}
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
          <div className="flex flex-1 min-w-0 flex-col">
            <div className="flex items-center gap-1 border-b border-[#363636] bg-[#1F1F1F] px-3 py-1.5">
              <div className="text-xs text-[#969696]">
                {templateWidgets.length} widget{templateWidgets.length !== 1 ? "s" : ""} in template
              </div>
            </div>
            <div className="canvas-workspace flex flex-1 min-h-0 overflow-auto">
              <div className="flex flex-1 min-h-0 items-center justify-center p-6">
                <div className="relative h-full w-full overflow-hidden rounded-lg border border-[#2B2B2B] bg-white shadow-2xl">
                  <Canvas />
                </div>
              </div>
            </div>
          </div>
          <RightContextPanel />
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

  if (!mounted || !hydrated) {
    return <CenteredLoader details="Initializing editor…" className="bg-[#171717]/50" />;
  }

  return (
    <div className="builder-shell flex h-screen w-full bg-[#171717] text-[#F5F5F5]">
      {/* LEFT SIDEBAR */}
      <AppNav fixed={false} />

      {/* CANVAS SECTION */}
      <div className="builder-canvas-section flex flex-1 min-w-0 flex-col">
        <CanvasToolbar
          project={project}
          pages={pages}
          currentPageId={currentPageId}
          onSelectPage={handleSelectPage}
        />
        <div className="canvas-workspace flex flex-1 min-h-0 overflow-auto">
          <div className="flex flex-1 min-h-0 items-center justify-center p-6">
            <div className="relative h-full w-full   overflow-hidden rounded-lg border border-[#2B2B2B] bg-white shadow-2xl">
              <Canvas />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <RightContextPanel />

      {/* DIALOGS */}
      {pages && (
        <>
          <AddPageDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onAddPage={handleAddPage}
          />
          <SeoDialog
            page={pages.find((pg: Page) => pg.id === localSeoModalPageId) ?? null}
            project={project}
            open={Boolean(localSeoModalPageId)}
            onClose={() => setLocalSeoModalPageId(null)}
          />
        </>
      )}
    </div>
  );
}
