// Server-side fetchers for the public API — used by the file-convention SEO
// surfaces (sitemap, generateMetadata) where the RTK Query client isn't
// available. Mirrors dms-frontend's sitemap fetcher: responses are cached with
// a revalidate window and failures are swallowed so a backend hiccup never
// breaks a sitemap or a page render.
const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

const REVALIDATE_SECONDS = 3600;

/** The public product DTO fields the SEO surfaces care about. */
export interface PublicProduct {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * A server-side lookup that keeps "the backend said 404" distinct from "the
 * backend was unreachable" — page shells need the difference to choose between
 * `notFound()` and degrading to the client island's retry UX.
 */
export type PublicLookup<T> =
  | { kind: "found"; data: T }
  | { kind: "not-found" }
  | { kind: "error" };

async function lookupJson<T>(
  path: string,
  init?: RequestInit,
): Promise<PublicLookup<T>> {
  if (!serverUri) return { kind: "error" };
  try {
    const response = await fetch(`${serverUri}/api/v1${path}`, {
      headers: { "Content-Type": "application/json" },
      // An explicit cache mode (e.g. no-store) replaces the revalidate window —
      // Next rejects a request that specifies both.
      ...(init?.cache ? {} : { next: { revalidate: REVALIDATE_SECONDS } }),
      ...init,
    });
    if (response.status === 404) return { kind: "not-found" };
    if (!response.ok) {
      console.error(`Public API: ${path} responded ${String(response.status)}`);
      return { kind: "error" };
    }
    const json = (await response.json()) as { data?: T };
    return json.data !== undefined
      ? { kind: "found", data: json.data }
      : { kind: "error" };
  } catch (error) {
    console.error(`Public API: error fetching ${path}:`, error);
    return { kind: "error" };
  }
}

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!serverUri) return null;
  try {
    const response = await fetch(`${serverUri}/api/v1${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error(`Public API: ${path} responded ${String(response.status)}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Public API: error fetching ${path}:`, error);
    return null;
  }
}

/** The whole public catalogue (one generous page — a small bakery's worth).
 * The backend caps `limit` at 100 (paginationQuery in common-validation.ts);
 * asking for more is a 400 that `fetchJson` would swallow into an empty
 * sitemap, so we request exactly the cap. */
export async function fetchPublicProducts(): Promise<PublicProduct[]> {
  const json = await fetchJson<{ data?: PublicProduct[] }>(
    "/products?limit=100",
  );
  return Array.isArray(json?.data) ? json.data : [];
}

/** A single product by slug, or null when unknown/unreachable. */
export async function fetchPublicProduct(
  slug: string,
): Promise<PublicProduct | null> {
  const json = await fetchJson<{ data?: PublicProduct }>(
    `/products/${encodeURIComponent(slug)}`,
  );
  return json?.data ?? null;
}

/** The public training DTO fields the SEO surfaces care about. */
export interface PublicTraining {
  name: string;
  slug: string;
  summary: string;
  coverImage: string | null;
  updatedAt?: string;
  createdAt?: string;
}

/** All published trainings (one page at the backend's `limit` cap of 100). */
export async function fetchPublicTrainings(): Promise<PublicTraining[]> {
  const json = await fetchJson<{ data?: PublicTraining[] }>(
    "/trainings?limit=100",
  );
  return Array.isArray(json?.data) ? json.data : [];
}

/** A single training by slug — the `/trainings/[slug]` shell needs 404 vs
 * unreachable kept apart (real 404 → `notFound()`, hiccup → client island). */
export async function lookupPublicTraining(
  slug: string,
): Promise<PublicLookup<PublicTraining>> {
  return lookupJson<PublicTraining>(`/trainings/${encodeURIComponent(slug)}`);
}

/** The public application DTO (`GET /applications/:code`) — enough for the
 * status panel a receipt-code link renders. */
export interface PublicApplication {
  code: string;
  fullName: string;
  email: string | null;
  status:
    | "PENDING"
    | "WAITLISTED"
    | "RECRUITED"
    | "REJECTED"
    | "WITHDRAWN";
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID";
  amountDue: number;
  amountPaid: number;
  balance: number;
  currency: string;
  createdAt: string;
  training?: { id: string; name: string; slug: string };
}

/** An application by receipt code. Payment state must be fresh (the applicant
 * lands here straight after paying), so this bypasses the revalidate cache. */
export async function lookupApplicationByCode(
  code: string,
): Promise<PublicLookup<PublicApplication>> {
  return lookupJson<PublicApplication>(
    `/applications/${encodeURIComponent(code)}`,
    { cache: "no-store" },
  );
}
