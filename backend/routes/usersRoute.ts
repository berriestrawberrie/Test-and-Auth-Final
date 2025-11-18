import { Router } from "express";
import { getUsers, loginUser, registerUser } from "../controllers/users/usersController";

export const usersRoute = Router();

usersRoute.get("/", getUsers);
usersRoute.post("/login", loginUser);
usersRoute.post("/register", registerUser);
