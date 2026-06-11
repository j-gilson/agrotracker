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
  invites: path.join(dataDir, "invites.json"),
  fazendas: path.join(dataDir, "fazendas.json"),
};

const fazendaId = "11111111-1111-4111-8111-111111111111";
const adminUserId = "22222222-2222-4222-8222-222222222222";
const invitedUserId = "33333333-3333-4333-8333-333333333333";
const otherUserId = "44444444-4444-4444-8444-444444444444";
const adminToken = "invite-admin-token";
const invitedToken = "invite-user-token";
const otherToken = "invite-other-token";
const invitedEmail = "convidado@agrotracker.local";
const pendingInviteId = "invite-pending";
const pendingInviteToken = "pending-invite-token";

const authorization = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const originals = new Map<string, string>();

const writeJson = async (filePath: string, value: unknown): Promise<void> => {
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
};

describe("Invite API", () => {
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
        id: invitedUserId,
        nome: "Usuario Convidado",
        email: invitedEmail,
        passwordHash: "hash",
        ativo: true,
        roles: ["FUNCIONARIO"],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: otherUserId,
        nome: "Outro Usuario",
        email: "outro@agrotracker.local",
        passwordHash: "hash",
        ativo: true,
        roles: ["FUNCIONARIO"],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await writeJson(files.sessions, [
      { token: adminToken, userId: adminUserId, createdAt: now },
      { token: invitedToken, userId: invitedUserId, createdAt: now },
      { token: otherToken, userId: otherUserId, createdAt: now },
    ]);

    await writeJson(files.fazendas, [
      {
        id: fazendaId,
        nome: "Fazenda Convite",
        localizacao: "Campo Verde",
      },
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
    ]);

    await writeJson(files.invites, [
      {
        id: pendingInviteId,
        fazendaId,
        email: invitedEmail,
        role: "FUNCIONARIO",
        token: pendingInviteToken,
        status: "PENDING",
        createdAt: now,
      },
      {
        id: "invite-other-user",
        fazendaId,
        email: "outro@agrotracker.local",
        role: "FUNCIONARIO",
        token: "other-user-invite-token",
        status: "PENDING",
        createdAt: now,
      },
      {
        id: "invite-already-accepted",
        fazendaId,
        email: invitedEmail,
        role: "FUNCIONARIO",
        token: "accepted-invite-token",
        status: "ACCEPTED",
        createdAt: now,
      },
    ]);
  });

  afterAll(async () => {
    for (const [filePath, content] of originals) {
      await writeFile(filePath, content, "utf-8");
    }
  });

  it("lista somente convites pendentes do email autenticado", async () => {
    const response = await request(app)
      .get("/invites")
      .set(authorization(invitedToken))
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.invites).toHaveLength(1);
    expect(response.body.invites[0]).toMatchObject({
      id: pendingInviteId,
      fazendaId,
      fazendaNome: "Fazenda Convite",
      email: invitedEmail,
      role: "FUNCIONARIO",
      status: "PENDING",
    });
  });

  it("aceita convite, atualiza status e cria membership", async () => {
    await request(app)
      .post("/invites/accept")
      .set(authorization(invitedToken))
      .send({ token: pendingInviteToken })
      .expect(200);

    const invites = JSON.parse(
      await readFile(files.invites, "utf-8")
    ) as Array<{ id: string; status: string }>;
    const memberships = JSON.parse(
      await readFile(files.memberships, "utf-8")
    ) as Array<{ fazendaId: string; userId: string; role: string }>;

    expect(
      invites.find((invite) => invite.id === pendingInviteId)?.status
    ).toBe("ACCEPTED");
    expect(memberships).toContainEqual(
      expect.objectContaining({
        fazendaId,
        userId: invitedUserId,
        role: "FUNCIONARIO",
      })
    );

    const farmsResponse = await request(app)
      .get("/fazendas")
      .set(authorization(invitedToken))
      .expect(200);

    expect(farmsResponse.body).toContainEqual(
      expect.objectContaining({
        id: fazendaId,
        nome: "Fazenda Convite",
      })
    );
  });

  it("recusa convite e atualiza status para RECUSADO", async () => {
    await request(app)
      .post(`/invites/${pendingInviteId}/reject`)
      .set(authorization(invitedToken))
      .expect(200);

    const invites = JSON.parse(
      await readFile(files.invites, "utf-8")
    ) as Array<{ id: string; status: string }>;

    expect(
      invites.find((invite) => invite.id === pendingInviteId)?.status
    ).toBe("RECUSADO");

    const memberships = JSON.parse(
      await readFile(files.memberships, "utf-8")
    ) as Array<{ fazendaId: string; userId: string }>;

    expect(
      memberships.some(
        (member) =>
          member.fazendaId === fazendaId &&
          member.userId === invitedUserId
      )
    ).toBe(false);
  });

  it("impede usuario de aceitar convite de outro email", async () => {
    const response = await request(app)
      .post("/invites/accept")
      .set(authorization(otherToken))
      .send({ token: pendingInviteToken })
      .expect(403);

    expect(response.body.message).toBe(
      "Este convite nao pertence ao seu email."
    );
  });

  it("nao duplica membership existente ao aceitar convite", async () => {
    const now = new Date().toISOString();
    const memberships = JSON.parse(
      await readFile(files.memberships, "utf-8")
    ) as object[];
    memberships.push({
      id: "membership-existing",
      fazendaId,
      userId: invitedUserId,
      role: "FUNCIONARIO",
      active: true,
      createdAt: now,
    });
    await writeJson(files.memberships, memberships);

    await request(app)
      .post("/invites/accept")
      .set(authorization(invitedToken))
      .send({ token: pendingInviteToken })
      .expect(409);

    const stored = JSON.parse(
      await readFile(files.memberships, "utf-8")
    ) as Array<{ fazendaId: string; userId: string }>;

    expect(
      stored.filter(
        (member) =>
          member.fazendaId === fazendaId &&
          member.userId === invitedUserId
      )
    ).toHaveLength(1);
  });

  it("mantem a criacao de convite pelo ADMIN", async () => {
    await writeJson(files.invites, []);

    const response = await request(app)
      .post(`/fazendas/${fazendaId}/invite`)
      .set(authorization(adminToken))
      .send({ email: invitedEmail, role: "FUNCIONARIO" })
      .expect(201);

    expect(response.body.invite).toMatchObject({
      fazendaId,
      email: invitedEmail,
      role: "FUNCIONARIO",
      status: "PENDING",
    });
  });
});
