import argon2 from "argon2";
import UserRegistrationRepository from "../infrastructure/UserRegistrationRepository";

class UserRegistrationService {
  private repository: UserRegistrationRepository;

  constructor(repository: UserRegistrationRepository) {
    this.repository = repository;
  }

  async register(email: string, password: string) {
    // règle métier : données obligatoires
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // règle métier : vérifier si l’utilisateur existe déjà
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // règle métier : hash du mot de passe
    const passwordHash = await argon2.hash(password);

    // persistance
    const user = await this.repository.createUser(
      email,
      passwordHash,
      "USER"
    );

   // retour clean (jamais de hash)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }
}

export default UserRegistrationService;
