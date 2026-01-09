import jwt from "jsonwebtoken";

/**
 * Payload minimal que TON backend accepte
 */
export interface JwtPayload {
  userId: number;
  role: string;
}

export default class JwtService {
  private static readonly secret = process.env.JWT_SECRET as string;
  private static readonly expiresIn = "1h";

  static generate(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
