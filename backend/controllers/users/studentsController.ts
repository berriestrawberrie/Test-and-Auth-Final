import type { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// @desc: fetch the logged in user data
// @method: GET
// @route /student
export const getStudent = async (req: Request, res: Response) => {
  try {
    //EXTRACT HEADER FROM REQUEST
    const authHeader = req.headers.authorization;
    //IF HEADER MISSING OR INVALID RETURN
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid Authorization header" });
    }
    //PARSE UID FROM HEADER
    const uid = authHeader.split(" ")[1];

    const student = await prisma.user.findUnique({
      where: { id: uid },
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
      return res
        .status(404)
        .json({ message: "Error Fetching student data: Student not found" });
    }

    return res.status(200).json(student);
  } catch (error: unknown) {
    console.error(error);
  }
};
