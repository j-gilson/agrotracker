import { promises as fs } from "fs";
import path from "path";
import { ISessionRepository, Session } from "../../domain/repositories/ISessionRepository";

type StoredSession = {
  token: string;
  userId: string;
  createdAt: string;
};

const SESSIONS_FILE = path.resolve(process.cwd(), "data", "sessions.json");

const ensureSessionsFile = async (): Promise<void> => {
  const dir = path.dirname(SESSIONS_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(SESSIONS_FILE);
  } catch {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredSession): Session => ({
  token: stored.token,
  userId: stored.userId,
  createdAt: new Date(stored.createdAt),
});

const toStored = (session: Session): StoredSession => ({
  token: session.token,
  userId: session.userId,
  createdAt: session.createdAt.toISOString(),
});

export class LocalSessionRepository implements ISessionRepository {
  private async readAll(): Promise<StoredSession[]> {
    await ensureSessionsFile();
    const raw = await fs.readFile(SESSIONS_FILE, "utf-8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data as StoredSession[];
  }

  private async writeAll(sessions: StoredSession[]): Promise<void> {
    await ensureSessionsFile();
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  }

  async save(session: Session): Promise<void> {
    const sessions = await this.readAll();
    sessions.push(toStored(session));
    await this.writeAll(sessions);
  }

  async findByToken(token: string): Promise<Session | undefined> {
    const sessions = await this.readAll();
    const found = sessions.find((s) => s.token === token);
    return found ? toDomain(found) : undefined;
  }

  async deleteByToken(token: string): Promise<void> {
    const sessions = await this.readAll();
    const filtered = sessions.filter((s) => s.token !== token);
    await this.writeAll(filtered);
  }
}
