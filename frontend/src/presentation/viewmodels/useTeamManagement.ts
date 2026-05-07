import { useMemo } from 'react';
import { useAuthSession } from '../contexts/AuthContext';
import { useMembers } from './useMembers';

export const useTeamManagement = (fazendaId: string) => {
  const { user } = useAuthSession();
  const membersState = useMembers(fazendaId);

  const currentMember = useMemo(() => {
    if (!user?.id) return null;
    return membersState.members.find((m) => m.userId === user.id) ?? null;
  }, [membersState.members, user?.id]);

  return {
    ...membersState,
    currentMember,
  };
};

