import { useState, useEffect, useMemo } from 'react';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';

export const useFazendas = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFazendasUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new GetFazendas(repository);
  }, []);

  const fetchFazendas = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getFazendasUseCase.execute();
      setFazendas(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao carregar as fazendas.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFazendas();
  }, []);

  return {
    fazendas,
    loading,
    error,
    refresh: fetchFazendas,
  };
};
