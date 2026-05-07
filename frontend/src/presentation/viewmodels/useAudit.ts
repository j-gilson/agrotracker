import { useCallback, useEffect, useMemo, useState } from 'react';
import { humanizeError } from '../../core/utils/humanizeError';
import { AuditRepositoryImpl } from '../../data/audit/repositories/AuditRepositoryImpl';
import { GetAuditByEntity } from '../../domain/audit/usecases/GetAuditByEntity';
import { GetAuditByFazenda } from '../../domain/audit/usecases/GetAuditByFazenda';
import { GetAuditByUser } from '../../domain/audit/usecases/GetAuditByUser';
import { PagedAudit } from '../../domain/audit/repositories/IAuditRepository';

export const useAuditByEntity = (entityType: string, entityId: string, params?: { page?: number; limit?: number }) => {
  const [data, setData] = useState<PagedAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new AuditRepositoryImpl(), []);
  const useCase = useMemo(() => new GetAuditByEntity(repository), [repository]);

  const refresh = useCallback(async () => {
    if (!entityType || !entityId) {
      setData(null);
      setError('Parâmetros insuficientes para carregar o histórico.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await useCase.execute(entityType, entityId, params);
      setData(result);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar o historico.'));
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, params, useCase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};

export const useAuditByFazenda = (fazendaId: string, initialParams?: { page?: number; limit?: number; startDate?: string; endDate?: string }) => {
  const [data, setData] = useState<PagedAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  const repository = useMemo(() => new AuditRepositoryImpl(), []);
  const useCase = useMemo(() => new GetAuditByFazenda(repository), [repository]);

  const refresh = useCallback(async () => {
    if (!fazendaId) {
      setData(null);
      setError('Nenhuma fazenda foi informada para carregar o histórico.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await useCase.execute(fazendaId, params);
      setData(result);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar o historico da fazenda.'));
    } finally {
      setLoading(false);
    }
  }, [fazendaId, params, useCase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh, setParams, params };
};

export const useAuditByUser = (userId: string, initialParams?: { page?: number; limit?: number; startDate?: string; endDate?: string }) => {
  const [data, setData] = useState<PagedAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  const repository = useMemo(() => new AuditRepositoryImpl(), []);
  const useCase = useMemo(() => new GetAuditByUser(repository), [repository]);

  const refresh = useCallback(async () => {
    if (!userId) {
      setData(null);
      setError('Nenhum usuário foi informado para carregar o histórico.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await useCase.execute(userId, params);
      setData(result);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar o historico do usuario.'));
    } finally {
      setLoading(false);
    }
  }, [params, useCase, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh, setParams, params };
};
