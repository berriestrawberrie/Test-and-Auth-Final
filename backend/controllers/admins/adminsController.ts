import { Request, Response } from "express";
import { userCreationSchema, userIdSchema } from "../../schemas/usersSchema";
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
      return res.status(404).json({ error: "No students found", users });
    }

    return res.status(200).json({ message: "Fetched all students succesfully", data: users });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// @desc: Creates a student in the db.
// @method: POST
// @route /admins/register
export const registerStudent = async (req: Request, res: Response) => {
  let firebaseUser: admin.auth.UserRecord | null = null;
  try {
    const validatedUser = userCreationSchema.safeParse(req.body);
    if (!validatedUser.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedUser.error,
      });
    }

    const { firstName, lastName, personNumber, phone, address, email, password } = validatedUser.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Student already exists" });
    }

    firebaseUser = await admin.auth().createUser({
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

    res.status(201).json({ message: "Student created successfully", data: user });
  } catch (error) {
    if (firebaseUser && firebaseUser.uid) {
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
        console.log("Rolled back Firebase user creation");
      } catch (rollbackError) {
        console.error("Failed to rollback Firebase user:", rollbackError);
      }
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

// @desc: delete a student by ID.
// @method: DELETE
// @route /admins/students/:id
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const validatedId = userIdSchema.safeParse(req.params.id);
    if (!validatedId.success) {
      return res.status(400).json({
        error: "Invalid ID format",
        details: validatedId.error,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedId.data },
    });

    if (!existingUser || existingUser.role !== "STUDENT") {
      return res.status(404).json({ error: "No student found with the provided ID" });
    }

    await prisma.user.delete({
      where: { id: validatedId.data },
    });

    try {
      await admin.auth().deleteUser(validatedId.data);
    } catch (firebaseError) {
      console.error("Failed to delete Firebase user:", firebaseError);
    }

    return res.status(200).json({ message: "Deleted student successfully", data: existingUser });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};
