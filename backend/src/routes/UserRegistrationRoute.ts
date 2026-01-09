import express from "express";
import UserRegistrationController from "../controllers/UserRegistrationController";

export default function userRegistrationRoute(
  controller: UserRegistrationController
) {
  const router = express.Router();

  router.post("/register", controller.register.bind(controller));

  return router;
}
