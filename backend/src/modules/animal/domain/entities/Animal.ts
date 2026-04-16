export interface AnimalProps {
  id?: string;
  nome: string;
  raca: string;
  idade: number;
  peso: number;
  fazendaId: string;
  dataNascimento?: Date;
}

export class Animal {
  private props: AnimalProps;

  constructor(props: AnimalProps) {
    this.props = props;
    this.validate();
  }

  private validate() {
  //   if (!this.props.id) {
  //     throw new Error("ID é obrigatório.");
  //   }

    if (!this.props.nome || this.props.nome.trim().length === 0) {
      throw new Error("Nome do animal é obrigatório.");
    }

    if (!this.props.raca || this.props.raca.trim().length === 0) {
      throw new Error("Raça do animal é obrigatória.");
    }

    if (this.props.idade < 0) {
      throw new Error("Idade não pode ser negativa.");
    }

    if (this.props.peso <= 0) {
      throw new Error("O peso do animal deve ser maior que zero.");
    }
  }

  get id(): string | undefined { return this.props.id; }
  get nome(): string { return this.props.nome; }
  get raca(): string { return this.props.raca; }
  get idade(): number { return this.props.idade; }
  get peso(): number { return this.props.peso; }
  get dataNascimento(): Date | undefined { return this.props.dataNascimento; }
  get fazendaId(): string { return this.props.fazendaId || ''; }
}