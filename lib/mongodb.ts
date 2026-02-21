/**
 * MongoDB connection singleton for server-side use.
 * Reuses connection across requests (serverless-friendly).
 */

import mongoose from "mongoose";
import { config } from "@/config/env";

const globalForMongoose = globalThis as unknown as { mongoose: typeof mongoose };

export async function connectDb(): Promise<typeof mongoose> {
  if (globalForMongoose.mongoose?.connection?.readyState === 1) {
    return globalForMongoose.mongoose;
  }
  const conn = await mongoose.connect(config.mongodbUri);
  globalForMongoose.mongoose = conn;
  return conn;
}
