import { EventoDTO } from "../../domain/dtos/EventoDTO";
import { apiClient } from '../../core/network/ApiClient';

export const eventoApi = {
  async fetchEventsByAnimal(animalId: string): Promise<EventoDTO[]> {
    return apiClient.get<EventoDTO[]>(`/events?animal_id=${animalId}`);
  },

  async createEvent(data: EventoDTO): Promise<EventoDTO> {
    return apiClient.post<EventoDTO>('/events', data);
  },
};
