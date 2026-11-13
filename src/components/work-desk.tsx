"use client";

import { Fragment, useState } from "react";
import { removeGuide, saveGuide, saveWorkPage } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { LiveBadge } from "@/components/live-badge";
import { RowTools } from "@/components/row-actions";

const PAGES = [
  ["AGENCY", "For Agency"],
  ["HOST", "Host"],
  ["AGENT", "Agent"],
] as const;

type PageKey = (typeof PAGES)[number][0];

type WorkPage = {
  key: PageKey;
  menuLabel: string;
  kicker: string;
  title: string;
  intro: string;
  registerLabel: string;
};

type Guide = {
  id: string;
  title: string;
  body: string;
  page: PageKey;
  sortOrder: number;
  active: boolean;
};

export function WorkDesk({
  initial,
  pages,
  guides,
}: {
  initial: PageKey;
  pages: WorkPage[];
  guides: Guide[];
}) {
  const [current, setCurrent] = useState<PageKey>(initial);

  function select(key: PageKey) {
    setCurrent(key);
    const url = key === "AGENCY" ? "/admin/guides" : `/admin/guides?tab=${key}`;
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      <nav className="desk-tabs" aria-label="Work pages">
        {PAGES.map(([key, fallback]) => {
          const item = pages.find((entry) => entry.key === key);
          const count = guides.filter((entry) => entry.page === key).length;
          return (
            <button key={key} type="button" aria-pressed={key === current} onClick={() => select(key)}>
              {item?.menuLabel || fallback}
              <span>{count}</span>
            </button>
          );
        })}
      </nav>

      {PAGES.map(([key, fallback]) => {
        const page = pages.find((item) => item.key === key);
        const steps = guides.filter((item) => item.page === key);
        const label = page?.menuLabel || fallback;
        return (
          <div key={key} hidden={key !== current}>
            <div className="panel work-editor">
              <h2>{label}</h2>
              <AdminForm action={saveWorkPage} submit="Save page">
                <input type="hidden" name="key" value={key} />
                <div className="grid-2">
                  <Field label="Menu name"><input name="menuLabel" defaultValue={page?.menuLabel} required /></Field>
                  <Field label="Small label"><input name="kicker" defaultValue={page?.kicker} /></Field>
                </div>
                <Field label="Page title"><input name="title" defaultValue={page?.title} required /></Field>
                <Field label="Introduction"><textarea name="intro" defaultValue={page?.intro} required /></Field>
                <Field label="Register button"><input name="registerLabel" defaultValue={page?.registerLabel} /></Field>
              </AdminForm>
            </div>

            <div className="panel table-wrap" style={{ marginTop: 18 }}>
              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Status</th>
                    <th>Order</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {steps.map((item) => (
                    <Fragment key={item.id}>
                      <tr>
                        <td>
                          <strong>{item.title}</strong>
                          <div className="cell-clip">{item.body}</div>
                        </td>
                        <td><LiveBadge on={item.active} /></td>
                        <td>#{String(item.sortOrder).padStart(2, "0")}</td>
                        <td className="action-cell">
                          <RowTools id={item.id} remove={removeGuide} />
                        </td>
                      </tr>
                      <tr className="editor-row">
                        <td colSpan={4}>
                          <AdminForm action={saveGuide} submit="Save">
                            <input type="hidden" name="id" value={item.id} />
                            <GuideFields item={item} />
                          </AdminForm>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
              {steps.length === 0 ? <p className="muted">No steps on this page yet.</p> : null}
            </div>
            <details className="admin-add">
              <summary>Add a step to {label}</summary>
              <AdminForm action={saveGuide} submit="Add step" resetOnSuccess>
                <GuideFields next={steps.length + 1} page={key} />
              </AdminForm>
            </details>
          </div>
        );
      })}
    </>
  );
}

function GuideFields({
  item,
  next = 1,
  page = "AGENCY",
}: {
  item?: { title: string; body: string; page: string; sortOrder: number; active: boolean };
  next?: number;
  page?: string;
}) {
  return (
    <>
      <Field label="Title"><input name="title" defaultValue={item?.title} required /></Field>
      <Field label="Detail"><textarea name="body" defaultValue={item?.body} required style={{ minHeight: 140 }} /></Field>
      <div className="grid-2">
        <Field label="Page">
          <select name="page" defaultValue={item?.page ?? page}>
            {PAGES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort"><input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? next} /></Field>
      </div>
      <label className="check"><input type="checkbox" name="active" defaultChecked={item?.active ?? true} /> Live</label>
    </>
  );
}
