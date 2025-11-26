import "../mocks/firebaseMock";
import { testPrisma } from "../testClient";
import request from "supertest";
import { app } from "../../app";
import { generateFirebaseUid } from "../helpers";
const TEST_ADMIN_ID = "adminAdminAdminAdminAdmin123";
describe("PUT /admins/students/:id", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany({
      where: { role: "STUDENT" },
    });
    await testPrisma.course.deleteMany();
  });

  // ✅ SUCCESS CASES
  it("should update student with valid data", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "original@test.com",
        firstName: "Original",
        lastName: "Name",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Old Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      firstName: "Updated",
      lastName: "Student",
      address: "New Street 456",
      phone: "+46709999999",
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Updated student successfully");
    expect(response.body.user.firstName).toBe("Updated");
    expect(response.body.user.lastName).toBe("Student");
    expect(response.body.user.address).toBe("New Street 456");
    expect(response.body.user.email).toBe("original@test.com"); // Unchanged
  });

  it("should update only provided fields", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "partial@test.com",
        firstName: "Original",
        lastName: "Name",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Old Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      firstName: "OnlyFirst", // Only update first name
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.firstName).toBe("OnlyFirst");
    expect(response.body.user.lastName).toBe("Name"); // Unchanged
    expect(response.body.user.address).toBe("Old Street 123"); // Unchanged
  });

  it("should return 200 when no changes detected", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "nochange@test.com",
        firstName: "Same",
        lastName: "Name",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Same Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      firstName: "Same",
      lastName: "Name",
      address: "Same Street 123",
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("No changes detected");
  });

  it("should trim whitespace from input fields", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "trim@test.com",
        firstName: "Original",
        lastName: "Name",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Old Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      firstName: "  Trimmed  ",
      lastName: "  Student  ",
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.firstName).toBe("Trimmed");
    expect(response.body.user.lastName).toBe("Student");
  });

  // ✅ EMAIL UPDATE CASES
  it("should update email successfully", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "old@test.com",
        firstName: "Email",
        lastName: "Test",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Test Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      email: "new@test.com",
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("new@test.com");
  });

  it("should convert email to lowercase", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "original@test.com",
        firstName: "Test",
        lastName: "User",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Test Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      email: "UPPERCASE@TEST.COM",
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("uppercase@test.com");
  });

  it("should return 409 when email already exists", async () => {
    const student1Id = generateFirebaseUid();
    const student2Id = generateFirebaseUid();

    await testPrisma.user.createMany({
      data: [
        {
          id: student1Id,
          email: "student1@test.com",
          firstName: "Student",
          lastName: "One",
          personNumber: "19970101-1234",
          phone: "+46701111111",
          address: "Street 1",
          role: "STUDENT",
        },
        {
          id: student2Id,
          email: "student2@test.com",
          firstName: "Student",
          lastName: "Two",
          personNumber: "19970202-5678",
          phone: "+46702222222",
          address: "Street 2",
          role: "STUDENT",
        },
      ],
    });

    const updateData = {
      email: "student2@test.com", // Try to use existing email
    };

    const response = await request(app)
      .put(`/admins/students/${student1Id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Email is already in use by another user");
  });

  // ✅ VALIDATION ERRORS
  it("should return 400 with invalid ID format", async () => {
    const updateData = {
      firstName: "Test",
    };

    const response = await request(app)
      .put("/admins/students/invalid-id")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid ID format");
  });

  it("should return 400 with invalid email format", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "valid@test.com",
        firstName: "Test",
        lastName: "User",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Test Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      email: "not-an-email", // Invalid email
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  it("should return 400 with invalid person number format", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Test Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      personNumber: "invalid-format",
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  it("should return 400 with field too short", async () => {
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        personNumber: "19970101-1234",
        phone: "+46701234567",
        address: "Test Street 123",
        role: "STUDENT",
      },
    });

    const updateData = {
      firstName: "A", // Too short (min 2 chars)
    };

    const response = await request(app)
      .put(`/admins/students/${studentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  // ✅ NOT FOUND CASES
  it("should return 404 when student does not exist", async () => {
    const nonExistentId = "aBcDeFgHiJkLmNoPqRsTuVwXyZ12";

    const updateData = {
      firstName: "Test",
    };

    const response = await request(app)
      .put(`/admins/students/${nonExistentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No student found with the provided ID");
  });

  it("should return 404 when trying to update an admin", async () => {
    const updateData = {
      firstName: "Updated",
    };

    const response = await request(app)
      .put(`/admins/students/${TEST_ADMIN_ID}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No student found with the provided ID");
  });

  // ✅ AUTH TESTS
  it("should return 401 without token", async () => {
    const studentId = generateFirebaseUid();

    const updateData = {
      firstName: "Test",
    };

    const response = await request(app).put(`/admins/students/${studentId}`).send(updateData);

    expect(response.status).toBe(401);
  });
});
