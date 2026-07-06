/**
 * Central route map. Pages that exist in the design but aren't built yet
 * resolve to "#" so links never 404 - swap them in when those pages land.
 */
export const routes = {
  home: "/",
  apply: "/apply",
  shop: "/shop",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

/** Detail route for a single shop product. */
export const shopProduct = (id: string) => `/shop/${id}`;
