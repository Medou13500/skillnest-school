import { Request, Response, NextFunction } from "express";
import ChangePasswordService from "../service/ChangePasswordService";
import { authMiddleware, AuthRequest } from "../middleware/auth.middlware";

export default class ChangePasswordController {
  constructor(private service: ChangePasswordService) {}

  // Middleware d'authentification
  static authenticate(req: Request, res: Response, next: NextFunction) {
    authMiddleware(req as AuthRequest, res, next);
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId; // From auth middleware
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "CURRENT_AND_NEW_PASSWORD_REQUIRED",
        });
      }

      const result = await this.service.changePassword(userId, currentPassword, newPassword);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }
}