"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useBuilder } from "@/lib/builder/store";
import {
  Code2,
  Plus,
  Search,
  X,
  Pencil,
  Copy,
  Trash2,
  Globe,
  Info,
  MoreVertical,
  Layers,
  FileCode,
  Puzzle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getProjectCustomEmbeds,
  type CustomEmbedItem,
  type EmbedPlacementScope,
} from "@/lib/builder/customEmbedsUtils";
import { CustomEmbedModal } from "./CustomEmbedModal";
import { nanoid } from "nanoid";

export function CustomEmbedsPanel() {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const selectedSectionId = useBuilder((s) => s.selectedSectionId);
  const selectSection = useBuilder((s) => s.selectSection);
  const selectPage = useBuilder((s) => s.selectPage);
  const removeSection = useBuilder((s) => s.removeSection);
  const duplicateSection = useBuilder((s) => s.duplicateSection);
  const updateSection = useBuilder((s) => s.updateSection);
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const [placementFilter, setPlacementFilter] = useState<"all" | EmbedPlacementScope>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CustomEmbedItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedEmbedId, setSelectedEmbedId] = useState<string | null>(null);

  // Extract all custom embeds strictly scoped to current project
  const allEmbeds = useMemo(() => {
    return getProjectCustomEmbeds(project);
  }, [project]);

  // Counts for each filter
  const filterCounts = useMemo(() => {
    return {
      all: allEmbeds.length,
      site_wide: allEmbeds.filter((e) => e.placementScope === "site_wide").length,
      floating: allEmbeds.filter((e) => e.placementScope === "floating").length,
      page_specific: allEmbeds.filter((e) => e.placementScope === "page_specific").length,
    };
  }, [allEmbeds]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ embedId?: string }>;
      const embedId = customEvent?.detail?.embedId;
      if (embedId) {
        const found = allEmbeds.find((item) => item.id === embedId || item.sectionId === embedId);
        if (found) {
          setItemToEdit(found);
          setModalOpen(true);
        }
      }
    };
    window.addEventListener("wto-open-embed-editor", handleOpen);
    return () => window.removeEventListener("wto-open-embed-editor", handleOpen);
  }, [allEmbeds]);

  // Filtered embeds
  const filteredEmbeds = useMemo(() => {
    let list = allEmbeds;
    if (placementFilter !== "all") {
      list = list.filter((e) => e.placementScope === placementFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.placementLabel.toLowerCase().includes(q) ||
        (item.pageName && item.pageName.toLowerCase().includes(q)) ||
        item.html.toLowerCase().includes(q)
      );
    });
  }, [allEmbeds, placementFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setItemToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: CustomEmbedItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);
    setItemToEdit(item);
    setModalOpen(true);
  };

  const handleSelectEmbed = (item: CustomEmbedItem) => {
    setActiveMenuId(null);
    setSelectedEmbedId(item.id);

    if (item.displayType === "floating") {
      // Highlight floating item on canvas
      try {
        const iframe = document.querySelector("iframe[title='preview'], iframe") as HTMLIFrameElement | null;
        const doc = iframe?.contentDocument;
        const el = doc?.querySelector(`[data-wto-floating-id="${item.floatingId}"]`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("wto-selected-floating");
          setTimeout(() => el.classList.remove("wto-selected-floating"), 2000);
        }
      } catch (_) {}
      return;
    }

    if (!item.isShared && item.pageId) {
      selectPage(item.pageId);
    }
    if (item.sectionId) {
      selectSection(item.sectionId);
    }

    // Scroll to highlight embed on canvas
    setTimeout(() => {
      try {
        const iframe = document.querySelector("iframe[title='preview'], iframe") as HTMLIFrameElement | null;
        const doc = iframe?.contentDocument;
        const target =
          (item.sectionId ? doc?.querySelector(`[data-wto-section="${item.sectionId}"]`) : null) ||
          (item.sectionId ? doc?.querySelector(`[data-widget-id="${item.sectionId}"]`) : null);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("wto-highlight-pulse");
          setTimeout(() => target.classList.remove("wto-highlight-pulse"), 1800);
        }
      } catch (_) {}
    }, 80);
  };

  const handleToggleEnable = (item: CustomEmbedItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (item.displayType === "floating" && item.floatingId) {
      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        const updated = (cur.floatingWidgets || []).map((fw) => {
          if (fw.id === item.floatingId) {
            return { ...fw, enabled: !fw.enabled, updatedAt: Date.now() };
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
      toast.success(`${item.hidden ? "Enabled" : "Disabled"} "${item.name}"`);
      return;
    }

    if (item.isShared && item.sectionId) {
      const isHeader = item.sharedType === "header";
      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        if (isHeader && cur.sharedHeader) {
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                sharedHeader: { ...cur.sharedHeader, hidden: !cur.sharedHeader.hidden },
              },
            },
          };
        } else if (!isHeader && cur.sharedFooter) {
          return {
            projects: {
              ...s.projects,
              [cur.id]: {
                ...cur,
                sharedFooter: { ...cur.sharedFooter, hidden: !cur.sharedFooter.hidden },
              },
            },
          };
        }
        return s;
      });
      persistWithStatus();
      toast.success(`${item.hidden ? "Enabled" : "Disabled"} "${item.name}"`);
      return;
    }

    if (item.sectionId) {
      updateSection(item.sectionId, { hidden: !item.hidden });
      persistWithStatus();
      toast.success(`${item.hidden ? "Enabled" : "Disabled"} "${item.name}"`);
    }
  };

  const handleDuplicate = (item: CustomEmbedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (item.displayType === "floating" && item.floatingRecord) {
      const copyFw = {
        ...item.floatingRecord,
        id: `fw-${nanoid(8)}`,
        name: `${item.name} (Copy)`,
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
              floatingWidgets: [...(cur.floatingWidgets || []), copyFw],
            },
          },
        };
      });
      persistWithStatus();
      toast.success(`Duplicated "${item.name}"`);
      return;
    }

    if (item.sectionId) {
      duplicateSection(item.sectionId);
      persistWithStatus();
      toast.success(`Duplicated "${item.name}"`);
    }
  };

  const handleDelete = (item: CustomEmbedItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (item.displayType === "floating" && item.floatingId) {
      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        return {
          projects: {
            ...s.projects,
            [cur.id]: {
              ...cur,
              floatingWidgets: (cur.floatingWidgets || []).filter((fw) => fw.id !== item.floatingId),
            },
          },
        };
      });
      persistWithStatus();
      setDeleteConfirmId(null);
      toast.success(`Removed "${item.name}"`);
      return;
    }

    if (item.isShared) {
      const isHeader = item.sharedType === "header";
      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        return {
          projects: {
            ...s.projects,
            [cur.id]: {
              ...cur,
              ...(isHeader ? { sharedHeader: undefined } : { sharedFooter: undefined }),
            },
          },
        };
      });
      persistWithStatus();
      setDeleteConfirmId(null);
      toast.success(`Removed "${item.name}"`);
      return;
    }

    if (item.sectionId) {
      removeSection(item.sectionId);
      persistWithStatus();
      setDeleteConfirmId(null);
      toast.success(`Removed "${item.name}"`);
    }
  };

  // Helper to get specialized icon for an embed
  const getEmbedIcon = (item: CustomEmbedItem) => {
    const lowerName = item.name.toLowerCase();
    const lowerHtml = item.html.toLowerCase();

    if (lowerName.includes("youtube") || lowerHtml.includes("youtube.com") || lowerHtml.includes("youtu.be")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E02424] text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
      );
    }

    if (lowerName.includes("whatsapp") || lowerHtml.includes("wa.me") || lowerHtml.includes("whatsapp")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
          <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/>
          </svg>
        </div>
      );
    }

    if (lowerName.includes("accessibility") || lowerHtml.includes("accessibility") || lowerHtml.includes("a11y")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none stroke-2">
            <circle cx="12" cy="4" r="1.5"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/>
          </svg>
        </div>
      );
    }

    if (lowerName.includes("language") || lowerName.includes("translate") || lowerHtml.includes("translate")) {
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Globe className="h-6 w-6" />
        </div>
      );
    }

    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#26262B] text-amber-400 border border-zinc-700 shadow-sm">
        <Code2 className="h-5 w-5" />
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#121214] text-[#F5F5F5]">
      {/* ── Top Bar matching Mockup Image 1 ───────────────────────── */}
      <div className="shrink-0 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-wide">
            Plugins ({allEmbeds.length})
          </h3>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#FACC15] px-3.5 py-1.5 text-xs font-bold text-zinc-950 transition hover:bg-[#FDE047] shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>+ Add Plugin</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins..."
            className="h-9 w-full rounded-lg border border-[#2B2B30] bg-[#18181B] pl-9 pr-7 text-xs text-[#F5F5F5] placeholder-zinc-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-zinc-400 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Pills matching Mockup Image 1 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setPlacementFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
              placementFilter === "all"
                ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                : "bg-[#18181C] text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            All ({filterCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setPlacementFilter("site_wide")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
              placementFilter === "site_wide"
                ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                : "bg-[#18181C] text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Site-wide ({filterCounts.site_wide})
          </button>

          <button
            type="button"
            onClick={() => setPlacementFilter("floating")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
              placementFilter === "floating"
                ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                : "bg-[#18181C] text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Floating ({filterCounts.floating})
          </button>

          <button
            type="button"
            onClick={() => setPlacementFilter("page_specific")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
              placementFilter === "page_specific"
                ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                : "bg-[#18181C] text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Page ({filterCounts.page_specific})
          </button>
        </div>
      </div>

      {/* ── Saved Embed Cards matching Mockup Image 1 ─────────────────── */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-4 space-y-2.5">
        {allEmbeds.length === 0 ? (
          <div className="my-8 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-[#2B2B30] bg-[#161619]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-3">
              <Puzzle className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">
              No plugins added to this website yet.
            </h4>
            <p className="text-[11px] text-zinc-400 max-w-[220px] mb-4 leading-relaxed">
              Add YouTube videos, WhatsApp button, custom scripts, or third-party tools.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-md"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>+ Add Plugin</span>
            </button>
          </div>
        ) : filteredEmbeds.length === 0 ? (
          <div className="my-8 p-6 text-center rounded-2xl border border-dashed border-[#2B2B30] bg-[#161619]">
            <Search className="mx-auto h-6 w-6 text-zinc-500 mb-2" />
            <p className="text-xs font-medium text-zinc-300">No matching plugins found</p>
            <p className="mt-1 text-[11px] text-zinc-500">Try selecting another filter or clearing your search</p>
          </div>
        ) : (
          filteredEmbeds.map((item, idx) => {
            const isMenuOpen = activeMenuId === item.id;
            const isDeleting = deleteConfirmId === item.id;
            const isSelected = selectedEmbedId === item.id || (item.sectionId && selectedSectionId === item.sectionId);

            return (
              <div
                key={item.id}
                onClick={() => handleSelectEmbed(item)}
                className={`group relative rounded-2xl border p-3.5 transition-all duration-150 cursor-pointer ${
                  isSelected || (idx === 0 && !selectedEmbedId)
                    ? "border-[#FACC15] bg-[#161618] shadow-md shadow-amber-400/5 ring-1 ring-amber-400/20"
                    : "border-[#252529] bg-[#161618] hover:border-zinc-600 hover:bg-[#1A1A1D]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left Icon Block */}
                  {getEmbedIcon(item)}

                  {/* Middle Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white truncate" title={item.name}>
                      {item.name}
                    </h4>

                    {/* Badge */}
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {item.displayType === "site_wide" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-900/40 border border-purple-500/40 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                          <Info className="h-2.5 w-2.5" />
                          <span>Site-wide</span>
                        </span>
                      )}
                      {item.displayType === "floating" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <Info className="h-2.5 w-2.5" />
                          <span>Floating</span>
                        </span>
                      )}
                      {item.displayType === "inline" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          <Info className="h-2.5 w-2.5" />
                          <span>Page</span>
                        </span>
                      )}
                    </div>

                    {/* Subtitle: Actual Placement */}
                    <p className="mt-1 text-xs text-zinc-400 truncate">
                      {item.placementLabel}
                    </p>
                  </div>

                  {/* Right Controls: Green Toggle Switch, Pencil Edit, More Dots */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Toggle Switch */}
                    <Switch
                      checked={!item.hidden}
                      onCheckedChange={() => handleToggleEnable(item)}
                      className="data-[state=checked]:bg-emerald-500"
                    />

                    {/* Pencil Edit Icon */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(item, e)}
                      title="Edit plugin settings"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* More Menu Trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : item.id);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-[#2B2B30] bg-[#1E1E22] p-1.5 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(item, e)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>Duplicate</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(item, e)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-red-400 hover:bg-red-500/15 hover:text-red-300 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove Plugin</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <CustomEmbedModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setItemToEdit(null);
          }}
          embedToEdit={itemToEdit}
        />
      )}
    </div>
  );
}
