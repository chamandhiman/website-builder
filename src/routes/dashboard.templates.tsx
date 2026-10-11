import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Sparkles,
  Globe,
  Tag,
  X,
  Filter,
  Eye,
  Heart,
  ChevronDown,
  Layers,
  ArrowRight,
  User,
} from "lucide-react";
import { TEMPLATE_LIBRARY, type TemplateDefinition, matchesTemplateCategory, TEMPLATE_CATEGORIES } from "@/lib/builder/templates";
import { useBuilder } from "@/lib/builder/store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getPublishedTemplates, createProjectFromTemplate, type Template } from "@/services/templates";
import { TemplatePreviewModal } from "@/components/builder/TemplatePreviewModal";
import { ALL_NEW_WEBSITE_TEMPLATES } from "@/services/templateSeedsWebsites";

export const Route = createFileRoute("/dashboard/templates")({
  component: TemplatesPage,
});

interface CuratedTemplate {
  id: string;
  name: string;
  category: string;
  categoryDisplay: string;
  pageType: "single-page" | "multi-page";
  pageTypeDisplay: string;
  isPremium: boolean;
  uses: string;
  addedTime: string;
  thumbnail: string;
  headline: string;
  description: string;
}

const ALL_NEW_CURATED: CuratedTemplate[] = ALL_NEW_WEBSITE_TEMPLATES.map((t) => ({
  id: t.id,
  name: t.name,
  category: t.category,
  categoryDisplay: t.category.toUpperCase(),
  pageType: "single-page" as const,
  pageTypeDisplay: "SINGLE PAGE",
  isPremium: false,
  uses: "1.4k uses",
  addedTime: "Added Today",
  thumbnail: t.thumbnail || "/images/hero-saas.svg",
  headline: t.description ? t.description.slice(0, 60) : t.name,
  description: t.description || "",
}));

const CURATED_TEMPLATES: CuratedTemplate[] = [
  {
    id: "tpl-drivepro-driving-school",
    name: "DrivePro Academy",
    category: "Driving School",
    categoryDisplay: "DRIVING SCHOOL",
    pageType: "multi-page",
    pageTypeDisplay: "MULTI PAGE",
    isPremium: false,
    uses: "2.3k uses",
    addedTime: "Added Today",
    thumbnail: "/images/hero-car.svg",
    headline: "Learn to Drive with Confidence",
    description: "Multi-page driving school template for teens and adults featuring courses, instructors, pricing packages, FAQ, and student resources.",
  },
  ...ALL_NEW_CURATED,
  {
    id: "tpl-nexora-agency",
    name: "Nexora Agency",
    category: "Agency",
    categoryDisplay: "AGENCY",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "1.9k uses",
    addedTime: "Added Today",
    thumbnail: "/images/hero-web.svg",
    headline: "Ideas that become digital momentum",
    description: "Creative digital agency template for web, mobile apps, SEO, and bespoke digital products with rich hero slider and pricing.",
  },
  {
    id: "freelancer-developer-portfolio",
    name: "Nova Studio",
    category: "Freelancer",
    categoryDisplay: "FREELANCER",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "1.2k uses",
    addedTime: "Added 2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    headline: "Design that makes brands unforgettable",
    description: "A bold, modern creative studio and portfolio template built for freelancers and boutique design agencies.",
  },
  {
    id: "tpl-pixel-code",
    name: "Pixel & Code",
    category: "Freelancer",
    categoryDisplay: "FREELANCER",
    pageType: "multi-page",
    pageTypeDisplay: "MULTI PAGE",
    isPremium: true,
    uses: "860 uses",
    addedTime: "Added 5 days ago",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    headline: "I build fast, modern web apps",
    description: "High-tech software developer and engineering studio template with project showcases and interactive stack filters.",
  },
  {
    id: "tpl-careplus-clinic",
    name: "CarePlus Clinic",
    category: "Healthcare",
    categoryDisplay: "HEALTHCARE",
    pageType: "multi-page",
    pageTypeDisplay: "MULTI PAGE",
    isPremium: true,
    uses: "540 uses",
    addedTime: "Added 1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    headline: "Compassionate care, close to home",
    description: "Medical clinic, dental practice, and wellness center website with doctor profiles and appointment booking.",
  },
  {
    id: "wellness-health-fitness",
    name: "IronPulse Gym",
    category: "Fitness & Gym",
    categoryDisplay: "FITNESS & GYM",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "2.1k uses",
    addedTime: "Added 3 days ago",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    headline: "Train harder. Get stronger.",
    description: "High-energy gym, crossfit box, and athletic training facility website with class schedules and membership tiers.",
  },
  {
    id: "tpl-flow-yoga",
    name: "Flow Yoga Studio",
    category: "Fitness & Gym",
    categoryDisplay: "FITNESS & GYM",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "2.4k uses",
    addedTime: "Added Today",
    thumbnail: "/templates/flow-yoga-preview.png",
    headline: "Move softly. Live fully.",
    description: "Serene, mindful yoga studio template with weekly timetable schedule, class offerings, photo bento gallery, and memberships.",
  },
  {
    id: "tpl-saffron-ember-restaurant",
    name: "Saffron & Ember",
    category: "Restaurant & Café",
    categoryDisplay: "RESTAURANT & CAFÉ",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "1.8k uses",
    addedTime: "Added Today",
    thumbnail: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
    headline: "Fire, spice & slow stories",
    description: "Atmospheric modern dining template with tandoor signature menus, photo gallery, chef specials, and online reservations.",
  },
  {
    id: "tpl-bean-bloom-cafe",
    name: "Bean & Bloom Café",
    category: "Restaurant & Café",
    categoryDisplay: "RESTAURANT & CAFÉ",
    pageType: "multi-page",
    pageTypeDisplay: "MULTI PAGE",
    isPremium: true,
    uses: "640 uses",
    addedTime: "Added 1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    headline: "Slow coffee for busy mornings",
    description: "Artisanal specialty coffee shop, bakery, and brunch destination template with online ordering and location map.",
  },
  {
    id: "tpl-dreamhome-real-estate",
    name: "Skyline Realty",
    category: "Real Estate",
    categoryDisplay: "REAL ESTATE",
    pageType: "multi-page",
    pageTypeDisplay: "MULTI PAGE",
    isPremium: true,
    uses: "980 uses",
    addedTime: "Added 4 days ago",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    headline: "Find a home that fits your life",
    description: "Luxury property developer and real estate agency website with architectural listings and schedule viewing.",
  },
  {
    id: "tpl-haven-homes",
    name: "Haven Homes",
    category: "Real Estate",
    categoryDisplay: "REAL ESTATE",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "1.1k uses",
    addedTime: "Added 6 days ago",
    thumbnail: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
    headline: "Your next chapter starts here",
    description: "Warm, family-focused boutique real estate agency template showcasing featured residential homes and neighborhoods.",
  },
  {
    id: "tpl-rose-beauty-salon",
    name: "Rosé Atelier",
    category: "Beauty & Salon",
    categoryDisplay: "BEAUTY & SALON",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: false,
    uses: "1.5k uses",
    addedTime: "Added Today",
    thumbnail: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    headline: "Beauty that feels like you",
    description: "Premium hair studio, skin clinic, and lash salon template with treatment price lists and appointment scheduling.",
  },
  {
    id: "tpl-glow-skin-spa",
    name: "Glow Skin Spa",
    category: "Beauty & Salon",
    categoryDisplay: "BEAUTY & SALON",
    pageType: "single-page",
    pageTypeDisplay: "SINGLE PAGE",
    isPremium: true,
    uses: "420 uses",
    addedTime: "Added 3 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    headline: "Calm skin, calmer mind",
    description: "Holistic dermatological facial spa and botanical skincare boutique template with signature packages.",
  },
];

