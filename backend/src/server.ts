// src/server.ts

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./config/database.config";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

// ===================== QUESTION =====================

import QuestionRepository from "./infrastructure/QuestionRepository";
import QuestionService from "./service/QuestionService";
import QuestionController from "./controllers/QuestionController";
import questionRoute from "./routes/QuestionRoute";

// ✅ AJOUT NOTION
import NotionRepository from "./infrastructure/NotionRepository";

// ===================== AUTH LOGIN =====================

import UserLoginRepository from "./infrastructure/UserLoginRepository";
import UserLoginService from "./service/UserLoginService";
import UserLoginController from "./controllers/UserLoginController";
import userLoginRoute from "./routes/UserLoginRoute";

// ===================== REFRESH TOKEN =====================

import RefreshTokenRepository from "./infrastructure/RefreshTokenRepository";
import RefreshTokenService from "./service/RefreshTokenService";
import RefreshTokenController from "./controllers/RefreshTokenController";
import refreshTokenRoute from "./routes/RefreshTokenRoute";

// ===================== REGISTER =====================

import UserRegistrationRepository from "./infrastructure/UserRegistrationRepository";
import UserRegistrationService from "./service/UserRegistrationService";
import UserRegistrationController from "./controllers/UserRegistrationController";
import userRegistrationRoute from "./routes/UserRegistrationRoute";

// ===================== FORGOT PASSWORD =====================

import AskResetPasswordRepository from "./infrastructure/AskResetPasswordRepository";
import AskResetPasswordService from "./service/askResetPasswordService";
import AskResetPasswordController from "./controllers/AskResetPasswordController";
import AskResetPasswordRoute from "./routes/AskResetPasswordRoute";

// ===================== RESET PASSWORD =====================

import ResetPasswordRepository from "./infrastructure/ResetPasswordRepository";
import ResetPasswordService from "./service/resetPasswordService";
import ResetPasswordController from "./controllers/resetPasswordController";
import resetPasswordRoute from "./routes/ResetPasswordRoute";

// ===================== EMAIL + USER =====================

import EmailService from "./service/emailService";
import UserRepository from "./infrastructure/UserRepository";

// ===================== APP INIT =====================

const app = express();
app.use(express.json());

// Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===================== REPOSITORIES =====================

const loginRepository = new UserLoginRepository(pool);
const userRepository = new UserRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const registrationRepository = new UserRegistrationRepository();

const askResetPasswordRepository = new AskResetPasswordRepository(pool);
const resetPasswordRepository = new ResetPasswordRepository(pool);

// Question
const questionRepository = new QuestionRepository(pool);

// ✅ NOTION REPOSITORY
const notionRepository = new NotionRepository(pool);

// ===================== SERVICES =====================

const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const loginService = new UserLoginService(loginRepository, refreshTokenService);
const registrationService = new UserRegistrationService(registrationRepository);

const emailServiceInstance = new EmailService();

const askResetPasswordService = new AskResetPasswordService(
  askResetPasswordRepository,
  userRepository,
  emailServiceInstance
);

const resetPasswordService = new ResetPasswordService(
  resetPasswordRepository,
  userRepository
);

// ✅ QUESTION SERVICE AVEC NOTION
const questionService = new QuestionService(
  questionRepository,
  notionRepository
);

// ===================== CONTROLLERS =====================

const loginController = new UserLoginController(loginService);
const refreshTokenController = new RefreshTokenController(refreshTokenService);
const registrationController = new UserRegistrationController(
  registrationService
);

const askResetPasswordController = new AskResetPasswordController(
  askResetPasswordService
);

const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);

// Question
const questionController = new QuestionController(questionService);

// ===================== ROUTES =====================

// AUTH
app.use("/api/auth", userLoginRoute(loginController));
app.use("/api/auth", refreshTokenRoute(refreshTokenController));
app.use("/api/auth", userRegistrationRoute(registrationController));
app.use("/api/auth", AskResetPasswordRoute(askResetPasswordController));
app.use("/api/auth", resetPasswordRoute(resetPasswordController));

// QUESTIONS
app.use("/api", questionRoute(questionController));

// ===================== HEALTH =====================

app.get("/", (_req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// ===================== SERVER =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger available on http://localhost:${PORT}/api/docs`);
});