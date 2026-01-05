import argon2 from "argon2";
import UserLoginRepository from "../infrastructure/UserLoginRepository";

class UserLoginService {
  constructor(private readonly repository: UserLoginRepository) {}

  async login(email: string, password: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await argon2.verify(user.password_hash, password);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

export default UserLoginService;
