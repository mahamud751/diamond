import { WorkDesk } from "@/components/work-desk";
import { prisma } from "@/lib/prisma";

const PAGES = ["AGENCY", "HOST", "AGENT"] as const;

export default async function GuidesAdmin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const initial = PAGES.includes(tab as (typeof PAGES)[number]) ? (tab as (typeof PAGES)[number]) : "AGENCY";
  const [pages, guides] = await Promise.all([
    prisma.workPage.findMany(),
    prisma.guide.findMany({ orderBy: [{ sortOrder: "asc" }] }),
  ]);

  return (
    <>
      <p className="kicker">Work pages</p>
      <h1>What visitors read before they register.</h1>
      <p className="muted">Open one page at a time. The pencil edits a step. The bin removes it.</p>
      <WorkDesk
        initial={initial}
        pages={pages.map((item) => ({
          key: item.key,
          menuLabel: item.menuLabel,
          kicker: item.kicker,
          title: item.title,
          intro: item.intro,
          registerLabel: item.registerLabel,
        }))}
        guides={guides.map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
          page: item.page,
          sortOrder: item.sortOrder,
          active: item.active,
        }))}
      />
    </>
  );
}
