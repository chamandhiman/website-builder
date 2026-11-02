"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
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
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBuilder } from "@/lib/builder/store";
import { useCloudProjects } from "@/lib/builder/useCloudProjects";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TEMPLATE_LIBRARY } from "@/lib/builder/templates";

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

  // Curated demo/real projects
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

  // Curated templates
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

      {/* ================= HERO GREETING BANNER WITH REDESIGNED 2x2 STATS CARDS ================= */}
      <section className="relative rounded-[22px] bg-white border border-[#E2E8F0] p-6 lg:p-7 overflow-hidden shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#7137D8]/8 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-[#3478F6]/8 blur-3xl pointer-events-none" />
        </div>

        {/* Left: Greeting & summary */}
        <div className="relative z-10 flex-1 min-w-0 max-w-xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7137D8]/10 border border-[#7137D8]/20 text-[#7137D8] text-xs font-bold mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7137D8] animate-pulse" />
            Thursday, 8 October
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight leading-tight mb-2">
            Good evening, <span className="text-[#7137D8]">{displayName}</span> 👋
          </h1>
          <p className="text-xs md:text-sm text-[#475569] leading-relaxed font-medium">
            You have 2 sites live and 2 drafts in progress. Pick up where you left off or start something new.
          </p>
        </div>

        {/* Right: 4 Visually Distinct, Tinted Statistic Cards */}
        <div className="relative z-10 shrink-0 grid grid-cols-2 gap-3 sm:gap-3.5 w-full md:w-auto">
          {/* Card 1: Total projects (Light Purple) */}
          <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-[#F6F0FE] border border-[#E9D8FD] shadow-xs hover:border-[#D6BCFA] hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-[142px] sm:h-[100px] group cursor-default">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#EDE0FD] text-[#7137D8] flex items-center justify-center shadow-xs">
                <Folder className="w-4 h-4 text-[#7137D8]" />
              </span>
              <span className="text-2xl font-black text-[#111827] group-hover:text-[#7137D8] transition-colors">4</span>
            </div>
            <div className="text-[11.5px] font-bold text-[#5B21B6] mt-2 truncate">Total projects</div>
          </div>

          {/* Card 2: Published sites (Light Green) */}
          <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-[#EDFDF2] border border-[#C6F6D5] shadow-xs hover:border-[#9AE6B4] hover:shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-[142px] sm:h-[100px] group cursor-default">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#D3F9DE] text-[#16A34A] flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4 text-[#16A34A]" />
              </span>
              <span className="text-2xl font-black text-[#111827] group-hover:text-[#16A34A] transition-colors">2</span>
            </div>
            <div className="text-[11.5px] font-bold text-[#15803D] mt-2 truncate">Published sites</div>
          </div>

          {/* Card 3: Active widgets (Light Blue) */}
          <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-[#EEF6FE] border border-[#CDE5FE] shadow-xs hover:border-[#A4CEFE] hover:shadow-md hover:shadow-sky-500/10 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-[142px] sm:h-[100px] group cursor-default">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#DBEDFE] text-[#3478F6] flex items-center justify-center shadow-xs">
                <Grid2x2 className="w-4 h-4 text-[#3478F6]" />
              </span>
              <span className="text-2xl font-black text-[#111827] group-hover:text-[#3478F6] transition-colors">4</span>
            </div>
            <div className="text-[11.5px] font-bold text-[#1D4ED8] mt-2 truncate">Active widgets</div>
          </div>

          {/* Card 4: Visitors this month (Light Pink / Magenta) */}
          <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] shadow-xs hover:border-[#F472B6] hover:shadow-md hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-[142px] sm:h-[100px] group cursor-default">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-[#FCE7F3] text-[#D52BBD] flex items-center justify-center shadow-xs">
                <Eye className="w-4 h-4 text-[#D52BBD]" />
              </span>
              <div className="text-right">
                <span className="text-xl font-black text-[#111827] group-hover:text-[#D52BBD] transition-colors leading-none">12.4k</span>
                <span className="text-[9.5px] font-extrabold text-[#16A34A] block leading-none mt-0.5">↑ 18%</span>
              </div>
            </div>
            <div className="text-[11.5px] font-bold text-[#BE185D] mt-2 truncate">Visitors this month</div>
          </div>
        </div>
      </section>

      {/* ================= MAIN 2-COLUMN SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left Column (8 cols): Recent Projects + Recent Templates */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#111827]">Recent projects</h2>
                <p className="text-xs text-[#64748B]">Your latest websites and drafts.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/projects" as never })}
                className="text-xs font-bold text-[#7137D8] hover:text-[#5B21B6] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
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
                    className="rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#7137D8]/40 hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer shadow-xs"
                  >
                    {/* Mock Browser Frame with Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      {/* Browser Chrome Header */}
                      <div className="h-6 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5 z-10 relative">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="ml-auto w-14 h-2 rounded-full bg-slate-200" />
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
                          <span className="px-2 py-0.5 rounded-md bg-[#16A34A] text-white font-black text-[10px] shadow-xs">
                            ● Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-[#475569] text-white font-black text-[10px] shadow-xs">
                            ● Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-extrabold tracking-wider text-[#64748B] uppercase truncate">
                          CUSTOM TEMPLATE · {p.domain}
                        </p>
                        <h3 className="font-extrabold text-[#111827] text-base group-hover:text-[#7137D8] transition-colors truncate mt-0.5">
                          {p.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>{p.edited}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{p.views}</span>
                        </span>
                      </div>

                      {/* Card actions */}
                      <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProject(p.id);
                          }}
                          className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7137D8]/40 text-[#64748B] hover:text-[#7137D8] flex items-center justify-center transition-colors cursor-pointer shrink-0"
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
                          style={{ color: "#FFFFFF" }}
                          className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] !text-white font-bold text-xs shadow-md shadow-[#7137D8]/20 hover:shadow-lg hover:shadow-[#7137D8]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span style={{ color: "#FFFFFF" }} className="!text-white">Edit project →</span>
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
                <h2 className="text-base font-extrabold text-[#111827]">Recent templates</h2>
                <p className="text-xs text-[#64748B]">Freshly added designs ready to use.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/templates" as never })}
                className="text-xs font-bold text-[#7137D8] hover:text-[#5B21B6] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all templates</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTemplates.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#7137D8]/40 hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-xs"
                >
                  {/* Browser Chrome Header + Image */}
                  <div className="relative h-36 overflow-hidden bg-slate-900">
                    <div className="h-5 bg-slate-100 border-b border-slate-200 flex items-center px-2.5 gap-1 z-10 relative">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                    <img
                      src={t.image}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute left-2.5 bottom-2.5 px-2 py-0.5 rounded-md bg-[#16A34A] text-white font-extrabold text-[10px]">
                      {t.tag}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-extrabold tracking-wider text-[#64748B] uppercase truncate">
                        {t.category}
                      </p>
                      <h3 className="font-extrabold text-[#111827] text-sm group-hover:text-[#7137D8] transition-colors truncate">
                        {t.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(t.id)}
                        className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#7137D8]/40 text-[#64748B] hover:text-[#7137D8] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(t.id)}
                        style={{ color: "#FFFFFF" }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] !text-white font-bold text-xs shadow-md shadow-[#7137D8]/20 hover:shadow-lg hover:shadow-[#7137D8]/30 transition-all cursor-pointer"
                      >
                        <span style={{ color: "#FFFFFF" }} className="!text-white">Use template →</span>
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
          <div className="rounded-2xl p-5 bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#111827] text-sm">Recent activity</h3>

            <div className="space-y-3.5 text-xs">
              {/* Activity 1 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  <span className="font-bold text-[#111827]">Spice Route Restaurant</span> was published
                  <small className="block text-[11px] text-[#64748B] mt-0.5">2 hours ago</small>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#7137D8] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  Countdown widget added to <span className="font-bold text-[#111827]">shop.example.in</span>
                  <small className="block text-[11px] text-[#64748B] mt-0.5">5 hours ago</small>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#3478F6] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  You started <span className="font-bold text-[#111827]">IronPulse Noida</span> from a template
                  <small className="block text-[11px] text-[#64748B] mt-0.5">3 days ago</small>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#D52BBD] mt-1.5 shrink-0" />
                <div className="leading-snug">
                  New template <span className="font-bold text-[#111827]">Rosé Atelier</span> available
                  <small className="block text-[11px] text-[#64748B] mt-0.5">Today</small>
                </div>
              </div>
            </div>
          </div>

          {/* Free plan usage card */}
          <div className="rounded-2xl p-5 bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-extrabold text-[#111827]">Free plan</strong>
              <button
                type="button"
                onClick={() => toast.info("Pro plans are coming soon! Stay tuned.")}
                className="text-xs font-bold text-[#7137D8] hover:text-[#5B21B6] hover:underline cursor-pointer transition-colors"
              >
                Upgrade
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Projects */}
              <div>
                <div className="flex justify-between text-[11px] text-[#64748B] mb-1">
                  <span>Projects</span>
                  <span className="font-bold text-[#111827]">4 / 5</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[80%] h-full rounded-full bg-gradient-to-r from-[#7137D8] to-[#D52BBD]" />
                </div>
              </div>

              {/* Storage */}
              <div>
                <div className="flex justify-between text-[11px] text-[#64748B] mb-1">
                  <span>Storage</span>
                  <span className="font-bold text-[#111827]">1.2 / 2 GB</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[60%] h-full rounded-full bg-gradient-to-r from-[#7137D8] to-[#D52BBD]" />
                </div>
              </div>

              {/* Widgets */}
              <div>
                <div className="flex justify-between text-[11px] text-[#64748B] mb-1">
                  <span>Widgets</span>
                  <span className="font-bold text-[#111827]">4 / 6</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[66%] h-full rounded-full bg-gradient-to-r from-[#7137D8] to-[#D52BBD]" />
                </div>
              </div>
            </div>
          </div>

          {/* New to WebToolOcean? Onboarding Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF] border border-purple-200/70 shadow-xs space-y-3">
            <span className="text-xl">🎓</span>
            <strong className="block text-sm font-bold text-[#111827]">New to WebToolOcean?</strong>
            <p className="text-xs text-[#475569] leading-relaxed font-medium">
              Watch the 3-minute tour and launch your first site today.
            </p>
            <button
              type="button"
              onClick={() => toast.info("Tour video opening soon!")}
              style={{ color: "#FFFFFF" }}
              className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-[#7137D8] hover:bg-[#5B21B6] !text-white font-bold text-xs transition-colors shadow-xs shadow-purple-500/20 cursor-pointer"
            >
              <span style={{ color: "#FFFFFF" }} className="!text-white">▶ Watch tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
