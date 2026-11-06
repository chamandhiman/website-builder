"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useBuilder } from "@/lib/builder/store";
import { LayersPanel } from "./LayersPanel";
import { InspectorPanel } from "./InspectorPanel";
import { PropertyPanel } from "./property-panel/PropertyPanel";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid2x2,
  FileText,
  Settings,
  Search,
  X,
  Plus,
  GripVertical,
  Sparkles,
  PanelTop,
  PanelBottom,
  BarChart3,
  SlidersHorizontal,
  Images,
  HelpCircle,
  Briefcase,
  UserCheck,
  Flame,
  Boxes,
  Users,
  CreditCard,
  MessageSquareQuote,
  Layers,
  Star,
  Code2,
  Puzzle,
  Youtube,
  Video,
  MapPin,
  Navigation,
  Pencil,
  Trash2,
  MoreVertical,
  Copy,
  Eye,
  EyeOff,
  Info,
  Mail,
  Image as ImageIcon,
  Quote,
  Layout,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  composePageSections,
  isNavbarSection,
  isFooterSection,
  isSharedChromeSection,
  SHARED_HEADER_SECTION_ID,
  SHARED_FOOTER_SECTION_ID,
} from "@/lib/builder/sharedChrome";
import type { PageSection } from "@/lib/builder/store";
import { useMounted } from "@/hooks/use-mounted";
import {
  getAllWidgetRegistrations,
  createWidgetInstance,
  getWidgetPlacementClassification,
  type WidgetRegistration,
} from "./widgets/widgetRegistry";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { CustomEmbedsPanel } from "./CustomEmbedsPanel";
import { CustomEmbedModal } from "./CustomEmbedModal";
import { getProjectCustomEmbeds } from "@/lib/builder/customEmbedsUtils";
import { toast } from "sonner";
import { nanoid } from "nanoid";

// Media & Embeds items shown in Sections tab — these are page sections, not floating plugins
const MEDIA_EMBED_SECTIONS = [
  {
    id: "youtube",
    label: "YouTube Video",
    subtitle: "Embed a YouTube video into the page",
    widgetType: "youtube",
    Icon: Youtube,
    iconBg: "bg-[#E02424]",
  },
  {
    id: "vimeo",
    label: "Vimeo Video",
    subtitle: "Embed a Vimeo video into the page",
    widgetType: "vimeo",
    Icon: Video,
    iconBg: "bg-[#1AB7EA]",
  },
  {
    id: "map",
    label: "Google Map",
    subtitle: "Interactive map with location card",
    widgetType: "map",
    Icon: MapPin,
    iconBg: "bg-[#34A853]",
  },
  {
    id: "google-reviews",
    label: "Google Reviews",
    subtitle: "Live customer reviews section",
    widgetType: "google-reviews",
    Icon: Star,
    iconBg: "bg-[#EA4335]",
  },
  {
    id: "store_locator",
    label: "Store Locator",
    subtitle: "Interactive store locations map",
    widgetType: "store_locator",
    Icon: Navigation,
    iconBg: "bg-[#059669]",
  },
  {
    id: "custom-html",
    label: "Custom HTML / Embed",
    subtitle: "Paste HTML, iframe or embed code",
    widgetType: "custom-html",
    Icon: Code2,
    iconBg: "bg-[#27272A]",
  },
] as const;


