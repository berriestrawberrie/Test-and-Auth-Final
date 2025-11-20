import { Router } from "express";
import { getStudents, registerStudent } from "../controllers/admins/adminsController";

export const adminsRoute = Router();
adminsRoute.post("/register", registerStudent);
adminsRoute.get("/students", getStudents);
