import { Request, Response } from "express";
import QuestionService from "../service/QuestionService";

export default class QuestionController {
  constructor(private service: QuestionService) {}

  async createQuestion(req: Request, res: Response) {
    try {
      const data = req.body;

      console.log("REQ BODY:", data);

      const question = await this.service.createQuestion(data);

      return res.status(201).json(question);
    } catch (error: any) {
      console.log(" BACKEND ERROR:", error);

      return res.status(400).json({
        error: error.message || "Erreur lors de la création de la question",
      });
    }
  }
  async getAllQuestions(req: Request, res: Response) {
    try {
      const questions = await this.service.getAllQuestions();

      return res.status(200).json(questions);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  async getQuestionById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const question = await this.service.getQuestionById(id);

    if (!question) {
      return res.status(404).json({ error: "QUESTION_NOT_FOUND" });
    }

    return res.status(200).json(question);

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
}
