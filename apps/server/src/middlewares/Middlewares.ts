import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    console.log("userMiddleware called");
    console.log("All cookies:", req.cookies);

    // Look specifically for YOUR token cookie (not authjs)
    const token = req.cookies.token || req.cookies["authjs.session-token"];

    if (!token) {
      console.log('No "token" cookie found');
      res.status(401).json({
        message:
          "Authentication failed. Please log in with the custom login system.",
        debug: {
          cookiesReceived: Object.keys(req.cookies),
          expectedCookie: "token",
        },
      });
      return;
    }

    console.log("Token found:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, config.JWT_PASSWORD) as DecodedToken;
    console.log("Token verified, user ID:", decoded.id);

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log("JWT verification failed:", error);
    res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
      error: error instanceof Error ? error.message : error,
    });
  }
};
