import express from "express";
import UserLoginController from "../controllers/UserLoginController";
import pool from "../config/database.config";

export default function userLoginRoute(controller: UserLoginController) {
  const router = express.Router();

router.post("/login", controller.login.bind(controller));


  // test DB réel
  router.get("/db-test", async (_req, res) => {
    const result = await pool.query("SELECT 1 AS ok");
    res.json(result.rows[0]);
  });

  return router;
}
