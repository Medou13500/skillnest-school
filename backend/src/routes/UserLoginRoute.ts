import express from "express";
import UserLoginController from "../controllers/UserLoginController";
import { authMiddleware } from "../middleware/auth.middlware";

export default function userLoginRoute(controller: UserLoginController) {
  const router = express.Router();

  // LOGIN
  router.post("/login", controller.login.bind(controller));

  // INFO (facultatif, pédagogique)
  router.get("/login", (_req, res) => {
    res.json({
      message: "Use POST /api/login with email and password",
    });
  });

  // PROFIL UTILISATEUR (protégé)
  router.get(
    "/me",
    authMiddleware,
    controller.me.bind(controller)
  );

  return router;
}
