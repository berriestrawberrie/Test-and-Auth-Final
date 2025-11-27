import type { auth } from "firebase-admin";

type DevDecodedToken = { uid: string; email?: string };
declare global {
  namespace Express {
    interface Request {
      user?: auth.DecodedIdToken | DevDecodedToken;
    }
  }
}

export {};
