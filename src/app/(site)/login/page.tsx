import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CrownScene } from "@/components/crest";
import { AuthForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { readSession } from "@/lib/auth";
import { safeNext } from "@/lib/form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await readSession();
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/account");
  const { next } = await searchParams;
  return (
    <section className="shell auth-screen">
      <div className="auth-side">
        <CrownScene />
        <p className="kicker">Member account</p>
        <h1>
          Welcome back to <em>the family.</em>
        </h1>
        <p className="lede">Your orders, their status and your password — all in one place.</p>
        <p className="bangla" lang="bn">
          অ্যাকাউন্টে অর্ডার, স্ট্যাটাস, এবং পাসওয়ার্ড — সব এক জায়গায়।
        </p>
        <ul className="trust-row">
          <li><Icon name="shield" size={16} /> Private session</li>
          <li><Icon name="check" size={16} /> Orders verified by people</li>
        </ul>
      </div>
      <div>
        <AuthForm mode="login" nextPath={safeNext(next)} />
        {process.env.NODE_ENV !== "production" ? (
          <div className="starter">
            <p>Starter access for local development. Change the passwords after signing in.</p>
            <p>
              Admin <code>admin@asiantop10.family</code> · <code>At10Family#2026</code>
            </p>
            <p>
              Member <code>member@asiantop10.family</code> · <code>Member#2026</code>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
