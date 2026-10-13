"use client";

import { useEffect, useRef, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useBuilder } from "@/lib/builder/store";
import { CenteredLoader } from "@/components/ui/CenteredLoader";
import { Canvas } from "./Canvas";
import { AddPageDialog } from "./AddPageDialog";
import { SeoDialog } from "./SeoDialog";
import { RightContextPanel } from "./RightContextPanel";
import { CanvasToolbar } from "./CanvasToolbar";
import type { Page } from "@/lib/builder/store";
import { AppSidebarNav } from "@/components/layout/AppSidebar";

export function BuilderShell() {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const handleSelectPage = (pageId: string) => {
    useBuilder.getState().selectPage(pageId);
    if (currentProjectId) {
      window.history.replaceState(null, "", `/editor/${currentProjectId}?pageId=${pageId}`);
    }
  };

  const handleRenamePage = (id: string, name: string) => {
    useBuilder.getState().renamePage(id, name);
  };

  const handleSetPageSlug = (id: string, slug: string) => {
    useBuilder.getState().setPageSlug(id, slug);
  };

  const handleDuplicatePage = (id: string) => {
    useBuilder.getState().duplicatePage(id);
  };

  const handleDeletePage = (id: string) => {
    useBuilder.getState().deletePage(id);
  };

  const handleAddPage = (name: string, slug: string) => {
    const addPage = useBuilder.getState().addPage;
    const newId = addPage(name, slug);
    if (newId && currentProjectId) {
      window.history.replaceState(null, "", `/editor/${currentProjectId}?pageId=${newId}`);
    }
    return newId;
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

  if (!mounted || !hydrated) {
    return <CenteredLoader details="Initializing editor…" className="bg-[#171717]/50" />;
  }

  return (
    <div className="builder-shell relative flex h-screen w-full overflow-hidden bg-[#171717] text-[#F5F5F5]">
      {/* DESKTOP LEFT SIDEBAR */}
      <div className="hidden md:flex h-full shrink-0">
        <AppSidebarNav compact />
      </div>

      {/* MOBILE LEFT MENU DRAWER (SLIDE-OVER) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col bg-[#141414] border-r border-[#262626] shadow-2xl animate-in slide-in-from-left duration-200">
            <AppSidebarNav compact={false} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* CANVAS SECTION */}
      <div className="builder-canvas-section flex flex-1 min-w-0 flex-col overflow-hidden">
        <CanvasToolbar
          project={project}
          pages={pages}
          currentPageId={currentPageId}
          onSelectPage={handleSelectPage}
          onAddPage={() => setAddDialogOpen(true)}
          onRenamePage={handleRenamePage}
          onSetPageSlug={handleSetPageSlug}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onOpenSeo={(id) => setLocalSeoModalPageId(id)}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          onToggleMobilePanel={() => setMobilePanelOpen((prev) => !prev)}
          mobilePanelOpen={mobilePanelOpen}
        />
        <div className="canvas-workspace flex flex-1 min-h-0 overflow-auto bg-[#171717]">
          <div className="flex flex-1 min-h-0 items-center justify-center p-0 sm:p-2 md:p-6">
            <div className="relative h-full w-full overflow-hidden sm:rounded-lg sm:border sm:border-[#2B2B2B] bg-white shadow-2xl">
              <Canvas />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP RIGHT PANEL */}
      <div className="hidden md:flex h-full shrink-0">
        <RightContextPanel />
      </div>

      {/* MOBILE RIGHT PANEL DRAWER (SLIDE-OVER) */}
      {mobilePanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobilePanelOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[340px] max-w-[90vw] flex-col bg-[#141414] border-l border-[#262626] shadow-2xl animate-in slide-in-from-right duration-200">
            <RightContextPanel isMobile onClose={() => setMobilePanelOpen(false)} />
          </div>
        </div>
      )}

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
