# Prod'Oine — E-commerce foundation

Minimal, scalable furniture e-commerce: configurable products, dynamic pricing, Stripe Checkout, MongoDB. Styled for an industrial-rustic brand (warm wood, dark metal, clean typography).

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand
- **Backend:** MongoDB (Mongoose), Stripe Checkout, Server Actions / API routes

## Features

- Product configuration (options: color, texture, legs, etc.) with price modifiers
- 2D images per option combination (`public/products/{slug}/base.jpg`, `color-black.jpg`, …)
- Dynamic price (server-computed; client never trusted)
- Cart (Zustand), checkout via Stripe, orders stored with full config snapshot
- Admin: create/edit products, options, view orders
- Architecture ready for future 3D viewer (see `FUTURE_3D.md`)

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set:

   - `MONGODB_URI` — MongoDB connection string (default: `mongodb://localhost:27017/prod-oine`)
   - `STRIPE_SECRET_KEY` — Stripe secret key (test or live)
   - `STRIPE_WEBHOOK_SECRET` — From Stripe CLI or Dashboard (webhook endpoint: `POST /api/webhooks/stripe`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
   - `NEXT_PUBLIC_APP_URL` — App URL (e.g. `http://localhost:3000`)

3. **Stripe webhook (local)**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Use the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET`.

4. **Run**

   ```bash
   npm run dev
   ```

   - Site: http://localhost:3000  
   - Admin: http://localhost:3000/admin  

## Project structure

See `STRUCTURE.md` for folder roles. Summary:

- `app/` — Routes, layouts, API, server actions
- `components/` — UI (Header, Cart, Option selectors)
- `lib/` — DB connection, pricing, image mapping, models
- `services/` — Product/order/Stripe logic
- `types/` — Shared TS types
- `config/` — Env and constants
- `hooks/` — Cart (Zustand), etc.

## Product images

Place images under `public/products/{product-slug}/`:

- `base.jpg` — Default image
- `{imageSuffix}.jpg` — One per option choice that has `imageSuffix` (e.g. `color-black.jpg`, `wood-oak.jpg`)

Image suffix is set in admin when creating/editing product options (JSON).

## Security

- Price is **always** computed on the server (`lib/pricing.ts`). Cart and checkout send only product id + selected options; server validates and computes price before creating the Stripe session.
- Webhook verifies signature and recreates order from session metadata (items snapshot). Total is checked against metadata.

## Future 3D

See `FUTURE_3D.md` for how to replace 2D images with a 3D viewer while keeping pricing and options unchanged.
