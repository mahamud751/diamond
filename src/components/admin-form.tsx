"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import type { FormState } from "@/actions/admin";

export function AdminForm({
  action,
  submit,
  children,
  resetOnSuccess = false,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submit: string;
  children: ReactNode;
  resetOnSuccess?: boolean;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state.ok, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className="stack">
      {children}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-ok">{state.ok}</p> : null}
      <button className="btn btn-gold" disabled={pending}>
        {pending ? "Saving…" : submit}
      </button>
    </form>
  );
}
