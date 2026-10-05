import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "@/firebase/firebase";
import { db } from "@/firebase/firebase";
import { sanitizeForFirestore } from "./firestore";
import { createWidgetInstance, type WidgetInstance } from "@/components/builder/widgets/widgetRegistry";
import type { Page, PageSection } from "@/lib/builder/store";
import { useBuilder } from "@/lib/builder/store";
import { nanoid } from "nanoid";
import { getWidgetRegistration, getWidgetBootstrapExport } from "@/components/builder/widgets/widgetRegistry";

export type TemplateStatus = "draft" | "upcoming" | "published" | "archived";

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  status: TemplateStatus;
  thumbnail: string | null;
  previewImage?: string | null;
  featured?: boolean;
  isNew?: boolean;
  sortOrder?: number;
  widgets: WidgetInstance[];
  pages?: Page[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTemplateInput {
  name: string;
  slug: string;
  category: string;
  description?: string;
  status?: TemplateStatus;
  thumbnail?: string | null | undefined;
  previewImage?: string | null | undefined;
  featured?: boolean;
  isNew?: boolean;
  sortOrder?: number;
  widgets: WidgetInstance[];
  pages?: Page[];
}

export interface UpdateTemplateInput {
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  status?: TemplateStatus;
  thumbnail?: string | null | undefined;
  previewImage?: string | null | undefined;
  featured?: boolean;
  isNew?: boolean;
  sortOrder?: number;
  widgets?: WidgetInstance[];
  pages?: Page[];
}

function templatesCollectionRef() {
  return collection(db, "templates");
}

function templateDocRef(templateId: string) {
  return doc(db, "templates", templateId);
}

function mapTemplate(snapshot: { id: string; data(): Record<string, unknown> }): Template {
  const data = snapshot.data();
  const widgets = (data.widgets ?? []) as WidgetInstance[];
  const pages = Array.isArray(data.pages) ? (data.pages as Page[]) : undefined;
  const rawStatus = String(data.status ?? "draft");
  const status: TemplateStatus =
    rawStatus === "published"
      ? "published"
      : rawStatus === "upcoming"
        ? "upcoming"
        : rawStatus === "archived"
          ? "archived"
          : "draft";

  return {
    id: snapshot.id,
    name: String(data.name ?? ""),
    slug: String(data.slug ?? ""),
    category: String(data.category ?? ""),
    description: data.description ? String(data.description) : undefined,
    status,
    thumbnail: data.thumbnail ? String(data.thumbnail) : null,
    previewImage: data.previewImage ? String(data.previewImage) : null,
    featured: Boolean(data.featured),
    isNew: Boolean(data.isNew),
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : undefined,
    widgets,
    pages,
    createdBy: String(data.createdBy ?? ""),
    createdAt: data.createdAt && typeof (data.createdAt as any).toDate === "function"
      ? (data.createdAt as any).toDate()
      : new Date((data.createdAt as string | number) ?? Date.now()),
    updatedAt: data.updatedAt && typeof (data.updatedAt as any).toDate === "function"
      ? (data.updatedAt as any).toDate()
      : new Date((data.updatedAt as string | number) ?? Date.now()),
  };
}

import { PREBUILT_TEMPLATES } from "./templateSeeds";

export async function seedPrebuiltTemplatesToFirestore(): Promise<number> {
  try {
    let count = 0;
    for (const template of PREBUILT_TEMPLATES) {
      const cleaned = sanitizeForFirestore(template);
      if (cleaned && typeof cleaned === "object") {
        await setDoc(templateDocRef(template.id), {
          ...(cleaned as Record<string, unknown>),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
        count++;
      }
    }
    return count;
  } catch (err: any) {
    console.error("[Templates] seedPrebuiltTemplatesToFirestore error:", err);
    throw err;
  }
}

export async function getTemplate(templateId: string): Promise<Template | null> {
  try {
    const snapshot = await getDoc(templateDocRef(templateId));
    if (snapshot.exists()) {
      return mapTemplate(snapshot);
    }
    const col = templatesCollectionRef();
    const qSnap = await getDocs(query(col, where("slug", "==", templateId)));
    if (!qSnap.empty) {
      return mapTemplate(qSnap.docs[0]);
    }
    const seed = PREBUILT_TEMPLATES.find((p) => p.id === templateId || p.slug === templateId);
    return seed ?? null;
  } catch (err: any) {
    const seed = PREBUILT_TEMPLATES.find((p) => p.id === templateId || p.slug === templateId);
    return seed ?? null;
  }
}

export async function getPublishedTemplates(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);
    const firestoreTemplates: Template[] = snapshot.docs.map(mapTemplate);

    const firestoreIds = new Set(firestoreTemplates.map((t) => t.id));
    const merged = [...firestoreTemplates];

    for (const prebuilt of PREBUILT_TEMPLATES) {
      if (!firestoreIds.has(prebuilt.id)) {
        merged.push(prebuilt);
      }
    }

    return merged
      .filter((t) => t.status === "published")
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  } catch (err: any) {
    return PREBUILT_TEMPLATES.filter((t) => t.status === "published");
  }
}

export async function getUpcomingTemplates(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);
    const firestoreTemplates: Template[] = snapshot.docs.map(mapTemplate);

    const firestoreIds = new Set(firestoreTemplates.map((t) => t.id));
    const merged = [...firestoreTemplates];

    for (const prebuilt of PREBUILT_TEMPLATES) {
      if (!firestoreIds.has(prebuilt.id)) {
        merged.push(prebuilt);
      }
    }

    return merged.filter((t) => t.status === "upcoming");
  } catch {
    return PREBUILT_TEMPLATES.filter((t) => t.status === "upcoming");
  }
}

