/**
 * Centralized env config. Fail fast in build/runtime if required vars missing.
 */

function env(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) throw new Error(`Missing env: ${key}`);
  return value;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongodbUri: env("MONGODB_URI", "mongodb://localhost:27017/prod-oine"),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  appUrl: env("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
} as const;
