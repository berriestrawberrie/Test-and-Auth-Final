import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Load test environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

// Verify we're using the test database
if (!process.env.DATABASE_URL?.includes("WQiOjEsInNlY3VyZV9rZXkiOiJza")) {
  throw new Error("❌ TEST DATABASE NOT CONFIGURED! Check your .env.test file");
}

console.log("✅ Test client connected to test database");

// Export a dedicated test Prisma client
export const testPrisma = new PrismaClient();
