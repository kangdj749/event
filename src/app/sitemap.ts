import { MetadataRoute } from "next";
import { getAllPages } from "@/services/page.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://grahadhuafa.org";
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const pages = await getAllPages();

  const dynamicUrls: MetadataRoute.Sitemap = pages.map(
    (page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updated_at
        ? new Date(page.updated_at)
        : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticUrls, ...dynamicUrls];
}