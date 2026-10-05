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
import type { Page } from "@/lib/builder/store";

export type TemplateStatus = "draft" | "published";

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: TemplateStatus;
  thumbnail: string | null;
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
  thumbnail?: string | null | undefined;
  widgets: WidgetInstance[];
  pages?: Page[];
}

export interface UpdateTemplateInput {
  name?: string;
  slug?: string;
  category?: string;
  status?: TemplateStatus;
  thumbnail?: string | null | undefined;
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
  return {
    id: snapshot.id,
    name: String(data.name ?? ""),
    slug: String(data.slug ?? ""),
    category: String(data.category ?? ""),
    status: data.status === "published" ? "published" : "draft",
    thumbnail: data.thumbnail ?? null,
    widgets,
    pages,
    createdBy: String(data.createdBy ?? ""),
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date((data.createdAt as string | number) ?? Date.now()),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date((data.updatedAt as string | number) ?? Date.now()),
  };
}

import { PREBUILT_TEMPLATES } from "./templateSeeds";

export async function seedPrebuiltTemplatesToFirestore(): Promise<number> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);
    const validIds = new Set(PREBUILT_TEMPLATES.map((p) => p.id));

    // Delete any template in Firestore that is not in PREBUILT_TEMPLATES
    for (const docSnap of snapshot.docs) {
      if (!validIds.has(docSnap.id)) {
        try {
          await deleteDoc(docSnap.ref);
        } catch {}
      }
    }

    let count = 0;
    for (const template of PREBUILT_TEMPLATES) {
      const cleaned = sanitizeForFirestore(template);
      if (cleaned && typeof cleaned === "object") {
        await setDoc(templateDocRef(template.id), {
          ...(cleaned as Record<string, unknown>),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
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
    const seed = PREBUILT_TEMPLATES.find((p) => p.id === templateId || p.slug === templateId);
    return seed ?? PREBUILT_TEMPLATES[0] ?? null;
  } catch (err: any) {
    const seed = PREBUILT_TEMPLATES.find((p) => p.id === templateId || p.slug === templateId);
    return seed ?? PREBUILT_TEMPLATES[0] ?? null;
  }
}

export async function getPublishedTemplates(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);
    const validIds = new Set(PREBUILT_TEMPLATES.map((p) => p.id));
    for (const docSnap of snapshot.docs) {
      if (!validIds.has(docSnap.id)) {
        try {
          await deleteDoc(docSnap.ref);
        } catch {}
      }
    }
    return PREBUILT_TEMPLATES;
  } catch (err: any) {
    return PREBUILT_TEMPLATES;
  }
}

export async function getTemplatesForSuperAdmin(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);

    // Delete all other templates from Firestore
    for (const docSnap of snapshot.docs) {
      if (docSnap.id !== "tpl-freelancer-dark-yellow") {
        try {
          await deleteDoc(docSnap.ref);
        } catch {}
      }
    }

    const freelancerTemplate = PREBUILT_TEMPLATES[0];
    const exists = snapshot.docs.some((d) => d.id === freelancerTemplate.id);
    if (!exists) {
      const cleaned = sanitizeForFirestore(freelancerTemplate);
      if (cleaned && typeof cleaned === "object") {
        await setDoc(templateDocRef(freelancerTemplate.id), {
          ...(cleaned as Record<string, unknown>),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    return [freelancerTemplate];
  } catch (err: any) {
    return [...PREBUILT_TEMPLATES];
  }
}

export async function listTemplates(status?: TemplateStatus): Promise<Template[]> {
  return getTemplatesForSuperAdmin();
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
