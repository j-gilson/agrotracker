import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animal } from '../../domain/entities/Animal';
import { GetAnimals } from '../../domain/usecases/animal/GetAnimals';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';

export const useAnimals = (fazendaId: string) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Instâncias estáveis (Clean Architecture correta)
  const repository = useMemo(() => new AnimalRepositoryImpl(), []);
  const getAnimalsUseCase = useMemo(
    () => new GetAnimals(repository),
    [repository]
  );

  // ✅ FUNÇÃO ESTÁVEL (ESSENCIAL)
  const fetchAnimals = useCallback(async () => {
    if (!fazendaId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await getAnimalsUseCase.execute(fazendaId);
      setAnimals(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar animais');
    } finally {
      setLoading(false);
    }
  }, [fazendaId, getAnimalsUseCase]);

  // ✅ useEffect seguro (sem loop)
  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  return {
    animals,
    loading,
    error,
    refresh: fetchAnimals, // agora é estável
  };
};