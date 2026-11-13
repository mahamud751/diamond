import { Fragment } from "react";
import Image from "next/image";
import { removeBlog, saveBlog } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { RowTools } from "@/components/row-actions";
import { when } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function BlogAdmin() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <p className="kicker">Blog</p>
      <h1>House notes.</h1>
      <p className="muted">Published posts appear at /blog. Drafts stay in this desk.</p>
      <div className="panel table-wrap" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th>Post</th>
              <th>Path</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {posts.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td>
                    <strong>{item.title}</strong>
                    <div className="cell-clip">{item.excerpt}</div>
                  </td>
                  <td>/blog/{item.slug}</td>
                  <td><LiveBadge on={item.published} onLabel="Published" offLabel="Draft" /></td>
                  <td>{when(item.updatedAt)}</td>
                  <td className="action-cell"><RowTools id={item.id} remove={removeBlog} /></td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={5}>
                    <AdminForm action={saveBlog} submit="Save">
                      <input type="hidden" name="id" value={item.id} />
                      <BlogFields item={item} />
                    </AdminForm>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {posts.length === 0 ? <p className="muted">No posts yet.</p> : null}
      </div>
      <details className="admin-add">
        <summary>Add a post</summary>
        <AdminForm action={saveBlog} submit="Add post" resetOnSuccess>
          <BlogFields />
        </AdminForm>
      </details>
    </>
  );
}

function BlogFields({
  item,
}: {
  item?: { title: string; slug: string; excerpt: string; body: string; coverImage: string; published: boolean };
}) {
  return (
    <>
      <div className="grid-2">
        <Field label="Title"><input name="title" defaultValue={item?.title} required /></Field>
        <Field label="Slug" hint="Leave blank to build it from the title."><input name="slug" defaultValue={item?.slug} /></Field>
      </div>
      <Field label="Excerpt"><textarea name="excerpt" defaultValue={item?.excerpt} required /></Field>
      <Field label="Post"><textarea name="body" defaultValue={item?.body} required style={{ minHeight: 180 }} /></Field>
      <Field label="Cover image" hint="Optional. Choose a JPG, PNG, WEBP, or GIF from your device.">
        <input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
      </Field>
      {item?.coverImage ? (
        <>
          <Image src={item.coverImage} alt="" width={320} height={180} unoptimized />
          <input type="hidden" name="currentCover" value={item.coverImage} />
          <label className="check"><input type="checkbox" name="removeCover" /> Remove the current cover</label>
        </>
      ) : null}
      <label className="check"><input type="checkbox" name="published" defaultChecked={item?.published ?? false} /> Published</label>
    </>
  );
}
