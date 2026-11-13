"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { clearSession, readSession, writeSession } from "@/lib/auth";
import { safeNext, text } from "@/lib/form";
import { prisma } from "@/lib/prisma";
import { loginSchema, signupSchema } from "@/lib/validators";

export type AuthState = { error?: string };
export type PasswordState = { error?: string; ok?: string };

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: text(formData, "email"),
    password: text(formData, "password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  const matches = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !matches) {
    return { error: "Those details do not match an account." };
  }

  await writeSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const next = safeNext(text(formData, "next"));
  if (next === "/account" && user.role === "ADMIN") redirect("/admin");
  redirect(next);
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    password: text(formData, "password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }
  if (text(formData, "password") !== text(formData, "confirm")) {
    return { error: "The two passwords do not match." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists. Sign in instead." };

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone || null,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: "MEMBER",
    },
  });

  await writeSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: "MEMBER",
  });
  redirect("/account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const session = await readSession();
  if (!session) return { error: "Sign in again to change the password." };

  const current = text(formData, "current");
  const next = text(formData, "next");
  const confirm = text(formData, "confirm");
  if (next.length < 8 || next.length > 72) return { error: "Use 8 to 72 characters." };
  if (next !== confirm) return { error: "The new passwords do not match." };

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return { error: "This account is no longer on the desk." };
  const matches = await bcrypt.compare(current, user.passwordHash);
  if (!matches) return { error: "The current password does not match." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });
  return { ok: "Password updated." };
}
