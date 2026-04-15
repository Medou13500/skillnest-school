import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./config/database.config";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

// AUTH LOGIN
import UserLoginRepository from "./infrastructure/UserLoginRepository";
import UserLoginService from "./service/UserLoginService";
import UserLoginController from "./controllers/UserLoginController";
import userLoginRoute from "./routes/UserLoginRoute";

// REFRESH TOKEN
import RefreshTokenRepository from "./infrastructure/RefreshTokenRepository";
import RefreshTokenService from "./service/RefreshTokenService";
import RefreshTokenController from "./controllers/RefreshTokenController";
import refreshTokenRoute from "./routes/RefreshTokenRoute";

// REGISTER
import UserRegistrationRepository from "./infrastructure/UserRegistrationRepository";
import UserRegistrationService from "./service/UserRegistrationService";
import UserRegistrationController from "./controllers/UserRegistrationController";
import userRegistrationRoute from "./routes/UserRegistrationRoute";

// FORGOT PASSWORD (DEMANDE)
import AskResetPasswordRepository from "./infrastructure/AskResetPasswordRepository";
import AskResetPasswordService from "./service/askResetPasswordService";
import AskResetPasswordController from "./controllers/AskResetPasswordController";
import AskResetPaswordRoute from "./routes/AskResetPasswordRoute";

// RESET PASSWORD (CONFIRM)
import ResetPasswordRepository from "./infrastructure/ResetPasswordRepository";
import ResetPasswordService from "./service/resetPasswordService";
import ResetPasswordController from "./controllers/resetPasswordController";
import resetPasswordRoute from "./routes/ResetPasswordRoute";

// EMAIL + USER
import EmailService from "./service/emailService";
import UserRepository from "./infrastructure/UserRepository";

// ===================== APP INIT =====================

const app = express();
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===================== REPOSITORIES =====================

const loginRepository = new UserLoginRepository(pool);
const userRepository = new UserRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const registrationRepository = new UserRegistrationRepository();

const askResetPasswordRepository = new AskResetPasswordRepository(pool);
const resetPasswordRepository = new ResetPasswordRepository(pool);

// ===================== SERVICES =====================

const refreshTokenService = new RefreshTokenService(refreshTokenRepository);

const loginService = new UserLoginService(loginRepository, refreshTokenService);

const registrationService = new UserRegistrationService(registrationRepository);

const emailServiceInstance = new EmailService();

const askResetPasswordService = new AskResetPasswordService(
  askResetPasswordRepository,
  userRepository,
  emailServiceInstance,
);

const resetPasswordService = new ResetPasswordService(
  resetPasswordRepository,
  userRepository,
);

// ===================== CONTROLLERS =====================

const loginController = new UserLoginController(loginService);

const refreshTokenController = new RefreshTokenController(refreshTokenService);

const registrationController = new UserRegistrationController(
  registrationService,
);

const askResetPasswordController = new AskResetPasswordController(
  askResetPasswordService,
);

const resetPasswordController = new ResetPasswordController(
  resetPasswordService,
);

// ===================== ROUTES =====================

app.use("/api/auth", userLoginRoute(loginController))
app.use("/api/auth", refreshTokenRoute(refreshTokenController));
app.use("/api/auth", userRegistrationRoute(registrationController));

app.use("/api/auth", AskResetPaswordRoute(askResetPasswordController));
app.use("/api/auth", resetPasswordRoute(resetPasswordController));

// ===================== HEALTH =====================

app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

// ===================== SERVER =====================

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
  console.log("📚 Swagger available on http://localhost:3000/api/docs");
});
