import { Request, Response } from "express";
import { userCreationSchema } from "../../schemas/usersSchema";
import { prisma } from "../../prisma/client";
import admin from "firebase-admin";

// @desc: fetch all available students.
// @method: GET
// @route /admins/students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT" },
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
    if (users.length === 0) {
      return res.status(404).json({ message: "No students found", users });
    }

    return res.status(200).json({ message: "Fetched all students succesfully", users });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// @desc: Creates a student in the db.
// @method: POST
// @route /admins/register
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const validatedUser = userCreationSchema.safeParse(req.body);
    if (!validatedUser.success) throw validatedUser.error;

    const { firstName, lastName, personNumber, phone, address, email, password } = validatedUser.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Student already exists" });
    }

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
    });

    const user = await prisma.user.create({
      data: {
        id: firebaseUser.uid,
        email,
        firstName,
        lastName,
        personNumber,
        phone,
        address,
        role: "STUDENT",
      },
    });

    res.status(201).json({ message: "Student created successfully", user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};
