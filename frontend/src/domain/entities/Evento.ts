export enum TipoEvento {
  VACINACAO = "VACINACAO",
  PESAGEM = "PESAGEM",
  PARTO = "PARTO",
  MEDICACAO = "MEDICACAO",
  OUTRO = "OUTRO"
}

export interface EventoProps {
  id?: string;
  animalId: string;
  tipo: TipoEvento;
  descricao: string;
  data: Date;
}

export class Evento {
  constructor(private props: EventoProps) {
    this.validate();
  }

  private validate() {
    if (!this.props.animalId) throw new Error("ID do animal é obrigatório");
    if (!this.props.descricao) throw new Error("Descrição é obrigatória");
  }

  get id() { return this.props.id; }
  get animalId() { return this.props.animalId; }
  get tipo() { return this.props.tipo; }
  get descricao() { return this.props.descricao; }
  get data() { return this.props.data; }
}
