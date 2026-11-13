# Asian Top 10 Family — project plan

## Experience and design
A deep royal-violet canvas with gold accents, built entirely in code: a crown-and-podium hero illustration, faceted diamonds, glass cards with gold edges, two light lavender bands for contrast, and gentle motion with reduced-motion support. All public pages, account forms and the admin dashboard share one token-based visual system (`src/app/globals.css`, `src/app/admin/admin.css`).

Navigation follows the agency model: For Agency (host/agent application), Diamond Store, Withdrawal (request form), About and Support. Agency applications and withdrawal requests arrive in Admin → Messages.

Public journey: company introduction → services → diamond packages → UID and payment details → receipt and tracking. Members can create accounts, sign in, view orders and change their passwords. Administrators manage orders, packages, services, company copy, achievements, team members, reviews, contact messages, images and future pages.

## Implementation
1. Inspect the existing application and the three supplied references.
2. Redesign the shared shell and complete the responsive homepage.
3. Preserve and connect the PostgreSQL-backed catalog, authentication, order and CMS flows.
4. Validate TypeScript, production compilation, database access and key browser journeys.
5. Hand over setup instructions, local access and deployment requirements.

## Technology
Next.js 16 App Router, React 19, TypeScript, Tailwind CSS with custom CSS, Prisma 6 and PostgreSQL. Server Actions validate input with Zod. Passwords use bcrypt and sessions use signed httpOnly cookies. Package totals are calculated on the server from the active catalog.

## Hosting requirements
Node.js 22+, PostgreSQL, HTTPS and environment variables: DATABASE_URL, AUTH_SECRET and NEXT_PUBLIC_SITE_URL. A persistent server disk supports current image uploads; a serverless deployment needs object storage. Deploy the normal Next.js build to a Node host. This requested local PostgreSQL implementation is not a Cloudflare Worker deployment.

## Scope and delivery estimate
The local working implementation is delivered in this repository. For a separate production commission, allow approximately 10–15 working days for design approval, verified brand content, implementation, gateway integration if selected, QA and launch. This is a planning estimate, not a commitment by a hosting or development vendor.

## Cost assumptions
The code created in this session has no separately quoted development fee. An external production-build budget needs a written vendor quote after gateway, content, support and deployment scope are agreed. Domain, hosting, database, storage and payment fees are separate; get current provider quotes before purchasing. No service has been purchased here.

## Reference review
- https://nosib.exchange/login?mode=signup — URL opened, but automated retrieval returned no readable content; precise visual parity is not claimed.
- https://voucherbd.com/product/chamet-top-up/ — package selection, diamond quantities, BDT/USD prices, Chamet UID, quantity and payment journey inspected.
- https://www.chamet.com/about-us — company introduction, mission, community and company-profile structure inspected.

## Content and operational boundaries
Seeded people, reviews, contact information, wallet numbers and prices are demonstration content, not verified business claims. Homepage labels make sample people and reviews explicit. Replace them in the admin dashboard before launch. Stock team photography is illustrative. Payments are manually verified by an administrator; no automatic Chamet fulfillment, dollar exchange or payment gateway is connected. The references inform the experience without implying affiliation.
