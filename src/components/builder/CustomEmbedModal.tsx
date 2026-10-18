"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useBuilder,
  type Page,
  type PageSection,
  SHARED_HEADER_SECTION_ID,
  SHARED_FOOTER_SECTION_ID,
} from "@/lib/builder/store";
import {
  X,
  Code2,
  Globe,
  Layers,
  FileCode,
  Monitor,
  Smartphone,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  type CustomEmbedItem,
  type EmbedDisplayType,
  createCustomHtmlSection,
  detectWtoWidgetId,
  detectSnippetType,
} from "@/lib/builder/customEmbedsUtils";
import type { FloatingPosition, FloatingWidgetRecord } from "@/lib/builder/floatingWidgetsTypes";
import { nanoid } from "nanoid";

interface CustomEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedToEdit?: CustomEmbedItem | null;
  defaultPageId?: string | null;
}

type PlacementChoice =
  | "site_wide_header"
  | "site_wide_footer"
  | "floating_bottom_right"
  | "floating_bottom_left"
  | "floating_bottom_center"
  | "floating_top_right"
  | "floating_top_left"
  | "inline_page";

export function CustomEmbedModal({
  isOpen,
  onClose,
  embedToEdit,
  defaultPageId,
}: CustomEmbedModalProps) {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const currentPageId = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId]?.currentPageId : null));
  const updateSection = useBuilder((s) => s.updateSection);
  const selectSection = useBuilder((s) => s.selectSection);
  const selectPage = useBuilder((s) => s.selectPage);
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // Form State
  const [name, setName] = useState("");
  const [placement, setPlacement] = useState<PlacementChoice>("site_wide_header");
  const [html, setHtml] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine initial placement from embedToEdit
  useEffect(() => {
    if (!isOpen) return;

    if (embedToEdit) {
      setName(embedToEdit.name);
      setHtml(embedToEdit.html);

      if (embedToEdit.displayType === "site_wide") {
        setPlacement(embedToEdit.sharedType === "footer" ? "site_wide_footer" : "site_wide_header");
      } else if (embedToEdit.displayType === "floating") {
        const pos = embedToEdit.floatingRecord?.position || embedToEdit.floatingPosition || "bottom_right";
        if (pos === "bottom_left") setPlacement("floating_bottom_left");
        else if (pos === "bottom_center") setPlacement("floating_bottom_center");
        else if (pos === "top_right") setPlacement("floating_top_right");
        else if (pos === "top_left") setPlacement("floating_top_left");
        else setPlacement("floating_bottom_right");
      } else {
        setPlacement("inline_page");
      }
    } else {
      setName("");
      setHtml("");
      setPlacement("site_wide_header");
    }
    setPreviewDevice("desktop");
  }, [isOpen, embedToEdit]);

  if (!isOpen || !project) return null;

  const pages = project.pages || [];

  // Helper text based on selected placement
  const placementDescription = useMemo(() => {
    switch (placement) {
      case "site_wide_header":
        return "This embed will appear on all pages in the header area.";
      case "site_wide_footer":
        return "This embed will appear on all pages in the footer area.";
      case "floating_bottom_right":
        return "This embed will float fixed in the bottom-right corner across pages.";
      case "floating_bottom_left":
        return "This embed will float fixed in the bottom-left corner across pages.";
      case "floating_bottom_center":
        return "This embed will float fixed at the bottom-center across pages.";
      case "floating_top_right":
        return "This embed will float fixed in the top-right corner across pages.";
      case "floating_top_left":
        return "This embed will float fixed in the top-left corner across pages.";
      case "inline_page":
        return "This embed will render inline inside the current page layout.";
      default:
        return "Configure where this embed will be placed.";
    }
  }, [placement]);

  // Derive preview suitability
  const previewState = useMemo(() => {
    const trimmed = (html || "").trim();
    if (!trimmed) {
      return { status: "empty", message: "Paste your embed code to preview" };
    }

    // If it's a script tag that attempts document.write or non-safe external script
    if (trimmed.includes("document.write")) {
      return {
        status: "unsafe",
        message: "Preview unavailable for this script. It will execute on the live site.",
      };
    }

    // Extract iframe src or html
    const isIframe = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/i.test(trimmed);
    return { status: "ready", isIframe };
  }, [html]);

  // Form submit / save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedCode = html.trim();
    if (!trimmedCode) {
      toast.error("Please enter embed code or HTML");
      return;
    }

    const finalName = name.trim() || "Plugin";
    setIsSubmitting(true);

    try {
      // Decode placement
      const isSiteWide = placement === "site_wide_header" || placement === "site_wide_footer";
      const isFloating = placement.startsWith("floating_");
      const isInline = placement === "inline_page";

      // 1. UPDATE EXISTING EMBED
      if (embedToEdit) {
        // If it was floating and remains floating
        if (embedToEdit.displayType === "floating" && isFloating && embedToEdit.floatingId) {
          const targetPos: FloatingPosition =
            placement === "floating_bottom_left"
              ? "bottom_left"
              : placement === "floating_bottom_center"
              ? "bottom_center"
              : placement === "floating_top_right"
              ? "top_right"
              : placement === "floating_top_left"
              ? "top_left"
              : "bottom_right";

          useBuilder.setState((s) => {
            const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
            if (!cur) return s;
            const updated = (cur.floatingWidgets || []).map((fw) => {
              if (fw.id === embedToEdit.floatingId) {
                return {
                  ...fw,
                  name: finalName,
                  position: targetPos,
                  snippetHtml: trimmedCode,
                  config: { ...fw.config, html: trimmedCode },
                  updatedAt: Date.now(),
                };
              }
              return fw;
            });
            return {
              projects: {
                ...s.projects,
                [cur.id]: { ...cur, floatingWidgets: updated },
              },
            };
          });
          persistWithStatus();
          toast.success(`Updated "${finalName}"`);
          onClose();
          return;
        }

        // If it was inline / site-wide and remains section-based
        if (!isFloating && embedToEdit.sectionId) {
          if (isSiteWide) {
            const isHeader = placement === "site_wide_header";
            const newSec = createCustomHtmlSection({
              id: isHeader ? SHARED_HEADER_SECTION_ID : SHARED_FOOTER_SECTION_ID,
              name: finalName,
              html: trimmedCode,
            });
            newSec.shared = isHeader ? "header" : "footer";

            useBuilder.setState((s) => {
              const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
              if (!cur) return s;
              return {
                projects: {
                  ...s.projects,
                  [cur.id]: {
                    ...cur,
                    ...(isHeader
                      ? { sharedHeader: newSec }
                      : { sharedFooter: newSec }),
                  },
                },
              };
            });
            persistWithStatus();
            toast.success(`Updated site-wide embed "${finalName}"`);
            onClose();
            return;
          }

          // Inline on page
          updateSection(embedToEdit.sectionId, {
            name: finalName,
            html: trimmedCode,
            widgetInstance: {
              id: embedToEdit.widgetInstanceId || embedToEdit.sectionId,
              type: "custom-html",
              variant: "default",
              content: { html: trimmedCode },
              style: {},
              layout: {},
              responsive: {},
              animation: {},
              advanced: {},
            } as any,
          });
          persistWithStatus();
          toast.success(`Updated "${finalName}"`);
          onClose();
          return;
        }

        // Mode Changed: Clean up previous instance before inserting new
        if (embedToEdit.displayType === "floating" && embedToEdit.floatingId) {
          useBuilder.setState((s) => {
            const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
            if (!cur) return s;
            return {
              projects: {
                ...s.projects,
                [cur.id]: {
                  ...cur,
                  floatingWidgets: (cur.floatingWidgets || []).filter((fw) => fw.id !== embedToEdit.floatingId),
                },
              },
            };
          });
        } else if (embedToEdit.sectionId) {
          useBuilder.getState().removeSection(embedToEdit.sectionId);
        }
      }

      // 2. CREATE NEW EMBED OR INSERT IN NEW PLACEMENT
      if (isFloating) {
        const targetPos: FloatingPosition =
          placement === "floating_bottom_left"
            ? "bottom_left"
            : placement === "floating_bottom_center"
            ? "bottom_center"
            : placement === "floating_top_right"
            ? "top_right"
            : placement === "floating_top_left"
            ? "top_left"
            : "bottom_right";

        const floatingRecord: FloatingWidgetRecord = {
          id: embedToEdit?.floatingId || `fw-${nanoid(8)}`,
          type: "custom_embed",
          name: finalName,
          enabled: true,
          position: targetPos,
          offsetX: 20,
          offsetY: 20,
          pageTargeting: "all",
          showOnDesktop: true,
          showOnMobile: true,
          snippetHtml: trimmedCode,
          config: { html: trimmedCode },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                floatingWidgets: [...(cur.floatingWidgets || []), floatingRecord],
              },
            },
          };
        });
        persistWithStatus();
        toast.success(`Added floating plugin "${finalName}"`);
      } else if (isSiteWide) {
        const isHeader = placement === "site_wide_header";
        const secId = isHeader ? SHARED_HEADER_SECTION_ID : SHARED_FOOTER_SECTION_ID;
        const newSection = createCustomHtmlSection({
          id: secId,
          name: finalName,
          html: trimmedCode,
        });
        newSection.shared = isHeader ? "header" : "footer";

        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                ...(isHeader
                  ? { sharedHeader: newSection }
                  : { sharedFooter: newSection }),
              },
            },
          };
        });
        persistWithStatus();
        toast.success(`Saved site-wide plugin "${finalName}"`);
      } else {
        // Inline on page
        const secId = embedToEdit?.sectionId || `custom-html-${nanoid(8)}`;
        const newSection = createCustomHtmlSection({
          id: secId,
          name: finalName,
          html: trimmedCode,
        });

        const targetPage = defaultPageId || currentPageId || pages[0]?.id;
        useBuilder.setState((s) => {
          const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
          if (!cur) return s;
          const updatedPages = (cur.pages || []).map((p) => {
            if (p.id === targetPage) {
              const currentSections = p.sections || [];
              return { ...p, sections: [...currentSections, newSection] };
            }
            return p;
          });
          return {
            projects: {
              ...s.projects,
              [cur.id]: { ...cur, pages: updatedPages },
            },
          };
        });
        if (targetPage) selectPage(targetPage);
        selectSection(secId);
        persistWithStatus();
        toast.success(`Added inline plugin "${finalName}"`);
      }

      onClose();
    } catch (err: any) {
      console.error("[CustomEmbedModal] Save error:", err);
      toast.error(err?.message || "Failed to save plugin");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-[#2B2B2B] bg-[#111113] text-[#F5F5F5] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#222225] bg-[#141416] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 font-mono text-base font-bold shadow-xs">
              &lt;/&gt;
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {embedToEdit ? "Edit Plugin" : "Add Plugin"}
              </h2>
              <p className="text-xs text-zinc-400">
                Add your HTML code, iframe or script. It will be added as a plugin to your website.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body / 2-Column Form & Preview */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* ── LEFT COLUMN: Configuration Form ── */}
            <div className="space-y-4">
              {/* 1. Embed Name */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Plugin Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. YouTube Video, WhatsApp Chat, Google Map"
                  className="h-10 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                />
                <p className="mt-1.5 text-[11px] text-zinc-400 leading-normal">
                  This is for your reference only. It won't be shown on the website.
                </p>
              </div>

              {/* 2. Where to Add */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Where to Add
                </label>
                <div className="relative">
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as PlacementChoice)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#2F2F33] bg-[#18181B] px-3.5 pr-8 text-xs font-medium text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                  >
                    <option value="site_wide_header">🌐 Site-wide (Header)</option>
                    <option value="site_wide_footer">🌐 Site-wide (Footer)</option>
                    <option value="floating_bottom_right">💬 Floating - Bottom Right</option>
                    <option value="floating_bottom_left">💬 Floating - Bottom Left</option>
                    <option value="floating_bottom_center">💬 Floating - Bottom Center</option>
                    <option value="floating_top_right">💬 Floating - Top Right</option>
                    <option value="floating_top_left">💬 Floating - Top Left</option>
                    <option value="inline_page">📄 Inline on this page</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                    ▼
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-400 leading-normal">
                  {placementDescription}
                </p>
              </div>

              {/* 3. Embed Code */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Embed Code
                </label>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  placeholder={`<iframe width="100%" height="400" src="https://www.youtube.com/embed/..." frameborder="0" allowfullscreen></iframe>`}
                  className="h-44 w-full rounded-lg border border-[#2F2F33] bg-[#18181B] p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 resize-none leading-relaxed"
                  spellCheck={false}
                />
                <p className="mt-1.5 text-[11px] text-zinc-400 leading-normal">
                  Paste your HTML code, iframe or script here.
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Preview Frame ── */}
            <div className="flex flex-col h-full space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-white">Preview</span>
                <div className="flex items-center gap-1 rounded-lg border border-[#2A2A2E] bg-[#18181B] p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      previewDevice === "desktop"
                        ? "bg-amber-400 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="h-3 w-3" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      previewDevice === "mobile"
                        ? "bg-amber-400 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Simulated Website Frame */}
              <div
                className={`flex-1 rounded-xl border border-[#28282C] bg-[#0E0E10] overflow-hidden flex flex-col shadow-inner min-h-[300px] transition-all duration-200 mx-auto w-full ${
                  previewDevice === "mobile" ? "max-w-[280px]" : "max-w-full"
                }`}
              >
                {/* Mock Browser Navbar */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161619] px-3 py-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-white tracking-wider">LOGO</span>
                    {previewDevice === "desktop" && (
                      <div className="flex items-center gap-2 text-[9px] text-zinc-400 ml-2">
                        <span>Home</span>
                        <span>About</span>
                        <span>Services</span>
                        <span>Blog</span>
                        <span>Contact</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="rounded bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-zinc-950 pointer-events-none"
                  >
                    Get Started
                  </button>
                </div>

                {/* Embed Content Preview Area */}
                <div className="flex-1 p-3 flex flex-col overflow-y-auto bg-[#0A0A0C]">
                  {previewState.status === "empty" ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                      <Code2 className="h-8 w-8 text-zinc-600 mb-2 opacity-50" />
                      <p className="text-xs">{previewState.message}</p>
                    </div>
                  ) : previewState.status === "unsafe" ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-400 bg-zinc-900/40 rounded-lg border border-zinc-800">
                      <AlertCircle className="h-6 w-6 text-amber-400 mb-2" />
                      <p className="text-xs leading-relaxed max-w-[220px]">{previewState.message}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Embed Preview Box */}
                      <div className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-black/60 shadow-md">
                        {previewState.isIframe ? (
                          <div
                            className="w-full"
                            dangerouslySetInnerHTML={{
                              __html: html.replace(
                                /<iframe\b([^>]*)>/i,
                                '<iframe $1 style="width:100%;height:180px;border:none;display:block;">'
                              ),
                            }}
                          />
                        ) : (
                          <div
                            className="p-3 text-xs text-white"
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        )}
                      </div>

                      {/* Simulated Page Content Skeleton */}
                      <div className="space-y-2 pt-2 opacity-40">
                        <div className="h-2.5 w-3/4 rounded bg-zinc-700" />
                        <div className="h-2 w-full rounded bg-zinc-800" />
                        <div className="h-2 w-5/6 rounded bg-zinc-800" />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="h-10 rounded bg-zinc-800/80 border border-zinc-700/50" />
                          <div className="h-10 rounded bg-zinc-800/80 border border-zinc-700/50" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-[#222225] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#333338] bg-[#18181B] px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>{embedToEdit ? "Save Changes" : "Add Plugin"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
