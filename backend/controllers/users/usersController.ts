import type { Request, Response } from "express";
import admin from "firebase-admin";
import { firebaseTokenSchema } from "../../schemas/firebaseTokenSchema";
import { prisma } from "../../prisma/client";
import z from "zod";
import { userCreationSchema } from "../../schemas/usersSchema";

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
    const { uid } = req.user!;

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

// @desc: Creates a user in the db.
// @method: POST
// @route /users/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const validatedUser = userCreationSchema.safeParse(req.body);
    if (!validatedUser.success) throw validatedUser.error;

    const { firstName, lastName, personNumber, phone, address, email } = validatedUser.data;
    const { uid } = req.user!;

    const existingUser = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        id: uid,
        email,
        firstName,
        lastName,
        personNumber,
        phone,
        address,
        role: "STUDENT",
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
