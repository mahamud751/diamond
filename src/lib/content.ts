import { cache } from "react";
import { bdtToUsd, usdRateOf } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export type PackageCard = {
  id: string;
  name: string;
  diamonds: number;
  priceBdt: number;
  priceUsd: number;
  highlight: boolean;
  description: string | null;
};

function serializePackage(
  pkg: {
    id: string;
    name: string;
    diamonds: number;
    priceBdt: number;
    highlight: boolean;
    description: string | null;
  },
  rate: number,
): PackageCard {
  return {
    id: pkg.id,
    name: pkg.name,
    diamonds: pkg.diamonds,
    priceBdt: pkg.priceBdt,
    priceUsd: bdtToUsd(pkg.priceBdt, rate),
    highlight: pkg.highlight,
    description: pkg.description,
  };
}

export const loadHouse = cache(async () => {
  const [settings, services, achievements, testimonials, team, pages, packages, guides, workPages, posts] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: "main" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.achievement.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.teamMember.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.page.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true, navLabel: true, showInNav: true, excerpt: true },
    }),
    prisma.package.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.guide.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.workPage.findMany(),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true, coverImage: true, createdAt: true },
    }),
  ]);

  if (!settings) return null;

  const rate = usdRateOf(settings.usdRate);

  return {
    settings,
    services,
    achievements,
    testimonials,
    team,
    pages,
    guides,
    workPages,
    posts,
    usdRate: rate,
    packages: packages.map((item) => serializePackage(item, rate)),
  };
});

export type HouseData = NonNullable<Awaited<ReturnType<typeof loadHouse>>>;
