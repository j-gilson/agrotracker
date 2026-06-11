import { useCallback, useEffect, useMemo, useState } from 'react';
import { MembershipRepositoryImpl } from '../../data/repositories/MembershipRepositoryImpl';
import { MemberRole } from '../../domain/membership/types';
import { humanizeError } from '../utils/humanizeError';
import {
  canCreateAnimal,
  canEditFarm,
  canInviteMembers,
  canManageMembers,
  canManageFarm,
  canRegisterManejo,
  canViewMembers,
} from './permissions';

export const usePermissions = (fazendaId?: string) => {
  const [role, setRole] = useState<MemberRole | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(fazendaId?.trim()));
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new MembershipRepositoryImpl(), []);

  const refresh = useCallback(async (mountedRef?: { current: boolean }) => {
    const isMounted = () => mountedRef?.current ?? true;

    if (!fazendaId?.trim()) {
      if (isMounted()) {
        setRole(null);
        setError('Nenhuma fazenda foi informada para validar as permissões.');
        setLoading(false);
      }
      return;
    }

    try {
      if (isMounted()) {
        setLoading(true);
        setError(null);
      }

      const membership = await repository.getMyMembership(fazendaId);

      if (!isMounted()) {
        return;
      }

      setRole(membership.active ? membership.role : null);
    } catch (err: unknown) {
      if (!isMounted()) {
        return;
      }

      setError(humanizeError(err, 'Nao foi possivel carregar suas permissoes.'));
      setRole(null);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [fazendaId, repository]);

  useEffect(() => {
    const mountedRef = { current: true };

    void refresh(mountedRef);

    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  const isAdmin = role === 'ADMIN';
  const isFuncionario = role === 'FUNCIONARIO';
  const canCreateAnimalValue = canCreateAnimal(role);
  const canRegisterManejoValue = canRegisterManejo(role);

  return {
    loading,
    role,
    isAdmin,
    isFuncionario,
    canCreateAnimal: canCreateAnimalValue,
    canManageMembers: canManageMembers(role),
    canViewMembers: canViewMembers(role),
    error,
    refresh,
    canManageFarm: canManageFarm(role),
    canInviteMembers: canInviteMembers(role),
    canEditFarm: canEditFarm(role),
    canRegisterManejo: canRegisterManejoValue,
  };
};
