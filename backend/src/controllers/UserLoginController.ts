import { Request, Response } from "express";
import UserLoginService from "../service/UserLoginService";
import { AuthRequest } from "../middleware/auth.middlware";

export default class UserLoginController {
  constructor(private loginService: UserLoginService) {}

  // POST /api/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "EMAIL_AND_PASSWORD_REQUIRED",
        });
      }

      const { accessToken, refreshToken, user } =
        await this.loginService.login(email, password);

      // COOKIE refresh token
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        user
      });

    } catch (error: any) {
      return res.status(401).json({
        error: error.message
      });
    }
  }

  // GET /api/me
  async me(req: AuthRequest, res: Response) {
    return res.json({
      user: req.user
    });
  }
}
