import { Request, Response } from "express";
import UpdateProfileService from "../service/UpdateProfileService";

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

  async setNewUserStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { isNewUser } = req.body;

      if (typeof isNewUser !== 'boolean') {
        return res.status(400).json({
          error: 'IS_NEW_USER_REQUIRED',
        });
      }

      const result = await this.service.setUserNewStatus(userId, isNewUser);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }

  async markUserAsNew(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: 'EMAIL_REQUIRED',
        });
      }

      const result = await this.service.setUserNewStatusByEmail(email, true);
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