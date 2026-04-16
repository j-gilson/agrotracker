export interface CreateFazendaDTO {
  nome: string;
  localizacao: string;
}

export interface FazendaDTO extends CreateFazendaDTO {
  id: string;
}
