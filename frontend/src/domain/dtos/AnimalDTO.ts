export interface CreateAnimalDTO {
  nome: string;
  raca: string;
  idade: number;
  peso: number;
  fazendaId: string;
}

export interface AnimalDTO extends CreateAnimalDTO {
  id: string;
}
