import { useState, useEffect, useMemo, useCallback } from 'react';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { GetAnimals } from '../../domain/usecases/animal/GetAnimals';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { GetEventsByFazenda } from '../../domain/events/usecases/GetEventsByFazenda';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
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

      const fazendas = await getFazendasUseCase.execute();
      const fazendaIds = fazendas
        .map((fazenda) => fazenda.id)
        .filter((id): id is string => Boolean(id));

      const [animalsByFazenda, eventsByFazenda] = await Promise.all([
        Promise.all(fazendaIds.map((fazendaId) => getAnimalsUseCase.execute(fazendaId))),
        Promise.all(fazendaIds.map((fazendaId) => getEventsByFazendaUseCase.execute(fazendaId))),
      ]);

      setStats({
        animais: animalsByFazenda.reduce((total, items) => total + items.length, 0),
        manejos: eventsByFazenda.reduce((total, items) => total + items.length, 0),
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
  }, [getAnimalsUseCase, getEventsByFazendaUseCase, getFazendasUseCase]);

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
