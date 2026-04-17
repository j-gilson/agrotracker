import { useState, useEffect, useMemo, useCallback } from 'react';
import { Animal } from '../../domain/entities/Animal';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { GetAnimals } from '../../domain/usecases/animal/GetAnimals';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { AnimalRepositoryImpl } from '../../data/repositories/AnimalRepositoryImpl';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { humanizeError } from '../../core/utils/humanizeError';

export const useInventario = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [selectedFazendaId, setSelectedFazendaId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAnimalsUseCase = useMemo(() => {
    const repository = new AnimalRepositoryImpl();
    return new GetAnimals(repository);
  }, []);

  const getFazendasUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new GetFazendas(repository);
  }, []);

  const fetchFazendas = useCallback(async () => {
    try {
      const result = await getFazendasUseCase.execute();
      setFazendas(result);
      if (result.length > 0 && !selectedFazendaId) {
        setSelectedFazendaId(result[0].id || null);
      }
    } catch (err) {
      setError(
        humanizeError(
          err,
          'Nao foi possivel carregar as fazendas do inventario.'
        )
      );
    }
  }, [getFazendasUseCase, selectedFazendaId]);

  const fetchAnimals = useCallback(async () => {
    if (!selectedFazendaId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await getAnimalsUseCase.execute(selectedFazendaId);
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
  }, [getAnimalsUseCase, selectedFazendaId]);

  useEffect(() => {
    fetchFazendas();
  }, [fetchFazendas]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  return {
    animals,
    fazendas,
    selectedFazendaId,
    setSelectedFazendaId,
    loading,
    error,
    refresh: fetchAnimals,
  };
};
