import { Request, Response } from "express";
import UserRegistrationService from "../service/UserRegistrationService";

class UserRegistrationController {
  constructor(private service: UserRegistrationService) {}

  // POST /api/register
  async register(req: Request, res: Response) {
    try {
      // données HTTP
      const { email, password } = req.body;

      // appel métier
      const user = await this.service.register(email, password);

      // réponse OK
      return res.status(201).json(user);
    } catch (error: any) {
      // erreur métier
      return res.status(400).json({ message: error.message });
    }
  }
}

export default UserRegistrationController;