import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { PasswordForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { StatusPill } from "@/components/status-pill";
import { readSession } from "@/lib/auth";
import { diamondCount, paymentLabel, taka, when } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountPage() {
  const session = await readSession();
  if (!session) redirect("/login?next=/account");
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/login");
  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: user.id }, { email: user.email }] },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHero kicker={user.role === "ADMIN" ? "Admin account" : "Member account"} title={user.name}>
        <p className="lede">
          {user.email}
          {user.phone ? ` · ${user.phone}` : ""}
        </p>
        <div className="hero-actions">
          {user.role === "ADMIN" ? (
            <Link className="btn btn-gold" href="/admin">
              Open dashboard
            </Link>
          ) : null}
          <Link className={user.role === "ADMIN" ? "btn btn-glass" : "btn btn-gold"} href="/packages">
            <Icon name="diamond" size={18} /> Buy diamonds
          </Link>
          <form action={logoutAction}>
            <button className="btn btn-glass">Sign out</button>
          </form>
        </div>
      </PageHero>
      <section className="shell section account-grid">
        <div className="stack">
          <h2 className="h-sm">Your orders</h2>
          {orders.length === 0 ? (
            <div className="panel empty">
              <p>No orders on this account yet.</p>
              <Link className="link-arrow" href="/packages">
                Visit the diamond store
              </Link>
            </div>
          ) : null}
          {orders.map((order) => (
            <article key={order.id} className="panel order-row">
              <div className="order-row-top">
                <strong>{order.code}</strong>
                <StatusPill status={order.status} />
              </div>
              <p>
                {order.packageName} · {diamondCount(order.diamonds)}
              </p>
              <p className="muted">
                {taka(order.amountBdt)} · {paymentLabel(order.paymentMethod)} · UID {order.recipientUid}
              </p>
              <div className="order-row-top">
                <span className="muted">{when(order.createdAt)}</span>
                <Link className="text-link" href={`/track?code=${order.code}`}>
                  Track order
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="panel">
          <h2 className="h-sm">Change password</h2>
          <PasswordForm />
        </div>
      </section>
    </>
  );
}
