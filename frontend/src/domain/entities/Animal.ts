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
  constructor(private props: AnimalProps) {
    this.validate();
  }

  private validate() {
    if (!this.props.nome) {
      throw new Error("Nome é obrigatório");
    }

    if (!this.props.raca) {
      throw new Error("Raça é obrigatória");
    }

    if (this.props.idade < 0) {
      throw new Error("Idade não pode ser negativa");
    }

    if (this.props.peso <= 0) {
      throw new Error("Peso deve ser maior que zero");
    }

    if (!this.props.fazendaId) {
      throw new Error("ID da fazenda é obrigatório");
    }
  }

  get id() { return this.props.id; }
  get nome() { return this.props.nome; }
  get raca() { return this.props.raca; }
  get idade() { return this.props.idade; }
  get peso() { return this.props.peso; }
  get fazendaId() { return this.props.fazendaId; }
  get dataNascimento() { return this.props.dataNascimento; }
}
