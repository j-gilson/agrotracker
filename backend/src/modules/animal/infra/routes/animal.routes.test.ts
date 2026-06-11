import { readFile, writeFile } from "fs/promises";
import path from "path";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../../../app";

const dataDir = path.resolve(process.cwd(), "data");
const files = {
  users: path.join(dataDir, "users.json"),
  sessions: path.join(dataDir, "sessions.json"),
  memberships: path.join(dataDir, "memberships.json"),
  animals: path.join(dataDir, "animals.json"),
};

const userId = "11111111-1111-4111-8111-111111111111";
const fazenda1 = "22222222-2222-4222-8222-222222222222";
const fazenda2 = "33333333-3333-4333-8333-333333333333";
const token = "animal-api-test-token";
const authorization = { Authorization: `Bearer ${token}` };

const originals = new Map<string, string>();

const writeJson = async (filePath: string, value: unknown): Promise<void> => {
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
};

const createPayload = (overrides: Record<string, unknown> = {}) => ({
  fazendaId: fazenda1,
  codigoIdentificacao: "QR-001",
  raca: "Nelore",
  peso: 410,
  dataNascimento: "2021-04-20T12:00:00.000Z",
  ...overrides,
});

describe("Animal API", () => {
  beforeAll(async () => {
    for (const filePath of Object.values(files)) {
      originals.set(filePath, await readFile(filePath, "utf-8"));
    }
  });

  beforeEach(async () => {
    const now = new Date().toISOString();
    await writeJson(files.users, [
      {
        id: userId,
        nome: "Usuario Teste",
        email: "animal.test@agrotracker.local",
        passwordHash: "hash",
        ativo: true,
        roles: ["ADMIN"],
        createdAt: now,
        updatedAt: now,
      },
    ]);
    await writeJson(files.sessions, [{ token, userId, createdAt: now }]);
    await writeJson(files.memberships, [
      {
        id: "membership-1",
        fazendaId: fazenda1,
        userId,
        role: "ADMIN",
        active: true,
        createdAt: now,
      },
      {
        id: "membership-2",
        fazendaId: fazenda2,
        userId,
        role: "ADMIN",
        active: true,
        createdAt: now,
      },
    ]);
    await writeJson(files.animals, []);
  });

  afterAll(async () => {
    for (const [filePath, content] of originals) {
      await writeFile(filePath, content, "utf-8");
    }
  });

  it("POST cria animal sem nome, com status ATIVO e sem idade persistida", async () => {
    const response = await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload())
      .expect(201);

    expect(response.body.nome).toBeNull();
    expect(response.body.status).toBe("ATIVO");
    expect(response.body).not.toHaveProperty("idade");

    const stored = JSON.parse(await readFile(files.animals, "utf-8")) as object[];
    expect(stored[0]).not.toHaveProperty("idade");
  });

  it("rejeita codigo duplicado na mesma fazenda e permite em outra fazenda", async () => {
    await request(app).post("/animals").set(authorization).send(createPayload()).expect(201);

    await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload({ codigoIdentificacao: "qr-001" }))
      .expect(400);

    await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload({ fazendaId: fazenda2 }))
      .expect(201);
  });

  it("GET lista por fazenda e consulta individual por UUID", async () => {
    const created = await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload())
      .expect(201);
    await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload({ fazendaId: fazenda2 }))
      .expect(201);

    const list = await request(app)
      .get("/animals")
      .query({ fazendaId: fazenda1 })
      .set(authorization)
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].fazendaId).toBe(fazenda1);

    const detail = await request(app)
      .get(`/animals/${created.body.id}`)
      .set(authorization)
      .expect(200);
    expect(detail.body.id).toBe(created.body.id);
    expect(detail.body.codigoIdentificacao).toBe("QR-001");
  });

  it("GET by-code usa codigoIdentificacao dentro da fazenda, nao o UUID", async () => {
    const created = await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload({ codigoIdentificacao: "SCANNER-009" }))
      .expect(201);

    expect(created.body.id).not.toBe("SCANNER-009");

    const response = await request(app)
      .get("/animals/by-code")
      .query({ fazendaId: fazenda1, codigoIdentificacao: "scanner-009" })
      .set(authorization)
      .expect(200);

    expect(response.body.id).toBe(created.body.id);
    expect(response.body.codigoIdentificacao).toBe("SCANNER-009");
  });

  it("PUT altera campos permitidos e ignora campos imutaveis", async () => {
    const created = await request(app)
      .post("/animals")
      .set(authorization)
      .send(createPayload())
      .expect(201);

    const response = await request(app)
      .put(`/animals/${created.body.id}`)
      .set(authorization)
      .send({
        nome: "Estrela",
        raca: "Angus",
        peso: 470,
        status: "VENDIDO",
        id: "id-invasor",
        fazendaId: fazenda2,
        codigoIdentificacao: "CODIGO-INVASOR",
        dataCriacao: "2000-01-01T00:00:00.000Z",
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: created.body.id,
      fazendaId: fazenda1,
      codigoIdentificacao: "QR-001",
      dataCriacao: created.body.dataCriacao,
      nome: "Estrela",
      raca: "Angus",
      peso: 470,
      status: "VENDIDO",
    });
  });
});
