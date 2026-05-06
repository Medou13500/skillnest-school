import { Request, Response } from "express";
import UpdateProfileService from "../service/UpdateProfileService";
import { authMiddleware, AuthRequest } from "../middleware/auth.middlware";

export default class UpdateProfileController {
  constructor(private service: UpdateProfileService) {}

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { firstName, lastName, email } = req.body;

      if (!firstName && !lastName && !email) {
        return res.status(400).json({
          error: "AT_LEAST_ONE_FIELD_REQUIRED",
        });
      }

      const result = await this.service.updateProfile(
        userId,
        firstName || "",
        lastName || "",
        email || ""
      );

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      const result = await this.service.getProfile(userId);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }
}