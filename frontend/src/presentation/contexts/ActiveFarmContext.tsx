import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Fazenda } from '../../domain/fazenda/entities/Fazenda';
import { GetFazendas } from '../../domain/fazenda/usecases/GetFazendas';
import { FazendaRepositoryImpl } from '../../data/fazenda/repositories/FazendaRepositoryImpl';
import { activeFarmStore } from '../../core/storage/ActiveFarmStore';
import { useAuthSession } from './AuthContext';
import { resolveActiveFarmId } from './resolveActiveFarmId';

interface ActiveFarmContextValue {
  activeFarmId: string | null;
  activeFarm: Fazenda | null;
  farms: Fazenda[];
  loading: boolean;
  setActiveFarm: (fazendaId: string) => Promise<void>;
  refreshFarms: () => Promise<void>;
}

const ActiveFarmContext = createContext<ActiveFarmContextValue | null>(null);

export const ActiveFarmProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status: authStatus } = useAuthSession();
  const [farms, setFarms] = useState<Fazenda[]>([]);
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getFazendasUseCase = useMemo(() => {
    const repository = new FazendaRepositoryImpl();
    return new GetFazendas(repository);
  }, []);

  const fetchFazendas = useCallback(async (): Promise<Fazenda[]> => {
    try {
      const result = await getFazendasUseCase.execute();
      setFarms(result);
      return result;
    } catch {
      return [];
    }
  }, [getFazendasUseCase]);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      setFarms([]);
      setActiveFarmId(null);
      setLoading(false);
      return;
    }

    if (authStatus !== 'authenticated') return;

    let cancelled = false;

    const initialize = async () => {
      setLoading(true);

      const [savedId, loadedFarms] = await Promise.all([
        activeFarmStore.get(),
        fetchFazendas(),
      ]);

      if (cancelled) return;

      const nextActiveFarmId = resolveActiveFarmId(
        loadedFarms,
        null,
        savedId
      );

      setActiveFarmId(nextActiveFarmId);
      if (nextActiveFarmId && nextActiveFarmId !== savedId) {
        await activeFarmStore.set(nextActiveFarmId);
      }

      setLoading(false);
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [authStatus, fetchFazendas]);

  const setActiveFarm = useCallback(async (fazendaId: string) => {
    setActiveFarmId(fazendaId);
    await activeFarmStore.set(fazendaId);
  }, []);

  const activeFarmIdRef = useRef(activeFarmId);
  activeFarmIdRef.current = activeFarmId;

  const refreshFarms = useCallback(async () => {
    const loadedFarms = await fetchFazendas();
    const currentId = activeFarmIdRef.current;

    const savedId = await activeFarmStore.get();
    const nextActiveFarmId = resolveActiveFarmId(
      loadedFarms,
      currentId,
      savedId
    );

    setActiveFarmId(nextActiveFarmId);

    if (nextActiveFarmId) {
      if (nextActiveFarmId !== savedId) {
        await activeFarmStore.set(nextActiveFarmId);
      }
    } else {
      await activeFarmStore.clear();
    }
  }, [fetchFazendas]);

  const activeFarm = useMemo(() => {
    if (!activeFarmId) return null;
    return farms.find((f) => f.id === activeFarmId) ?? null;
  }, [activeFarmId, farms]);

  const value: ActiveFarmContextValue = {
    activeFarmId,
    activeFarm,
    farms,
    loading,
    setActiveFarm,
    refreshFarms,
  };

  return (
    <ActiveFarmContext.Provider value={value}>
      {children}
    </ActiveFarmContext.Provider>
  );
};

export const useActiveFarm = (): ActiveFarmContextValue => {
  const ctx = useContext(ActiveFarmContext);
  if (!ctx) {
    throw new Error('useActiveFarm deve ser usado dentro de ActiveFarmProvider');
  }
  return ctx;
};
