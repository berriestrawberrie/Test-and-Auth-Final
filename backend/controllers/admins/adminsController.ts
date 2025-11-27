import { Request, Response } from "express";
import {
  userCreationSchema,
  userIdSchema,
  UserUpdateInput,
  userUpdateSchema,
} from "../../schemas/usersSchema";
import { prisma } from "../../prisma/client";
import admin from "firebase-admin";
import { gradeCreationSchema } from "../../schemas/gradesSchema";

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
    if (users.length === 0) {
      return res.status(404).json({ error: "No students found", users: [] });
    }

    return res
      .status(200)
      .json({ message: "Fetched all students succesfully", users });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// @desc: Creates a student in the db.
// @method: POST
// @body: UserCreationWithPasswordInterface
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

    const {
      firstName,
      lastName,
      personNumber,
      phone,
      address,
      email,
      password,
    } = validatedUser.data;

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

    res.status(201).json({ message: "Student created successfully", user });
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

// @desc: delete a student by ID. Can't delete seeded students.
// @method: DELETE
// @params: id
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

    const protectedStudentIds = [
      "BMDeWpyRqHTvHulBD85QRGsbTed2", // Erik
      "rSYJICHffYeZ5fAGqzFpbbaVyjt2", // Anna
      "hGWeaVzLkjcnOlPpEOcEo1QFEq42", // Lars
      "Bl11qu3yEuZBKMtx6NK9VwsHn963", // Maria
      "RxH5xFzCGBVMRVfMRujKK43gRBr2", // Johan
    ];

    if (protectedStudentIds.includes(validatedId.data)) {
      return res
        .status(403)
        .json({ error: "Cannot delete a protected student" });
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedId.data },
    });

    if (!existingUser || existingUser.role !== "STUDENT") {
      return res
        .status(404)
        .json({ error: "No student found with the provided ID" });
    }

    await prisma.user.delete({
      where: { id: validatedId.data },
    });

    try {
      await admin.auth().deleteUser(validatedId.data);
    } catch (firebaseError) {
      console.error("Failed to delete Firebase user:", firebaseError);
    }

    return res
      .status(200)
      .json({ message: "Deleted student successfully", user: existingUser });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// @desc: edit a student by ID.
