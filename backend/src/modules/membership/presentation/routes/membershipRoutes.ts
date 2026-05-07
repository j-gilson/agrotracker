import { Router } from "express";
import { LocalUserRepository } from "../../../auth/infrastructure/repositories/LocalUserRepository";
import { LocalSessionRepository } from "../../../auth/infrastructure/repositories/LocalSessionRepository";
import { GetCurrentUser } from "../../../auth/application/usecases/GetCurrentUser";
import { makeEnsureAuthenticated } from "../../../auth/presentation/middlewares/makeEnsureAuthenticated";
import { LocalFazendaMemberRepository } from "../../infrastructure/local/LocalFazendaMemberRepository";
import { LocalInviteRepository } from "../../infrastructure/local/LocalInviteRepository";
import { makeEnsureFazendaMember } from "../middlewares/makeEnsureFazendaMember";
import { makeEnsureRole } from "../middlewares/makeEnsureRole";
import { MembershipController } from "../controllers/MembershipController";
import { AddMemberToFazenda } from "../../application/usecases/AddMemberToFazenda";
import { InviteUserToFazenda } from "../../application/usecases/InviteUserToFazenda";
import { AcceptInvite } from "../../application/usecases/AcceptInvite";
import { GetMembersByFazenda } from "../../application/usecases/GetMembersByFazenda";
import { ChangeMemberRole } from "../../application/usecases/ChangeMemberRole";
import { ToggleMemberActive } from "../../application/usecases/ToggleMemberActive";
import { RemoveMember } from "../../application/usecases/RemoveMember";
import { FazendaRepository } from "../../../fazenda/infra/repositories/FazendaRepository";
import { LocalAuditRepository } from "../../../audit/infrastructure/LocalAuditRepository";
import { CreateAuditLog } from "../../../audit/application/usecases/CreateAuditLog";

const membershipRoutes = Router();

const userRepository = new LocalUserRepository();
const sessionRepository = new LocalSessionRepository();
const getCurrentUser = new GetCurrentUser(sessionRepository, userRepository);
const ensureAuthenticated = makeEnsureAuthenticated(getCurrentUser);

const memberRepository = new LocalFazendaMemberRepository();
const inviteRepository = new LocalInviteRepository();
const fazendaRepository = new FazendaRepository();
const auditRepository = new LocalAuditRepository();
const createAuditLog = new CreateAuditLog(auditRepository);

const addMemberToFazenda = new AddMemberToFazenda(memberRepository);
const inviteUserToFazenda = new InviteUserToFazenda(memberRepository, inviteRepository, userRepository);
const acceptInvite = new AcceptInvite(inviteRepository, userRepository, addMemberToFazenda, memberRepository);
const getMembersByFazenda = new GetMembersByFazenda(memberRepository, userRepository);
const changeMemberRole = new ChangeMemberRole(memberRepository);
const toggleMemberActive = new ToggleMemberActive(memberRepository);
const removeMember = new RemoveMember(memberRepository);

const controller = new MembershipController(
  inviteUserToFazenda,
  acceptInvite,
  getMembersByFazenda,
  changeMemberRole,
  toggleMemberActive,
  removeMember,
  fazendaRepository,
  createAuditLog
);

const ensureFazendaMemberFromParams = makeEnsureFazendaMember(memberRepository, (req) => String(req.params.id ?? ""));
const ensureAdmin = makeEnsureRole(["ADMIN"]);

membershipRoutes.get(
  "/fazendas/:id/members/me",
  ensureAuthenticated,
  ensureFazendaMemberFromParams,
  (req, res) => {
    const member = res.locals.currentMember as { id: string; fazendaId: string; userId: string; role: string; active: boolean; createdAt: Date };
    return res.status(200).json({
      success: true,
      member: {
        id: member.id,
        fazendaId: member.fazendaId,
        userId: member.userId,
        role: member.role,
        active: member.active,
        createdAt: member.createdAt.toISOString(),
      },
    });
  }
);

membershipRoutes.post("/fazendas/:id/invite", ensureAuthenticated, ensureFazendaMemberFromParams, ensureAdmin, (req, res) =>
  controller.invite(req, res)
);
membershipRoutes.get("/fazendas/:id/members", ensureAuthenticated, ensureFazendaMemberFromParams, ensureAdmin, (req, res) =>
  controller.listMembers(req, res)
);
membershipRoutes.patch(
  "/fazendas/:id/members/:memberId/role",
  ensureAuthenticated,
  ensureFazendaMemberFromParams,
  ensureAdmin,
  (req, res) => controller.changeRole(req, res)
);
membershipRoutes.patch(
  "/fazendas/:id/members/:memberId/toggle",
  ensureAuthenticated,
  ensureFazendaMemberFromParams,
  ensureAdmin,
  (req, res) => controller.toggle(req, res)
);
membershipRoutes.delete(
  "/fazendas/:id/members/:memberId",
  ensureAuthenticated,
  ensureFazendaMemberFromParams,
  ensureAdmin,
  (req, res) => controller.remove(req, res)
);

membershipRoutes.post("/invites/accept", ensureAuthenticated, (req, res) => controller.accept(req, res));

export { membershipRoutes };
