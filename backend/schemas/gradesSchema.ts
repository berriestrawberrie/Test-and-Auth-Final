import { z } from "zod";

export const gradeCreationSchema = z
  .object({
    courseId: z.number().int().positive("Course ID must be a positive integer"),
    grade: z.enum(["A", "B", "C", "D", "F"], "Grade must be A, B, C, D, or F"),
    year: z.union([z.literal(1), z.literal(2), z.literal(3)], "Year must be 1, 2, or 3"),
  })
  .strict();
