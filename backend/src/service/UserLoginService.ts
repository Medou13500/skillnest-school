// src/service/UserLoginService.ts

import argon2 from "argon2";
import UserLoginRepository from "../infrastructure/UserLoginRepository";
import RefreshTokenService from "./RefreshTokenService";
import JwtService from "../utils/jwt";

export default class UserLoginService {
  constructor(
    private userRepository: UserLoginRepository,
    private refreshTokenService: RefreshTokenService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error("USER_NOT_FOUND");

    const isValid = await argon2.verify(user.password_hash, password);

    if (!isValid) throw new Error("INVALID_PASSWORD");

    const accessToken = JwtService.generate({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = await this.refreshTokenService.create(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_new_user: user.is_new_user === true
      },
    };
  }
}