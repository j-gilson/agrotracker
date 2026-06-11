import { readFile, writeFile } from "fs/promises";
import path from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Event } from "../../domain/entities/Event";
import { LocalEventRepository } from "./LocalEventRepository";

const eventsFile = path.resolve(process.cwd(), "data", "events.json");
let originalContent = "";

describe("LocalEventRepository", () => {
  beforeAll(async () => {
    originalContent = await readFile(eventsFile, "utf-8");
    await writeFile(eventsFile, "[]", "utf-8");
  });

  afterAll(async () => {
    await writeFile(eventsFile, originalContent, "utf-8");
  });

  it("persiste o tipo oficial sem transformacao", async () => {
    const repository = new LocalEventRepository();
    const event = new Event({
      id: "event-1",
      animalId: "animal-1",
      fazendaId: "fazenda-1",
      type: "MEDICACAO",
      description: "Aplicacao de medicamento",
      date: new Date("2026-06-11T12:00:00.000Z"),
      createdBy: "user-1",
      createdAt: new Date("2026-06-11T12:00:00.000Z"),
    });

    await repository.save(event);

    const stored = JSON.parse(await readFile(eventsFile, "utf-8")) as Array<{
      type: string;
    }>;
    expect(stored).toHaveLength(1);
    expect(stored[0].type).toBe("MEDICACAO");
  });
});
