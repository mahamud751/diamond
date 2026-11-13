export function Mark({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className: "mark",
    "aria-hidden": true as const,
  };
  if (name === "account") {
    return (
      <svg {...common}>
        <circle cx="16" cy="12" r="4" />
        <path d="M7 26c1.8-4 4.8-6 9-6s7.2 2 9 6" />
      </svg>
    );
  }
  if (name === "desk") {
    return (
      <svg {...common}>
        <rect x="5" y="8" width="22" height="14" rx="2" />
        <path d="M12 26h8M16 22v4" />
      </svg>
    );
  }
  if (name === "profile") {
    return (
      <svg {...common}>
        <path d="M8 6h12l4 4v16H8z" />
        <path d="M12 16h8M12 21h6" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M16 4l9 4v7c0 6-3.8 9.6-9 11-5.2-1.4-9-5-9-11V8z" />
      </svg>
    );
  }
  if (name === "globe") {
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="10" />
        <path d="M6 16h20M16 6c3 3 3 17 0 20M16 6c-3 3-3 17 0 20" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M16 4l8 8-8 16L8 12z" />
    </svg>
  );
}
