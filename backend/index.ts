import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { usersRoute } from "./routes/usersRoute";
import { studentsRoute } from "./routes/studentsRoute";
import { verifyToken } from "./middleware/auth";
import { unProtectedRoute } from "./routes/unProtectedRoute";

dotenv.config();
admin.initializeApp(); // Need to supply filepath to your json file containing your firebase info (GOOGLE_APPLICATION_CREDENTIALS in .env) to work.

const app = express();
const PORT = 3000;
const corsOptions = {
  origin: ["http://localhost:1337"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/users", verifyToken, usersRoute);
app.use("/unprotected", unProtectedRoute);

app.use("/students", studentsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
