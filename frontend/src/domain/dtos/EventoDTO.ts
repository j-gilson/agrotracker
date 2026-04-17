export interface EventoDTO {
  id?: string;
  animal_id: string;
  tipo_evento: string;
  data_hora: string;
  peso_kg?: number;
  vacina?: string;
  observacoes?: string;
}
