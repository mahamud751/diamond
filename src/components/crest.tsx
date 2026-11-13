export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lm-bg" x1="4" y1="2" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b57bff" />
          <stop offset=".55" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#3b0f8f" />
        </linearGradient>
        <linearGradient id="lm-gold" x1="22" y1="10" x2="22" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff1bd" />
          <stop offset=".5" stopColor="#f6c453" />
          <stop offset="1" stopColor="#d08f1c" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="13" fill="url(#lm-bg)" />
      <rect x=".75" y=".75" width="42.5" height="42.5" rx="12.25" stroke="#fff" strokeOpacity=".22" strokeWidth="1.5" />
      <path d="M10.5 16.5 16 21l6-9.5L28 21l5.5-4.5L31 28H13z" fill="url(#lm-gold)" />
      <rect x="13" y="30" width="18" height="3.4" rx="1.7" fill="url(#lm-gold)" />
      <circle cx="10.5" cy="16" r="1.8" fill="#fff1bd" />
      <circle cx="22" cy="11" r="2" fill="#fff1bd" />
      <circle cx="33.5" cy="16" r="1.8" fill="#fff1bd" />
    </svg>
  );
}

export function Logo({ sub = "Family Agency" }: { sub?: string }) {
  return (
    <>
      <LogoMark />
      <span className="logo-text">
        <strong>Asian Top 10</strong>
        <em>{sub}</em>
      </span>
    </>
  );
}

