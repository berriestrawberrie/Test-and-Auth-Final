import { Router } from "express";
import { getStudent } from "../controllers/users/studentsController";

export const studentsRoute = Router();

studentsRoute.get("/", getStudent);