const CATEGORIES_LIST = TEMPLATE_CATEGORIES.map((cat) => ({
  name: cat,
  count:
    cat === "All"
      ? CURATED_TEMPLATES.length
      : CURATED_TEMPLATES.filter((tpl) => matchesTemplateCategory(tpl.category, cat)).length,
}));

function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"All" | "Single page" | "Multi page" | "Free templates" | "Premium templates">("All");
  const [sortOption, setSortOption] = useState("Most popular");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const navigate = useNavigate();
  const newProject = useBuilder((s) => s.newProject);
  const applyTemplateToCurrent = useBuilder((s) => s.applyTemplate);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      if (next) toast.success("Added to favorites");
      else toast.info("Removed from favorites");
      return { ...prev, [id]: next };
    });
  };

  const filteredTemplates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CURATED_TEMPLATES.filter((tpl) => {
      // Category filter
      if (selectedCategory !== "All" && !matchesTemplateCategory(tpl.category, selectedCategory)) {
        return false;
      }

      // Type filter
      if (typeFilter === "Single page" && tpl.pageType !== "single-page") return false;
      if (typeFilter === "Multi page" && tpl.pageType !== "multi-page") return false;
      if (typeFilter === "Free templates" && tpl.isPremium) return false;
      if (typeFilter === "Premium templates" && !tpl.isPremium) return false;

      // Search query
      if (q) {
        const matches =
          tpl.name.toLowerCase().includes(q) ||
          tpl.headline.toLowerCase().includes(q) ||
          tpl.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [selectedCategory, typeFilter, searchQuery]);

  const handleOpenPreview = (tpl: CuratedTemplate) => {
    const libTemplate = TEMPLATE_LIBRARY.find((t) => t.id === tpl.id || t.name.toLowerCase().includes(tpl.name.toLowerCase()));
    setPreviewTemplate(libTemplate ? { ...tpl, ...libTemplate } : tpl);
  };

  const handleUseTemplate = async (tpl: CuratedTemplate) => {
    setLoadingId(tpl.id);
    try {
      // Find matching template in template library if available, or create project
      const libTemplate = TEMPLATE_LIBRARY.find((t) => t.id === tpl.id || t.name.includes(tpl.name));
      newProject(tpl.name);

      if (libTemplate) {
        applyTemplateToCurrent(libTemplate as any);
      }

      const current = useBuilder.getState().currentProject();
      if (!current) throw new Error("Failed to initialize project");

      toast.success(`${tpl.name} template loaded! Opening editor...`);
      navigate({ to: "/editor/$projectId", params: { projectId: current.id } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load template");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      {/* ================= HERO BANNER ================= */}
      <section className="relative rounded-[22px] bg-gradient-to-br from-[#17150f] via-[#141418] to-[#121215] border border-white/[0.07] p-8 overflow-hidden flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#ffc21a]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-xs font-bold mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a] animate-pulse" />
            11 ready-made designs
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Website <span className="text-[#ffc21a]">Templates</span>
          </h1>
          <p className="text-sm text-[#9a9aa3] leading-relaxed">
            Pick a professionally designed template, customise it in minutes and publish — fully responsive and SEO-ready.
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="relative z-10 flex items-center gap-2 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-center min-w-[70px]">
            <div className="text-base font-black text-[#ffc21a] leading-tight">6</div>
            <div className="text-[10px] text-[#9a9aa3] uppercase font-bold">Free</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-center min-w-[70px]">
            <div className="text-base font-black text-[#ffc21a] leading-tight">5</div>
            <div className="text-[10px] text-[#9a9aa3] uppercase font-bold">Premium</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-center min-w-[70px]">
            <div className="text-base font-black text-[#ffc21a] leading-tight">20</div>
            <div className="text-[10px] text-[#9a9aa3] uppercase font-bold">Categories</div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY FILTER SECTION ================= */}
      <section className="space-y-4 rounded-2xl bg-[#151518] border border-white/[0.07] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Filter className="w-3.5 h-3.5 text-[#ffc21a]" />
            <span>Filter by category</span>
            <span className="text-[#6b6b74] font-normal">({CATEGORIES_LIST.length} categories)</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="text-xs font-bold text-[#ffc21a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Show all</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer ${
                  isActive
                    ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md shadow-[#ffc21a]/25"
                    : "bg-[#111114] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-medium"
                }`}
              >
                <span>{cat.name}</span>
                {cat.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-black/20 text-[#1a1400]" : "bg-white/10 text-[#9a9aa3]"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-Filters: Type & Sort */}
        <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#6b6b74] font-semibold">Type:</span>
            {(["All", "Single page", "Multi page", "Free templates", "Premium templates"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  typeFilter === t
                    ? "bg-white/15 text-white"
                    : "text-[#9a9aa3] hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#111114] border border-white/10 focus-within:border-[#ffc21a]/50 rounded-lg px-2.5 py-1 text-xs text-white">
              <Search className="w-3.5 h-3.5 text-[#6b6b74]" />
              <input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#6b6b74] w-36 sm:w-44"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#6b6b74] font-semibold">Sort:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-[#111114] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1 pr-6 appearance-none outline-none cursor-pointer"
                >
                  <option>Most popular</option>
                  <option>Newest</option>
                  <option>Name A-Z</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#6b6b74] absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALL TEMPLATES GRID ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white">
            All <span className="text-[#9a9aa3] font-normal">templates</span>
          </h2>
          <span className="text-xs text-[#6b6b74]">
            Showing {filteredTemplates.length} templates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((t) => {
            const isFav = Boolean(favorites[t.id]);
            return (
              <div
                key={t.id}
                className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg"
              >
                {/* Mock Browser Chrome + Thumbnail */}
                <div
                  className="relative h-48 overflow-hidden bg-[#0d0d10] cursor-pointer"
                  onClick={() => handleOpenPreview(t)}
                  title="Click to preview template"
                >
                  {/* Browser Chrome Header */}
                  <div className="h-6 bg-[#18181c] border-b border-white/[0.06] flex items-center px-3 gap-1.5 z-10 relative">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="ml-auto w-14 h-2 rounded-full bg-white/10" />
                  </div>

                  <img
                    src={t.thumbnail}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Headline Overlay */}
                  <div className="absolute bottom-3 left-3 right-12">
                    <p className="text-xs font-bold text-white leading-tight drop-shadow">
                      {t.headline}
                    </p>
                  </div>

                  {/* Free / Premium Badge */}
                  <div className="absolute left-3 top-9">
                    {t.isPremium ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#ffc21a] text-[#1a1400] font-black text-[10px] shadow">
                        ★ Premium
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-[#22c55e] text-[#04130d] font-black text-[10px] shadow">
                        Free
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(t.id, e)}
                    className="absolute right-3 top-9 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center transition cursor-pointer z-10"
                    title="Favorite"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? "fill-[#ffc21a] text-[#ffc21a]" : "text-white"
                      }`}
                    />
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase">
                      {t.categoryDisplay} · {t.pageTypeDisplay}
                    </p>
                    <h3 className="font-extrabold text-white text-base group-hover:text-[#ffc21a] transition truncate mt-0.5">
                      {t.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6b6b74]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{t.uses}</span>
                    </span>
                    <span>{t.addedTime}</span>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(t)}
                      className="w-9 h-9 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === t.id}
                      onClick={() => handleUseTemplate(t)}
                      className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{loadingId === t.id ? "Loading…" : "Use template →"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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