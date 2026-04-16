import { useState } from 'react';
import { CreateAnimal } from '../../domain/usecases/animal/CreateAnimal';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { CreateAnimalDTO } from '../../domain/dtos/AnimalDTO';

export const useCreateAnimal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Injeção de dependência manual (idealmente via DI container ou hook de contexto)
  const repository = new AnimalRepositoryImpl();
  const createAnimalUseCase = new CreateAnimal(repository);

  const createAnimal = async (data: CreateAnimalDTO) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await createAnimalUseCase.execute(data);
      
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro ao cadastrar o animal.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    createAnimal,
    loading,
    error,
    success,
    resetState,
  };
};
