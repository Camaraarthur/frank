import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://frank.community";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/beckton`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/record`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/video`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
