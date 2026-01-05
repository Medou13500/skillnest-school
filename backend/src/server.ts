import express from "express";
import "dotenv/config";

import pool from "./config/database.config";

// LOGIN
import UserLoginRepository from "./infrastructure/UserLoginRepository";
import UserLoginService from "./service/UserLoginService";
import UserLoginController from "./controllers/UserLoginController";
import userLoginRoute from "./routes/UserLoginRoute";

// REGISTER
import UserRegistrationRepository from "./infrastructure/UserRegistrationRepository";
import UserRegistrationService from "./service/UserRegistrationService";
import UserRegistrationController from "./controllers/UserRegistrationController";
import userRegistrationRoute from "./routes/UserRegistrationRoute";

const app = express();
app.use(express.json());

/* ===== LOGIN wiring ===== */
const loginRepository = new UserLoginRepository(pool);
const loginService = new UserLoginService(loginRepository);
const loginController = new UserLoginController(loginService);

/* ===== REGISTER wiring ===== */
const registrationRepository = new UserRegistrationRepository();
const registrationService = new UserRegistrationService(registrationRepository);
const registrationController = new UserRegistrationController(registrationService);

/* ===== ROUTES ===== */
app.use("/api", userLoginRoute(loginController));
app.use("/api", userRegistrationRoute(registrationController));

/* ===== HEALTH ===== */
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

/* ===== SERVER ===== */
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
