import { Request, Response } from "express";
import AskResetPasswordService from "../service/askResetPasswordService";

export default class AskResetPasswordController {
  constructor(private service: AskResetPasswordService) {}

  async AskResetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          error: "RESET_PASSWORD_REQUIRED",
        });
      }
      const resetPassword = await this.service.AskresetPassword(email);
      return res.json(resetPassword);
    } catch (err: any) {
      return res.status(401).json({
        error: err.message,
      });
    }
  }
}
