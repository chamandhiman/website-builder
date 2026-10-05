"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { getAllWidgetRegistrations, createWidgetInstance, type WidgetRegistration } from "./widgets/widgetRegistry";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";

const TABS = [
  { key: "widgets", label: "Widgets", Icon: Grid2x2 },
  { key: "properties", label: "Properties", Icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getWidgetVisual(widget: WidgetRegistration) {
  const type = widget.type?.toLowerCase() || "";
  const id = widget.id?.toLowerCase() || "";
  const name = widget.displayName?.toLowerCase() || "";

  // 1. Header (Navbar)
  if (type === "navbar" || id.includes("navbar") || name.includes("header")) {
    return {
      Icon: PanelTop,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Navbar & brand navigation",
    };
  }
  // 2. Carousel
  if (type === "carousel" || id.includes("carousel")) {
    return {
      Icon: SlidersHorizontal,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Interactive image carousel slider",
    };
  }
  // 3. Banner (Hero)
  if (type === "hero" || id.includes("hero") || name === "banner") {
    return {
      Icon: Sparkles,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Hero banners & headline intros",
    };
  }
  // 4. About Us
  if (type === "about" || id.includes("about")) {
    return {
      Icon: UserCheck,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Split story, features & imagery",
    };
  }
  // 5. Services
  if (type === "services" || id.includes("services")) {
    return {
      Icon: Briefcase,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Service cards & feature highlights",
    };
  }
  // 6. Team
  if (type === "team" || id.includes("team")) {
    return {
      Icon: Users,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Static grid or carousel slider",
    };
  }
  // 7. FAQ
  if (type === "faq" || id.includes("faq")) {
    return {
      Icon: HelpCircle,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Collapsible Q&A accordion",
    };
  }
  // 8. Call To Action
  if (type === "cta" || id.includes("cta")) {
    return {
      Icon: Flame,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Conversion banners & actions",
    };
  }
  // 9. Pricing Section
  if (type === "pricing" || id.includes("pricing")) {
    return {
      Icon: CreditCard,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Pricing tiers & feature lists",
    };
  }
  // 10. Background Image overlay text banner
  if (type === "overlay-banner" || id.includes("overlay") || name.includes("overlay")) {
    return {
      Icon: Layers,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Background image with overlay text",
    };
  }
  // 11. Image Gallery
  if (type === "gallery" || id.includes("gallery")) {
    return {
      Icon: Images,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Photo gallery & showcase grid",
    };
  }
  // 12. Testimonials
  if (type === "testimonials" || id.includes("testimonial")) {
    return {
      Icon: MessageSquareQuote,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Reviews in static grid or carousel",
    };
  }
  // 13. Footer
  if (type === "footer" || id.includes("footer")) {
    return {
      Icon: PanelBottom,
      accentColor: "text-amber-400",
      badgeBg: "bg-[#202024] border-[#2F2F36]",
      subtitle: "Site footer, columns & copyright",
    };
  }
  return {
    Icon: Boxes,
    accentColor: "text-zinc-400",
    badgeBg: "bg-[#202024] border-[#2F2F36]",
    subtitle: "Section widget",
  };
}

export function RightContextPanel() {
  const mounted = useMounted();
  const [activeTab, setActiveTab] = useState<TabKey>("widgets");
  const [collapsed, setCollapsed] = useState(false);
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const selectedElement = useBuilder((s) => s.selectedElement);
  const selectedSectionId = useBuilder((s) => s.selectedSectionId);
  const selectElement = useBuilder((s) => s.selectElement);
  const selectSection = useBuilder((s) => s.selectSection);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentProjectId = useBuilder((s) => s.currentProjectId);

  useEffect(() => {
    if (selectedElement || selectedSectionId) {
      setActiveTab("properties");
      setCollapsed(false);
    }
  }, [selectedElement?.elementKey, selectedElement?.childId, selectedSectionId]);

  const widgetRegistryEntries = useMemo(() => getAllWidgetRegistrations(), []);
  const [q, setQ] = useState("");
  const [openWidgetId, setOpenWidgetId] = useState<string | null>(null);

  const visibleWidgets = useMemo(() => {
    const normalized = q.trim().toLowerCase();
    const hiddenElementTypes = new Set(["heading", "text", "button", "image", "container"]);
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

  const addWidgetVariant = (widget: WidgetRegistration, variant: string) => {
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
    <aside className={`flex h-full flex-col border-l border-[#262626] bg-[#141414] transition-all duration-300 ease-in-out ${collapsed ? "w-[48px]" : "w-[310px]"}`}>
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#262626] bg-[#141414] px-2.5">
        {!collapsed ? (
          <div className="flex items-center gap-1 rounded-lg border border-[#262626] bg-[#1A1A1A] p-0.5">
            {TABS.map(({ key, label, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    isActive ? "bg-[#27272A] text-[#FACC15] shadow-xs" : "text-[#94A3B8] hover:bg-[#202020] hover:text-[#F4F4F5]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-1">
            {TABS.map(({ key, Icon }) => {
              const isActive = activeTab === key;
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => { setActiveTab(key); setCollapsed(false); }}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                        isActive ? "bg-[#27272A] text-[#FACC15]" : "text-[#94A3B8] hover:bg-[#202020] hover:text-[#F4F4F5]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">{key.charAt(0).toUpperCase() + key.slice(1)}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#71717A] transition hover:bg-[#202020] hover:text-[#F4F4F5]"
          title={collapsed ? "Expand panel" : "Collapse panel"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === "widgets" && (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="shrink-0 border-b border-[#262626] bg-[#141414] p-2.5">
                <div className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#71717A]" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search widgets & styles..."
                    className="h-9 w-full rounded-lg border border-[#2B2B2B] bg-[#1A1A1C] pl-8 pr-8 text-[12px] text-[#F5F5F5] placeholder-[#71717A] outline-none transition focus:border-[#FACC15] focus:ring-1 focus:ring-[#FACC15]/20"
                  />
                  {q.trim() ? (
                    <button
                      type="button"
                      onClick={() => setQ("")}
                      className="absolute right-2.5 flex h-4 w-4 items-center justify-center rounded-full text-[#71717A] hover:bg-[#27272A] hover:text-[#F4F4F5]"
                      title="Clear search"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>
                <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[#71717A]">
                  <span>Available widgets</span>
                  <span className="font-medium text-[#A1A1AA]">{visibleWidgets.length} items</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {visibleWidgets.length === 0 ? (
                  <div className="m-3 rounded-xl border border-dashed border-[#2B2B2B] bg-[#18181A] p-6 text-center">
                    <Boxes className="mx-auto h-6 w-6 text-[#71717A] mb-2" />
                    <p className="text-xs font-medium text-[#D4D4D8]">No widgets found</p>
                    <p className="mt-1 text-[11px] text-[#71717A]">Try searching for something else</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-2.5">
                    {visibleWidgets.map((widget) => {
                      const open = q.trim() ? true : openWidgetId === widget.id;
                      const visual = getWidgetVisual(widget);
                      const IconComponent = visual.Icon;
                      return (
                        <div
                          key={widget.id}
                          className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                            open
                              ? "border-[#3F3F46] bg-[#18181B] shadow-sm"
                              : "border-[#262626] bg-[#161618] hover:border-[#38383D] hover:bg-[#1A1A1D]"
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
                              <span className="block truncate text-[13px] font-semibold text-[#F4F4F5]">
                                {widget.displayName}
                              </span>
                              <span className="block truncate text-[10.5px] text-[#71717A] mt-0.5 leading-tight">
                                {visual.subtitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#202024] px-1.5 text-[10px] font-medium text-[#A1A1AA] border border-[#2F2F36]"
                                title={`${widget.supportedVariants.length} styles available`}
                              >
                                {widget.supportedVariants.length}
                              </span>
                              <span className={`flex h-5 w-5 items-center justify-center text-[#71717A] transition-transform duration-200 ${
                                open ? "rotate-90 text-[#FACC15]" : ""
                              }`}>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>

                          {open ? (
                            <div className="border-t border-[#26262B] bg-[#111113] p-2.5">
                              <div className="mb-2 flex items-center justify-between px-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                                  Styles & Variants ({widget.supportedVariants.length})
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-[#71717A]">
                                  <GripVertical className="h-3 w-3 text-[#52525B]" />
                                  Click or drag
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
                                      onClick={() => addWidgetVariant(widget, variant)}
                                      onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                          event.preventDefault();
                                          addWidgetVariant(widget, variant);
                                        }
                                      }}
                                      className="group relative flex flex-col justify-between rounded-lg border border-[#27272A] bg-[#18181B] p-2 text-left cursor-grab transition-all duration-150 hover:border-[#3F3F46] hover:bg-[#202024] active:cursor-grabbing hover:shadow-xs"
                                      title={`Click to add "${variant}" or drag to canvas`}
                                    >
                                      <div className="flex items-start justify-between gap-1">
                                        <span className="text-[11px] font-medium leading-snug text-[#E4E4E7] group-hover:text-[#F4F4F5] line-clamp-2">
                                          {variant}
                                        </span>
                                        <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded bg-[#27272A] text-[#A1A1AA] transition-colors group-hover:bg-[#FACC15] group-hover:text-[#111111]">
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
              </div>
            </div>
          )}


          {activeTab === "properties" && (
            <div className="flex h-full flex-col overflow-hidden">
              <InspectorPanel />
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
