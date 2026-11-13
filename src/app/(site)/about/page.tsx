import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FamilyScene } from "@/components/family-scene";
import { Prose } from "@/components/field";
import { Arrow } from "@/components/gem";
import { serviceHref } from "@/components/home-view";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/marks";
import { JoinBand, PageHero } from "@/components/page-hero";
import { loadHouse } from "@/lib/content";
import { waLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "About us",
  description: "Who Asian Top 10 Family is: our story, mission and the team behind the agency.",
};

export default async function AboutPage() {
  const house = await loadHouse();
  if (!house) return null;
  const { settings, achievements, services, team } = house;
  return (
    <>
      <PageHero kicker="About us" title={settings.aboutTitle}>
        <p className="lede">{settings.tagline}</p>
      </PageHero>

      <section className="shell section split">
        {settings.heroImage ? (
          <div className="photo-frame">
            <Image src={settings.heroImage} alt="Asian Top 10 Family" fill sizes="(max-width: 900px) 92vw, 46vw" unoptimized />
          </div>
        ) : (
          <FamilyScene />
        )}
        <div>
          <p className="kicker">Our story</p>
          <Prose text={settings.aboutBody} />
        </div>
      </section>

      <section className="shell">
        <div className="duo">
          <article className="panel glow">
            <span className="panel-icon"><Icon name="spark" size={22} /></span>
            <p className="kicker">Mission</p>
            <Prose text={settings.mission} />
          </article>
          <article className="panel glow">
            <span className="panel-icon"><Icon name="crown" size={22} /></span>
            <p className="kicker">Vision</p>
            <Prose text={settings.vision} />
          </article>
        </div>
      </section>

      {achievements.length ? (
        <section className="shell section">
          <div className="section-head">
            <p className="kicker">At a glance</p>
            <h2>
              The standards <em>we keep.</em>
            </h2>
          </div>
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

      {services.length ? (
        <section className="shell section tight">
          <div className="head-row">
            <div className="section-head">
              <p className="kicker">What we do</p>
              <h2>
                How we <em>help.</em>
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
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {team.length ? (
        <section className="shell section tight">
          <div className="section-head">
            <p className="kicker">The team</p>
            <h2>
              The people <em>behind the name.</em>
            </h2>
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

      <JoinBand whatsapp={waLink(settings.whatsapp)} />
    </>
  );
}