/** The hero centrepiece: a crown resting on a three-tier podium, wrapped by a gold orbit. */
export function CrownScene({ label = "TOP 10" }: { label?: string }) {
  return (
    <svg className="crown-scene" viewBox="0 0 600 640" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cs-gold" x1="300" y1="160" x2="300" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff6cf" />
          <stop offset=".32" stopColor="#f9d264" />
          <stop offset=".72" stopColor="#dd9c20" />
          <stop offset="1" stopColor="#a8690d" />
        </linearGradient>
        <linearGradient id="cs-gold-side" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#a8690d" />
          <stop offset=".22" stopColor="#f6c453" />
          <stop offset=".5" stopColor="#fff3c2" />
          <stop offset=".78" stopColor="#f0b63c" />
          <stop offset="1" stopColor="#9a5f0b" />
        </linearGradient>
        <linearGradient id="cs-body" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1d0a52" />
          <stop offset=".28" stopColor="#6d28d9" />
          <stop offset=".5" stopColor="#a674ff" />
          <stop offset=".72" stopColor="#6425cf" />
          <stop offset="1" stopColor="#1a0848" />
        </linearGradient>
        <radialGradient id="cs-top" cx=".5" cy=".3" r=".8">
          <stop stopColor="#d9c2ff" />
          <stop offset=".55" stopColor="#8b4bf0" />
          <stop offset="1" stopColor="#4c1d95" />
        </radialGradient>
        <linearGradient id="cs-gem" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f5e8ff" />
          <stop offset=".45" stopColor="#a855f7" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <radialGradient id="cs-pearl" cx=".35" cy=".3" r=".8">
          <stop stopColor="#fffbe6" />
          <stop offset=".5" stopColor="#f9d264" />
          <stop offset="1" stopColor="#b9790f" />
        </radialGradient>
        <radialGradient id="cs-glow" cx=".5" cy=".5" r=".5">
          <stop stopColor="#c084fc" stopOpacity=".7" />
          <stop offset=".55" stopColor="#7c3aed" stopOpacity=".22" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cs-floor" cx=".5" cy=".5" r=".5">
          <stop stopColor="#f6c453" stopOpacity=".5" />
          <stop offset="1" stopColor="#f6c453" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="300" cy="290" r="290" fill="url(#cs-glow)" />
      <ellipse cx="300" cy="590" rx="290" ry="42" fill="url(#cs-floor)" />

      {/* podium — bottom tier */}
      <path d="M48 520a252 52 0 0 0 504 0v44a252 52 0 0 1-504 0z" fill="url(#cs-body)" />
      <path d="M48 564a252 52 0 0 0 504 0" stroke="url(#cs-gold-side)" strokeWidth="5" />
      <ellipse cx="300" cy="520" rx="252" ry="52" fill="url(#cs-top)" stroke="url(#cs-gold-side)" strokeWidth="4" />
      {/* middle tier */}
      <path d="M100 452a200 42 0 0 0 400 0v62a200 42 0 0 1-400 0z" fill="url(#cs-body)" />
      <path d="M100 514a200 42 0 0 0 400 0" stroke="url(#cs-gold-side)" strokeWidth="4" />
      <ellipse cx="300" cy="452" rx="200" ry="42" fill="url(#cs-top)" stroke="url(#cs-gold-side)" strokeWidth="4" />
      <text className="crown-label" x="300" y="530" textAnchor="middle" fill="#fff">{label}</text>
      {/* top tier */}
      <path d="M156 398a144 30 0 0 0 288 0v44a144 30 0 0 1-288 0z" fill="url(#cs-body)" />
      <path d="M156 442a144 30 0 0 0 288 0" stroke="url(#cs-gold-side)" strokeWidth="3.5" />
      <ellipse cx="300" cy="398" rx="144" ry="30" fill="#2a0f6b" stroke="url(#cs-gold-side)" strokeWidth="4" />

      {/* orbit — back half */}
      <g className="orbit" transform="rotate(-11 300 330)">
        <path d="M40 330a260 66 0 0 1 520 0" stroke="url(#cs-gold-side)" strokeWidth="9" strokeLinecap="round" opacity=".75" />
      </g>

      {/* crown */}
      <g className="crown">
        <ellipse cx="300" cy="352" rx="112" ry="26" fill="#7a4a06" />
        <path d="M188 352 158 214l80 70 62-116 62 116 80-70-30 138q-112 34-224 0z" fill="url(#cs-gold)" stroke="#fff3c2" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M300 168l62 116 80-70-30 138q-56 17-112 17z" fill="#8a5200" fillOpacity=".2" />
        <path d="M238 284 214 357M362 284l24 73M300 168v201" stroke="#fff6cf" strokeOpacity=".5" strokeWidth="1.5" />
        <path d="M184 350q116 36 232 0l-7 42q-109 34-218 0z" fill="url(#cs-gold-side)" stroke="#fff3c2" strokeWidth="2" strokeLinejoin="round" />
        <path d="M300 226l19 30-19 30-19-30z" fill="url(#cs-gem)" stroke="#f5e8ff" strokeWidth="1.5" />
        <path d="M300 364l17 19-17 19-17-19z" fill="url(#cs-gem)" stroke="#f5e8ff" strokeWidth="1.5" />
        <path d="M236 356l12 15-12 15-12-15zM364 356l12 15-12 15-12-15z" fill="url(#cs-gem)" stroke="#f5e8ff" strokeWidth="1.2" />
        <circle cx="158" cy="210" r="14" fill="url(#cs-pearl)" />
        <circle cx="300" cy="162" r="16" fill="url(#cs-pearl)" />
        <circle cx="442" cy="210" r="14" fill="url(#cs-pearl)" />
        <circle cx="238" cy="282" r="8" fill="url(#cs-pearl)" />
        <circle cx="362" cy="282" r="8" fill="url(#cs-pearl)" />
      </g>

      {/* orbit — front half */}
      <g className="orbit" transform="rotate(-11 300 330)">
        <path d="M40 330a260 66 0 0 0 520 0" stroke="url(#cs-gold-side)" strokeWidth="9" strokeLinecap="round" />
        <circle cx="430" cy="387" r="9" fill="url(#cs-pearl)" />
      </g>

      <g className="twinkle" fill="#fff6cf">
        <path d="M92 120c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22z" />
        <path d="M520 86c1.5 10 6 14.5 16 16-10 1.5-14.5 6-16 16-1.5-10-6-14.5-16-16 10-1.5 14.5-6 16-16z" />
        <path d="M70 372c1.2 8 4.8 11.6 12.8 12.8-8 1.2-11.6 4.8-12.8 12.8-1.2-8-4.8-11.6-12.8-12.8 8-1.2 11.6-4.8 12.8-12.8z" />
        <path d="M548 300c1.2 8 4.8 11.6 12.8 12.8-8 1.2-11.6 4.8-12.8 12.8-1.2-8-4.8-11.6-12.8-12.8 8-1.2 11.6-4.8 12.8-12.8z" />
      </g>
    </svg>
  );
}
