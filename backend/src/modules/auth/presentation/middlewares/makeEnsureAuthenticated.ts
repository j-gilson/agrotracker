import { Request, Response, NextFunction } from "express";
import { GetCurrentUser } from "../../application/usecases/GetCurrentUser";
import { AuthError } from "../../application/errors/AuthError";

export const makeEnsureAuthenticated = (getCurrentUser: GetCurrentUser) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ success: false, message: "Token ausente." });
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token?.trim()) {
      return res.status(401).json({ success: false, message: "Token invalido." });
    }

    try {
      const user = await getCurrentUser.execute(token.trim());
      res.locals.token = token.trim();
      res.locals.currentUser = user;
      return next();
    } catch (error: unknown) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(401).json({ success: false, message: "Sessao invalida. Faca login novamente." });
    }
  };
};

