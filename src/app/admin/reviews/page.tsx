import { Fragment } from "react";
import { removeTestimonial, saveTestimonial } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { prisma } from "@/lib/prisma";

export default async function ReviewsAdmin() {
  const reviews = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <p className="kicker">Reviews</p>
      <h1>Member notes.</h1>
      <p className="muted">Starter notes stay on the public site until you replace them. Only live notes are shown.</p>
      <div className="panel table-wrap" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quote</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {reviews.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td>
                    <strong>{item.name}</strong>
                    <div>{item.role}</div>
                  </td>
                  <td><div className="cell-clip">{item.quote}</div></td>
                  <td>{"★".repeat(item.rating)}</td>
                  <td><LiveBadge on={item.active} /></td>
                  <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                  <td>
                    <details className="row-editor">
                      <summary>Edit</summary>
                    </details>
                  </td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={6}>
                    <AdminForm action={saveTestimonial} submit="Save">
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid-2">
                        <Field label="Name"><input name="name" defaultValue={item.name} required /></Field>
                        <Field label="Place"><input name="role" defaultValue={item.role} /></Field>
                      </div>
                      <Field label="Quote"><textarea name="quote" defaultValue={item.quote} required /></Field>
                      <div className="grid-2">
                        <Field label="Rating"><input name="rating" type="number" min={1} max={5} defaultValue={item.rating} /></Field>
                        <Field label="Sort"><input name="sortOrder" type="number" defaultValue={item.sortOrder} /></Field>
                      </div>
                      <label className="check"><input type="checkbox" name="active" defaultChecked={item.active} /> Live</label>
                    </AdminForm>
                    <form action={removeTestimonial}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="btn btn-text" type="submit">Remove</button>
                    </form>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 ? <p className="muted">No notes yet.</p> : null}
      </div>
      <details className="admin-add">
        <summary>Add a note</summary>
        <AdminForm action={saveTestimonial} submit="Add note" resetOnSuccess>
          <div className="grid-2">
            <Field label="Name"><input name="name" required /></Field>
            <Field label="Place"><input name="role" placeholder="Member, Dhaka" /></Field>
          </div>
          <Field label="Quote"><textarea name="quote" required /></Field>
          <div className="grid-2">
            <Field label="Rating"><input name="rating" type="number" min={1} max={5} defaultValue={5} /></Field>
            <Field label="Sort"><input name="sortOrder" type="number" defaultValue={reviews.length + 1} /></Field>
          </div>
          <label className="check"><input type="checkbox" name="active" defaultChecked /> Live</label>
        </AdminForm>
      </details>
    </>
  );
}
