import type { Metadata } from "next";
import { CrownScene } from "@/components/crest";
import { AuthForm } from "@/components/forms";
import { RegisterLinks } from "@/components/register-links";
import { readSession } from "@/lib/auth";
import { loadHouse } from "@/lib/content";

export const metadata: Metadata = {
  title: "Register",
  description: "Register with Asian Top 10 Family as a host or an agent.",
};

export default async function SignupPage() {
  const [house, session] = await Promise.all([loadHouse(), readSession()]);
  return (
    <section className="shell section auth-register">
      <div className="section-head center">
        <CrownScene />
        <p className="kicker">Registration</p>
        <h1>
          Choose host <em>or agent.</em>
        </h1>
        <p className="lede">Two links. The desk sets both. হোস্ট বা এজেন্ট — যেটা আপনার, সেই লিংকে যান।</p>
      </div>
      <RegisterLinks hostUrl={house?.settings.hostRegisterUrl ?? ""} agentUrl={house?.settings.agentRegisterUrl ?? ""} />
      {session ? null : (
        <div className="auth-screen member-account">
          <div className="auth-side">
            <p className="kicker">Diamond orders</p>
            <h2>
              A member account is separate.
            </h2>
            <p className="lede">Use this only to keep diamond orders in one place. It does not register you as a host or an agent.</p>
          </div>
          <AuthForm mode="signup" />
        </div>
      )}
    </section>
  );
}
