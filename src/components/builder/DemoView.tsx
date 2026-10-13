import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { APP_CSS_HREF, buildPreviewHTML } from "@/lib/builder/preview";
import type { Project } from "@/lib/builder/store";
import { composePageSections } from "@/lib/builder/sharedChrome";
import { getBuilderProject } from "@/services/builderProject";
import { getTemplate } from "@/services/templates";
import { resolveAssetUrls, type BuilderAssetEntry } from "@/lib/builder/image-storage";
import {
  FREELANCER_PAGE,
  SAFFRON_HOME_PAGE,
  SAFFRON_GLOBAL_CSS,
  SAFFRON_SHARED_HEADER,
  SAFFRON_SHARED_FOOTER,
} from "@/services/templateSeeds";
import {
  FLOW_YOGA_SHARED_HEADER,
  FLOW_YOGA_SHARED_FOOTER,
  FLOW_YOGA_GLOBAL_CSS,
  FLOW_YOGA_ASSETS,
} from "@/services/templateSeedsYoga";
import {
  NEXORA_SHARED_HEADER,
  NEXORA_SHARED_FOOTER,
  NEXORA_GLOBAL_CSS,
  NEXORA_ASSETS,
} from "@/services/templateSeedsAgency";
import {
  DRIVE_PRO_SHARED_HEADER,
  DRIVE_PRO_SHARED_FOOTER,
  DRIVE_PRO_ASSETS,
} from "@/services/templateSeedsDrivingSchool";

function extractProjectId(param: string) {
  if (!param) return "";
  const match = param.match(/-([A-Za-z0-9_]{6,32})$/) || param.match(/-([A-Za-z0-9_]+)$/);
  return match ? match[1] : param;
}

