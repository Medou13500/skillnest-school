import express from "express";
import RefreshTokenController from "../controllers/RefreshTokenController";

export default function refreshTokenRoute(
  controller: RefreshTokenController
) {
  const router = express.Router();

  router.post("/auth/refresh", controller.refresh.bind(controller));
  router.post("/auth/logout", controller.logout.bind(controller));

  return router;
}
