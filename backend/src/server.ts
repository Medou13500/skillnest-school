import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./config/database.config";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

// ===================== IMPORTS =====================

// Auth
import UserLoginRepository from "./infrastructure/UserLoginRepository";
import UserLoginService from "./service/UserLoginService";
import UserLoginController from "./controllers/UserLoginController";
import userLoginRoute from "./routes/UserLoginRoute";

import RefreshTokenRepository from "./infrastructure/RefreshTokenRepository";
import RefreshTokenService from "./service/RefreshTokenService";
import RefreshTokenController from "./controllers/RefreshTokenController";
import refreshTokenRoute from "./routes/RefreshTokenRoute";

import UserRegistrationRepository from "./infrastructure/UserRegistrationRepository";
import UserRegistrationService from "./service/UserRegistrationService";
import UserRegistrationController from "./controllers/UserRegistrationController";
import userRegistrationRoute from "./routes/UserRegistrationRoute";

// Reset password
import AskResetPasswordRepository from "./infrastructure/AskResetPasswordRepository";
import AskResetPasswordService from "./service/askResetPasswordService";
import AskResetPasswordController from "./controllers/AskResetPasswordController";
import AskResetPaswordRoute from "./routes/AskResetPasswordRoute";
import EmailService from "./service/emailService";
import UserRepository from "./infrastructure/UserRepository";

// ===================== APP INIT =====================

const app = express();
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===================== REPOSITORIES =====================

const loginRepository = new UserLoginRepository(pool);
const userRepository = new UserRepository(pool); // ✅ FIX ICI
const refreshTokenRepository = new RefreshTokenRepository(pool);
const registrationRepository = new UserRegistrationRepository();
const askResetPasswordRepository = new AskResetPasswordRepository(pool);

// ===================== SERVICES =====================

const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

const loginService = new UserLoginService(
  loginRepository,
  refreshTokenService
);

const registrationService = new UserRegistrationService(
  registrationRepository
);

const emailServiceInstance = new EmailService();

const askResetPasswordService = new AskResetPasswordService(
  askResetPasswordRepository,
  userRepository, 
  emailServiceInstance
);

// ===================== CONTROLLERS =====================

const loginController = new UserLoginController(loginService);

const refreshTokenController = new RefreshTokenController(
  refreshTokenService
);

const registrationController = new UserRegistrationController(
  registrationService
);

const askResetPasswordController = new AskResetPasswordController(
  askResetPasswordService
);

// ===================== ROUTES =====================

app.use("/api", userLoginRoute(loginController));
app.use("/api", refreshTokenRoute(refreshTokenController));
app.use("/api", userRegistrationRoute(registrationController));
app.use("/api", AskResetPaswordRoute(askResetPasswordController));

// ===================== HEALTH =====================

app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

// ===================== SERVER =====================

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
  console.log("📚 Swagger available on http://localhost:3000/api/docs");
});