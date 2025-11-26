import type { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { UserRole } from "@prisma/client";
import { prisma } from "../prisma/client";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });

    console.error("Error occured at verifyToken:", error);
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.uid },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === UserRole.ADMIN) {
      next();
    } else {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
  } catch (error) {
    console.error("Error occurred at verifyAdmin:", error);
    return res.status(403).json({ error: "Forbidden" });
  }
};
