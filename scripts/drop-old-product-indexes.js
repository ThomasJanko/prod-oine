/**
 * One-time script: drop old Product indexes (slug_1, name_1) from the migration.
 * Run from project root: node scripts/drop-old-product-indexes.js
 * Set MONGODB_URI in env, or: set MONGODB_URI=your_uri && node scripts/drop-old-product-indexes.js
 */

const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load .env.local or .env if present (no extra dependency)
function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const p = path.resolve(process.cwd(), f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        const key = "MONGODB_URI";
        if (trimmed.startsWith(key + "=") || trimmed.startsWith(key + " =")) {
          const value = trimmed.split("=", 2)[1].trim().replace(/^["']|["']$/g, "");
          if (value) process.env.MONGODB_URI = value;
        }
      }
      break;
    }
  }
}
loadEnv();

let uri = process.env.MONGODB_URI || "mongodb://localhost:27017/prod-oine";

// Remove empty URI options (e.g. appName= with no value) to avoid MongoAPIError
function sanitizeUri(u) {
  return u
    .replace(/([?&])appName=(?:&|$)/g, (_, p) => p)
    .replace(/\?&/g, "?")
    .replace(/\?$/, "");
}
uri = sanitizeUri(uri);

async function run() {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not set. Using default (localhost). Create .env.local with MONGODB_URI=your_uri if you use Atlas.");
  }
  await mongoose.connect(uri);
  const coll = mongoose.connection.collection("products");
  const indexes = await coll.indexes();

  for (const idx of indexes) {
    const name = idx.name;
    if (name === "slug_1" || name === "name_1") {
      console.log("Dropping index:", name);
      await coll.dropIndex(name);
    }
  }

  console.log("Done.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  if (err.name === "MongooseServerSelectionError" || err.cause?.code === "ECONNREFUSED") {
    console.error("Cannot connect to MongoDB.");
    console.error("  - If you use MongoDB Atlas: set MONGODB_URI in .env.local and run again.");
    console.error("  - If local: start MongoDB (e.g. run mongod or start the MongoDB service).");
  } else {
    console.error(err);
  }
  process.exit(1);
});
