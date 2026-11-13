import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/field";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || !page.published) return { title: "Page" };
  return { title: page.title, description: page.excerpt || page.title };
}

export default async function CustomPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || !page.published) notFound();
  return (
    <>
      <PageHero kicker="Asian Top 10 Family" title={page.title}>
        {page.excerpt ? <p className="lede">{page.excerpt}</p> : null}
      </PageHero>
      <article className="shell section narrow">
        <div className="panel article">
          <Prose text={page.body} />
        </div>
      </article>
    </>
  );
}
