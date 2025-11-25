import type { CourseInterface } from "./courseInterfaces";

export interface GradeInterface {
  id: number;
  year: 1 | 2 | 3;
  grade: "A" | "B" | "C" | "D" | "F";
  course: CourseInterface;
  createdAt: string;
  updatedAt: string;
}
