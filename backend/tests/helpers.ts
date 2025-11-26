import { testPrisma } from "./testClient";
import type { User, Course } from "@prisma/client";

export const generateFirebaseUid = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uid = "";
  for (let i = 0; i < 28; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uid;
};

type CreateStudentInput = Partial<
  Pick<User, "id" | "email" | "firstName" | "lastName" | "personNumber" | "phone" | "address" | "role">
>;

export const createStudent = async (overrides: CreateStudentInput = {}) => {
  const id = overrides.id ?? generateFirebaseUid();
  const student = await testPrisma.user.create({
    data: {
      id,
      email: overrides.email ?? `${Date.now()}-${id}@test.com`,
      firstName: overrides.firstName ?? "Test",
      lastName: overrides.lastName ?? "Student",
      personNumber: overrides.personNumber ?? "19970101-1234",
      phone: overrides.phone ?? "+46701234567",
      address: overrides.address ?? "Test Street 1",
      role: overrides.role ?? "STUDENT",
    },
  });
  return student;
};
export const createTestAdmin = async (id = "adminAdminAdminAdminAdmin123") => {
  const admin = await testPrisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      email: "admin@test.com",
      firstName: "Test",
      lastName: "Admin",
      personNumber: "19900101-1234",
      phone: "+46701234567",
      address: "Admin Street 1",
      role: "ADMIN",
    },
  });
  return admin;
};
type CreateCourseInput = Partial<Pick<Course, "id" | "title" | "desc">>;
export const createCourse = async (overrides: CreateCourseInput = {}) => {
  const course = await testPrisma.course.create({
    data: {
      id: overrides.id ?? undefined,
      title: overrides.title ?? `Course ${Date.now()}`,
      desc: overrides.desc ?? "Test course",
    },
  });
  return course;
};

type CreateGradeInput = {
  studentId: string;
  courseId: number;
  grade: "A" | "B" | "C" | "D" | "F";
  year: 1 | 2 | 3;
};

export const createGrade = async (data: CreateGradeInput) => {
  const grade = await testPrisma.grade.create({
    data: {
      studentId: data.studentId,
      courseId: data.courseId,
      grade: data.grade,
      year: data.year,
    },
  });
  return grade;
};

export const clearTestData = async () => {
  await testPrisma.grade.deleteMany();
  await testPrisma.user.deleteMany({ where: { role: "STUDENT" } });
  await testPrisma.course.deleteMany();
};

/*
Usage examples:
  await clearTestData();
  const student = await createStudent();
  const course = await createCourse({ id: 1 });
  await createGrade({ studentId: student.id, courseId: course.id, grade: "A", year: 2 });
*/
