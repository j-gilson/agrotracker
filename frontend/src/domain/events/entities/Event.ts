export interface EventProps {
  id?: string;
  animalId: string;
  fazendaId: string;
  type: string;
  description: string;
  date: Date;
  createdBy: string;
  createdAt: Date;
}

export class Event {
  constructor(private props: EventProps) {
    this.validate();
  }

  private validate() {
    if (!this.props.animalId?.trim()) {
      throw new Error('ID do animal é obrigatório');
    }
    if (!this.props.fazendaId?.trim()) {
      throw new Error('ID da fazenda é obrigatório');
    }
    if (!this.props.type?.trim()) {
      throw new Error('Tipo do evento é obrigatório');
    }
    if (!this.props.description?.trim()) {
      throw new Error('Descrição é obrigatória');
    }
    if (!(this.props.date instanceof Date) || Number.isNaN(this.props.date.getTime())) {
      throw new Error('Data inválida');
    }
  }

  get id() {
    return this.props.id;
  }
  get animalId() {
    return this.props.animalId;
  }
  get fazendaId() {
    return this.props.fazendaId;
  }
  get type() {
    return this.props.type;
  }
  get description() {
    return this.props.description;
  }
  get date() {
    return this.props.date;
  }
  get createdBy() {
    return this.props.createdBy;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
