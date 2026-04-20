import express from "express";
import QuestionController from "../controllers/QuestionController";
import  {authMiddleware} from "../middleware/auth.middlware";
import {adminOnly } from "../middleware/admin.middlware";
export default function createQuestionRoutes(
  controller: QuestionController
) {
  const router = express.Router();

  /**
   * @swagger
   * tags:
   *   name: Questions
   *   description: Gestion des questions (admin)
   */

 /**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Gestion des questions (admin)
 */

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Gestion des questions (admin)
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Créer une question
 *     tags: [Questions]
 *     description: >
 *       Permet à un admin de créer une question.
 *       Une question appartient à une notion, elle-même liée à une matière.
 *
 *       ⚠️ Le champ "answers" est toujours retourné comme un tableau de chaînes.
 *
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
 *                 description: ID de la notion associée
 *                 example: 1
 *
 *               content:
 *                 type: string
 *                 description: Texte de la question
 *                 example: "Quel est le résultat de 5 × 3 ?"
 *
 *               answers:
 *                 type: array
 *                 description: Liste des réponses possibles
 *                 items:
 *                   type: string
 *                 example: ["8", "15", "10", "20"]
 *
 *               correctAnswer:
 *                 type: string
 *                 description: Doit exister dans answers
 *                 example: "15"
 *
 *               type:
 *                 type: string
 *                 enum: [test, quiz]
 *                 description: Type de question
 *                 example: "test"
 *
 *               difficulty:
 *                 type: string
 *                 enum: [facile, moyen, difficile]
 *                 description: Niveau de difficulté
 *                 example: "facile"
 *
 *     responses:
 *       201:
 *         description: Question créée avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               notionId: 1
 *               content: "Quel est le résultat de 5 × 3 ?"
 *               answers: ["8", "15", "10", "20"]
 *               correctAnswer: "15"
 *               type: "test"
 *               difficulty: "facile"
 *               createdAt: "2026-04-20T17:01:45.072Z"
 *               updatedAt: "2026-04-20T17:01:45.072Z"
 *
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             examples:
 *               missingField:
 *                 summary: Champ manquant
 *                 value:
 *                   error: "content requis"
 *
 *               invalidAnswer:
 *                 summary: Réponse invalide
 *                 value:
 *                   error: "correctAnswer invalide"
 *
 *               invalidType:
 *                 summary: Type invalide
 *                 value:
 *                   error: "type invalide"
 *
 *               invalidDifficulty:
 *                 summary: Difficulté invalide
 *                 value:
 *                   error: "difficulty invalide"
 */

router.post(
  "/questions",
  authMiddleware,
  adminOnly,
  (req, res) => controller.createQuestion(req, res)
);

  return router;
}