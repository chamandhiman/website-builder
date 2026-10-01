"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Search, MoreVertical, Pencil, Trash2, CheckCircle2, XCircle, Layers, Copy, RefreshCcw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useBuilder } from "@/lib/builder/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
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
    setEditingTemplate(null);
    setFormName("");
    setFormCategory("");
    setCreateDialogOpen(true);
  };

  const handleCreateFromBuilder = async () => {
    if (!user || !formName.trim() || !formCategory.trim()) return;
    setSaving(true);
    try {
      setCreateDialogOpen(false);
      navigate({
        to: "/super-admin/templates/create",
        search: { templateName: formName.trim(), templateCategory: formCategory.trim() },
      });
    } catch (err) {
      console.error("[Templates] Failed to open builder:", err);
      toast.error("Failed to open builder");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = async (template: Template) => {
    try {
      navigate({
        to: "/super-admin/templates/$templateId/edit",
        params: { templateId: template.id },
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

  const formatDate = (value: Date) => {
    return value.toLocaleDateString();
  };

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Templates</h1>
          <p className="mt-1 text-sm text-[#969696]">Manage global widget templates for the builder.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 px-4 rounded-lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
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
                : "Create your first global widget template."}
            </p>
          </div>
          {!searchQuery && categoryFilter === "all" && (
            <Button onClick={openCreate} className="mt-2 bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 px-4 rounded-lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col border-[#363636] bg-[#1F1F1F] p-0 overflow-hidden">
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
                  <p className="mt-0.5 text-[10px] text-[#646464]">{template.widgets?.length ?? 0} widgets</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#969696] hover:text-[#F5F5F5]">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-[#1F1F1F] border-[#363636] text-[#F5F5F5]">
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

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-[480px] overflow-hidden rounded-[20px] border border-[#363636] bg-[#1F1F1F] p-0 shadow-2xl">
          <DialogHeader className="border-b border-[#363636] px-5 pb-4 pt-5">
            <DialogTitle className="text-base font-semibold text-[#F5F5F5]">Create Template</DialogTitle>
            <DialogDescription className="text-xs text-[#969696]">
              Open the template builder to assemble a reusable collection of widgets.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-5 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F5F5F5]">Template Name</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="SaaS Page Template"
                className="h-9 rounded-lg border-[#363636] bg-[#171717] text-[#F5F5F5] placeholder:text-[#969696]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F5F5F5]">Category</label>
              <Input
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Marketing"
                className="h-9 rounded-lg border-[#363636] bg-[#171717] text-[#F5F5F5] placeholder:text-[#969696]"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-[#363636] px-5 py-3">
            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)} disabled={saving} className="text-[#969696] hover:text-[#F5F5F5] hover:bg-[#242424] h-8 px-3 rounded-md text-xs">
              Cancel
            </Button>
            <Button onClick={handleCreateFromBuilder} disabled={saving || !formName.trim() || !formCategory.trim()} className="bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-8 px-4 rounded-md text-xs">
              {saving ? "Opening Builder..." : "Open Builder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
