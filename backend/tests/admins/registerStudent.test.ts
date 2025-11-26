import "../mocks/firebaseMock";
import { testPrisma } from "../testClient";
import request from "supertest";
import { app } from "../../app";

describe("POST /admins/register", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany({
      where: { role: "STUDENT" },
    });
    await testPrisma.course.deleteMany();
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
