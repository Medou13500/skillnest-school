import argon2 from "argon2";
import UserRepository from "../infrastructure/UserRepository";

export default class ChangePasswordService {
  constructor(private userRepository: UserRepository) {}

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    // Vérifier que le nouveau mot de passe est assez long
    if (newPassword.length < 8) {
      throw new Error("PASSWORD_TOO_SHORT");
    }

    // Récupérer l'utilisateur
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Vérifier l'ancien mot de passe
    const isValid = await argon2.verify(user.password_hash, currentPassword);
    if (!isValid) {
      throw new Error("CURRENT_PASSWORD_INVALID");
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await argon2.hash(newPassword);

    // Mettre à jour le mot de passe
    await this.userRepository.updatePassword(userId, passwordHash);

    return {
      message: "Password successfully updated",
    };
  }
}