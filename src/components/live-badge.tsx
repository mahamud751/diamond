export function LiveBadge({ on, onLabel = "Live", offLabel = "Hidden" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span className={on ? "pkg-status is-live" : "pkg-status"}>
      <i />
      {on ? onLabel : offLabel}
    </span>
  );
}
