import Image from "next/image";
import { removeMedia, saveSettings, uploadMedia } from "@/actions/admin";
import { AdminForm } from "@/components/admin-form";
import { Field } from "@/components/field";
import { IconForm } from "@/components/row-actions";
import { prisma } from "@/lib/prisma";

export default async function SettingsAdmin() {
  const [settings, media] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: "main" } }),
    prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  if (!settings) return <p>Seed the database before editing the house.</p>;

  return (
    <>
      <p className="kicker">Setting</p>
      <h1>Words, numbers, and pictures.</h1>
      <div className="stack" style={{ marginTop: 18 }}>
        <AdminForm action={saveSettings} submit="Save settings">
          <fieldset className="fieldset stack">
            <legend>Dollar rate</legend>
            <Field label="1 USD in taka" hint="126 means 1 USD = ৳126. Every dollar price on the site is the taka price divided by this rate.">
              <input name="usdRate" type="number" min={1} max={100000} step="0.01" defaultValue={Number(settings.usdRate)} required />
            </Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Registration links</legend>
            <Field label="Host registration link" hint="Opened when someone chooses host. Paste the full address.">
              <input name="hostRegisterUrl" defaultValue={settings.hostRegisterUrl} placeholder="https://" />
            </Field>
            <Field label="Agent registration link" hint="Opened when someone chooses agent. Paste the full address.">
              <input name="agentRegisterUrl" defaultValue={settings.agentRegisterUrl} placeholder="https://" />
            </Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Hero</legend>
            <div className="grid-2">
              <Field label="Brand"><input name="brandName" defaultValue={settings.brandName} required /></Field>
              <Field label="Kicker"><input name="heroKicker" defaultValue={settings.heroKicker} /></Field>
            </div>
            <Field label="Tagline"><input name="tagline" defaultValue={settings.tagline} /></Field>
            <Field label="Hero title"><textarea name="heroTitle" defaultValue={settings.heroTitle} required /></Field>
            <Field label="Bangla line"><input name="heroBangla" defaultValue={settings.heroBangla} /></Field>
            <Field label="Hero subtitle"><textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} /></Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Introduction and company</legend>
            <Field label="Intro title"><input name="introTitle" defaultValue={settings.introTitle} /></Field>
            <Field label="Intro"><textarea name="introBody" defaultValue={settings.introBody} /></Field>
            <Field label="About title"><input name="aboutTitle" defaultValue={settings.aboutTitle} /></Field>
            <Field label="About"><textarea name="aboutBody" defaultValue={settings.aboutBody} style={{ minHeight: 160 }} /></Field>
            <Field label="Mission"><textarea name="mission" defaultValue={settings.mission} /></Field>
            <Field label="Vision"><textarea name="vision" defaultValue={settings.vision} /></Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Diamond desk</legend>
            <Field label="Desk title"><input name="packageTitle" defaultValue={settings.packageTitle} /></Field>
            <Field label="Desk introduction"><textarea name="packageIntro" defaultValue={settings.packageIntro} /></Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Contact</legend>
            <div className="grid-2">
              <Field label="Phone"><input name="phone" defaultValue={settings.phone} /></Field>
              <Field label="Email"><input name="email" type="email" defaultValue={settings.email} required /></Field>
            </div>
            <div className="grid-2">
              <Field label="WhatsApp"><input name="whatsapp" defaultValue={settings.whatsapp} /></Field>
              <Field label="Hours"><input name="hours" defaultValue={settings.hours} /></Field>
            </div>
            <Field label="Address"><input name="address" defaultValue={settings.address} /></Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Payment numbers</legend>
            <div className="grid-2">
              <Field label="bKash"><input name="bkash" defaultValue={settings.bkash} /></Field>
              <Field label="Nagad"><input name="nagad" defaultValue={settings.nagad} /></Field>
              <Field label="Rocket"><input name="rocket" defaultValue={settings.rocket} /></Field>
              <Field label="Upay"><input name="upay" defaultValue={settings.upay} /></Field>
            </div>
            <Field label="Order WhatsApp" hint="After a diamond order is placed, the member is sent to this chat. Use the country code, for example 8801300030915.">
              <input name="orderWhatsapp" defaultValue={settings.orderWhatsapp} placeholder="8801300030915" />
            </Field>
            <Field label="Bank details"><textarea name="bankDetails" defaultValue={settings.bankDetails} /></Field>
          </fieldset>
          <fieldset className="fieldset stack">
            <legend>Social</legend>
            <Field label="Facebook"><input name="facebook" defaultValue={settings.facebook} /></Field>
            <Field label="Instagram"><input name="instagram" defaultValue={settings.instagram} /></Field>
            <Field label="Telegram"><input name="telegram" defaultValue={settings.telegram} /></Field>
          </fieldset>
        </AdminForm>

        <section className="panel">
          <h2>Images</h2>
          <p className="muted">Choose a picture from your device. Tick the box to use it as the hero portrait.</p>
          <AdminForm action={uploadMedia} submit="Upload" resetOnSuccess>
            <Field label="Image from your device"><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></Field>
            <Field label="Alt text"><input name="alt" /></Field>
            <label className="check"><input type="checkbox" name="asHero" defaultChecked /> Use as the hero portrait</label>
          </AdminForm>
          <div className="media-grid" style={{ marginTop: 16 }}>
            {media.map((item) => (
              <figure key={item.id}>
                <Image src={item.url} alt={item.alt} width={280} height={180} unoptimized />
                <figcaption>
                  <span className="muted">{item.url === settings.heroImage ? "Hero portrait" : item.alt || "House image"}</span>
                  <IconForm action={removeMedia} id={item.id} label="Delete image" icon="trash" tone="danger" />
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
