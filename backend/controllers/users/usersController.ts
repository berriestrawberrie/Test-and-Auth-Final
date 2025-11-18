import type { Request, Response } from "express";
import admin from "firebase-admin";
import { firebaseTokenSchema } from "../../schemas/firebaseTokenSchema";
import { prisma } from "../../prisma/client";
import z from "zod";

// @desc: fetch all available users.
// @method: GET
// @route /users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        address: true,
        personNumber: true,
        phone: true,
        role: true,
        createdAt: true,
        grades: {
          select: {
            id: true,
            year: true,
            date: true,
            course: {
              select: {
                id: true,
                title: true,
                desc: true,
              },
            },
          },
        },
      },
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found", users });
    }

    return res.status(200).json({ message: "Fetched all users succesfully", users });
  } catch (error) {
    console.error(error);
  }
};

// @desc: Login existing user.
// @method: POST
// @route /users/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    const validatedData = firebaseTokenSchema.safeParse(decodedToken);
    if (!validatedData.success) throw validatedData.error;
    const { uid } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { id: uid },
    });
    if (!user) throw Error("No user found");

    res.status(200).json({ message: "User logged in succesfully", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid token data", details: error.issues });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create/update user" });
  }
};
