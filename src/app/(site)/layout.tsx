import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { readSession } from "@/lib/auth";
import { loadHouse } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [house, session] = await Promise.all([loadHouse(), readSession()]);
  if (!house) {
    return (
      <>
        <p className="seed-banner">PostgreSQL is connected. Run npm run db:seed to load the site content.</p>
        {children}
      </>
    );
  }
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Header
        brand={house.settings.brandName}
        pages={house.pages}
        workPages={house.workPages.map((item) => ({
          key: item.key,
          menuLabel: item.menuLabel,
          title: item.title,
        }))}
        session={session}
      />
      <main id="content">{children}</main>
      <Footer house={house} />
    </>
  );
}
