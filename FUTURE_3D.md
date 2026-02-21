# Future 3D integration

This doc explains how to replace the 2D image system with a 3D viewer without changing pricing or product configuration logic.

---

## 1. Replacing the image system with a 3D viewer

**Current:** `lib/images.ts` returns a public path like `/products/{slug}/{imageSuffix}.jpg` based on selected options. The product page and cart use this path for `<img>` or Next `<Image>`.

**Later:**

- Add a 3D viewer component (e.g. Three.js / React Three Fiber) that loads a **GLTF** (or GLB) per product.
- Keep the same **option keys and choice values** (e.g. `color: "black"`, `wood: "oak"`). The viewer will receive `productSlug` + `selectedOptions` and apply materials (see below).
- **Do not change** `lib/pricing.ts` or the way options are stored in the DB. Price is computed from product + selected options; 2D vs 3D is only a display concern.
- In `lib/images.ts` you can:
  - Either keep returning a fallback 2D image path for SSR/SEO and use the 3D viewer only on the client, or
  - Introduce a `getProductViewerPayload(slug, selectedOptions)` that returns `{ type: '3d', modelUrl, materialOverrides }` and keep `getProductImagePath` for thumbnails/fallback.

---

## 2. Connecting product options to 3D materials

**Current:** Each option choice can have an `imageSuffix` used to pick a 2D image. Same idea applies to 3D.

**Later:**

- In the product option choices (DB), add an optional field, e.g. `materialKey` or `textureUrl`, in addition to (or instead of) `imageSuffix`.
- The 3D viewer receives `selectedOptions` (e.g. `{ color: "black", legs: "metal" }`). For each option key, resolve the chosen value to a material:
  - Either a **material key** that your GLTF model already defines (e.g. named materials "wood_oak", "metal_black"),
  - Or a **texture URL** / **color** you apply to a known mesh or material slot.
- Map option key → mesh or material slot in the scene (e.g. "color" → frame material, "wood" → shelf material). This mapping can live in product config or in a small client-side map per product slug.
- **Pricing stays unchanged:** the server still uses `product.options[].choices[].priceModifier`; the 3D viewer only uses the same option values for visuals.

---

## 3. Loading GLTF in the future

- Store GLB/GLTF URLs per product (e.g. in product document: `modelUrl` or in a CDN path like `/models/{slug}.glb`).
- In the product page, conditionally render:
  - Either the current 2D image (from `getProductImagePath`),
  - Or a `<ProductViewer3D modelUrl={...} selectedOptions={selectedOptions} />` that loads the model and applies materials from option choices.
- Use a single load per product (e.g. `useGLTF(modelUrl)`) and swap materials when `selectedOptions` change; no need to reload the whole model for each option change.
- Keep **one source of truth** for options: the product document and `selectedOptions` state. The 3D viewer is a pure view layer.

---

## 4. Keeping pricing logic unchanged

- **Cart and checkout:** Continue sending only `productId` + `selectedOptions` + `quantity`. The server validates and computes price with `computeUnitPriceCents(product, selectedOptions)` in `lib/pricing.ts`. No change.
- **Order snapshot:** `order_items` already store `selectedOptions` and `unitPriceCents`. No change for 3D.
- **Admin:** Product create/edit already manage options and price modifiers. You can add `materialKey` or `textureUrl` to choices for the 3D viewer without touching price logic.

Summary: the architecture is already 3D-ready: options and pricing are independent of 2D images. Swap the display layer (image → 3D viewer) and connect option values to materials; keep the rest as-is.
