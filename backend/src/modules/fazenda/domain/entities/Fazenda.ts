export interface FazendaProps {
  id?: string;
  nome: string;
  localizacao: string;
}

export class Fazenda {
  private props: FazendaProps;

  constructor(props: FazendaProps) {
    this.props = props;
    this.validate();
  }

  private validate() {
    if (!this.props.nome || this.props.nome.trim().length === 0) {
      throw new Error("Nome da fazenda é obrigatório.");
    }

    if (!this.props.localizacao || this.props.localizacao.trim().length === 0) {
      throw new Error("Localização da fazenda é obrigatória.");
    }
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }

  get localizacao(): string {
    return this.props.localizacao;
  }
}
