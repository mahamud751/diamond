"use server";

import { prisma } from "@/lib/prisma";
import { text } from "@/lib/form";
import { diamondCount, paymentLabel, taka, when } from "@/lib/format";

export type TrackingState = {
  error?: string;
  order?: { code: string; status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED"; packageName: string; diamonds: string; amount: string; payment: string; placed: string };
};

export async function trackOrder(_previous: TrackingState, formData: FormData): Promise<TrackingState> {
  const code = text(formData, "code").toUpperCase();
  const email = text(formData, "email").toLowerCase();
  if (!/^AT10-[A-Z0-9-]{4,30}$/.test(code) || !email || email.length > 254) return { error: "Enter your order code and the email used for the order." };
  const order = await prisma.order.findFirst({ where: { code, email } });
  if (!order) return { error: "No order matches that code and email. Please check both details." };
  return { order: { code: order.code, status: order.status, packageName: order.packageName, diamonds: diamondCount(order.diamonds), amount: taka(order.amountBdt), payment: paymentLabel(order.paymentMethod), placed: when(order.createdAt) } };
}
