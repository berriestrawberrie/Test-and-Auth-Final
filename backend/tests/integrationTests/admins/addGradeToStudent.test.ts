import "../../mocks/firebaseMock";
import request from "supertest";
import { app } from "../../../app";
import { clearTestData, createCourse, createStudent, mockAdminToken, noneExistentStudentId } from "../../helpers";

describe("POST /admins/students/:id/grades", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ SUCCESS TEST
  it("should return 201 and grade added successfully", async () => {
    const testStudent = await createStudent();
    const testCourse = await createCourse();

    const response = await request(app)
      .post(`/admins/students/${testStudent.id}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: testCourse.id, grade: "A", year: 2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Grade added successfully");
  });

  //@ VALIDATION TESTS
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
      .post(`/admins/students/${noneExistentStudentId}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ studentId: "invalid-id", courseId: "also-invalid", gradeValue: 5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid grade data");
  });

  //@ 404 NOT FOUND TESTS
  it("should return 404 and no student found", async () => {
    const response = await request(app)
      .post(`/admins/students/${noneExistentStudentId}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: 1, grade: "A", year: 2 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No student found with the provided ID");
  });

  it("should return 404 and course not found", async () => {
    const testStudent = await createStudent();
    await createCourse({ id: 1 });

    const invalidCourseId = 20;

    const response = await request(app)
      .post(`/admins/students/${testStudent.id}/grades`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: invalidCourseId, grade: "A", year: 2 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Course not found");
  });

  //@ AUTHENTICATION TESTS
  it("should return 401 with unauthorized", async () => {
    const testStudent = await createStudent();
    const testCourse = await createCourse();

    const response = await request(app)
      .post(`/admins/students/${testStudent.id}/grades`)
      .send({ courseId: testCourse.id, grade: "A", year: 2 });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });

  it("should return 403 with student token", async () => {
    const student = await createStudent();

    const response = await request(app)
      .post(`/admins/students/${student.id}/grades`)
      .set("Authorization", `Bearer student-${student.id}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Forbidden: Admin access required");
  });
});
