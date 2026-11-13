import type { Metadata } from "next";
import { WorkPageView } from "@/components/work-page";
import { loadHouse } from "@/lib/content";

export const metadata: Metadata = {
  title: "Agent",
  description: "How agent work happens at Asian Top 10 Family, before you register.",
};

export default async function AgentPage() {
  const house = await loadHouse();
  if (!house) return null;
  return <WorkPageView house={house} pageKey="AGENT" />;
}