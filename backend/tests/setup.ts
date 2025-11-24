import dotenv from "dotenv";
import path from "path";

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

if (process.env.NODE_ENV !== "test") {
  console.warn('⚠️  NODE_ENV is not set to "test"');
}

console.log("✅ Test environment loaded");
