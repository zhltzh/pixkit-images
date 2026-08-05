import type { MetadataRoute } from "next";
import { absoluteUrl } from "./site-config";
import { toolContent, toolIds } from "./tool-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
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
  ];
}
