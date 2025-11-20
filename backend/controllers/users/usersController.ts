import type { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import z from "zod";

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
