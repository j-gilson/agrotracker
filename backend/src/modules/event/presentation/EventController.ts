import { Request, Response } from "express";
import { CreateEvent } from "../application/usecases/CreateEvent";
import { GetEventsByAnimal } from "../application/usecases/GetEventsByAnimal";
import { GetEventsByFazenda } from "../application/usecases/GetEventsByFazenda";
import { EventError } from "../application/errors/EventError";
import { isEventType } from "../domain/types";

export class EventController {
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly getEventsByAnimal: GetEventsByAnimal,
    private readonly getEventsByFazenda: GetEventsByFazenda
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { animalId, fazendaId, type, description, date } = req.body as {
        animalId?: string;
        fazendaId?: string;
        type?: string;
        description?: string;
        date?: string;
      };
      const animalIdValue = animalId?.trim() ?? "";
      const fazendaIdValue = fazendaId?.trim() ?? "";
      const typeValue = type?.trim() ?? "";
      const descriptionValue = description?.trim() ?? "";
      const parsedDate = date ? new Date(date) : new Date("");

      if (!animalIdValue || !fazendaIdValue || !type || !descriptionValue) {
        return res.status(400).json({ success: false, message: "animalId, fazendaId, type e description sao obrigatorios." });
      }

      if (!isEventType(typeValue)) {
        return res.status(400).json({ success: false, message: "Tipo de evento invalido." });
      }

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: "Data do evento invalida." });
      }

      const currentUser = res.locals.currentUser as { id: string; nome: string; email: string } | undefined;

      const event = await this.createEvent.execute({
        animalId: animalIdValue,
        fazendaId: fazendaIdValue,
        type: typeValue,
        description: descriptionValue,
        date: parsedDate,
        createdBy: currentUser?.id ?? "",
      });

      return res.status(201).json({
        success: true,
        event: {
          id: event.id,
          animalId: event.animalId,
          fazendaId: event.fazendaId,
          type: event.type,
          description: event.description,
          date: event.date.toISOString(),
          createdBy: event.createdBy,
          createdAt: event.createdAt.toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof EventError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      const message = error instanceof Error ? error.message : "Erro inesperado ao criar evento.";
      return res.status(500).json({ success: false, message });
    }
  }

  async listByAnimal(req: Request, res: Response): Promise<Response> {
    try {
      const animalId = typeof req.query.animalId === "string" ? req.query.animalId.trim() : "";
      const currentUser = res.locals.currentUser as { id: string } | undefined;

      if (!animalId) {
        return res.status(400).json({ success: false, message: "animalId e obrigatorio." });
      }

      const events = await this.getEventsByAnimal.execute(animalId, currentUser?.id ?? "");

      return res.status(200).json({
        success: true,
        events: events.map((event) => ({
          id: event.id,
          animalId: event.animalId,
          fazendaId: event.fazendaId,
          type: event.type,
          description: event.description,
          date: event.date.toISOString(),
          createdBy: event.createdBy,
          createdAt: event.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof EventError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao listar eventos." });
    }
  }

  async listByFazenda(req: Request, res: Response): Promise<Response> {
    try {
      const fazendaId = String(req.params.id ?? "").trim();
      const currentUser = res.locals.currentUser as { id: string } | undefined;

      if (!fazendaId) {
        return res.status(400).json({ success: false, message: "Fazenda invalida." });
      }

      const events = await this.getEventsByFazenda.execute(fazendaId, currentUser?.id ?? "");

      return res.status(200).json({
        success: true,
        events: events.map((event) => ({
          id: event.id,
          animalId: event.animalId,
          fazendaId: event.fazendaId,
          type: event.type,
          description: event.description,
          date: event.date.toISOString(),
          createdBy: event.createdBy,
          createdAt: event.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      if (error instanceof EventError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: "Erro inesperado ao listar eventos." });
    }
  }
}
