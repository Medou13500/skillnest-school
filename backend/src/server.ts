import express from "express";
import "dotenv/config";

import pool from "./config/database.config";
import UserLoginRepository from "./infrastructure/UserLoginRepository";
import UserLoginService from "./service/UserLoginService";
import UserLoginController from "./controllers/UserLoginController";
import userLoginRoute from "./routes/UserLoginRoute";

const app = express();
app.use(express.json());

// wiring
const repository = new UserLoginRepository(pool);
const service = new UserLoginService(repository);
const controller = new UserLoginController(service);

// routes
app.use("/api", userLoginRoute(controller));

app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
