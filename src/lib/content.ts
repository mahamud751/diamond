import { cache } from "react";
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

function serializePackage(pkg: {
  id: string;
  name: string;
  diamonds: number;
  priceBdt: number;
  priceUsd: { toString(): string } | number;
  highlight: boolean;
  description: string | null;
}): PackageCard {
  return {
    id: pkg.id,
    name: pkg.name,
    diamonds: pkg.diamonds,
    priceBdt: pkg.priceBdt,
    priceUsd: Number(pkg.priceUsd),
    highlight: pkg.highlight,
    description: pkg.description,
  };
}

export const loadHouse = cache(async () => {
  const [settings, services, achievements, testimonials, team, pages, packages] = await Promise.all([
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
  ]);

  if (!settings) return null;

  return {
    settings,
    services,
    achievements,
    testimonials,
    team,
    pages,
    packages: packages.map(serializePackage),
  };
});

export type HouseData = NonNullable<Awaited<ReturnType<typeof loadHouse>>>;
