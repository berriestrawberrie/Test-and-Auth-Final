import { Router } from "express";
import {
  addGradeToStudent,
  deleteStudent,
  editStudent,
  getStudents,
  registerStudent,
  upsertGradeToStudent,
} from "../controllers/admins/adminsController";

export const adminsRoute = Router();

adminsRoute.post("/register", registerStudent);
adminsRoute.get("/students", getStudents);

adminsRoute.put("/students/:id", editStudent);
adminsRoute.delete("/students/:id", deleteStudent);
adminsRoute.post("/students/:id/grades", addGradeToStudent);
adminsRoute.post("/students/:id/gradesupsert", upsertGradeToStudent);
