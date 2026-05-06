import { Router } from "express";
import AnswerController from "../controllers/AnswerController";
import { authMiddleware } from "../middleware/auth.middlware";

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: Gestion des réponses des élèves
 */

export default function answerRoute(controller: AnswerController) {
  const router = Router();

  



  /**

   * @swagger

   * /api/answers:

   *   post:

   *     summary: Soumettre une réponse à une question

   *     tags:

   *       - Answers

   *     security:

   *       - bearerAuth: []

   *     description: |

   *       Permet à un élève de répondre à une question.

   *

   *       Fonctionnement :

   *       - L’élève sélectionne une réponse

   *       - Le backend vérifie si elle est correcte

   *       - La réponse est enregistrée en base

   *       - Retourne si la réponse est correcte ou non

   *

   *       Cas d'utilisation :

   *       - Test de positionnement (type=test)

   *       - Quiz de progression (type=quiz)

   *

   *     requestBody:

   *       required: true

   *       content:

   *         application/json:

   *           schema:

   *             type: object

   *             required:

   *               - questionId

   *               - selectedAnswer

   *             properties:

   *               questionId:

   *                 type: integer

   *                 example: 1

   *               selectedAnswer:

   *                 type: string

   *                 example: "4"

   *

   *     responses:

   *       200:

   *         description: Résultat de la réponse

   *         content:

   *           application/json:

   *             schema:

   *               type: object

   *               properties:

   *                 isCorrect:

   *                   type: boolean

   *                   example: true

   *

   *       400:

   *         description: Réponse invalide ou format incorrect

   *

   *       401:

   *         description: Utilisateur non authentifié (token manquant ou invalide)

   *

   *       404:

   *         description: Question non trouvée

   *

   *       500:

   *         description: Erreur interne du serveur

   */

 
  router.post(
    "/answers",
    authMiddleware,
    controller.submitAnswer.bind(controller),
  );

  return router;
}
