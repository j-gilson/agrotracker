export interface AnimalDTO {
  nome: string;
  raca: string;
  idade: number;
  peso: number;
  dataNascimento?: Date;
}

export interface CreateAnimalDTO {
  nome: string;
  raca: string;
  idade: number;
  peso: number;
  fazendaId: string;
  dataNascimento?: Date;
}
