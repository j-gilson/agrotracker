import { Request, Response, NextFunction } from "express";

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({
      success: false,
      message: "Token ausente.",
    });
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token?.trim()) {
    return res.status(401).json({
      success: false,
      message: "Token invalido.",
    });
  }

  res.locals.token = token.trim();
  return next();
};
