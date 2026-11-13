"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/crest";
import { Icon, type IconName } from "@/components/icons";
import type { SessionUser } from "@/lib/session-token";

type NavPage = { slug: string; title: string; navLabel: string; showInNav: boolean };
type WorkNav = { key: "AGENCY" | "HOST" | "AGENT"; menuLabel: string; title: string };
type Item = { href: string; label: string; note: string };
type Group = { label: string; href: string; icon: IconName; match: string[]; items: Item[] };

export function Header({
  brand,
  pages,
  workPages,
  session,
}: {
  brand: string;
  pages: NavPage[];
  workPages: WorkNav[];
  session: SessionUser | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const work = (key: WorkNav["key"]) => workPages.find((item) => item.key === key);
  const groups: Group[] = [
    {
      label: work("AGENCY")?.menuLabel || "For Agency",
      href: "/agency",
      icon: "crown",
      match: ["/agency", "/host", "/agent"],
      items: [
        {
          href: "/agency",
          label: work("AGENCY")?.title || "How the family works",
          note: "Read this before you register",
        },
        {
          href: "/host",
          label: work("HOST")?.menuLabel || "Host",
          note: work("HOST")?.title || "How a host works",
        },
        {
          href: "/agent",
          label: work("AGENT")?.menuLabel || "Agent",
          note: work("AGENT")?.title || "How an agent works",
        },
      ],
    },
    {
      label: "Diamond Store",
      href: "/packages",
      icon: "diamond",
      match: ["/packages", "/track"],
      items: [
        { href: "/packages", label: "Buy diamonds", note: "Open prices in BDT" },
        { href: "/track", label: "Track an order", note: "Status by order code" },
      ],
    },
    {
      label: "Withdrawal",
      href: "/withdrawal",
      icon: "wallet",
      match: ["/withdrawal"],
      items: [
        { href: "/withdrawal", label: "How withdrawal works", note: "From request to payout" },
        { href: "/withdrawal#request", label: "Request a withdrawal", note: "Sent straight to our team" },
      ],
    },
    {
      label: "About",
      href: "/about",
      icon: "info",
      match: ["/about", "/services", "/contact", "/blog", "/p/"],
      items: [
        { href: "/blog", label: "Blog", note: "Notes from the house" },
        { href: "/about", label: "Our story", note: "Who is behind the name" },
        { href: "/services", label: "Services", note: "Everything we help with" },
        { href: "/contact", label: "Contact", note: "Phone, WhatsApp and email" },
        ...pages
          .filter((page) => page.showInNav)
          .map((page) => ({ href: `/p/${page.slug}`, label: page.navLabel || page.title, note: "Read more" })),
      ],
    },
  ];

  const close = () => {
    setOpen(false);
    setSuppressed(true);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="shell">
        <div className="header-bar">
          <Link href="/" className="logo" aria-label={brand} onClick={close}>
            <Logo />
          </Link>

          <nav
            className={open ? "nav is-open" : "nav"}
            aria-label="Primary"
            data-suppress={suppressed ? "true" : undefined}
            onMouseLeave={() => setSuppressed(false)}
          >
            <ul className="nav-groups">
              {groups.map((group) => {
                const current = group.match.some((prefix) => pathname.startsWith(prefix));
                return (
                  <li key={group.label} className="nav-group" onMouseEnter={() => setSuppressed(false)}>
                    <Link
                      href={group.href}
                      className="nav-trigger"
                      aria-current={current ? "page" : undefined}
                      onClick={close}
                    >
                      <Icon name={group.icon} size={18} />
                      {group.label}
                      <Icon name="chevron" size={14} className="nav-chevron" />
                    </Link>
                    <div className="nav-menu">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} className="nav-item" onClick={close}>
                          <b>{item.label}</b>
                          <span>{item.note}</span>
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="nav-actions">
              <Link className="nav-support" href="/contact" onClick={close}>
                <Icon name="headset" size={18} />
                Support
              </Link>
              {session?.role === "ADMIN" ? (
                <Link className="btn btn-line btn-sm" href="/admin" onClick={close}>
                  Dashboard
                </Link>
              ) : null}
              {session ? (
                <Link className="btn btn-gold btn-sm" href="/account" onClick={close}>
                  <Icon name="user" size={16} />
                  {session.name.split(" ")[0]}
                </Link>
              ) : (
                <Link className="btn btn-gold btn-sm" href="/login" onClick={close}>
                  Log in
                </Link>
              )}
            </div>
          </nav>

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
