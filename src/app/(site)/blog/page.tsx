import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { when } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes from Asian Top 10 Family.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHero kicker="House notes" title="From the family desk.">
        <p className="lede">Stories, updates, and practical notes from Asian Top 10 Family.</p>
      </PageHero>
      <section className="shell section">
        {posts.length === 0 ? <p className="lede">The first post is on its way.</p> : null}
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
              {post.coverImage ? (
                <Image src={post.coverImage} alt="" width={640} height={360} unoptimized />
              ) : null}
              <small>{when(post.createdAt)}</small>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
