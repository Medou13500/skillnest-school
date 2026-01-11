import express from "express";
import RefreshTokenController from "../controllers/RefreshTokenController";

export default function refreshTokenRoute(
  controller: RefreshTokenController
) {
  const router = express.Router();

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Rafraîchir l’access token
   *     description: |
   *       Génère un nouvel **access token** à partir d’un **refresh token valide**.
   *
   *       🔁 Flux :
   *       - Le front envoie le refresh token
   *       - Le backend vérifie qu’il existe en base et qu’il n’est pas expiré
   *       - Un nouvel access token est généré
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
   *               - refresh_token
   *             properties:
   *               refresh_token:
   *                 type: string
   *                 example: "e8f1c9b8a0f74d9c9e3d..."
   *     responses:
   *       200:
   *         description: Nouvel access token généré
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 access_token:
   *                   type: string
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       401:
   *         description: Refresh token invalide ou expiré
   */
  router.post("/auth/refresh", controller.refresh.bind(controller));

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Déconnexion utilisateur
   *     description: |
   *       Invalide le **refresh token** en base de données.
   *
   *       🔐 Après cette action :
   *       - Le refresh token ne peut plus être utilisé
   *       - Toute tentative de refresh échouera
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
   *               - refresh_token
   *             properties:
   *               refresh_token:
   *                 type: string
   *                 example: "e8f1c9b8a0f74d9c9e3d..."
   *     responses:
   *       200:
   *         description: Déconnexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Logged out
   *       401:
   *         description: Refresh token invalide
   */
  router.post("/auth/logout", controller.logout.bind(controller));

  return router;
}
