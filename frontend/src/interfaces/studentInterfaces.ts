export interface Course {
  id: number;
  title: string;
  desc: string;
}

export interface Grade {
  id: number;
  year: number;
  date: string;
  grade: string;
  course: Course;
}

export type UserRole = "STUDENT" | "ADMIN";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  personNumber: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  grades: Grade[];
}
