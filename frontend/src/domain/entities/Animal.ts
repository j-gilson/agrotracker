export type StatusAnimal = 'ATIVO' | 'VENDIDO' | 'MORTO';

export interface AnimalProps {
  id: string;
  fazendaId: string;
  codigoIdentificacao: string;
  nome?: string;
  raca: string;
  peso: number;
  dataNascimento: Date;
  status: StatusAnimal;
  dataCriacao: Date;
}

const STATUS_VALIDOS: StatusAnimal[] = ['ATIVO', 'VENDIDO', 'MORTO'];

export class Animal {
  constructor(private readonly props: AnimalProps) {
    this.validate();
  }

  private validate(): void {
    if (!this.props.id?.trim()) throw new Error('ID do animal e obrigatorio');
    if (!this.props.fazendaId?.trim()) throw new Error('ID da fazenda e obrigatorio');
    if (!this.props.codigoIdentificacao?.trim()) {
      throw new Error('Codigo de identificacao e obrigatorio');
    }
    if (!this.props.raca?.trim()) throw new Error('Raca e obrigatoria');
    if (!Number.isFinite(this.props.peso) || this.props.peso <= 0) {
      throw new Error('Peso deve ser maior que zero');
    }
    if (Number.isNaN(this.props.dataNascimento.getTime())) {
      throw new Error('Data de nascimento invalida');
    }
    if (this.props.dataNascimento.getTime() > Date.now()) {
      throw new Error('Data de nascimento nao pode estar no futuro');
    }
    if (!STATUS_VALIDOS.includes(this.props.status)) {
      throw new Error('Status do animal invalido');
    }
    if (Number.isNaN(this.props.dataCriacao.getTime())) {
      throw new Error('Data de criacao invalida');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get fazendaId(): string {
    return this.props.fazendaId;
  }

  get codigoIdentificacao(): string {
    return this.props.codigoIdentificacao;
  }

  get nome(): string | undefined {
    return this.props.nome;
  }

  get raca(): string {
    return this.props.raca;
  }

  get peso(): number {
    return this.props.peso;
  }

  get dataNascimento(): Date {
    return this.props.dataNascimento;
  }

  get status(): StatusAnimal {
    return this.props.status;
  }

  get dataCriacao(): Date {
    return this.props.dataCriacao;
  }

  get idade(): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - this.props.dataNascimento.getFullYear();
    const aniversarioAindaNaoOcorreu =
      hoje.getMonth() < this.props.dataNascimento.getMonth() ||
      (hoje.getMonth() === this.props.dataNascimento.getMonth() &&
        hoje.getDate() < this.props.dataNascimento.getDate());

    if (aniversarioAindaNaoOcorreu) idade -= 1;
    return Math.max(0, idade);
  }
}
