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
};

const fazendaId = "11111111-1111-4111-8111-111111111111";
const adminUserId = "22222222-2222-4222-8222-222222222222";
const employeeUserId = "33333333-3333-4333-8333-333333333333";
const targetUserId = "44444444-4444-4444-8444-444444444444";
const adminToken = "membership-admin-token";
const employeeToken = "membership-employee-token";

const authorization = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const originals = new Map<string, string>();

const writeJson = async (filePath: string, value: unknown): Promise<void> => {
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
};

describe("Membership API", () => {
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
        email: "admin@agrotracker.local",
        passwordHash: "hash",
        ativo: true,
        roles: ["ADMIN"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: employeeUserId,
        nome: "Funcionario",
        email: "funcionario@agrotracker.local",
        passwordHash: "hash",
        ativo: true,
        roles: ["FUNCIONARIO"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: targetUserId,
        nome: "Membro Alvo",
        email: "alvo@agrotracker.local",
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
      {
        id: "membership-target",
        fazendaId,
        userId: targetUserId,
        role: "FUNCIONARIO",
        active: true,
        createdAt: now,
      },
    ]);
  });

  afterAll(async () => {
    for (const [filePath, content] of originals) {
      await writeFile(filePath, content, "utf-8");
    }
  });

  it("ADMIN remove membro da fazenda", async () => {
    await request(app)
      .delete(`/fazendas/${fazendaId}/members/membership-target`)
      .set(authorization(adminToken))
      .expect(204);

    const stored = JSON.parse(
      await readFile(files.memberships, "utf-8")
    ) as Array<{ id: string }>;

    expect(stored.some((member) => member.id === "membership-target")).toBe(false);
  });

  it("FUNCIONARIO nao pode remover membro", async () => {
    const response = await request(app)
      .delete(`/fazendas/${fazendaId}/members/membership-target`)
      .set(authorization(employeeToken))
      .expect(403);

    expect(response.body.message).toBe("Acesso restrito.");

    const stored = JSON.parse(
      await readFile(files.memberships, "utf-8")
    ) as Array<{ id: string }>;

    expect(stored.some((member) => member.id === "membership-target")).toBe(true);
  });

  it("ADMIN e FUNCIONARIO visualizam a listagem correta de membros", async () => {
    const adminResponse = await request(app)
      .get(`/fazendas/${fazendaId}/members`)
      .set(authorization(adminToken))
      .expect(200);

    const employeeResponse = await request(app)
      .get(`/fazendas/${fazendaId}/members`)
      .set(authorization(employeeToken))
      .expect(200);

    for (const response of [adminResponse, employeeResponse]) {
      expect(response.body.success).toBe(true);
      expect(response.body.members).toHaveLength(3);
      expect(response.body.members).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: adminUserId,
            role: "ADMIN",
            active: true,
          }),
          expect.objectContaining({
            userId: employeeUserId,
            role: "FUNCIONARIO",
            active: true,
          }),
        ])
      );
    }
  });

  it("RBAC permite administracao por ADMIN e bloqueia FUNCIONARIO", async () => {
    await request(app)
      .patch(`/fazendas/${fazendaId}/members/membership-target/role`)
      .set(authorization(adminToken))
      .send({ role: "ADMIN" })
      .expect(200);

    const response = await request(app)
      .patch(`/fazendas/${fazendaId}/members/membership-target/toggle`)
      .set(authorization(employeeToken))
      .expect(403);

    expect(response.body.message).toBe("Acesso restrito.");
  });
});
