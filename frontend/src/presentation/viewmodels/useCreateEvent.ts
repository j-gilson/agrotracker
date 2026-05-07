import { useCallback, useMemo, useState } from 'react';
import { CreateEvent } from '../../domain/events/usecases/CreateEvent';
import { Event } from '../../domain/events/entities/Event';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);

  const repository = useMemo(() => new EventRepositoryImpl(), []);
  const useCase = useMemo(() => new CreateEvent(repository), [repository]);

  const createEvent = useCallback(
    async (input: { animalId: string; fazendaId: string; type: string; description: string; date: Date }) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setCreatedEvent(null);

        const result = await useCase.execute(input);
        setCreatedEvent(result);
        setSuccess(true);
        return result;
      } catch (err: unknown) {
        setError(humanizeError(err, 'Nao foi possivel registrar o manejo agora.'));
        setSuccess(false);
        setCreatedEvent(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [useCase]
  );

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setCreatedEvent(null);
  }, []);

  return {
    createEvent,
    createdEvent,
    loading,
    error,
    success,
    resetState,
  };
};
