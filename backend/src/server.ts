// =======================
// 1️⃣ Charger l'environnement (ESM SAFE)
// =======================
import "dotenv/config";

// =======================
// 2️⃣ Imports normaux
// =======================
import express from "express";
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

// =======================
// 3️⃣ App Express
// =======================
const app = express();
app.use(express.json());

// =======================
// 4️⃣ LOGIN wiring
// =======================
const loginRepository = new UserLoginRepository(pool);
const loginService = new UserLoginService(loginRepository);
const loginController = new UserLoginController(loginService);

// =======================
// 5️⃣ REGISTER wiring
// =======================
const registrationRepository = new UserRegistrationRepository();
const registrationService = new UserRegistrationService(registrationRepository);
const registrationController = new UserRegistrationController(
  registrationService
);

// =======================
// 6️⃣ Routes
// =======================
app.use("/api", userLoginRoute(loginController));
app.use("/api", userRegistrationRoute(registrationController));

// =======================
// 7️⃣ Healthcheck
// =======================
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

// =======================
// 8️⃣ Server
// =======================
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
