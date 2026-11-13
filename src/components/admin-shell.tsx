"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/actions/auth";
import { Logo } from "@/components/crest";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/guides", label: "Work pages" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Setting" },
];

export function AdminShell({ name, children }: { name: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/" className="logo">
          <Logo sub={`Admin · ${name.split(" ")[0]}`} />
        </Link>
        <nav className="admin-nav" aria-label="Desk">
          {LINKS.map((link) => {
            const current = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction}>
          <button className="nav-link" type="submit">
            Sign out
          </button>
        </form>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
