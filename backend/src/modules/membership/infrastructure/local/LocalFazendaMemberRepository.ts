import { promises as fs } from "fs";
import path from "path";
import { IFazendaMemberRepository } from "../../contracts/IFazendaMemberRepository";
import { FazendaMember } from "../../domain/entities/FazendaMember";
import { MemberRole } from "../../domain/types";

type StoredMember = {
  id: string;
  fazendaId: string;
  userId: string;
  role: MemberRole;
  active: boolean;
  createdAt: string;
};

const MEMBERS_FILE = path.resolve(process.cwd(), "data", "memberships.json");

const ensureFile = async (): Promise<void> => {
  const dir = path.dirname(MEMBERS_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(MEMBERS_FILE);
  } catch {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredMember): FazendaMember =>
  new FazendaMember({
    id: stored.id,
    fazendaId: stored.fazendaId,
    userId: stored.userId,
    role: stored.role,
    active: stored.active,
    createdAt: new Date(stored.createdAt),
  });

const toStored = (member: FazendaMember): StoredMember => ({
  id: member.id,
  fazendaId: member.fazendaId,
  userId: member.userId,
  role: member.role,
  active: member.active,
  createdAt: member.createdAt.toISOString(),
});

export class LocalFazendaMemberRepository implements IFazendaMemberRepository {
  private async readAll(): Promise<StoredMember[]> {
    await ensureFile();
    const raw = await fs.readFile(MEMBERS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredMember[];
  }

  private async writeAll(members: StoredMember[]): Promise<void> {
    await ensureFile();
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2), "utf-8");
  }

  async findById(id: string): Promise<FazendaMember | undefined> {
    const members = await this.readAll();
    const found = members.find((m) => m.id === id);
    return found ? toDomain(found) : undefined;
  }

  async findByFazendaAndUser(fazendaId: string, userId: string): Promise<FazendaMember | undefined> {
    const members = await this.readAll();
    const found = members.find((m) => m.fazendaId === fazendaId && m.userId === userId);
    return found ? toDomain(found) : undefined;
  }

  async findAllByFazenda(fazendaId: string): Promise<FazendaMember[]> {
    const members = await this.readAll();
    return members.filter((m) => m.fazendaId === fazendaId).map(toDomain);
  }

  async findAllByUser(userId: string): Promise<FazendaMember[]> {
    const members = await this.readAll();
    return members.filter((m) => m.userId === userId).map(toDomain);
  }

  async save(member: FazendaMember): Promise<FazendaMember> {
    const members = await this.readAll();
    members.push(toStored(member));
    await this.writeAll(members);
    return member;
  }

  async update(member: FazendaMember): Promise<FazendaMember> {
    const members = await this.readAll();
    const idx = members.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      members[idx] = toStored(member);
      await this.writeAll(members);
    }
    return member;
  }

  async deleteById(id: string): Promise<void> {
    const members = await this.readAll();
    const filtered = members.filter((m) => m.id !== id);
    await this.writeAll(filtered);
  }
}
