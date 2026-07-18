import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://foxfit-wellness-club.polite-ibex-0423.chatgpt.site";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: .8 },
    { url: `${base}/blog/dinh-duong-truoc-sau-tap`, lastModified: new Date("2026-07-18"), changeFrequency: "monthly", priority: .7 },
    { url: `${base}/blog/thuc-don-giam-mo-cho-nu`, lastModified: new Date("2026-07-18"), changeFrequency: "monthly", priority: .7 },
  ];
}
