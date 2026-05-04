// src/middleware/admin.middleware.ts

import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middlware";

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "FORBIDDEN" });
  }

  next();
};