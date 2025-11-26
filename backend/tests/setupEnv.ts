import dotenv from "dotenv";
import path from "path";

process.env.NODE_ENV = "test";
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

if (!process.env.DATABASE_URL?.includes("WQiOjEsInNlY3VyZV9rZXkiOiJza")) {
  throw new Error("❌ TEST DATABASE NOT CONFIGURED! Check your .env.test file");
}
