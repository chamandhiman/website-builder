import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { sanitizeForFirestore } from "@/services/firestore";
import { saveBuilderProject } from "@/services/builderProject";
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
  } catch (error) {
    console.error("Error checking slug availability:", error);
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
  } catch (error) {
    console.error(`Failed to fetch published website [${slug}]:`, error);
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
 * 1. Checks if website already has a permanent public slug.
 * 2. If no slug -> generates a secure unique slug (lowercase letters + numbers).
 * 3. Builds the public website payload.
 * 4. Saves to public collection "publishedWebsites/{slug}".
 * 5. Updates user's project with published status, slug, URL, and timestamp.
 * 6. Returns the live public URL (e.g. "https://a7k29x.webtoolocean.com").
 */
export async function publishWebsite(project: Project): Promise<PublishResult> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in to publish your website.");
  }

  if (!project.pages || project.pages.length === 0) {
    throw new Error("Cannot publish an empty website. Add at least one page.");
  }

  const existingSlug = project.publishedSlug?.trim().toLowerCase();
  const isFirstPublish = !existingSlug;

  // 1. Permanent slug logic: reuse if exists, otherwise generate unique
  let slug = existingSlug;
  if (!slug) {
    slug = await generateUniqueSlug();
  }

  const publishedAt = Date.now();
  const publicUrl = `https://${slug}.webtoolocean.com`;

  // 2. Prepare the clean project clone for public rendering
  const projectSnapshot: Project = {
    ...JSON.parse(JSON.stringify(project)),
    published: true,
    publishedSlug: slug,
    publishedUrl: publicUrl,
    publishedAt,
    updatedAt: publishedAt,
  };

  // 3. Save to public "publishedWebsites/{slug}" collection
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
  await setDoc(
    publicDocRef,
    {
      ...sanitizeForFirestore(publicRecord),
      publishedAtServer: serverTimestamp(),
    },
    { merge: true }
  );

  // 4. Update the Zustand store
  const store = useBuilder.getState();
  store.publishProject(project.id, slug, publicUrl);

  // 5. Update the user's private cloud document
  const updatedCurrentProject = store.currentProject() || projectSnapshot;
  await saveBuilderProject(updatedCurrentProject);

  return {
    slug,
    url: publicUrl,
    isFirstPublish,
    publishedAt,
  };
}
