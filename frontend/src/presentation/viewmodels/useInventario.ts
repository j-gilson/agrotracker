import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animal } from '../../domain/entities/Animal';
import { GetAnimals } from '../../domain/usecases/animal/GetAnimals';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useInventario = (activeFarmId: string | null) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAnimalsUseCase = useMemo(() => {
    const repository = new AnimalRepositoryImpl();
    return new GetAnimals(repository);
  }, []);

  const fetchAnimals = useCallback(async () => {
    if (!activeFarmId) {
      setAnimals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getAnimalsUseCase.execute(activeFarmId);
      setAnimals(result);
    } catch (err: unknown) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel carregar o inventario agora.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, [getAnimalsUseCase, activeFarmId]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  return {
    animals,
    loading,
    error,
    refresh: fetchAnimals,
  };
};
