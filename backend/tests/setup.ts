import { testPrisma } from "./testClient";

if (process.env.NODE_ENV !== "test") {
  console.warn('⚠️  NODE_ENV is not set to "test"');
}

console.log("✅ Test environment loaded");

const TEST_ADMIN_ID = "adminAdminAdminAdminAdmin123";

// Create admin once
beforeAll(async () => {
  await testPrisma.grade.deleteMany();
  await testPrisma.user.deleteMany();
  await testPrisma.course.deleteMany();

  await testPrisma.user.create({
    data: {
      id: TEST_ADMIN_ID,
      email: "admin@test.com",
      firstName: "Test",
      lastName: "Admin",
      personNumber: "19900101-1234",
      phone: "+46701234567",
      address: "Test Street 1",
      role: "ADMIN",
    },
  });

  console.log("Global test admin created");
});

// Cleanup so each test starts fresh
afterAll(async () => {
  await testPrisma.grade.deleteMany();
  await testPrisma.user.deleteMany();
  await testPrisma.course.deleteMany();
  await testPrisma.$disconnect();
  console.log("Global test cleanup complete");
});
