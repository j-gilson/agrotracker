import { Invite } from "../domain/entities/Invite";

export interface IInviteRepository {
  findById(id: string): Promise<Invite | undefined>;
  findByToken(token: string): Promise<Invite | undefined>;
  findPendingByFazendaAndEmail(fazendaId: string, email: string): Promise<Invite | undefined>;
  save(invite: Invite): Promise<Invite>;
  update(invite: Invite): Promise<Invite>;
}
