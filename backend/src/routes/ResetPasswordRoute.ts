import express from "express";
import ResetPasswordController from "../controllers/resetPasswordController";

export default function resetPasswordRoute(
  controller: ResetPasswordController
) {
  const router = express.Router();
  /**
   * @swagger
   * /api/auth/reset-password/confirm:
   *   post:
   *     summary: Réinitialiser le mot de passe
   *     description: >
   *       Permet à un utilisateur de définir un nouveau mot de passe
   *       à partir d’un token reçu par email.
   *
   *        Flow :
   *       - L’utilisateur reçoit un token par email
   *       - Il envoie token + nouveau mot de passe
   *       - Le backend vérifie le token et met à jour le mot de passe
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
   *               - token
   *               - newPassword
   *             properties:
   *               token:
   *                 type: string
   *                 example: "c8f1b2a4-1234-5678-9abc-abcdef123456"
   *               newPassword:
   *                 type: string
   *                 example: "newpassword123"
   *
   *     responses:
   *       200:
   *         description: Mot de passe mis à jour avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Password successfully updated
   *
   *       400:
   *         description: Données invalides ou token invalide
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: TOKEN_INVALID
   *
   *       401:
   *         description: Token expiré
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: TOKEN_EXPIRED
   */

  router.post(
    "/reset-password/confirm",
    controller.resetPassword.bind(controller)
  );

  return router;
}