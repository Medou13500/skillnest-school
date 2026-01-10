import { Request, Response } from "express";
import RefreshTokenService from "../service/RefreshTokenService";

export default class RefreshTokenController {
  constructor(private service: RefreshTokenService) {}

  async refresh(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(400).json({
          error: "REFRESH_TOKEN_REQUIRED",
        });
      }

      const tokens = await this.service.refresh(refresh_token);
      return res.json(tokens);
    } catch (err: any) {
      return res.status(401).json({
        error: err.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(400).json({
          error: "REFRESH_TOKEN_REQUIRED",
        });
      }

      await this.service.logout(refresh_token);
      return res.json({ message: "Logged out" });
    } catch {
      return res.status(500).json({
        error: "LOGOUT_FAILED",
      });
    }
  }
}
