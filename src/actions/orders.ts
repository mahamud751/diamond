"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { readSession } from "@/lib/auth";
import { text } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { paymentLabel } from "@/lib/format";
import { agencySchema, contactSchema, orderSchema, withdrawalSchema } from "@/lib/validators";

export type OrderState = { error?: string; code?: string; amount?: number; diamonds?: number };
export type ContactState = { error?: string; ok?: string };

async function orderCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `AT10-${randomBytes(3).toString("hex").toUpperCase()}`;
    const existing = await prisma.order.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Could not issue an order code.");
}

export async function placeOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const parsed = orderSchema.safeParse({
    packageId: text(formData, "packageId"),
    quantity: text(formData, "quantity"),
    recipientUid: text(formData, "recipientUid"),
    customerName: text(formData, "customerName"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    paymentMethod: text(formData, "paymentMethod"),
    senderNumber: text(formData, "senderNumber"),
    transactionId: text(formData, "transactionId"),
    note: text(formData, "note"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the order." };
  }

  const pkg = await prisma.package.findFirst({
    where: { id: parsed.data.packageId, active: true },
  });
  if (!pkg) return { error: "That package is no longer on the desk." };

  const session = await readSession();
  const quantity = parsed.data.quantity;
  const order = await prisma.order.create({
    data: {
      code: await orderCode(),
      userId: session?.id,
      packageId: pkg.id,
      packageName: pkg.name,
      diamonds: pkg.diamonds * quantity,
      quantity,
      amountBdt: pkg.priceBdt * quantity,
      amountUsd: Number(pkg.priceUsd) * quantity,
      customerName: parsed.data.customerName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      recipientUid: parsed.data.recipientUid,
      paymentMethod: parsed.data.paymentMethod,
      senderNumber: parsed.data.senderNumber,
      transactionId: parsed.data.transactionId,
      note: parsed.data.note || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/account");
  return { code: order.code, amount: order.amountBdt, diamonds: order.diamonds };
}

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (text(formData, "company")) return { ok: "Message received. The desk will reply." };

  const parsed = contactSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    subject: text(formData, "subject"),
    message: text(formData, "message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the message." };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: "Message received. The desk will reply." };
}

export async function applyToAgency(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ok = "Application received. Our team will contact you on the number you gave.";
  if (text(formData, "company")) return { ok };

  const parsed = agencySchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    role: text(formData, "role"),
    uid: text(formData, "uid"),
    location: text(formData, "location"),
    about: text(formData, "about"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the application." };
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      subject: `Agency application — ${data.role === "HOST" ? "Host" : "Agent"}`,
      message: [
        `Applying as: ${data.role === "HOST" ? "Host" : "Agent"}`,
        `Chamet UID: ${data.uid || "Not provided"}`,
        `Location: ${data.location}`,
        "",
        data.about,
      ].join("\n"),
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok };
}

export async function requestWithdrawal(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ok = "Request received. Our team will verify it and confirm with you before any payout.";
  if (text(formData, "company")) return { ok };

  const parsed = withdrawalSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    uid: text(formData, "uid"),
    amount: text(formData, "amount"),
    method: text(formData, "method"),
    account: text(formData, "account"),
    note: text(formData, "note"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the request." };
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      subject: `Withdrawal request — UID ${data.uid}`.slice(0, 120),
      message: [
        `Chamet UID: ${data.uid}`,
        `Amount: ${data.amount}`,
        `Payout method: ${paymentLabel(data.method)}`,
        `Pay to: ${data.account}`,
        ...(data.note ? ["", data.note] : []),
      ].join("\n"),
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok };
}
