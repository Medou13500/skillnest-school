import express from "express";
import QuestionController from "../controllers/QuestionController";
import { authMiddleware } from "../middleware/auth.middlware";
import { adminOnly } from "../middleware/admin.middlware";

export default function createQuestionRoutes(controller: QuestionController) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Questions
   *   description: Gestion des questions (admin uniquement)
   */

  /**
   * @swagger
   * /api/questions:
   *   post:
   *     summary: Créer une question
   *     description: |
   *       Permet à un administrateur de créer une nouvelle question.
   *
   *       🔒 Route protégée (JWT + rôle admin requis)
   *
   *       📌 Une question contient :
   *       - un contenu (question)
   *       - une liste de réponses possibles
   *       - une réponse correcte
   *
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - notionId
   *               - content
   *               - answers
   *               - correctAnswer
   *               - type
   *               - difficulty
   *             properties:
   *               notionId:
   *                 type: integer
   *                 example: 1
   *               content:
   *                 type: string
   *                 example: "2 + 2 = ?"
   *               answers:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: ["1", "2", "3", "4"]
   *               correctAnswer:
   *                 type: string
   *                 example: "4"
   *               type:
   *                 type: string
   *                 enum: [test, quiz]
   *                 example: "test"
   *               difficulty:
   *                 type: string
   *                 enum: [facile, moyen, difficile]
   *                 example: "facile"
   *     responses:
   *       201:
   *         description: Question créée
   *       400:
   *         description: Données invalides
   *       401:
   *         description: Non authentifié
   *       403:
   *         description: Non autorisé (admin requis)
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
   *     summary: Récupérer toutes les questions
   *     description: |
   *       Retourne la liste complète des questions.
   *
   *       📌 Accessible publiquement (pas besoin d'être connecté)
   *
   *     tags: [Questions]
   *     responses:
   *       200:
   *         description: Liste des questions
   *       500:
   *         description: Erreur serveur
   */
  router.get("/questions", controller.getAllQuestions.bind(controller));

  /**
   * @swagger
   * /api/questions/{id}:
   *   get:
   *     summary: Récupérer une question par ID
   *     description: |
   *       Retourne une question spécifique à partir de son ID.
   *
   *       📌 Utilisation :
   *       - afficher détail question
   *       - debug
   *
   *     tags: [Questions]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 5
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
   *     summary: Modifier une question
   *     description: |
   *       Permet à un admin de modifier une question existante.
   *
   *       🔒 Route protégée (JWT + admin)
   *
   *       ⚠️ Toutes les données doivent être renvoyées (update complet)
   *
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 5
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example:
   *               notionId: 1
   *               content: "2 + 3 = ?"
   *               answers: ["4", "5", "6"]
   *               correctAnswer: "5"
   *               type: "quiz"
   *               difficulty: "moyen"
   *     responses:
   *       200:
   *         description: Question modifiée
   *       400:
   *         description: Données invalides
   *       404:
   *         description: Question non trouvée
   *       403:
   *         description: Non autorisé
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
   *     description: |
   *       Permet à un admin de supprimer une question.
   *
   *       🔒 Route protégée (JWT + admin)
   *
   *     tags: [Questions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         example: 5
   *     responses:
   *       204:
   *         description: Question supprimée
   *       404:
   *         description: Question non trouvée
   *       403:
   *         description: Non autorisé
   */
  router.delete(
    "/questions/:id",
    authMiddleware,
    adminOnly,
    controller.deleteQuestion.bind(controller)
  );

  return router;
}