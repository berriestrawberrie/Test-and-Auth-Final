import "../../mocks/firebaseMock";
import { testPrisma } from "../../testClient";
import request from "supertest";
import { app } from "../../../app";
import { clearTestData, createStudent, mockAdminToken, noneExistentStudentId, TEST_ADMIN_ID } from "../../helpers";

describe("DELETE /admins/students/:id", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ SUCCESS TEST
  it("should delete a student successfully", async () => {
    const testStudent = await createStudent();

    const response = await request(app)
      .delete(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Deleted student successfully");

    // Verify student is deleted
    const deletedStudent = await testPrisma.user.findUnique({
      where: { id: testStudent.id },
    });
    expect(deletedStudent).toBeNull();
  });

  //@ VALIDATION TESTS
  it("should return 400 with invalid ID format", async () => {
    const response = await request(app)
      .delete("/admins/students/invalid-id") // ❌ Not 28 chars
      .set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  //@ 404 NOT FOUND TESTS
  it("should return 404 when student does not exist", async () => {
    const response = await request(app)
      .delete(`/admins/students/${noneExistentStudentId}`)
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

  //@ AUTHENTICATION TESTS
  it("should return 401 without token", async () => {
    const response = await request(app).delete("/admins/students/mIXXxZONilPmVuoTKPrwi4RPL722");

    expect(response.status).toBe(401);
  });

  it("should return 403 with student token", async () => {
    const student = await createStudent();

    const response = await request(app)
      .delete(`/admins/students/${student.id}`)
      .set("Authorization", `Bearer student-${student.id}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Forbidden: Admin access required");
  });
});
