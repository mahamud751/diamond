import { markMessage, removeMessage } from "@/actions/admin";
import { LiveBadge } from "@/components/live-badge";
import { IconForm } from "@/components/row-actions";
import { when } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function MessagesAdmin() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <p className="kicker">Messages</p>
      <h1>Notes to the house.</h1>
      <div className="panel table-wrap" style={{ marginTop: 18 }}>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>Message</th>
              <th>When</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {messages.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  <div>{item.email}</div>
                  {item.phone ? <div>{item.phone}</div> : null}
                </td>
                <td>
                  <strong>{item.subject}</strong>
                  <div className="msg-body">{item.message}</div>
                </td>
                <td>{when(item.createdAt)}</td>
                <td><LiveBadge on={!item.read} onLabel="New" offLabel="Read" /></td>
                <td className="action-cell">
                  <div className="row-actions">
                    <IconForm
                      action={markMessage}
                      id={item.id}
                      fields={item.read ? undefined : { read: "on" }}
                      label={item.read ? "Mark unread" : "Mark read"}
                      icon={item.read ? "mail" : "check"}
                      tone={item.read ? "line" : "good"}
                    />
                    <IconForm action={removeMessage} id={item.id} label="Delete" icon="trash" tone="danger" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 ? <p className="muted">No messages yet.</p> : null}
      </div>
    </>
  );
}
