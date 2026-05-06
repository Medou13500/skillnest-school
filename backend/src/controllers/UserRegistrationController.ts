import { Request, Response } from "express";
import UserRegistrationService from "../service/UserRegistrationService";

export default class UserRegistrationController {
  constructor(private service: UserRegistrationService) {}

  // POST /api/register
  async register(req: Request, res: Response) {
    try {
      const { email, password, role, firstName, lastName, studentEmail } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "EMAIL_AND_PASSWORD_REQUIRED",
        });
      }

      const user = await this.service.register(
        email,
        password,
        role,
        firstName,
        lastName,
        studentEmail
      );

      return res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      if (error.message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({
          error: error.message,
        });
      }

      if (error.message === "EMAIL_AND_PASSWORD_REQUIRED") {
        return res.status(400).json({
          error: error.message,
        });
      }

      if (error.message === "STUDENT_NOT_FOUND") {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  }
}
