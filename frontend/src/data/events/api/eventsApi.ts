import { apiClient } from '../../../core/network/ApiClient';
import { EventType } from '../../../domain/events/types';

export interface EventResponse {
  id: string;
  animalId: string;
  fazendaId: string;
  type: EventType;
  description: string;
  date: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateEventRequest {
  animalId: string;
  fazendaId: string;
  type: EventType;
  description: string;
  date: string;
}

export const eventsApi = {
  async getByAnimal(animalId: string): Promise<{ success: boolean; events: EventResponse[] }> {
    return apiClient.get<{ success: boolean; events: EventResponse[] }>(
      `/events?animalId=${encodeURIComponent(animalId)}`
    );
  },

  async getByFazenda(fazendaId: string): Promise<{ success: boolean; events: EventResponse[] }> {
    return apiClient.get<{ success: boolean; events: EventResponse[] }>(`/events/fazenda/${fazendaId}`);
  },

  async create(data: CreateEventRequest): Promise<{ success: boolean; event: EventResponse }> {
    return apiClient.post<{ success: boolean; event: EventResponse }>('/events', data);
  },
};
