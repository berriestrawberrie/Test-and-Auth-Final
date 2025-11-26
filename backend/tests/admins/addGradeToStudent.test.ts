import "../mocks/firebaseMock";
import { testPrisma } from "../testClient";
import request from "supertest";
import { app } from "../../app";
import { generateFirebaseUid } from "../helpers";

describe("POST /admins/students/:id/grades", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany({
      where: { role: "STUDENT" },
    });
    await testPrisma.course.deleteMany();
  });

  it("should return 400 with invalid ID format", async () => {
    const response = await request(app)
      .post("/admins/students/invalid-id/grades")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid userID format");
  });

  it("should return 400 with invalid grade data", async () => {
    const response = await request(app)
      .post(`/admins/students/${generateFirebaseUid()}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ studentId: "invalid-id", courseId: "also-invalid", gradeValue: 5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid grade data");
  });

  it("should return 404 and no student found", async () => {
    const response = await request(app)
      .post(`/admins/students/${generateFirebaseUid()}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: 1, grade: "A", year: 2 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No student found with the provided ID");
  });

  it("should return 404 and course not found", async () => {
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
    await testPrisma.course.create({
      data: {
        id: 1,
        desc: "Test Course",
        title: "Test Course",
      },
    });

    const response = await request(app)
      .post(`/admins/students/${studentId}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: 20, grade: "A", year: 2 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Course not found");
  });

  it("should return 201 and grade added successfully", async () => {
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
    await testPrisma.course.create({
      data: {
        id: 1,
        desc: "Test Course",
        title: "Test Course",
      },
    });

    const response = await request(app)
      .post(`/admins/students/${studentId}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: 1, grade: "A", year: 2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Grade added successfully");
  });
});
