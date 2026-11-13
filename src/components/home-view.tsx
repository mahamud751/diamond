import Image from "next/image";
import Link from "next/link";
import { CrownScene } from "@/components/crest";
import { FamilyScene } from "@/components/family-scene";
import { ContactForm } from "@/components/forms";
import { Arrow, Gem } from "@/components/gem";
import { HomeFaq, HomePackages, RevealEffects } from "@/components/home-interactions";
import { Icon, type IconName } from "@/components/icons";
import { Mark } from "@/components/marks";
import { waLink } from "@/lib/format";
import type { HouseData } from "@/lib/content";

const QUICK: { href: string; icon: IconName; title: string; note: string }[] = [
  { href: "/agency", icon: "users", title: "Join Agency", note: "Be an agent or host" },
  { href: "/packages", icon: "diamond", title: "Buy Diamonds", note: "Open prices, fast delivery" },
  { href: "/withdrawal", icon: "wallet", title: "Withdrawal", note: "Withdraw your earnings" },
];

const STEPS: { icon: IconName; title: string; body: string }[] = [
  { icon: "chat", title: "Apply in two minutes", body: "Tell us whether you are joining as a host or an agent. A team member reads every application." },
  { icon: "shield", title: "Get set up with a manager", body: "We walk you through your account, the house rules and what a good first week looks like." },
  { icon: "chart", title: "Grow with the family", body: "Go live, build your team and keep improving with people who answer when you ask." },
  { icon: "wallet", title: "Withdraw your earnings", body: "Send a withdrawal request and follow it with our team from review to payout." },
];

export function serviceHref(icon: string) {
  if (icon === "diamond") return "/packages";
  if (icon === "account" || icon === "globe") return "/agency";
  if (icon === "shield") return "/withdrawal";
  return "/contact";
}

export function splitMotto(value: string) {
  const parts = value.split(/\s*[·•|]\s*/).map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts : [];
}

