import jwt from "jsonwebtoken";
import { AppError } from "./error/appError.js";
import type { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export default function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  const ACCESS_SECRET = process.env.ACCESS_SECRET || "ACCESS_SECRET";

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token!, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    return next(new AppError(`Invalid token`, 403));
  }
}
