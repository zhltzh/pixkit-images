import type { MetadataRoute } from "next";
import { absoluteUrl } from "./site-config";
import { toolContent, toolIds } from "./tool-content";
import { taskPages } from "./task-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-09T00:00:00+08:00");
  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolIds.map((id) => ({
      url: absoluteUrl(`/tools/${toolContent[id].slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...taskPages.map((page) => ({
      url: absoluteUrl(`/tools/${page.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...["about", "privacy", "changelog"].map((slug) => ({
      url: absoluteUrl(`/${slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: slug === "about" ? 0.7 : 0.5,
    })),
  ];
}
