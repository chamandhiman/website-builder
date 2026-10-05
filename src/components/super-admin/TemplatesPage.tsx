"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Search, MoreVertical, Pencil, Trash2, CheckCircle2, XCircle, Layers, Copy, RefreshCcw, Sparkles, Eye, X, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useBuilder } from "@/lib/builder/store";
import { getWidgetRegistration, getWidgetBootstrapExport } from "@/components/builder/widgets/widgetRegistry";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/lib/builder/store";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  setTemplateStatus,
  duplicateTemplate,
  seedPrebuiltTemplatesToFirestore,
  type Template,
  type TemplateStatus,
  type CreateTemplateInput,
  type UpdateTemplateInput,
} from "@/services/templates";

type FilterStatus = "all" | TemplateStatus;

export function TemplatesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const requestIdRef = useRef(0);

  const categories = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [templates]);

  const loadTemplates = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await listTemplates(statusFilter === "all" ? undefined : statusFilter);
      if (requestId !== requestIdRef.current) return;
      setTemplates(data);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error("[Templates] Failed to load:", err);
      const message = err?.message || "Unknown error";
      setError(message);
      toast.error("Failed to load templates", {
        description: import.meta.env.DEV ? message : undefined,
      });
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadTemplates();
  }, [statusFilter]);

  const filteredTemplates = useMemo(() => {
    let result = templates;
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q)
      );
    }
    return result;
  }, [templates, searchQuery, statusFilter, categoryFilter]);

  const openCreate = () => {
    navigate({ to: "/super-admin/templates/create" });
  };

  const openEdit = async (template: Template) => {
    try {
      // Create a fresh template project
      const projectId = useBuilder.getState().createTemplateProject(template.name);

      // Load the template's pages or widgets into the project
      const state = useBuilder.getState();
      const project = state.currentProject();

      if (project) {
        if (template.pages && template.pages.length > 0) {
          useBuilder.setState((s) => ({
            projects: {
              ...s.projects,
              [project.id]: {
                ...project,
                pages: template.pages!,
                currentPageId: template.pages![0].id,
              },
            },
          }));
        } else if (template.widgets && template.widgets.length > 0) {
          const page = project.pages?.[0];
          if (page) {
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
            const updatedPages = project.pages.map((p) =>
              p.id === page.id ? { ...p, sections } : p
            );
            useBuilder.setState((s) => ({
              projects: {
                ...s.projects,
                [project.id]: { ...project, pages: updatedPages },
              },
            }));
          }
        }
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
    } catch (err) {
      console.error("[Templates] Failed to open template in editor:", err);
      toast.error("Failed to open template in editor");
    }
  };

  const handleDuplicate = async (template: Template) => {
    try {
      await duplicateTemplate(template.id);
      toast.success("Template duplicated");
      await loadTemplates();
    } catch (err) {
      console.error("[Templates] Failed to duplicate:", err);
      toast.error("Failed to duplicate template");
    }
  };

  const handleDelete = async () => {
    if (!deletingTemplate) return;
    try {
      await deleteTemplate(deletingTemplate.id);
      toast.success("Template deleted");
      setDeletingTemplate(null);
      await loadTemplates();
    } catch (err) {
      console.error("[Templates] Failed to delete:", err);
      toast.error("Failed to delete template");
    }
  };

  const handleToggleStatus = async (template: Template) => {
    const newStatus: TemplateStatus = template.status === "draft" ? "published" : "draft";
    try {
      await setTemplateStatus(template.id, newStatus);
      toast.success(`Template ${newStatus === "published" ? "published" : "unpublished"}`);
      await loadTemplates();
    } catch (err) {
      console.error("[Templates] Failed to update status:", err);
      toast.error("Failed to update template status");
    }
  };

  const handleSyncSeeds = async () => {
    setSyncing(true);
    try {
      const added = await seedPrebuiltTemplatesToFirestore();
      if (added > 0) {
        toast.success(`Successfully saved ${added} starter templates to Firestore!`);
      } else {
        toast.info("All starter templates are already in Firestore.");
      }
      await loadTemplates();
    } catch (err: any) {
      console.error("[Templates] Sync error:", err);
      toast.error("Failed to sync starter templates to Firestore", {
        description: err?.message,
      });
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Templates</h1>
          <p className="mt-1 text-sm text-[#969696]">Manage global website templates for the builder.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncSeeds}
            variant="outline"
            disabled={syncing}
            className="border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] hover:bg-[#242424] hover:text-[#F5F5F5] h-9 px-3 rounded-lg"
          >
            <Sparkles className="mr-2 h-4 w-4 text-[#FACC15]" />
            {syncing ? "Syncing..." : "Sync Starter Templates"}
          </Button>
          <Button onClick={openCreate} className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 px-4 rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#969696]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="h-9 rounded-lg border-[#363636] bg-[#171717] pl-9 text-[#F5F5F5] placeholder:text-[#969696]"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
          <SelectTrigger className="h-9 w-full sm:w-[140px] rounded-lg border-[#363636] bg-[#171717] text-[#F5F5F5]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1F1F1F] border-[#363636] text-[#F5F5F5]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[140px] rounded-lg border-[#363636] bg-[#171717] text-[#F5F5F5]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#1F1F1F] border-[#363636] text-[#F5F5F5]">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#363636] border-t-[#FACC15]" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-[#363636] bg-[#1F1F1F] p-12 text-center">
          <Layers className="h-10 w-10 text-red-400" />
          <div>
            <p className="text-sm font-medium text-[#F5F5F5]">Unable to load templates</p>
            <p className="mt-1 text-xs text-[#969696]">
              {import.meta.env.DEV ? error : "Check your connection and try again."}
            </p>
          </div>
          <Button onClick={loadTemplates} variant="outline" className="mt-2 h-8 px-4 rounded-lg border-[#363636] text-[#F5F5F5] hover:bg-[#242424]">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-[#363636] bg-[#1F1F1F] p-12 text-center">
          <Layers className="h-10 w-10 text-[#969696]" />
          <div>
            <p className="text-sm font-medium text-[#F5F5F5]">No templates found</p>
            <p className="mt-1 text-xs text-[#969696]">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by loading pre-built templates or creating a new one."}
            </p>
          </div>
          {!searchQuery && categoryFilter === "all" && (
            <div className="flex items-center gap-2 mt-2">
              <Button onClick={handleSyncSeeds} variant="outline" className="h-9 px-4 rounded-lg border-[#363636] text-[#F5F5F5] hover:bg-[#242424]">
                <Sparkles className="mr-2 h-4 w-4 text-[#FACC15]" />
                Load Starter Templates
              </Button>
              <Button onClick={openCreate} className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 px-4 rounded-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group flex flex-col border-[#363636] bg-[#1F1F1F] p-0 overflow-hidden hover:border-[#4b4b4b] transition-all">
              {template.thumbnail ? (
                <div className="relative h-36 w-full overflow-hidden bg-[#111111]">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-transparent to-transparent" />
                </div>
              ) : null}
              <div className="flex items-start justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#F5F5F5]">{template.name}</h3>
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
                  <p className="mt-1 text-xs text-[#969696] capitalize">{template.category}</p>
                  <p className="mt-0.5 text-[10px] text-[#646464]">
                    {template.pages && template.pages.length > 0
                      ? `${template.pages.length} page${template.pages.length !== 1 ? "s" : ""} · ${template.pages.reduce((acc, p) => acc + (p.sections?.length ?? 0), 0)} sections`
                      : `${template.widgets?.length ?? 0} widgets`}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#969696] hover:text-[#F5F5F5]">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-[#1F1F1F] border-[#363636] text-[#F5F5F5]">
                    <DropdownMenuItem onSelect={() => setPreviewTemplate(template)} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => openEdit(template)} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDuplicate(template)} className="cursor-pointer">
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleToggleStatus(template)} className="cursor-pointer">
                      {template.status === "draft" ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Publish
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Unpublish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#363636]" />
                    <DropdownMenuItem onSelect={() => setDeletingTemplate(template)} className="cursor-pointer text-red-400">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="border-t border-[#363636] px-4 py-3">
                <div className="flex items-center justify-between text-[11px] text-[#969696]">
                  <span>Created: {formatDate(template.createdAt)}</span>
                  <span>Updated: {formatDate(template.updatedAt)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Template Preview Modal ── */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-[200] flex flex-col bg-black/90"
          style={{ fontFamily: "sans-serif" }}
        >
          {/* Modal header bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#111111] border-b border-[#2a2a2a] shrink-0">
            <div className="flex items-center gap-3">
              <Eye className="h-4 w-4 text-[#FACC15]" />
              <span className="text-sm font-semibold text-[#F5F5F5]">{previewTemplate.name}</span>
              <span className="text-xs text-[#969696] bg-[#1F1F1F] border border-[#363636] px-2 py-0.5 rounded capitalize">{previewTemplate.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(previewTemplate)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#FACC15] bg-[#FACC15]/10 hover:bg-[#FACC15]/20 border border-[#FACC15]/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil className="h-3 w-3" />
                Edit Template
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex items-center justify-center h-8 w-8 rounded-lg text-[#969696] hover:text-[#F5F5F5] hover:bg-[#242424] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Preview iframe */}
          <div className="flex-1 overflow-hidden">
            <iframe
              key={previewTemplate.id}
              title={`Preview: ${previewTemplate.name}`}
              className="w-full h-full border-0"
              srcDoc={(() => {
                const allSections = previewTemplate.pages?.flatMap((p) => p.sections ?? []) ?? [];
                const combinedHtml = allSections.map((s) => s.html).join("\n");
                return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${previewTemplate.name}</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#0B0C10;}</style></head><body>${combinedHtml}</body></html>`;
              })()}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      <AlertDialog open={!!deletingTemplate} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
        <AlertDialogContent className="border-[#363636] bg-[#1F1F1F]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F5F5F5]">Delete Template</AlertDialogTitle>
            <AlertDialogDescription className="text-[#969696]">
              Are you sure you want to delete "{deletingTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#363636] bg-[#171717] text-[#F5F5F5] hover:bg-[#242424]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
