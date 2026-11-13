import Link from "next/link";
import { Arrow } from "@/components/gem";
import { Icon } from "@/components/icons";
import { registerHref } from "@/lib/format";

function RegisterCard({
  id,
  kicker,
  title,
  body,
  href,
  label,
  tone,
}: {
  id: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  label: string;
  tone: "gold" | "line";
}) {
  const url = registerHref(href);
  const external = url.startsWith("http");
  const className = tone === "gold" ? "btn btn-gold" : "btn btn-line";
  return (
    <article className={tone === "line" ? "path-card is-gold" : "path-card"} id={id}>
      <span className="path-icon">
        <Icon name={id === "agent" ? "users" : "mic"} size={28} />
      </span>
      <p className="path-tag">{kicker}</p>
      <h3>{title}</h3>
      <p>{body}</p>
      {url ? (
        external ? (
          <a className={className} href={url} target="_blank" rel="noreferrer">
            {label} <Arrow />
          </a>
        ) : (
          <Link className={className} href={url}>
            {label} <Arrow />
          </Link>
        )
      ) : (
        <p className="muted">This registration link is set in House settings.</p>
      )}
    </article>
  );
}

export function RegisterLinks({ hostUrl, agentUrl }: { hostUrl: string; agentUrl: string }) {
  return (
    <div className="path-grid">
      <RegisterCard
        id="host"
        kicker="Registration 01"
        title="Register as a host"
        body="Open the host registration the desk has set. A manager follows up after you register."
        href={hostUrl}
        label="Host registration"
        tone="gold"
      />
      <RegisterCard
        id="agent"
        kicker="Registration 02"
        title="Register as an agent"
        body="Open the agent registration the desk has set. Bring your hosts in after the team confirms you."
        href={agentUrl}
        label="Agent registration"
        tone="line"
      />
    </div>
  );
}
