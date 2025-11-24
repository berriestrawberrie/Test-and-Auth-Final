import type { CourseInterface } from "./courseInterfaces";

export interface GradeInterface {
  id: number;
  year: number;
  date: string;
  grade: string;
  course: CourseInterface;
}
