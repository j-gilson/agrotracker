import { useState, useEffect, useMemo, useCallback } from 'react';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useFazendas = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFazendasUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new GetFazendas(repository);
  }, []);

  const fetchFazendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getFazendasUseCase.execute();
      setFazendas(result);
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel carregar as fazendas agora. Tente novamente.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [getFazendasUseCase]);

  useEffect(() => {
    fetchFazendas();
  }, [fetchFazendas]);

  return {
    fazendas,
    loading,
    error,
    refresh: fetchFazendas,
  };
};
