import { Request, Response } from "express";
import UserRegistrationService from "../service/UserRegistrationService";

export default class UserRegistrationController {
  constructor(private service: UserRegistrationService) {}

  // POST /api/register
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.service.register(email, password);

      return res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}
