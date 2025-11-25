import { Router } from "express";
import { deleteStudent, editStudent, getStudents, registerStudent } from "../controllers/admins/adminsController";

export const adminsRoute = Router();
adminsRoute.post("/register", registerStudent);
adminsRoute.get("/students", getStudents);

adminsRoute.put("/students/:id", editStudent);
adminsRoute.delete("/students/:id", deleteStudent);
