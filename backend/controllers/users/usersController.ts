import type { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// @desc: Login existing user.
// @method: POST
// @route /users/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.user!;

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User logged in succesfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in user" });
  }
};
