import { Request, Response } from "express";
import UserLoginService from "../service/UserLoginService";

export default class UserLoginController {
  constructor(private readonly service: UserLoginService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    try {
      const user = await this.service.login(email, password);
      res.json(user);
    } catch (err: any) {
      if (err.message === "USER_NOT_FOUND") {
        return res.status(401).json({ message: "User not found" });
      }

      if (err.message === "INVALID_PASSWORD") {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.status(500).json({ message: "Internal error" });
    }
  }
}
