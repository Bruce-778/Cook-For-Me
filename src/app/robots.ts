import type { MetadataRoute } from "next";

function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    return new URL(configured || "http://localhost:3001");
  } catch {
    return new URL("http://localhost:3001");
  }
}

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/ai-status", "/favorites"],
    },
    sitemap: new URL("/sitemap.xml", origin).toString(),
  };
}
