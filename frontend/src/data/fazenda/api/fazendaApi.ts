const BASE_URL = 'http://192.168.1.107:3333'; // Use seu IP real para testes em dispositivo físico

export interface FazendaResponse {
  id: string;
  nome: string;
  localizacao: string;
}

export const fazendaApi = {
  async fetchFazendas(): Promise<FazendaResponse[]> {
    try {
      const response = await fetch(`${BASE_URL}/fazendas`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data: FazendaResponse[] = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar fazendas na API:', error);
      throw error;
    } 
  },

  async createFazenda(data: Omit<FazendaResponse, 'id'>): Promise<FazendaResponse> {
    try {
      const response = await fetch(`${BASE_URL}/fazendas`, {
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

      const result: FazendaResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao criar fazenda na API:', error);
      throw error;
    }
  }
};
