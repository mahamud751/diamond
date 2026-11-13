import Link from "next/link";
import { Logo } from "@/components/crest";
import { Icon } from "@/components/icons";
import { waLink } from "@/lib/format";
import type { HouseData } from "@/lib/content";

export function Footer({ house }: { house: HouseData }) {
  const { settings, pages } = house;
  const socials = [
    settings.facebook ? { href: settings.facebook, label: "Facebook" } : null,
    settings.instagram ? { href: settings.instagram, label: "Instagram" } : null,
    settings.telegram ? { href: settings.telegram, label: "Telegram" } : null,
    settings.whatsapp ? { href: waLink(settings.whatsapp), label: "WhatsApp" } : null,
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <footer className="site-footer">
      <div className="shell">
        <p className="footer-motto" aria-hidden="true">
          <Icon name="crown" size={22} />
          <span>Together we grow stronger</span>
          <Icon name="crown" size={22} />
        </p>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo" aria-label={settings.brandName}>
              <Logo />
            </Link>
            <p>{settings.tagline}</p>
            {socials.length ? (
              <div className="footer-socials">
                {socials.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <nav aria-label="Agency">
            <h2>Agency</h2>
            <Link href="/agency">For agency</Link>
            <Link href="/host">Host</Link>
            <Link href="/agent">Agent</Link>
            <Link href="/withdrawal">Withdrawal</Link>
            <Link href="/services">Services</Link>
          </nav>
          <nav aria-label="Diamond store">
            <h2>Diamond store</h2>
            <Link href="/packages">Buy diamonds</Link>
            <Link href="/track">Track an order</Link>
            <Link href="/signup">Create account</Link>
            <Link href="/login">Log in</Link>
          </nav>
          <div>
            <h2>Reach us</h2>
            <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <p>{settings.address}</p>
            <p>{settings.hours}</p>
          </div>
        </div>
        <div className="footer-base">
          <span>
            © {new Date().getFullYear()} {settings.brandName}. Chamet is a trademark of its respective owner.
          </span>
          <span className="footer-pages">
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            {pages.map((page) => (
              <Link key={page.slug} href={`/p/${page.slug}`}>
                {page.title}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
