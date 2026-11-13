import { Gem } from "@/components/gem";
import { Icon } from "@/components/icons";

/** Code-drawn illustration of what the agency does: a host live on a phone, diamonds arriving, a payout approved, a manager on call. */
export function FamilyScene() {
  return (
    <div className="scene" role="img" aria-label="Illustration of a host live streaming with diamonds arriving, a withdrawal approved and a manager online">
      <div className="scene-glow" aria-hidden="true" />
      <div className="scene-phone" aria-hidden="true">
        <div className="scene-screen">
          <div className="scene-top">
            <span className="scene-live"><i />LIVE</span>
            <span className="scene-viewers">
              <b /><b /><b />
              <Icon name="users" size={12} />
            </span>
          </div>
          <svg className="scene-host" viewBox="0 0 200 230" fill="none">
            <defs>
              <linearGradient id="sh-skin" x1="100" y1="40" x2="100" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffe3c4" /><stop offset="1" stopColor="#f2b98d" />
              </linearGradient>
              <linearGradient id="sh-top" x1="100" y1="150" x2="100" y2="230" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fff0bd" /><stop offset="1" stopColor="#f0a93a" />
              </linearGradient>
            </defs>
            <path d="M52 108c-8-52 14-84 48-84s58 30 48 86c-4 24-6 40-2 58H54c5-20 2-38-2-60z" fill="#2a0f52" />
            <path d="M18 230c2-40 26-62 60-66h44c34 4 58 26 60 66z" fill="url(#sh-top)" />
            <path d="M84 138h32v30c-6 10-26 10-32 0z" fill="#eaa97c" />
            <ellipse cx="100" cy="98" rx="36" ry="44" fill="url(#sh-skin)" />
            <path d="M62 92c2-32 22-46 42-46 22 0 36 16 36 44-14-4-30-14-40-28-8 14-22 24-38 30z" fill="#2a0f52" />
            <path d="M86 102q5-5 10 0M106 102q5-5 10 0" stroke="#3b1a12" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M88 120q12 10 24 0" stroke="#c2553f" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="114" r="6" fill="#ff9f9f" fillOpacity=".5" /><circle cx="120" cy="114" r="6" fill="#ff9f9f" fillOpacity=".5" />
            <path d="M60 96a40 40 0 0 1 80 0" stroke="#f6c453" strokeWidth="5" strokeLinecap="round" />
            <rect x="52" y="90" width="13" height="26" rx="6.5" fill="#f6c453" /><rect x="135" y="90" width="13" height="26" rx="6.5" fill="#f6c453" />
            <path d="M58 116c0 16 10 22 24 23" stroke="#f6c453" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="85" cy="139" r="5" fill="#fff0bd" />
          </svg>
          <span className="scene-heart h1" /><span className="scene-heart h2" /><span className="scene-heart h3" />
          <div className="scene-chat">
            <p><i />Mitu joined the room</p>
            <p className="is-gift"><i />Rafi sent a diamond</p>
            <p><i />Welcome to the family</p>
          </div>
          <div className="scene-bar">
            <span>Say something…</span>
            <b><Icon name="diamond" size={14} /></b>
          </div>
        </div>
      </div>

      <span className="scene-gem sg1" aria-hidden="true"><Gem /></span>
      <span className="scene-gem sg2" aria-hidden="true"><Gem /></span>
      <span className="scene-gem sg3" aria-hidden="true"><Gem /></span>

      <div className="scene-card sc1" aria-hidden="true">
        <span className="scene-card-gem"><Gem /></span>
        <p><b>Diamonds delivered</b>Straight to your UID</p>
      </div>
      <div className="scene-card sc2" aria-hidden="true">
        <span className="scene-card-icon is-gold"><Icon name="check" size={18} /></span>
        <p><b>Withdrawal approved</b>Reviewed by our team</p>
      </div>
      <div className="scene-card sc3" aria-hidden="true">
        <span className="scene-faces"><i>N</i><i>I</i><i>L</i></span>
        <p><b>Your manager</b><em />Online now</p>
      </div>
    </div>
  );
}
