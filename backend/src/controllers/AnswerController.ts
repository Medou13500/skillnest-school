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

  async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });
      const stats = await this.service.getUserStats(userId);
      return res.json(stats);
    } catch {
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  async getPerformance(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const period = req.query.period as string;
      if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });
      const history = await this.service.getPerformanceHistory(userId, period);
      return res.json(history);
    } catch {
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  async getHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: "UNAUTHORIZED" });
      const history = await this.service.getUserHistory(userId);
      return res.json(history);
    } catch {
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }

  async resetHistory(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "EMAIL_REQUIRED" });

      // On utilise UserRepository pour trouver l'ID
      const UserRepository = require("../infrastructure/UserRepository").default;
      const pool = require("../config/database.config").default;
      const userRepo = new UserRepository(pool);

      const user = await userRepo.findByEmail(email);
      if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

      await this.service.resetUserHistory(user.id);
      return res.json({ message: "HISTORY_RESET_SUCCESS" });
    } catch (error: any) {
      console.error('Reset history error:', error);
      return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
}
