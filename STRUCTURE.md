# Prod'Oine — Project Structure

## Folder overview

| Folder | Purpose |
|--------|--------|
| **/app** | Next.js App Router: pages, layouts, API routes, server actions. All routes live here. |
| **/components** | Reusable UI: product card, option selectors, cart, header. No business logic. |
| **/lib** | Pure utilities: pricing calculation, DB connection, image mapping. Shared by server and client where safe. |
| **/services** | Backend-facing logic: Stripe, MongoDB operations. Used by API routes and server actions. |
| **/types** | Shared TypeScript types and interfaces (product, order, cart, options). |
| **/config** | App config: env keys, constants, Stripe/MongoDB settings. No secrets in code. |
| **/hooks** | React hooks: cart (Zustand), form state, any shared client-side logic. |

## Design decisions

- **MVP-first**: No feature flags or microservices; single Next.js app + MongoDB.
- **3D-ready**: Image system is abstracted so it can be swapped for a 3D viewer later; pricing and options stay the same.
- **Security**: Price is always computed on the server; client only displays and sends option keys.
