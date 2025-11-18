import { z } from "zod";

export const userCreationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "firstName needs to be at least 2 letters." })
      .max(20, { message: "firstName can be at most 20 letters." }),
    lastName: z
      .string()
      .min(2, { message: "lastName needs to be at least 2 letters." })
      .max(20, { message: "lastName can be at most 20 letters." }),
    email: z
      .email()
      .min(4, { message: "email needs to be at least 5 letters." })
      .max(50, { message: "email can be at most 50 letters." }),
    personNumber: z.string().regex(/^\d{8}-\d{4}$/, {
      message: "person number must be in format YYYYMMDD-XXXX",
    }),
    phone: z
      .string()
      .min(10, { message: "phone needs to be at least 10 digits." })
      .max(15, { message: "phone can be at most 15 digits." }),
    address: z
      .string()
      .min(10, { message: "address needs to be at least 10 letters." })
      .max(50, { message: "address can be at most 50 letters." }),
  })
  .strict();
