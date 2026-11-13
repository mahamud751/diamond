import { updateOrderStatus } from "@/actions/admin";
import { StatusPill } from "@/components/status-pill";
import { diamondCount, paymentLabel, taka, when } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

const FILTERS = ["ALL", "PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"] as const;

export default async function OrdersAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const current = FILTERS.includes(status as (typeof FILTERS)[number]) ? (status as (typeof FILTERS)[number]) : "ALL";
  const orders = await prisma.order.findMany({
    where: current === "ALL" ? undefined : { status: current as OrderStatus },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <p className="kicker">Orders</p>
      <h1>Every order on the desk.</h1>
      <div className="admin-filters">
        {FILTERS.map((item) => (
          <a key={item} href={item === "ALL" ? "/admin/orders" : `/admin/orders?status=${item}`} aria-current={item === current ? "page" : undefined}>
            {item === "ALL" ? "All" : item.charAt(0) + item.slice(1).toLowerCase()}
          </a>
        ))}
      </div>
      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Member</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.code}</strong>
                  <div>{order.packageName}</div>
                  <div>{diamondCount(order.diamonds)} · {taka(order.amountBdt)}</div>
                  <div className="muted">{when(order.createdAt)}</div>
                </td>
                <td>
                  {order.customerName}
                  <div>{order.phone}</div>
                  <div>{order.email}</div>
                  <div>UID {order.recipientUid}</div>
                  {order.note ? <div className="muted">{order.note}</div> : null}
                </td>
                <td>
                  {paymentLabel(order.paymentMethod)}
                  <div>From {order.senderNumber}</div>
                  <div>Trx {order.transactionId}</div>
                </td>
                <td>
                  <StatusPill status={order.status} />
                  <form action={updateOrderStatus} className="stack" style={{ marginTop: 8 }}>
                    <input type="hidden" name="id" value={order.id} />
                    <select name="status" defaultValue={order.status}>
                      <option value="PENDING">Waiting</option>
                      <option value="CONFIRMED">Payment seen</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Closed</option>
                    </select>
                    <button className="btn btn-line" type="submit">Update</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 ? <p className="muted">No orders in this view.</p> : null}
      </div>
    </>
  );
}
