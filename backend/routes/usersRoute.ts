import { Router } from "express";
import { getUsers } from "../controllers/users/usersController";

export const usersRoute = Router();

usersRoute.get("/", getUsers);
