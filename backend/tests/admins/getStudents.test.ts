import "../mocks/firebaseMock";
import { testPrisma } from "../testClient";
import request from "supertest";
import { app } from "../../app";
import { generateFirebaseUid } from "../helpers";
import { User } from "@prisma/client";

describe("GET /admins/students", () => {
  const mockAdminToken = "mock-admin-token";

  beforeEach(async () => {
    await testPrisma.grade.deleteMany();
    await testPrisma.user.deleteMany({ where: { role: "STUDENT" } });
    await testPrisma.course.deleteMany();
  });

  it("should return only students, not admins", async () => {
    await testPrisma.user.createMany({
      data: [
        {
          id: generateFirebaseUid(),
          email: `${generateFirebaseUid()}@test.com`,
          firstName: "John",
          lastName: "Doe",
          personNumber: "19950101-1234",
          phone: "+46701111111",
          address: "Student Street 1",
          role: "STUDENT",
        },
        {
          id: generateFirebaseUid(),
          email: `${generateFirebaseUid()}@test.com`,
          firstName: "Jane",
          lastName: "Smith",
          personNumber: "19960202-5678",
          phone: "+46702222222",
          address: "Student Street 2",
          role: "STUDENT",
        },
      ],
    });

    const response = await request(app).get("/admins/students").set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users.every((u: User) => u.role === "STUDENT")).toBe(true);
    expect(response.body.users[0]).toHaveProperty("firstName");
    expect(response.body.users[0]).toHaveProperty("grades");
  });

  it("should return 404 when no students exist", async () => {
    const response = await request(app).get("/admins/students").set("Authorization", `Bearer ${mockAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("No students found");
    expect(response.body.users).toHaveLength(0);
  });

  it("should return 401 without token", async () => {
    const response = await request(app).get("/admins/students");
    expect(response.status).toBe(401);
  });
});
