import "../../mocks/firebaseMock";
import request from "supertest";
import { app } from "../../../app";
import { clearTestData, createManyStudents, mockAdminToken, noneExistentStudentId } from "../../helpers";

describe("GET /students/:id", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ SUCCESS TESTS
  it("should return only 1 student", async () => {
    const students = await createManyStudents(2);

    const response = await request(app)
      .get(`/students/${students[0].id}`)
      .set("Authorization", `Bearer student-${students[0].id}`);

    expect(response.status).toBe(200);
    expect(response.body.role).toBe("STUDENT");
    expect(response.body).toHaveProperty("firstName");
    expect(response.body.firstName).toBe(students[0].firstName);
    expect(response.body).toHaveProperty("grades");
  });

  //@ 404 NOT FOUND TESTS
  it("should return 404 when no students exist", async () => {
    const response = await request(app)
      .get(`/students/${noneExistentStudentId}`)
      .set("Authorization", `Bearer student-${noneExistentStudentId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Error Fetching student data: Student not found");
  });

  //@ AUTHENTICATION TESTS
  it("should return 401 without token", async () => {
    const response = await request(app).get(`/students/${noneExistentStudentId}`);
    expect(response.status).toBe(401);
  });

  it("should return 403 with admin token", async () => {
    const response = await request(app)
      .get(`/students/${noneExistentStudentId}`)
      .set("Authorization", `Bearer ${mockAdminToken}`);
    expect(response.status).toBe(403);
  });

  it("should return 403 when trying to access other student", async () => {
    const students = await createManyStudents(2);
    const response = await request(app)
      .get(`/students/${students[1].id}`)
      .set("Authorization", `Bearer student-${students[0].id}`);
    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Forbidden: You can only access your own data");
  });
});
