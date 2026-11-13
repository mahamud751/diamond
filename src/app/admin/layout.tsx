import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { readSession } from "@/lib/auth";
import "./admin.css";

export const metadata: Metadata = {
  title: "Family desk",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/");
  return <AdminShell name={session.name}>{children}</AdminShell>;
}
