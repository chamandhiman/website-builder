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
import type { WidgetInstance } from "@/components/builder/widgets/widgetRegistry";

export type TemplateStatus = "draft" | "published";

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: TemplateStatus;
  thumbnail: string | null;
  widgets: WidgetInstance[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTemplateInput {
  name: string;
  slug: string;
  category: string;
  thumbnail?: string | null;
  widgets: WidgetInstance[];
}

export interface UpdateTemplateInput {
  name?: string;
  slug?: string;
  category?: string;
  status?: TemplateStatus;
  thumbnail?: string | null;
  widgets?: WidgetInstance[];
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
  return {
    id: snapshot.id,
    name: String(data.name ?? ""),
    slug: String(data.slug ?? ""),
    category: String(data.category ?? ""),
    status: data.status === "published" ? "published" : "draft",
    thumbnail: data.thumbnail ?? null,
    widgets,
    createdBy: String(data.createdBy ?? ""),
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt as string | number ?? Date.now()),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt as string | number ?? Date.now()),
  };
}

export async function getTemplate(templateId: string): Promise<Template | null> {
  try {
    const snapshot = await getDoc(templateDocRef(templateId));
    if (!snapshot.exists()) return null;
    return mapTemplate(snapshot);
  } catch (err: any) {
    console.error("[Templates] getTemplate failed", {
      code: err?.code,
      message: err?.message,
      templateId,
      uid: auth.currentUser?.uid,
    });
    throw err;
  }
}

export async function getPublishedTemplates(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const q = query(col, where("status", "==", "published"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapTemplate);
  } catch (err: any) {
    console.error("[Templates] getPublishedTemplates failed", {
      code: err?.code,
      message: err?.message,
      uid: auth.currentUser?.uid,
    });
    throw err;
  }
}

export async function getTemplatesForSuperAdmin(): Promise<Template[]> {
  try {
    const col = templatesCollectionRef();
    const snapshot = await getDocs(col);
    const templates = snapshot.docs.map(mapTemplate);
    templates.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return templates;
  } catch (err: any) {
    console.error("[Templates] getTemplatesForSuperAdmin failed", {
      code: err?.code,
      message: err?.message,
      uid: auth.currentUser?.uid,
    });
    throw err;
  }
}

export async function listTemplates(status?: TemplateStatus): Promise<Template[]> {
  if (status === "published") {
    return getPublishedTemplates();
  }
  if (status === "draft") {
    const col = templatesCollectionRef();
    const q = query(col, where("status", "==", "draft"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapTemplate);
  }
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

  await updateDoc(templateDocRef(templateId), {
    ...(cleaned as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTemplate(templateId: string): Promise<void> {
  await deleteDoc(templateDocRef(templateId));
}

export async function setTemplateStatus(templateId: string, status: TemplateStatus): Promise<void> {
  await updateDoc(templateDocRef(templateId), {
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
  widgets: WidgetInstance[];
  thumbnail?: string | null;
  uid: string;
  existingTemplateId?: string;
}): Promise<Template> {
  const { name, slug, category, widgets, thumbnail, uid, existingTemplateId } = input;

  if (existingTemplateId) {
    await updateTemplate(existingTemplateId, {
      name,
      slug,
      category,
      widgets,
      thumbnail: thumbnail ?? null,
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
      thumbnail: thumbnail ?? null,
    },
    uid
  );
}
