import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { taka, when } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const [orders, pending, packages, unread, members, recent, messages] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.package.count({ where: { active: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  const metrics = [
    { label: "Open orders", value: pending },
    { label: "All orders", value: orders },
    { label: "Live packages", value: packages },
    { label: "Unread notes", value: unread },
    { label: "Members", value: members },
  ];

  return (
    <>
      <p className="kicker">Overview</p>
      <h1>The desk today.</h1>
      <div className="metric-grid">
        {metrics.map((item) => (
          <article key={item.label} className="metric">
            <b>{item.value}</b>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
      <div className="grid-2">
        <section className="panel">
          <h2>Recent orders</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td>{order.code}</td>
                    <td>{taka(order.amountBdt)}</td>
                    <td><StatusPill status={order.status} /></td>
                    <td>{when(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link className="text-link" href="/admin/orders">All orders</Link>
        </section>
        <section className="panel">
          <h2>Unread messages</h2>
          {messages.length === 0 ? <p className="muted">The inbox is clear.</p> : null}
          {messages.map((message) => (
            <p key={message.id}>
              <strong>{message.name}</strong> · {message.subject}
            </p>
          ))}
          <Link className="text-link" href="/admin/messages">Open inbox</Link>
        </section>
      </div>
    </>
  );
}
