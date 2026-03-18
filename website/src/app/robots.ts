import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/portal/", "/auth/"],
      },
    ],
    sitemap: "https://pawcasso-atelier.vercel.app/sitemap.xml",
  };
}
