import { useCallback, useEffect, useState } from 'react';
import { MembershipRepositoryImpl } from '../../data/repositories/MembershipRepositoryImpl';
import { MemberRole } from '../../domain/membership/types';

export const useMyRole = (fazendaId: string | null) => {
  const [role, setRole] = useState<MemberRole | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRole = useCallback(async () => {
    if (!fazendaId) {
      setRole(null);
      return;
    }

    setLoading(true);
    try {
      const repository = new MembershipRepositoryImpl();
      const membership = await repository.getMyMembership(fazendaId);
      setRole(membership.role);
    } catch {
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [fazendaId]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  return { role, loading };
};
