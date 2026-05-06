// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import JwtService, { JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "NO_AUTH_HEADER" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "INVALID_AUTH_FORMAT" });
  }

  try {
    const decoded = JwtService.verify(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
  }
}