import "dotenv/config";
import express from "express";
import pool from "./config/database.config";

// LOGIN
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

const app = express();
app.use(express.json());

// ===== Repositories =====
const loginRepository = new UserLoginRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const registrationRepository = new UserRegistrationRepository();

// ===== Services =====
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const loginService = new UserLoginService(
  loginRepository,
  refreshTokenService
);
const registrationService = new UserRegistrationService(
  registrationRepository
);

// ===== Controllers =====
const loginController = new UserLoginController(loginService);
const refreshTokenController = new RefreshTokenController(
  refreshTokenService
);
const registrationController = new UserRegistrationController(
  registrationService
);

// ===== Routes =====
app.use("/api", userLoginRoute(loginController));
app.use("/api", refreshTokenRoute(refreshTokenController));
app.use("/api", userRegistrationRoute(registrationController));

// ===== Health =====
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

// ===== Server =====
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
