"use server";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus, Prisma } from "@prisma/client";
import { readSession } from "@/lib/auth";
import { slugify, text } from "@/lib/form";
import { prisma } from "@/lib/prisma";

export type FormState = { error?: string; ok?: string };

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"];
const ICONS = ["diamond", "account", "desk", "profile", "shield", "globe"];

async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") redirect("/login?next=/admin");
  return session;
}

function refresh() {
  revalidatePath("/", "layout");
}

function flag(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function integer(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? Math.round(value) : NaN;
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status") as OrderStatus;
  if (!STATUSES.includes(status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/account");
}

export async function savePackage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const diamonds = integer(formData, "diamonds");
  const priceBdt = integer(formData, "priceBdt");
  const priceUsd = Number(text(formData, "priceUsd"));
  const sortOrder = integer(formData, "sortOrder");
  if (!name) return { error: "Give the package a name." };
  if (!Number.isFinite(diamonds) || diamonds < 1) return { error: "Enter the diamond amount." };
  if (!Number.isFinite(priceBdt) || priceBdt < 1) return { error: "Enter the price in taka." };
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) return { error: "Enter the price in dollars." };

  const data = {
    name,
    diamonds,
    priceBdt,
    priceUsd,
    description: text(formData, "description") || null,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    highlight: flag(formData, "highlight"),
    active: flag(formData, "active"),
  };

  if (id) {
    await prisma.package.update({ where: { id }, data });
  } else {
    await prisma.package.create({ data });
  }
  refresh();
  return { ok: id ? "Package updated." : "Package added." };
}

export async function removePackage(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const orders = await prisma.order.count({ where: { packageId: id } });
  if (orders > 0) {
    await prisma.package.update({ where: { id }, data: { active: false } });
  } else {
    await prisma.package.delete({ where: { id } });
  }
  refresh();
}

export async function saveTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const quote = text(formData, "quote");
  const role = text(formData, "role");
  const rating = integer(formData, "rating");
  if (!name || !quote) return { error: "Name and quote are required." };
  const data = {
    name,
    role: role || "Member",
    quote,
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
    sortOrder: integer(formData, "sortOrder") || 0,
    active: flag(formData, "active"),
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  refresh();
  return { ok: id ? "Review updated." : "Review added." };
}

export async function removeTestimonial(formData: FormData) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: text(formData, "id") } });
  refresh();
}

export async function saveTeam(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const title = text(formData, "title");
  const highlight = text(formData, "highlight");
  if (!name || !title) return { error: "Name and title are required." };
  const data = {
    name,
    title,
    highlight: highlight || title,
    sortOrder: integer(formData, "sortOrder") || 0,
    active: flag(formData, "active"),
  };
  if (id) await prisma.teamMember.update({ where: { id }, data });
  else await prisma.teamMember.create({ data });
  refresh();
  return { ok: id ? "Team card updated." : "Team card added." };
}

export async function removeTeam(formData: FormData) {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id: text(formData, "id") } });
  refresh();
}

export async function saveAchievement(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const value = text(formData, "value");
  const title = text(formData, "title");
  const detail = text(formData, "detail");
  if (!value || !title) return { error: "Value and title are required." };
  const data = {
    value,
    title,
    detail,
    sortOrder: integer(formData, "sortOrder") || 0,
    active: flag(formData, "active"),
  };
  if (id) await prisma.achievement.update({ where: { id }, data });
  else await prisma.achievement.create({ data });
  refresh();
  return { ok: id ? "Achievement updated." : "Achievement added." };
}

export async function removeAchievement(formData: FormData) {
  await requireAdmin();
  await prisma.achievement.delete({ where: { id: text(formData, "id") } });
  refresh();
}

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const summary = text(formData, "summary");
  const icon = text(formData, "icon");
  if (!title || !summary) return { error: "Title and summary are required." };
  const data = {
    title,
    summary,
    icon: ICONS.includes(icon) ? icon : "diamond",
    sortOrder: integer(formData, "sortOrder") || 0,
    active: flag(formData, "active"),
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  refresh();
  return { ok: id ? "Service updated." : "Service added." };
}

export async function removeService(formData: FormData) {
  await requireAdmin();
  await prisma.service.delete({ where: { id: text(formData, "id") } });
  refresh();
}