export async function getTemplatesForSuperAdmin(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);
    const firestoreTemplates: Template[] = snapshot.docs.map(mapTemplate);

    const firestoreIds = new Set(firestoreTemplates.map((t) => t.id));
    const merged = [...firestoreTemplates];

    for (const prebuilt of PREBUILT_TEMPLATES) {
      if (!firestoreIds.has(prebuilt.id)) {
        merged.push(prebuilt);
      }
    }

    return merged;
  } catch (err: any) {
    return [...PREBUILT_TEMPLATES];
  }
}

export async function listTemplates(status?: TemplateStatus): Promise<Template[]> {
  const all = await getTemplatesForSuperAdmin();
  if (!status) return all;
  return all.filter((t) => t.status === status);
}

/**
 * Creates an independent user project from a template.
 * Clones all pages and widgets with brand new unique IDs so the master template
 * is NEVER modified.
 */
export function createProjectFromTemplate(tpl: Template, customName?: string): string {
  const store = useBuilder.getState();
  const projectName = customName || tpl.name;

  // 1. Create a fresh project in the builder store
  const projectId = store.newProject(projectName);
  const current = store.currentProject();
  if (!current) throw new Error("Failed to initialize user project");

  const page = current.pages[0];

  // 2. Clone pages or widgets with fresh IDs
  if (tpl.pages && tpl.pages.length > 0) {
    const clonedPages = tpl.pages.map((p) => {
      const sections: PageSection[] = (p.sections || []).map((sec) => {
        const widget = sec.widgetInstance;
        const clonedWidget = widget
          ? {
              ...widget,
              id: `${widget.type}-${Math.random().toString(36).slice(2, 8)}`,
            }
          : undefined;
        const reg = clonedWidget ? getWidgetRegistration(clonedWidget.type) : null;
        let html = sec.html;
        if (clonedWidget) {
          try {
            html = getWidgetBootstrapExport(clonedWidget.type, clonedWidget);
          } catch {
            html = sec.html;
          }
        }
        return {
          ...sec,
          id: nanoid(10),
          name: reg?.displayName || sec.name,
          html,
          widgetInstance: clonedWidget,
          animation: { type: "fade-up" as const, duration: 700, delay: 0 },
        };
      });
      return {
        ...p,
        id: nanoid(8),
        sections,
      };
    });

    useBuilder.setState((s) => ({
      projects: {
        ...s.projects,
        [current.id]: {
          ...current,
          pages: clonedPages,
          currentPageId: clonedPages[0]?.id || current.currentPageId,
          selectedTemplateId: tpl.id,
          updatedAt: Date.now(),
        },
      },
    }));
  } else if (tpl.widgets && tpl.widgets.length > 0) {
    const sections: PageSection[] = (tpl.widgets || []).map((widget) => {
      const reg = getWidgetRegistration(widget.type);
      const clonedWidget = {
        ...widget,
        id: `${widget.type}-${Math.random().toString(36).slice(2, 8)}`,
      };
      let html = "";
      try {
        html = getWidgetBootstrapExport(clonedWidget.type, clonedWidget);
      } catch {
        html = `<section class="py-5"><div class="container text-center">${reg?.displayName ?? widget.type}</div></section>`;
      }
      return {
        id: nanoid(10),
        templateId: "",
        name: reg?.displayName || widget.type,
        html,
        widgetInstance: clonedWidget as any,
        animation: { type: "fade-up" as const, duration: 700, delay: 0 },
      };
    });

    const updatedPages = current.pages.map((p) =>
      p.id === page.id ? { ...p, sections } : p
    );

    useBuilder.setState((s) => ({
      projects: {
        ...s.projects,
        [current.id]: {
          ...current,
          pages: updatedPages,
          selectedTemplateId: tpl.id,
          updatedAt: Date.now(),
        },
      },
    }));
  }

  store.persist();
  const saved = useBuilder.getState().currentProject();
  if (saved) {
    void useBuilder.getState().saveProjectToCloud().catch(() => {});
  }
  return current.id;
}

