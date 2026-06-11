import { readFile, writeFile } from "fs/promises";
import path from "path";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../../app";
import { EVENT_TYPES, EventType } from "../domain/types";

const dataDir = path.resolve(process.cwd(), "data");
const files = {
  users: path.join(dataDir, "users.json"),
  sessions: path.join(dataDir, "sessions.json"),
  memberships: path.join(dataDir, "memberships.json"),
  animals: path.join(dataDir, "animals.json"),
  events: path.join(dataDir, "events.json"),
};

const fazendaId = "11111111-1111-4111-8111-111111111111";
const animalId = "22222222-2222-4222-8222-222222222222";
const adminUserId = "33333333-3333-4333-8333-333333333333";
const employeeUserId = "44444444-4444-4444-8444-444444444444";
const adminToken = "event-admin-token";
const employeeToken = "event-employee-token";

const authorization = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const originals = new Map<string, string>();

const writeJson = async (filePath: string, value: unknown): Promise<void> => {
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
};

const createPayload = (type: string, date = "2026-06-11T12:00:00.000Z") => ({
  animalId,
  fazendaId,
  type,
  description: `Evento ${type}`,
  date,
});

describe("Event API homologation", () => {
  beforeAll(async () => {
    for (const filePath of Object.values(files)) {
      originals.set(filePath, await readFile(filePath, "utf-8"));
    }
  });

  beforeEach(async () => {
    const now = new Date().toISOString();

    await writeJson(files.users, [
      {
        id: adminUserId,
        nome: "Administrador",
        email: "event.admin@agrotracker.local",
        passwordHash: "hash",
        ativo: true,
        roles: ["ADMIN"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: employeeUserId,
        nome: "Funcionario",
        email: "event.employee@agrotracker.local",
        passwordHash: "hash",
        ativo: true,
        roles: ["FUNCIONARIO"],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await writeJson(files.sessions, [
      { token: adminToken, userId: adminUserId, createdAt: now },
      { token: employeeToken, userId: employeeUserId, createdAt: now },
    ]);

    await writeJson(files.memberships, [
      {
        id: "membership-admin",
        fazendaId,
        userId: adminUserId,
        role: "ADMIN",
        active: true,
        createdAt: now,
      },
      {
        id: "membership-employee",
        fazendaId,
        userId: employeeUserId,
        role: "FUNCIONARIO",
        active: true,
        createdAt: now,
      },
    ]);

    await writeJson(files.animals, [
      {
        id: animalId,
        fazendaId,
        codigoIdentificacao: "EVENT-ANIMAL-001",
        nome: "Animal Evento",
        raca: "Nelore",
        peso: 450,
        dataNascimento: "2021-01-01T00:00:00.000Z",
        status: "ATIVO",
        dataCriacao: now,
      },
    ]);

    await writeJson(files.events, []);
  });

  afterAll(async () => {
    for (const [filePath, content] of originals) {
      await writeFile(filePath, content, "utf-8");
    }
  });

  it("aceita e persiste todos os tipos oficiais por ADMIN e FUNCIONARIO", async () => {
    for (const [index, type] of EVENT_TYPES.entries()) {
      const token = index % 2 === 0 ? adminToken : employeeToken;
      const expectedUserId =
        token === adminToken ? adminUserId : employeeUserId;

      const response = await request(app)
        .post("/events")
        .set(authorization(token))
        .send(createPayload(type))
        .expect(201);

      expect(response.body.event).toMatchObject({
        animalId,
        fazendaId,
        type,
        createdBy: expectedUserId,
      });
    }

    const stored = JSON.parse(
      await readFile(files.events, "utf-8")
    ) as Array<{ type: EventType; createdBy: string }>;

    expect(stored.map((event) => event.type)).toEqual(EVENT_TYPES);
    expect(stored.some((event) => event.createdBy === adminUserId)).toBe(true);
    expect(stored.some((event) => event.createdBy === employeeUserId)).toBe(
      true
    );
  });

  it("rejeita tipo invalido sem persistir evento", async () => {
    const response = await request(app)
      .post("/events")
      .set(authorization(adminToken))
      .send(createPayload("CONSULTA"))
      .expect(400);

    expect(response.body.message).toBe("Tipo de evento invalido.");
    expect(JSON.parse(await readFile(files.events, "utf-8"))).toEqual([]);
  });

  it("retorna historico completo e ordenado para animal e fazenda", async () => {
    const storedEvents = Array.from({ length: 60 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 0, index + 1, 12)).toISOString();
      return {
        id: `event-${index + 1}`,
        animalId,
        fazendaId,
        type: "PESAGEM",
        description: `Pesagem ${index + 1}`,
        date,
        createdBy: adminUserId,
        createdAt: date,
      };
    });
    await writeJson(files.events, storedEvents);

    const animalResponse = await request(app)
      .get("/events")
      .query({ animalId, limit: 10 })
      .set(authorization(adminToken))
      .expect(200);

    const farmResponse = await request(app)
      .get(`/events/fazenda/${fazendaId}`)
      .set(authorization(employeeToken))
      .expect(200);

    for (const response of [animalResponse, farmResponse]) {
      expect(response.body.events).toHaveLength(60);
      expect(response.body.events[0].id).toBe("event-60");
      expect(response.body.events[59].id).toBe("event-1");
    }
  });
});
