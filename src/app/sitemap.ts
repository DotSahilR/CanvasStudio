import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://canvasart.studio";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/classes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/book`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/auth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/my-bookings`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
