import { useCallback, useMemo, useState } from 'react';
import { UpdateAnimal } from '../../domain/usecases/animal/UpdateAnimal';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { UpdateAnimalDTO } from '../../domain/dtos/AnimalDTO';
import { Animal } from '../../domain/entities/Animal';
import { humanizeError } from '../../core/utils/humanizeError';

export const useUpdateAnimal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [updatedAnimal, setUpdatedAnimal] = useState<Animal | null>(null);

  const repository = useMemo(() => new AnimalRepositoryImpl(), []);
  const updateAnimalUseCase = useMemo(
    () => new UpdateAnimal(repository),
    [repository]
  );

  const updateAnimal = useCallback(
    async (id: string, data: UpdateAnimalDTO) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setUpdatedAnimal(null);

        const result = await updateAnimalUseCase.execute(id, {
          nome: data.nome?.trim() || null,
          raca: data.raca?.trim(),
          peso: data.peso,
          status: data.status,
        });

        setUpdatedAnimal(result);
        setSuccess(true);
        return result;
      } catch (err: unknown) {
        const message = humanizeError(
          err,
          'Nao foi possivel atualizar o animal agora. Tente novamente em instantes.'
        );
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [updateAnimalUseCase]
  );

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
    setUpdatedAnimal(null);
  }, []);

  return {
    updateAnimal,
    updatedAnimal,
    loading,
    error,
    success,
    resetState,
  };
};
