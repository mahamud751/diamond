"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gem, Arrow } from "@/components/gem";
import { taka, usd } from "@/lib/format";
import type { PackageCard } from "@/lib/content";

export function RevealEffects() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.classList.add("will-reveal");
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("will-reveal"));
    };
  }, []);
  return null;
}

const TABS = [
  ["popular", "Popular"],
  ["starter", "Starter"],
  ["premium", "Premium"],
] as const;

export function HomePackages({ packages }: { packages: PackageCard[] }) {
  const [category, setCategory] = useState<(typeof TABS)[number][0]>("popular");
  const filtered =
    category === "starter"
      ? packages.filter((item) => item.diamonds <= 30000)
      : category === "premium"
        ? packages.filter((item) => item.diamonds >= 100000)
        : packages.filter((item) => item.highlight || item.diamonds === 15000 || item.diamonds === 30000);
  const shown = (filtered.length ? filtered : packages).slice(0, 4);

  if (!packages.length) return <p className="lede">Packages are being updated. Please check back shortly.</p>;

  return (
    <>
      <div className="tabs-row">
        <div className="tabs" role="group" aria-label="Package category">
          {TABS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)}>
              {label}
            </button>
          ))}
        </div>
        <span className="tabs-note">Prices in BDT · delivered to your Chamet UID</span>
      </div>
      <div className="pack-grid">
        {shown.map((item) => (
          <article className={item.highlight ? "pack is-featured" : "pack"} key={item.id}>
            {item.highlight ? <span className="pack-badge">Family pick</span> : null}
            <div className="pack-gem">
              <Gem />
            </div>
            <h3>
              {item.diamonds.toLocaleString("en-US")}
              <span>Diamonds</span>
            </h3>
            <div className="pack-price">
              <b>{taka(item.priceBdt)}</b>
              <span>≈ {usd(item.priceUsd)}</span>
            </div>
            <Link className={item.highlight ? "btn btn-gold btn-block" : "btn btn-violet btn-block"} href={`/packages?package=${encodeURIComponent(item.id)}`}>
              Buy now <Arrow />
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

const faqs = [
  ["How do I join the agency?", "Open the For Agency page and send the short application as a host or an agent. A team member reviews it and contacts you on the phone or WhatsApp number you gave."],
  ["Does it cost anything to apply?", "No. Applying is free. Our team explains everything about how the agency works before you decide to start."],
  ["How do I buy Chamet diamonds?", "Choose a package in the Diamond Store, enter your Chamet UID and pay to the wallet shown. Submit your transaction ID and our team verifies the payment before delivering to your UID."],
  ["Which payment methods can I use?", "bKash, Nagad, Rocket, Upay and bank transfer. The payment details appear after you choose a method — always confirm them on the order form before sending money."],
  ["How do withdrawals work?", "Send a withdrawal request with your UID, the amount and where you want to be paid. Our team checks the request against your agency record and confirms with you before any payout."],
  ["How can I check my order?", "Keep the order code from your receipt and use Track an order with the email you ordered with. Signed-in members also see their orders in My account."],
];

export function HomeFaq() {
  return (
    <div className="faq-list">
      {faqs.map(([question, answer], index) => (
        <details key={question} open={index === 0}>
          <summary>
            {question}
            <span className="faq-plus" aria-hidden="true" />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}
