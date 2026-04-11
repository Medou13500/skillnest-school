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
    //  Récupérer l'utilisateur
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    //  Vérifier le mot de passe
    const passwordValid = await argon2.verify(
      user.password_hash,
      password
    );

    if (!passwordValid) {
      throw new Error("INVALID_PASSWORD");
    }

    //  Générer l’ACCESS TOKEN (court)
    const accessToken = JwtService.generate({
      userId: user.id,
      role: user.role,
    });

    //  Générer le REFRESH TOKEN (long)
    const refreshToken =
      await this.refreshTokenService.create(user.id);

    //  Retourner les deux
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
