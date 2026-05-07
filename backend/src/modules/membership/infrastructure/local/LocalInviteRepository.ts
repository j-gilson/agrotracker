import { promises as fs } from "fs";
import path from "path";
import { IInviteRepository } from "../../contracts/IInviteRepository";
import { Invite } from "../../domain/entities/Invite";
import { InviteStatus, MemberRole } from "../../domain/types";

type StoredInvite = {
  id: string;
  fazendaId: string;
  email: string;
  role: MemberRole;
  token: string;
  status: InviteStatus;
  createdAt: string;
};

const INVITES_FILE = path.resolve(process.cwd(), "data", "invites.json");

const ensureFile = async (): Promise<void> => {
  const dir = path.dirname(INVITES_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(INVITES_FILE);
  } catch {
    await fs.writeFile(INVITES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredInvite): Invite =>
  new Invite({
    id: stored.id,
    fazendaId: stored.fazendaId,
    email: stored.email,
    role: stored.role,
    token: stored.token,
    status: stored.status,
    createdAt: new Date(stored.createdAt),
  });

const toStored = (invite: Invite): StoredInvite => ({
  id: invite.id,
  fazendaId: invite.fazendaId,
  email: invite.email,
  role: invite.role,
  token: invite.token,
  status: invite.status,
  createdAt: invite.createdAt.toISOString(),
});

export class LocalInviteRepository implements IInviteRepository {
  private async readAll(): Promise<StoredInvite[]> {
    await ensureFile();
    const raw = await fs.readFile(INVITES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredInvite[];
  }

  private async writeAll(invites: StoredInvite[]): Promise<void> {
    await ensureFile();
    await fs.writeFile(INVITES_FILE, JSON.stringify(invites, null, 2), "utf-8");
  }

  async findById(id: string): Promise<Invite | undefined> {
    const invites = await this.readAll();
    const found = invites.find((i) => i.id === id);
    return found ? toDomain(found) : undefined;
  }

  async findByToken(token: string): Promise<Invite | undefined> {
    const invites = await this.readAll();
    const found = invites.find((i) => i.token === token);
    return found ? toDomain(found) : undefined;
  }

  async findPendingByFazendaAndEmail(fazendaId: string, email: string): Promise<Invite | undefined> {
    const normalized = email.trim().toLowerCase();
    const invites = await this.readAll();
    const found = invites.find(
      (i) => i.fazendaId === fazendaId && i.email.toLowerCase() === normalized && i.status === "PENDING"
    );
    return found ? toDomain(found) : undefined;
  }

  async save(invite: Invite): Promise<Invite> {
    const invites = await this.readAll();
    invites.push(toStored(invite));
    await this.writeAll(invites);
    return invite;
  }

  async update(invite: Invite): Promise<Invite> {
    const invites = await this.readAll();
    const idx = invites.findIndex((i) => i.id === invite.id);
    if (idx >= 0) {
      invites[idx] = toStored(invite);
      await this.writeAll(invites);
    }
    return invite;
  }
}

