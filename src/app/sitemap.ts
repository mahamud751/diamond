import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/agency", "/packages", "/withdrawal", "/about", "/services", "/contact", "/login", "/signup"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );
  try {
    const pages = await prisma.page.findMany({ where: { published: true }, select: { slug: true } });
    return [
      ...staticRoutes,
      ...pages.map((page) => ({
        url: `${base}/p/${page.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
