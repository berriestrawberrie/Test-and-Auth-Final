import "../mocks/firebaseMock";
import request from "supertest";
import { app } from "../../app";
import { clearTestData, createCourse, createStudent, mockAdminToken, noneExistentStudentId } from "../helpers";

describe("POST /admins/students/:id/gradesupsert", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ VALIDATION TESTS
  it("should return 400 with invalid ID format", async () => {
    const response = await request(app)
      .post("/admins/students/invalid-id/gradesupsert")
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid userID format");
  });

  it("should return 400 with invalid grade data", async () => {
    const response = await request(app)
      .post(`/admins/students/${noneExistentStudentId}/gradesupsert`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ studentId: "invalid-id", courseId: "also-invalid", gradeValue: 5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid grade data");
  });

  //@ 404 NOT FOUND TESTS
  it("should return 404 and no student found", async () => {
    const response = await request(app)
      .post(`/admins/students/${noneExistentStudentId}/gradesupsert`)
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
      .post(`/admins/students/${testStudent.id}/gradesupsert`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: invalidCourseId, grade: "A", year: 2 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Course not found");
  });

  //@ AUTHENTICATION TESTS
  it("should return 401 with unauthorized if you have no token", async () => {
    const testStudent = await createStudent();
    const testCourse = await createCourse();

    const response = await request(app)
      .post(`/admins/students/${testStudent.id}/gradesupsert`)
      .send({ courseId: testCourse.id, grade: "A", year: 2 });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });

  it("should return 403 when trying to add grade with student token", async () => {
    const testStudent = await createStudent();
    const testCourse = await createCourse();

    const response = await request(app)
      .post(`/admins/students/${testStudent.id}/gradesupsert`)
      .set("Authorization", `Bearer student-${testStudent.id}`)
      .send({ courseId: testCourse.id, grade: "A", year: 2 });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Forbidden: Admin access required");
  });

  //@ SUCCESS TEST
  it("should return 201 and grade added successfully", async () => {
    const testStudent = await createStudent();
    const testCourse = await createCourse();

    const response = await request(app)
      .post(`/admins/students/${testStudent.id}/gradesupsert`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: testCourse.id, grade: "A", year: 2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Grade added successfully");
    expect(response.body.grade.grade).toBe("A");

    const updateResponse = await request(app)
      .post(`/admins/students/${testStudent.id}/gradesupsert`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send({ courseId: testCourse.id, grade: "B", year: 2 });

    expect(updateResponse.status).toBe(201);
    expect(updateResponse.body.message).toBe("Grade added successfully");
    expect(updateResponse.body.grade.grade).toBe("B");
  });
});
