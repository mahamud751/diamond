import { PackageManager } from "@/components/package-manager";
import { bdtToUsd, usdRateOf } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function PackagesAdmin() {
  const [packages, settings] = await Promise.all([
    prisma.package.findMany({
    orderBy: [{ sortOrder: "asc" }, { diamonds: "asc" }],
    include: { _count: { select: { orders: true } } },
  }),
    prisma.siteSetting.findUnique({ where: { id: "main" } }),
  ]);
  const usdRate = usdRateOf(settings?.usdRate);

  return <PackageManager usdRate={usdRate} packages={packages.map((item) => ({
    id: item.id,
    name: item.name,
    diamonds: item.diamonds,
    priceBdt: item.priceBdt,
    priceUsd: bdtToUsd(item.priceBdt, usdRate),
    description: item.description ?? "",
    active: item.active,
    highlight: item.highlight,
    sortOrder: item.sortOrder,
    orders: item._count.orders,
  }))}/>;
}
