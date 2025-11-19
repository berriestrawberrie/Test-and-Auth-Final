import { Router } from "express";
import { getUsers } from "../controllers/users/usersController";

export const unProtectedRoute = Router();

unProtectedRoute.get("/users", getUsers);
