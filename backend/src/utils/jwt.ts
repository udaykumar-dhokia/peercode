import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET;

const DEFAULT_EXPIRES_IN = "1d";

export const signToken = (
  payload: object,
  expiresIn: string = DEFAULT_EXPIRES_IN
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
