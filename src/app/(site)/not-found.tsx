import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell lost">
      <p className="lost-code" aria-hidden="true">404</p>
      <p className="kicker">Page not found</p>
      <h1>
        This page is <em>not here.</em>
      </h1>
      <p className="lede">The address may have changed, or the page is not published yet.</p>
      <div className="hero-actions">
        <Link className="btn btn-gold" href="/">
          Back to home
        </Link>
        <Link className="btn btn-glass" href="/contact">
          Contact support
        </Link>
      </div>
    </section>
  );
}
