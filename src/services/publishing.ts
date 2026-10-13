import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { sanitizeForFirestore } from "@/services/firestore";
import { saveBuilderProject } from "@/services/builderProject";
import { saveProjectMetadata } from "@/services/project";
import { useBuilder, type Project } from "@/lib/builder/store";

export interface PublishedWebsiteRecord {
  slug: string;
  subdomain: string;
  url: string;
  projectId: string;
  ownerId: string;
  ownerEmail?: string | null;
  name: string;
  project: Project;
  publishedAt: number;
  updatedAt: number;
  publishedAtServer?: unknown;
}

const SLUG_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 6;

// Reserved subdomains that cannot be assigned as website slugs
export const RESERVED_SLUGS = new Set([
  "builder",
  "www",
  "app",
  "api",
  "admin",
  "super-admin",
  "dashboard",
  "preview",
  "static",
  "assets",
  "cdn",
  "mail",
  "smtp",
  "ftp",
  "staging",
  "test",
  "dev",
  "demo",
  "site",
  "sites",
]);

/**
 * Extract subdomain slug from hostname, checking against reserved slugs.
 * E.g. "a7k29x.webtoolocean.com" -> "a7k29x"
 * E.g. "a7k29x.localhost" -> "a7k29x"
 */
export function getSubdomainSlug(hostname: string): string | null {
  if (!hostname) return null;
  const host = hostname.toLowerCase().split(":")[0];
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return null;

  if (host.endsWith(".webtoolocean.com")) {
    const slug = host.slice(0, -".webtoolocean.com".length);
    if (slug && !RESERVED_SLUGS.has(slug)) return slug;
    return null;
  }

  if (host.endsWith(".localhost")) {
    const slug = host.slice(0, -".localhost".length);
    if (slug && !RESERVED_SLUGS.has(slug)) return slug;
    return null;
  }

  const parts = host.split(".");
  if (parts.length >= 3) {
    const first = parts[0];
    if (first && !RESERVED_SLUGS.has(first)) return first;
  }

  return null;
}

/**
 * Generate a random 6-character lowercase alphanumeric slug (e.g. "a7k29x").
 */
export function generateRandomSlug(length = SLUG_LENGTH): string {
  let result = "";
  const charsLen = SLUG_CHARACTERS.length;
  // Use crypto.getRandomValues if available for cryptographically strong random
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      result += SLUG_CHARACTERS[bytes[i] % charsLen];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += SLUG_CHARACTERS.charAt(Math.floor(Math.random() * charsLen));
    }
  }
  return result;
}

/**
 * Check if a slug is already taken in the publishedWebsites Firestore collection.
 */
export async function isSlugTaken(slug: string): Promise<boolean> {
  const cleanSlug = slug.toLowerCase().trim();
  if (RESERVED_SLUGS.has(cleanSlug)) return true;

  try {
    const docRef = doc(db, "publishedWebsites", cleanSlug);
    const snap = await getDoc(docRef);
    return snap.exists();
  } catch (error: any) {
    console.error(`[Publishing:isSlugTaken] Error checking slug availability for [${cleanSlug}]:`, error?.code || error?.message || error);
    // If permission or network issue, fail safe
    return false;
  }
}

/**
 * Generates a unique, non-colliding slug by testing against Firestore.
 */
export async function generateUniqueSlug(maxAttempts = 12): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generateRandomSlug(SLUG_LENGTH);
    if (RESERVED_SLUGS.has(candidate)) continue;

    const taken = await isSlugTaken(candidate);
    if (!taken) {
      return candidate;
    }
  }

  // Fallback to slightly longer slug if high density
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateRandomSlug(SLUG_LENGTH + 2);
    if (!RESERVED_SLUGS.has(candidate) && !(await isSlugTaken(candidate))) {
      return candidate;
    }
  }

  throw new Error("Unable to generate unique slug after multiple attempts. Please try again.");
}

/**
 * Fetch a published website by its unique slug.
 * Publicly accessible - no user authentication required.
 */
export async function getPublishedWebsite(slug: string): Promise<PublishedWebsiteRecord | null> {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  try {
    const docRef = doc(db, "publishedWebsites", cleanSlug);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as PublishedWebsiteRecord;
  } catch (error: any) {
    console.error(`[Publishing:getPublishedWebsite] Failed to fetch published website [${cleanSlug}]:`, error?.code || error?.message || error);
    return null;
  }
}

export interface PublishResult {
  slug: string;
  url: string;
  isFirstPublish: boolean;
  publishedAt: number;
}

