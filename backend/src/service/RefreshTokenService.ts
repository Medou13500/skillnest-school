import crypto from "crypto";
import RefreshTokenRepository from "../infrastructure/RefreshTokenRepository";
import JwtService from "../utils/jwt";

export default class RefreshTokenService {
  private REFRESH_TTL_DAYS = 7;

  constructor(private repo: RefreshTokenRepository) {}

  private generateToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  private hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private getExpirationDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + this.REFRESH_TTL_DAYS);
    return date;
  }

  async create(userId: number): Promise<string> {
    const refreshToken = this.generateToken();
    const tokenHash = this.hash(refreshToken);

    await this.repo.save(
      userId,
      tokenHash,
      this.getExpirationDate()
    );

    return refreshToken;
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hash(refreshToken);

    const stored = await this.repo.findValid(tokenHash);
    if (!stored) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    //  ROTATION : on supprime l'ancien
    await this.repo.deleteByHash(tokenHash);

    //  Nouveau access token
    const accessToken = JwtService.generate({
      userId: stored.user_id,
      role: "USER",
    });

    // Nouveau refresh token
    const newRefreshToken = await this.create(stored.user_id);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hash(refreshToken);
    await this.repo.deleteByHash(tokenHash);
  }
}
