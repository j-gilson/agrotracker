const BASE_URL = 'http://192.168.1.107:3333'; // Use seu IP real para testes em dispositivo físico

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
    try {
      const response = await fetch(`${BASE_URL}/animals`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data: AnimalResponse[] = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar animais na API:', error);
      throw error;
    } 
  },

  async createAnimal(data: Omit<AnimalResponse, 'id'>): Promise<AnimalResponse> {
    try {
      const response = await fetch(`${BASE_URL}/animals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const result: AnimalResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao criar animal na API:', error);
      throw error;
    }
  }
};
