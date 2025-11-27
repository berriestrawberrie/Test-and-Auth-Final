import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
