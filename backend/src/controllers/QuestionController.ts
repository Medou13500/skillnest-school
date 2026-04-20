import { Request, Response } from "express";
import QuestionService from "../service/QuestionService";

export default class QuestionController {
  constructor(private service: QuestionService) {}

async createQuestion(req: Request, res: Response) {
  try {
    const data = req.body;

    console.log("REQ BODY:", data); // 👈 voir ce que tu envoies

    const question = await this.service.createQuestion(data);

    return res.status(201).json(question);
  } catch (error: any) {
    console.log("🔥 BACKEND ERROR:", error); // 👈 LA VÉRITÉ EST ICI

    return res.status(400).json({
      error: error.message || "Erreur lors de la création de la question",
    });
  }
}

}