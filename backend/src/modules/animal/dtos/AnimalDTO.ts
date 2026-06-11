import { StatusAnimal } from "../domain/entities/Animal";

export interface CreateAnimalDTO {
  fazendaId: string;
  codigoIdentificacao: string;
  nome?: string;
  raca: string;
  peso: number;
  dataNascimento: Date;
}

export interface UpdateAnimalDTO {
  nome?: string | null;
  raca?: string;
  peso?: number;
  status?: StatusAnimal;
}

export interface AnimalDTO {
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
