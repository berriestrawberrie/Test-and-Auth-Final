import "../../mocks/firebaseMock";
import request from "supertest";
import { app } from "../../../app";
import {
  clearTestData,
  createManyStudents,
  createStudent,
  mockAdminToken,
  noneExistentStudentId,
  TEST_ADMIN_ID,
} from "../../helpers";

describe("PUT /admins/students/:id", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ SUCCESS TESTS
  it("should update student with valid data", async () => {
    const testStudent = await createStudent();

    const updateData = {
      firstName: "Updated",
      lastName: "Student",
      address: "New Street 456",
      phone: "+46709999999",
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Updated student successfully");
    expect(response.body.user.firstName).toBe("Updated");
    expect(response.body.user.lastName).toBe("Student");
    expect(response.body.user.address).toBe("New Street 456");
    expect(response.body.user.email).toBe(testStudent.email); // Unchanged
  });

  it("should update only provided fields", async () => {
    const testStudent = await createStudent();

    const updateData = {
      firstName: "OnlyFirst", // Only update first name
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.firstName).toBe("OnlyFirst");
    expect(response.body.user.lastName).toBe(testStudent.lastName); // Unchanged
    expect(response.body.user.address).toBe(testStudent.address); // Unchanged
  });

  it("should return 200 when no changes detected", async () => {
    const testStudent = await createStudent();

    const updateData = {
      firstName: testStudent.firstName,
      lastName: testStudent.lastName,
      address: testStudent.address,
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("No changes detected");
  });

  it("should trim whitespace from input fields", async () => {
    const testStudent = await createStudent();

    const updateData = {
      firstName: "  Trimmed  ",
      lastName: "  Student  ",
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.firstName).toBe("Trimmed");
    expect(response.body.user.lastName).toBe("Student");
  });

  //@ EMAIL TESTS
  it("should update email successfully", async () => {
    const testStudent = await createStudent();

    const updateData = {
      email: "new@test.com",
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("new@test.com");
  });

  it("should convert email to lowercase", async () => {
    const testStudent = await createStudent();

    const updateData = {
      email: "UPPERCASE@TEST.COM",
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("uppercase@test.com");
  });

  it("should return 409 when email already exists", async () => {
    const testStudents = await createManyStudents(2);

    const updateData = {
      email: testStudents[1].email,
    };

    const response = await request(app)
      .put(`/admins/students/${testStudents[0].id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Email is already in use by another user");
  });

  //@ VALIDATION TESTS
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
    const testStudent = await createStudent();
    const updateData = {
      email: "not-an-email", // Invalid email
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  it("should return 400 with invalid person number format", async () => {
    const testStudent = await createStudent();

    const updateData = {
      personNumber: "invalid-format",
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  it("should return 400 with field too short", async () => {
    const testStudent = await createStudent();

    const updateData = {
      firstName: "A", // Too short (min 2 chars)
    };

    const response = await request(app)
      .put(`/admins/students/${testStudent.id}`)
      .set("Authorization", `Bearer ${mockAdminToken}`)
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  //@ NOT FOUND TESTS
  it("should return 404 when student does not exist", async () => {
    const updateData = {
      firstName: "Test",
    };

    const response = await request(app)
      .put(`/admins/students/${noneExistentStudentId}`)
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

  //@ AUTHENTICATION TESTS
  it("should return 401 without token", async () => {
    const updateData = {
      firstName: "Test",
    };

    const response = await request(app).put(`/admins/students/${noneExistentStudentId}`).send(updateData);

    expect(response.status).toBe(401);
  });

  it("should return 403 with student token", async () => {
    const student = await createStudent();

    const response = await request(app)
      .put(`/admins/students/${student.id}`)
      .set("Authorization", `Bearer student-${student.id}`)
      .send({ firstName: "Beanbag" });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Forbidden: Admin access required");
  });
});
