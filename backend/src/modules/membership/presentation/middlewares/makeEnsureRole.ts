import { Request, Response, NextFunction } from "express";
import { MemberRole } from "../../domain/types";

export const makeEnsureRole = (roles: MemberRole[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const member = res.locals.currentMember as { role: MemberRole } | undefined;
    if (!member) {
      return res.status(403).json({ success: false, message: "Acesso negado." });
    }

    if (!roles.includes(member.role)) {
      return res.status(403).json({ success: false, message: "Acesso restrito." });
    }

    return next();
  };
};
