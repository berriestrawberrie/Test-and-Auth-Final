import { z } from "zod";

export const firebaseTokenSchema = z.object({
  uid: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
  email_verified: z.boolean().optional(),
});

export type FirebaseTokenData = z.infer<typeof firebaseTokenSchema>;
