import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { usersRoute } from "./routes/usersRoute";
import { verifyAdmin, verifyToken } from "./middleware/auth";
import { unProtectedRoute } from "./routes/unProtectedRoute";
import { adminsRoute } from "./routes/adminsRoute";
import { studentsRoute } from "./routes/studentsRoute";

admin.initializeApp(); // Need to supply filepath to your json file containing your firebase info (GOOGLE_APPLICATION_CREDENTIALS in .env) to work.

export const app = express();
const corsOptions = {
  origin: ["http://localhost:1337"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", verifyToken, usersRoute);
app.use("/admins", verifyToken, verifyAdmin, adminsRoute);
app.use("/students", verifyToken, studentsRoute);

app.use("/unprotected", unProtectedRoute);
