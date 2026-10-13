"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  Folder,
  Globe,
  Grid2x2,
  TrendingUp,
  GraduationCap,
  Play,
  Home,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBuilder } from "@/lib/builder/store";
import { useCloudProjects } from "@/lib/builder/useCloudProjects";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TEMPLATE_LIBRARY } from "@/lib/builder/templates";
import { DashboardThemeSelector } from "@/lib/dashboard-theme";

interface ProjectDashboardProps {
  onOpenEditor?: (projectId: string) => void;
}

export function ProjectDashboard({ onOpenEditor }: ProjectDashboardProps) {
  const { user } = useAuth();
  const { projects: cloudProjects, loading, refresh } = useCloudProjects();
  const loadCloudProject = useBuilder((s) => s.loadCloudProject);
  const projectsMap = useBuilder((s) => s.projects);
  const localProjects = useMemo(() => Object.values(projectsMap), [projectsMap]);
  const setShowProjectDashboard = useBuilder((s) => s.setShowProjectDashboard);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Open Project in Editor
  const openProject = async (projectId: string) => {
    const builderState = useBuilder.getState();
    const localProject = builderState.projects[projectId];

    if (localProject) {
      builderState.loadProject(projectId);
      setShowProjectDashboard(false);
      navigate({
        to: "/editor/$projectId",
        params: { projectId },
      });
      onOpenEditor?.(projectId);
      return;
    }

    if (user) {
      await loadCloudProject(projectId);
      setShowProjectDashboard(false);
      navigate({
        to: "/editor/$projectId",
        params: { projectId },
      });
      onOpenEditor?.(projectId);
    }
  };

  // Curated demo/real projects matching Screenshot 1
  const displayProjects = useMemo(() => {
    const defaultList = [
      {
        id: "p-spice-route",
        name: "Spice Route Restaurant",
        domain: "spiceroute.in",
        status: "published",
        edited: "Edited 2 hours ago",
        views: "4,820",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
        headline: "Fire, spice & slow stories",
      },
      {
        id: "p-rose-beauty",
        name: "Rosé Beauty Studio",
        domain: "roseatelier.in",
        status: "published",
        edited: "Edited yesterday",
        views: "3,140",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
        headline: "Beauty that feels like you",
      },
      {
        id: "p-ironpulse",
        name: "IronPulse Noida",
        domain: "ironpulse.webtoolocean.site",
        status: "draft",
        edited: "Edited 3 days ago",
        views: "—",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        headline: "Train harder. Get stronger.",
      },
      {
        id: "p-skyline",
        name: "Skyline Properties",
        domain: "skyline.webtoolocean.site",
        status: "draft",
        edited: "Edited last week",
        views: "—",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        headline: "Find a home that fits your life",
      },
    ];

    const source = user ? cloudProjects : localProjects;
    if (source && source.length > 0) {
      // Merge real projects if available
      return defaultList.map((dp, idx) => {
        const real = source[idx] as any;
        if (real) {
          return {
            id: real.id,
            name: real.name || dp.name,
            domain: real.domain || dp.domain,
            status: real.status === "published" || real.published ? "published" : dp.status,
            edited: "Edited recently",
            views: dp.views,
            image: real.thumbnail || dp.image,
            headline: dp.headline,
          };
        }
        return dp;
      });
    }

    return defaultList;
  }, [user, cloudProjects, localProjects]);

  // Curated templates matching Screenshot 1
  const recentTemplates = [
    {
      id: "tpl-saffron-ember-restaurant",
      title: "Saffron & Ember",
      category: "RESTAURANT & CAFÉ · SINGLE PAGE",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
      headline: "Fire, spice & slow stories",
      tag: "Free",
    },
    {
      id: "tpl-rose-beauty-salon",
      title: "Rosé Atelier",
      category: "BEAUTY & SALON · SINGLE PAGE",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
      headline: "Beauty that feels like you",
      tag: "Free",
    },
    {
      id: "wellness-health-fitness",
      title: "IronPulse Gym",
      category: "FITNESS & GYM · SINGLE PAGE",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      headline: "Train harder. Get stronger.",
      tag: "Free",
    },
    {
      id: "freelancer-developer-portfolio",
      title: "Nova Studio",
      category: "FREELANCER · SINGLE PAGE",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
      headline: "Design that makes brands unforgettable",
      tag: "Free",
    },
  ];

  const handleUseTemplate = (tplId: string) => {
    navigate({ to: "/dashboard/templates" as never });
  };

  const displayName = user?.name || "Web Tool Ocean";

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* ================= HERO GREETING BANNER ================= */}
      <section className="relative rounded-[22px] bg-gradient-to-br from-[#17150f] via-[#141418] to-[#121215] border border-white/[0.07] p-8 overflow-hidden flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#ffc21a]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-xs font-bold mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a] animate-pulse" />
            Thursday, 8 October
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Good evening, <span className="text-[#ffc21a]">Web Tool Ocean</span> 👋
          </h1>
          <p className="text-sm text-[#9a9aa3] leading-relaxed">
            You have 2 sites live and 2 drafts in progress. Pick up where you left off or start something new.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-lg shadow-[#ffc21a]/25 hover:opacity-95 transition cursor-pointer"
          >
            <span>+ New project</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/templates" as never })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 hover:border-white/20 text-white font-bold text-xs transition cursor-pointer"
          >
            <span>Browse templates</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 hover:border-[#ffc21a]/40 text-[#d4d4d8] hover:text-white font-bold text-xs transition cursor-pointer"
            title="Exit Dashboard and return to Landing Page"
          >
            <Home className="w-3.5 h-3.5 text-[#ffc21a]" />
            <span>Exit Dashboard</span>
          </button>
          <DashboardThemeSelector mode="banner-button" />
        </div>
      </section>

      {/* ================= 4 STATS ROW ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total projects */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
          <div className="w-11 h-11 rounded-xl bg-[#ffc21a]/10 text-[#ffc21a] flex items-center justify-center shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-tight">4</div>
            <div className="text-xs text-[#9a9aa3]">Total projects</div>
          </div>
        </div>

        {/* Published sites */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
          <div className="w-11 h-11 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-tight">2</div>
            <div className="text-xs text-[#9a9aa3]">Published sites</div>
          </div>
        </div>

        {/* Active widgets */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
          <div className="w-11 h-11 rounded-xl bg-[#60a5fa]/10 text-[#60a5fa] flex items-center justify-center shrink-0">
            <Grid2x2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-tight">4</div>
            <div className="text-xs text-[#9a9aa3]">Active widgets</div>
          </div>
        </div>

        {/* Visitors this month */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
          <div className="w-11 h-11 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-tight">12.4k</div>
            <div className="text-xs text-[#9a9aa3]">
              Visitors this month <span className="text-[#22c55e] font-bold ml-1">↑ 18%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 QUICK ACTIONS ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start from blank */}
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-between p-4 rounded-2xl bg-[#151518] border border-white/[0.07] hover:border-[#ffc21a]/40 transition group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffc21a]/10 text-[#ffc21a] flex items-center justify-center shrink-0 font-bold text-lg">
              +
            </div>
            <div>
              <strong className="block text-sm font-bold text-white group-hover:text-[#ffc21a] transition">
                Start from blank
              </strong>
              <small className="block text-xs text-[#9a9aa3]">Build with drag &amp; drop</small>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6b6b74] group-hover:text-[#ffc21a] group-hover:translate-x-1 transition" />
        </button>

        {/* Use a template */}
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/templates" as never })}
          className="flex items-center justify-between p-4 rounded-2xl bg-[#151518] border border-white/[0.07] hover:border-[#ffc21a]/40 transition group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 text-[#60a5fa] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold text-white group-hover:text-[#ffc21a] transition">
                Use a template
              </strong>
              <small className="block text-xs text-[#9a9aa3]">11 designs, 20 categories</small>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6b6b74] group-hover:text-[#ffc21a] group-hover:translate-x-1 transition" />
        </button>

        {/* Add a widget */}
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/widgets" as never })}
          className="flex items-center justify-between p-4 rounded-2xl bg-[#151518] border border-white/[0.07] hover:border-[#ffc21a]/40 transition group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center shrink-0">
              <Grid2x2 className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm font-bold text-white group-hover:text-[#ffc21a] transition">
                Add a widget
              </strong>
              <small className="block text-xs text-[#9a9aa3]">Timers, reviews &amp; more</small>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6b6b74] group-hover:text-[#ffc21a] group-hover:translate-x-1 transition" />
        </button>
      </section>

      {/* ================= MAIN 2-COLUMN SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left Column (8 cols): Recent Projects + Recent Templates */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">Recent projects</h2>
                <p className="text-xs text-[#9a9aa3]">Your latest websites and drafts.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/projects" as never })}
                className="text-xs font-bold text-[#ffc21a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all projects</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayProjects.map((p) => {
                const isPublished = p.status === "published";
                return (
                  <div
                    key={p.id}
                    onClick={() => openProject(p.id)}
                    className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/40 transition overflow-hidden flex flex-col justify-between group cursor-pointer shadow-lg"
                  >
                    {/* Mock Browser Frame with Image */}
                    <div className="relative h-44 overflow-hidden bg-[#0d0d10]">
                      {/* Browser Chrome Header */}
                      <div className="h-6 bg-[#18181c] border-b border-white/[0.06] flex items-center px-3 gap-1.5 z-10 relative">
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                        <span className="ml-auto w-14 h-2 rounded-full bg-white/10" />
                      </div>

                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Headline overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs font-bold text-white leading-tight drop-shadow truncate">
                          {p.headline}
                        </p>
                      </div>

                      {/* Status badge */}
                      <div className="absolute left-3 top-9">
                        {isPublished ? (
                          <span className="px-2 py-0.5 rounded-md bg-[#22c55e] text-[#04130d] font-black text-[10px] shadow">
                            ● Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-[#ffc21a] text-[#1a1400] font-black text-[10px] shadow">
                            ● Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase truncate">
                          CUSTOM TEMPLATE · {p.domain}
                        </p>
                        <h3 className="font-extrabold text-white text-base group-hover:text-[#ffc21a] transition truncate mt-0.5">
                          {p.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#6b6b74]">
                        <span>{p.edited}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{p.views}</span>
                        </span>
                      </div>

                      {/* Card actions */}
                      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProject(p.id);
                          }}
                          className="w-9 h-9 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProject(p.id);
                          }}
                          className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Edit project →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent templates */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">Recent templates</h2>
                <p className="text-xs text-[#9a9aa3]">Freshly added designs ready to use.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/templates" as never })}
                className="text-xs font-bold text-[#ffc21a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all templates</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTemplates.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg"
                >
                  {/* Browser Chrome Header + Image */}
                  <div className="relative h-36 overflow-hidden bg-[#0d0d10]">
                    <div className="h-5 bg-[#18181c] border-b border-white/[0.06] flex items-center px-2.5 gap-1 z-10 relative">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                    <img
                      src={t.image}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute left-2.5 bottom-2.5 px-2 py-0.5 rounded-md bg-[#22c55e] text-[#04130d] font-extrabold text-[10px]">
                      {t.tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase truncate">
                        {t.category}
                      </p>
                      <h3 className="font-extrabold text-white text-sm group-hover:text-[#ffc21a] transition truncate">
                        {t.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(t.id)}
                        className="w-8 h-8 rounded-lg bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(t.id)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition cursor-pointer"
                      >
                        Use template →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Activity + Free Plan + Onboarding */}
        <div className="lg:col-span-4 space-y-5">
          {/* Recent activity card */}
          <div className="rounded-2xl p-5 bg-[#151518] border border-white/[0.07] space-y-4">
            <h3 className="font-extrabold text-white text-sm">Recent activity</h3>

            <div className="space-y-3.5 text-xs">
              {/* Activity 1 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  <span className="font-bold text-white">Spice Route Restaurant</span> was published
                  <small className="block text-[11px] text-[#6b6b74] mt-0.5">2 hours ago</small>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#ffc21a] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  Countdown widget added to <span className="font-bold text-white">shop.example.in</span>
                  <small className="block text-[11px] text-[#6b6b74] mt-0.5">5 hours ago</small>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#60a5fa] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  You started <span className="font-bold text-white">IronPulse Noida</span> from a template
                  <small className="block text-[11px] text-[#6b6b74] mt-0.5">3 days ago</small>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#a78bfa] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  New template <span className="font-bold text-white">Rosé Atelier</span> available
                  <small className="block text-[11px] text-[#6b6b74] mt-0.5">Today</small>
                </div>
              </div>
            </div>
          </div>

          {/* Free plan usage card */}
          <div className="rounded-2xl p-5 bg-[#151518] border border-white/[0.07] space-y-4">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-extrabold text-white">Free plan</strong>
              <button
                type="button"
                onClick={() => toast.info("Pro plans are coming soon! Stay tuned.")}
                className="text-xs font-bold text-[#ffc21a] hover:underline cursor-pointer"
              >
                Upgrade
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Projects */}
              <div>
                <div className="flex justify-between text-[11px] text-[#9a9aa3] mb-1">
                  <span>Projects</span>
                  <span className="font-bold text-white">4 / 5</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-[80%] h-full rounded-full bg-[#ffc21a]" />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex justify-between text-[11px] text-[#9a9aa3] mb-1">
                  <span>Storage</span>
                  <span className="font-bold text-white">1.2 / 2 GB</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-[60%] h-full rounded-full bg-[#ffc21a]" />
                </div>
              </div>

              {/* Widgets */}
              <div>
                <div className="flex justify-between text-[11px] text-[#9a9aa3] mb-1">
                  <span>Widgets</span>
                  <span className="font-bold text-white">4 / 6</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="w-[66%] h-full rounded-full bg-[#ffc21a]" />
                </div>
              </div>
            </div>
          </div>

          {/* New to WebToolOcean? Onboarding Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-[#18161f] to-[#141418] border border-white/[0.07] space-y-3">
            <span className="text-xl">🎓</span>
            <strong className="block text-sm font-bold text-white">New to WebToolOcean?</strong>
            <p className="text-xs text-[#9a9aa3] leading-relaxed">
              Watch the 3-minute tour and launch your first site today.
            </p>
            <button
              type="button"
              onClick={() => toast.info("Tour video opening soon!")}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer"
            >
              <span>▶ Watch tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
