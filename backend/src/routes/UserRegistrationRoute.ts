import express from "express";
import UserRegistrationController from "../controllers/UserRegistrationController";

export default function userRegistrationRoute(
  controller: UserRegistrationController
) {
  const router = express.Router();

  /**
   * @swagger
   * /api/register:
   *   post:
   *     summary: Inscription utilisateur
   *     description: |
   *       Crée un nouvel utilisateur dans le système.
   *
   *       🔐 Le mot de passe est hashé côté backend.
   *
   *       ⚠️ Cette route **ne connecte pas automatiquement** l’utilisateur.
   *       → Le front doit ensuite appeler **POST /api/login**.
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
   *       201:
   *         description: Utilisateur créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 userId:
   *                   type: number
   *       409:
   *         description: Email déjà utilisé
   *       400:
   *         description: Données invalides
   */
  router.post("/register", controller.register.bind(controller));

  return router;
}
