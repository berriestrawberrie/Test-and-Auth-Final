import { Router } from "express";
import { getUsers, loginUser } from "../controllers/users/usersController";

export const usersRoute = Router();

usersRoute.get("/", getUsers);
usersRoute.post("/login", loginUser);
