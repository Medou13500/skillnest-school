// =======================
// 1️⃣ Env
// =======================
import "dotenv/config";

// =======================
// 2️⃣ Imports globaux
// =======================
import express from "express";
import pool from "./config/database.config";

// =======================
// 3️⃣ Swagger
// =======================
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";

// =======================
// 4️⃣ LOGIN
// =======================
import UserLoginRepository from "./infrastructure/UserLoginRepository";
import UserLoginService from "./service/UserLoginService";
import UserLoginController from "./controllers/UserLoginController";
import userLoginRoute from "./routes/UserLoginRoute";

// =======================
// 5️⃣ REFRESH TOKEN
// =======================
import RefreshTokenRepository from "./infrastructure/RefreshTokenRepository";
import RefreshTokenService from "./service/RefreshTokenService";
import RefreshTokenController from "./controllers/RefreshTokenController";
import refreshTokenRoute from "./routes/RefreshTokenRoute";

// =======================
// 6️⃣ REGISTER
// =======================
import UserRegistrationRepository from "./infrastructure/UserRegistrationRepository";
import UserRegistrationService from "./service/UserRegistrationService";
import UserRegistrationController from "./controllers/UserRegistrationController";
import userRegistrationRoute from "./routes/UserRegistrationRoute";

// =======================
// 7️⃣ App Express
// =======================
const app = express();
app.use(express.json());

// =======================
// 8️⃣ Swagger route
// =======================
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =======================
// 9️⃣ Repositories
// =======================
const loginRepository = new UserLoginRepository(pool);
const refreshTokenRepository = new RefreshTokenRepository(pool);
const registrationRepository = new UserRegistrationRepository();

// =======================
// 🔟 Services
// =======================
const refreshTokenService = new RefreshTokenService(
  refreshTokenRepository
);

const loginService = new UserLoginService(
  loginRepository,
  refreshTokenService
);

const registrationService = new UserRegistrationService(
  registrationRepository
);

// =======================
// 1️⃣1️⃣ Controllers
// =======================
const loginController = new UserLoginController(loginService);
const refreshTokenController = new RefreshTokenController(
  refreshTokenService
);
const registrationController = new UserRegistrationController(
  registrationService
);

// =======================
// 1️⃣2️⃣ Routes
// =======================
app.use("/api", userLoginRoute(loginController));
app.use("/api", refreshTokenRoute(refreshTokenController));
app.use("/api", userRegistrationRoute(registrationController));

// =======================
// 1️⃣3️⃣ Healthcheck
// =======================
app.get("/", (_req, res) => {
  res.json({ status: "Backend running" });
});

// =======================
// 1️⃣4️⃣ Server
// =======================
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
  console.log("📚 Swagger available on http://localhost:3000/api/docs");
});
