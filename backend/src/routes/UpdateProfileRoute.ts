import express from "express";
import UpdateProfileController from "../controllers/UpdateProfileController";
import { authMiddleware, AuthRequest } from "../middleware/auth.middlware";

export default function updateProfileRoute(controller: UpdateProfileController) {
  const router = express.Router();

  /**
   * @swagger
   * /api/auth/profile:
   *   get:
   *     summary: Obtenir le profil de l'utilisateur connecté
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profil de l'utilisateur
   *       401:
   *         description: Non autorisé
   */
  router.get(
    "/profile",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      authMiddleware(req as AuthRequest, res, next);
    },
    controller.getProfile.bind(controller)
  );

  /**
   * @swagger
   * /api/auth/profile:
   *   put:
   *     summary: Mettre à jour le profil de l'utilisateur connecté
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Profil mis à jour
   *       400:
   *         description: Erreur
   *       401:
   *         description: Non autorisé
   */
  router.put(
    "/profile",
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      authMiddleware(req as AuthRequest, res, next);
    },
    controller.updateProfile.bind(controller)
  );

  return router;
}