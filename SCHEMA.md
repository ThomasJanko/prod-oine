# Database schema (MongoDB)

Equivalent of the requested relational schema, adapted for MongoDB with Mongoose.

## Collections

### products

- **slug** (string, unique) — URL-safe id
- **name**, **description**
- **basePrice** (number, cents)
- **options** (array of option objects)
  - **key** (e.g. `color`, `legs`, `wood`)
  - **label** (display name)
  - **choices** (array): `value`, `label`, `priceModifier` (cents), optional `imageSuffix`
- **defaultOptions** (object, optional) — initial selection e.g. `{ color: "black" }`
- **createdAt**, **updatedAt**

Indexes: `slug` (unique), `name`.

### orders

- **stripeSessionId** (string, sparse unique)
- **stripePaymentIntentId**
- **email**
- **status** — `pending` | `paid` | `failed` | `refunded`
- **totalCents**
- **items** (array, snapshot per line):
  - **productId**, **productName**, **productSlug**
  - **selectedOptions** (full config)
  - **quantity**, **unitPriceCents**, optional **imagePath**
- **createdAt**, **updatedAt**

Indexes: `stripeSessionId`, `email`, `status`, `createdAt`.

## Design notes

- No separate `users` collection in MVP; identity is email from Stripe Checkout.
- No separate `product_options` / `product_variants` tables; options are embedded in product for simplicity. Scale by splitting later if needed.
- Orders store a full snapshot in `items` so history is correct even if products or prices change.
- Price is always computed server-side from product + selected options; never stored in cart on client except for display after server validation.
