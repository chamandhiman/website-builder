import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Search, Sparkles, Globe, Tag, X, Filter, Eye } from "lucide-react";
import { TEMPLATE_LIBRARY, type TemplateDefinition } from "@/lib/builder/templates";
import { useBuilder, type PageSection } from "@/lib/builder/store";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { getPublishedTemplates, createProjectFromTemplate, type Template } from "@/services/templates";
import { getWidgetRegistration, getWidgetBootstrapExport } from "@/components/builder/widgets/widgetRegistry";
import { TemplatePreviewModal } from "@/components/builder/TemplatePreviewModal";

export const Route = createFileRoute("/dashboard/templates")({
  component: TemplatesPage,
});

const CATEGORY_FILTERS = [
  "All",
  "Business",
  "Agency",
  "Freelancer",
  "SaaS & Technology",
  "Healthcare",
  "Fitness & Gym",
  "Restaurant & Café",
  "Real Estate",
  "Education",
  "Driving School",
  "Beauty & Salon",
  "Construction",
  "Automotive",
  "Photography",
  "Portfolio",
  "Law Firm",
  "Finance",
  "Travel & Hotel",
  "E-commerce",
  "Personal / Resume",
] as const;

type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const GALLERY_FILTERS = ["All", "Single page", "Multi page", "Free templates", "Premium templates"] as const;
type GalleryFilter = (typeof GALLERY_FILTERS)[number];

function matchesCategory(templateCategory: string | undefined | null, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === "All") return true;
  if (!templateCategory) return false;

  const t = templateCategory.trim().toLowerCase();
  const s = selectedCategory.trim().toLowerCase();

  if (t === s) return true;

  const aliases: Record<string, string[]> = {
    "saas & technology": ["saas", "tech", "technology", "software", "ai startup", "saas & tech"],
    "healthcare": ["health", "healthcare", "medical", "wellness", "dental clinic", "clinic", "hospital"],
    "fitness & gym": ["fitness", "gym", "workout", "crossfit", "gym / fitness", "fitness & gym"],
    "restaurant & café": ["restaurant", "cafe", "café", "food", "dining", "bakery", "restaurant & café"],
    "beauty & salon": ["beauty", "salon", "spa", "salon / spa", "barber"],
    "travel & hotel": ["travel", "hotel", "resort", "tourism", "vacation"],
    "personal / resume": ["personal", "resume", "cv", "bio"],
    "automotive": ["automotive", "car", "auto repair", "driving school", "vehicle"],
    "agency": ["agency", "digital marketing agency", "creative agency"],
    "business": ["business", "corporate business", "consulting", "corporate"],
  };

  const currentAliases = aliases[s];
  if (currentAliases && currentAliases.some((alias) => t === alias || t.includes(alias) || alias.includes(t))) {
    return true;
  }

  return t.includes(s) || s.includes(t);
}

