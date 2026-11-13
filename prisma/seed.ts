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
      phone: "+880 1700 000 000",
      email: "desk@asiantop10.family",
      whatsapp: "8801700000000",
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
