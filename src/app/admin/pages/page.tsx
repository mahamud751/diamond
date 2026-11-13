import { Fragment } from "react";
import { removePage, savePage } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { prisma } from "@/lib/prisma";

export default async function PagesAdmin() {
  const pages = await prisma.page.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <p className="kicker">Pages</p>
      <h1>Future pages live here.</h1>
      <p className="muted">A published page is available at /p/your-slug. Turn on navigation to add it to the header.</p>
      <div className="panel table-wrap" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Path</th>
              <th>Header</th>
              <th>Status</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pages.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td>
                    <strong>{item.title}</strong>
                    <div>{item.navLabel}</div>
                  </td>
                  <td>/p/{item.slug}</td>
                  <td><LiveBadge on={item.showInNav} onLabel="In header" offLabel="Hidden" /></td>
                  <td><LiveBadge on={item.published} onLabel="Published" offLabel="Draft" /></td>
                  <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                  <td><details className="row-editor"><summary>Edit</summary></details></td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={6}>
                    <AdminForm action={savePage} submit="Save">
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid-2">
                        <Field label="Title"><input name="title" defaultValue={item.title} required /></Field>
                        <Field label="Slug"><input name="slug" defaultValue={item.slug} required /></Field>
                      </div>
                      <div className="grid-2">
                        <Field label="Excerpt"><input name="excerpt" defaultValue={item.excerpt} /></Field>
                        <Field label="Nav label"><input name="navLabel" defaultValue={item.navLabel} /></Field>
                      </div>
                      <Field label="Body"><textarea name="body" defaultValue={item.body} required style={{ minHeight: 160 }} /></Field>
                      <Field label="Sort"><input name="sortOrder" type="number" defaultValue={item.sortOrder} /></Field>
                      <label className="check"><input type="checkbox" name="showInNav" defaultChecked={item.showInNav} /> Header</label>
                      <label className="check"><input type="checkbox" name="published" defaultChecked={item.published} /> Published</label>
                    </AdminForm>
                    <form action={removePage}><input type="hidden" name="id" value={item.id} /><button className="btn btn-text" type="submit">Remove</button></form>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {pages.length === 0 ? <p className="muted">No pages yet.</p> : null}
      </div>
      <details className="admin-add">
        <summary>Add a page</summary>
        <AdminForm action={savePage} submit="Publish page" resetOnSuccess>
          <div className="grid-2">
            <Field label="Title"><input name="title" required /></Field>
            <Field label="Slug" hint="Letters, numbers, and hyphens."><input name="slug" placeholder="trade-desk" /></Field>
          </div>
          <div className="grid-2">
            <Field label="Excerpt"><input name="excerpt" /></Field>
            <Field label="Nav label"><input name="navLabel" /></Field>
          </div>
          <Field label="Body"><textarea name="body" required style={{ minHeight: 180 }} /></Field>
          <Field label="Sort"><input name="sortOrder" type="number" defaultValue={pages.length + 1} /></Field>
          <label className="check"><input type="checkbox" name="showInNav" /> Show in header</label>
          <label className="check"><input type="checkbox" name="published" defaultChecked /> Published</label>
        </AdminForm>
      </details>
    </>
  );
}
