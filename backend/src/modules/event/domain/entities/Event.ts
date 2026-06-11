import { EventType, isEventType } from "../types";

export interface EventProps {
  id: string;
  animalId: string;
  fazendaId: string;
  type: EventType;
  description: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
}

export class Event {
  private props: EventProps;

  constructor(props: EventProps) {
    this.props = props;
    this.validate();
  }

  private validate(): void {
    if (!this.props.id?.trim()) throw new Error("Id invalido.");
    if (!this.props.animalId?.trim()) throw new Error("Animal invalido.");
    if (!this.props.fazendaId?.trim()) throw new Error("Fazenda invalida.");
    if (!isEventType(this.props.type)) throw new Error("Tipo de evento invalido.");
    if (!this.props.description?.trim()) throw new Error("Descricao invalida.");
    if (!(this.props.date instanceof Date) || Number.isNaN(this.props.date.getTime())) {
      throw new Error("Data invalida.");
    }
    if (!this.props.createdBy?.trim()) throw new Error("Usuario invalido.");
    if (!(this.props.createdAt instanceof Date) || Number.isNaN(this.props.createdAt.getTime())) {
      throw new Error("Data de criacao invalida.");
    }
  }

  get id(): string {
    return this.props.id;
  }
  get animalId(): string {
    return this.props.animalId;
  }
  get fazendaId(): string {
    return this.props.fazendaId;
  }
  get type(): EventType {
    return this.props.type;
  }
  get description(): string {
    return this.props.description;
  }
  get date(): Date {
    return this.props.date;
  }
  get createdBy(): string {
    return this.props.createdBy;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
}
