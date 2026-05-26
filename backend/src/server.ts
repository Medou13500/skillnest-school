import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pool from "./config/database.config";
import { initializeDatabaseSchema } from "./config/database.schema";
import { seedTestAccount } from "./config/database.seed";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

// ===================== QUESTION =====================

import QuestionRepository from "./infrastructure/QuestionRepository";
import QuestionService from "./service/QuestionService";
import QuestionController from "./controllers/QuestionController";
import questionRoute from "./routes/QuestionRoute";


import NotionRepository from "./infrastructure/NotionRepository";

// ===================== ANSWER =====================

import AnswerRepository from "./infrastructure/AnswerRepository";
import AnswerService from "./service/AnswerService";
import AnswerController from "./controllers/AnswerController";
import answerRoute from "./routes/AnswerRoute";

// ===================== AUTH LOGIN =====================

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

// CHANGE PASSWORD (CONNECTED USER)
import ChangePasswordService from "./service/ChangePasswordService";
import ChangePasswordController from "./controllers/ChangePasswordController";
import changePasswordRoute from "./routes/ChangePasswordRoute";

// UPDATE PROFILE (CONNECTED USER)
import UpdateProfileService from "./service/UpdateProfileService";
import UpdateProfileController from "./controllers/UpdateProfileController";
import updateProfileRoute from "./routes/UpdateProfileRoute";

// EMAIL + USER
import EmailService from "./service/emailService";
import UserRepository from "./infrastructure/UserRepository";



const app = express();
// Allow larger JSON payloads to support base64-encoded image uploads from the admin UI
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const allowedOrigins = (process.env.CORS_ORIGINS ??
  "http://localhost,http://localhost:8100,http://localhost:4200,http://127.0.0.1:8100,http://127.0.0.1:4200,capacitor://localhost,http://192.168.1.204:8100")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : origin || "*";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  if (origin) {
    res.header("Vary", "Origin");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const loginRepository = new UserLoginRepository(pool);
const userRepository = new UserRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const registrationRepository = new UserRegistrationRepository();

const askResetPasswordRepository = new AskResetPasswordRepository(pool);
const resetPasswordRepository = new ResetPasswordRepository(pool);


const questionRepository = new QuestionRepository(pool);


const notionRepository = new NotionRepository(pool);


const answerRepository = new AnswerRepository(pool);

const answerService = new AnswerService(
  answerRepository,
  questionRepository
);

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

// Question
const questionService = new QuestionService(
  questionRepository,
  notionRepository
);

const changePasswordService = new ChangePasswordService(userRepository);

const updateProfileService = new UpdateProfileService(userRepository);

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
  resetPasswordService
);

const changePasswordController = new ChangePasswordController(
  changePasswordService
);

const updateProfileController = new UpdateProfileController(
  updateProfileService
);

// Question
const questionController = new QuestionController(questionService);


const answerController = new AnswerController(answerService);



// AUTH
app.use("/api/auth", userLoginRoute(loginController));
app.use("/api/auth", refreshTokenRoute(refreshTokenController));
app.use("/api/auth", userRegistrationRoute(registrationController));

app.use("/api/auth", AskResetPaswordRoute(askResetPasswordController));
app.use("/api/auth", resetPasswordRoute(resetPasswordController));
app.use("/api/auth", changePasswordRoute(changePasswordController));
app.use("/api/auth", updateProfileRoute(updateProfileController));


app.use("/api", questionRoute(questionController));
app.use("/api", answerRoute(answerController));

// ===================== HEALTH =====================

app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

// ===================== SERVER =====================

async function startServer(): Promise<void> {
  try {
    await initializeDatabaseSchema(pool);
    console.log(" DB SCHEMA READY");
    await seedTestAccount(pool);

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
      console.log("📚 Swagger available on http://localhost:3000/api/docs");
    });
  } catch (error) {
    console.error(" Failed to initialize database schema:", error);
    process.exit(1);
  }
}

void startServer();