export function HomeView({ house }: { house: HouseData }) {
  const { settings, services, achievements, testimonials, team, packages } = house;
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    email: settings.email,
    telephone: settings.phone,
  }).replace(/</g, "\\u003c");

  const words = settings.heroTitle.trim().split(/\s+/);
  const lead = (words.length > 3 ? words.slice(0, -2).join(" ") : words.join(" ")).replace(/Top 10/g, "Top\u00a010");
  const accent = words.length > 3 ? words.slice(-2).join(" ") : "";
  const motto = splitMotto(settings.tagline);
  const ticker = motto.length ? motto : ["Grow together", "Earn together", "Succeed together"];

  return (
    <>
      <RevealEffects />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="chip">
              <Icon name="crown" size={16} />
              {settings.heroKicker}
            </p>
            <h1>
              {lead}
              {accent ? <em> {accent}</em> : null}
            </h1>
            {motto.length ? (
              <p className="motto">
                {motto.map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </p>
            ) : null}
            <p className="hero-sub">{settings.heroSubtitle}</p>
            {settings.heroBangla ? (
              <p className="hero-bangla" lang="bn">
                {settings.heroBangla}
              </p>
            ) : null}
            <div className="hero-actions">
              <Link href="/agency" className="btn btn-gold btn-lg">
                Join our agency <Arrow />
              </Link>
              <Link href="/packages" className="btn btn-glass btn-lg">
                <Icon name="diamond" size={18} /> Diamond store
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <CrownScene />
            <span className="float-gem g1"><Gem /></span>
            <span className="float-gem g2"><Gem /></span>
            <span className="float-gem g3"><Gem /></span>
            <span className="float-gem g4"><Gem /></span>
            <span className="float-gem g5"><Gem /></span>
          </div>
        </div>

        <div className="shell quick">
          {QUICK.map((item) => (
            <Link key={item.href} href={item.href} className="quick-card">
              <span className="quick-icon">
                <Icon name={item.icon} size={30} />
              </span>
              <span className="quick-text">
                <b>{item.title}</b>
                <small>{item.note}</small>
              </span>
              <span className="go">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1, 2, 3].map((loop) =>
            ticker.map((part) => (
              <span key={`${loop}-${part}`}>
                {part}
                <Icon name="spark" size={16} />
              </span>
            )),
          )}
        </div>
      </div>

      <section className="shell section split" id="discover" data-reveal>
        {settings.heroImage ? (
          <div className="photo-frame">
            <Image src={settings.heroImage} alt="Asian Top 10 Family" fill sizes="(max-width: 900px) 92vw, 46vw" unoptimized />
          </div>
        ) : (
          <FamilyScene />
        )}
        <div>
          <p className="kicker">Who we are</p>
          <h2>{settings.introTitle}</h2>
          <p className="prose">{settings.introBody}</p>
          <ul className="check-list">
            <li><Icon name="check" size={16} /> A named manager for every host and agent</li>
            <li><Icon name="check" size={16} /> Diamond prices shown before you pay</li>
            <li><Icon name="check" size={16} /> Withdrawals reviewed by real people</li>
          </ul>
          <Link href="/about" className="link-arrow">
            Read our story <Arrow diagonal />
          </Link>
        </div>
      </section>

      {achievements.length ? (
        <section className="shell" data-reveal>
          <div className="stat-row">
            {achievements.map((item) => (
              <article key={item.id} className="stat">
                <b>{item.value}</b>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="shell section" data-reveal>
        <div className="section-head center">
          <p className="kicker">For agency</p>
          <h2>
            Two ways to join. <em>One family.</em>
          </h2>
          <p className="lede">Whether you go live yourself or lead a team of hosts, you get the same support behind you.</p>
        </div>
        <div className="path-grid">
          <article className="path-card">
            <span className="path-icon"><Icon name="mic" size={28} /></span>
            <p className="path-tag">Path 01</p>
            <h3>Become a host</h3>
            <p>Go live, connect with your audience and earn — with a manager who helps you start well and keep growing.</p>
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
            <h3>Become an agent</h3>
            <p>Bring your own hosts under the family name and build a team with structure, tools and a partner beside you.</p>
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

      <section className="band-light section" data-reveal>
        <div className="shell">
          <div className="head-row">
            <div className="section-head">
              <p className="kicker">Diamond store</p>
              <h2>
                More diamonds. <em>Clear prices.</em>
              </h2>
              <p className="lede">Pick a package, enter your Chamet UID and pay with the wallet you already use.</p>
            </div>
            <Link href="/packages" className="link-arrow">
              View all packages <Arrow diagonal />
            </Link>
          </div>
          <HomePackages packages={packages} />
          <div className="pay-strip">
            <span>Pay your way</span>
            <b className="pay-bkash">bKash</b>
            <b className="pay-nagad">Nagad</b>
            <b className="pay-rocket">Rocket</b>
            <b className="pay-upay">Upay</b>
            <b>Bank</b>
            <span className="pay-secure">
              <Icon name="shield" size={16} /> Every payment verified by our team
            </span>
          </div>
        </div>
      </section>

      <section className="shell section" data-reveal>
        <div className="section-head center">
          <p className="kicker">How it works</p>
          <h2>
            From first hello to <em>first payout.</em>
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

      {services.length ? (
        <section className="shell section tight" data-reveal>
          <div className="head-row">
            <div className="section-head">
              <p className="kicker">What we do</p>
              <h2>
                Everything in <em>one place.</em>
              </h2>
            </div>
            <Link href="/services" className="link-arrow">
              All services <Arrow diagonal />
            </Link>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <Link href={serviceHref(service.icon)} className="service-card" key={service.id}>
                <span className="service-top">
                  <span className="service-icon"><Mark name={service.icon} /></span>
                  <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <span className="service-link">
                  Learn more <Arrow diagonal />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {team.length ? (
        <section className="shell section tight" data-reveal>
          <div className="head-row">
            <div className="section-head">
              <p className="kicker">The team</p>
              <h2>
                People you can <em>actually reach.</em>
              </h2>
            </div>
            <span className="demo-label">Sample team · edit in admin</span>
          </div>
          <div className="team-grid">
            {team.map((person) => (
              <article key={person.id} className="person">
                <span className="avatar" aria-hidden="true">
                  {person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                </span>
                <h3>{person.name}</h3>
                <em>{person.title}</em>
                <p>{person.highlight}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {testimonials.length ? (
        <section className="band-light section" data-reveal>
          <div className="shell">
            <div className="head-row">
              <div className="section-head">
                <p className="kicker">Family voices</p>
                <h2>
                  Trusted by the people <em>we work with.</em>
                </h2>
              </div>
              <span className="demo-label">Sample reviews · edit in admin</span>
            </div>
            <div className="quote-grid">
              {testimonials.map((item) => (
                <figure key={item.id} className="quote">
                  <span className="stars" aria-label={`${item.rating} out of 5 stars`}>
                    {"★".repeat(item.rating)}
                  </span>
                  <blockquote>{item.quote}</blockquote>
                  <figcaption>
                    <span className="avatar sm" aria-hidden="true">{item.name.charAt(0)}</span>
                    <span>
                      <b>{item.name}</b>
                      <small>{item.role}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell section faq" data-reveal>
        <div className="section-head">
          <p className="kicker">Good to know</p>
          <h2>
            Questions, <em>answered.</em>
          </h2>
          <p className="lede">Still unsure? Our team is one message away.</p>
          <Link href="/contact" className="link-arrow">
            Talk to support <Arrow diagonal />
          </Link>
        </div>
        <HomeFaq />
      </section>

      <section className="shell" data-reveal>
        <div className="cta-band">
          <span className="cta-gem c1" aria-hidden="true"><Gem /></span>
          <span className="cta-gem c2" aria-hidden="true"><Gem /></span>
          <p className="kicker">There is a place for you here</p>
          <h2>
            Together we <em>grow stronger.</em>
          </h2>
          <p>Join the family as a host or an agent — applying is free and takes two minutes.</p>
          <div className="hero-actions">
            <Link href="/agency#apply" className="btn btn-gold btn-lg">
              Join our agency <Arrow />
            </Link>
            <a href={waLink(settings.whatsapp)} className="btn btn-glass btn-lg">
              <Icon name="chat" size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="shell section contact-grid" id="contact" data-reveal>
        <div>
          <p className="kicker">Support</p>
          <h2>
            Say hello. <em>We answer.</em>
          </h2>
          <p className="lede">A question about joining, an order or a withdrawal — send it here and a team member will reply.</p>
          <ul className="contact-list">
            <li>
              <span className="contact-icon"><Icon name="phone" size={18} /></span>
              <span>
                <small>Call us</small>
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </span>
            </li>
            <li>
              <span className="contact-icon"><Icon name="mail" size={18} /></span>
              <span>
                <small>Email</small>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </span>
            </li>
            <li>
              <span className="contact-icon"><Icon name="clock" size={18} /></span>
              <span>
                <small>Hours</small>
                {settings.hours}
              </span>
            </li>
          </ul>
          <p className="demo-note">Demo contact details · replace in admin before launch.</p>
        </div>
        <div className="panel glow">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
