import type { CourseInterface } from "./courseInterfaces";

export interface GradeInterface {
  id: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  grade: string;
  course: CourseInterface;
}
