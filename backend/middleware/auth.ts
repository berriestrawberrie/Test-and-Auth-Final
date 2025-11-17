import type { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { prisma } from "../prisma/client";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });

    console.error("Error occured at verifyToken:", error);
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
      select: { type: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.type === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
  } catch (error) {
    console.error("Error occurred at verifyAdmin:", error);
    return res.status(403).json({ message: "Forbidden" });
  }
};
