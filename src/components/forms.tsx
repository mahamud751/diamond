"use client";

import { useActionState } from "react";
import Link from "next/link";
import { changePassword, loginAction, signupAction, type AuthState, type PasswordState } from "@/actions/auth";
import { applyToAgency, requestWithdrawal, sendMessage, type ContactState } from "@/actions/orders";
import { Icon } from "@/components/icons";
import { PAYMENTS } from "@/lib/format";
import { Field } from "@/components/field";

export function AuthForm({ mode, nextPath = "/account" }: { mode: "login" | "signup"; nextPath?: string }) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});

  return (
    <form className="auth-card stack" action={formAction}>
      <p className="kicker">{mode === "login" ? "Welcome back" : "Open an account"}</p>
      <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
      {mode === "signup" ? (
        <Field label="Name">
          <input name="name" required autoComplete="name" />
        </Field>
      ) : null}
      <Field label="Email">
        <input name="email" type="email" required autoComplete="email" />
      </Field>
      {mode === "signup" ? (
        <Field label="Phone">
          <input name="phone" autoComplete="tel" />
        </Field>
      ) : null}
      <Field label="Password" hint={mode === "signup" ? "At least 8 characters." : undefined}>
        <input name="password" type="password" required autoComplete={mode === "login" ? "current-password" : "new-password"} />
      </Field>
      {mode === "signup" ? (
        <Field label="Confirm password">
          <input name="confirm" type="password" required autoComplete="new-password" />
        </Field>
      ) : (
        <input type="hidden" name="next" value={nextPath} />
      )}
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      <button className="btn btn-gold btn-block" disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      {mode === "login" ? (
        <p className="muted">
          New here? <Link className="text-link" href="/signup">Create an account</Link>
        </p>
      ) : (
        <p className="muted">
          Already have an account? <Link className="text-link" href="/login">Sign in</Link>
        </p>
      )}
    </form>
  );
}

function Received({ title, body }: { title: string; body: string }) {
  return (
    <div className="form-done" role="status">
      <span className="form-done-icon">
        <Icon name="check" size={26} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, {});
  if (state.ok) return <Received title="We have your message." body={state.ok} />;
  return (
    <form className="stack" action={action}>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Field label="Name">
        <input name="name" required autoComplete="name" />
      </Field>
      <div className="grid-2">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="Phone">
          <input name="phone" autoComplete="tel" />
        </Field>
      </div>
      <Field label="Subject">
        <input name="subject" required />
      </Field>
      <Field label="Message">
        <textarea name="message" required minLength={10} />
      </Field>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      <button className="btn btn-gold btn-block" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export function AgencyForm({ prefill, role = "HOST" }: { prefill?: { name?: string; email?: string; phone?: string }; role?: "HOST" | "AGENT" }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(applyToAgency, {});
  if (state.ok) return <Received title="Welcome — application received." body={state.ok} />;
  return (
    <form className="stack" action={action}>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <fieldset className="choice">
        <legend>I want to join as</legend>
        <label>
          <input type="radio" name="role" value="HOST" defaultChecked={role === "HOST"} />
          <span>
            <Icon name="mic" size={20} />
            <b>Host</b>
            <small>I go live myself</small>
          </span>
        </label>
        <label>
          <input type="radio" name="role" value="AGENT" defaultChecked={role === "AGENT"} />
          <span>
            <Icon name="users" size={20} />
            <b>Agent</b>
            <small>I bring and guide hosts</small>
          </span>
        </label>
      </fieldset>
      <div className="grid-2">
        <Field label="Full name">
          <input name="name" required autoComplete="name" defaultValue={prefill?.name ?? ""} />
        </Field>
        <Field label="Phone / WhatsApp">
          <input name="phone" required autoComplete="tel" defaultValue={prefill?.phone ?? ""} />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" defaultValue={prefill?.email ?? ""} />
        </Field>
        <Field label="City / country">
          <input name="location" required />
        </Field>
      </div>
      <Field label="Chamet UID" hint="Optional — leave empty if you do not have an account yet.">
        <input name="uid" maxLength={40} autoComplete="off" />
      </Field>
      <Field label="About you" hint="Experience, languages, hours you can be online, or the size of your team.">
        <textarea name="about" required minLength={10} maxLength={1200} />
      </Field>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      <button className="btn btn-gold btn-block" disabled={pending}>
        {pending ? "Sending…" : "Send application"}
      </button>
      <p className="form-note">Applying is free. A team member reviews every application personally.</p>
    </form>
  );
}

export function WithdrawalForm({ prefill }: { prefill?: { name?: string; email?: string; phone?: string } }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(requestWithdrawal, {});
  if (state.ok) return <Received title="Request received." body={state.ok} />;
  return (
    <form className="stack" action={action}>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid-2">
        <Field label="Full name">
          <input name="name" required autoComplete="name" defaultValue={prefill?.name ?? ""} />
        </Field>
        <Field label="Chamet UID">
          <input name="uid" required minLength={3} maxLength={40} autoComplete="off" />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Phone / WhatsApp">
          <input name="phone" required autoComplete="tel" defaultValue={prefill?.phone ?? ""} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" defaultValue={prefill?.email ?? ""} />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Amount to withdraw" hint="Write the amount exactly as it shows in your account.">
          <input name="amount" required maxLength={40} />
        </Field>
        <Field label="Payout method">
          <select name="method" defaultValue="BKASH">
            {PAYMENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Number or account to pay">
        <input name="account" required minLength={4} maxLength={120} autoComplete="off" />
      </Field>
      <Field label="Note">
        <textarea name="note" maxLength={800} placeholder="Optional" />
      </Field>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      <button className="btn btn-gold btn-block" disabled={pending}>
        {pending ? "Sending…" : "Send withdrawal request"}
      </button>
      <p className="form-note">Nothing is paid automatically. Our team checks each request against your agency record first.</p>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  return (
    <form className="stack" action={action}>
      <Field label="Current password">
        <input name="current" type="password" required autoComplete="current-password" />
      </Field>
      <Field label="New password">
        <input name="next" type="password" required minLength={8} autoComplete="new-password" />
      </Field>
      <Field label="Confirm new password">
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" />
      </Field>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      {state.ok ? <p className="form-ok" role="status">{state.ok}</p> : null}
      <button className="btn btn-line" disabled={pending}>
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
