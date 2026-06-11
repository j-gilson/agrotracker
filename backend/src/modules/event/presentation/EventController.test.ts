import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { Event } from "../domain/entities/Event";
import { EventController } from "./EventController";

const makeEvents = (count: number): Event[] =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2026, 0, index + 1, 12));
    return new Event({
      id: `event-${index + 1}`,
      animalId: "animal-1",
      fazendaId: "fazenda-1",
      type: "OUTRO",
      description: `Evento ${index + 1}`,
      date,
      createdBy: "user-1",
      createdAt: date,
    });
  }).reverse();

const makeResponse = () => {
  const response = {
    locals: { currentUser: { id: "user-1" } },
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);
  return response as unknown as Response;
};

const makeController = (events: Event[]) =>
  new EventController(
    {} as never,
    { execute: vi.fn(async () => events) } as never,
    { execute: vi.fn(async () => events) } as never
  );

describe("EventController consultas completas", () => {
  it("nao trunca o historico do animal mesmo com query limit", async () => {
    const events = makeEvents(60);
    const response = makeResponse();
    const request = {
      query: { animalId: "animal-1", limit: "10" },
    } as unknown as Request;

    await makeController(events).listByAnimal(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        events: expect.arrayContaining([
          expect.objectContaining({ id: "event-60" }),
          expect.objectContaining({ id: "event-1" }),
        ]),
      })
    );
    const payload = vi.mocked(response.json).mock.calls[0][0] as {
      events: unknown[];
    };
    expect(payload.events).toHaveLength(60);
  });

  it("nao trunca a consulta por fazenda", async () => {
    const events = makeEvents(65);
    const response = makeResponse();
    const request = {
      params: { id: "fazenda-1" },
      query: {},
    } as unknown as Request;

    await makeController(events).listByFazenda(request, response);

    const payload = vi.mocked(response.json).mock.calls[0][0] as {
      events: unknown[];
    };
    expect(response.status).toHaveBeenCalledWith(200);
    expect(payload.events).toHaveLength(65);
  });
});
