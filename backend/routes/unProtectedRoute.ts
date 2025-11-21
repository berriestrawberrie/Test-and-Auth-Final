import { Router } from "express";
import { getStudents } from "../controllers/admins/adminsController";

export const unProtectedRoute = Router();

unProtectedRoute.get("/students", getStudents);
