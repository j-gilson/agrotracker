import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animal } from '../../domain/entities/Animal';
import { Evento } from '../../domain/entities/Evento';
import { GetAnimalById } from '../../domain/usecases/animal/GetAnimalById';
import { GetEvents } from '../../domain/usecases/evento/GetEvents';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { EventoRepositoryImpl } from '../../data/repositories/EventoRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useAnimalDetail = (animalId: string) => {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [manejos, setManejos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAnimalUseCase = useMemo(() => {
    const repository = new AnimalRepositoryImpl();
    return new GetAnimalById(repository);
  }, []);

  const getEventsUseCase = useMemo(() => {
    const repository = new EventoRepositoryImpl();
    return new GetEvents(repository);
  }, []);

  const fetchData = useCallback(async () => {
    if (!animalId) return;

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
        setError('Animal não encontrado.');
      }

      setManejos(eventsResult);
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
    manejos,
    loading,
    error,
    refresh: fetchData,
  };
};