export function DemoView({ projectId }: { projectId: string }) {
  const [mounted, setMounted] = useState(false);
  const [proj, setProj] = useState<Project | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const actualProjectId = extractProjectId(projectId);
  const { user, authReady } = useAuth();
  const lastPreviewHtmlRef = useRef<string | null>(null);
  const projRef = useRef<Project | null>(null);

  const applyProject = useCallback(
    (projectData: Project, pageId?: string | null) => {
      if (!projectData) return;
      const hasSections = projectData.pages?.some((pg) => pg.sections && pg.sections.length > 0);
      if (
        !hasSections &&
        (projectData.isTemplate ||
          projectData.name?.toLowerCase().includes("freelancer") ||
          actualProjectId.toLowerCase().includes("freelancer") ||
          projectId.toLowerCase().includes("freelancer"))
      ) {
        projectData.pages = [FREELANCER_PAGE];
      }
      setProj(projectData);
      projRef.current = projectData;
      setNotFound(false);
      setCloudError(null);

      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = (urlParams.get("page") || pageId)?.replace(/^[./]+/, "").replace(/\.html$/i, "");
      const matchedPage = pageParam
        ? projectData.pages?.find((pg) => pg.id === pageParam || pg.slug === pageParam)
        : null;
      const requestedPageId =
        matchedPage?.id ?? pageId ?? projectData.currentPageId ?? projectData.pages?.[0]?.id ?? null;
      setActivePageId(requestedPageId);
    },
    [actualProjectId, projectId]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__wtoIsPreview = true;
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith("wto_ap_seen_")) localStorage.removeItem(k);
        });
        Object.keys(sessionStorage).forEach((k) => {
          if (k.startsWith("wto_ap_seen_")) sessionStorage.removeItem(k);
        });
      } catch (_) {}
    }
    setMounted(true);
  }, []);

  // 1. PostMessage & BroadcastChannel Listeners
  useEffect(() => {
    const handleResponse = (event: MessageEvent) => {
      const data = event.data as {
        __lovablePreviewPayload?: true;
        projectId?: string;
        project?: Project;
        pageId?: string | null;
      };
      if (!data || data.__lovablePreviewPayload !== true || !data.project) return;
      applyProject(data.project, data.pageId);
    };

    window.addEventListener("message", handleResponse);

    // Cross-tab BroadcastChannel listener for project updates
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("wto-builder-preview");
      bc.onmessage = (event) => {
        if (event.data?.__lovablePreviewPayload && event.data.project) {
          lastPreviewHtmlRef.current = null;
          applyProject(event.data.project, event.data.pageId);
        }
      };
    } catch {
      // BroadcastChannel unsupported in older browser
    }

    // Cross-tab BroadcastChannel listener for studio widget updates
    let widgetBc: BroadcastChannel | null = null;
    try {
      widgetBc = new BroadcastChannel("wto_widgets_channel");
      widgetBc.onmessage = () => {
        lastPreviewHtmlRef.current = null;
        if (projRef.current) {
          applyProject({ ...projRef.current, updatedAt: Date.now() });
        }
      };
    } catch {
      // BroadcastChannel unsupported in older browser
    }

    // Storage event listener: whenever localStorage is updated in editor tab
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      if (
        e.key.startsWith("wto-preview-") ||
        e.key === "wto-builder-v2" ||
        e.key === "wto_dynamic_widgets_v1" ||
        e.key === "wto_widgets"
      ) {
        lastPreviewHtmlRef.current = null;
        try {
          const directRaw =
            localStorage.getItem(`wto-preview-${actualProjectId}`) ||
            localStorage.getItem(`wto-preview-${projectId}`) ||
            localStorage.getItem("wto-preview-latest");
          if (directRaw) {
            const parsed = JSON.parse(directRaw);
            const prj = parsed.project || parsed;
            if (prj && prj.pages && prj.pages.length > 0) {
              applyProject(prj, parsed.pageId);
              return;
            }
          }
          const builderRaw = localStorage.getItem("wto-builder-v2");
          if (builderRaw) {
            const data = JSON.parse(builderRaw);
            if (data?.projects) {
              const p = data.projects[actualProjectId] || data.projects[projectId];
              if (p && p.pages && p.pages.length > 0) {
                applyProject(p);
                return;
              }
            }
          }
          if (projRef.current) {
            applyProject({ ...projRef.current, updatedAt: Date.now() });
          }
        } catch (_) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Ping opener to request payload
    const sendReady = () => {
      if (window.opener) {
        try {
          window.opener.postMessage(
            { __previewReady: true, projectId, actualProjectId },
            "*"
          );
        } catch {
          // Opener unavailable or blocked
        }
      }
    };

    sendReady();
    const readyInterval = window.setInterval(() => {
      if (projRef.current) {
        window.clearInterval(readyInterval);
        return;
      }
      sendReady();
    }, 200);

    const timer = window.setTimeout(() => {
      window.clearInterval(readyInterval);
    }, 4000);

    return () => {
      window.removeEventListener("message", handleResponse);
      window.removeEventListener("storage", handleStorageChange);
      window.clearInterval(readyInterval);
      window.clearTimeout(timer);
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
      if (widgetBc) {
        try {
          widgetBc.close();
        } catch {}
      }
    };
  }, [actualProjectId, projectId, applyProject]);

  // 2. Storage & Template Fallback Resolution
  useEffect(() => {
    if (!mounted || projRef.current) return;

    // Check builder project stores FIRST so refresh always loads the latest saved edits
    const builderKeys = ["wto-builder-v2", "wto-builder-v1", "wto-builder-state"];
    for (const bKey of builderKeys) {
      try {
        const raw = localStorage.getItem(bKey);
        if (raw) {
          const data = JSON.parse(raw) as {
            projects?: Record<string, Project>;
            currentProjectId?: string;
          };
          if (data && data.projects) {
            // Direct key match
            let found: Project | undefined = data.projects[actualProjectId] || data.projects[projectId];

            // Match by searching project list
            if (!found) {
              const allProjects = Object.values(data.projects);
              found = allProjects.find((p) => {
                if (!p) return false;
                if (p.id === actualProjectId || p.id === projectId) return true;
                if (
                  projectId.endsWith(`-${p.id}`) ||
                  projectId.startsWith(`${p.id}-`) ||
                  projectId.includes(p.id)
                ) {
                  return true;
                }
                const slug = p.name
                  ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                  : "";
                if (slug && (projectId.includes(slug) || actualProjectId.includes(slug))) {
                  return true;
                }
                return false;
              });
            }

            // Fallback to active project if currently open
            if (!found && data.currentProjectId && data.projects[data.currentProjectId]) {
              found = data.projects[data.currentProjectId];
            }

            if (found && found.pages && found.pages.length > 0) {
              applyProject(found);
              return;
            }
          }
        }
      } catch {
        // Storage parse failed
      }
    }

    // Check direct preview storage entries
    const directKeys = [
      `wto-preview-${actualProjectId}`,
      `wto-preview-${projectId}`,
      "wto-preview-latest",
      "wto_preview_project",
    ];

    for (const key of directKeys) {
      try {
        const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          const prj = parsed.project || parsed;
          if (prj && prj.pages && prj.pages.length > 0) {
            applyProject(prj, parsed.pageId);
            return;
          }
        }
      } catch {
        // Storage parse failed
      }
    }

    // 3. Known Seed Templates Fallback
    const pLower = `${projectId} ${actualProjectId}`.toLowerCase();
    if (pLower.includes("freelancer") || pLower.includes("portfolio")) {
      const fallbackProj: Project = {
        id: actualProjectId,
        name: "Freelancer - Creative Portfolio",
        pages: [FREELANCER_PAGE],
        currentPageId: FREELANCER_PAGE.id,
        sharedHeader: null,
        sharedFooter: null,
        sharedChromeMigrated: true,
        isTemplate: true,
        globalCss: "",
        globalJs: "",
        customHead: "",
        assets: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      applyProject(fallbackProj, FREELANCER_PAGE.id);
      return;
    }

    if (pLower.includes("saffron") || pLower.includes("restaurant")) {
      const fallbackProj: Project = {
        id: actualProjectId,
        name: "Saffron & Ember - Modern Indian Kitchen",
        pages: [SAFFRON_HOME_PAGE],
        currentPageId: SAFFRON_HOME_PAGE.id,
        sharedHeader: SAFFRON_SHARED_HEADER,
        sharedFooter: SAFFRON_SHARED_FOOTER,
        sharedChromeMigrated: true,
        isTemplate: true,
        globalCss: SAFFRON_GLOBAL_CSS,
        globalJs: "",
        customHead: "",
        assets: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      applyProject(fallbackProj, SAFFRON_HOME_PAGE.id);
      return;
    }

    if (pLower.includes("yoga") || pLower.includes("flow")) {
      const fallbackProj: Project = {
        id: actualProjectId,
        name: "Flow & Ground Yoga",
        pages: [
          {
            id: "pg-yoga-home",
            slug: "index",
            name: "Home",
            sections: [],
          },
        ],
        currentPageId: "pg-yoga-home",
        sharedHeader: FLOW_YOGA_SHARED_HEADER,
        sharedFooter: FLOW_YOGA_SHARED_FOOTER,
        sharedChromeMigrated: true,
        isTemplate: true,
        globalCss: FLOW_YOGA_GLOBAL_CSS,
        globalJs: "",
        customHead: "",
        assets: FLOW_YOGA_ASSETS as any,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      applyProject(fallbackProj, "pg-yoga-home");
      return;
    }

    if (pLower.includes("nexora") || pLower.includes("agency")) {
      const fallbackProj: Project = {
        id: actualProjectId,
        name: "Nexora Digital Agency",
        pages: [
          {
            id: "pg-agency-home",
            slug: "index",
            name: "Home",
            sections: [],
          },
        ],
        currentPageId: "pg-agency-home",
        sharedHeader: NEXORA_SHARED_HEADER,
        sharedFooter: NEXORA_SHARED_FOOTER,
        sharedChromeMigrated: true,
        isTemplate: true,
        globalCss: NEXORA_GLOBAL_CSS,
        globalJs: "",
        customHead: "",
        assets: NEXORA_ASSETS as any,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      applyProject(fallbackProj, "pg-agency-home");
      return;
    }

    if (pLower.includes("driving") || pLower.includes("drivepro")) {
      const fallbackProj: Project = {
        id: actualProjectId,
        name: "DrivePro Academy",
        pages: [
          {
            id: "pg-driving-home",
            slug: "index",
            name: "Home",
            sections: [],
          },
        ],
        currentPageId: "pg-driving-home",
        sharedHeader: DRIVE_PRO_SHARED_HEADER,
        sharedFooter: DRIVE_PRO_SHARED_FOOTER,
        sharedChromeMigrated: true,
        isTemplate: true,
        globalCss: "",
        globalJs: "",
        customHead: "",
        assets: DRIVE_PRO_ASSETS as any,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      applyProject(fallbackProj, "pg-driving-home");
      return;
    }

    // 4. Prebuilt Template Database Lookup
    let cancelled = false;
    async function resolveTemplate() {
      try {
        const tpl = (await getTemplate(actualProjectId)) || (await getTemplate(projectId));
        if (cancelled || !tpl) return;
        const projectFromTpl: Project = {
          id: tpl.id,
          name: tpl.name,
          pages: tpl.pages && tpl.pages.length > 0 ? tpl.pages : [FREELANCER_PAGE],
          currentPageId: tpl.pages?.[0]?.id || FREELANCER_PAGE.id,
          sharedHeader: tpl.sharedHeader || null,
          sharedFooter: tpl.sharedFooter || null,
          sharedChromeMigrated: true,
          isTemplate: true,
          globalCss: tpl.globalCss || "",
          globalJs: tpl.globalJs || "",
          customHead: tpl.customHead || "",
          assets: tpl.assets || {},
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        applyProject(projectFromTpl);
      } catch {
        // Template lookup failed
      }
    }

    void resolveTemplate();
    return () => {
      cancelled = true;
    };
  }, [mounted, actualProjectId, projectId, applyProject]);

  // 3. Grace Period Timeout
  useEffect(() => {
    if (!mounted || proj || notFound) return;
    const timeout = window.setTimeout(() => {
      if (!projRef.current && !notFound) {
        setNotFound(true);
        setCloudError(
          "Preview failed to load. Open this page from the builder, or check that you are signed in."
        );
      }
    }, 6000);
    return () => window.clearTimeout(timeout);
  }, [mounted, proj, notFound]);

  // 4. Cloud Fetch Fallback (if user is logged in)
  useEffect(() => {
    if (!mounted || !authReady) return;
    if (proj || notFound || cloudLoading) return;

    let cancelled = false;
    async function loadFromCloud() {
      if (!user?.id) {
        return;
      }
      setCloudLoading(true);
      try {
        let project: Project | null = null;
        try {
          project = await getBuilderProject(actualProjectId);
        } catch {
          if (projectId !== actualProjectId) {
            try {
              project = await getBuilderProject(projectId);
            } catch {}
          }
        }
        if (cancelled || !project) return;
        applyProject(project);
      } catch (err) {
        if (cancelled) return;
        // Don't eagerly fail, let other fallbacks attempt
      } finally {
        if (!cancelled) {
          setCloudLoading(false);
        }
      }
    }

    void loadFromCloud();
    return () => {
      cancelled = true;
    };
  }, [mounted, authReady, user?.id, actualProjectId, projectId, proj, notFound, cloudLoading, applyProject]);

  // 5. Image & Asset URL Resolution
  useEffect(() => {
    if (!mounted || !proj) return;
    const currentProject = proj;
    let cancelled = false;
    async function resolveProjectAssets() {
      const assets = await resolveAssetUrls(currentProject.assets);
      if (cancelled || !assets) return;
      setProj((prev) => {
        if (!prev) return prev;
        projRef.current = { ...prev, assets: assets as Record<string, BuilderAssetEntry> };
        return { ...prev, assets: assets as Record<string, BuilderAssetEntry> };
      });
    }
    void resolveProjectAssets();
    return () => {
      cancelled = true;
    };
  }, [mounted, proj?.id]);

  // 6. Navigation in Preview Frame
  useEffect(() => {
    if (!mounted || !proj) return;
    const handlePreviewMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && event.origin !== "null") return;
      const data = event.data as { __wto?: boolean; type?: string; payload?: Record<string, unknown> };
      if (!data || !data.__wto) return;
      if (data.type !== "navigate-page") return;
      const rawSlug = String(data.payload?.slug ?? "");
      const cleanSlug = rawSlug.toLowerCase().replace(/^\/+/, "").replace(/\.html$/, "").trim();
      const page = proj.pages.find((pg) => {
        const pgSlug = (pg.slug || "").toLowerCase().replace(/^\/+/, "").replace(/\.html$/, "").trim();
        return (
          pgSlug === cleanSlug ||
          pg.id === cleanSlug ||
          pg.name.toLowerCase() === cleanSlug ||
          (cleanSlug === "home" && (pgSlug === "index" || pgSlug === "")) ||
          ((cleanSlug === "index" || cleanSlug === "") && pgSlug === "home")
        );
      });
      if (!page) return;
      setActivePageId(page.id);
      const params = new URLSearchParams(window.location.search);
      params.set("page", page.slug || cleanSlug);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    };
    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, [mounted, proj]);

  const previewHtml = useMemo(() => {
    const currentProj = projRef.current || proj;
    if (!currentProj || activePageId === null) {
      return lastPreviewHtmlRef.current;
    }
    const page = currentProj.pages.find((pg) => pg.id === activePageId) ?? currentProj.pages[0];
    if (!page) {
      return lastPreviewHtmlRef.current;
    }
    const composedSections = composePageSections(currentProj, page);
    const html = buildPreviewHTML({
      sections: composedSections,
      globalCss: currentProj.globalCss || "",
      globalJs: currentProj.globalJs || "",
      editable: false,
      assets: currentProj.assets,
      pages: currentProj.pages.map((pg) => ({ id: pg.id, slug: pg.slug })),
      currentPageSlug: page.slug,
      title: currentProj.name,
      description: page.description,
      keywords: page.keywords,
      seo: page.seo,
      projectSeo: currentProj.seo,
      customHead: currentProj.customHead,
      previewCssHref: currentProj.globalCss ? undefined : APP_CSS_HREF,
    });
    lastPreviewHtmlRef.current = html;
    return html;
  }, [proj, activePageId]);

  if (!mounted) return null;

  if (notFound && !projRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white text-center p-8 font-sans">
        <div className="max-w-md w-full p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold text-white">Project Not Found</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {cloudError
              ? cloudError
              : "Preview failed to load. Open this page from the builder, or check that you are signed in."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
            >
              Retry
            </button>
            <a
              href="/dashboard"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-black transition"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  const hasProject = !!projRef.current || !!proj;

  if (!hasProject || activePageId === null || (!previewHtml && !notFound)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white text-center p-8">
        <div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="mt-3 text-sm text-zinc-400 font-medium">Loading preview…</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      title={(projRef.current || proj)?.name || "Preview"}
      srcDoc={previewHtml || undefined}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      style={{ width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
