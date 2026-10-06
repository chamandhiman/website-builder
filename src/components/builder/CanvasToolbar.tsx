"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/lib/auth";
import { buildSiteExport } from "@/lib/builder/preview";
import JSZip from "jszip";
import {
  ChevronDown,
  Download,
  Monitor,
  Smartphone,
  Tablet,
  Undo2,
  Redo2,
  Upload,
  Save,
  X,
  Plus,
  FileText,
  Loader2,
} from "lucide-react";
import { SaveStatus } from "@/components/builder/SaveStatus";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";
import { useRequireAuth } from "@/lib/builder/useRequireAuth";
import { saveAsTemplate } from "@/services/templates";
import { PageActionsMenu } from "@/components/builder/PageActionsMenu";
import type { Page } from "@/lib/builder/store";
import { PublishSuccessModal } from "@/components/builder/PublishSuccessModal";
import { publishWebsite, type PublishResult } from "@/services/publishing";

// CanvasToolbar - builder top bar

export function CanvasToolbar({
  project,
  pages,
  currentPageId,
  onSelectPage,
  onAddPage,
  onRenamePage,
  onSetPageSlug,
  onDuplicatePage,
  onDeletePage,
  onOpenSeo,
}: {
  project: any;
  pages: any[] | null;
  currentPageId: string | null;
  onSelectPage: (pageId: string) => void;
  onAddPage?: () => void;
  onRenamePage?: (id: string, name: string) => void;
  onSetPageSlug?: (id: string, slug: string) => void;
  onDuplicatePage?: (id: string) => void;
  onDeletePage?: (id: string) => void;
  onOpenSeo?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const mounted = useMounted();
  const [pageSelectorOpen, setPageSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const requireExportAuth = useRequireAuth("export");
  const requirePublishAuth = useRequireAuth("publish");
  const requirePreviewAuth = useRequireAuth("preview");

  const device = useBuilder((s) => s.device);
  const undo = useBuilder((s) => s.undo);
  const redo = useBuilder((s) => s.redo);
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);
  const saveStatus = useBuilder((s) => s.saveStatus);
  const saveErrorMessage = useBuilder((s) => s.saveErrorMessage);
  const setDevice = useBuilder((s) => s.setDevice);

  // Close page selector when clicking outside
  useEffect(() => {
    if (!pageSelectorOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setPageSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pageSelectorOpen]);

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isTemplateMode = searchParams.get("templateMode") === "true";
  const templateId = searchParams.get("templateId");
  const templateName = searchParams.get("templateName") || project?.name || "Template";
  const templateCategory = searchParams.get("templateCategory") || "General";
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);

  const handleSaveAsTemplate = async () => {
    if (!project || !user) return;
    const page = project.pages?.find((p: any) => p.id === project.currentPageId) ?? project.pages?.[0];
    const sections = page?.sections ?? [];
    const widgets = sections
      .map((s: any) => s.widgetInstance)
      .filter((item: any): item is NonNullable<typeof item> => Boolean(item));

    if (widgets.length === 0 && sections.length === 0) {
      toast.error("Add at least one section before saving.");
      return;
    }

    setSavingTemplate(true);
    try {
      const slug = templateName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const heroWidget = widgets.find((w: any) => w.type === "hero");
      const heroContent = heroWidget?.content as any;
      const heroStyle = heroWidget?.style as any;
      const serviceWidget = widgets.find((w: any) => w.type === "services");
      const serviceContent = serviceWidget?.content as any;

      const autoThumbnail =
        (typeof heroContent?.mediaSrc === "string" ? heroContent.mediaSrc : null) ||
        (typeof heroStyle?.backgroundImage === "string" ? heroStyle.backgroundImage : null) ||
        (typeof serviceContent?.services?.[0]?.src === "string" ? serviceContent.services[0].src : null) ||
        project.thumbnail ||
        null;

      await saveAsTemplate({
        name: templateName,
        slug,
        category: templateCategory,
        widgets,
        pages: project.pages,
        thumbnail: autoThumbnail,
        uid: user.id,
        existingTemplateId: templateId || undefined,
      });

      toast.success(templateId ? "Template updated successfully" : "Template saved successfully");
      navigate({ to: "/super-admin/templates" });
    } catch (err: any) {
      console.error("[Templates] Failed to save template:", err);
      toast.error(err?.message || "Failed to save template");
    } finally {
      setSavingTemplate(false);
    }
  };

  const activePage = project?.pages?.find((p: any) => p.id === currentPageId) ?? project?.pages?.[0] ?? null;

  async function downloadZip() {
    if (!project || !mounted) return;

    const exportData = await buildSiteExport(project);
    const zip = new JSZip();

    for (const file of exportData.files) {
      if (file.base64) {
        zip.file(file.path, file.base64, { base64: true });
      } else {
        zip.file(file.path, file.content);
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name
      .replace(/\s+/g, "-")
      .toLowerCase()}.zip`;

    link.click();

    URL.revokeObjectURL(url);
  }

  function slugifyName(name: string) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "project";
  }

  async function openPreview() {
    if (!project || !mounted) return;
    await requirePreviewAuth(() => {
      const currentPage = project.pages.find((p: any) => p.id === project.currentPageId) || project.pages[0];
      if (!currentPage) {
        toast.error('Preview failed: No current page available for preview');
        return;
      }

      const previewSlug = `${slugifyName(project.name)}-${project.id}`;
      const previewUrl = `${window.location.origin}/demo/${encodeURIComponent(previewSlug)}?page=${encodeURIComponent(currentPage.slug)}`;

      const payload = {
        __lovablePreviewPayload: true,
        projectId: project.id,
        project,
        pageId: currentPage.id,
      };

      const previewWindow = window.open(previewUrl, '_blank');
      if (!previewWindow) {
        console.error("[PREVIEW:SENDER] window.open returned null: popup blocked?");
        toast.error('Preview failed: Unable to open preview window');
        return;
      }

      let payloadSent = false;
      const sendPayload = () => {
        if (payloadSent) return;
        payloadSent = true;
        try {
          previewWindow.postMessage(payload, "*");
        } catch (err) {
          console.error("Preview postMessage failed", err);
        }
      };

      const handlePreviewReady = (event: MessageEvent) => {
        if (event.data && event.data.__previewReady) {
          console.log("[PREVIEW:SENDER] received __previewReady, sending payload");
          sendPayload();
          window.removeEventListener("message", handlePreviewReady);
        }
      };

      window.addEventListener("message", handlePreviewReady);

      console.log("[PREVIEW:SENDER] opening preview", { previewUrl, projectId: project.id, pageId: currentPage.id, pageSlug: currentPage.slug });
      console.log("[PREVIEW:SENDER] window.opened", { href: previewWindow.location?.href, closed: previewWindow.closed });

      const closedCheck = window.setInterval(() => {
        if (previewWindow.closed) {
          window.clearInterval(closedCheck);
          window.removeEventListener("message", handlePreviewReady);
        }
      }, 1000);

      previewWindow.focus();
      toast.success('Preview opened', { duration: 2000, position: 'top-center' });
    });
  }

  async function handlePublish() {
    if (!project || !mounted || isPublishing) return;
    await requirePublishAuth(async () => {
      try {
        setIsPublishing(true);
        // 1. Ensure latest local changes are saved
        await persistWithStatus();
        // 2. Read latest project state
        const currentProj = useBuilder.getState().projects[project.id] || project;
        // 3. Publish to cloud
        const result = await publishWebsite(currentProj);
        setPublishResult(result);
        setPublishModalOpen(true);
      } catch (error: any) {
        console.error("Failed to publish website:", error);
        toast.error(error?.message || "Failed to publish website. Please try again.");
      } finally {
        setIsPublishing(false);
      }
    });
  }

  if (!mounted || !project) {
    return (
      <div className="flex h-12 items-center border-b border-[#363636] bg-[#1F1F1F] px-3">
        <div className="h-8 w-48 rounded-md bg-[#2B2B2B]" />
      </div>
    );
  }

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#363636] bg-[#1F1F1F] px-3">
      <div className="flex items-center gap-2">

        {/* Page selector + actions grouped */}
        <div className="flex items-center rounded-lg border border-[#363636] bg-[#1F1F1F] overflow-visible" ref={selectorRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setPageSelectorOpen(!pageSelectorOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#D0D0D0] transition hover:bg-[#242424] rounded-lg"
            >
              <FileText className="h-3.5 w-3.5 text-[#969696] shrink-0" />
              <span className="max-w-[120px] truncate">{activePage?.name ?? "Select page"}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-[#969696] transition-transform duration-150 ${pageSelectorOpen ? "rotate-180" : ""}`} />
            </button>

            {pageSelectorOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 z-[100] w-56 rounded-xl border border-[#363636] bg-[#1A1A1A] p-1 shadow-2xl">
                <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#707070]">Pages</span>
                  <span className="text-[10px] text-[#707070]">{(pages ?? []).length}</span>
                </div>
                <div className="my-0.5 border-t border-[#2A2A2A]" />
                {(pages ?? []).map((page: any) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => {
                      onSelectPage(page.id);
                      setPageSelectorOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      page.id === currentPageId
                        ? "bg-[#FACC15]/10 text-[#FACC15]"
                        : "text-[#D0D0D0] hover:bg-[#242424]"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="truncate flex-1">{page.name}</span>
                    {page.id === currentPageId && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-[#363636] shrink-0" />

          {/* Page actions for the active page */}
          {activePage && (
            <PageActionsMenu
              page={activePage as Page}
              pageCount={(pages ?? []).length}
              onRename={onRenamePage ?? (() => {})}
              onSetSlug={onSetPageSlug ?? (() => {})}
              onDuplicate={onDuplicatePage ?? (() => {})}
              onDelete={onDeletePage ?? (() => {})}
              onSeo={onOpenSeo ?? (() => {})}
              triggerClassName="inline-flex h-[30px] w-8 items-center justify-center text-[#969696] transition hover:bg-[#242424] hover:text-[#D0D0D0] rounded-lg"
            />
          )}
        </div>

        {/* Add page button */}
        <button
          type="button"
          onClick={onAddPage}
          title="Add new page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#363636] bg-[#1F1F1F] text-[#969696] transition hover:border-[#FACC15] hover:bg-[#FACC15]/10 hover:text-[#FACC15]"
        >
          <Plus className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="mx-0.5 h-5 w-px bg-[#363636]" />

        <div className="hidden items-center gap-1 md:flex">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] transition hover:border-[#FACC15] hover:text-[#F5F5F5]"
            title="Undo"
            onClick={undo}
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] transition hover:border-[#FACC15] hover:text-[#F5F5F5]"
            title="Redo"
            onClick={redo}
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-[#363636]" />

          <button
            type="button"
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${
              device === "desktop"
                ? "border-[#FACC15] bg-[#FACC15] text-[#111111]"
                : "border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] hover:border-[#FACC15] hover:text-[#F5F5F5]"
            }`}
            onClick={() => setDevice("desktop")}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <button
            type="button"
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${
              device === "tablet"
                ? "border-[#FACC15] bg-[#FACC15] text-[#111111]"
                : "border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] hover:border-[#FACC15] hover:text-[#F5F5F5]"
            }`}
            onClick={() => setDevice("tablet")}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>

          <button
            type="button"
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${
              device === "mobile"
                ? "border-[#FACC15] bg-[#FACC15] text-[#111111]"
                : "border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] hover:border-[#FACC15] hover:text-[#F5F5F5]"
            }`}
            onClick={() => setDevice("mobile")}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-[#363636]" />

          {isTemplateMode ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#FACC15]">
                Template Mode
              </span>
              <span className="text-xs font-medium text-[#F5F5F5]">{templateName}</span>
              <span className="text-xs text-[#969696]">({templateCategory})</span>
            </div>
          ) : (
            <SaveStatus status={saveStatus} errorMessage={saveErrorMessage ?? undefined} onRetry={persistWithStatus} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#363636] bg-[#1F1F1F] px-3 text-sm font-medium text-[#F5F5F5] transition hover:border-[#FACC15] hover:text-[#FACC15]"
          onClick={openPreview}
          title="Preview"
        >
          <Monitor className="w-4 h-4" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {isTemplateMode ? (
          <>
            <button
              type="button"
              disabled={savingTemplate}
              onClick={handleSaveAsTemplate}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#FACC15] px-3 text-xs font-semibold text-[#111111] transition hover:bg-[#FDE047] disabled:opacity-50"
              title={templateId ? "Save to Template" : "Save as Template"}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingTemplate ? "Saving..." : templateId ? "Save to Template" : "Save as Template"}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: "/super-admin/templates" })}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#363636] bg-[#1F1F1F] px-3 text-xs font-medium text-[#D0D0D0] transition hover:border-[#525252] hover:text-[#F5F5F5]"
              title="Exit to Templates"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={isPublishing}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#FACC15] px-3 text-sm font-medium text-[#111111] transition hover:bg-[#FDE047] disabled:opacity-60"
              onClick={handlePublish}
              title={project.published ? "Update published website" : "Publish website"}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden md:inline">Publishing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span className="hidden md:inline">
                    {project.published ? "Update Live" : "Publish"}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#363636] bg-[#1F1F1F] px-3 text-sm font-medium text-[#F5F5F5] transition hover:border-[#FACC15] hover:text-[#FACC15]"
              onClick={async () => { await requireExportAuth(() => downloadZip()); }}
              title="Export ZIP"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export ZIP</span>
            </button>
          </>
        )}
      </div>

      {publishResult && (
        <PublishSuccessModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          url={publishResult.url}
          slug={publishResult.slug}
          isFirstPublish={publishResult.isFirstPublish}
          publishedAt={publishResult.publishedAt}
        />
      )}
    </div>
  );
}
