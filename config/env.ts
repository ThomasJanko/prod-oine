/**
 * Centralized env config. Fail fast in build/runtime if required vars missing.
 */

function env(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) throw new Error(`Missing env: ${key}`);
  return value;
}

/** Remove empty MongoDB URI options (e.g. appName=) to avoid MongoAPIError */
function sanitizeMongoUri(uri: string): string {
  return uri
    .replace(/([?&])appName=(?:&|$)/g, (_, p) => p)
    .replace(/\?&/g, "?")
    .replace(/\?$/, "");
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  mongodbUri: sanitizeMongoUri(env("MONGODB_URI", "mongodb://localhost:27017/prod-oine")),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  appUrl: env("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
} as const;
