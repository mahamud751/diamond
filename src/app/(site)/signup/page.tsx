import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CrownScene } from "@/components/crest";
import { AuthForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { readSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage() {
  const session = await readSession();
  if (session) redirect("/account");
  return (
    <section className="shell auth-screen">
      <div className="auth-side">
        <CrownScene />
        <p className="kicker">Join the family</p>
        <h1>
          An account with <em>your name on it.</em>
        </h1>
        <p className="lede">Keep every diamond order in one place. Creating an account is free and does not place an order.</p>
        <ul className="trust-row">
          <li><Icon name="check" size={16} /> Free to create</li>
          <li><Icon name="shield" size={16} /> Email and password only</li>
        </ul>
      </div>
      <AuthForm mode="signup" />
    </section>
  );
}
