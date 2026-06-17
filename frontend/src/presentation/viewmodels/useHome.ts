import { useState, useEffect, useMemo, useCallback } from 'react';
import { GetAnimals } from '../../domain/usecases/animal/GetAnimals';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { GetEventsByFazenda } from '../../domain/events/usecases/GetEventsByFazenda';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { Event } from '../../domain/events/entities/Event';
import { humanizeError } from '../../core/utils/humanizeError';
import { buildHomeStats, HomeStats } from './homeStats';

const LATEST_EVENTS_LIMIT = 3;

export const selectLatestEvents = (events: Event[]): Event[] =>
  [...events]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, LATEST_EVENTS_LIMIT);

export const useHome = (activeFarmId: string | null, farmsCount: number) => {
  const [stats, setStats] = useState<HomeStats>({
    animais: 0,
    manejos: 0,
    fazendas: 0,
  });
  const [latestEvents, setLatestEvents] = useState<Event[]>([]);
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

        setStats(buildHomeStats(animals.length, events.length, farmsCount));
        setLatestEvents(selectLatestEvents(events));
      } else {
        setStats({ animais: 0, manejos: 0, fazendas: farmsCount });
        setLatestEvents([]);
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
  }, [activeFarmId, farmsCount, getAnimalsUseCase, getEventsByFazendaUseCase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    latestEvents,
    loading,
    error,
    refresh: fetchStats,
  };
};
