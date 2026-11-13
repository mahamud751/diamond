import { Prose } from "@/components/field";
import { Arrow } from "@/components/gem";
import { PageHero } from "@/components/page-hero";
import { RegisterLinks } from "@/components/register-links";
import { registerHref } from "@/lib/format";
import type { HouseData } from "@/lib/content";

type Key = "AGENCY" | "HOST" | "AGENT";

export function WorkPageView({ house, pageKey }: { house: HouseData; pageKey: Key }) {
  const page = house.workPages.find((item) => item.key === pageKey);
  const guides = house.guides.filter((item) => item.page === pageKey);
  const host = registerHref(house.settings.hostRegisterUrl);
  const agent = registerHref(house.settings.agentRegisterUrl);
  const single = pageKey === "HOST" ? host : pageKey === "AGENT" ? agent : "";

  return (
    <>
      <PageHero kicker={page?.kicker || "For agency"} title={page?.title || "How the work goes"}>
        {page?.intro ? <Prose text={page.intro} /> : null}
      </PageHero>
      <section className="shell section">
        <div className="section-head">
          <p className="kicker">In detail</p>
          <h2>Read this before you register.</h2>
        </div>
        {guides.length ? (
          <div className="guide-list">
            {guides.map((item, index) => (
              <article key={item.id} className="guide-card">
                <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <Prose text={item.body} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="lede">The desk has not published these steps yet.</p>
        )}
      </section>
      <section className="shell section tight" id="register">
        <div className="section-head center">
          <p className="kicker">After you have read it</p>
          <h2>{page?.registerLabel || "Register"}</h2>
        </div>
        {pageKey === "AGENCY" ? (
          <RegisterLinks hostUrl={house.settings.hostRegisterUrl} agentUrl={house.settings.agentRegisterUrl} />
        ) : single ? (
          <p className="center-action">
            <a className="btn btn-gold btn-lg" href={single} target="_blank" rel="noreferrer">
              {page?.registerLabel || "Register"} <Arrow />
            </a>
          </p>
        ) : (
          <p className="lede center-copy">This registration link is set in Settings.</p>
        )}
      </section>
    </>
  );
}
