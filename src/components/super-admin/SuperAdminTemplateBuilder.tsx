"use client";

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useBuilder, type PageSection } from "@/lib/builder/store";
import { useAuth } from "@/lib/auth";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { getTemplate, saveAsTemplate } from "@/services/templates";
import { toast } from "sonner";
import {
  getAllWidgetRegistrations,
  getWidgetRegistration,
  getWidgetBootstrapExport,
  getWidgetPropertiesComponent,
  type WidgetRegistration,
} from "@/components/builder/widgets/widgetRegistry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Save,
  X,
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Sparkles,
} from "lucide-react";

type ViewportMode = "desktop" | "tablet" | "mobile";

export function SuperAdminTemplateBuilder({
  templateId,
  templateName,
  templateCategory,
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
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("All");

  // Drag and drop state for left sidebar
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

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

  // All widget registrations from widgetRegistry (Single source of truth)
  const allRegistrations = useMemo(() => getAllWidgetRegistrations(), []);

  // Distinct categories from existing registrations
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allRegistrations.map((r) => r.category).filter(Boolean)));
    return ["All", ...cats];
  }, [allRegistrations]);

  // Filtered widgets for the picker modal
  const filteredRegistrations = useMemo(() => {
    let list = allRegistrations;
    if (selectedCategoryTab !== "All") {
      list = list.filter((r) => r.category === selectedCategoryTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.displayName.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allRegistrations, selectedCategoryTab, searchQuery]);

  // Grouped widgets by category for display in the picker
  const groupedWidgets = useMemo(() => {
    const groups: Record<string, WidgetRegistration[]> = {};
    filteredRegistrations.forEach((reg) => {
      const cat = reg.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(reg);
    });
    return groups;
  }, [filteredRegistrations]);

  // Initialize or load template
  useEffect(() => {
    if (!authReady) return;

    const init = async () => {
      try {
        let resolvedName = templateName || "New Template";
        let resolvedCategory = templateCategory || "";
        let existingWidgets: any[] = [];

        if (templateId) {
          const tpl = await getTemplate(templateId);
          if (tpl) {
            resolvedName = tpl.name;
            resolvedCategory = tpl.category;
            existingWidgets = tpl.widgets || [];
          }
        }

        setName(resolvedName);
        setCategory(resolvedCategory);

        useBuilder.getState().createTemplateProject(resolvedName);

        if (existingWidgets.length > 0) {
          existingWidgets.forEach((w) => {
            const sectionId = w.id || `template-${nanoid(8)}`;
            const reg = getWidgetRegistration(w.type);
            const section: PageSection = {
              id: sectionId,
              templateId: "",
              name: reg?.displayName || w.type,
              html: "",
              widgetInstance: { ...w, id: sectionId },
              animation: { type: "fade-up", duration: 700, delay: 0 },
            };
            const currentProj = useBuilder.getState().currentProject();
            const curPage = currentProj?.pages?.[0];
            if (curPage) {
              const nextSections = [...curPage.sections, section];
              const updatedPages = currentProj.pages.map((p) =>
                p.id === curPage.id ? { ...p, sections: nextSections } : p
              );
              useBuilder.setState((s) => ({
                projects: {
                  ...s.projects,
                  [currentProj.id]: {
                    ...currentProj,
                    pages: updatedPages,
                  },
                },
              }));
            }
          });

          const firstSection = useBuilder.getState().currentProject()?.pages?.[0]?.sections?.[0];
          if (firstSection) {
            useBuilder.getState().selectSection(firstSection.id);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [authReady, templateId, templateName, templateCategory]);

  // Listen to postMessage from canvas preview for section click
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TEMPLATE_SECTION_CLICK" && event.data.sectionId) {
        useBuilder.getState().selectSection(event.data.sectionId);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleAddWidget = (typeOrId: string) => {
    const sectionId = useBuilder.getState().addTemplateWidget(typeOrId);
    setWidgetPickerOpen(false);
    const reg = getWidgetRegistration(typeOrId);
    toast.success(`Added ${reg?.displayName || typeOrId} to template`);
  };

  const handleDuplicateWidget = (sectionId: string) => {
    useBuilder.getState().duplicateSection(sectionId);
    toast.success("Widget duplicated");
  };

  const handleDeleteWidget = (sectionId: string) => {
    const section = page?.sections.find((s) => s.id === sectionId);
    const reg = section?.widgetInstance ? getWidgetRegistration(section.widgetInstance.type) : null;
    useBuilder.getState().removeSection(sectionId);
    toast.success(`Removed ${reg?.displayName || "widget"} from template`);
  };

  const handleMoveWidget = (sectionId: string, direction: "up" | "down") => {
    if (!page) return;
    const index = page.sections.findIndex((s) => s.id === sectionId);
    if (index < 0) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= page.sections.length) return;
    useBuilder.getState().moveSection(index, newIndex);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedIdx ?? Number(e.dataTransfer.getData("text/plain"));
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      useBuilder.getState().moveSection(sourceIndex, targetIndex);
    }
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleSaveTemplate = async () => {
    if (!user || !currentProjectId) return;
    const currentProject = useBuilder.getState().currentProject();
    const currentPage = currentProject?.pages?.find((p) => p.id === currentProject.currentPageId) ?? currentProject?.pages?.[0];
    if (!currentPage) return;

    const widgets = currentPage.sections
      .map((section) => section.widgetInstance)
      .filter((item): item is NonNullable<typeof item> => !!item);

    if (widgets.length === 0) {
      toast.error("Add at least one widget before saving.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a template name.");
      return;
    }

    setSaving(true);
    try {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await saveAsTemplate({
        name: name.trim(),
        slug,
        category: category.trim() || "General",
        widgets,
        uid: user.id,
        existingTemplateId: templateId || undefined,
      });
      toast.success(templateId ? "Template updated successfully" : "Template saved successfully");
      navigate({ to: "/super-admin/templates" });
    } catch (err: any) {
      console.error("Failed to save template:", err);
      toast.error(err?.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleExit = () => {
    navigate({ to: "/super-admin/templates" });
  };

  // Find currently selected section & widget
  const selectedSection = page?.sections.find((s) => s.id === selectedSectionId) ?? null;
  const selectedWidget = selectedSection?.widgetInstance ?? null;
  const SelectedWidgetProperties = selectedWidget ? getWidgetPropertiesComponent(selectedWidget.type) : null;

  if (!authReady || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#171717] text-[#F5F5F5]">
        <CenteredLoader message="Preparing template builder..." details="Loading template workspace." />
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

  return (
    <div className="flex h-screen w-full flex-col bg-[#171717] text-[#F5F5F5]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-[#363636] bg-[#1F1F1F] px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FACC15] bg-[#FACC15]/10 px-2 py-0.5 rounded border border-[#FACC15]/20">
            Template Builder
          </span>
          <span className="text-xs text-[#525252]">/</span>
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template Name"
              className="h-7 w-48 rounded-md border-[#363636] bg-[#171717] px-2 text-xs font-medium text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
            />
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. Marketing)"
              className="h-7 w-36 rounded-md border-[#363636] bg-[#171717] px-2 text-xs text-[#D0D0D0] placeholder:text-[#646464] focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
            />
          </div>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1 rounded-lg border border-[#363636] bg-[#171717] p-0.5">
          <button
            type="button"
            onClick={() => setViewportMode("desktop")}
            className={`flex h-6 w-7 items-center justify-center rounded transition ${
              viewportMode === "desktop" ? "bg-[#FACC15] text-[#111111]" : "text-[#969696] hover:text-[#F5F5F5]"
            }`}
            title="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("tablet")}
            className={`flex h-6 w-7 items-center justify-center rounded transition ${
              viewportMode === "tablet" ? "bg-[#FACC15] text-[#111111]" : "text-[#969696] hover:text-[#F5F5F5]"
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            className={`flex h-6 w-7 items-center justify-center rounded transition ${
              viewportMode === "mobile" ? "bg-[#FACC15] text-[#111111]" : "text-[#969696] hover:text-[#F5F5F5]"
            }`}
            title="Mobile view (390px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSaveTemplate}
            disabled={saving || templateWidgets.length === 0}
            className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-8 rounded-md text-xs font-semibold shadow-sm transition"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {saving ? "Saving Template..." : "Save Template"}
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

      {/* Main 3-Column Studio Layout */}
      <div className="flex flex-1 min-h-0 min-w-0">
        {/* Left Sidebar: Widget List & Add Widget Button */}
        <div className="flex w-72 flex-col border-r border-[#363636] bg-[#1F1F1F] shrink-0">
          <div className="border-b border-[#363636] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#969696]">
              <span className="font-semibold text-[#D0D0D0] flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#FACC15]" />
                Template Sections
              </span>
              <span className="rounded-full bg-[#242424] px-2 py-0.5 text-[10px] font-medium text-[#F5F5F5]">
                {templateWidgets.length}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setWidgetPickerOpen(true)}
              className="w-full bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-8 rounded-md text-xs font-semibold shadow-sm"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Widget
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1.5 p-2.5">
              {templateWidgets.length === 0 ? (
                <div className="px-3 py-10 text-center text-xs text-[#969696]">
                  <p className="font-medium text-[#D0D0D0]">No widgets added yet</p>
                  <p className="mt-1 text-[11px] text-[#646464]">
                    Click "Add Widget" above to begin assembling your template.
                  </p>
                </div>
              ) : (
                page?.sections
                  .filter((s) => !!s.widgetInstance)
                  .map((section, index) => {
                    const widget = section.widgetInstance!;
                    const registration = getWidgetRegistration(widget.type);
                    const isSelected = selectedSectionId === section.id;
                    const isDragged = draggedIdx === index;
                    const isOver = dragOverIdx === index;

                    return (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`group relative flex items-center gap-1.5 rounded-lg border px-2.5 py-2 transition-all cursor-pointer ${
                          isDragged ? "opacity-30" : ""
                        } ${
                          isOver ? "border-t-2 border-t-[#FACC15]" : ""
                        } ${
                          isSelected
                            ? "border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15] shadow-sm shadow-[#FACC15]/5"
                            : "border-[#363636] bg-[#171717] hover:border-[#525252] text-[#F5F5F5]"
                        }`}
                        onClick={() => useBuilder.getState().selectSection(section.id)}
                      >
                        <div
                          className="cursor-grab text-[#646464] hover:text-[#F5F5F5] active:cursor-grabbing p-0.5"
                          title="Drag to reorder"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="h-3.5 w-3.5" />
                        </div>

                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#242424] text-[10px] font-semibold text-[#969696]">
                          {index + 1}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="truncate text-xs font-medium">
                            {registration?.displayName || widget.type}
                          </div>
                          <div className="text-[10px] text-[#969696] capitalize truncate">
                            {registration?.category || "General"}
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 opacity-90 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleMoveWidget(section.id, "up")}
                            disabled={index === 0}
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-[#969696] hover:text-[#F5F5F5] hover:bg-[#2B2B2B] disabled:opacity-20"
                            title="Move up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveWidget(section.id, "down")}
                            disabled={index === (page?.sections.length ?? 0) - 1}
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-[#969696] hover:text-[#F5F5F5] hover:bg-[#2B2B2B] disabled:opacity-20"
                            title="Move down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateWidget(section.id)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-[#969696] hover:text-[#F5F5F5] hover:bg-[#2B2B2B]"
                            title="Duplicate"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWidget(section.id)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Remove"
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

        {/* Center Canvas Workspace */}
        <div className="flex flex-1 flex-col min-w-0 bg-[#121212]">
          <div className="flex items-center justify-between border-b border-[#363636] bg-[#1F1F1F] px-4 py-1.5 shrink-0 text-xs text-[#969696]">
            <span>
              Preview: <strong className="text-[#F5F5F5]">{name || "Untitled"}</strong> ({templateWidgets.length} sections)
            </span>
            <span className="text-[11px] text-[#646464]">
              Tip: Click on any section in the preview to edit its properties
            </span>
          </div>

          <div className="flex flex-1 min-h-0 overflow-auto items-center justify-center p-6">
            {templateWidgets.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="max-w-md rounded-2xl border border-[#363636] bg-[#1F1F1F] p-8 shadow-xl">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#363636] bg-[#242424] text-[#FACC15] mb-4">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-semibold text-[#F5F5F5]">Build Your Template</h3>
                  <p className="mt-2 text-xs text-[#969696] leading-relaxed">
                    Assemble your template by adding widgets like Header, Hero, Services, FAQ, Gallery, and Footer.
                    Stack as many widgets as you need.
                  </p>
                  <Button
                    onClick={() => setWidgetPickerOpen(true)}
                    className="mt-5 bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 px-5 rounded-lg text-xs font-semibold shadow-md"
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add First Widget
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`relative h-full overflow-hidden rounded-lg border border-[#363636] bg-white shadow-2xl transition-all duration-200 ${
                  viewportMode === "mobile"
                    ? "w-[390px]"
                    : viewportMode === "tablet"
                      ? "w-[768px]"
                      : "w-full"
                }`}
              >
                <iframe
                  title="Template Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="h-full w-full border-0"
                  srcDoc={buildTemplatePreviewSrcDoc(project, selectedSectionId)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 border-l border-[#363636] bg-[#1F1F1F] shrink-0 flex flex-col">
          {selectedWidget && SelectedWidgetProperties ? (
            <div className="flex h-full flex-col min-h-0 bg-[#1F1F1F] text-[#F5F5F5]">
              <div className="flex items-center justify-between border-b border-[#363636] px-4 py-2.5 shrink-0 bg-[#1F1F1F]">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FACC15]" />
                    <h3 className="truncate text-xs font-semibold text-[#F5F5F5]">
                      {getWidgetRegistration(selectedWidget.type)?.displayName || selectedWidget.type}
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#969696] truncate capitalize">
                    {getWidgetRegistration(selectedWidget.type)?.category || "Widget"} Properties
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => useBuilder.getState().selectSection(null)}
                  className="rounded p-1 text-[#969696] hover:bg-[#2B2B2B] hover:text-[#F5F5F5] transition"
                  title="Deselect section"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <SelectedWidgetProperties
                  value={selectedWidget}
                  onClose={() => useBuilder.getState().selectSection(null)}
                  onChange={(nextValue) => {
                    useBuilder.getState().updateWidgetInstance(selectedWidget.id, nextValue);
                    useBuilder.getState().pushHistory();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col bg-[#1F1F1F] p-4 text-[#F5F5F5]">
              <div className="border-b border-[#363636] pb-3">
                <h3 className="text-xs font-semibold text-[#F5F5F5]">Properties</h3>
                <p className="text-[10px] text-[#969696]">Select a widget to edit its properties.</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="h-10 w-10 rounded-full border border-[#363636] bg-[#242424] flex items-center justify-center text-[#969696] mb-3">
                  <Layers className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-[#D0D0D0] mb-1">No Widget Selected</p>
                <p className="text-[11px] text-[#969696] max-w-[220px]">
                  Click on any widget in the left sidebar or directly in the center preview to edit its content and styling.
                </p>

                {templateWidgets.length > 0 && (
                  <div className="mt-5 w-full space-y-1.5">
                    <p className="text-[10px] font-semibold text-[#969696] uppercase tracking-wider mb-2 text-left">
                      Sections in this template:
                    </p>
                    {page?.sections
                      .filter((s) => !!s.widgetInstance)
                      .map((s, idx) => {
                        const reg = getWidgetRegistration(s.widgetInstance!.type);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => useBuilder.getState().selectSection(s.id)}
                            className="w-full flex items-center gap-2 rounded-lg border border-[#363636] bg-[#171717] px-3 py-2 text-left text-xs text-[#D0D0D0] hover:border-[#FACC15] hover:text-[#FACC15] transition"
                          >
                            <span className="text-[10px] font-bold text-[#646464]">#{idx + 1}</span>
                            <span className="truncate flex-1 font-medium">{reg?.displayName || s.widgetInstance!.type}</span>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Widget Picker Modal */}
      <Dialog open={widgetPickerOpen} onOpenChange={setWidgetPickerOpen}>
        <DialogContent className="max-h-[85vh] w-[calc(100vw-48px)] max-w-4xl overflow-hidden rounded-2xl border border-[#363636] bg-[#1F1F1F] p-0 shadow-2xl flex flex-col text-[#F5F5F5]">
          <DialogHeader className="border-b border-[#363636] px-6 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base font-bold text-[#F5F5F5]">
                  Add Widget to Template
                </DialogTitle>
                <DialogDescription className="text-xs text-[#969696] mt-0.5">
                  Select any widget from the registry to add it to this template.
                </DialogDescription>
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#969696]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search widgets by name, category, or description..."
                  className="h-9 w-full pl-9 rounded-lg border-[#363636] bg-[#171717] text-xs text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryTab(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      selectedCategoryTab === cat
                        ? "bg-[#FACC15] text-[#111111]"
                        : "bg-[#171717] text-[#969696] border border-[#363636] hover:text-[#F5F5F5] hover:border-[#525252]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </DialogHeader>

          {/* Widgets Grid grouped by category */}
          <ScrollArea className="flex-1 p-6">
            {Object.keys(groupedWidgets).length === 0 ? (
              <div className="py-12 text-center text-xs text-[#969696]">
                No widgets found matching "{searchQuery}".
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedWidgets).map(([groupCategory, widgets]) => (
                  <div key={groupCategory} className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#2E2E2E] pb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                        {groupCategory}
                      </span>
                      <span className="text-[10px] text-[#646464]">
                        ({widgets.length} widget{widgets.length !== 1 ? "s" : ""})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {widgets.map((reg) => (
                        <div
                          key={reg.id}
                          onClick={() => handleAddWidget(reg.type)}
                          className="group relative flex flex-col justify-between rounded-xl border border-[#363636] bg-[#171717] p-4 text-left transition-all duration-150 hover:border-[#FACC15] hover:bg-[#222222] hover:shadow-lg hover:shadow-[#FACC15]/5 cursor-pointer"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#363636] bg-[#242424] text-[#D0D0D0] group-hover:border-[#FACC15]/40 group-hover:bg-[#FACC15]/10 group-hover:text-[#FACC15] transition">
                                <FontAwesomeIcon icon={reg.icon as any} className="h-4 w-4" />
                              </div>
                              <span className="rounded-full border border-[#363636] bg-[#1F1F1F] px-2 py-0.5 text-[10px] font-medium text-[#969696] group-hover:text-[#D0D0D0]">
                                {reg.category}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-[#F5F5F5] group-hover:text-[#FACC15] transition">
                              {reg.displayName}
                            </h4>
                            <p className="mt-1 text-[11px] text-[#969696] line-clamp-2 leading-relaxed">
                              {reg.description || reg.preview || "Customizable section component."}
                            </p>
                          </div>
                          <div className="mt-3.5 flex items-center justify-between border-t border-[#2B2B2B] pt-2.5 text-[10px] text-[#969696]">
                            <span>
                              {reg.supportedVariants?.length ? `${reg.supportedVariants.length} variants` : "Standard"}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-[#FACC15] opacity-0 group-hover:opacity-100 transition">
                              <Plus className="h-3 w-3" /> Add Widget
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function buildTemplatePreviewSrcDoc(project: any, selectedId: string | null): string {
  const page = project?.pages?.find((p: any) => p.id === project.currentPageId) ?? project?.pages?.[0];
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }
    [data-wto-section] {
      position: relative;
      cursor: pointer;
      transition: outline 0.15s ease-in-out;
    }
    [data-wto-section]:hover {
      outline: 2px dashed #FACC15;
      outline-offset: -2px;
    }
    [data-wto-section].wto-selected {
      outline: 2px solid #FACC15 !important;
      outline-offset: -2px;
    }
  </style>
</head>
<body>
  ${sectionHtml}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    document.addEventListener('click', function(e) {
      var section = e.target.closest('[data-wto-section]');
      if (section) {
        e.preventDefault();
        var id = section.getAttribute('data-wto-section');
        window.parent.postMessage({ type: 'TEMPLATE_SECTION_CLICK', sectionId: id }, '*');
      }
    }, true);
  </script>
</body>
</html>`;
}
