export function StatusPill({ status }: { status: string }) {
  const label: Record<string, string> = {
    PENDING: "Waiting",
    CONFIRMED: "Payment seen",
    DELIVERED: "Delivered",
    CANCELLED: "Closed",
  };
  return <span className={`pill pill-${status.toLowerCase()}`}>{label[status] ?? status}</span>;
}
