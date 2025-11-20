import { Router } from "express";
import { loginUser } from "../controllers/users/usersController";

export const usersRoute = Router();

usersRoute.post("/login", loginUser);
