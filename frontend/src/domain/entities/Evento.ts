export interface EventoProps {
  id?: string;
  animalId: string;
  tipoEvento: string;
  dataHora: Date;
  pesoKg?: number;
  vacina?: string;
  observacoes?: string;
}

export class Evento {
  constructor(private props: EventoProps) {
    this.validate();
  }

  private validate() {
    if (!this.props.animalId) {
      throw new Error("ID do animal é obrigatório");
    }

    if (!this.props.tipoEvento) {
      throw new Error("Tipo do evento é obrigatório");
    }

    if (!this.props.dataHora) {
      throw new Error("Data e hora são obrigatórias");
    }
  }

  get id() { return this.props.id; }
  get animalId() { return this.props.animalId; }
  get tipoEvento() { return this.props.tipoEvento; }
  get dataHora() { return this.props.dataHora; }
  get pesoKg() { return this.props.pesoKg; }
  get vacina() { return this.props.vacina; }
  get observacoes() { return this.props.observacoes; }
}
