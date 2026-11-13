import { PrismaClient, type PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AGENCY_ACHIEVEMENTS, AGENCY_SERVICES, AGENCY_SETTINGS, AGENCY_TEAM } from "./agency-copy";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@asiantop10.family";
const MEMBER_EMAIL = "member@asiantop10.family";

async function main() {
  const adminHash = await bcrypt.hash("At10Family#2026", 10);
  const memberHash = await bcrypt.hash("Member#2026", 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: {
      name: "House Admin",
      email: ADMIN_EMAIL,
      phone: "+8801700000000",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: MEMBER_EMAIL },
    update: {},
    create: {
      name: "Sample Member",
      email: MEMBER_EMAIL,
      phone: "+8801800000000",
      passwordHash: memberHash,
      role: "MEMBER",
    },
  });

  const existing = await prisma.siteSetting.findUnique({ where: { id: "main" } });
  if (existing) {
    console.log("House content already exists. Admin account is ready.");
    return;
  }

  await prisma.siteSetting.create({
    data: {
      id: "main",
      brandName: "Asian Top 10 Family",
      ...AGENCY_SETTINGS,
      phone: "+880 1300-030915",
      email: "desk@asiantop10.family",
      whatsapp: "+880 1300-030915",
      orderWhatsapp: "8801300030915",
      address: "House 10, Road 12, Gulshan, Dhaka",
      hours: "Every day, 10:00–02:00 BST",
      bkash: "01700 000 000",
      nagad: "01800 000 000",
      rocket: "01900 000 000",
      upay: "01600 000 000",
      bankDetails: "Asian Top 10 Family — replace with the house bank account before taking payments.",
      facebook: "",
      instagram: "",
      telegram: "",
      heroImage: "",
      hostRegisterUrl: "https://wa.me/8801300030915?text=Hello%20Asian%20Top%2010%20Family%2C%20I%20want%20to%20register%20as%20a%20host.",
      agentRegisterUrl: "https://wa.me/8801300030915?text=Hello%20Asian%20Top%2010%20Family%2C%20I%20want%20to%20register%20as%20an%20agent.",
    },
  });

  await prisma.service.createMany({
    data: AGENCY_SERVICES.map((service, index) => ({ ...service, sortOrder: index + 1 })),
  });

  await prisma.achievement.createMany({
    data: AGENCY_ACHIEVEMENTS.map((item, index) => ({ ...item, sortOrder: index + 1 })),
  });

  await prisma.teamMember.createMany({
    data: AGENCY_TEAM.map((person, index) => ({ ...person, sortOrder: index + 1 })),
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Rafi",
        role: "Member, Dhaka",
        quote: "I sent the UID, paid on bKash, and the desk wrote back before my tea was finished.",
        rating: 5,
        sortOrder: 1,
      },
      {
        name: "Mitu",
        role: "Member, Chattogram",
        quote: "The price on the card was the price I paid. That is rarer than it should be.",
        rating: 5,
        sortOrder: 2,
      },
      {
        name: "Hasan",
        role: "Trade desk, Sylhet",
        quote: "We moved the larger orders here because someone actually reads them.",
        rating: 5,
        sortOrder: 3,
      },
    ],
  });

  const catalog = [
    [10000, 250, 1.95],
    [15000, 360, 2.81],
    [20000, 470, 3.67],
    [25000, 580, 4.53],
    [30000, 690, 5.39],
    [50000, 1120, 8.75, true],
    [100000, 2200, 17.19, true],
    [150000, 3280, 25.63],
    [200000, 4350, 33.98],
    [300000, 6480, 50.63],
    [500000, 10600, 82.81],
    [1000000, 20800, 162.5],
  ] as const;

  for (const [index, row] of catalog.entries()) {
    const [diamonds, priceBdt, priceUsd, highlight] = row;
    await prisma.package.create({
      data: {
        name: `Family ${diamonds.toLocaleString("en-US")}`,
        diamonds,
        priceBdt,
        priceUsd,
        highlight: Boolean(highlight),
        sortOrder: index + 1,
        description: "Placed on the UID after the desk confirms payment.",
      },
    });
  }

  const sample = await prisma.package.findFirst({ where: { diamonds: 50000 } });
  if (sample) {
    await prisma.order.create({
      data: {
        code: "AT10-SAMPLE",
        userId: member.id,
        packageId: sample.id,
        packageName: sample.name,
        diamonds: sample.diamonds,
        quantity: 1,
        amountBdt: sample.priceBdt,
        amountUsd: sample.priceUsd,
        customerName: member.name,
        email: member.email,
        phone: member.phone ?? "",
        recipientUid: "UID10001",
        paymentMethod: "BKASH" satisfies PaymentMethod,
        senderNumber: "01800000000",
        transactionId: "SAMPLETRX",
        note: "Starter order so the desk is not empty.",
        status: "PENDING",
      },
    });
  }

  await prisma.page.createMany({
    data: [
      {
        slug: "standards",
        title: "House standards",
        navLabel: "Standards",
        excerpt: "How an order is read, paid, and placed.",
        showInNav: false,
        published: true,
        sortOrder: 1,
        body: "Asian Top 10 Family takes orders from adults. The UID on the form is the account that receives the diamonds. If the UID is wrong, the desk will ask before placing anything.\n\nPayment numbers on the order card are the only numbers that belong to this house. A message from any other number is not the desk.\n\nDelivery follows a confirmed transaction. Pending means the desk has the order and is still matching the payment. Delivered means the value was placed on the UID you wrote.",
      },
      {
        slug: "trade-desk",
        title: "Trade desk",
        navLabel: "Trade",
        excerpt: "For partners who order beyond a single package.",
        showInNav: true,
        published: true,
        sortOrder: 2,
        body: "Trade accounts are opened by the desk, not by a button. Write with your name, the volume you expect, and the wallet you pay from.\n\nThe public packages stay the public price. A trade rate, when one is offered, is written back to you and does not change the card another member sees.",
      },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "Your first week as a host",
        slug: "first-week-as-a-host",
        excerpt: "What the desk walks a new host through before the first stream, and what a steady week looks like after that.",
        coverImage: "/images/team-collaboration.jpg",
        published: true,
        createdAt: new Date("2026-11-02T10:00:00+06:00"),
        body: "A new host does not go live alone. The first conversation is with a named manager, who checks the account, the house rules, and the hours you can actually keep.\n\nThe first week is about the room, not about a target. You learn how to start a stream, how to greet someone who stays, and who to message when the app or a payout does not look right.\n\nBy the end of that week you should know three things: when you go live, how a customer is treated in this family, and which person answers when you ask.",
      },
      {
        title: "How a diamond order is checked",
        slug: "how-a-diamond-order-is-checked",
        excerpt: "The UID, the wallet, and the transaction ID are read by a person before any diamonds are placed.",
        coverImage: "/images/workspace.jpg",
        published: true,
        createdAt: new Date("2026-11-06T16:30:00+06:00"),
        body: "Every diamond order on this desk follows the same path. You choose a package, write the Chamet UID that should receive it, and pay the number shown for bKash, Nagad, Rocket, Upay, or the bank.\n\nThe price on the card is the price in taka. The dollar line is that amount divided by the rate set in the house settings.\n\nNothing is placed until the transaction ID matches a payment the desk can see. If the UID is unclear, the team writes back before moving the order. Delivered means the value was placed on the UID you wrote.",
      },
      {
        title: "What an agent does in the family",
        slug: "what-an-agent-does",
        excerpt: "An agent brings hosts in, stays beside them, and keeps one line open to the agency desk.",
        coverImage: "",
        published: true,
        createdAt: new Date("2026-11-10T12:00:00+06:00"),
        body: "An agent is not a second brand. You bring your own hosts under Asian Top 10 Family and you stay the person they ask first.\n\nA normal day is a short list: who is ready to go live, who needs the house rules again, and which question should come to the desk instead of being guessed.\n\nThe family gives you the structure and a partner. You give the hosts a steady hand. Registration for that seat is the agent link the desk publishes.",
      },
    ],
  });

  await prisma.media.createMany({
    data: [
      { url: "/images/team-collaboration.jpg", alt: "The desk working through the day" },
      { url: "/images/workspace.jpg", alt: "The house workspace" },
    ],
  });

  await prisma.contactMessage.create({
    data: {
      name: "A partner",
      email: "partner@example.com",
      phone: "+8801600000000",
      subject: "Trade account",
      message: "Starter message so the inbox shows how a note arrives. Replace the contact details before launch.",
    },
  });

  console.log("Asian Top 10 Family is seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
