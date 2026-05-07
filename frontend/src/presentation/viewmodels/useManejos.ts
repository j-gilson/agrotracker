import { useState, useEffect, useMemo, useCallback } from 'react';
import { Event } from '../../domain/events/entities/Event';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { GetEventsByFazenda } from '../../domain/events/usecases/GetEventsByFazenda';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useManejos = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [selectedFazendaId, setSelectedFazendaId] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFazendasUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new GetFazendas(repository);
  }, []);

  const getEventsUseCase = useMemo(() => {
    const repository = new EventRepositoryImpl();
    return new GetEventsByFazenda(repository);
  }, []);

  const fetchFazendas = useCallback(async () => {
    try {
      const result = await getFazendasUseCase.execute();
      setFazendas(result);
      if (result.length > 0 && !selectedFazendaId) {
        setSelectedFazendaId(result[0].id ?? null);
      }
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar as fazendas.'));
    }
  }, [getFazendasUseCase, selectedFazendaId]);

  const fetchEvents = useCallback(async () => {
    if (!selectedFazendaId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getEventsUseCase.execute(selectedFazendaId);
      setEvents(result);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar os manejos agora.'));
    } finally {
      setLoading(false);
    }
  }, [getEventsUseCase, selectedFazendaId]);

  useEffect(() => {
    fetchFazendas();
  }, [fetchFazendas]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    fazendas,
    selectedFazendaId,
    setSelectedFazendaId,
    events,
    loading,
    error,
    refresh: fetchEvents,
  };
};
