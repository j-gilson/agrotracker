import { useCallback, useEffect, useMemo, useState } from 'react';
import { Event } from '../../domain/events/entities/Event';
import { GetEventsByAnimal } from '../../domain/events/usecases/GetEventsByAnimal';
import { GetEventsByFazenda } from '../../domain/events/usecases/GetEventsByFazenda';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useEventsByAnimal = (animalId: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new EventRepositoryImpl(), []);
  const useCase = useMemo(() => new GetEventsByAnimal(repository), [repository]);

  const refresh = useCallback(async () => {
    if (!animalId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await useCase.execute(animalId);
      setEvents(result);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar o historico de eventos.'));
    } finally {
      setLoading(false);
    }
  }, [animalId, useCase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    events,
    loading,
    error,
    refresh,
  };
};

export const useEventsByFazenda = (fazendaId: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new EventRepositoryImpl(), []);
  const useCase = useMemo(() => new GetEventsByFazenda(repository), [repository]);

  const refresh = useCallback(async () => {
    if (!fazendaId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await useCase.execute(fazendaId);
      setEvents(result);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar os manejos.'));
    } finally {
      setLoading(false);
    }
  }, [fazendaId, useCase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    events,
    loading,
    error,
    refresh,
  };
};
