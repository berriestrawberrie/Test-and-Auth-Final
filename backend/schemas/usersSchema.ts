import { z } from "zod";

export const userCreationSchema = z.object({
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  email: z.string().email().min(4).max(50),
  personNumber: z.string().regex(/^\d{8}-\d{4}$/),
  phone: z.string().min(10).max(15),
  address: z.string().min(10).max(50),
  password: z.string().min(6).max(20),
});

export const userIdSchema = z
  .string()
  .length(28)
  .regex(/^[a-zA-Z0-9]+$/, "Invalid ID format");
