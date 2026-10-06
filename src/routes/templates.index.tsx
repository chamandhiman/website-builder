import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { Search, Sparkles, Eye, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  getPublishedTemplates,
  getUpcomingTemplates,
  createProjectFromTemplate,
  type Template,
} from "@/services/templates";
import { toast } from "sonner";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { TemplatePreviewModal } from "@/components/builder/TemplatePreviewModal";

export const Route = createFileRoute("/templates/")({
  head: () => ({
    meta: [
      { title: "Website Templates | WebToolOcean Website Builder" },
      {
        name: "description",
        content:
          "Browse high-converting, responsive website templates for business, real estate, portfolio, health, restaurant, and SaaS. Customize visually and download clean HTML.",
      },
    ],
  }),
  component: PublicTemplatesPage,
});

const CATEGORIES = [
  "All",
  "Real Estate",
  "Freelancer",
  "Healthcare",
  "Fitness & Gym",
  "Restaurant & Café",
  "Beauty & Salon",
  "SaaS & Technology",
  "Photography",
  "Law Firm",
  "Agency",
  "Business",
] as const;

type FilterTab = "all" | "featured" | "new" | "upcoming";

function PublicTemplatesPage() {
  const navigate = useNavigate();
  const { user, authReady } = useAuth();
  const [published, setPublished] = useState<Template[]>([]);
  const [upcoming, setUpcoming] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [pub, up] = await Promise.all([
          getPublishedTemplates(),
          getUpcomingTemplates(),
        ]);
        if (!cancelled) {
          setPublished(pub);
          setUpcoming(up);
        }
      } catch (err) {
        console.error("Failed to load templates:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const allTemplates = useMemo(() => {
    return [...published, ...upcoming];
  }, [published, upcoming]);

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allTemplates.filter((tpl) => {
      // Category filter
      if (selectedCategory !== "All") {
        const tCat = (tpl.category || "").toLowerCase();
        const sCat = selectedCategory.toLowerCase();
        if (!tCat.includes(sCat) && !sCat.includes(tCat)) return false;
      }

      // Tab filter
      if (filterTab === "featured" && !tpl.featured) return false;
      if (filterTab === "new" && !tpl.isNew) return false;
      if (filterTab === "upcoming" && tpl.status !== "upcoming") return false;

      // Search query
      if (q) {
        const match =
          (tpl.name || "").toLowerCase().includes(q) ||
          (tpl.category || "").toLowerCase().includes(q) ||
          (tpl.description || "").toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allTemplates, search, selectedCategory, filterTab]);

  const handleUseTemplate = async (template: Template) => {
    if (template.status === "upcoming") {
      toast.info(`"${template.name}" is coming soon! Stay tuned.`);
      return;
    }

    if (!authReady || !user) {
      toast.info("Please sign in or create an account to start editing.", {
        description: `We'll automatically set up "${template.name}" for you.`,
      });
      navigate({
        to: "/login" as never,
        search: {
          templateId: template.id,
          action: "use",
          redirect: `/templates/${template.id}`,
        } as any,
      });
      return;
    }

    setActionLoading(template.id);
    try {
      const newProjectId = createProjectFromTemplate(template);
      toast.success(`Created project from ${template.name}! Opening editor…`);
      navigate({
        to: "/editor/$projectId",
        params: { projectId: newProjectId },
      });
    } catch (err) {
      console.error("Failed to create project from template:", err);
      toast.error("Failed to initialize template project. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#f4f4f5] flex flex-col font-['Inter',sans-serif]">
      <PublicNav />

      {/* Hero Header */}
      <header className="relative border-b border-[#2a2a2f] bg-gradient-to-b from-[#17171a] to-[#0e0e10] py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2f] bg-[#202024]/80 px-4 py-1.5 text-xs font-semibold text-[#facc15]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Website Template Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Bricolage_Grotesque'] text-[#f4f4f5]">
            Build Faster With Ready-To-Use Templates
          </h1>

          <p className="text-base sm:text-lg text-[#9a9aa3] max-w-2xl mx-auto leading-relaxed">
            Choose a professionally designed template, customize it visually with your mouse, and download 100% clean production HTML & CSS.
          </p>

          {/* Search bar */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a9aa3]" />
            <input
              type="text"
              placeholder="Search templates by name, style, or industry…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-[#2a2a2f] bg-[#17171a] py-3.5 pl-12 pr-4 text-sm text-[#f4f4f5] placeholder-[#9a9aa3] shadow-inner focus:border-[#facc15] focus:outline-none transition"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#2a2a2f] pb-6">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-[#facc15] text-[#151515]"
                    : "bg-[#17171a] text-[#9a9aa3] hover:text-[#f4f4f5] border border-[#2a2a2f]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-[#2a2a2f] bg-[#17171a] p-1 self-start md:self-auto text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-md transition ${
                filterTab === "all" ? "bg-[#202024] text-[#f4f4f5]" : "text-[#9a9aa3]"
              }`}
            >
              All ({allTemplates.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("featured")}
              className={`px-3 py-1 rounded-md transition ${
                filterTab === "featured" ? "bg-[#202024] text-[#f4f4f5]" : "text-[#9a9aa3]"
              }`}
            >
              Featured
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("new")}
              className={`px-3 py-1 rounded-md transition ${
                filterTab === "new" ? "bg-[#202024] text-[#f4f4f5]" : "text-[#9a9aa3]"
              }`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("upcoming")}
              className={`px-3 py-1 rounded-md transition ${
                filterTab === "upcoming" ? "bg-[#202024] text-[#f4f4f5]" : "text-[#9a9aa3]"
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Template Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-[#2a2a2f] bg-[#17171a] animate-pulse"
              />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#2a2a2f] bg-[#17171a] p-12 text-center space-y-3">
            <p className="text-base text-[#f4f4f5] font-semibold">No templates match your search</p>
            <p className="text-xs text-[#9a9aa3]">Try clearing search filters or pick another category.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setFilterTab("all");
              }}
              className="mt-2 text-xs text-[#facc15] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => {
              const isUpcoming = tpl.status === "upcoming";
              const isWorking = actionLoading === tpl.id;

              return (
                <div
                  key={tpl.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2f] bg-[#17171a] transition duration-300 hover:border-[#facc15] hover:shadow-2xl hover:-translate-y-1.5"
                >
                  {/* Thumbnail / Preview Area */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#202024]">
                    {tpl.thumbnail ? (
                      <img
                        src={tpl.thumbnail}
                        alt={tpl.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1e222d] to-[#0b0c10] p-6 text-center text-[#9a9aa3]">
                        <span className="font-bold text-lg">{tpl.name}</span>
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="rounded-full bg-[#0e0e10]/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-[#facc15] border border-[#2a2a2f]">
                        {tpl.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      {isUpcoming ? (
                        <span className="rounded-full bg-[#facc15] px-2.5 py-1 text-[11px] font-bold text-[#151515] flex items-center gap-1 shadow">
                          <Clock className="h-3 w-3" />
                          Coming Soon
                        </span>
                      ) : tpl.isNew ? (
                        <span className="rounded-full bg-[#10b981] px-2.5 py-1 text-[11px] font-bold text-[#fff] shadow">
                          New
                        </span>
                      ) : tpl.featured ? (
                        <span className="rounded-full bg-[#facc15] px-2.5 py-1 text-[11px] font-bold text-[#151515] shadow">
                          Featured
                        </span>
                      ) : null}
                    </div>

                    {/* Quick Preview Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-[2px] p-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPreviewTemplate(tpl);
                        }}
                        className="rounded-full bg-[#facc15] text-[#151515] px-4 py-2 text-xs font-bold hover:bg-yellow-400 transition flex items-center gap-1.5 shadow-lg"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Live Preview</span>
                      </button>
                      <Link
                        to="/templates/$templateId"
                        params={{ templateId: tpl.id }}
                        className="rounded-full bg-white/90 text-[#151515] px-3.5 py-2 text-xs font-semibold hover:bg-white transition flex items-center gap-1 shadow-lg"
                      >
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div className="space-y-1.5">
                      <Link
                        to="/templates/$templateId"
                        params={{ templateId: tpl.id }}
                        className="block font-bold text-lg text-[#f4f4f5] group-hover:text-[#facc15] transition truncate"
                      >
                        {tpl.name}
                      </Link>
                      <p className="text-xs text-[#9a9aa3] line-clamp-2 leading-relaxed">
                        {tpl.description ||
                          "Includes responsive layouts, clean semantic HTML, modular components, and editable sections."}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-[#2a2a2f] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewTemplate(tpl)}
                        className="text-xs font-medium text-[#facc15] hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Live Preview</span>
                      </button>

                      {isUpcoming ? (
                        <span className="text-xs font-semibold text-[#facc15]">
                          Releasing Soon
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUseTemplate(tpl)}
                          disabled={isWorking}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#facc15] px-4 py-1.5 text-xs font-bold text-[#151515] hover:bg-yellow-400 transition shadow"
                        >
                          <span>{isWorking ? "Cloning…" : "Use Template"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PublicFooter />

      {/* Full-Screen Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onUseTemplate={(tpl) => {
          setPreviewTemplate(null);
          void handleUseTemplate(tpl);
        }}
      />
    </div>
  );
}
