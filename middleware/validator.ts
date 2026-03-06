import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error/appError.js";

export const validateProductMiddleware = [
  body("productName")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .toFloat()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),

  (req: Request, res: Response, next: NextFunction) => {
    const err: any = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json({
        message: err.errors[0]?.msg || "validation failed",
        errors: err.array(),
      });
    }

    next();
  },
];
