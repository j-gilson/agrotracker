import { promises as fs } from "fs";
import path from "path";
import { Event } from "../../domain/entities/Event";
import { IEventRepository } from "../../domain/contracts/IEventRepository";
import { EventType, normalizeEventType } from "../../domain/types";

type StoredEvent = {
  id: string;
  animalId: string;
  fazendaId: string;
  type: EventType;
  description: string;
  date: string;
  createdBy: string;
  createdAt: string;
};

const EVENTS_FILE = path.resolve(process.cwd(), "data", "events.json");

const ensureFile = async (): Promise<void> => {
  const dir = path.dirname(EVENTS_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(EVENTS_FILE);
  } catch {
    await fs.writeFile(EVENTS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
};

const toDomain = (stored: StoredEvent): Event => {
  const type = normalizeEventType(stored.type);
  if (!type) throw new Error(`Tipo de evento persistido invalido: ${String(stored.type)}`);

  return new Event({
    id: stored.id,
    animalId: stored.animalId,
    fazendaId: stored.fazendaId,
    type,
    description: stored.description,
    date: new Date(stored.date),
    createdBy: stored.createdBy,
    createdAt: new Date(stored.createdAt),
  });
};

const toStored = (event: Event): StoredEvent => ({
  id: event.id,
  animalId: event.animalId,
  fazendaId: event.fazendaId,
  type: event.type,
  description: event.description,
  date: event.date.toISOString(),
  createdBy: event.createdBy,
  createdAt: event.createdAt.toISOString(),
});

export class LocalEventRepository implements IEventRepository {
  private async readAll(): Promise<StoredEvent[]> {
    await ensureFile();
    const raw = await fs.readFile(EVENTS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredEvent[];
  }

  private async writeAll(items: StoredEvent[]): Promise<void> {
    await ensureFile();
    await fs.writeFile(EVENTS_FILE, JSON.stringify(items, null, 2), "utf-8");
  }

  async save(event: Event): Promise<Event> {
    const all = await this.readAll();
    all.push(toStored(event));
    await this.writeAll(all);
    return event;
  }

  async findByAnimalId(animalId: string): Promise<Event[]> {
    const all = await this.readAll();
    return all.filter((e) => e.animalId === animalId).map(toDomain);
  }

  async findByFazendaId(fazendaId: string): Promise<Event[]> {
    const all = await this.readAll();
    return all.filter((e) => e.fazendaId === fazendaId).map(toDomain);
  }
}
