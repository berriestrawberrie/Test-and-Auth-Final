import type { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// @desc: fetch the logged in user data
// @method: GET
// @route /students/:id
export const getStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.uid !== id) {
      return res.status(403).json({ message: "Forbidden: You can only access your own data" });
    }

    const student = await prisma.user.findUnique({
      where: { id },
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
      return res.status(404).json({ message: "Error Fetching student data: Student not found" });
    }

    return res.status(200).json(student);
  } catch (error: unknown) {
    console.error(error);
  }
};
