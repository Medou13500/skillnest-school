import argon2 from "argon2";
import ResetPasswordRepository from "../infrastructure/ResetPasswordRepository";
import UserRepository from "../infrastructure/UserRepository";

export default class ResetPasswordService {
  constructor(
    private resetPasswordRepository: ResetPasswordRepository,
    private userRepository: UserRepository,
  ) {}

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new Error("TOKEN_AND_PASSWORD_REQUIRED");
    }

    if (newPassword.length < 8) {
      throw new Error("PASSWORD_TOO_SHORT");
    }

    const verifyToken = await this.resetPasswordRepository.findByToken(token);

    if (!verifyToken) {
      throw new Error("TOKEN_INVALID");
    }

    if (verifyToken.status === true) {
      throw new Error("TOKEN_ALREADY_USED");
    }

    const now = new Date();

    if (!verifyToken.date_expiration) {
      throw new Error("TOKEN_INVALID");
    }

    if (new Date(verifyToken.date_expiration) < now) {
      throw new Error("TOKEN_EXPIRED");
    }

    const user = await this.userRepository.findById(verifyToken.user_id);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const passwordHash = await argon2.hash(newPassword);

    await this.userRepository.updatePassword(user.id, passwordHash);

    await this.resetPasswordRepository.deleteToken(token);

    return {
      message: "Password successfully updated",
    };
  }
}
