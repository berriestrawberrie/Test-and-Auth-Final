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
            .min(4, { message: "email needs to be at least 4 letters." })
            .max(50, { message: "email can be at most 50 letters." }),
    })
    .strict();
