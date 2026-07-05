import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The cart is transactional; /admin is the private console;
      // /style-guide is an internal component gallery.
      disallow: ["/shop/cart", "/admin", "/style-guide"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
