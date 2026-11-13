import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/agency", "/host", "/agent", "/packages", "/withdrawal", "/about", "/services", "/blog", "/contact", "/login", "/signup"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );
  try {
    const [pages, posts] = await Promise.all([
      prisma.page.findMany({ where: { published: true }, select: { slug: true } }),
      prisma.blogPost.findMany({ where: { published: true }, select: { slug: true } }),
    ]);
    return [
      ...staticRoutes,
      ...pages.map((page) => ({
        url: `${base}/p/${page.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...posts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
