import { apiClient } from '../../core/network/ApiClient';

export interface AnimalResponse {
  id: string;
  nome: string;
  raca: string;
  idade: number;
  peso: number;
  dataNascimento?: string;
  fazendaId: string;
}

export const animalApi = {
  async fetchAnimals(): Promise<AnimalResponse[]> {
    return apiClient.get<AnimalResponse[]>('/animals');
  },

  async createAnimal(data: Omit<AnimalResponse, 'id'>): Promise<AnimalResponse> {
    return apiClient.post<AnimalResponse>('/animals', data);
  },
};
