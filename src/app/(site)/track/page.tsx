import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { TrackingForm } from "@/components/tracking-form";

export const metadata: Metadata = { title: "Track your order", robots: { index: false, follow: false } };

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return (
    <>
      <PageHero
        align="center"
        kicker="Track an order"
        title={
          <>
            Where are <em>my diamonds?</em>
          </>
        }
      >
        <p className="lede">Enter your order code and the email you ordered with to see the latest status.</p>
      </PageHero>
      <section className="shell section narrow">
        <TrackingForm code={code?.trim().toUpperCase()} />
      </section>
    </>
  );
}
