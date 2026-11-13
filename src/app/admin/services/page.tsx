import { Fragment } from "react";
import { removeService, saveService } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { RowTools } from "@/components/row-actions";
import { prisma } from "@/lib/prisma";

const ICONS = ["diamond", "account", "desk", "profile", "shield", "globe"];

export default async function ServicesAdmin() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <p className="kicker">Services</p>
      <h1>What the public site offers.</h1>
      <div className="panel table-wrap" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Summary</th>
              <th>Icon</th>
              <th>Status</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {services.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td><strong>{item.title}</strong></td>
                  <td><div className="cell-clip">{item.summary}</div></td>
                  <td>{item.icon}</td>
                  <td><LiveBadge on={item.active} /></td>
                  <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                  <td className="action-cell"><RowTools id={item.id} remove={removeService} /></td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={6}>
                    <AdminForm action={saveService} submit="Save">
                      <input type="hidden" name="id" value={item.id} />
                      <Field label="Title"><input name="title" defaultValue={item.title} required /></Field>
                      <Field label="Summary"><textarea name="summary" defaultValue={item.summary} required /></Field>
                      <div className="grid-2">
                        <Field label="Icon">
                          <select name="icon" defaultValue={item.icon}>
                            {ICONS.map((icon) => <option key={icon}>{icon}</option>)}
                          </select>
                        </Field>
                        <Field label="Sort"><input name="sortOrder" type="number" defaultValue={item.sortOrder} /></Field>
                      </div>
                      <label className="check"><input type="checkbox" name="active" defaultChecked={item.active} /> Live</label>
                    </AdminForm>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {services.length === 0 ? <p className="muted">No services yet.</p> : null}
      </div>
      <details className="admin-add">
        <summary>Add a service</summary>
        <AdminForm action={saveService} submit="Add service" resetOnSuccess>
          <Field label="Title"><input name="title" required /></Field>
          <Field label="Summary"><textarea name="summary" required /></Field>
          <div className="grid-2">
            <Field label="Icon">
              <select name="icon" defaultValue="diamond">
                {ICONS.map((icon) => <option key={icon}>{icon}</option>)}
              </select>
            </Field>
            <Field label="Sort"><input name="sortOrder" type="number" defaultValue={services.length + 1} /></Field>
          </div>
          <label className="check"><input type="checkbox" name="active" defaultChecked /> Live</label>
        </AdminForm>
      </details>
    </>
  );
}
