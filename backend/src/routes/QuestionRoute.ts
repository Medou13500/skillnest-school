import { Router } from "express";
import QuestionController from "../controllers/QuestionController";
import { authMiddleware } from "../middleware/auth.middlware";
import { adminOnly } from "../middleware/admin.middlware";

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Gestion des questions (admin pour modification)
 */

export default function questionRoute(controller: QuestionController) {
  const router = Router();

  /**
   * @swagger
   * /api/questions:
   *   post:
   *     summary: Créer une question
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     description: |
   *       Crée une nouvelle question.
   *       - type = test → test de positionnement
   *       - type = quiz → quiz de progression
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           example:
   *             notionId: 1
   *             content: "2 + 2 = ?"
   *             answers: ["1", "2", "3", "4"]
   *             correctAnswer: "4"
   *             type: "test"
   *             difficulty: "facile"
   *     responses:
   *       201:
   *         description: Question créée
   *       400:
   *         description: Données invalides
   */
  router.post(
    "/questions",
    authMiddleware,
    adminOnly,
    controller.createQuestion.bind(controller)
  );

 /**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Récupérer les questions (avec filtres)
 *     tags: [Questions]
 *     description: |
 *       Récupère les questions avec filtres optionnels.
 *
 *        Cas d'utilisation :
 *
 *        type=test → questions pour le test de positionnement
 *        type=quiz → questions pour les quiz de progression
 *        sans type → retourne toutes les questions
 *
 *       💡 Exemples :
 *
 *       /api/questions?type=test
 *        /api/questions?type=quiz
 *        /api/questions?type=quiz&notionId=1
 *
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [test, quiz]
 *         description: |
 *           Type de question :
 *           `test` → test de positionnement
 *            `quiz` → quiz de progression
 *
 *       - in: query
 *         name: notionId
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID de la notion pour filtrer les questions
 *
 *     responses:
 *       200:
 *         description: Liste des questions récupérée avec succès
 *       400:
 *         description: Paramètres invalides
 */
router.get(
  "/questions",
  controller.getAllQuestions.bind(controller)
);

  /**
   * @swagger
   * /api/questions/{id}:
   *   get:
   *     summary: Récupérer une question par ID
   *     tags: [Questions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Question trouvée
   *       404:
   *         description: Question non trouvée
   */
  router.get(
    "/questions/:id",
    controller.getQuestionById.bind(controller)
  );

  /**
   * @swagger
   * /api/questions/{id}:
   *   put:
   *     summary: Modifier une question (update partiel)
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     description: |
   *       Met à jour une question.
   *       ⚠ Tous les champs sont optionnels (update partiel)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           example:
   *             content: "Nouvelle question"
   *             answers: ["1", "2", "3", "4"]
   *             correctAnswer: "4"
   *     responses:
   *       200:
   *         description: Question mise à jour
   *       400:
   *         description: Données invalides
   *       404:
   *         description: Question non trouvée
   */
  router.put(
    "/questions/:id",
    authMiddleware,
    adminOnly,
    controller.updateQuestion.bind(controller)
  );

  /**
   * @swagger
   * /api/questions/{id}:
   *   delete:
   *     summary: Supprimer une question
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Question supprimée
   *       404:
   *         description: Question non trouvée
   */
  router.delete(
    "/questions/:id",
    authMiddleware,
    adminOnly,
    controller.deleteQuestion.bind(controller)
  );

  return router;
}
