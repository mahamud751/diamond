import type { ReactNode } from "react";

export type IconName =
  | "crown"
  | "diamond"
  | "wallet"
  | "users"
  | "headset"
  | "info"
  | "arrow"
  | "arrow-up-right"
  | "chevron"
  | "check"
  | "shield"
  | "mic"
  | "chart"
  | "chat"
  | "clock"
  | "search"
  | "menu"
  | "close"
  | "user"
  | "phone"
  | "mail"
  | "pin"
  | "spark";

const PATHS: Record<IconName, ReactNode> = {
  crown: <><path d="M3.5 8.5 8 12l4-6.5 4 6.5 4.5-3.5L19 18H5z" /><path d="M5 21h14" /></>,
  diamond: <><path d="M6.5 4h11L22 9.5 12 21 2 9.5z" /><path d="M2 9.5h20M8.5 9.5 12 21l3.5-11.5M6.5 4l2 5.5L12 4l3.5 5.5 2-5.5" /></>,
  wallet: <><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H17a2 2 0 0 1 2 2v1" /><path d="M3 7.5V17a2.5 2.5 0 0 0 2.5 2.5H19a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 1 3 7.5z" /><circle cx="16.5" cy="13.8" r="1.3" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.9c1.7.8 2.7 2.5 3 5.1" /></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13" width="4.5" height="6.5" rx="1.8" /><rect x="17" y="13" width="4.5" height="6.5" rx="1.8" /><path d="M19.5 19.5c0 1.5-1.7 2.5-4.5 2.5h-2" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  shield: <><path d="M12 3l8 3.5v5.5c0 5-3.3 8-8 9.5-4.7-1.5-8-4.5-8-9.5V6.5z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M21 20H3" /></>,
  chat: <><path d="M4 5.5h16v11H9.5L5 20v-3.5H4z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5.5l3.5 2" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 3.8-6 8-6s7 2 8 6" /></>,
  phone: <path d="M5 3.5h4l1.5 5-2.5 1.5a12 12 0 0 0 6 6l1.5-2.5 5 1.5v4c0 1-1 2-2 2C10 20.5 3.5 14 3 5.5c0-1 1-2 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6.5L20 7" /></>,
  pin: <><path d="M12 21.5c4.5-4.3 7-7.8 7-11A7 7 0 0 0 5 10.5c0 3.2 2.5 6.7 7 11z" /><circle cx="12" cy="10.5" r="2.5" /></>,
  spark: <path d="M12 2.5c.6 5.4 3.1 7.9 9 9.5-5.9 1.6-8.4 4.1-9 9.5-.6-5.4-3.1-7.9-9-9.5 5.9-1.6 8.4-4.1 9-9.5z" />,
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
