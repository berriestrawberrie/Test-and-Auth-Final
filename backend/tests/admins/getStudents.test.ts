import "../mocks/firebaseMock";
import request from "supertest";
import { app } from "../../app";
import { clearTestData, createManyStudents, mockAdminToken } from "../helpers";
import { User } from "@prisma/client";

describe("GET /admins/students", () => {
  beforeEach(async () => {
    await clearTestData();
  });

  //@ SUCCESS TESTS
  it("should return only students, not admins", async () => {
    await createManyStudents(2);

    const response = await request(app).get("/admins/students").set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users.every((u: User) => u.role === "STUDENT")).toBe(true);
    expect(response.body.users[0]).toHaveProperty("firstName");
    expect(response.body.users[0]).toHaveProperty("grades");
  });

  //@ 404 NOT FOUND TESTS
  it("should return 404 when no students exist", async () => {
    const response = await request(app).get("/admins/students").set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No students found");
    expect(response.body.users).toHaveLength(0);
  });

  //@ AUTHENTICATION TESTS
  it("should return 401 without token", async () => {
    const response = await request(app).get("/admins/students");
    expect(response.status).toBe(401);
  });
});
