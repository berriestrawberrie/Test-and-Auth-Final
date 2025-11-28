import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log("\x1b[32m%s\x1b[0m", `Server is running on localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "development") {
    console.log("\x1b[33m%s\x1b[0m", "To be able to view Swagger docs, make sure to run: npm run openapi:gen");
    console.log("\x1b[1m%s\x1b[0m", `Swagger docs available at http://localhost:${PORT}/docs`);
  }
});