// @method: PUT
// @params: id
// @body: UserUpdateInput
// @route /admins/students/:id
export const editStudent = async (req: Request, res: Response) => {
  try {
    const validatedId = userIdSchema.safeParse(req.params.id);
    if (!validatedId.success) {
      return res.status(400).json({
        error: "Invalid ID format",
        details: validatedId.error,
      });
    }

    const validatedUserUpdate = userUpdateSchema.safeParse(req.body);
    if (!validatedUserUpdate.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validatedUserUpdate.error,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedId.data },
    });

    if (!existingUser || existingUser.role !== "STUDENT") {
      return res
        .status(404)
        .json({ error: "No student found with the provided ID" });
    }

    const { firstName, lastName, personNumber, address, email, phone } =
      validatedUserUpdate.data;

    const dataToUpdate: UserUpdateInput = {};

    if (firstName && firstName !== existingUser.firstName)
      dataToUpdate.firstName = firstName.trim();
    if (lastName && lastName !== existingUser.lastName)
      dataToUpdate.lastName = lastName.trim();
    if (personNumber && personNumber !== existingUser.personNumber) {
      const personNumberExists = await prisma.user.findUnique({
        where: { personNumber },
      });
      if (personNumberExists) {
        return res
          .status(409)
          .json({ error: "Person number is already in use by another user" });
      }
      dataToUpdate.personNumber = personNumber.trim();
    }
    if (address && address !== existingUser.address)
      dataToUpdate.address = address.trim();
    if (phone && phone !== existingUser.phone)
      dataToUpdate.phone = phone.trim();
    if (email && email !== existingUser.email) {
      const protectedStudentIds = [
        "BMDeWpyRqHTvHulBD85QRGsbTed2",
        "rSYJICHffYeZ5fAGqzFpbbaVyjt2",
        "hGWeaVzLkjcnOlPpEOcEo1QFEq42",
        "Bl11qu3yEuZBKMtx6NK9VwsHn963",
        "RxH5xFzCGBVMRVfMRujKK43gRBr2",
      ];
      if (protectedStudentIds.includes(validatedId.data)) {
        return res
          .status(403)
          .json({ error: "Cannot change email of a protected student" });
      }
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        return res
          .status(409)
          .json({ error: "Email is already in use by another user" });
      }
      dataToUpdate.email = email.trim().toLowerCase();
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(200).json({
        message: "No changes detected",
        user: existingUser,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: validatedId.data },
      data: dataToUpdate,
    });

    if (dataToUpdate.email) {
      try {
        await admin.auth().updateUser(validatedId.data, {
          email: dataToUpdate.email,
        });
      } catch (firebaseError) {
        console.error("Failed to update Firebase email:", firebaseError);
        try {
          await prisma.user.update({
            where: { id: validatedId.data },
            data: { email: existingUser.email },
          });

          return res.status(500).json({
            error:
              "Failed to update email in Firebase. Changes have been rolled back.",
            details: "Email remains unchanged",
          });
        } catch (rollbackError) {
          console.error("Failed to rollback email change:", rollbackError);

          return res.status(500).json({
            error:
              "Critical error: Email update partially failed. Manual intervention required.",
            details: "Database updated but Firebase sync failed",
          });
        }
      }
    }
    return res
      .status(200)
      .json({ message: "Updated student successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// @desc: add a grade to a student by ID.
// @method: POST
// @params: id
// @body: { courseId: number, grade: "A"|"B"|"C"|"D"|"F", year: 1|2|3 }
// @route /admins/students/:id/grades
export const addGradeToStudent = async (req: Request, res: Response) => {
  try {
    const validatedId = userIdSchema.safeParse(req.params.id);
    if (!validatedId.success) {
      return res.status(400).json({
        error: "Invalid userID format",
        details: validatedId.error,
      });
    }

    const validatedGrade = gradeCreationSchema.safeParse(req.body);
    if (!validatedGrade.success) {
      return res.status(400).json({
        error: "Invalid grade data",
        details: validatedGrade.error,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedId.data },
    });
    if (!existingUser || existingUser.role !== "STUDENT") {
      return res
        .status(404)
        .json({ error: "No student found with the provided ID" });
    }

    const { courseId, grade, year } = validatedGrade.data;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const createdGrade = await prisma.grade.create({
      data: {
        studentId: validatedId.data,
        courseId,
        grade,
        year,
      },
    });

    res
      .status(201)
      .json({ message: "Grade added successfully", grade: createdGrade });
  } catch (error) {
    console.error("Error creating grade:", error);
    res.status(500).json({ error: "Failed to create grade." });
  }
};

// @desc: update a grade to a student by ID.
// @method: PUT
// @params: id
// @body: { courseId: number, grade: "A"|"B"|"C"|"D"|"F", year: 1|2|3 }
// @route /admins/students/:id/grades
export const updateGradeToStudent = async (req: Request, res: Response) => {
  try {
    const validatedId = userIdSchema.safeParse(req.params.id);
    if (!validatedId.success) {
      return res.status(400).json({
        error: "Invalid userID format",
        details: validatedId.error,
      });
    }

    const validatedGrade = gradeCreationSchema.safeParse(req.body);
    if (!validatedGrade.success) {
      return res.status(400).json({
        error: "Invalid grade data",
        details: validatedGrade.error,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: validatedId.data },
    });
    if (!existingUser || existingUser.role !== "STUDENT") {
      return res
        .status(404)
        .json({ error: "No student found with the provided ID" });
    }

    const { courseId, grade, year } = validatedGrade.data;
    const studentId = validatedId.data;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updateGrade = await prisma.grade.upsert({
      where: {
        studentId_courseId_year: {
          studentId,
          courseId,
          year,
        },
      },
      update: {
        grade,
      },
      create: {
        studentId,
        courseId,
        year,
        grade,
      },
    });

    res
      .status(201)
      .json({ message: "Grade updated successfully", grade: updateGrade });
  } catch (error) {
    console.error("Error creating grade:", error);
    res.status(500).json({ error: "Failed to create grade." });
  }
};
