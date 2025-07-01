import jwt from "jsonwebtoken";
import { IUserPayload, RefreshTokenPayload } from "global";

export function generateAccessToken(user: IUserPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment.");
  }
  return jwt.sign(user, secret, { expiresIn: "1h" });
}

export function generateRefreshToken(user: RefreshTokenPayload): string {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in the environment.");
  }
  return jwt.sign(user, refreshSecret, { expiresIn: "7d" });
}
