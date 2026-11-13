import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/field";
import { PageHero } from "@/components/page-hero";
import { when } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: "Blog" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <>
      <PageHero kicker={when(post.createdAt)} title={post.title}>
        <p className="lede">{post.excerpt}</p>
      </PageHero>
      <article className="shell section narrow">
        <div className="panel article">
          {post.coverImage ? (
            <Image className="blog-cover" src={post.coverImage} alt="" width={1200} height={680} unoptimized />
          ) : null}
          <Prose text={post.body} />
          <p>
            <Link className="text-link" href="/blog">All posts</Link>
          </p>
        </div>
      </article>
    </>
  );
}
