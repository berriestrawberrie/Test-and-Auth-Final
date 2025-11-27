import { clearTestData, createTestAdmin } from "./helpers";
import { testPrisma } from "./testClient";

if (process.env.NODE_ENV !== "test") {
  console.warn('⚠️  NODE_ENV is not set to "test"');
}

console.log("✅ Test environment loaded");
// Runs before testing starts.
beforeAll(async () => {
  await clearTestData();
  await createTestAdmin();
});

// Cleanup after all tests have finished.
afterAll(async () => {
  await clearTestData();
  await testPrisma.$disconnect();
  console.log("✅ Global test cleanup complete");
});
