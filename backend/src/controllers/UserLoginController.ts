import { Request, Response } from "express";
import UserLoginService from "../service/UserLoginService";
import { AuthRequest } from "../middleware/auth.middlware";

export default class UserLoginController {
  constructor(private service: UserLoginService) {}

  // POST /api/login
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await this.service.login(email, password);

      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({
        error: error.message,
      });
    }
  }

  // GET /api/me (protégé par JWT)
  async me(req: AuthRequest, res: Response) {
    return res.json({
      user: req.user,
    });
  }
}
