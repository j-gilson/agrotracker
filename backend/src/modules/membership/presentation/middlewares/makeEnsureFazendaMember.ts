import { Request, Response, NextFunction } from "express";
import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";

export const makeEnsureFazendaMember = (
  memberRepository: IFazendaMemberRepository,
  getFazendaId: (req: Request) => string
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const userId = (res.locals.currentUser as { id: string } | undefined)?.id;
    const fazendaId = getFazendaId(req)?.trim();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Nao autenticado." });
    }

    if (!fazendaId) {
      return res.status(400).json({ success: false, message: "Fazenda invalida." });
    }

    const member = await memberRepository.findByFazendaAndUser(fazendaId, userId);
    if (!member) {
      return res.status(403).json({ success: false, message: "Voce nao pertence a esta fazenda." });
    }

    if (!member.active) {
      return res.status(403).json({ success: false, message: "Seu acesso a fazenda esta desativado." });
    }

    res.locals.currentMember = member;
    return next();
  };
};
