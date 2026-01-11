import express from "express";
import UserLoginController from "../controllers/UserLoginController";
import { authMiddleware } from "../middleware/auth.middlware";

export default function userLoginRoute(controller: UserLoginController) {
  const router = express.Router();

  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Connexion utilisateur
   *     description: |
   *       Authentifie un utilisateur avec email + mot de passe.
   *
   *       🔐 Retourne :
   *       - un **access token (JWT)** court
   *       - un **refresh token** long stocké en base
   *
   *       📌 Le refresh token sert à renouveler l’access token sans se reconnecter.
   *
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: test@test.com
   *               password:
   *                 type: string
   *                 example: "1234"
   *     responses:
   *       200:
   *         description: Connexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 access_token:
   *                   type: string
   *                 refresh_token:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: number
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *       401:
   *         description: Identifiants invalides
   */
  router.post("/login", controller.login.bind(controller));

  /**
   * @swagger
   * /api/login:
   *   get:
   *     summary: Information sur la route login
   *     description: |
   *       Route pédagogique indiquant comment utiliser l’endpoint de connexion.
   *     tags:
   *       - Auth
   *     responses:
   *       200:
   *         description: Message informatif
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   */
  router.get("/login", (_req, res) => {
    res.json({
      message: "Use POST /api/login with email and password",
    });
  });

  /**
   * @swagger
   * /api/me:
   *   get:
   *     summary: Profil utilisateur connecté
   *     description: |
   *       Retourne les informations de l’utilisateur connecté.
   *
   *       🔒 Cette route est protégée par **JWT (Bearer token)**.
   *
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Informations utilisateur
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: number
   *                 email:
   *                   type: string
   *                 role:
   *                   type: string
   *       401:
   *         description: Token manquant ou invalide
   */
  router.get(
    "/me",
    authMiddleware,
    controller.me.bind(controller)
  );

  return router;
}
