import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL?.includes("WQiOjEsInNlY3VyZV9rZXkiOiJza")) {
  throw new Error("❌ TEST DATABASE NOT CONFIGURED! Check your .env.test file");
}
console.log("✅ Test client connected to test database");
// Export a dedicated test Prisma client
export const testPrisma = new PrismaClient();
