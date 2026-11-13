"use client";

import { useActionState } from "react";
import { trackOrder, type TrackingState } from "@/actions/tracking";
import { StatusPill } from "@/components/status-pill";

export function TrackingForm({ code = "" }: { code?: string }) {
  const [state, action, pending] = useActionState<TrackingState, FormData>(trackOrder, {});
  return (
    <>
      <form className="panel glow stack" action={action}>
        <label className="field">
          <span>Order code</span>
          <input name="code" defaultValue={code} placeholder="AT10-XXXXXX" required maxLength={35} />
        </label>
        <label className="field">
          <span>Order email</span>
          <input name="email" type="email" autoComplete="email" placeholder="The email used when ordering" required maxLength={254} />
        </label>
        {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
        <button className="btn btn-gold btn-block" disabled={pending}>
          {pending ? "Looking up…" : "Track my order"}
        </button>
      </form>
      {state.order ? (
        <article className="panel order-row" style={{ marginTop: 18 }} aria-live="polite">
          <div className="order-row-top">
            <strong>{state.order.code}</strong>
            <StatusPill status={state.order.status} />
          </div>
          <p>
            {state.order.packageName} · {state.order.diamonds}
          </p>
          <p className="muted">
            {state.order.amount} · {state.order.payment}
          </p>
          <p className="muted">Placed {state.order.placed}</p>
        </article>
      ) : null}
    </>
  );
}
