import { describe, expect, it, vi } from "vitest";
import { Animal } from "../../../animal/domain/entities/Animal";
import { IAnimalRepository } from "../../../animal/domain/repositories/IAnimalRepository";
import { IFazendaMemberRepository } from "../../../membership/contracts/IFazendaMemberRepository";
import { FazendaMember } from "../../../membership/domain/entities/FazendaMember";
import { IEventRepository } from "../../domain/contracts/IEventRepository";
import { Event } from "../../domain/entities/Event";
import { GetEventsByAnimal } from "./GetEventsByAnimal";
import { GetEventsByFazenda } from "./GetEventsByFazenda";

const animal = new Animal({
  id: "animal-1",
  fazendaId: "fazenda-1",
  codigoIdentificacao: "BRINCO-001",
  raca: "Nelore",
  peso: 400,
  dataNascimento: new Date("2020-01-01T00:00:00.000Z"),
  status: "ATIVO",
  dataCriacao: new Date("2024-01-01T00:00:00.000Z"),
});

const member = new FazendaMember({
  id: "member-1",
  fazendaId: animal.fazendaId,
  userId: "user-1",
  role: "ADMIN",
  active: true,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
});

const makeEvents = (count: number): Event[] =>
  Array.from({ length: count }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return new Event({
      id: `event-${index + 1}`,
      animalId: animal.id,
      fazendaId: animal.fazendaId,
      type: "PESAGEM",
      description: `Pesagem ${index + 1}`,
      date: new Date(`2026-05-${day}T12:00:00.000Z`),
      createdBy: member.userId,
      createdAt: new Date(`2026-05-${day}T12:00:00.000Z`),
    });
  });

const makeRepositories = (events: Event[]) => {
  const eventRepository: IEventRepository = {
    save: vi.fn(async (event) => event),
    findByAnimalId: vi.fn(async () => [...events]),
    findByFazendaId: vi.fn(async () => [...events]),
  };
  const animalRepository = {
    findById: vi.fn(async () => animal),
  } as unknown as IAnimalRepository;
  const memberRepository = {
    findByFazendaAndUser: vi.fn(async () => member),
  } as unknown as IFazendaMemberRepository;

  return { eventRepository, animalRepository, memberRepository };
};

describe("consultas de eventos", () => {
  it("retorna o historico completo do animal com o mais recente primeiro", async () => {
    const repositories = makeRepositories(makeEvents(20));
    const useCase = new GetEventsByAnimal(
      repositories.eventRepository,
      repositories.animalRepository,
      repositories.memberRepository
    );

    const result = await useCase.execute(animal.id, member.userId);

    expect(result).toHaveLength(20);
    expect(result[0].id).toBe("event-20");
    expect(result[19].id).toBe("event-1");
  });

  it("retorna todos os eventos da fazenda com o mais recente primeiro", async () => {
    const repositories = makeRepositories(makeEvents(25));
    const useCase = new GetEventsByFazenda(
      repositories.eventRepository,
      repositories.memberRepository
    );

    const result = await useCase.execute(animal.fazendaId, member.userId);

    expect(result).toHaveLength(25);
    expect(result[0].id).toBe("event-25");
    expect(result[24].id).toBe("event-1");
  });
});
