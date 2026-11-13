# Asian Top 10 Family

A complete local Next.js application with an ivory, forest-green and lime visual identity, animated responsive pages, a PostgreSQL-backed diamond catalog, member accounts and an admin dashboard.

## Open locally

The current development preview is at http://localhost:3000. Admin: http://localhost:3000/admin.

For a fresh installation, use Node.js 22+ and a running PostgreSQL instance:

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and a long random AUTH_SECRET in .env.
# Create the database named in DATABASE_URL, for example:
createdb asian_top10
npm run db:migrate
npm run db:seed
npm run dev
```

DATABASE_URL uses the format `postgresql://USER:PASSWORD@127.0.0.1:5432/asian_top10?schema=public`. Set NEXT_PUBLIC_SITE_URL to the public origin for deployment. Never commit .env.

## Local demonstration accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@asiantop10.family | At10Family#2026 |
| Member | member@asiantop10.family | Member#2026 |

Change both passwords from the account page before public access. Seeded people, reviews, contact details, prices and wallet numbers are examples. Homepage sample content is labelled. Replace it with approved business content in the dashboard before accepting payments. Photography is illustrative; no official brand logo or colors were supplied, so the logo is provisional.

## Included functionality

- Homepage: editorial hero, company introduction, services, filterable package cards, standards, team, sample testimonials, FAQ, membership call to action and contact form.
- Responsive navigation, reduced-motion support, optimized local photographs, metadata, organization structured data, robots and sitemap.
- About, services, contact and administrator-created public pages.
- Diamond catalog: active PostgreSQL prices, package deep links, quantity, recipient UID, bKash/Nagad/Rocket/Upay/bank selection, transaction details, receipt and order tracking.
- Registration, login, signed httpOnly sessions, member order history and password changes.
- Role-protected administration: orders/status, packages, services, team, achievements, reviews, messages, company content, payment details, images and additional pages.
- Contact messages and orders persist in PostgreSQL; administrator edits appear on the public site.

Payments and diamond fulfillment are manually verified by the operator. No automatic payment gateway, dollar exchange or Chamet API is connected. The site does not claim an official relationship with Chamet.

## Technical stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS/custom CSS, Prisma 6, PostgreSQL, Zod, bcrypt and JOSE. Package totals are computed from server-side prices. Tracking requires the order code and order email.

```bash
npx tsc --noEmit
npm run build
npm start
```

## Deployment and planning

See [the project plan](docs/PROJECT-PLAN.md) for UI/UX direction, reference review, development phases, hosting requirements, cost assumptions and delivery estimates.

Deploy the standard Next.js build to a Node.js host with PostgreSQL and HTTPS. Set production environment variables and run `npx prisma migrate deploy`. Current image uploads use `public/uploads`, which requires persistent server storage. Serverless hosting requires an object-storage upload adapter.

The current application is the local implementation. Production launch still requires approved branding/content, real payment/contact details, changed demonstration credentials and a selected hosting provider. Do not run the demo seed against an unrelated production database.

## Assets and references

Illustrative team and office photographs are downloaded from Unsplash into public/images. Original image identifiers: `photo-1522071820081-009f0129c71c` and `photo-1497366754035-f200968a6e72`. All interface artwork and the provisional logo are SVG/code assets.

Design references: [Nosib signup](https://nosib.exchange/login?mode=signup), [VoucherBD diamond packages](https://voucherbd.com/product/chamet-top-up/), [Chamet company profile](https://www.chamet.com/about-us). Nosib returned no readable content during automated inspection; the other references informed package and company-profile structure.
