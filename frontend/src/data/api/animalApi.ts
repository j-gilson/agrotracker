import { apiClient } from '../../core/network/ApiClient';
import { StatusAnimal } from '../../domain/entities/Animal';

export interface AnimalResponse {
  id: string;
  fazendaId: string;
  codigoIdentificacao: string;
  nome: string | null;
  raca: string;
  peso: number;
  dataNascimento: string;
  status: StatusAnimal;
  dataCriacao: string;
}

export interface CreateAnimalRequest {
  fazendaId: string;
  codigoIdentificacao: string;
  nome?: string;
  raca: string;
  peso: number;
  dataNascimento: string;
}

export interface UpdateAnimalRequest {
  nome?: string | null;
  raca?: string;
  peso?: number;
  status?: StatusAnimal;
}

export const animalApi = {
  async fetchAnimals(params?: { fazendaId?: string }): Promise<AnimalResponse[]> {
    const fazendaId = params?.fazendaId?.trim();
    const query = fazendaId ? `?fazendaId=${encodeURIComponent(fazendaId)}` : '';
    return apiClient.get<AnimalResponse[]>(`/animals${query}`);
  },

  async fetchAnimalById(id: string): Promise<AnimalResponse> {
    return apiClient.get<AnimalResponse>(`/animals/${encodeURIComponent(id)}`);
  },

  async fetchAnimalByCode(
    fazendaId: string,
    codigoIdentificacao: string
  ): Promise<AnimalResponse> {
    const query = new URLSearchParams({
      fazendaId,
      codigoIdentificacao,
    }).toString();
    return apiClient.get<AnimalResponse>(`/animals/by-code?${query}`);
  },

  async createAnimal(data: CreateAnimalRequest): Promise<AnimalResponse> {
    return apiClient.post<AnimalResponse>('/animals', data);
  },

  async updateAnimal(
    id: string,
    data: UpdateAnimalRequest
  ): Promise<AnimalResponse> {
    return apiClient.put<AnimalResponse>(
      `/animals/${encodeURIComponent(id)}`,
      data
    );
  },
};