export async function createTemplate(input: CreateTemplateInput, uid: string): Promise<Template> {
  const id = doc(templatesCollectionRef()).id;
  const now = new Date();
  const template: Template = {
    id,
    name: input.name,
    slug: input.slug,
    category: input.category,
    status: "draft",
    thumbnail: input.thumbnail ?? null,
    widgets: input.widgets,
    pages: input.pages,
    createdBy: uid,
    createdAt: now,
    updatedAt: now,
  };

  const cleaned = sanitizeForFirestore(template);
  if (!cleaned || typeof cleaned !== "object") {
    throw new Error("Template configuration is invalid and cannot be saved.");
  }

  await setDoc(templateDocRef(id), {
    ...(cleaned as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return template;
}

export async function updateTemplate(templateId: string, patch: UpdateTemplateInput): Promise<void> {
  const cleaned = sanitizeForFirestore(patch);
  if (!cleaned || typeof cleaned !== "object") {
    throw new Error("Template patch is invalid and cannot be saved.");
  }

  const docRef = templateDocRef(templateId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    const seed = PREBUILT_TEMPLATES.find((p) => p.id === templateId || p.slug === templateId);
    if (seed) {
      const merged = { ...seed, ...patch, updatedAt: new Date() };
      const cleanedMerged = sanitizeForFirestore(merged);
      await setDoc(docRef, {
        ...(cleanedMerged as Record<string, unknown>),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }
  }

  await updateDoc(docRef, {
    ...(cleaned as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTemplate(templateId: string): Promise<void> {
  try {
    await deleteDoc(templateDocRef(templateId));
  } catch (err) {
    console.warn("[Templates] deleteTemplate failed:", err);
  }
}

export async function setTemplateStatus(templateId: string, status: TemplateStatus): Promise<void> {
  const docRef = templateDocRef(templateId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    const seed = PREBUILT_TEMPLATES.find((p) => p.id === templateId || p.slug === templateId);
    if (seed) {
      const merged = { ...seed, status, updatedAt: new Date() };
      const cleanedMerged = sanitizeForFirestore(merged);
      await setDoc(docRef, {
        ...(cleanedMerged as Record<string, unknown>),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return;
    }
  }

  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function duplicateTemplate(templateId: string): Promise<Template> {
  const source = await getTemplate(templateId);
  if (!source) {
    throw new Error("Template not found");
  }

  const id = doc(templatesCollectionRef()).id;
  const now = new Date();
  const duplicate: Template = {
    ...source,
    id,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy-${id.slice(0, 6)}`,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  const cleaned = sanitizeForFirestore(duplicate);
  if (!cleaned || typeof cleaned !== "object") {
    throw new Error("Template configuration is invalid and cannot be duplicated.");
  }

  await setDoc(templateDocRef(id), {
    ...(cleaned as Record<string, unknown>),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return duplicate;
}

export async function saveAsTemplate(input: {
  name: string;
  slug: string;
  category: string;
  widgets?: WidgetInstance[];
  pages?: Page[];
  thumbnail?: string | null | undefined;
  uid: string;
  existingTemplateId?: string;
  widgetType?: string;
  config?: Record<string, unknown>;
}): Promise<Template> {
  const { name, slug, category, pages, uid, existingTemplateId } = input;
  let widgets = input.widgets || [];
  if (widgets.length === 0 && input.widgetType) {
    widgets = [
      createWidgetInstance(input.widgetType, {
        id: `${input.widgetType}-${Math.random().toString(36).substring(2, 9)}`,
        ...(input.config || {}),
      }),
    ];
  }
  const thumbnail = input.thumbnail ?? null;

  if (existingTemplateId) {
    await updateTemplate(existingTemplateId, {
      name,
      slug,
      category,
      widgets,
      pages,
      thumbnail,
    });
    const updated = await getTemplate(existingTemplateId);
    if (!updated) throw new Error("Failed to load updated template");
    return updated;
  }

  return createTemplate(
    {
      name,
      slug,
      category,
      widgets,
      pages,
      thumbnail,
    },
    uid
  );
}
