import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/gem";
import { serviceHref } from "@/components/home-view";
import { Mark } from "@/components/marks";
import { JoinBand, PageHero } from "@/components/page-hero";
import { loadHouse } from "@/lib/content";
import { waLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Services",
  description: "Host onboarding, agent partnership, a diamond store and withdrawal support from Asian Top 10 Family.",
};

export default async function ServicesPage() {
  const house = await loadHouse();
  if (!house) return null;
  return (
    <>
      <PageHero
        kicker="Services"
        title={
          <>
            Everything a host or agent needs, <em>in one family.</em>
          </>
        }
      >
        <p className="lede">From your first application to your next payout, this is what our team does for you.</p>
      </PageHero>
      <section className="shell section">
        <div className="service-rows">
          {house.services.map((service, index) => (
            <Link key={service.id} href={serviceHref(service.icon)} className="service-row">
              <span className="service-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="service-icon"><Mark name={service.icon} /></span>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
              <span className="go">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <JoinBand whatsapp={waLink(house.settings.whatsapp)} />
    </>
  );
}
