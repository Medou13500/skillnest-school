import { Request, Response } from "express";
import QuestionService from "../service/QuestionService";
import { GetQuestionsFilters } from "../type/QuestionTypes";

export default class QuestionController {
  constructor(private service: QuestionService) {}

  // ================= CREATE =================
  async createQuestion(req: Request, res: Response) {
    try {
      const result = await this.service.createQuestion(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // ================= GET ALL (WITH FILTERS) =================
  async getAllQuestions(req: Request, res: Response) {
    try {
      const { type, notionId } = req.query;

      const filters: GetQuestionsFilters = {};

      // 🔥 FIX TYPE (IMPORTANT)
      if (
        typeof type === "string" &&
        (type === "test" || type === "quiz")
      ) {
        filters.type = type;
      }

      // 🔥 FIX NOTION ID
      if (typeof notionId === "string") {
        filters.notionId = Number(notionId);
      }

      const result = await this.service.getAllQuestions(filters);

      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  // ================= GET BY ID =================
  async getQuestionById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID_INVALID" });
      }

      const result = await this.service.getQuestionById(id);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "QUESTION_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  // ================= UPDATE =================
  async updateQuestion(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID_INVALID" });
      }

      const result = await this.service.updateQuestion(id, req.body);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "QUESTION_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "NOTION_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "answers requis") {
        return res.status(400).json({ error: error.message });
      }

      if (error.message === "correctAnswer invalide") {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  // ================= DELETE =================
  async deleteQuestion(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID_INVALID" });
      }

      await this.service.deleteQuestion(id);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message === "QUESTION_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
}