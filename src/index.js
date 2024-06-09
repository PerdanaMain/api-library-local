import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// app config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use(router);

// Swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../library.json"), "utf8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
