import { useCallback, useMemo, useState } from 'react';
import { CreateAnimal } from '../../domain/usecases/animal/CreateAnimal';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { CreateAnimalDTO } from '../../domain/dtos/AnimalDTO';
import { Animal } from '../../domain/entities/Animal';
import { humanizeError } from '../../core/utils/humanizeError';

export const useCreateAnimal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdAnimal, setCreatedAnimal] = useState<Animal | null>(null);

  const repository = useMemo(() => new AnimalRepositoryImpl(), []);
  const createAnimalUseCase = useMemo(
    () => new CreateAnimal(repository),
    [repository]
  );

  const createAnimal = useCallback(
    async (data: CreateAnimalDTO) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setCreatedAnimal(null);

        const result = await createAnimalUseCase.execute(data);

        setCreatedAnimal(result);
        setSuccess(true);
        return result;
      } catch (err: unknown) {
        const message = humanizeError(
          err,
          'Nao foi possivel cadastrar o animal agora. Tente novamente em instantes.'
        );
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [createAnimalUseCase]
  );

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
    setCreatedAnimal(null);
  }, []);

  return {
    createAnimal,
    createdAnimal,
    loading,
    error,
    success,
    resetState,
  };
};
