/**
 * One-off content refresh for the agency redesign.
 * Replaces the original starter copy with the new agency copy, but only where a
 * field still holds the untouched starter text — anything edited in the admin is kept.
 * Run with: npx tsx prisma/refresh-copy.ts
 */
import { PrismaClient } from "@prisma/client";
import { AGENCY_ACHIEVEMENTS, AGENCY_SERVICES, AGENCY_SETTINGS, AGENCY_TEAM } from "./agency-copy";

const prisma = new PrismaClient();

const OLD_SETTINGS: Record<keyof typeof AGENCY_SETTINGS, string> = {
  tagline: "Open prices. A named desk. A record you can return to.",
  heroKicker: "Asian Top 10 Family",
  heroTitle: "The family name behind a quieter kind of service.",
  heroBangla: "একটি নাম, একটি ডেস্ক, এবং যে অর্ডারটা আপনি দিয়েছেন ঠিক সেটি।",
  heroSubtitle:
    "Diamond packages with the price in the open, a member account that remembers the order, and a company profile you can send to anyone who asks who we are.",
  introTitle: "Asian Top 10 Family",
  introBody:
    "We are a family desk for diamond packages and member care. The work is simple to say and strict to do: show the price, take the UID, confirm the payment, and place the value on the account that was written down.\n\nThis website is the public face of that desk. It is also the page a partner can read before they send a single taka.",
  aboutTitle: "A house with the name on the door.",
  aboutBody:
    "Asian Top 10 Family is a private house for digital diamond packages and member care. The public site is the front door. The desk behind it is where an order is actually read.\n\nWe built this for people who are tired of anonymous top-up pages. Prices sit in the open. The UID is checked before anything is placed. Payment is confirmed by a person, then the package is delivered to the account you named.\n\nThe family name is the standard. If a receipt says Asian Top 10 Family, it should mean the same thing in Dhaka, on WhatsApp, and on this page.",
  mission:
    "To make a diamond order feel as careful as a family errand: the right account, the right amount, and a person who answers.",
  vision:
    "A South Asian house whose name is enough. Partners should not have to guess who is on the other side of a payment.",
  packageTitle: "Diamond desk",
  packageIntro:
    "Choose a package, write the member UID carefully, and pay the house number for that wallet. The desk confirms the transaction, then places the diamonds.",
};

const OLD_SERVICES = [
  { title: "Diamond packages", summary: "Select a package, send the UID, and the desk places that value on the account you named." },
  { title: "Member accounts", summary: "A private login for your orders, status, and a password you can change yourself." },
  { title: "Family desk", summary: "Larger orders and trade questions come to a person, not a form that nobody reads." },
  { title: "Company profile", summary: "A public page for partners who need to know who they are paying before they pay." },
];

const OLD_ACHIEVEMENTS = [
  { title: "Prices", detail: "The card and the order show the same taka." },
  { title: "Desk", detail: "A person confirms payment before delivery." },
  { title: "The age we keep", detail: "This house is not for children." },
  { title: "Name on the door", detail: "Asian Top 10 Family, written the same way everywhere." },
];

const OLD_TEAM = [
  { name: "Farhan Qureshi", highlight: "Keeps the standard the receipt has to match." },
  { name: "Nusrat Alam", highlight: "Reads the UID before anything is placed." },
  { name: "Imran Chowdhury", highlight: "The person on the other side of the message." },
  { name: "Leena Karim", highlight: "Opens the door for trade accounts." },
];

async function main() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: "main" } });
  if (!settings) {
    console.log("No site settings yet — run the seed instead.");
    return;
  }
  const data: Partial<typeof AGENCY_SETTINGS> = {};
  for (const key of Object.keys(AGENCY_SETTINGS) as (keyof typeof AGENCY_SETTINGS)[]) {
    if (settings[key] === OLD_SETTINGS[key]) data[key] = AGENCY_SETTINGS[key];
  }
  if (Object.keys(data).length) await prisma.siteSetting.update({ where: { id: "main" }, data });
  console.log(`Settings: refreshed ${Object.keys(data).length} of ${Object.keys(AGENCY_SETTINGS).length} fields.`);

  let services = 0;
  for (const [index, old] of OLD_SERVICES.entries()) {
    const result = await prisma.service.updateMany({ where: { title: old.title, summary: old.summary }, data: AGENCY_SERVICES[index] });
    services += result.count;
  }
  console.log(`Services: refreshed ${services}.`);

  if (settings.heroBangla.startsWith("একটি নাম")) {
    await prisma.siteSetting.update({ where: { id: "main" }, data: { heroBangla: AGENCY_SETTINGS.heroBangla } });
    console.log("Settings: refreshed the Bangla line.");
  }

  let others = 0;
  for (const [index, old] of OLD_ACHIEVEMENTS.entries()) {
    others += (await prisma.achievement.updateMany({ where: old, data: AGENCY_ACHIEVEMENTS[index] })).count;
  }
  for (const [index, old] of OLD_TEAM.entries()) {
    others += (await prisma.teamMember.updateMany({ where: old, data: AGENCY_TEAM[index] })).count;
  }
  console.log(`Achievements and team: refreshed ${others}.`);
}

main().finally(() => prisma.$disconnect());
