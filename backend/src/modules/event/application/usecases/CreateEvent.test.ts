import { describe, expect, it, vi } from "vitest";
import { Animal } from "../../../animal/domain/entities/Animal";
import { IAnimalRepository } from "../../../animal/domain/repositories/IAnimalRepository";
import { IFazendaMemberRepository } from "../../../membership/contracts/IFazendaMemberRepository";
import { FazendaMember } from "../../../membership/domain/entities/FazendaMember";
import { IEventRepository } from "../../domain/contracts/IEventRepository";
import { Event } from "../../domain/entities/Event";
import { CreateEvent } from "./CreateEvent";

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
  fazendaId: "fazenda-1",
  userId: "user-1",
  role: "ADMIN",
  active: true,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
});

const makeDependencies = () => {
  const eventRepository: IEventRepository = {
    save: vi.fn(async (event: Event) => event),
    findByAnimalId: vi.fn(async () => []),
    findByFazendaId: vi.fn(async () => []),
  };
  const animalRepository = {
    findById: vi.fn(async () => animal),
  } as unknown as IAnimalRepository;
  const memberRepository = {
    findByFazendaAndUser: vi.fn(async () => member),
  } as unknown as IFazendaMemberRepository;

  return { eventRepository, animalRepository, memberRepository };
};

describe("CreateEvent", () => {
  it("cria evento com um tipo oficial", async () => {
    const dependencies = makeDependencies();
    const useCase = new CreateEvent(
      dependencies.eventRepository,
      dependencies.animalRepository,
      dependencies.memberRepository
    );

    const event = await useCase.execute({
      animalId: animal.id,
      fazendaId: animal.fazendaId,
      type: "VACINACAO",
      description: "Vacina anual",
      date: new Date("2026-06-11T12:00:00.000Z"),
      createdBy: member.userId,
    });

    expect(event.type).toBe("VACINACAO");
    expect(dependencies.eventRepository.save).toHaveBeenCalledWith(event);
  });

  it("rejeita tipo de evento invalido", async () => {
    const dependencies = makeDependencies();
    const useCase = new CreateEvent(
      dependencies.eventRepository,
      dependencies.animalRepository,
      dependencies.memberRepository
    );

    await expect(
      useCase.execute({
        animalId: animal.id,
        fazendaId: animal.fazendaId,
        type: "CONSULTA",
        description: "Tipo nao permitido",
        date: new Date("2026-06-11T12:00:00.000Z"),
        createdBy: member.userId,
      })
    ).rejects.toMatchObject({
      message: "Tipo de evento invalido.",
      statusCode: 400,
    });

    expect(dependencies.eventRepository.save).not.toHaveBeenCalled();
  });
});
