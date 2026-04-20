// src/controllers/UserLoginController.ts

import { Request, Response } from "express";
import UserLoginService from "../service/UserLoginService";
import { AuthRequest } from "../middleware/auth.middlware";

export default class UserLoginController {
  constructor(private loginService: UserLoginService) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "EMAIL_AND_PASSWORD_REQUIRED",
        });
      }

      const result = await this.loginService.login(email, password);

      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      return res.json({
        access_token: result.accessToken,
        user: result.user,
      });

    } catch (error: any) {
      return res.status(401).json({ error: error.message });
      
    }
    
  }

  async me(req: AuthRequest, res: Response) {
    return res.json({
      user: req.user,
    });
  }
}

