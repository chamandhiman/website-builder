"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useBuilder } from "@/lib/builder/store";
import {
  Code2,
  Search,
  X,
  Pencil,
  Copy,
  Trash2,
  Globe,
  MoreVertical,
  Puzzle,
  MessageCircle,
  Accessibility,
  MapPin,
  Youtube,
  Phone,
  ArrowUp,
  Megaphone,
  Star,
  Video,
  Navigation,
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

type CategoryFilter = "all" | "social" | "maps" | "media" | "tools";

interface CatalogItem {
  id: string;
  name: string;
  category: "social" | "maps" | "media" | "tools";
  categoryLabel: string;
  description: string;
  pluginType: string;
  iconBg: string;
  iconType: "whatsapp" | "youtube" | "maps" | "language" | "accessibility" | "custom_html" | "contact" | "back_to_top" | "announcement" | "reviews" | "vimeo" | "store_locator";
}

const PLUGIN_CATALOG: CatalogItem[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Chat",
    category: "social",
    categoryLabel: "Social",
    description: "Add WhatsApp chat button to your website.",
    pluginType: "whatsapp",
    iconBg: "bg-[#25D366]",
    iconType: "whatsapp",
  },
  {
    id: "youtube",
    name: "YouTube Video",
    category: "media",
    categoryLabel: "Media",
    description: "Embed YouTube videos with custom settings.",
    pluginType: "youtube",
    iconBg: "bg-[#E02424]",
    iconType: "youtube",
  },
  {
    id: "maps",
    name: "Google Maps",
    category: "maps",
    categoryLabel: "Maps",
    description: "Add Google Map to show your location.",
    pluginType: "maps",
    iconBg: "bg-[#34A853]",
    iconType: "maps",
  },
  {
    id: "language",
    name: "Language Switcher",
    category: "tools",
    categoryLabel: "Tools",
    description: "Let visitors change website language.",
    pluginType: "language",
    iconBg: "bg-[#2563EB]",
    iconType: "language",
  },
  {
    id: "accessibility",
    name: "Accessibility Toolbar",
    category: "tools",
    categoryLabel: "Tools",
    description: "Improve website accessibility for all users.",
    pluginType: "accessibility",
    iconBg: "bg-[#9333EA]",
    iconType: "accessibility",
  },
  {
    id: "custom_html",
    name: "Custom HTML",
    category: "tools",
    categoryLabel: "Tools",
    description: "Add your own HTML, iframe or script.",
    pluginType: "custom_html",
    iconBg: "bg-[#27272A]",
    iconType: "custom_html",
  },
  {
    id: "contact",
    name: "Floating Contact Button",
    category: "social",
    categoryLabel: "Social",
    description: "Quick-action floating button connecting visitors directly.",
    pluginType: "contact",
    iconBg: "bg-[#0284C7]",
    iconType: "contact",
  },
  {
    id: "back_to_top",
    name: "Back to Top",
    category: "tools",
    categoryLabel: "Tools",
    description: "Smooth scroll-to-top button that appears on scroll.",
    pluginType: "back_to_top",
    iconBg: "bg-[#4F46E5]",
    iconType: "back_to_top",
  },
  {
    id: "announcement",
    name: "Announcement Popup",
    category: "tools",
    categoryLabel: "Tools",
    description: "Display timed or sticky announcement banners.",
    pluginType: "announcement",
    iconBg: "bg-[#D97706]",
    iconType: "announcement",
  },
  {
    id: "reviews",
    name: "Google Reviews",
    category: "social",
    categoryLabel: "Social",
    description: "Show real-time customer ratings and testimonials.",
    pluginType: "reviews",
    iconBg: "bg-[#EA4335]",
    iconType: "reviews",
  },
  {
    id: "vimeo",
    name: "Vimeo Video",
    category: "media",
    categoryLabel: "Media",
    description: "Embed Vimeo video player with custom controls.",
    pluginType: "vimeo",
    iconBg: "bg-[#1AB7EA]",
    iconType: "vimeo",
  },
  {
    id: "store_locator",
    name: "Store Locator",
    category: "maps",
    categoryLabel: "Maps",
    description: "Interactive store locations and directions map.",
    pluginType: "store_locator",
    iconBg: "bg-[#059669]",
    iconType: "store_locator",
  },
];

