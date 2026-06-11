import { useState, useEffect, useMemo, useCallback } from 'react';
import { GetAnimals } from '../../domain/usecases/animal/GetAnimals';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { GetEventsByFazenda } from '../../domain/events/usecases/GetEventsByFazenda';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';
import { buildHomeStats, HomeStats } from './homeStats';

export const useHome = (activeFarmId: string | null) => {
  const [stats, setStats] = useState<HomeStats>({
    animais: 0,
    manejos: 0,
    fazendas: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAnimalsUseCase = useMemo(() => {
    const repository = new AnimalRepositoryImpl();
    return new GetAnimals(repository);
  }, []);

  const getEventsByFazendaUseCase = useMemo(() => {
    const repository = new EventRepositoryImpl();
    return new GetEventsByFazenda(repository);
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeFarmId) {
        const [animals, events] = await Promise.all([
          getAnimalsUseCase.execute(activeFarmId),
          getEventsByFazendaUseCase.execute(activeFarmId),
        ]);

        setStats(buildHomeStats(animals.length, events.length));
      } else {
        setStats({ animais: 0, manejos: 0, fazendas: 0 });
      }
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
  }, [activeFarmId, getAnimalsUseCase, getEventsByFazendaUseCase]);

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
