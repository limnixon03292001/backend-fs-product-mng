import type { Request, Response, NextFunction } from "express";
import { AppError } from "./appError.js";

 

export function errorHandler(
  err: Error | AppError ,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Something went wrong",
    error: err,
  });
}
