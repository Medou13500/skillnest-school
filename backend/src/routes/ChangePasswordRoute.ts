import express from "express";
import ChangePasswordController from "../controllers/ChangePasswordController";
import { authMiddleware, AuthRequest } from "../middleware/auth.middlware";

export default function changePasswordRoute(controller: ChangePasswordController) {
  const router = express.Router();

  /**
   * @swagger
   * /api/auth/change-password:
   *   post:
   *     summary: Changer le mot de passe de l'utilisateur connecté
   *     description: >
   *       Permet à un utilisateur connecté de changer son mot de passe.
   *       Nécessite le mot de passe actuel et le nouveau mot de passe.
   *
   *     tags:
   *       - Auth
   *
   *     security:
   *       - bearerAuth: []
   *
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *                 example: "oldpassword123"
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
   *         description: Erreur (mot de passe actuel incorrect ou trop court)
   *       401:
   *         description: Non autorisé (token invalide ou absent)
   */
  router.post(
    "/change-password",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      authMiddleware(req as AuthRequest, res, next);
    },
    controller.changePassword.bind(controller)
  );

  return router;
}