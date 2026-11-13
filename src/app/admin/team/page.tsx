import { Fragment } from "react";
import { removeAchievement, removeTeam, saveAchievement, saveTeam } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { RowTools } from "@/components/row-actions";
import { prisma } from "@/lib/prisma";

export default async function TeamAdmin() {
  const [team, achievements] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <>
      <p className="kicker">Team</p>
      <h1>People and the numbers they keep.</h1>
      <h2 style={{ marginTop: 22 }}>People</h2>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Highlight</th>
              <th>Status</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {team.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.title}</td>
                  <td><div className="cell-clip">{item.highlight}</div></td>
                  <td><LiveBadge on={item.active} /></td>
                  <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                  <td className="action-cell"><RowTools id={item.id} remove={removeTeam} /></td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={6}>
                    <AdminForm action={saveTeam} submit="Save">
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid-2">
                        <Field label="Name"><input name="name" defaultValue={item.name} required /></Field>
                        <Field label="Title"><input name="title" defaultValue={item.title} required /></Field>
                      </div>
                      <div className="grid-2">
                        <Field label="Highlight"><input name="highlight" defaultValue={item.highlight} /></Field>
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
        {team.length === 0 ? <p className="muted">No people yet.</p> : null}
      </div>
      <details className="admin-add">
        <summary>Add a person</summary>
        <AdminForm action={saveTeam} submit="Add" resetOnSuccess>
          <div className="grid-2">
            <Field label="Name"><input name="name" required /></Field>
            <Field label="Title"><input name="title" required /></Field>
          </div>
          <div className="grid-2">
            <Field label="Highlight"><input name="highlight" /></Field>
            <Field label="Sort"><input name="sortOrder" type="number" defaultValue={team.length + 1} /></Field>
          </div>
          <label className="check"><input type="checkbox" name="active" defaultChecked /> Live</label>
        </AdminForm>
      </details>

      <h2 style={{ marginTop: 28 }}>Achievements</h2>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Value</th>
              <th>Title</th>
              <th>Detail</th>
              <th>Status</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {achievements.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td><strong>{item.value}</strong></td>
                  <td>{item.title}</td>
                  <td><div className="cell-clip">{item.detail}</div></td>
                  <td><LiveBadge on={item.active} /></td>
                  <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                  <td className="action-cell"><RowTools id={item.id} remove={removeAchievement} /></td>
                </tr>
                <tr className="editor-row">
                  <td colSpan={6}>
                    <AdminForm action={saveAchievement} submit="Save">
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid-2">
                        <Field label="Value"><input name="value" defaultValue={item.value} required /></Field>
                        <Field label="Title"><input name="title" defaultValue={item.title} required /></Field>
                      </div>
                      <div className="grid-2">
                        <Field label="Detail"><input name="detail" defaultValue={item.detail} /></Field>
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
        {achievements.length === 0 ? <p className="muted">No achievements yet.</p> : null}
      </div>
      <details className="admin-add">
        <summary>Add an achievement</summary>
        <AdminForm action={saveAchievement} submit="Add" resetOnSuccess>
          <div className="grid-2">
            <Field label="Value"><input name="value" required placeholder="18+" /></Field>
            <Field label="Title"><input name="title" required /></Field>
          </div>
          <div className="grid-2">
            <Field label="Detail"><input name="detail" /></Field>
            <Field label="Sort"><input name="sortOrder" type="number" defaultValue={achievements.length + 1} /></Field>
          </div>
          <label className="check"><input type="checkbox" name="active" defaultChecked /> Live</label>
        </AdminForm>
      </details>
    </>
  );
}
