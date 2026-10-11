import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Folder,
  Layers,
  Clock3,
  Plus,
  Heart,
  MoreHorizontal,
  LayoutGrid,
  List,
  Trash2,
  Edit2,
  Eye,
  Copy,
  Download,
  Code2,
  Globe,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";
import { useBuilder, type Page } from "@/lib/builder/store";
import { useCloudProjects } from "@/lib/builder/useCloudProjects";
import {
  createProject as createCloudProject,
  updateProject as updateCloudProject,
} from "@/services/project";
import { useProjects } from "@/hooks/useProjects";
import { useCloudProjectsStore } from "@/lib/builder/cloudProjectsStore";
import {
  deleteBuilderProject,
  getBuilderProject,
  saveBuilderProject,
} from "@/services/builderProject";
import { buildSiteExport } from "@/lib/builder/preview";
import { exportProjectAsReactZip } from "@/lib/builder/export/reactExporter";
import { useNavigate } from "@tanstack/react-router";
import { useRequireAuth } from "@/lib/builder/useRequireAuth";
import { ClientOnly } from "./ClientOnly";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { formatUpdatedAt } from "@/lib/utils";

interface MyProjectsProps {
  title?: string;
  subtitle?: string;
  showOnlyFavorites?: boolean;
  showOnlyTrashed?: boolean;
  hideCreateAction?: boolean;
}

const FALLBACK_THUMBNAILS = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80", // Nova Studio / creative
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // Pixel & Code / tech
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80", // Clinic / Healthcare
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80", // Portfolio / creative
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // SaaS / app
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80", // Restaurant / food
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", // Gym / fitness
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", // Real estate
];

function getProjectThumbnail(project: any): string {
  if (
    project.thumbnail &&
    typeof project.thumbnail === "string" &&
    project.thumbnail.startsWith("http")
  ) {
    return project.thumbnail;
  }
  const name = (project.name || "").toLowerCase();
  if (
    name.includes("clinic") ||
    name.includes("care") ||
    name.includes("med") ||
    name.includes("health")
  ) {
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80";
  }
  if (
    name.includes("pixel") ||
    name.includes("code") ||
    name.includes("tech") ||
    name.includes("dev") ||
    name.includes("software")
  ) {
    return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
  }
  if (
    name.includes("nova") ||
    name.includes("studio") ||
    name.includes("design") ||
    name.includes("brand")
  ) {
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
  }
  if (
    name.includes("food") ||
    name.includes("cafe") ||
    name.includes("rest") ||
    name.includes("dining")
  ) {
    return "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80";
  }
  if (
    name.includes("gym") ||
    name.includes("fit") ||
    name.includes("sport") ||
    name.includes("iron")
  ) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  }
  if (
    name.includes("home") ||
    name.includes("estate") ||
    name.includes("realty") ||
    name.includes("house")
  ) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
  }

  const str = project.id || project.name || "default";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_THUMBNAILS[hash % FALLBACK_THUMBNAILS.length];
}

function getProjectHeadline(project: any): string {
  if (project.headline) return project.headline;
  if (project.description && project.description.trim().length > 0) {
    return project.description;
  }
  const name = (project.name || "").toLowerCase();
  if (name.includes("clinic") || name.includes("care")) {
    return "Compassionate healthcare & modern medical consultations";
  }
  if (name.includes("pixel") || name.includes("code")) {
    return "Engineering next-generation digital products & platforms";
  }
  if (name.includes("nova") || name.includes("studio")) {
    return "Design that makes brands unforgettable";
  }
  return `${project.name || "Modern Website"} · Crafted with speed`;
}

