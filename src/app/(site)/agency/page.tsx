import type { Metadata } from "next";
import Link from "next/link";
import { AgencyForm } from "@/components/forms";
import { Arrow } from "@/components/gem";
import { Icon, type IconName } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { readSession } from "@/lib/auth";
import { loadHouse } from "@/lib/content";
import { waLink } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "For Agency",
  description: "Join Asian Top 10 Family as a Chamet host or agent. See how the agency works and apply in two minutes.",
};

const BENEFITS: { icon: IconName; title: string; body: string }[] = [
  { icon: "user", title: "A manager who knows your name", body: "You are not a row in a spreadsheet. Every host and agent has a person to ask." },
  { icon: "shield", title: "Clear rules, explained first", body: "We explain how the agency works before you start, so there are no surprises later." },
  { icon: "chart", title: "Guidance that helps you grow", body: "Practical advice on going live, building an audience and leading a team." },
  { icon: "wallet", title: "Help with withdrawals", body: "Send a request and follow it with our team from review to payout." },
  { icon: "diamond", title: "A diamond store beside you", body: "Open prices in taka and delivery to the UID you name, verified by people." },
  { icon: "chat", title: "Support in your language", body: "Reach us in English or Bangla by WhatsApp, phone or the support form." },
];

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: "chat", title: "Send the application", body: "Choose host or agent and tell us a little about yourself." },
  { icon: "phone", title: "We contact you", body: "A team member reviews it and reaches you on the number you gave." },
  { icon: "shield", title: "Get set up", body: "We walk you through your account and the house rules." },
  { icon: "crown", title: "Start growing", body: "Go live or build your team with the family behind you." },
];

export default async function AgencyPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const [{ role }, house, session] = await Promise.all([searchParams, loadHouse(), readSession()]);
  if (!house) return null;
  const user = session ? await prisma.user.findUnique({ where: { id: session.id } }) : null;
  return (
    <>
      <PageHero
        kicker="For agency"
        title={
          <>
            Grow together. Earn together. <em>Succeed together.</em>
          </>
        }
      >
        <p className="lede">
          Join Asian Top 10 Family as a Chamet host or agent and get a team that stands beside you — from your first day to your next payout.
        </p>
        <div className="hero-actions">
          <a href="#apply" className="btn btn-gold btn-lg">
            Apply now <Arrow />
          </a>
          <a href={waLink(house.settings.whatsapp)} className="btn btn-glass btn-lg">
            <Icon name="chat" size={18} /> Ask on WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="shell section" id="paths">
        <div className="section-head center">
          <p className="kicker">Choose your path</p>
          <h2>
            Host or agent — <em>both are family.</em>
          </h2>
        </div>
        <div className="path-grid">
          <article className="path-card">
            <span className="path-icon"><Icon name="mic" size={28} /></span>
            <p className="path-tag">Path 01</p>
            <h3>Host</h3>
            <p>You go live yourself, connect with your audience and earn, with a manager guiding your start.</p>
            <ul className="check-list">
              <li><Icon name="check" size={16} /> Step-by-step onboarding</li>
              <li><Icon name="check" size={16} /> Guidance on streaming and house rules</li>
              <li><Icon name="check" size={16} /> Help with withdrawals when you need it</li>
            </ul>
            <Link href="/agency?role=host#apply" className="btn btn-gold">
              Apply as host <Arrow />
            </Link>
          </article>
          <article className="path-card is-gold">
            <span className="path-icon"><Icon name="users" size={28} /></span>
            <p className="path-tag">Path 02</p>
            <h3>Agent</h3>
            <p>You bring and guide your own hosts under the family name, with structure and a partner beside you.</p>
            <ul className="check-list">
              <li><Icon name="check" size={16} /> Support for recruiting and onboarding hosts</li>
              <li><Icon name="check" size={16} /> A direct line to the agency team</li>
              <li><Icon name="check" size={16} /> Growth that is shared, not competed for</li>
            </ul>
            <Link href="/agency?role=agent#apply" className="btn btn-line">
              Apply as agent <Arrow />
            </Link>
          </article>
        </div>
      </section>

      <section className="band-light section">
        <div className="shell">
          <div className="section-head center">
            <p className="kicker">Why join us</p>
            <h2>
              What the family <em>gives you.</em>
            </h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map((item) => (
              <article key={item.title} className="benefit">
                <span className="benefit-icon"><Icon name={item.icon} size={22} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section">
        <div className="section-head center">
          <p className="kicker">How it works</p>
          <h2>
            Four steps to <em>get started.</em>
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

      <section className="shell section tight apply-grid" id="apply">
        <div>
          <p className="kicker">Apply</p>
          <h2>
            Join the family <em>today.</em>
          </h2>
          <p className="lede">Fill in the form and a team member will contact you. Applying is free.</p>
          <ul className="check-list">
            <li><Icon name="check" size={16} /> Reviewed by a person, not a bot</li>
            <li><Icon name="check" size={16} /> We reply on the phone or WhatsApp number you give</li>
            <li><Icon name="check" size={16} /> Adults only — you must be 18 or older</li>
          </ul>
          <p className="demo-note">
            Earnings, commission and payout terms are confirmed by the agency team during onboarding.
          </p>
        </div>
        <div className="panel glow">
          <AgencyForm
            role={role?.toLowerCase() === "agent" ? "AGENT" : "HOST"}
            prefill={user ? { name: user.name, email: user.email, phone: user.phone ?? "" } : undefined}
          />
        </div>
      </section>
    </>
  );
}
