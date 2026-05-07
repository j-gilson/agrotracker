import { useCallback, useEffect, useMemo, useState } from 'react';
import { MembershipRepositoryImpl } from '../../data/repositories/MembershipRepositoryImpl';
import { FazendaMember } from '../../domain/membership/entities/FazendaMember';
import { ChangeMemberRole } from '../../domain/membership/usecases/ChangeMemberRole';
import { GetMembersByFazenda } from '../../domain/membership/usecases/GetMembersByFazenda';
import { RemoveMember } from '../../domain/membership/usecases/RemoveMember';
import { ToggleMemberActive } from '../../domain/membership/usecases/ToggleMemberActive';
import { MemberRole } from '../../domain/membership/types';
import { humanizeError } from '../../core/utils/humanizeError';

export const useMembers = (fazendaId: string) => {
  const [members, setMembers] = useState<FazendaMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new MembershipRepositoryImpl(), []);
  const getMembers = useMemo(() => new GetMembersByFazenda(repository), [repository]);
  const changeRoleUseCase = useMemo(() => new ChangeMemberRole(repository), [repository]);
  const toggleUseCase = useMemo(() => new ToggleMemberActive(repository), [repository]);
  const removeUseCase = useMemo(() => new RemoveMember(repository), [repository]);

  const refresh = useCallback(async () => {
    if (!fazendaId) return;

    try {
      setLoading(true);
      setError(null);
      const list = await getMembers.execute(fazendaId);
      setMembers(list);
    } catch (err: unknown) {
      setError(humanizeError(err, 'Nao foi possivel carregar os membros.'));
    } finally {
      setLoading(false);
    }
  }, [fazendaId, getMembers]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const changeRole = useCallback(
    async (memberId: string, role: MemberRole) => {
      await changeRoleUseCase.execute(fazendaId, memberId, role);
      await refresh();
    },
    [changeRoleUseCase, fazendaId, refresh]
  );

  const toggleActive = useCallback(
    async (memberId: string) => {
      await toggleUseCase.execute(fazendaId, memberId);
      await refresh();
    },
    [fazendaId, refresh, toggleUseCase]
  );

  const remove = useCallback(
    async (memberId: string) => {
      await removeUseCase.execute(fazendaId, memberId);
      await refresh();
    },
    [fazendaId, refresh, removeUseCase]
  );

  return {
    members,
    loading,
    error,
    refresh,
    changeRole,
    toggleActive,
    remove,
  };
};

