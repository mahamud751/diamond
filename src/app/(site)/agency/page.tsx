import type { Metadata } from "next";
import { WorkPageView } from "@/components/work-page";
import { loadHouse } from "@/lib/content";

export const metadata: Metadata = {
  title: "For Agency",
  description: "How Asian Top 10 Family works, written by the desk, before you register.",
};

export default async function AgencyPage() {
  const house = await loadHouse();
  if (!house) return null;
  return <WorkPageView house={house} pageKey="AGENCY" />;
}
