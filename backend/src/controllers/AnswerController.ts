import { Response } from "express";
import AnswerService from "../service/AnswerService";
import { AuthRequest } from "../type/AuthRequest";

export default class AnswerController {
  constructor(private service: AnswerService) {}

  async submitAnswer(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
      }

      const result = await this.service.submitAnswer(userId, req.body);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "QUESTION_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "INVALID_ANSWER") {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
}