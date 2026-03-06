import type { NextFunction, Request, Response } from "express";
import { db } from "../db.js";
import { refreshTokens, userTable } from "../model/schema.js";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "ACCESS_SECRET";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "REFRESH_SECRET";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES_DAYS = 7;

// Generate tokens
function generateAccessToken(user: { id: number; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}
function generateRefreshToken(user: { id: number }) {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db
      .insert(userTable)
      .values({ email, password: hashedPassword })
      .returning();

    res.status(201).json(user[0]);
  } catch (err) {
    next(new AppError("Email already registered", 400));
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;

  try {
    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (user.length === 0) {
      return next(new AppError(`Invalid Credentials`, 401));
    }

    const valid = await bcrypt.compare(password, user[0]?.password!);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({
      id: user[0]?.id!,
      email: user[0]?.email!,
    });

    const refreshToken = generateRefreshToken({
      id: user[0]?.id!,
    });

    const hashedToken = hashToken(refreshToken);

    await db.insert(refreshTokens).values({
      userId: user[0]?.id!,
      token: hashedToken,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 86400000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({
      accessToken: accessToken,
      user: { id: user[0]?.id, email: user[0]?.email },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.refreshToken;

  console.log("HIT", token);
  if (!token) {
    return next(new AppError(`Unauthorized`, 401));
  }

  let payload: { id: number; email: string };

  try {
    payload = jwt.verify(token, REFRESH_SECRET) as {
      id: number;
      email: string;
    };
  } catch {
    return next(new AppError(`Invalid refresh token`, 401));
  }

  try {
    const hashed = hashToken(token);

    //check token existence in the db
    const stored = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, hashed));

    if (stored.length === 0) {
      return next(new AppError(`Token revoked`, 403));
    }

    //check if token expired
    if (new Date(stored[0]?.expiresAt!) < new Date()) {
      await db
        .delete(refreshTokens)
        .where(eq(refreshTokens.id, stored[0]?.id!));
      return next(new AppError(`Token Expired`, 403));
    }

    //rotate refresh token

    await db.delete(refreshTokens).where(eq(refreshTokens.id, stored[0]?.id!));

    const newRefreshToken = generateRefreshToken({
      id: payload.id,
    });

    const newHashed = hashToken(newRefreshToken);

    await db.insert(refreshTokens).values({
      userId: payload.id,
      token: newHashed,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 86400000),
    });

    const newAccessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      const hashed = hashToken(token);
      await db.delete(refreshTokens).where(eq(refreshTokens.token, hashed));
    }

    res.clearCookie("refreshToken", {
      path: "/",
    });

    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}
