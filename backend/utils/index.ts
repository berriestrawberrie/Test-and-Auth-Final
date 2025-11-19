import { GradeValue } from "@prisma/client";

export const normalizeString = (string: string) => {
  return string.trim().toLowerCase();
};
export const getRandomGrade = (): GradeValue => {
  const grades = Object.values(GradeValue);
  return grades[Math.floor(Math.random() * grades.length)];
};
