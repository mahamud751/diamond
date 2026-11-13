"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { placeOrder, type OrderState } from "@/actions/orders";
import { Field } from "@/components/field";
import { Gem } from "@/components/gem";
import { Icon } from "@/components/icons";
import { diamondCount, PAYMENTS, taka, usd, type PaymentId } from "@/lib/format";
import type { PackageCard } from "@/lib/content";

type Prefill = { name?: string; email?: string; phone?: string };

export function PackageDesk({
  packages,
  wallets,
  prefill,
  initialPackage,
}: {
  packages: PackageCard[];
  wallets: Record<PaymentId, string>;
  prefill?: Prefill;
  initialPackage?: string;
}) {
  const [selected, setSelected] = useState(
    packages.find((item) => item.id === initialPackage)?.id ?? packages.find((item) => item.highlight)?.id ?? packages[0]?.id ?? "",
  );
  const [method, setMethod] = useState<PaymentId>("BKASH");
  const [qty, setQty] = useState(1);
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, {});
  const current = useMemo(() => packages.find((item) => item.id === selected) ?? packages[0], [packages, selected]);

  if (!current) {
    return (
      <div className="panel empty">
        <p>The store has no open packages right now. Please check back shortly.</p>
      </div>
    );
  }

  if (state.code) {
    return (
      <div className="receipt">
        <span className="form-done-icon">
          <Icon name="check" size={26} />
        </span>
        <p className="kicker">Order received</p>
        <h2>Thank you — we have your order.</h2>
        <p className="lede">
          {diamondCount(state.diamonds ?? current.diamonds)} · {taka(state.amount ?? current.priceBdt)}
        </p>
        <p className="receipt-code">
          Order code <strong>{state.code}</strong>
        </p>
        <p className="muted">Keep this code. Delivery starts once our team has verified the payment.</p>
        <div className="hero-actions">
          <Link className="btn btn-gold" href={`/track?code=${state.code}`}>
            Track this order
          </Link>
          <Link className="btn btn-glass" href="/account">
            Your account
          </Link>
        </div>
      </div>
    );
  }

  const payTo = wallets[method];

  return (
    <div className="desk">
      <div>
        <h2 className="desk-title">
          <span>1</span> Choose a package
        </h2>
        <div className="package-grid" role="group" aria-label="Diamond packages">
          {packages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === current.id ? "package-option is-on" : "package-option"}
              aria-pressed={item.id === current.id}
              onClick={() => setSelected(item.id)}
            >
              {item.highlight ? <span className="pack-badge">Family pick</span> : null}
              <span className="package-gem">
                <Gem />
              </span>
              <span className="package-name">
                <b>{item.diamonds.toLocaleString("en-US")}</b>
                <small>Diamonds</small>
              </span>
              <span className="package-price">
                <b>{taka(item.priceBdt)}</b>
                <small>≈ {usd(item.priceUsd)}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <form className="order-card" action={action}>
        <h2 className="desk-title">
          <span>2</span> Your order
        </h2>
        <div className="order-summary">
          <span className="package-gem">
            <Gem />
          </span>
          <div>
            <b>{diamondCount(current.diamonds * qty)}</b>
            <small>{current.name}</small>
          </div>
          <div className="order-total">
            <strong>{taka(current.priceBdt * qty)}</strong>
            <small>≈ {usd(current.priceUsd * qty)}</small>
          </div>
        </div>
        <input type="hidden" name="packageId" value={current.id} />
        <div className="grid-2">
          <Field label="Chamet UID" hint="The account that receives the diamonds.">
            <input name="recipientUid" required minLength={3} maxLength={40} placeholder="UID" autoComplete="off" />
          </Field>
          <Field label="Quantity">
            <input
              name="quantity"
              type="number"
              min={1}
              max={10}
              value={qty}
              onChange={(event) => setQty(Math.min(10, Math.max(1, Number(event.target.value) || 1)))}
            />
          </Field>
        </div>
        <Field label="Your name">
          <input name="customerName" required defaultValue={prefill?.name ?? ""} autoComplete="name" />
        </Field>
        <div className="grid-2">
          <Field label="Phone">
            <input name="phone" required defaultValue={prefill?.phone ?? ""} autoComplete="tel" />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required defaultValue={prefill?.email ?? ""} autoComplete="email" />
          </Field>
        </div>
        <input type="hidden" name="paymentMethod" value={method} />
        <div className="field">
          <span id="pay-method-label">Payment method</span>
          <div className="pay-methods" role="group" aria-labelledby="pay-method-label">
            {PAYMENTS.map((item) => (
              <button key={item.id} type="button" aria-pressed={method === item.id} onClick={() => setMethod(item.id)}>
                {item.id === "BANK" ? "Bank" : item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="pay-note">
          <small>Send {taka(current.priceBdt * qty)} to</small>
          <strong>{payTo || "Payment details are being updated — contact support."}</strong>
        </div>
        <div className="grid-2">
          <Field label={method === "BANK" ? "Account you paid from" : "Sender number"}>
            <input name="senderNumber" required minLength={4} />
          </Field>
          <Field label="Transaction ID">
            <input name="transactionId" required minLength={4} autoComplete="off" />
          </Field>
        </div>
        <Field label="Note">
          <textarea name="note" maxLength={500} placeholder="Optional" />
        </Field>
        {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
        <button className="btn btn-gold btn-block btn-lg" type="submit" disabled={pending}>
          {pending ? "Sending…" : `Place order · ${taka(current.priceBdt * qty)}`}
        </button>
        <p className="form-note">
          <Icon name="shield" size={14} /> Our team verifies the payment, then delivers the diamonds to the UID you wrote.
        </p>
      </form>
    </div>
  );
}