const TABS = [
  { key: "widgets", label: "Sections", Icon: Grid2x2 },
  { key: "embeds", label: "Plugins", Icon: Puzzle },
  { key: "properties", label: "Properties", Icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getSectionVisual(section: PageSection) {
  const isHeader = section.shared === "header" || isNavbarSection(section) || section.id === SHARED_HEADER_SECTION_ID;
  const isFooter = section.shared === "footer" || isFooterSection(section) || section.id === SHARED_FOOTER_SECTION_ID;

  if (isHeader) {
    return {
      Icon: PanelTop,
      name: section.name || "Header",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }
  if (isFooter) {
    return {
      Icon: PanelBottom,
      name: section.name || "Footer",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  const widgetType = section.widgetInstance?.type?.toLowerCase() || "";
  const name = String(section.name || "").toLowerCase();
  const templateId = String(section.templateId || "").toLowerCase();

  // Custom HTML / Embed
  if (widgetType === "custom-html" || name.includes("custom html") || templateId.includes("custom-html")) {
    return {
      Icon: Code2,
      name: section.name || "Custom HTML",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Map
  if (widgetType === "map" || name.includes("map") || templateId.includes("map")) {
    return {
      Icon: MapPin,
      name: section.name || "Map",
      iconBg: "bg-[#EF4444]",
      iconColor: "text-white",
    };
  }

  // Contact
  if (widgetType === "contact" || name.includes("contact") || templateId.includes("contact")) {
    return {
      Icon: Mail,
      name: section.name || "Contact",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Team
  if (widgetType === "team" || name.includes("team") || templateId.includes("team")) {
    return {
      Icon: Users,
      name: section.name || "Team",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Hero / Banner
  if (widgetType === "hero" || name.includes("banner") || name.includes("hero") || templateId.includes("hero")) {
    return {
      Icon: Sparkles,
      name: section.name || "Banner",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // About Us
  if (widgetType === "about" || name.includes("about") || templateId.includes("about")) {
    return {
      Icon: UserCheck,
      name: section.name || "About Us",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Services
  if (widgetType === "services" || name.includes("services") || templateId.includes("services")) {
    return {
      Icon: Briefcase,
      name: section.name || "Services",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // FAQ
  if (widgetType === "faq" || name.includes("faq") || templateId.includes("faq")) {
    return {
      Icon: HelpCircle,
      name: section.name || "FAQ",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Gallery
  if (widgetType === "gallery" || name.includes("gallery") || templateId.includes("gallery")) {
    return {
      Icon: ImageIcon,
      name: section.name || "Gallery",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Carousel
  if (widgetType === "carousel" || name.includes("carousel") || templateId.includes("carousel")) {
    return {
      Icon: SlidersHorizontal,
      name: section.name || "Carousel",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // YouTube
  if (widgetType === "youtube" || name.includes("youtube")) {
    return {
      Icon: Youtube,
      name: section.name || "YouTube",
      iconBg: "bg-[#E02424]",
      iconColor: "text-white",
    };
  }

  // Vimeo
  if (widgetType === "vimeo" || name.includes("vimeo")) {
    return {
      Icon: Video,
      name: section.name || "Vimeo",
      iconBg: "bg-[#1AB7EA]",
      iconColor: "text-white",
    };
  }

  // Reviews
  if (widgetType === "reviews" || widgetType === "google-reviews" || name.includes("review")) {
    return {
      Icon: Star,
      name: section.name || "Reviews",
      iconBg: "bg-[#EA4335]",
      iconColor: "text-white",
    };
  }

  // Testimonials
  if (name.includes("testimonial") || templateId.includes("testimonial")) {
    return {
      Icon: Quote,
      name: section.name || "Testimonials",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // CTA
  if (widgetType === "cta" || name.includes("cta") || templateId.includes("cta")) {
    return {
      Icon: Sparkles,
      name: section.name || "Call to Action",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Features / Grid
  if (widgetType === "grid" || name.includes("feature")) {
    return {
      Icon: Star,
      name: section.name || "Features",
      iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
      iconColor: "text-[#7137D8]",
    };
  }

  // Fallback
  return {
    Icon: Layout,
    name: section.name || "Section",
    iconBg: "bg-[#F1F5F9] border border-[#E2E8F0]",
    iconColor: "text-[#7137D8]",
  };
}

function getWidgetVisual(widget: WidgetRegistration) {
  const type = widget.type?.toLowerCase() || "";
  const id = widget.id?.toLowerCase() || "";
  const name = widget.displayName?.toLowerCase() || "";

  // 1. Header (Navbar)
  if (type === "navbar" || id.includes("navbar") || name.includes("header")) {
    return {
      Icon: PanelTop,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Navbar & brand navigation",
    };
  }
  // 2. Carousel
  if (type === "carousel" || id.includes("carousel")) {
    return {
      Icon: SlidersHorizontal,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Interactive image carousel slider",
    };
  }
  // 3. Banner (Hero)
  if (type === "hero" || id.includes("hero") || name === "banner") {
    return {
      Icon: Sparkles,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Hero banners & headline intros",
    };
  }
  // 4. About Us
  if (type === "about" || id.includes("about")) {
    return {
      Icon: UserCheck,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Split story, features & imagery",
    };
  }
  // 5. Services
  if (type === "services" || id.includes("services")) {
    return {
      Icon: Briefcase,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Service cards & feature highlights",
    };
  }
  // 6. Team
  if (type === "team" || id.includes("team")) {
    return {
      Icon: Users,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Static grid or carousel slider",
    };
  }
  // 7. FAQ
  if (type === "faq" || id.includes("faq")) {
    return {
      Icon: HelpCircle,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Collapsible Q&A accordion",
    };
  }
  // 8. Call To Action
  if (type === "cta" || id.includes("cta")) {
    return {
      Icon: Flame,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Conversion banners & actions",
    };
  }
  // 9. Pricing Section
  if (type === "pricing" || id.includes("pricing")) {
    return {
      Icon: CreditCard,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Pricing tiers & feature lists",
    };
  }
  // 10. Background Image overlay text banner
  if (type === "overlay-banner" || id.includes("overlay") || name.includes("overlay")) {
    return {
      Icon: Layers,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Background image with overlay text",
    };
  }
  // 11. Image Gallery
  if (type === "gallery" || id.includes("gallery")) {
    return {
      Icon: Images,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Photo gallery & showcase grid",
    };
  }
  // 12. Testimonials
  if (type === "testimonials" || id.includes("testimonial")) {
    return {
      Icon: MessageSquareQuote,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Reviews in static grid or carousel",
    };
  }
  // 12b. Google Reviews
  if (type === "google-reviews" || id.includes("google-review")) {
    return {
      Icon: Star,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Real-time Google Reviews & script widget",
    };
  }
  // 13. Footer
  if (type === "footer" || id.includes("footer")) {
    return {
      Icon: PanelBottom,
      accentColor: "text-[#7137D8]",
      badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
      subtitle: "Site footer, columns & copyright",
    };
  }
  return {
    Icon: Boxes,
    accentColor: "text-[#64748B]",
    badgeBg: "bg-[#F1F5F9] border-[#E2E8F0]",
    subtitle: "Section widget",
  };
}

export function RightContextPanel({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
} = {}) {
  const mounted = useMounted();
  const rightPanelTab = useBuilder((s) => s.rightPanelTab);
  const setRightPanelTab = useBuilder((s) => s.setRightPanelTab);
  const activeTab = rightPanelTab;
  const setActiveTab = setRightPanelTab;

  const [collapsed, setCollapsed] = useState(false);
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const selectedElement = useBuilder((s) => s.selectedElement);
  const selectedSectionId = useBuilder((s) => s.selectedSectionId);
  const selectElement = useBuilder((s) => s.selectElement);
  const selectSection = useBuilder((s) => s.selectSection);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentProjectId = useBuilder((s) => s.currentProjectId);
  const toggleHidden = useBuilder((s) => s.toggleHidden);
  const removeSection = useBuilder((s) => s.removeSection);
  const duplicateSection = useBuilder((s) => s.duplicateSection);
  const moveSection = useBuilder((s) => s.moveSection);

  // Search & Sections sub-tab state (Active vs Add New)
  const [q, setQ] = useState("");
  const [sectionsSubTab, setSectionsSubTab] = useState<"active" | "add_new">("active");
  const [searchOpen, setSearchOpen] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Embed modal state for Media & Embeds section items
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [embedModalPluginType, setEmbedModalPluginType] = useState<string | null>(null);

  const customEmbedsCount = useMemo(() => {
    return getProjectCustomEmbeds(project).length;
  }, [project]);

  // Page-specific current page & active sections
  const currentPage = useMemo(() => {
    if (!project) return null;
    return project.pages.find((p) => p.id === project.currentPageId) ?? project.pages[0] ?? null;
  }, [project]);

  const activeSections = useMemo(() => {
    if (!project || !currentPage) return [];
    return composePageSections(project, currentPage, { includeHiddenChrome: true });
  }, [project, currentPage]);

  const filteredActiveSections = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return activeSections;
    return activeSections.filter((section) => {
      const visual = getSectionVisual(section);
      const name = String(section.name || visual.name).toLowerCase();
      const widgetType = String(section.widgetInstance?.type || "").toLowerCase();
      return name.includes(query) || widgetType.includes(query);
    });
  }, [activeSections, q]);

  // Drag and drop reordering inside Active sections list
  const handleSectionDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData("application/x-wto-active-section", sectionId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedSectionId(sectionId);
  };

  const handleSectionDragOver = (e: React.DragEvent, targetId: string) => {
    if (!draggedSectionId || draggedSectionId === targetId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverSectionId(targetId);
  };

  const handleSectionDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedSectionId || draggedSectionId === targetId || !currentPage) {
      setDraggedSectionId(null);
      setDragOverSectionId(null);
      return;
    }
    const fromIndex = currentPage.sections.findIndex((s) => s.id === draggedSectionId);
    const toIndex = currentPage.sections.findIndex((s) => s.id === targetId);
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      moveSection(fromIndex, toIndex);
      toast.success("Section reordered");
    }
    setDraggedSectionId(null);
    setDragOverSectionId(null);
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionId(null);
    setDragOverSectionId(null);
  };

  const handleEditSection = (sectionId: string) => {
    selectSection(sectionId);
    setActiveTab("properties");
    window.dispatchEvent(new CustomEvent("wto-scroll-to-section", { detail: { sectionId } }));
  };

  useEffect(() => {
    if (selectedElement || selectedSectionId) {
      setActiveTab("properties");
      if (!isMobile) {
        setCollapsed(false);
      }
    }
  }, [selectedElement?.elementKey, selectedElement?.childId, selectedSectionId, isMobile]);

  const widgetRegistryEntries = useMemo(() => getAllWidgetRegistrations(), []);
  const [openWidgetId, setOpenWidgetId] = useState<string | null>(null);

  const visibleWidgets = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    const hiddenElementTypes = new Set([
      "heading",
      "text",
      "button",
      "image",
      "container",
      // Exclude media embed sections from regular widgets list as they have their authoritative colored-icon category
      "youtube",
      "vimeo",
      "map",
      "google-reviews",
      "store_locator",
      "custom-html",
    ]);
    return widgetRegistryEntries.filter((widget) => {
      if (hiddenElementTypes.has(widget.type)) return false;
      if (widget.id.toLowerCase().includes("container") || widget.displayName.toLowerCase() === "container") return false;
      if (!normalized) return true;
      const values = [
        widget.displayName,
        widget.type,
        widget.category,
        widget.description,
        widget.preview,
        widget.defaultVariant,
        ...(widget.supportedVariants ?? []),
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      return values.some((value) => value.includes(normalized));
    });
  }, [q, widgetRegistryEntries]);

  const visibleMediaEmbedSections = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    if (!normalized) return MEDIA_EMBED_SECTIONS;
    return MEDIA_EMBED_SECTIONS.filter((item) => {
      const reg = widgetRegistryEntries.find(
        (w) => w.type === item.widgetType || w.id === item.widgetType || w.id === `${item.widgetType}-v1`
      );
      const values = [
        item.label,
        item.subtitle,
        item.widgetType,
        reg?.displayName,
        reg?.description,
        reg?.preview,
        reg?.category,
        ...(reg?.supportedVariants ?? []),
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      return values.some((v) => v.includes(normalized));
    });
  }, [q, widgetRegistryEntries]);

  const totalTemplatesCount = useMemo(() => {
    const hiddenElementTypes = new Set([
      "heading",
      "text",
      "button",
      "image",
      "container",
      "youtube",
      "vimeo",
      "map",
      "google-reviews",
      "store_locator",
      "custom-html",
    ]);
    return widgetRegistryEntries.filter((w) => !hiddenElementTypes.has(w.type) && !w.id.toLowerCase().includes("container")).length + MEDIA_EMBED_SECTIONS.length;
  }, [widgetRegistryEntries]);

  const addWidgetVariant = (widget: WidgetRegistration, variant: string) => {
    const classification = getWidgetPlacementClassification(widget.id);

    if (classification === "inline_embed") {
      setActiveTab("embeds");
      return;
    }

    if (classification === "floating") {
      const existing = (project?.floatingWidgets || []).find((f) => f.type === widget.type);
      if (existing) {
        toast.info(`"${widget.displayName}" is already active in floating overlay`);
        return;
      }
      const newFw = {
        id: `fw-${nanoid(8)}`,
        type: widget.type as any,
        name: widget.displayName,
        enabled: true,
        position: "bottom_right" as const,
        offsetX: 20,
        offsetY: 20,
        showOnDesktop: true,
        showOnMobile: true,
        pageTargeting: "all" as const,
        config: {},
      };
      useBuilder.setState((s) => {
        const cur = s.currentProjectId ? s.projects[s.currentProjectId] : null;
        if (!cur) return s;
        return {
          projects: {
            ...s.projects,
            [cur.id]: {
              ...cur,
              floatingWidgets: [...(cur.floatingWidgets || []), newFw],
            },
          },
        };
      });
      useBuilder.getState().persistWithStatus();
      toast.success(`Added floating "${widget.displayName}" to site overlay`);
      return;
    }

    const widgetInstance = createWidgetInstance(widget.id, { variant });
    const sectionTemplate = {
      id: `${widget.id}-${widgetInstance.id}`,
      name: widget.displayName,
      category: widget.category,
      html: "",
      widgetInstance,
      thumbBg: "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(59,130,246,0.08))",
    } as any;
    const addSection = useBuilder.getState().addSection;
    const sectionId = addSection(sectionTemplate);
    if (!sectionId) return;

    useBuilder.getState().selectSection(sectionId);

    window.setTimeout(() => {
      const iframe = document.querySelector("iframe[title='preview']") as HTMLIFrameElement | null;
      const doc = iframe?.contentDocument;
      const section = doc?.querySelector(`[data-wto-section="${sectionId}"]`) as HTMLElement | null;
      section?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
  };

  const beginWidgetDrag = (event: React.DragEvent, widget: WidgetRegistration, variant?: string) => {
    const classification = getWidgetPlacementClassification(widget.id);
    if (classification !== "page") {
      event.preventDefault();
      return;
    }

    const resolvedVariant = variant || widget.defaultVariant || widget.supportedVariants?.[0] || "";
    event.dataTransfer.setData("application/x-wto-widget", widget.id);
    if (resolvedVariant) event.dataTransfer.setData("application/x-wto-widget-variant", resolvedVariant);
    event.dataTransfer.setData("text/plain", widget.id);
    event.dataTransfer.effectAllowed = "copy";
    window.dispatchEvent(
      new CustomEvent("wto-library-drag-start", {
        detail: { kind: "widget", widgetId: widget.id, variant: resolvedVariant || undefined },
      }),
    );
  };

  const endLibraryDrag = () => {
    window.dispatchEvent(new CustomEvent("wto-library-drag-end"));
  };

  const handleSelectPage = (pageId: string) => {
    useBuilder.getState().selectPage(pageId);
    if (currentProjectId) {
      const editorPath = `/editor/${currentProjectId}`;
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("pageId", pageId);
        if (window.location.pathname === editorPath) {
          window.history.replaceState(window.history.state, "", url.toString());
        } else {
          navigate({ to: `${editorPath}?pageId=${pageId}` as never } as any);
        }
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <aside
      className={`flex h-full flex-col bg-white transition-all duration-300 ease-in-out ${isMobile ? "w-full border-l-0" : `border-l border-[#E2E8F0] ${collapsed ? "w-[48px]" : "w-[310px]"}`
        }`}
    >
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-2.5">
        {!collapsed || isMobile ? (
          <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1">
            {TABS.map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${isActive
                      ? "border border-[#7137D8]/30 bg-[#EDE9FE] text-[#7137D8] shadow-xs"
                      : "border border-transparent text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8]"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="truncate">{label}</span>
                  {key === "widgets" && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive
                          ? "bg-[#7137D8] text-white shadow-xs"
                          : "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                    >
                      {totalTemplatesCount}
                    </span>
                  )}
                  {key === "embeds" && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive
                          ? "bg-[#7137D8] text-white shadow-xs"
                          : "bg-[#F1F5F9] text-[#64748B]"
                        }`}
                    >
                      {customEmbedsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <TooltipProvider delayDuration={120}>
            <div className="flex w-full flex-col items-center gap-1">
              {TABS.map(({ key, Icon }) => {
                const isActive = activeTab === key;
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => { setActiveTab(key); setCollapsed(false); }}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition ${isActive ? "bg-[#EDE9FE] text-[#7137D8]" : "text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8]"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {key === "embeds" && customEmbedsCount > 0 && (
                          <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-[#7137D8] ring-2 ring-white" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {key === "embeds" ? `Plugins (${customEmbedsCount})` : key === "widgets" ? "Sections" : "Properties"}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        )}
        {isMobile && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition hover:bg-[#F1F5F9] hover:text-[#000000]"
            title="Close panel"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        ) : !isMobile ? (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition hover:bg-[#F1F5F9] hover:text-[#000000]"
            title={collapsed ? "Expand panel" : "Collapse panel"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {(!collapsed || isMobile) && (
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === "widgets" && (
            <div className="flex h-full flex-col overflow-hidden">
              {/* Secondary Navigation Bar: Active (N) | + Add New | Search Toggle */}
              <div className="shrink-0 border-b border-[#E2E8F0] bg-[#F8FAFC] p-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  {/* Active (N) Button */}
                  <button
                    type="button"
                    onClick={() => setSectionsSubTab("active")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${sectionsSubTab === "active"
                        ? "border border-[#7137D8] bg-[#F8FAFC] text-[#7137D8] shadow-xs"
                        : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:text-[#000000] hover:border-[#CBD5E1]"
                      }`}
                  >
                    <Layers className={`h-4 w-4 ${sectionsSubTab === "active" ? "text-[#7137D8]" : "text-[#64748B]"}`} />
                    <span>Active ({activeSections.length})</span>
                  </button>

                  {/* + Add New Button */}
                  <button
                    type="button"
                    onClick={() => setSectionsSubTab("add_new")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${sectionsSubTab === "add_new"
                        ? "bg-[#7137D8] text-white shadow-sm"
                        : "bg-[#7137D8] text-white hover:bg-[#6025C5] shadow-xs"
                      }`}
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add New</span>
                  </button>

                  {/* Search Icon Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen((prev) => {
                        const next = !prev;
                        if (!next) setQ("");
                        return next;
                      });
                    }}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${searchOpen || q
                        ? "bg-[#7137D8] text-white border-[#7137D8] shadow-xs"
                        : "bg-[#F8FAFC] text-[#64748B] hover:text-[#000000] border-[#E2E8F0] hover:border-[#CBD5E1]"
                      }`}
                    title={searchOpen ? "Close search" : "Search sections"}
                    aria-label="Search sections"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>

                {/* Expandable Search Input */}
                {(searchOpen || q) && (
                  <div className="relative flex items-center animate-in fade-in slide-in-from-top-1 duration-150">
                    <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#94A3B8]" />
                    <input
                      ref={searchInputRef}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={sectionsSubTab === "active" ? "Search active sections on this page..." : "Search sections & variants..."}
                      className="h-9 w-full rounded-xl border border-[#E2E8F0] bg-white pl-8 pr-8 text-xs text-[#111827] placeholder-zinc-500 outline-none transition focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]/20"
                    />
                    {q ? (
                      <button
                        type="button"
                        onClick={() => setQ("")}
                        className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-[#94A3B8] hover:text-[#000000]"
                        title="Clear search"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setQ("");
                        }}
                        className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-[#94A3B8] hover:text-[#000000]"
                        title="Close search"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Subtitle count text (Image 2) */}
                <p className="text-[11px] text-[#94A3B8] px-0.5">
                  {sectionsSubTab === "active"
                    ? `${activeSections.length} active section${activeSections.length === 1 ? "" : "s"} on this page`
                    : `${totalTemplatesCount} section templates available`}
                </p>
              </div>

              {/* VIEW 1: ACTIVE SECTIONS LIST */}
              {sectionsSubTab === "active" && (
                <div className="flex-1 overflow-y-auto">
                  {/* Info Callout Banner (Image 2) */}
                  <div className="p-3 pb-1">
                    <div className="flex items-center gap-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 px-3 py-2 text-[11px] text-[#64748B]">
                      <Info className="h-3.5 w-3.5 text-[#94A3B8] shrink-0" />
                      <span>Click a section to select it in the editor</span>
                    </div>
                  </div>

                  {/* Active Sections Rows */}
                  {filteredActiveSections.length === 0 ? (
                    <div className="my-8 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] mx-3">
                      <Layers className="h-8 w-8 text-[#94A3B8] mb-2" />
                      <p className="text-xs font-semibold text-[#334155]">
                        {q ? "No matching active sections" : "No active sections on this page"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#94A3B8]">
                        {q ? "Try clearing your search query" : "Switch to Add New to add sections to this page"}
                      </p>
                      {!q && (
                        <button
                          type="button"
                          onClick={() => setSectionsSubTab("add_new")}
                          className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#7137D8] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#6025C5]"
                        >
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>Add Section</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col p-2 pt-1">
                      {filteredActiveSections.map((section) => {
                        const isSelected = selectedSectionId === section.id;
                        const isShared = isSharedChromeSection(section) || section.id === SHARED_HEADER_SECTION_ID || section.id === SHARED_FOOTER_SECTION_ID;
                        const visual = getSectionVisual(section);
                        const VisualIcon = visual.Icon;

                        return (
                          <div
                            key={section.id}
                            draggable={!isShared}
                            onDragStart={(e) => handleSectionDragStart(e, section.id)}
                            onDragOver={(e) => handleSectionDragOver(e, section.id)}
                            onDrop={(e) => handleSectionDrop(e, section.id)}
                            onDragEnd={handleSectionDragEnd}
                            onClick={() => handleEditSection(section.id)}
                            className={`group relative flex items-center justify-between gap-2.5 px-3 py-2.5 transition-all duration-150 cursor-pointer ${isSelected
                                ? "rounded-xl border border-[#7137D8] bg-[#F8FAFC] shadow-sm ring-1 ring-[#7137D8]/20 my-1"
                                : "border-b border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg"
                              } ${dragOverSectionId === section.id ? "border-t-2 border-t-[#7137D8]" : ""} ${section.hidden ? "opacity-50" : ""}`}
                          >
                            {/* Far Left: Drag Handle */}
                            <div
                              className={`shrink-0 p-0.5 text-[#94A3B8] transition-colors ${!isShared
                                  ? "cursor-grab active:cursor-grabbing hover:text-[#111827]"
                                  : "opacity-30 cursor-not-allowed"
                                }`}
                              title={isShared ? "Global section cannot be reordered" : "Drag to reorder section"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>

                            {/* Section Icon: Compact 32px */}
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[#7137D8] shadow-xs"
                            >
                              <VisualIcon className="h-4 w-4" />
                            </div>

                            {/* Full Section Name (flexible width, readable font) */}
                            <div className="min-w-0 flex-1">
                              <span
                                className="block truncate text-[13px] font-bold text-[#000000] group-hover:text-[#7137D8] leading-snug"
                                title={visual.name}
                              >
                                {visual.name}
                              </span>
                              {isShared && (
                                <span className="block text-[10.5px] text-[#7137D8] font-normal leading-tight mt-0.5">
                                  Global
                                </span>
                              )}
                            </div>

                            {/* Far Right: Compact Visibility Toggle + Three-Dot Menu */}
                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {/* Compact Visibility Toggle (yellow when on) */}
                              <Switch
                                checked={!section.hidden}
                                onCheckedChange={() => toggleHidden(section.id)}
                                className="data-[state=checked]:bg-[#7137D8] data-[state=checked]:border-[#7137D8] shrink-0 scale-90"
                                title={section.hidden ? "Show section" : "Hide section"}
                              />

                              {/* Three-Dot Menu with all secondary actions */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#64748B] hover:text-[#000000] hover:bg-[#F1F5F9] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7137D8]"
                                    title="More actions"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  sideOffset={4}
                                  className="w-40 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl text-xs z-50 text-[#000000]"
                                >
                                  <DropdownMenuItem
                                    onSelect={() => handleEditSection(section.id)}
                                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8] transition cursor-pointer"
                                  >
                                    <Pencil className="h-3.5 w-3.5 text-[#64748B]" />
                                    <span>Edit Section</span>
                                  </DropdownMenuItem>

                                  {!isShared && (
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        duplicateSection(section.id);
                                        toast.success(`Duplicated "${visual.name}"`);
                                      }}
                                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8] transition cursor-pointer"
                                    >
                                      <Copy className="h-3.5 w-3.5 text-[#64748B]" />
                                      <span>Duplicate</span>
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem
                                    onSelect={() => toggleHidden(section.id)}
                                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8] transition cursor-pointer"
                                  >
                                    {section.hidden ? (
                                      <Eye className="h-3.5 w-3.5 text-[#64748B]" />
                                    ) : (
                                      <EyeOff className="h-3.5 w-3.5 text-[#64748B]" />
                                    )}
                                    <span>{section.hidden ? "Show" : "Hide"}</span>
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator className="my-1 bg-[#F1F5F9]" />

                                  <DropdownMenuItem
                                    onSelect={() => {
                                      removeSection(section.id);
                                      toast.success(`Removed "${visual.name}"`);
                                    }}
                                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300 transition cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: ADD NEW TEMPLATES */}
              {sectionsSubTab === "add_new" && (
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                  {/* Shortcut to Plugins Panel */}
                  <div
                    onClick={() => setActiveTab("embeds")}
                    className="flex items-center justify-between rounded-xl border border-[#7137D8]/25 bg-[#EDE9FE]/30 p-2.5 transition hover:border-[#7137D8]/50 hover:bg-[#EDE9FE]/60 cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDE9FE] border border-[#7137D8]/30 text-[#7137D8]">
                        <Puzzle className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-[#000000] truncate">Plugins & Tools</span>
                          <span className="rounded-full bg-[#EDE9FE] px-1.5 py-0.2 text-[9px] font-bold text-[#7137D8]">
                            {customEmbedsCount}
                          </span>
                        </div>
                        <span className="block text-[10.5px] text-[#64748B] truncate">
                          Add & manage plugins, embeds and tools
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#7137D8] flex items-center gap-0.5 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                      <span>Manage</span>
                      <span>→</span>
                    </span>
                  </div>
                  {visibleWidgets.length === 0 && visibleMediaEmbedSections.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#2B2B2B] bg-white p-6 text-center">
                      <Boxes className="mx-auto h-6 w-6 text-[#71717A] mb-2" />
                      <p className="text-xs font-medium text-[#000000]">No sections found</p>
                      <p className="mt-1 text-[11px] text-[#71717A]">Try searching for something else</p>
                    </div>
                  ) : (
                    <>
                      {visibleWidgets.length > 0 && (
                        <div className="space-y-2">
                          {visibleWidgets.map((widget) => {
                            const open = q.trim() ? true : openWidgetId === widget.id;
                            const visual = getWidgetVisual(widget);
                            const IconComponent = visual.Icon;
                            return (
                              <div
                                key={widget.id}
                                className={`overflow-hidden rounded-xl border transition-all duration-200 ${open
                                    ? "border-[#3F3F46] bg-[#F8FAFC] shadow-sm"
                                    : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#38383D] hover:bg-[#F8FAFC]"
                                  }`}
                              >
                                <div
                                  role="button"
                                  tabIndex={0}
                                  className="flex h-[52px] w-full cursor-grab items-center gap-3 px-3 text-left transition select-none active:cursor-grabbing"
                                  draggable
                                  onDragStart={(event) => beginWidgetDrag(event, widget)}
                                  onDragEnd={endLibraryDrag}
                                  onClick={() => {
                                    if (q.trim()) return;
                                    setOpenWidgetId((prev) => (prev === widget.id ? null : widget.id));
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key !== "Enter" && event.key !== " ") return;
                                    event.preventDefault();
                                    if (q.trim()) return;
                                    setOpenWidgetId((prev) => (prev === widget.id ? null : widget.id));
                                  }}
                                >
                                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${visual.badgeBg}`}>
                                    <IconComponent className={`h-4 w-4 ${visual.accentColor}`} />
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="block truncate text-[13px] font-semibold text-[#000000]">
                                      {widget.displayName}
                                    </span>
                                    <span className="block truncate text-[10.5px] text-[#71717A] mt-0.5 leading-tight">
                                      {visual.subtitle}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F1F5F9] px-1.5 text-[10px] font-medium text-[#A1A1AA] border border-[#2F2F36]"
                                      title={`${widget.supportedVariants.length} styles available`}
                                    >
                                      {widget.supportedVariants.length}
                                    </span>
                                    <span className={`flex h-5 w-5 items-center justify-center text-[#71717A] transition-transform duration-200 ${open ? "rotate-90 text-[#7137D8]" : ""
                                      }`}>
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    </span>
                                  </div>
                                </div>

                                {open ? (
                                  <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-2.5">
                                    <div className="mb-2 flex items-center justify-between px-0.5">
                                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                                        Styles &amp; Variants ({widget.supportedVariants.length})
                                      </span>
                                      <span className="flex items-center gap-1 text-[10px] text-[#71717A]">
                                        <GripVertical className="h-3 w-3 text-[#52525B]" />
                                        Drag to add
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {widget.supportedVariants.map((variant) => {
                                        const variantKey = `${widget.id}-${variant}`;
                                        return (
                                          <div
                                            key={variantKey}
                                            role="button"
                                            tabIndex={0}
                                            draggable
                                            onDragStart={(event) => {
                                              event.stopPropagation();
                                              beginWidgetDrag(event, widget, variant);
                                            }}
                                            onDragEnd={(event) => {
                                              event.stopPropagation();
                                              endLibraryDrag();
                                            }}
                                            className="group relative flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-2 text-left cursor-grab transition-all duration-150 hover:border-[#7137D8] hover:bg-[#F8FAFC] active:cursor-grabbing hover:shadow-xs"
                                            title={`Drag to add "${variant}" to canvas`}
                                          >
                                            <div className="flex items-start justify-between gap-1">
                                              <span className="text-[11px] font-medium leading-snug text-[#000000] group-hover:text-[#000000] line-clamp-2">
                                                {variant}
                                              </span>
                                              <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded bg-[#27272A] text-[#A1A1AA] transition-colors group-hover:bg-[#7137D8] group-hover:text-[#111111]">
                                                <Plus className="h-2.5 w-2.5" />
                                              </span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between border-t border-[#222226] pt-1 text-[9px] text-[#71717A]">
                                              <span className="capitalize">{widget.category || "Widget"}</span>
                                              <span className="flex items-center gap-0.5 text-[#52525B] group-hover:text-[#A1A1AA]">
                                                <GripVertical className="h-2.5 w-2.5" />
                                                Drag
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* ── Media & Embeds Category ────────────────────────────────── */}
                      {visibleMediaEmbedSections.length > 0 && (
                        <div className="mt-3">
                          <div className="mb-2 flex items-center gap-2 px-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">Media &amp; Embeds</span>
                            <div className="flex-1 h-px bg-[#262626]" />
                          </div>
                          <div className="space-y-1.5">
                            {visibleMediaEmbedSections.map((item) => {
                              const IconComponent = item.Icon;
                              const reg = widgetRegistryEntries.find(
                                (w) => w.type === item.widgetType || w.id === item.widgetType || w.id === `${item.widgetType}-v1`
                              );
                              return (
                                <div
                                  key={item.id}
                                  role="button"
                                  tabIndex={0}
                                  draggable={!!reg}
                                  onDragStart={(event) => {
                                    if (reg) {
                                      beginWidgetDrag(event, reg);
                                    }
                                  }}
                                  onDragEnd={endLibraryDrag}
                                  className="flex h-[52px] w-full cursor-grab items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 transition-all hover:border-[#38383D] hover:bg-[#F8FAFC] select-none group active:cursor-grabbing"

                                >
                                  <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${item.iconBg}`}>
                                    <IconComponent className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="block truncate text-[13px] font-semibold text-[#000000]">
                                      {item.label}
                                    </span>
                                    <span className="block truncate text-[10.5px] text-[#71717A] mt-0.5 leading-tight">
                                      {item.subtitle}
                                    </span>
                                  </div>
                                  <span
                                    className="shrink-0 flex h-6 w-6 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#71717A] transition-colors group-hover:bg-[#7137D8] group-hover:text-[#111111]"
                                    title={`Add ${item.label}`}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}


          {activeTab === "properties" && (
            <div className="flex h-full flex-col overflow-hidden">
              <InspectorPanel />
            </div>
          )}

          {activeTab === "embeds" && (
            <div className="flex h-full flex-col overflow-hidden">
              <CustomEmbedsPanel />
            </div>
          )}
        </div>
      )}

      {/* Embed modal for Media & Embeds section items */}
      <CustomEmbedModal
        isOpen={embedModalOpen}
        onClose={() => {
          setEmbedModalOpen(false);
          setEmbedModalPluginType(null);
        }}
        embedToEdit={null}
        initialPluginType={embedModalPluginType}
        onSaved={() => {
          setEmbedModalOpen(false);
          setEmbedModalPluginType(null);
        }}
      />
    </aside>
  );
}
