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

export function waLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#contact";
}
