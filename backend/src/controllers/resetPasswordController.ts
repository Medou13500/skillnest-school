import { Request, Response } from "express";
import ResetPasswordService from "../service/resetPasswordService";

export default class ResetPasswordController {
  constructor(private service: ResetPasswordService) {}

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          error: "TOKEN_AND_PASSWORD_REQUIRED",
        });
      }

      const result = await this.service.resetPassword(token, newPassword);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  }
}
