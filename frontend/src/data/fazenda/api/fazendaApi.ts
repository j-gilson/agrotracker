import { apiClient } from '../../../core/network/ApiClient';

export interface FazendaResponse {
  id: string;
  nome: string;
  localizacao: string;
}

export const fazendaApi = {
  async fetchFazendas(): Promise<FazendaResponse[]> {
    return apiClient.get<FazendaResponse[]>('/fazendas');
  },

  async createFazenda(data: Omit<FazendaResponse, 'id'>): Promise<FazendaResponse> {
    return apiClient.post<FazendaResponse>('/fazendas', data);
  },
};
