import { Router } from "express";
import { deleteStudent, getStudents, registerStudent } from "../controllers/admins/adminsController";

export const adminsRoute = Router();
adminsRoute.post("/register", registerStudent);
adminsRoute.get("/students", getStudents);
adminsRoute.delete("/students/:id", deleteStudent);
