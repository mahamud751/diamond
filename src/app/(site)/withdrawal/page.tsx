import type { Metadata } from "next";
import { WithdrawalForm } from "@/components/forms";
import { Arrow } from "@/components/gem";
import { Icon, type IconName } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { readSession } from "@/lib/auth";
import { loadHouse } from "@/lib/content";
import { waLink } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Withdrawal",
  description: "Request a withdrawal of your earnings through Asian Top 10 Family and follow it with our team.",
};

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: "wallet", title: "Send a request", body: "Tell us your UID, the amount and where you want to be paid." },
  { icon: "search", title: "We verify it", body: "The team checks the request against your agency record." },
  { icon: "chat", title: "We confirm with you", body: "You hear from us before anything is paid, on the number you gave." },
  { icon: "check", title: "Payout", body: "The payment is sent to the wallet or account you named." },
];

export default async function WithdrawalPage() {
  const [house, session] = await Promise.all([loadHouse(), readSession()]);
  if (!house) return null;
  const user = session ? await prisma.user.findUnique({ where: { id: session.id } }) : null;
  return (
    <>
      <PageHero
        kicker="Withdrawal"
        title={
          <>
            Your earnings, <em>paid with care.</em>
          </>
        }
      >
        <p className="lede">Send a withdrawal request to our team and follow it from review to payout. Every request is handled by a person.</p>
        <div className="hero-actions">
          <a href="#request" className="btn btn-gold btn-lg">
            Request a withdrawal <Arrow />
          </a>
          <a href={waLink(house.settings.whatsapp)} className="btn btn-glass btn-lg">
            <Icon name="chat" size={18} /> Ask on WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="shell section">
        <div className="section-head center">
          <p className="kicker">How it works</p>
          <h2>
            From request <em>to payout.</em>
          </h2>
        </div>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="step-icon"><Icon name={step.icon} size={24} /></span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell section tight apply-grid" id="request">
        <div>
          <p className="kicker">Request</p>
          <h2>
            Withdraw your <em>earnings.</em>
          </h2>
          <p className="lede">Have these ready before you send the request.</p>
          <ul className="check-list">
            <li><Icon name="check" size={16} /> Your Chamet UID</li>
            <li><Icon name="check" size={16} /> The amount you want to withdraw</li>
            <li><Icon name="check" size={16} /> A bKash, Nagad, Rocket, Upay or bank account in your name</li>
          </ul>
          <div className="notice">
            <Icon name="shield" size={20} />
            <p>
              We never ask for your password or a one-time code. Withdrawal amounts, rates and payout times are confirmed by the
              agency team for each request.
            </p>
          </div>
        </div>
        <div className="panel glow">
          <WithdrawalForm prefill={user ? { name: user.name, email: user.email, phone: user.phone ?? "" } : undefined} />
        </div>
      </section>
    </>
  );
}
