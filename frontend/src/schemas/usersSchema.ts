import { z } from "zod";

export const userIdSchema = z
  .string()
  .length(28)
  .regex(/^[a-zA-Z0-9]+$/, "Invalid ID format");

export const baseUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(20, "First name must be at most 20 characters long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(20, "Last name must be at most 20 characters long"),
  email: z
    .string()
    .email()
    .min(4, "Email must be at least 4 characters long")
    .max(50, "Email must be at most 50 characters long"),
  personNumber: z.string().regex(/^\d{8}-\d{4}$/, "Person number must be in format YYYYMMDD-XXXX"), // TODO: REMOVE THIS? UNIQUE CONSTRAINT ISSUES
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .max(15, "Phone number must be at most 15 characters long"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters long")
    .max(50, "Address must be at most 50 characters long"),
});

export const userCreationSchema = baseUserSchema.extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export const userUpdateSchema = baseUserSchema.partial().refine((obj) => Object.keys(obj).length > 0, {
  message: "At least one field must be provided for update",
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
