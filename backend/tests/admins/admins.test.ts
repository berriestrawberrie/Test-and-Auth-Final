// Firebase is "mocked" so that we don't make actual calls to Firebase during tests
jest.mock("firebase-admin", () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: "adminAdminAdminAdminAdmin123", // CANNOT USE TEST_ADMIN_ID HERE. jest.mock will hoist up and initialize before the constant is defined.
      email: "admin@test.com",
    }),
    createUser: jest.fn().mockResolvedValue({
      uid: "new-student-uid",
    }),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  }),
  initializeApp: jest.fn(),
}));

import request from "supertest";
import { app } from "../../app";
import { testPrisma } from "../testClient";
import type { User } from "@prisma/client";

const TEST_ADMIN_ID = "adminAdminAdminAdminAdmin123";

describe("GET /admins/students", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    // Clean database completely before each test
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.course.deleteMany();

    // Use upsert to avoid unique constraint errors
    await testPrisma.user.upsert({
      where: { id: TEST_ADMIN_ID },
      update: {},
      create: {
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
  });

  afterAll(async () => {
    // Final cleanup
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.course.deleteMany();
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

    const response = await request(app).get("/admins/students").set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users.every((u: User) => u.role === "STUDENT")).toBe(true);
    expect(response.body.users[0]).toHaveProperty("firstName");
    expect(response.body.users[0]).toHaveProperty("grades");
  });

  it("should return 404 when no students exist", async () => {
    // Only the admin exists (created in beforeEach), no students
    const response = await request(app).get("/admins/students").set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No students found");
    expect(response.body.users).toHaveLength(0);
  });

  it("should return 401 without token", async () => {
    const response = await request(app).get("/admins/students");
    expect(response.status).toBe(401);
  });
});

describe("POST /admins/register", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.course.deleteMany();

    await testPrisma.user.upsert({
      where: { id: TEST_ADMIN_ID },
      update: {},
      create: {
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
  });

  afterAll(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.course.deleteMany();
    await testPrisma.$disconnect();
  });

  it("should register a student with valid data", async () => {
    const studentData = {
      firstName: "New",
      lastName: "Student",
      email: "newstudent@test.com",
      personNumber: "19970101-1234",
      phone: "+46701234567",
      address: "New Street 123",
      password: "password123",
    };

    const response = await request(app)
      .post("/admins/register")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(studentData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Student created successfully");
    expect(response.body.user.email).toBe(studentData.email);
  });

  // VALIDATION TESTS
  it("should return 400 with invalid email", async () => {
    const invalidData = {
      firstName: "Test",
      lastName: "Student",
      email: "invalid-email", // ❌ Invalid email
      personNumber: "19970101-1234",
      phone: "+46701234567",
      address: "Test Street 123",
      password: "password123",
    };

    const response = await request(app)
      .post("/admins/register")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Validation failed");
  });

  it("should return 400 with missing required fields", async () => {
    const invalidData = {
      firstName: "Test",
      // lastName missing
      email: "test@test.com",
      personNumber: "19970101-1234",
      phone: "+46701234567",
      address: "Test Street 123",
      password: "password123",
    };

    const response = await request(app)
      .post("/admins/register")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 with password too short", async () => {
    const invalidData = {
      firstName: "Test",
      lastName: "Student",
      email: "test@test.com",
      personNumber: "19970101-1234",
      phone: "+46701234567",
      address: "Test Street 123",
      password: "123", // ❌ Too short
    };

    const response = await request(app)
      .post("/admins/register")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 409 when student already exists", async () => {
    const studentData = {
      firstName: "Existing",
      lastName: "Student",
      email: "existing@test.com",
      personNumber: "19970101-1234",
      phone: "+46701234567",
      address: "Test Street 123",
      password: "password123",
    };

    // Create student first
    await testPrisma.user.create({
      data: {
        id: "existing-student",
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        personNumber: studentData.personNumber,
        phone: studentData.phone,
        address: studentData.address,
        role: "STUDENT",
      },
    });

    // Try to create again
    const response = await request(app)
      .post("/admins/register")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(studentData);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Student already exists");
  });
});

describe("DELETE /admins/students/:id", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.course.deleteMany();

    await testPrisma.user.upsert({
      where: { id: TEST_ADMIN_ID },
      update: {},
      create: {
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
  });

  afterAll(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.course.deleteMany();
    await testPrisma.$disconnect();
  });

  it("should delete a student successfully", async () => {
    // Create a student to delete
    const studentId = "mIXXxZONilPmVuoTKPrwi4RPL722";
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "delete-me@test.com",
        firstName: "Delete",
        lastName: "Me",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Test Street 123",
        role: "STUDENT",
      },
    });

    const response = await request(app)
      .delete(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Deleted student successfully");

    // Verify student is deleted
    const deletedStudent = await testPrisma.user.findUnique({
      where: { id: studentId },
    });
    expect(deletedStudent).toBeNull();
  });

  // VALIDATION TESTS
  it("should return 400 with invalid ID format", async () => {
    const response = await request(app)
      .delete("/admins/students/invalid-id") // ❌ Not 28 chars
      .set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 404 when student does not exist", async () => {
    const nonExistentId = "aBcDeFgHiJkLmNoPqRsTuVwXyZ12";

    const response = await request(app)
      .delete(`/admins/students/${nonExistentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No student found with the provided ID");
  });

  it("should return 404 when trying to delete an admin", async () => {
    const response = await request(app)
      .delete(`/admins/students/${TEST_ADMIN_ID}`) // Try to delete the admin
      .set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No student found with the provided ID");
  });

  it("should return 401 without token", async () => {
    const response = await request(app).delete("/admins/students/mIXXxZONilPmVuoTKPrwi4RPL722");

    expect(response.status).toBe(401);
  });
});
