import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { loadHouse } from "@/lib/content";
import { waLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Support",
  description: "Phone, WhatsApp, email and a direct message to the Asian Top 10 Family team.",
};

export default async function ContactPage() {
  const house = await loadHouse();
  if (!house) return null;
  const { settings } = house;
  return (
    <>
      <PageHero
        kicker="Support"
        title={
          <>
            We are here. <em>Talk to us.</em>
          </>
        }
      >
        <p className="lede">Questions about joining, an order or a withdrawal — reach the team the way that suits you.</p>
      </PageHero>
      <section className="shell section contact-grid">
        <div>
          <ul className="contact-list is-cards">
            <li>
              <span className="contact-icon"><Icon name="chat" size={18} /></span>
              <span>
                <small>WhatsApp</small>
                <a href={waLink(settings.whatsapp)}>{settings.whatsapp}</a>
              </span>
            </li>
            <li>
              <span className="contact-icon"><Icon name="phone" size={18} /></span>
              <span>
                <small>Phone</small>
                <a href={`tel:${settings.phone}`}>{settings.phone}</a>
              </span>
            </li>
            <li>
              <span className="contact-icon"><Icon name="mail" size={18} /></span>
              <span>
                <small>Email</small>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </span>
            </li>
            <li>
              <span className="contact-icon"><Icon name="pin" size={18} /></span>
              <span>
                <small>Address</small>
                {settings.address}
              </span>
            </li>
            <li>
              <span className="contact-icon"><Icon name="clock" size={18} /></span>
              <span>
                <small>Hours</small>
                {settings.hours}
              </span>
            </li>
          </ul>
        </div>
        <div className="panel glow">
          <p className="kicker">Send a message</p>
          <h2 className="h-sm">Write to the team</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
