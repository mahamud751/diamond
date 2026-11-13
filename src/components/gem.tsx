export function Gem({ className = "gem" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 210" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gemLight" x1="35" y1="10" x2="180" y2="205" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbf3ff" />
          <stop offset=".45" stopColor="#c084fc" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id="gemShade" x1="70" y1="70" x2="170" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9b5cf6" />
          <stop offset="1" stopColor="#3b0f8f" />
        </linearGradient>
      </defs>
      <path d="M50 24H190L228 83L120 201L12 83Z" fill="url(#gemLight)" stroke="#f3e4ff" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 83H72L120 201Z" fill="#8b5cf6" fillOpacity=".55" />
      <path d="M168 83H228L120 201Z" fill="url(#gemShade)" />
      <path d="M72 83L120 24L168 83Z" fill="#fbf3ff" fillOpacity=".8" />
      <path d="M50 24L12 83H72Z" fill="#e3c8ff" />
      <path d="M190 24L168 83H228Z" fill="#8b4bf0" />
      <path d="M72 83H168L120 201Z" fill="#d8b4fe" fillOpacity=".4" />
      <path d="M50 24L72 83L120 24L168 83L190 24M12 83H228M72 83L120 201L168 83" stroke="#f8eeff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {diagonal ? <path d="M7 17 17 7M8 7h9v9" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}