export function CustomEmbedsPanel() {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const selectedSectionId = useBuilder((s) => s.selectedSectionId);
  const selectSection = useBuilder((s) => s.selectSection);
  const selectPage = useBuilder((s) => s.selectPage);
  const removeSection = useBuilder((s) => s.removeSection);
  const duplicateSection = useBuilder((s) => s.duplicateSection);
  const updateSection = useBuilder((s) => s.updateSection);
  const persistWithStatus = useBuilder((s) => s.persistWithStatus);

  // Top Tabs: "My Plugins" vs "Add New" (Add New is active by default)
  const [internalTab, setInternalTab] = useState<"my_plugins" | "add_new">("add_new");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filters for My Plugins
  const [placementFilter, setPlacementFilter] = useState<"all" | EmbedPlacementScope>("all");

  // Filters for Add New
  const [catalogCategory, setCatalogCategory] = useState<CategoryFilter>("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CustomEmbedItem | null>(null);
  const [pluginTypeToAdd, setPluginTypeToAdd] = useState<string | null>(null);

  // Active Menu / Delete state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedEmbedId, setSelectedEmbedId] = useState<string | null>(null);

  // Extract all plugins belonging to current website
  const allEmbeds = useMemo(() => {
    return getProjectCustomEmbeds(project);
  }, [project]);

  // Counts for My Plugins filter chips
  const filterCounts = useMemo(() => {
    return {
      all: allEmbeds.length,
      site_wide: allEmbeds.filter((e) => e.placementScope === "site_wide").length,
      floating: allEmbeds.filter((e) => e.placementScope === "floating").length,
      page_specific: allEmbeds.filter((e) => e.placementScope === "page_specific").length,
    };
  }, [allEmbeds]);

  // Counts for Add New catalog filter chips
  const catalogCounts = useMemo(() => {
    return {
      all: PLUGIN_CATALOG.length,
      social: PLUGIN_CATALOG.filter((p) => p.category === "social").length,
      maps: PLUGIN_CATALOG.filter((p) => p.category === "maps").length,
      media: PLUGIN_CATALOG.filter((p) => p.category === "media").length,
      tools: PLUGIN_CATALOG.filter((p) => p.category === "tools").length,
    };
  }, []);

  // Filtered list of My Plugins
  const filteredMyPlugins = useMemo(() => {
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

  // Filtered list of Add New catalog
  const filteredCatalog = useMemo(() => {
    let list = PLUGIN_CATALOG;
    if (catalogCategory !== "all") {
      list = list.filter((p) => p.category === catalogCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [catalogCategory, searchQuery]);

  // Listen for external open event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ embedId?: string }>;
      const embedId = customEvent?.detail?.embedId;
      if (embedId) {
        const found = allEmbeds.find((item) => item.id === embedId || item.sectionId === embedId);
        if (found) {
          setItemToEdit(found);
          setPluginTypeToAdd(null);
          setModalOpen(true);
        }
      }
    };
    window.addEventListener("wto-open-embed-editor", handleOpen);
    return () => window.removeEventListener("wto-open-embed-editor", handleOpen);
  }, [allEmbeds]);

  const handleOpenAddModal = (pType?: string) => {
    setItemToEdit(null);
    setPluginTypeToAdd(pType || "custom_html");
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: CustomEmbedItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);
    setItemToEdit(item);
    setPluginTypeToAdd(null);
    setModalOpen(true);
  };

  const handleSelectEmbed = (item: CustomEmbedItem) => {
    setActiveMenuId(null);
    setSelectedEmbedId(item.id);

    if (item.displayType === "floating") {
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

  // Render icon for a plugin card
  const renderCardIcon = (iconType: string, customBg?: string) => {
    const bgClass = customBg || "bg-[#27272A]";
    switch (iconType) {
      case "whatsapp":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
            <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/>
            </svg>
          </div>
        );
      case "youtube":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E02424] text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        );
      case "maps":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#34A853] text-white shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>
        );
      case "language":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
            <Globe className="h-6 w-6" />
          </div>
        );
      case "accessibility":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#9333EA] text-white shadow-sm">
            <Accessibility className="h-6 w-6" />
          </div>
        );
      case "contact":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0284C7] text-white shadow-sm">
            <Phone className="h-5 w-5" />
          </div>
        );
      case "back_to_top":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-sm">
            <ArrowUp className="h-6 w-6" />
          </div>
        );
      case "announcement":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D97706] text-white shadow-sm">
            <Megaphone className="h-5 w-5" />
          </div>
        );
      case "reviews":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EA4335] text-white shadow-sm">
            <Star className="h-5 w-5 fill-current" />
          </div>
        );
      case "vimeo":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1AB7EA] text-white shadow-sm">
            <Video className="h-5 w-5" />
          </div>
        );
      case "store_locator":
        return (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-white shadow-sm">
            <Navigation className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bgClass} text-white shadow-sm border border-zinc-700/60 font-mono text-sm font-bold`}>
            &lt;/&gt;
          </div>
        );
    }
  };

  // Helper to resolve iconType for saved CustomEmbedItem
  const getEmbedIconType = (item: CustomEmbedItem) => {
    if (item.pluginType) return item.pluginType;
    const lowerName = item.name.toLowerCase();
    const lowerHtml = item.html.toLowerCase();
    if (lowerName.includes("youtube") || lowerHtml.includes("youtube.com") || lowerHtml.includes("youtu.be")) return "youtube";
    if (lowerName.includes("whatsapp") || lowerHtml.includes("wa.me") || lowerHtml.includes("whatsapp")) return "whatsapp";
    if (lowerName.includes("accessibility") || lowerHtml.includes("accessibility")) return "accessibility";
    if (lowerName.includes("language") || lowerName.includes("translate")) return "language";
    if (lowerName.includes("map") || lowerHtml.includes("maps.google") || lowerHtml.includes("google.com/maps")) return "maps";
    if (lowerName.includes("contact")) return "contact";
    if (lowerName.includes("top")) return "back_to_top";
    if (lowerName.includes("announcement")) return "announcement";
    if (lowerName.includes("review")) return "reviews";
    return "custom_html";
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#121214] text-[#F5F5F5]">
      {/* ── HEADER (Plugins [N] + 2 Segmented Tabs) ───────────────────────── */}
      <div className="shrink-0 p-3.5 space-y-3 border-b border-[#222225] bg-[#141416]">
        {/* Title + Pill Badge */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Plugins</h2>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FACC15] px-1.5 text-xs font-bold text-zinc-950 shadow-xs">
            {allEmbeds.length}
          </span>
        </div>

        {/* 2 Segmented Tabs: My Plugins | Add New */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#1A1A1E] border border-zinc-800/80">
          <button
            type="button"
            onClick={() => setInternalTab("my_plugins")}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              internalTab === "my_plugins"
                ? "bg-[#FACC15] text-zinc-950 shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            My Plugins
          </button>
          <button
            type="button"
            onClick={() => setInternalTab("add_new")}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              internalTab === "add_new"
                ? "bg-[#FACC15] text-zinc-950 shadow-sm"
                : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Add New
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins.."
            className="h-9 w-full rounded-xl border border-zinc-800 bg-[#17171A] pl-9 pr-8 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-zinc-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        {internalTab === "my_plugins" ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={() => setPlacementFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                placementFilter === "all"
                  ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              All ({filterCounts.all})
            </button>

            <button
              type="button"
              onClick={() => setPlacementFilter("site_wide")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                placementFilter === "site_wide"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Site-wide ({filterCounts.site_wide})
            </button>

            <button
              type="button"
              onClick={() => setPlacementFilter("floating")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                placementFilter === "floating"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Floating ({filterCounts.floating})
            </button>

            <button
              type="button"
              onClick={() => setPlacementFilter("page_specific")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                placementFilter === "page_specific"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Page ({filterCounts.page_specific})
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              type="button"
              onClick={() => setCatalogCategory("all")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 ${
                catalogCategory === "all"
                  ? "bg-[#FACC15] text-zinc-950 shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              All ({catalogCounts.all})
            </button>

            <button
              type="button"
              onClick={() => setCatalogCategory("social")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                catalogCategory === "social"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Social ({catalogCounts.social})
            </button>

            <button
              type="button"
              onClick={() => setCatalogCategory("maps")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                catalogCategory === "maps"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Maps ({catalogCounts.maps})
            </button>

            <button
              type="button"
              onClick={() => setCatalogCategory("media")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                catalogCategory === "media"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Media ({catalogCounts.media})
            </button>

            <button
              type="button"
              onClick={() => setCatalogCategory("tools")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                catalogCategory === "tools"
                  ? "bg-[#FACC15] text-zinc-950 font-bold shadow-xs"
                  : "bg-[#18181C] text-zinc-300 hover:text-white border border-zinc-800"
              }`}
            >
              Tools ({catalogCounts.tools})
            </button>
          </div>
        )}
      </div>

      {/* ── BODY (Scrollable Cards Area) ───────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5">
        {internalTab === "my_plugins" ? (
          /* TAB 1: MY PLUGINS */
          allEmbeds.length === 0 ? (
            <div className="my-8 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#161619]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] mb-3">
                <Puzzle className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">
                No plugins added yet
              </h4>
              <p className="text-[11px] text-zinc-400 max-w-[220px] mb-4 leading-relaxed">
                Add WhatsApp chat, YouTube video, Google Maps, or custom tools to your website.
              </p>
              <button
                type="button"
                onClick={() => setInternalTab("add_new")}
                className="flex items-center gap-1.5 rounded-lg bg-[#FACC15] px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-[#FDE047] shadow-md"
              >
                <span>Discover Plugins</span>
                <span>→</span>
              </button>
            </div>
          ) : filteredMyPlugins.length === 0 ? (
            <div className="my-8 p-6 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#161619]">
              <Search className="mx-auto h-6 w-6 text-zinc-500 mb-2" />
              <p className="text-xs font-medium text-zinc-300">No matching plugins</p>
              <p className="mt-1 text-[11px] text-zinc-500">Try choosing another filter or clearing your search</p>
            </div>
          ) : (
            filteredMyPlugins.map((item) => {
              const isMenuOpen = activeMenuId === item.id;
              const isSelected = selectedEmbedId === item.id || (item.sectionId && selectedSectionId === item.sectionId);
              const iconType = getEmbedIconType(item);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectEmbed(item)}
                  className={`group relative rounded-2xl border p-3 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "border-[#FACC15] bg-[#161618] shadow-md shadow-amber-400/5 ring-1 ring-[#FACC15]/20"
                      : "border-zinc-800/80 bg-[#161618] hover:border-zinc-700 hover:bg-[#1A1A1D]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left Icon Block */}
                    {renderCardIcon(iconType)}

                    {/* Middle Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate" title={item.name}>
                        {item.name}
                      </h4>

                      {/* Placement Badge */}
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {item.displayType === "site_wide" && (
                          <span className="inline-flex items-center rounded-full bg-purple-950/70 border border-purple-500/40 px-2 py-0.2 text-[10px] font-semibold text-purple-300">
                            Site-wide
                          </span>
                        )}
                        {item.displayType === "floating" && (
                          <span className="inline-flex items-center rounded-full bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.2 text-[10px] font-semibold text-emerald-400">
                            Floating
                          </span>
                        )}
                        {item.displayType === "inline" && (
                          <span className="inline-flex items-center rounded-full bg-amber-950/70 border border-amber-500/40 px-2 py-0.2 text-[10px] font-semibold text-amber-300">
                            Page
                          </span>
                        )}
                      </div>

                      {/* Subtitle: Placement Label */}
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
                        className="data-[state=checked]:bg-[#25D366]"
                      />

                      {/* Pencil Edit Icon */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(item, e)}
                        title="Edit plugin configuration"
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
                            className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-zinc-800 bg-[#1E1E22] p-1.5 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={(e) => handleDuplicate(item, e)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                            >
                              <Copy className="h-3.5 w-3.5 text-zinc-400" />
                              <span>Duplicate</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(item, e)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-rose-400 hover:bg-rose-500/10 transition mt-0.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* TAB 2: ADD NEW CATALOG */
          filteredCatalog.length === 0 ? (
            <div className="my-8 p-6 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#161619]">
              <Search className="mx-auto h-6 w-6 text-zinc-500 mb-2" />
              <p className="text-xs font-medium text-zinc-300">No matching plugins in catalog</p>
              <p className="mt-1 text-[11px] text-zinc-500">Try choosing another category or clearing search</p>
            </div>
          ) : (
            filteredCatalog.map((plugin) => {
              return (
                <div
                  key={plugin.id}
                  className="group rounded-2xl border border-zinc-800/80 bg-[#161618] p-3 flex items-center justify-between gap-3 hover:border-zinc-700 hover:bg-[#1A1A1D] transition-all"
                >
                  {/* Icon */}
                  {renderCardIcon(plugin.iconType, plugin.iconBg)}

                  {/* Middle Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white truncate">
                      {plugin.name}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                      {plugin.description}
                    </p>
                  </div>

                  {/* Yellow Add Button matching Mockup 2 */}
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal(plugin.pluginType)}
                    className="shrink-0 flex items-center justify-center rounded-lg bg-[#FACC15] hover:bg-[#FDE047] px-4 py-1.5 text-xs font-bold text-zinc-950 transition shadow-xs active:scale-95"
                  >
                    Add
                  </button>
                </div>
              );
            })
          )
        )}
      </div>

      {/* ── Plugin Config Modal ─────────────────────────────── */}
      <CustomEmbedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        embedToEdit={itemToEdit}
        initialPluginType={pluginTypeToAdd}
        onSaved={() => {
          setInternalTab("my_plugins");
        }}
      />
    </div>
  );
}
