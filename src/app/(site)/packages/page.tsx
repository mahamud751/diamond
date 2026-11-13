import type { Metadata } from "next";
import { Prose } from "@/components/field";
import { Icon } from "@/components/icons";
import { PackageDesk } from "@/components/package-desk";
import { PageHero } from "@/components/page-hero";
import { readSession } from "@/lib/auth";
import { loadHouse } from "@/lib/content";
import { rateLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Diamond Store",
  description: "Choose a Chamet diamond package, enter your UID and place the order with Asian Top 10 Family.",
};

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const selected = (await searchParams).package;
  const [house, session] = await Promise.all([loadHouse(), readSession()]);
  if (!house) return null;
  const user = session ? await prisma.user.findUnique({ where: { id: session.id } }) : null;
  return (
    <>
      <PageHero kicker="Diamond store · open prices" title={house.settings.packageTitle}>
        <Prose text={house.settings.packageIntro} />
        <p className="rate-note">Dollar prices follow the house rate: {rateLabel(house.usdRate)}.</p>
      </PageHero>
      <section className="shell section">
        <PackageDesk
          packages={house.packages}
          initialPackage={selected}
          wallets={{
            BKASH: house.settings.bkash,
            NAGAD: house.settings.nagad,
            ROCKET: house.settings.rocket,
            UPAY: house.settings.upay,
            BANK: house.settings.bankDetails,
          }}
          prefill={user ? { name: user.name, email: user.email, phone: user.phone ?? "" } : undefined}
        />
        <ol className="steps is-three">
          <li className="step">
            <span className="step-num">01</span>
            <span className="step-icon"><Icon name="diamond" size={24} /></span>
            <h3>Choose a package</h3>
            <p>The price in taka on the card is the price you pay. No extra fees are added at checkout.</p>
          </li>
          <li className="step">
            <span className="step-num">02</span>
            <span className="step-icon"><Icon name="user" size={24} /></span>
            <h3>Enter your UID</h3>
            <p>Write the Chamet UID carefully — diamonds are delivered to exactly the account you name.</p>
          </li>
          <li className="step">
            <span className="step-num">03</span>
            <span className="step-icon"><Icon name="shield" size={24} /></span>
            <h3>Pay and confirm</h3>
            <p>Pay by bKash, Nagad, Rocket, Upay or bank and send the transaction ID. Our team verifies and delivers.</p>
          </li>
        </ol>
      </section>
    </>
  );
}
