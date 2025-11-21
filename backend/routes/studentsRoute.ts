import { Router } from "express";
import { getStudent } from "../controllers/students/studentsController";

export const studentsRoute = Router();

studentsRoute.get("/", getStudent);
