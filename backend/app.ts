import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
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

if (process.env.NODE_ENV === "development") {
  const bundlePath = path.join(process.cwd(), "docs", "bundled.yaml");
  const sourcePath = path.join(process.cwd(), "docs", "openapi.yaml");
  const swaggerDoc = fs.existsSync(bundlePath) ? YAML.load(bundlePath) : YAML.load(sourcePath);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

app.use("/users", verifyToken, usersRoute);
app.use("/admins", verifyToken, verifyAdmin, adminsRoute);
app.use("/students", verifyToken, studentsRoute);

app.use("/unprotected", unProtectedRoute);
