import argon2 from "argon2";
import UserLoginRepository from "../infrastructure/UserLoginRepository";

export default class UserLoginService {
  constructor(private repository: UserLoginRepository) {}

  async login(email: string, password: string) {
    // 1. récupérer l'utilisateur
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // 2. comparer le mot de passe (ARGON2)
    const isPasswordValid = await argon2.verify(
      user.password_hash,
      password
    );

    if (!isPasswordValid) {
      throw new Error("INVALID_PASSWORD");
    }

    // 3. retour clean (jamais le hash)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
