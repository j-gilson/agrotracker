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
  async fetchAnimals(params?: { fazendaId?: string }): Promise<AnimalResponse[]> {
    const fazendaId = params?.fazendaId?.trim();
    const query = fazendaId ? `?fazendaId=${encodeURIComponent(fazendaId)}` : '';
    return apiClient.get<AnimalResponse[]>(`/animals${query}`);
  },

  async createAnimal(data: Omit<AnimalResponse, 'id'>): Promise<AnimalResponse> {
    return apiClient.post<AnimalResponse>('/animals', data);
  },

  async deleteAnimal(id: string): Promise<void> {
    await apiClient.delete<void>(`/animals/${encodeURIComponent(id)}`);
  },
};
