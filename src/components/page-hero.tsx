import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  kicker,
  title,
  children,
  align = "left",
}: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className={align === "center" ? "page-hero is-center" : "page-hero"}>
      <div className="page-hero-bg" aria-hidden="true" />
      <div className="shell page-hero-inner">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function JoinBand({ whatsapp }: { whatsapp?: string }) {
  return (
    <section className="shell section tight">
      <div className="cta-band">
        <p className="kicker">There is a place for you here</p>
        <h2>
          Together we <em>grow stronger.</em>
        </h2>
        <p>Join the family as a host or an agent — applying is free and takes two minutes.</p>
        <div className="hero-actions">
          <Link href="/agency#apply" className="btn btn-gold btn-lg">
            Join our agency
          </Link>
          {whatsapp ? (
            <a href={whatsapp} className="btn btn-glass btn-lg">
              Chat on WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