export function MyProjects({
  title = "My Projects",
  subtitle = "Manage all your website projects in one place.",
  showOnlyFavorites = false,
  showOnlyTrashed = false,
  hideCreateAction = false,
}: MyProjectsProps) {
  const { user } = useAuth();
  const { projects, loading, error, refresh } = useCloudProjects();
  const loadCloudProject = useBuilder((s) => s.loadCloudProject);
  const projectsMap = useBuilder((s) => s.projects);
  const localProjects = useMemo(() => Object.values(projectsMap), [projectsMap]);
  const newProject = useBuilder((s) => s.newProject);
  const currentProjectId = useBuilder((s) => s.currentProjectId);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest" as "newest" | "oldest" | "az" | "recent");
  const [localProjectsState, setLocalProjectsState] = useState<any[]>([]);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"move-to-trash" | "delete-forever">("move-to-trash");
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid" as "grid" | "list");
  const [statusFilter, setStatusFilter] = useState("all" as "all" | "published" | "draft" | "private");
  const [createOpen, setCreateOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [animatingFavoriteId, setAnimatingFavoriteId] = useState<string | null>(null);
  const setShowProjectDashboard = useBuilder((s) => s.setShowProjectDashboard);
  const { deleteExistingProject } = useProjects();

  const requireExportAuth = useRequireAuth("export");
  const requirePublishAuth = useRequireAuth("publish");
  const requirePreviewAuth = useRequireAuth("preview");

  const allProjects = useMemo(() => {
    if (user) {
      return localProjectsState;
    }
    return localProjects;
  }, [user, localProjectsState, localProjects]);

  useEffect(() => {
    if (user) {
      setLocalProjectsState(projects);
    }
  }, [user, projects]);

  async function handleRenameSave() {
    if (!activeProject) return;
    try {
      if (user) {
        await updateCloudProject(activeProject.id, { name: renameValue });
        setLocalProjectsState((prev: any[]) =>
          prev.map((p) => (p.id === activeProject.id ? { ...p, name: renameValue } : p))
        );
        refresh();
      } else {
        const builderState = useBuilder.getState();
        const project = builderState.projects[activeProject.id];
        if (project) {
          builderState.renameProject(activeProject.id, renameValue);
          setLocalProjectsState((prev: any[]) =>
            prev.map((p) => (p.id === activeProject.id ? { ...p, name: renameValue } : p))
          );
        }
      }
      toast.success("Project renamed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename project");
    } finally {
      setRenameOpen(false);
      setActiveProject(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!activeProject) return;
    setDeleteLoading(true);

    try {
      if (user) {
        if (deleteMode === "delete-forever") {
          await deleteExistingProject(activeProject.id);
          setLocalProjectsState((prev: any[]) => prev.filter((p) => p.id !== activeProject.id));
          toast.success("Project permanently deleted");
        } else {
          const now = Date.now();
          await updateCloudProject(activeProject.id, { status: "trashed", updatedAt: now });
          setLocalProjectsState((prev: any[]) =>
            prev.map((p) =>
              p.id === activeProject.id ? { ...p, status: "trashed", updatedAt: now } : p
            )
          );
          useCloudProjectsStore.getState().refreshProjects();

          if (currentProjectId === activeProject.id) {
            navigate({ to: "/dashboard" as never });
          }

          toast.success("Project moved to Trash");
        }
      } else {
        const builderState = useBuilder.getState();
        if (deleteMode === "delete-forever") {
          builderState.deleteProject(activeProject.id);
          setLocalProjectsState((prev: any[]) => prev.filter((p) => p.id !== activeProject.id));
          toast.success("Project permanently deleted");
        } else {
          const now = Date.now();
          builderState.updateProjectStatus?.(activeProject.id, "trashed", now);
          setLocalProjectsState((prev: any[]) =>
            prev.map((p) =>
              p.id === activeProject.id ? { ...p, status: "trashed", updatedAt: now } : p
            )
          );
          toast.success("Project moved to Trash");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        deleteMode === "delete-forever"
          ? "Failed to delete project permanently. Please try again."
          : "Failed to move project to Trash. Please try again."
      );
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
      setActiveProject(null);
      setDeleteMode("move-to-trash");
    }
  }

  function slugifyName(name: string) {
    return (
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "project"
    );
  }

  async function handleDuplicateProject(projectRecord: any) {
    try {
      const builderState = useBuilder.getState();
      const localProject = builderState.projects[projectRecord.id];

      if (localProject) {
        const newId = nanoid(8);
        const newName = `${localProject.name || "Untitled"} (copy)`;
        const now = Date.now();
        const copy = {
          ...JSON.parse(JSON.stringify(localProject)),
          id: newId,
          name: newName,
          createdAt: now,
          updatedAt: now,
        };
        builderState.duplicateProject(projectRecord.id);

        if (user) {
          await saveBuilderProject(copy);
          await createCloudProject({
            id: newId,
            name: newName,
            templateId: projectRecord.templateId || null,
            thumbnail: projectRecord.thumbnail || "",
            description: projectRecord.description || "",
            favorite: false,
            status: projectRecord.status || "draft",
            isPublic: projectRecord.isPublic || false,
            createdAt: now,
            updatedAt: now,
            pages: copy.pages.map((p: any) => p.slug),
          });
          refresh();
        }

        toast.success("Project duplicated successfully");
        return;
      }

      if (!user) {
        toast.error("Please sign in to duplicate cloud projects");
        return;
      }

      const fullProject = await getBuilderProject(projectRecord.id);
      if (!fullProject) {
        toast.error("Could not load project to duplicate");
        return;
      }

      const newId = nanoid(8);
      const newName = `${fullProject.name || "Untitled"} (copy)`;
      const now = Date.now();

      const duplicatedProject = {
        ...fullProject,
        id: newId,
        name: newName,
        createdAt: now,
        updatedAt: now,
      };

      await saveBuilderProject(duplicatedProject);

      await createCloudProject({
        id: newId,
        name: newName,
        templateId: projectRecord.templateId || null,
        thumbnail: projectRecord.thumbnail || "",
        description: projectRecord.description || "",
        favorite: false,
        status: projectRecord.status || "draft",
        isPublic: projectRecord.isPublic || false,
        createdAt: now,
        updatedAt: now,
        pages: duplicatedProject.pages.map((p: any) => p.slug),
      });

      setLocalProjectsState((prev: any[]) => [
        {
          ...projectRecord,
          id: newId,
          name: newName,
          createdAt: now,
          updatedAt: now,
          favorite: false,
        },
        ...(prev || []),
      ]);
      refresh();

      toast.success("Project duplicated successfully");
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error("Failed to duplicate project. Please try again.");
    }
  }

  async function handlePreviewProject(projectId: string) {
    await requirePreviewAuth(async () => {
      const builderState = useBuilder.getState();
      const localProject = builderState.projects[projectId];

      if (localProject) {
        const project = localProject;
        const currentPage =
          project.pages.find((p: Page) => p.id === project.currentPageId) || project.pages[0];
        if (!currentPage) {
          toast.error("Preview failed: No page available for preview");
          return;
        }

        // Persist to preview storage keys
        try {
          const previewStr = JSON.stringify({
            project,
            pageId: currentPage.id,
            timestamp: Date.now(),
          });
          localStorage.setItem(`wto-preview-${project.id}`, previewStr);
          localStorage.setItem("wto-preview-latest", previewStr);
          sessionStorage.setItem(`wto-preview-${project.id}`, previewStr);
          sessionStorage.setItem("wto-preview-latest", previewStr);
        } catch {}

        const previewSlug = `${slugifyName(project.name)}-${project.id}`;
        const previewUrl = `${window.location.origin}/demo/${encodeURIComponent(
          previewSlug
        )}?page=${encodeURIComponent(currentPage.slug)}`;

        const payload = {
          __lovablePreviewPayload: true,
          projectId: project.id,
          project,
          pageId: currentPage.id,
        };

        try {
          const bc = new BroadcastChannel("wto-builder-preview");
          bc.postMessage(payload);
          bc.close();
        } catch {}

        const previewWindow = window.open(previewUrl, "_blank");
        if (!previewWindow) {
          toast.error("Preview failed: Unable to open preview window");
          return;
        }

        const sendPayload = () => {
          try {
            previewWindow.postMessage(payload, "*");
          } catch {}
        };
        sendPayload();

        const postInterval = window.setInterval(() => {
          if (previewWindow.closed) {
            window.clearInterval(postInterval);
            return;
          }
          sendPayload();
        }, 200);
        window.setTimeout(() => window.clearInterval(postInterval), 3000);
        previewWindow.focus();
        toast.success("Preview opened", { duration: 2000, position: "top-center" });
        return;
      }

      if (user) {
        await loadCloudProject(projectId);
        const project = useBuilder.getState().projects[projectId];
        if (!project) {
          toast.error("Preview failed: Unable to load project for preview");
          return;
        }

        const currentPage =
          project.pages.find((p: Page) => p.id === project.currentPageId) || project.pages[0];
        if (!currentPage) {
          toast.error("Preview failed: No page available for preview");
          return;
        }

        // Persist to preview storage keys
        try {
          const previewStr = JSON.stringify({
            project,
            pageId: currentPage.id,
            timestamp: Date.now(),
          });
          localStorage.setItem(`wto-preview-${project.id}`, previewStr);
          localStorage.setItem("wto-preview-latest", previewStr);
          sessionStorage.setItem(`wto-preview-${project.id}`, previewStr);
          sessionStorage.setItem("wto-preview-latest", previewStr);
        } catch {}

        const previewSlug = `${slugifyName(project.name)}-${project.id}`;
        const previewUrl = `${window.location.origin}/demo/${encodeURIComponent(
          previewSlug
        )}?page=${encodeURIComponent(currentPage.slug)}`;

        const payload = {
          __lovablePreviewPayload: true,
          projectId: project.id,
          project,
          pageId: currentPage.id,
        };

        try {
          const bc = new BroadcastChannel("wto-builder-preview");
          bc.postMessage(payload);
          bc.close();
        } catch {}

        const previewWindow = window.open(previewUrl, "_blank");
        if (!previewWindow) {
          toast.error("Preview failed: Unable to open preview window");
          return;
        }

        const sendPayload = () => {
          try {
            previewWindow.postMessage(payload, "*");
          } catch {}
        };
        sendPayload();

        const postInterval = window.setInterval(() => {
          if (previewWindow.closed) {
            window.clearInterval(postInterval);
            return;
          }
          sendPayload();
        }, 200);
        window.setTimeout(() => window.clearInterval(postInterval), 3000);
        previewWindow.focus();
        toast.success("Preview opened", { duration: 2000, position: "top-center" });
      }
    });
  }

  async function handleOpenEditor(projectId: string) {
    const builderState = useBuilder.getState();
    const localProject = builderState.projects[projectId];
    if (localProject) {
      builderState.loadProject(projectId);
      setShowProjectDashboard(false);
      navigate({ to: "/editor/$projectId", params: { projectId } });
    } else if (user) {
      await loadCloudProject(projectId);
      navigate({ to: "/editor/$projectId", params: { projectId } });
    }
  }

  async function handleRestoreProject(projectRecord: any) {
    const now = Date.now();
    try {
      if (user) {
        await updateCloudProject(projectRecord.id, { status: "draft", updatedAt: now });
        setLocalProjectsState((prev: any[]) =>
          prev.map((p) => (p.id === projectRecord.id ? { ...p, status: "draft", updatedAt: now } : p))
        );
      } else {
        const builderState = useBuilder.getState();
        const project = builderState.projects[projectRecord.id];
        if (project) {
          builderState.updateProjectStatus?.(projectRecord.id, "draft", now);
          setLocalProjectsState((prev: any[]) =>
            prev.map((p) =>
              p.id === projectRecord.id ? { ...p, status: "draft", updatedAt: now } : p
            )
          );
        }
      }
      toast.success("Project restored successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore project. Please try again.");
    }
  }

  async function handleToggleFavorite(projectRecord: any) {
    const nextValue = !projectRecord.favorite;
    const projectId = projectRecord.id;

    setAnimatingFavoriteId(projectId);
    setLocalProjectsState((prev: any[]) =>
      prev.map((p) => (p.id === projectId ? { ...p, favorite: nextValue } : p))
    );

    try {
      if (user) {
        await updateCloudProject(projectId, { favorite: nextValue });
        refresh();
      } else {
        const builderState = useBuilder.getState();
        const project = builderState.projects[projectId];
        if (project) {
          builderState.updateProjectStatus?.(projectId, (project as any).status ?? "draft", Date.now());
        }
      }
      toast.success(nextValue ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      console.error(err);
      setLocalProjectsState((prev: any[]) =>
        prev.map((p) => (p.id === projectId ? { ...p, favorite: !nextValue } : p))
      );
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      window.setTimeout(() => {
        setAnimatingFavoriteId((currentId) => (currentId === projectId ? null : currentId));
      }, 180);
    }
  }

  async function handleExportProject(projectId: string) {
    const allowed = await requireExportAuth(async () => {
      setExportLoading(true);
      try {
        const builderState = useBuilder.getState();
        let project = builderState.projects[projectId];

        if (!project && user) {
          await loadCloudProject(projectId);
          project = useBuilder.getState().projects[projectId];
        }

        if (!project) {
          throw new Error("Unable to load project for export");
        }

        const exportData = await buildSiteExport(project);
        const zip = new JSZip();
        for (const file of exportData.files) {
          if (file.base64) {
            zip.file(file.path, file.base64, { base64: true });
          } else {
            zip.file(file.path, file.content);
          }
        }

        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.zip`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Project exported as HTML zip");
      } finally {
        setExportLoading(false);
      }
    });

    if (!allowed) return;
  }

  async function handleExportReactProject(id: string) {
    const allowed = await requireExportAuth(async () => {
      setExportLoading(true);
      try {
        const raw = await getBuilderProject(id);
        const project =
          typeof raw === "string"
            ? JSON.parse(raw)
            : raw && typeof raw === "object" && "pages" in raw
            ? raw
            : null;

        if (!project) {
          toast.error("Project data not found");
          return;
        }

        await exportProjectAsReactZip(project);
      } finally {
        setExportLoading(false);
      }
    });

    if (!allowed) return;
  }

  const filteredProjects = useMemo(() => {
    const search = q.trim().toLowerCase();
    let list = allProjects.filter((p: any) => {
      if (showOnlyTrashed) return p.status === "trashed";
      if (showOnlyFavorites) return p.favorite && p.status !== "trashed";
      return p.status !== "trashed";
    });

    if (search) {
      list = list.filter((p: any) => (p.name || "").toLowerCase().includes(search));
    }

    const byDate = (a: any, b: any, key = "updatedAt") => {
      const aVal = typeof a[key]?.toDate === "function" ? a[key].toDate().getTime() : Number(a[key] ?? 0);
      const bVal = typeof b[key]?.toDate === "function" ? b[key].toDate().getTime() : Number(b[key] ?? 0);
      return bVal - aVal;
    };

    list = list.slice().sort((a: any, b: any) => {
      const favoriteDiff = Number(Boolean(b.favorite)) - Number(Boolean(a.favorite));
      if (favoriteDiff !== 0) return favoriteDiff;

      switch (sort) {
        case "az":
          return (a.name || "").localeCompare(b.name || "");
        case "newest":
          return byDate(a, b, "createdAt");
        case "oldest":
          return -byDate(a, b, "createdAt");
        case "recent":
        default:
          return byDate(a, b, "updatedAt");
      }
    });

    if (statusFilter !== "all") {
      list = list.filter((p: any) => (p.status ?? "draft") === statusFilter);
    }

    return list;
  }, [allProjects, q, showOnlyFavorites, showOnlyTrashed, sort, statusFilter]);

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-white/[0.08] bg-[#151518] overflow-hidden"
            >
              <div className="h-6 bg-[#18181c] border-b border-white/[0.06]" />
              <div className="h-48 bg-white/[0.03]" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-28 bg-white/10 rounded" />
                <div className="h-4 w-44 bg-white/10 rounded" />
                <div className="h-3 w-32 bg-white/5 rounded" />
                <div className="pt-3 border-t border-white/[0.06] flex gap-2">
                  <div className="w-9 h-9 bg-white/10 rounded-xl" />
                  <div className="flex-1 h-9 bg-white/10 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200 shadow-sm">
          <div className="text-base font-bold text-rose-100">Unable to load projects</div>
          <p className="mt-1 text-sm text-rose-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6 min-h-screen text-[#f5f5f7]">
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* ================= HERO BANNER ================= */}
      <section className="relative rounded-[22px] bg-gradient-to-br from-[#17150f] via-[#141418] to-[#121215] border border-white/[0.07] p-8 overflow-hidden flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#ffc21a]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-xs font-bold mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a] animate-pulse" />
            {showOnlyTrashed
              ? `${allProjects.filter((p: any) => p.status === "trashed").length} Deleted Projects in Archive`
              : showOnlyFavorites
              ? `${allProjects.filter((p: any) => p.favorite && p.status !== "trashed").length} Starred Projects`
              : `${allProjects.filter((p: any) => p.status !== "trashed").length || 4} Websites in Workspace`}
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            {showOnlyTrashed ? (
              <>
                Trash <span className="text-[#ffc21a]">Archive</span>
              </>
            ) : showOnlyFavorites ? (
              <>
                Favorite <span className="text-[#ffc21a]">Projects</span>
              </>
            ) : (
              <>
                My <span className="text-[#ffc21a]">Projects</span>
              </>
            )}
          </h1>

          <p className="text-sm text-[#9a9aa3] leading-relaxed">
            {showOnlyTrashed
              ? "Deleted projects can be restored back to your workspace or permanently deleted at any time."
              : showOnlyFavorites
              ? "Quick access to all your starred website templates and active project drafts."
              : "Manage all your website projects in one place — edit in real time, export code, and publish instantly."}
          </p>
        </div>

        {/* Action buttons / metrics on right */}
        <div className="relative z-10 flex items-center gap-3 shrink-0 flex-wrap">
          {!hideCreateAction && !showOnlyFavorites && !showOnlyTrashed ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-lg shadow-[#ffc21a]/25 hover:opacity-95 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ New project</span>
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/templates" as never })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151518] border border-white/10 hover:border-white/20 text-white font-bold text-xs transition cursor-pointer"
              >
                <span>Browse templates</span>
              </button>
            </div>
          ) : showOnlyFavorites ? (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-center min-w-[70px]">
                <div className="text-base font-black text-[#ffc21a] leading-tight">
                  {allProjects.filter((p: any) => p.favorite && p.status !== "trashed").length}
                </div>
                <div className="text-[10px] text-[#9a9aa3] uppercase font-bold">Starred</div>
              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/dashboard/templates" as never })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-lg shadow-[#ffc21a]/25 hover:opacity-95 transition cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Browse templates</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-center min-w-[80px]">
                <div className="text-base font-black text-red-400 leading-tight">
                  {allProjects.filter((p: any) => p.status === "trashed").length}
                </div>
                <div className="text-[10px] text-[#9a9aa3] uppercase font-bold">In Trash</div>
              </div>
              {allProjects.filter((p: any) => p.status === "trashed").length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const trashed = allProjects.filter((p: any) => p.status === "trashed");
                    if (window.confirm("Permanently delete all items in trash? This cannot be undone.")) {
                      trashed.forEach((p: any) => {
                        try {
                          useBuilder.getState().deleteProject(p.id);
                        } catch {}
                      });
                      toast.success("Trash emptied");
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Empty trash</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================= TOOLBAR (SEARCH + FILTERS + VIEW SWITCHER) ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#151518] border border-white/[0.08] shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#18181c] border border-white/[0.08] focus-within:border-[#ffc21a]/50 rounded-xl px-3.5 py-2 w-full sm:w-[340px] transition shadow-sm">
          <Search className="w-4 h-4 text-[#6b6b74] shrink-0" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects by name..."
            className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#6b6b74] flex-1 min-w-0"
          />
          <kbd className="text-[10px] font-semibold text-[#6b6b74] border border-white/10 rounded px-1.5 py-0.5 shrink-0">
            ⌘K
          </kbd>
        </div>

        {/* Sort, Status & View Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="h-9 rounded-xl border border-white/[0.08] bg-[#18181c] px-3 text-xs text-white outline-none focus:border-[#ffc21a]/50 cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="az">Sort: A - Z</option>
            <option value="recent">Sort: Recently Edited</option>
          </select>

          <select
            aria-label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 rounded-xl border border-white/[0.08] bg-[#18181c] px-3 text-xs text-white outline-none focus:border-[#ffc21a]/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="private">Private</option>
          </select>

          <div className="inline-flex items-center rounded-xl border border-white/[0.08] bg-[#18181c] p-1 gap-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#ffc21a] text-[#1a1400]"
                  : "text-[#6b6b74] hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#ffc21a] text-[#1a1400]"
                  : "text-[#6b6b74] hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= RENAME DIALOG ================= */}
      <Dialog
        open={renameOpen}
        onOpenChange={(open) => {
          if (!open) {
            setRenameOpen(false);
            setActiveProject(null);
          }
        }}
      >
        <DialogContent className="bg-[#18181c] border border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-extrabold">Rename Project</DialogTitle>
            <DialogDescription className="text-xs text-[#9a9aa3]">
              Update this project's display title without changing its pages or content.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="e.g. Nova Studio Portfolio"
              className="bg-[#121215] border-white/10 text-white focus:border-[#ffc21a]/60 text-xs h-10 rounded-xl"
            />
          </div>
          <DialogFooter className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              className="text-[#9a9aa3] hover:text-white text-xs h-9 rounded-xl"
              onClick={() => {
                setRenameOpen(false);
                setActiveProject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs h-9 rounded-xl hover:opacity-95"
              onClick={handleRenameSave}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOpen(false);
            setActiveProject(null);
            setDeleteMode("move-to-trash");
          }
        }}
      >
        <AlertDialogContent className="bg-[#18181c] border border-white/10 text-white sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-base font-extrabold">
              {deleteMode === "delete-forever"
                ? "Permanently delete project?"
                : "Move project to Trash?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#9a9aa3]">
              {deleteMode === "delete-forever"
                ? "Are you sure you want to permanently delete this project? This action cannot be undone."
                : "This project will be moved to Trash and can be restored anytime."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
            <AlertDialogCancel
              className="bg-[#232329] border-white/10 text-[#9a9aa3] hover:text-white text-xs h-9 rounded-xl"
              onClick={() => {
                setDeleteOpen(false);
                setActiveProject(null);
                setDeleteMode("move-to-trash");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className={`text-xs h-9 rounded-xl font-bold ${
                deleteMode === "delete-forever"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
              }`}
            >
              {deleteLoading
                ? deleteMode === "delete-forever"
                  ? "Deleting…"
                  : "Moving…"
                : deleteMode === "delete-forever"
                ? "Delete Forever"
                : "Move to Trash"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ================= EMPTY STATE ================= */}
      {!filteredProjects.length ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#151518] p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffc21a]/10 border border-[#ffc21a]/20 text-[#ffc21a]">
            {showOnlyTrashed ? (
              <Trash2 className="h-8 w-8" />
            ) : showOnlyFavorites ? (
              <Heart className="h-8 w-8" />
            ) : (
              <Layers className="h-8 w-8" />
            )}
          </div>

          <h3 className="mt-5 text-xl font-extrabold text-white">
            {showOnlyTrashed
              ? "Trash is empty"
              : showOnlyFavorites
              ? "No favorite projects yet"
              : "No projects created yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs text-[#9a9aa3] leading-relaxed">
            {showOnlyTrashed
              ? "Projects moved to trash will appear here until restored or permanently deleted."
              : showOnlyFavorites
              ? "Star your favorite projects using the heart icon on any card to access them quickly here."
              : "Create your first project to begin building responsive websites with drag-and-drop widgets and custom templates."}
          </p>

          {!showOnlyFavorites && !showOnlyTrashed ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create New Project</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : viewMode === "grid" ? (
        /* ================= GRID VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((projectRecord: any) => {
            const pagesCount = Array.isArray(projectRecord.pages)
              ? projectRecord.pages.length
              : 0;
            const categoryTag = projectRecord.templateId
              ? projectRecord.templateId.replace(/[-_]/g, " ").toUpperCase()
              : "CUSTOM TEMPLATE";
            const headline = getProjectHeadline(projectRecord);
            const thumbUrl = getProjectThumbnail(projectRecord);

            return (
              <div
                key={projectRecord.id}
                className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg"
              >
                {/* Mock Browser Chrome + Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-[#0d0d10]">
                  {/* Browser Chrome Header */}
                  <div className="h-6 bg-[#18181c] border-b border-white/[0.06] flex items-center px-3 gap-1.5 z-10 relative">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="ml-auto w-14 h-2 rounded-full bg-white/10" />
                  </div>

                  <img
                    src={thumbUrl}
                    alt={projectRecord.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Headline Overlay */}
                  <div className="absolute bottom-3 left-3 right-12">
                    <p className="text-xs font-bold text-white leading-tight drop-shadow truncate">
                      {headline}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute left-3 top-9">
                    {showOnlyTrashed ? (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 font-black text-[10px] shadow">
                        ● Trashed
                      </span>
                    ) : projectRecord.status === "published" ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#22c55e] text-[#04130d] font-black text-[10px] shadow">
                        ● Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-[#ffc21a] text-[#1a1400] font-black text-[10px] shadow">
                        ● Draft
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart / Restore button */}
                  {!showOnlyTrashed ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleToggleFavorite(projectRecord);
                      }}
                      className="absolute right-3 top-9 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center transition cursor-pointer"
                      title={projectRecord.favorite ? "Favorited" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          projectRecord.favorite
                            ? "fill-[#ffc21a] text-[#ffc21a]"
                            : "text-white"
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleRestoreProject(projectRecord);
                      }}
                      className="absolute right-3 top-9 px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1 transition cursor-pointer"
                      title="Restore project"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase truncate">
                      {categoryTag} · {pagesCount} {pagesCount === 1 ? "PAGE" : "PAGES"}
                    </p>
                    <h3 className="font-extrabold text-white text-base group-hover:text-[#ffc21a] transition truncate mt-0.5">
                      {projectRecord.name || "Untitled Project"}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6b6b74]">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>
                        {pagesCount} {pagesCount === 1 ? "Page" : "Pages"}
                      </span>
                    </span>
                    <ClientOnly>
                      <span>Edited {formatUpdatedAt(projectRecord.updatedAt)}</span>
                    </ClientOnly>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => handlePreviewProject(projectRecord.id)}
                      className="w-9 h-9 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer shrink-0"
                      title="Preview site"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {showOnlyTrashed ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRestoreProject(projectRecord)}
                          className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore project →</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveProject(projectRecord);
                            setDeleteMode("delete-forever");
                            setDeleteOpen(true);
                          }}
                          className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Permanently delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit Project Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditor(projectRecord.id)}
                          className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Edit project →</span>
                        </button>

                        {/* More Options Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="w-9 h-9 rounded-xl bg-[#1f1f25] border border-white/10 hover:border-white/20 text-[#9a9aa3] hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                              title="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 bg-[#18181c] border border-white/10 text-white shadow-2xl rounded-xl p-1"
                          >
                            <DropdownMenuItem
                              className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                              onSelect={() => {
                                setActiveProject(projectRecord);
                                setRenameValue(projectRecord.name || "");
                                setRenameOpen(true);
                              }}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#ffc21a]" />
                              <span>Rename</span>
                            </DropdownMenuItem>

                            {projectRecord.status !== "published" && (
                              <DropdownMenuItem
                                className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                                onSelect={async () => {
                                  const allowed = await requirePublishAuth(async () => {
                                    try {
                                      if (user) {
                                        await updateCloudProject(projectRecord.id, {
                                          status: "published",
                                        });
                                        setLocalProjectsState((prev: any[]) =>
                                          prev.map((p) =>
                                            p.id === projectRecord.id
                                              ? { ...p, status: "published" }
                                              : p
                                          )
                                        );
                                      } else {
                                        const builderState = useBuilder.getState();
                                        const project = builderState.projects[projectRecord.id];
                                        if (project) {
                                          builderState.publishProject(projectRecord.id);
                                          setLocalProjectsState((prev: any[]) =>
                                            prev.map((p) =>
                                              p.id === projectRecord.id
                                              ? { ...p, status: "published" }
                                              : p
                                            )
                                          );
                                        }
                                      }
                                      toast.success("Project published");
                                    } catch (err) {
                                      console.error(err);
                                      toast.error("Failed to publish");
                                    }
                                  });
                                  if (!allowed) return;
                                }}
                              >
                                <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
                                <span>Publish Website</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                              onSelect={() => handleDuplicateProject(projectRecord)}
                            >
                              <Copy className="w-3.5 h-3.5 text-sky-400" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                              onSelect={() => handleExportProject(projectRecord.id)}
                            >
                              <Download className="w-3.5 h-3.5 text-amber-400" />
                              <span>Download HTML</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                              onSelect={() => handleExportReactProject(projectRecord.id)}
                            >
                              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Download React Version</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="hover:bg-red-500/20 text-red-400 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                              onSelect={() => {
                                setActiveProject(projectRecord);
                                setDeleteMode("move-to-trash");
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              <span>Move to Trash</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New Project Dashed Card */}
          {!showOnlyFavorites && !showOnlyTrashed && (
            <div
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl border-2 border-dashed border-white/10 hover:border-[#ffc21a]/50 bg-[#151518]/50 hover:bg-[#151518] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 group cursor-pointer min-h-[350px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ffc21a]/10 border border-[#ffc21a]/20 group-hover:bg-[#ffc21a] group-hover:text-[#1a1400] text-[#ffc21a] flex items-center justify-center transition-all duration-300 shadow-lg shadow-[#ffc21a]/5">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-white group-hover:text-[#ffc21a] transition">
                Create New Project
              </h3>
              <p className="mt-1 text-xs text-[#9a9aa3] max-w-[200px]">
                Start fresh from a blank canvas or choose a curated template.
              </p>
              <button
                type="button"
                className="mt-5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 group-hover:opacity-95 transition pointer-events-none"
              >
                + Start Building
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ================= LIST VIEW ================= */
        <div className="space-y-3">
          {filteredProjects.map((projectRecord: any) => {
            const pagesCount = Array.isArray(projectRecord.pages)
              ? projectRecord.pages.length
              : 0;
            const categoryTag = projectRecord.templateId
              ? projectRecord.templateId.replace(/[-_]/g, " ").toUpperCase()
              : "CUSTOM";
            const thumbUrl = getProjectThumbnail(projectRecord);

            return (
              <div
                key={projectRecord.id}
                className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail with mini chrome */}
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#0d0d10]">
                    <div className="h-3.5 bg-[#18181c] border-b border-white/[0.06] flex items-center px-1.5 gap-1">
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                    </div>
                    <img
                      src={thumbUrl}
                      alt={projectRecord.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-sm group-hover:text-[#ffc21a] transition truncate">
                        {projectRecord.name || "Untitled Project"}
                      </h3>
                      {projectRecord.favorite && !showOnlyTrashed && (
                        <Heart className="w-3.5 h-3.5 fill-[#ffc21a] text-[#ffc21a] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6b6b74]">
                      <span className="uppercase tracking-wider font-semibold">
                        {categoryTag}
                      </span>
                      <span>·</span>
                      <span>
                        {pagesCount} Page{pagesCount === 1 ? "" : "s"}
                      </span>
                      <span>·</span>
                      <ClientOnly>
                        <span>Edited {formatUpdatedAt(projectRecord.updatedAt)}</span>
                      </ClientOnly>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Status Badge */}
                  {showOnlyTrashed ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 font-black text-[10px]">
                      Trashed
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        projectRecord.status === "published"
                          ? "bg-[#22c55e] text-[#04130d]"
                          : "bg-[#ffc21a] text-[#1a1400]"
                      }`}
                    >
                      {projectRecord.status === "published" ? "Published" : "Draft"}
                    </span>
                  )}

                  {/* Eye Preview */}
                  <button
                    type="button"
                    onClick={() => handlePreviewProject(projectRecord.id)}
                    className="w-8 h-8 rounded-lg bg-[#1f1f25] border border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-[#ffc21a] flex items-center justify-center transition cursor-pointer"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {/* Primary Action */}
                  {showOnlyTrashed ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRestoreProject(projectRecord)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs hover:opacity-95 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProject(projectRecord);
                          setDeleteMode("delete-forever");
                          setDeleteOpen(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition cursor-pointer"
                        title="Delete Forever"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditor(projectRecord.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs hover:opacity-95 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Edit →</span>
                      </button>

                      {/* Dropdown Options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#1f1f25] border border-white/10 hover:border-white/20 text-[#9a9aa3] hover:text-white flex items-center justify-center transition cursor-pointer"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 bg-[#18181c] border border-white/10 text-white shadow-2xl rounded-xl p-1"
                        >
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                            onSelect={() => {
                              setActiveProject(projectRecord);
                              setRenameValue(projectRecord.name || "");
                              setRenameOpen(true);
                            }}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#ffc21a]" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                            onSelect={() => handleDuplicateProject(projectRecord)}
                          >
                            <Copy className="w-3.5 h-3.5 text-sky-400" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                            onSelect={() => handleExportProject(projectRecord.id)}
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400" />
                            <span>Download HTML</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                            onSelect={() => handleExportReactProject(projectRecord.id)}
                          >
                            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Download React Version</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-red-500/20 text-red-400 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2"
                            onSelect={() => {
                              setActiveProject(projectRecord);
                              setDeleteMode("move-to-trash");
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Move to Trash</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
