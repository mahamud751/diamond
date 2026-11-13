"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="shell lost">
      <p className="kicker">Something went wrong</p>
      <h1>
        This page could not <em>be opened.</em>
      </h1>
      <p className="lede">Please try again in a moment. If you run the site locally, check that PostgreSQL is running.</p>
      <div className="hero-actions">
        <button className="btn btn-gold" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </section>
  );
}
