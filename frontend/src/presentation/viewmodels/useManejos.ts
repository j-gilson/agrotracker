import { useState, useEffect, useMemo, useCallback } from 'react';
import { Evento } from '../../domain/entities/Evento';
import { EventoRepositoryImpl } from '../../data/repositories/EventoRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useManejos = () => {
  const [manejos, setManejos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const eventoRepository = useMemo(() => new EventoRepositoryImpl(), []);

  const fetchManejos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Como não temos um usecase global de manejos ainda, buscamos de um animal específico para teste
      // ou aguardamos a implementação de um método findAll no repositório.
      // Por enquanto, usaremos o repositório real que buscaria da API.
      const result = await eventoRepository.findByAnimal('all'); // 'all' como exemplo de busca global se suportado
      setManejos(result);
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel carregar os manejos agora.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [eventoRepository]);

  useEffect(() => {
    fetchManejos();
  }, [fetchManejos]);

  return {
    manejos,
    loading,
    error,
    refresh: fetchManejos,
  };
};
