import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";

type FormAction = (formData: FormData) => void | Promise<void>;

export function IconForm({
  action,
  id,
  fields,
  label,
  icon,
  tone = "line",
}: {
  action: FormAction;
  id: string;
  fields?: Record<string, string>;
  label: string;
  icon: IconName;
  tone?: "line" | "good" | "danger";
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {fields
        ? Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)
        : null}
      <button className={tone === "line" ? "icon-btn" : `icon-btn is-${tone}`} type="submit" aria-label={label} title={label}>
        <Icon name={icon} size={16} />
      </button>
    </form>
  );
}

export function RowTools({ id, remove, extra }: { id: string; remove?: FormAction; extra?: ReactNode }) {
  return (
    <div className="row-actions">
      {extra}
      <details className="row-editor">
        <summary aria-label="Edit" title="Edit">
          <Icon name="pencil" size={16} />
        </summary>
      </details>
      {remove ? <IconForm action={remove} id={id} label="Delete" icon="trash" tone="danger" /> : null}
    </div>
  );
}
