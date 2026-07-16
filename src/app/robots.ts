import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = `${process.env.REDIRECT_URL!}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/_next/",
        "/admin/",
        "/private/",
        "/public/assets",
        "/public",
        "/public/assets/achievements",
        "/assets",
        "/lib",
        "/payments",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
