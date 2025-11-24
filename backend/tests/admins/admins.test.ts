import request from "supertest";
import { app } from "../../app";
import { testPrisma } from "../testClient";
import type { User } from "@prisma/client";

// Firebase is "mocked" so that we don't make actual calls to Firebase during tests
jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: "test-admin-uid",
      email: "admin@test.com",
    }),
  }),
  initializeApp: jest.fn(),
}));

describe("GET /admins/students", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.$transaction([
      testPrisma.grade.deleteMany(),
      testPrisma.user.deleteMany(),
      testPrisma.course.deleteMany(),
    ]);

    await testPrisma.user.create({
      data: {
        id: "test-admin-uid",
        email: "admin@test.com",
        firstName: "Test",
        lastName: "Admin",
        personNumber: "19900101-1234",
        phone: "+46701234567",
        address: "Test Street 1",
        role: "ADMIN",
      },
    });
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("should return only students, not admins", async () => {
    // Create 2 students AND 1 admin
    await testPrisma.user.createMany({
      data: [
        {
          id: "student-1",
          email: "student1@test.com",
          firstName: "John",
          lastName: "Doe",
          personNumber: "19950101-1234",
          phone: "+46701111111",
          address: "Student Street 1",
          role: "STUDENT",
        },
        {
          id: "student-2",
          email: "student2@test.com",
          firstName: "Jane",
          lastName: "Smith",
          personNumber: "19960202-5678",
          phone: "+46702222222",
          address: "Student Street 2",
          role: "STUDENT",
        },
        {
          id: "admin-2",
          email: "admin2@test.com",
          firstName: "Another",
          lastName: "Admin",
          personNumber: "19800101-1234",
          phone: "+46703333333",
          address: "Admin Street 1",
          role: "ADMIN",
        },
      ],
    });

    const response = await request(app)
      .get("/admins/students")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .expect(200);

    expect(response.body.users).toHaveLength(2);
    expect(response.body.users.every((u: User) => u.role === "STUDENT")).toBe(true);
    expect(response.body.users[0]).toHaveProperty("firstName");
    expect(response.body.users[0]).toHaveProperty("grades");
  });

  it("should return 404 when no students exist", async () => {
    const response = await request(app)
      .get("/admins/students")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .expect(404);

    expect(response.body.message).toBe("No students found");
    expect(response.body.users).toHaveLength(0);
  });

  it("should return 401 without token", async () => {
    await request(app).get("/admins/students").expect(401);
  });
});
