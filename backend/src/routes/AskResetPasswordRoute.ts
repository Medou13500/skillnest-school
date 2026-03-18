import express from "express";
import AskResetPasswordController from "../controllers/AskResetPasswordController";

export default function AskResetPaswordRoute(
  controller: AskResetPasswordController
) {
 const router = express.Router();

/**
 * @swagger
 * /auth/reset-password/request:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     description: |
 *       Permet à un utilisateur de demander un lien de réinitialisation de mot de passe.
 *       
 *       🔒 Sécurité :
 *       - Cette route retourne toujours une réponse positive,
 *         même si l'email n'existe pas.
 *       - Cela évite de révéler si un compte est enregistré.
 *
 *     tags:
 *       - Auth
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *
 *     responses:
 *       200:
 *         description: Demande traitée (email envoyé si le compte existe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: If account exists, reset email sent
 *
 *       400:
 *         description: Requête invalide (email manquant ou mal formé)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: RESET_PASSWORD_REQUIRED
 *
 *       500:
 *         description: Erreur interne du serveur
 */
 router.post("/auth/forgot-password", controller.AskResetPassword.bind(controller));














  return router;
}