import { Fragment } from "react";
import { decideReview, removeTestimonial, saveTestimonial } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { IconForm, RowTools } from "@/components/row-actions";
import { prisma } from "@/lib/prisma";

const RANK = { PENDING: 0, APPROVED: 1, HIDDEN: 2 };

export default async function ReviewsAdmin() {
  const reviews = await prisma.testimonial.findMany();
  reviews.sort((a, b) => RANK[a.status] - RANK[b.status] || a.sortOrder - b.sortOrder);
  const waiting = reviews.filter((item) => item.status === "PENDING").length;

  return (
    <>
      <p className="kicker">Reviews</p>
      <h1>Member notes.</h1>
      <p className="muted">
        Notes you add here can go live immediately. Notes from the website stay hidden until you accept them.
        {waiting ? ` ${waiting} waiting.` : ""}
      </p>
      <div className="panel table-wrap" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quote</th>
              <th>Rating</th>
              <th>From</th>
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
                    {item.email ? <div>{item.email}</div> : null}
                  </td>
                  <td><div className="cell-clip">{item.quote}</div></td>
                  <td>{"★".repeat(item.rating)}</td>
                  <td>{item.source === "VISITOR" ? "Visitor" : "Admin"}</td>
                  <td>
                    <LiveBadge
                      on={item.status === "APPROVED"}
                      onLabel="Live"
                      offLabel={item.status === "PENDING" ? "Waiting" : "Hidden"}
                    />
                  </td>
                  <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                  <td className="action-cell">
                    <RowTools
                      id={item.id}
                      remove={removeTestimonial}
                      extra={
                        <>
                          {item.status !== "APPROVED" ? (
                            <IconForm action={decideReview} id={item.id} fields={{ status: "APPROVED" }} label="Accept" icon="check" tone="good" />
                          ) : null}
                          {item.status !== "HIDDEN" ? (
                            <IconForm action={decideReview} id={item.id} fields={{ status: "HIDDEN" }} label="Hide" icon="eye-off" />
                          ) : null}
                        </>
                      }
                    />
                  </td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={7}>
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
                      <label className="check"><input type="checkbox" name="active" defaultChecked={item.status === "APPROVED"} /> Live on the website</label>
                    </AdminForm>
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
          <label className="check"><input type="checkbox" name="active" defaultChecked /> Live on the website</label>
        </AdminForm>
      </details>
    </>
  );
}
