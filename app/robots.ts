import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  // The whole app behind auth is pointless to crawl, and the public marketing
  // page is the only thing that should be indexed.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/*/boards", "/b/", "/c/"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
