import argon2 from "argon2";
import UserLoginRepository from "../infrastructure/UserLoginRepository";
import JwtService from "../utils/jwt";

export default class UserLoginService {
  constructor(private repository: UserLoginRepository) {}

  async login(email: string, password: string) {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const passwordValid = await argon2.verify(
      user.password_hash,
      password
    );

    if (!passwordValid) {
      throw new Error("INVALID_PASSWORD");
    }

    const accessToken = JwtService.generate({
      userId: user.id,
      role: user.role,
    });

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
