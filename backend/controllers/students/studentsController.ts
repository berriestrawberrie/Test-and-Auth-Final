import type { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { userIdSchema } from "../../schemas/usersSchema";

// @desc: fetch the logged in user data
// @method: GET
// @param id: user id
// @route /students/:id
export const getStudent = async (req: Request, res: Response) => {
  try {
    const validatedId = userIdSchema.safeParse(req.params.id);
    if (!validatedId.success) {
      return res.status(400).json({
        error: "Invalid ID format",
        details: validatedId.error,
      });
    }

    if (req.user?.uid !== validatedId.data) {
      return res.status(403).json({ error: "Forbidden: You can only access your own data" });
    }

    const student = await prisma.user.findUnique({
      where: { id: validatedId.data },
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
            createdAt: true,
            grade: true,
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
    //CHECK STUDENT EXISTS
    if (!student) {
      return res.status(404).json({ error: "Error Fetching student data: Student not found" });
    }

    return res.status(200).json(student);
  } catch (error: unknown) {
    console.error(error);
  }
};
