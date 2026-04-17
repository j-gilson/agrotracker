import { useState, useMemo, useCallback } from 'react';
import { CreateFazenda } from '../../domain/fazenda/usecases/CreateFazenda';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { CreateFazendaDTO } from '../../domain/fazenda/dtos/FazendaDTO';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { humanizeError } from '../../core/utils/humanizeError';

export const useCreateFazenda = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdFazenda, setCreatedFazenda] = useState<Fazenda | null>(null);

  const createFazendaUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new CreateFazenda(repository);
  }, []);

  const createFazenda = async (data: CreateFazendaDTO) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setCreatedFazenda(null);

      const result = await createFazendaUseCase.execute(data);
      
      setCreatedFazenda(result);
      setSuccess(true);
      return result;
    } catch (err: unknown) {
      const message = humanizeError(
        err,
        'Nao foi possivel cadastrar a fazenda agora. Tente novamente em instantes.'
      );
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
    setCreatedFazenda(null);
  }, []);

  return {
    createFazenda,
    createdFazenda,
    loading,
    error,
    success,
    resetState,
  };
};
