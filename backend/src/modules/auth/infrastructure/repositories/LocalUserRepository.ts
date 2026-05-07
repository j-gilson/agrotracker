import { promises as fs } from "fs";
import path from "path";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

type StoredUser = {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  ativo: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
};

const USERS_FILE = path.resolve(process.cwd(), "data", "users.json");

const ensureUsersFile = async (): Promise<void> => {
  const dir = path.dirname(USERS_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredUser): User =>
  new User({
    id: stored.id,
    nome: stored.nome,
    email: stored.email,
    passwordHash: stored.passwordHash,
    ativo: stored.ativo,
    roles: stored.roles,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  });

const toStored = (user: User): StoredUser => ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  passwordHash: user.passwordHash,
  ativo: user.ativo,
  roles: user.roles,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

export class LocalUserRepository implements IUserRepository {
  private async readAll(): Promise<StoredUser[]> {
    await ensureUsersFile();
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    const data = JSON.parse(raw) as unknown;

    if (!Array.isArray(data)) return [];
    return data as StoredUser[];
  }

  private async writeAll(users: StoredUser[]): Promise<void> {
    await ensureUsersFile();
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  }

  async findById(id: string): Promise<User | undefined> {
    const users = await this.readAll();
    const found = users.find((u) => u.id === id);
    return found ? toDomain(found) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    const users = await this.readAll();
    const found = users.find((u) => u.email.toLowerCase() === normalized);
    return found ? toDomain(found) : undefined;
  }

  async save(user: User): Promise<User> {
    const users = await this.readAll();
    users.push(toStored(user));
    await this.writeAll(users);
    return user;
  }

  async update(user: User): Promise<User> {
    const users = await this.readAll();
    const idx = users.findIndex((u) => u.id === user.id);

    if (idx >= 0) {
      users[idx] = toStored(user);
      await this.writeAll(users);
    }

    return user;
  }
}
