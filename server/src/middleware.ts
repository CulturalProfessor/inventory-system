import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Extend the Request interface to include the user object
interface UserRequest extends Request {
  user?: unknown; // Use `any` or a more specific type if you know the structure of the `user` object
}

export const authenticateToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;  // Ensure function returns here
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;  // Ensure function returns here
    }

    req.user = user;
    next();
  });
};
