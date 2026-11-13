"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { changePassword, loginAction, signupAction, type AuthState, type PasswordState } from "@/actions/auth";
import { requestWithdrawal, sendMessage, submitReview, type ContactState } from "@/actions/orders";
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
        {mode === "login" ? (
          <PasswordInput name="password" autoComplete="current-password" />
        ) : (
          <input name="password" type="password" required autoComplete="new-password" />
        )}
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

function PasswordInput({ name, autoComplete }: { name: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input name={name} type={visible ? "text" : "password"} required autoComplete={autoComplete} />
      <button
        className="password-toggle"
        type="button"
        aria-pressed={visible}
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.4" />
            <path d="M6.1 6.1C3.8 7.8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.1-.9" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function ReviewForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitReview, {});
  if (state.ok) {
    return (
      <div className="panel review-compose">
        <p className="form-ok" role="status">{state.ok}</p>
      </div>
    );
  }
  return (
    <form className="panel stack review-compose" action={action}>
      <h3>Leave a note</h3>
      <p className="muted">It appears on the site after the desk accepts it. আপনার রিভিউ অ্যাডমিন গ্রহণ করলে সাইটে দেখা যাবে।</p>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid-2">
        <Field label="Name">
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
        </Field>
      </div>
      <div className="grid-2">
        <Field label="Place" hint="Optional. For example, Member, Dhaka.">
          <input name="role" maxLength={80} placeholder="Member, Dhaka" />
        </Field>
        <Field label="Rating">
          <select name="rating" defaultValue="5">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </Field>
      </div>
      <Field label="Your note">
        <textarea name="quote" required minLength={10} maxLength={600} placeholder="Write a short note about the family." />
      </Field>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      <button className="btn btn-gold btn-block" disabled={pending}>
        {pending ? "Sending…" : "Send note"}
      </button>
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
