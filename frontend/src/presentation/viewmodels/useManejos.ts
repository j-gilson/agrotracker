import { useState, useEffect, useMemo, useCallback } from 'react';
import { Event } from '../../domain/events/entities/Event';
import { GetEventsByFazenda } from '../../domain/events/usecases/GetEventsByFazenda';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useManejos = (activeFarmId: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getEventsUseCase = useMemo(() => {
    const repository = new EventRepositoryImpl();
    return new GetEventsByFazenda(repository);
  }, []);

  const fetchEvents = useCallback(async () => {
    if (!activeFarmId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getEventsUseCase.execute(activeFarmId);
      setEvents(result);
    } catch (err: unknown) {
      setError(
        humanizeError(err, 'Nao foi possivel carregar os manejos agora.')
      );
    } finally {
      setLoading(false);
    }
  }, [getEventsUseCase, activeFarmId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
  };
};
