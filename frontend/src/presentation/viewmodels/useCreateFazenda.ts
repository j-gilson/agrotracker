import { useState, useMemo } from 'react';
import { CreateFazenda } from '../../domain/fazenda/usecases/CreateFazenda';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { CreateFazendaDTO } from '../../domain/fazenda/dtos/FazendaDTO';

export const useCreateFazenda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createFazendaUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new CreateFazenda(repository);
  }, []);

  const createFazenda = async (data: CreateFazendaDTO) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await createFazendaUseCase.execute(data);
      
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao cadastrar a fazenda.';
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
    createFazenda,
    loading,
    error,
    success,
    resetState,
  };
};
