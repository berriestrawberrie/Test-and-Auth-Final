import "../../mocks/firebaseMock";
import request from "supertest";
import { app } from "../../../app";
import { clearTestData, createStudent, mockAdminToken, noneExistentStudentId } from "../../helpers";

describe("POST /users/login", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ SUCCESS TESTS
  it("Should return logged in user info with student token.", async () => {
    const student = await createStudent();
    const response = await request(app).post(`/users/login`).set("Authorization", `Bearer student-${student.id}`);

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("STUDENT");
    expect(response.body.user).toHaveProperty("firstName");
    expect(response.body.user.firstName).toBe(student.firstName);
    expect(response.body.user.grades).toBeUndefined();
  });

  it("Should return logged in user info with admin token.", async () => {
    const response = await request(app).post(`/users/login`).set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("ADMIN");
    expect(response.body.user).toHaveProperty("firstName");
    expect(response.body.user.firstName).toBe("Test");
    expect(response.body.user.grades).toBeUndefined();
  });

  //@ 404 NOT FOUND TESTS
  it("should return 404 when no students exist", async () => {
    const response = await request(app)
      .post(`/users/login`)
      .set("Authorization", `Bearer student-${noneExistentStudentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  //@ AUTHENTICATION TESTS
  it("should return 401 without token", async () => {
    const response = await request(app).post(`/users/login`);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });
});
