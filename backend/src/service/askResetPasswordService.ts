import AskResetPasswordRepository from "../infrastructure/AskResetPasswordRepository";
import UserRepository from "../infrastructure/UserRepository";
import EmailService from "./emailService";
import { randomUUID } from "node:crypto";

export default class AskResetPasswordService {
  constructor(
    private askResetPasswordRepository: AskResetPasswordRepository,
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async AskresetPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      const token = randomUUID();

      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);

      await this.askResetPasswordRepository.save(
        user.id,
        token,
        expiration
      );

      await this.emailService.sendResetPassword(email, token);
    }

    // réponse toujours identique (sécurité)
    return {
      message: "If account exists, reset email sent",
    };
  }
}