import { useState, useEffect, useMemo, useCallback } from 'react';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export interface HomeStats {
  animais: number;
  manejos: number;
  fazendas: number;
}

export const useHome = () => {
  const [stats, setStats] = useState<HomeStats>({
    animais: 0,
    manejos: 0,
    fazendas: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFazendasUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new GetFazendas(repository);
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca fazendas para contar
      const fazendas = await getFazendasUseCase.execute();
      
      // Simulação de outros dados por enquanto, já que não temos usecases globais de contagem
      // Em um cenário real, teríamos usecases específicos para estatísticas
      setStats({
        animais: 124, // Mock
        manejos: 45,  // Mock
        fazendas: fazendas.length,
      });
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel carregar os dados do painel agora.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [getFazendasUseCase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};