function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");
  const [filter, setFilter] = useState<GalleryFilter>("All");
  const [loading, setLoading] = useState<string | null>(null);
  const [publishedTemplates, setPublishedTemplates] = useState<Template[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const navigate = useNavigate();
  const newProject = useBuilder((s) => s.newProject);
  const applyTemplateToCurrent = useBuilder((s) => s.applyTemplate);

  useEffect(() => {
    let cancelled = false;
    async function loadPublished() {
      try {
        const templates = await getPublishedTemplates();
        if (!cancelled) {
          setPublishedTemplates(templates);
        }
      } catch (err) {
        console.warn("[TemplatesPage] Could not load published cloud templates:", err);
      }
    }
    void loadPublished();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TEMPLATE_LIBRARY.length + publishedTemplates.length };
    const allCategories = [
      ...TEMPLATE_LIBRARY.map((t) => t.category),
      ...publishedTemplates.map((t) => t.category),
    ];

    CATEGORY_FILTERS.forEach((cat) => {
      if (cat === "All") return;
      counts[cat] = allCategories.filter((tCat) => matchesCategory(tCat, cat)).length;
    });

    return counts;
  }, [publishedTemplates]);

  const filteredLibraryTemplates = useMemo(() => {
    const search = query.trim().toLowerCase();
    return TEMPLATE_LIBRARY.filter((tpl) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Free templates" ? !tpl.isPremium :
          filter === "Premium templates" ? !!tpl.isPremium :
          (filter === "Single page" ? tpl.pageType === "single-page" :
           filter === "Multi page" ? tpl.pageType === "multi-page" : false));

      const matchesCat = matchesCategory(tpl.category, selectedCategory);

      const matchesSearch =
        !search ||
        [tpl.name, tpl.description, tpl.category, tpl.pageType].join(" ").toLowerCase().includes(search);

      return matchesFilter && matchesCat && matchesSearch;
    });
  }, [filter, selectedCategory, query]);

  const filteredPublishedTemplates = useMemo(() => {
    const search = query.trim().toLowerCase();
    return publishedTemplates.filter((tpl) => {
      const matchesCat = matchesCategory(tpl.category, selectedCategory);
      if (!matchesCat) return false;
      if (!search) return true;
      return [tpl.name, tpl.category, tpl.slug].join(" ").toLowerCase().includes(search);
    });
  }, [publishedTemplates, selectedCategory, query]);

  const handleUseLibraryTemplate = async (tpl: TemplateDefinition) => {
    setLoading(tpl.id);
    try {
      newProject(`${tpl.name}`);
      applyTemplateToCurrent(tpl as any);

      const current = useBuilder.getState().currentProject();
      if (!current) throw new Error("Failed to initialize project from template");

      toast.success(`${tpl.name} template loaded! Opening editor...`);
      navigate({ to: "/editor/$projectId", params: { projectId: current.id } });
    } catch (err) {
      console.error("Template loading error:", err);
      toast.error("Failed to load template. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleUsePublishedTemplate = async (tpl: Template) => {
    setLoading(tpl.id);
    try {
      const projectId = createProjectFromTemplate(tpl);
      toast.success(`Copy of ${tpl.name} created! Opening editor...`);
      navigate({ to: "/editor/$projectId", params: { projectId } });
    } catch (err) {
      console.error("Published template copy error:", err);
      toast.error("Failed to load template. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const totalTemplatesCount = TEMPLATE_LIBRARY.length + publishedTemplates.length;

  return (
    <div className="min-h-screen bg-[#171717] p-6 text-[#F5F5F5]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="rounded-sm bg-[#1F1F1F] p-6 shadow-sm ring-1 ring-[#363636]">
          <div className="space-y-4 mb-4">
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-[#F5F5F5]">Templates</h1>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#363636] bg-[#2B2B2B] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#FACC15]">
                  <Sparkles className="h-3.5 w-3.5 text-[#FACC15]" /> {totalTemplatesCount} templates
                </span>
              </div>
              <p className="mt-2 text-[#969696]">
                Browse and use professionally designed templates to get started quickly
              </p>
            </div>
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#969696]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates by name, category, or description..."
                className="w-full pl-12 pr-4 h-12 rounded-xl border border-[#363636] bg-[#1F1F1F] text-[#F5F5F5] outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/10"
              />
            </div>

            {/* Category Filter Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                  <Tag className="h-3.5 w-3.5 text-[#FACC15]" />
                  <span>Filter by Category ({CATEGORY_FILTERS.length - 1} categories)</span>
                </div>
                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="flex items-center gap-1 text-xs font-medium text-[#FACC15] transition hover:underline"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reset to All
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_FILTERS.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count = categoryCounts[cat] ?? 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#FACC15] text-[#111111] shadow-xs font-semibold scale-[1.02]"
                          : "border border-[#333338] bg-[#222226] text-[#D0D0D0] hover:border-[#4B4B55] hover:bg-[#2A2A30] hover:text-[#FFFFFF]"
                      }`}
                    >
                      <span>{cat}</span>
                      {count > 0 && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                            isActive ? "bg-black/20 text-[#111111]" : "bg-[#161618] text-[#A1A1AA]"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Filter: Page Type & Pricing */}
            <div className="flex flex-wrap items-center gap-2 border-t border-[#2D2D33] pt-3">
              <span className="text-xs text-[#71717A] mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Type:
              </span>
              {GALLERY_FILTERS.map((filterOption) => (
                <button
                  key={filterOption}
                  type="button"
                  onClick={() => setFilter(filterOption)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                    filter === filterOption
                      ? "bg-[#333338] text-[#FACC15] border border-[#FACC15]/40"
                      : "bg-[#1A1A1E] text-[#9E9EA7] border border-[#27272C] hover:bg-[#25252A] hover:text-[#F4F4F5]"
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Published Super Admin Templates */}
          {filteredPublishedTemplates.length > 0 && (
            <div className="mt-8 mb-8 border-t border-[#363636] pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#FACC15]" />
                  <h2 className="text-base font-semibold text-[#F5F5F5]">Community & Global Templates</h2>
                  <span className="rounded-full bg-[#FACC15]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FACC15]">
                    {filteredPublishedTemplates.length}
                  </span>
                </div>
                {selectedCategory !== "All" && (
                  <span className="text-xs text-[#969696]">
                    Filtered by: <span className="text-[#FACC15] font-medium">{selectedCategory}</span>
                  </span>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPublishedTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group overflow-hidden rounded-sm border border-[#363636] bg-[#171717] shadow-sm transition hover:-translate-y-1 hover:border-[#FACC15]/40 hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden bg-[#242424]">
                      <img
                        src={
                          tpl.thumbnail ||
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={tpl.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 rounded-full bg-[#1F1F1F]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#FACC15]">
                        {tpl.category}
                      </div>
                      <div className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                        {tpl.widgets?.length ?? 0} Widgets
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-base font-semibold text-[#F5F5F5]">{tpl.name}</h3>
                      <p className="mt-1 text-xs text-[#969696] line-clamp-2">
                        Complete AI-crafted responsive layout ready for customization.
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setPreviewTemplate(tpl)}
                          className="flex-1 border-[#363636] bg-[#222226] text-[#E0E0E0] hover:bg-[#2E2E34] hover:text-[#FFFFFF] h-9 text-xs font-medium"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5 text-[#FACC15]" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleUsePublishedTemplate(tpl)}
                          disabled={loading === tpl.id}
                          className="flex-1 bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 text-xs font-semibold"
                        >
                          {loading === tpl.id ? "Creating..." : "Use Template"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Standard Template Library */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#F5F5F5]">Standard Library</h2>
                <span className="rounded-full bg-[#2B2B2B] px-2 py-0.5 text-[10px] font-semibold text-[#969696]">
                  {filteredLibraryTemplates.length}
                </span>
              </div>
              {selectedCategory !== "All" && (
                <span className="text-xs text-[#969696]">
                  Category: <span className="text-[#FACC15] font-medium">{selectedCategory}</span>
                </span>
              )}
            </div>

            {filteredLibraryTemplates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#363636] bg-[#1A1A1D] p-10 text-center">
                <Tag className="mx-auto h-8 w-8 text-[#71717A] mb-2" />
                <p className="text-sm font-medium text-[#D4D4D8]">No templates in "{selectedCategory}" yet</p>
                <p className="text-xs text-[#71717A] mt-1 max-w-md mx-auto">
                  Templates for this category will appear here as soon as they are added or published.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("All");
                      setFilter("All");
                      setQuery("");
                    }}
                    className="border-[#363636] bg-[#222226] text-[#D0D0D0] hover:bg-[#2A2A30] text-xs h-8"
                  >
                    View All Templates
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLibraryTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="group overflow-hidden rounded-sm border border-[#363636] bg-[#1F1F1F] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-56 overflow-hidden bg-[#242424]">
                      <img
                        src={tpl.thumbnail}
                        alt={tpl.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                      {tpl.isPremium && (
                        <div className="absolute right-3 top-3 rounded-full bg-[#FACC15] px-3 py-1 text-xs font-semibold text-[#111111]">
                          Premium
                        </div>
                      )}

                      {tpl.category && (
                        <div className="absolute left-3 top-3 rounded-full bg-[#1F1F1F]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D0D0D0]">
                          {tpl.category}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-[#F5F5F5]">{tpl.name}</h3>
                      <p className="mt-2 text-sm text-[#969696] line-clamp-2">{tpl.description}</p>

                      {tpl.pageType && (
                        <p className="mt-3 text-xs text-[#969696]">
                          {tpl.pageType === "single-page" ? "Single Page" : "Multi Page"}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setPreviewTemplate(tpl)}
                          className="flex-1 border-[#363636] bg-[#222226] text-[#E0E0E0] hover:bg-[#2E2E34] hover:text-[#FFFFFF] h-9 text-xs font-medium"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5 text-[#FACC15]" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleUseLibraryTemplate(tpl)}
                          disabled={loading === tpl.id}
                          className="flex-1 bg-[#FACC15] text-[#111111] hover:bg-[#FDE047] h-9 text-xs font-semibold"
                        >
                          {loading === tpl.id ? "Loading..." : "Use Template"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onUseTemplate={(tpl) => {
          setPreviewTemplate(null);
          if (publishedTemplates.some((p) => p.id === tpl.id)) {
            void handleUsePublishedTemplate(tpl);
          } else {
            void handleUseLibraryTemplate(tpl);
          }
        }}
      />
    </div>
  );
}