import "../mocks/firebaseMock";
import { testPrisma } from "../testClient";
import request from "supertest";
import { app } from "../../app";
import { generateFirebaseUid } from "../helpers";

const TEST_ADMIN_ID = "adminAdminAdminAdminAdmin123";

describe("DELETE /admins/students/:id", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany({
      where: { role: "STUDENT" },
    });
    await testPrisma.course.deleteMany();
  });

  it("should delete a student successfully", async () => {
    // Create a student to delete
    const studentId = generateFirebaseUid();
    await testPrisma.user.create({
      data: {
        id: studentId,
        email: `delete-me-${Date.now()}@test.com`,
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
