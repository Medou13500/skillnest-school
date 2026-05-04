// src/utils/jwt.ts

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export interface JwtPayload {
  userId: number;
  role: string;
}

export default class JwtService {
  static generate(payload: JwtPayload) {
    return jwt.sign(payload, SECRET, { expiresIn: "15m" });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, SECRET) as JwtPayload;
  }
}