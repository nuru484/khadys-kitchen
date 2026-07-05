import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { products } from "@/lib/shop-data";
import { shopProduct } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Product detail pages are enumerated from the static catalogue.
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}${shopProduct(p.id)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // /shop/cart is intentionally omitted (transactional, no SEO value).
  return [...staticPages, ...productPages];
}