export async function savePage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const body = text(formData, "body");
  if (!title || !slug || !body) return { error: "Title, slug, and body are required." };
  const data = {
    title,
    slug,
    excerpt: text(formData, "excerpt"),
    body,
    navLabel: text(formData, "navLabel"),
    showInNav: flag(formData, "showInNav"),
    published: flag(formData, "published"),
    sortOrder: integer(formData, "sortOrder") || 0,
  };
  try {
    if (id) await prisma.page.update({ where: { id }, data });
    else await prisma.page.create({ data });
  } catch {
    return { error: "That slug is already in use." };
  }
  refresh();
  return { ok: id ? "Page updated." : "Page added. It lives at /p/" + slug };
}

export async function removePage(formData: FormData) {
  await requireAdmin();
  await prisma.page.delete({ where: { id: text(formData, "id") } });
  refresh();
}

export async function markMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id: text(formData, "id") },
    data: { read: flag(formData, "read") },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const data: Prisma.SiteSettingUpdateInput = {
    brandName: text(formData, "brandName"),
    tagline: text(formData, "tagline"),
    heroKicker: text(formData, "heroKicker"),
    heroTitle: text(formData, "heroTitle"),
    heroBangla: text(formData, "heroBangla"),
    heroSubtitle: text(formData, "heroSubtitle"),
    introTitle: text(formData, "introTitle"),
    introBody: text(formData, "introBody"),
    aboutTitle: text(formData, "aboutTitle"),
    aboutBody: text(formData, "aboutBody"),
    mission: text(formData, "mission"),
    vision: text(formData, "vision"),
    packageTitle: text(formData, "packageTitle"),
    packageIntro: text(formData, "packageIntro"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    whatsapp: text(formData, "whatsapp"),
    address: text(formData, "address"),
    hours: text(formData, "hours"),
    bkash: text(formData, "bkash"),
    nagad: text(formData, "nagad"),
    rocket: text(formData, "rocket"),
    upay: text(formData, "upay"),
    bankDetails: text(formData, "bankDetails"),
    facebook: text(formData, "facebook"),
    instagram: text(formData, "instagram"),
    telegram: text(formData, "telegram"),
    heroImage: text(formData, "heroImage"),
  };
  if (!data.brandName || !data.heroTitle || !data.email) {
    return { error: "Brand name, hero title, and email are required." };
  }
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: data,
    create: {
      id: "main",
      brandName: String(data.brandName),
      tagline: String(data.tagline),
      heroKicker: String(data.heroKicker),
      heroTitle: String(data.heroTitle),
      heroBangla: String(data.heroBangla),
      heroSubtitle: String(data.heroSubtitle),
      introTitle: String(data.introTitle),
      introBody: String(data.introBody),
      aboutTitle: String(data.aboutTitle),
      aboutBody: String(data.aboutBody),
      mission: String(data.mission),
      vision: String(data.vision),
      packageTitle: String(data.packageTitle),
      packageIntro: String(data.packageIntro),
      phone: String(data.phone),
      email: String(data.email),
      whatsapp: String(data.whatsapp),
      address: String(data.address),
      hours: String(data.hours),
      bkash: String(data.bkash),
      nagad: String(data.nagad),
      rocket: String(data.rocket),
      upay: String(data.upay),
      bankDetails: String(data.bankDetails),
      facebook: String(data.facebook ?? ""),
      instagram: String(data.instagram ?? ""),
      telegram: String(data.telegram ?? ""),
      heroImage: String(data.heroImage ?? ""),
    },
  });
  refresh();
  return { ok: "House details saved." };
}

const MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadMedia(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." };
  if (file.size > 4_000_000) return { error: "Keep images under 4 MB." };
  const ext = MIME[file.type];
  if (!ext) return { error: "Use a JPG, PNG, WEBP, or GIF." };

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);
  const url = `/uploads/${filename}`;
  const alt = text(formData, "alt") || "House image";
  await prisma.media.create({ data: { url, alt } });
  if (flag(formData, "asHero")) {
    await prisma.siteSetting.update({ where: { id: "main" }, data: { heroImage: url } });
  }
  refresh();
  return { ok: "Image saved." };
}

export async function removeMedia(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;
  if (media.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", media.url);
    await unlink(filePath).catch(() => undefined);
  }
  await prisma.media.delete({ where: { id } });
  const settings = await prisma.siteSetting.findUnique({ where: { id: "main" } });
  if (settings?.heroImage === media.url) {
    await prisma.siteSetting.update({ where: { id: "main" }, data: { heroImage: "" } });
  }
  refresh();
}