/**
 * Complete publishing workflow:
 * 1. Checks and awaits Firebase authentication state readiness.
 * 2. Checks if website already has a permanent public slug.
 * 3. If no slug -> generates a secure unique slug.
 * 4. Builds the public website payload with matching owner UID.
 * 5. Saves to public collection "publishedWebsites/{slug}".
 * 6. Updates user's private project document in "users/{userId}/builderProjects/{projectId}".
 * 7. Synchronizes project metadata in "users/{userId}/projects/{projectId}".
 * 8. Returns the live public URL (e.g. "https://a7k29x.webtoolocean.com").
 */
export async function publishWebsite(project: Project): Promise<PublishResult> {
  // 1. Ensure Firebase auth state is completely ready
  if (typeof auth.authStateReady === "function") {
    await auth.authStateReady();
  }

  let user = auth.currentUser;
  if (!user) {
    // Grace period for token synchronization
    await new Promise((resolve) => setTimeout(resolve, 150));
    user = auth.currentUser;
  }

  if (!user) {
    throw new Error("You must be signed in to publish your website.");
  }

  // Validate ID token is fresh so Firestore attaches valid auth headers
  try {
    await user.getIdToken();
  } catch (tokenErr) {
    console.warn("[Publishing:auth] Warning refreshing token:", tokenErr);
  }

  if (!project.pages || project.pages.length === 0) {
    throw new Error("Cannot publish an empty website. Add at least one page.");
  }

  const existingSlug = project.publishedSlug?.trim().toLowerCase();
  const isFirstPublish = !existingSlug;

  // 2. Permanent slug logic: reuse if exists, otherwise generate unique
  let slug = existingSlug;
  if (!slug) {
    slug = await generateUniqueSlug();
  }

  const publishedAt = Date.now();
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://builder.webtoolocean.com";
  const publicUrl = `${origin}/site/${slug}`;

  // 3. Prepare the clean project clone with verified owner UID
  const projectSnapshot: Project = {
    ...JSON.parse(JSON.stringify(project)),
    ownerId: user.uid,
    published: true,
    publishedSlug: slug,
    publishedUrl: publicUrl,
    publishedAt,
    updatedAt: publishedAt,
  };

  // 4. Save to public "publishedWebsites/{slug}" collection
  const publicRecord: PublishedWebsiteRecord = {
    slug,
    subdomain: slug,
    url: publicUrl,
    projectId: project.id,
    ownerId: user.uid,
    ownerEmail: user.email ?? null,
    name: project.name || "Untitled Website",
    project: projectSnapshot,
    publishedAt,
    updatedAt: publishedAt,
  };

  const publicDocRef = doc(db, "publishedWebsites", slug);
  try {
    await setDoc(
      publicDocRef,
      {
        ...sanitizeForFirestore(publicRecord),
        publishedAtServer: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error: any) {
    console.error(`[Publishing:setDoc] Failed writing to publishedWebsites/${slug}:`, error?.code || error?.message || error);
    throw new Error(`Publish failed writing to publishedWebsites/${slug}: ${error?.message || "Missing or insufficient permissions."}`);
  }

  // 5. Update the Zustand store
  const store = useBuilder.getState();
  store.publishProject(project.id, slug, publicUrl);

  // 6. Update the user's private cloud document (builderProjects subcollection)
  const updatedCurrentProject: Project = {
    ...(store.currentProject() || projectSnapshot),
    ownerId: user.uid,
    published: true,
    publishedSlug: slug,
    publishedUrl: publicUrl,
    publishedAt,
    updatedAt: publishedAt,
  };

  try {
    await saveBuilderProject(updatedCurrentProject);
  } catch (error: any) {
    console.error(`[Publishing:saveBuilderProject] Failed saving users/${user.uid}/builderProjects/${project.id}:`, error?.code || error?.message || error);
    throw new Error(`Publish failed saving project state: ${error?.message || "Missing or insufficient permissions."}`);
  }

  // 7. Synchronize project metadata in users/{userId}/projects/{projectId}
  try {
    await saveProjectMetadata({
      id: updatedCurrentProject.id,
      name: updatedCurrentProject.name,
      templateId: updatedCurrentProject.selectedTemplateId ?? null,
      thumbnail: updatedCurrentProject.thumbnail || "",
      description: updatedCurrentProject.description || "",
      favorite: false,
      status: "published",
      createdAt: updatedCurrentProject.createdAt ?? Date.now(),
      updatedAt: publishedAt,
      pages: updatedCurrentProject.pages.map((p) => p.slug || p.id),
      isPublic: true,
    });
  } catch (metadataErr: any) {
    console.warn(`[Publishing:saveProjectMetadata] Non-fatal metadata sync warning:`, metadataErr?.message || metadataErr);
  }

  return {
    slug,
    url: publicUrl,
    isFirstPublish,
    publishedAt,
  };
}
