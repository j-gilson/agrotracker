import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animal } from '../../domain/entities/Animal';
import { GetAnimalById } from '../../domain/usecases/animal/GetAnimalById';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { Event } from '../../domain/events/entities/Event';
import { GetEventsByAnimal } from '../../domain/events/usecases/GetEventsByAnimal';
import { EventRepositoryImpl } from '../../data/events/repositories/EventRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useAnimalDetail = (animalId: string) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const animalRepository = useMemo(() => new AnimalRepositoryImpl(), []);
  const getAnimalUseCase = useMemo(
    () => new GetAnimalById(animalRepository),
    [animalRepository]
  );

  const eventRepository = useMemo(() => new EventRepositoryImpl(), []);
  const getEventsUseCase = useMemo(
    () => new GetEventsByAnimal(eventRepository),
    [eventRepository]
  );

  const fetchData = useCallback(async () => {
    if (!animalId) {
      setAnimal(null);
      setEvents([]);
      setError('Nenhum animal foi informado.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [animalResult, eventsResult] = await Promise.all([
        getAnimalUseCase.execute(animalId),
        getEventsUseCase.execute(animalId),
      ]);

      if (animalResult) {
        setAnimal(animalResult);
      } else {
        setAnimal(null);
        setError('Animal não encontrado.');
      }

      setEvents(eventsResult);
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel carregar os dados do animal.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [animalId, getAnimalUseCase, getEventsUseCase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    animal,
    events,
    loading,
    error,
    refresh: fetchData,
  };
};
