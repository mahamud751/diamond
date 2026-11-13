import { PackageManager } from "@/components/package-manager";
import { prisma } from "@/lib/prisma";

export default async function PackagesAdmin() {
  const packages = await prisma.package.findMany({
    orderBy: [{ sortOrder: "asc" }, { diamonds: "asc" }],
    include: { _count: { select: { orders: true } } },
  });

  return <PackageManager packages={packages.map((item) => ({
    id: item.id,
    name: item.name,
    diamonds: item.diamonds,
    priceBdt: item.priceBdt,
    priceUsd: Number(item.priceUsd),
    description: item.description ?? "",
    active: item.active,
    highlight: item.highlight,
    sortOrder: item.sortOrder,
    orders: item._count.orders,
  }))}/>;
}
