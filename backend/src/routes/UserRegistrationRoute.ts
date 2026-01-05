import express from "express";
import UserRegistrationController from "../controllers/UserRegistrationController";

export default function userRegistrationRoute(
  controller: UserRegistrationController
) {
  const router = express.Router();

  // POST /api/register
  router.post("/register", controller.register.bind(controller));

  return router;
}
