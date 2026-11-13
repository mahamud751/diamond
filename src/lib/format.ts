export const PAYMENTS = [
  { id: "BKASH", label: "bKash" },
  { id: "NAGAD", label: "Nagad" },
  { id: "ROCKET", label: "Rocket" },
  { id: "UPAY", label: "Upay" },
  { id: "BANK", label: "Bank transfer" },
] as const;

export type PaymentId = (typeof PAYMENTS)[number]["id"];

export const STATUS_LABEL: Record<string, string> = {
  PENDING: "Waiting for the desk",
  CONFIRMED: "Payment seen",
  DELIVERED: "Placed on the UID",
  CANCELLED: "Closed",
};

export const DEFAULT_USD_RATE = 126;

export function usdRateOf(value: { toString(): string } | number | null | undefined) {
  const rate = Number(value ?? DEFAULT_USD_RATE);
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_USD_RATE;
}

export function bdtToUsd(bdt: number, rate: number) {
  const safe = rate > 0 ? rate : DEFAULT_USD_RATE;
  return Math.round((bdt / safe) * 100) / 100;
}

export function rateLabel(rate: number) {
  const shown = Number.isInteger(rate) ? rate.toLocaleString("en-BD") : rate.toLocaleString("en-BD", { maximumFractionDigits: 2 });
  return `1 USD = ৳${shown}`;
}

export function taka(amount: number) {
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

export function usd(amount: number) {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function diamondCount(amount: number) {
  return `${amount.toLocaleString("en-US")} Diamonds`;
}

export function when(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function paymentLabel(id: string) {
  return PAYMENTS.find((item) => item.id === id)?.label ?? id;
}

export function registerHref(value: string) {
  const url = value.trim();
  if (!url) return "";
  if (url.startsWith("/")) return url;
  const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

export function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#contact";
}

export function waOrderLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
