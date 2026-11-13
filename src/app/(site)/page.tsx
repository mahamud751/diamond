import type { Metadata } from "next";
import { HomeView } from "@/components/home-view";
import { loadHouse } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Asian Top 10 Family — Agency Team" },
  description: "Grow together, earn together, succeed together. Join Asian Top 10 Family as a Chamet host or agent, buy diamonds at open prices and get withdrawal support.",
};

export default async function HomePage() {
  const house = await loadHouse();
  if (!house) return null;
  return <HomeView house={house} />;
}
