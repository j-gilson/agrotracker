import { useCallback, useMemo, useState } from 'react';
import { MembershipRepositoryImpl } from '../../data/repositories/MembershipRepositoryImpl';
import { Invite } from '../../domain/membership/entities/Invite';
import { MemberRole } from '../../domain/membership/types';
import { InviteUserToFazenda } from '../../domain/membership/usecases/InviteUserToFazenda';
import { humanizeError } from '../../core/utils/humanizeError';

export const useInviteUser = (fazendaId: string) => {
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<MemberRole>('FUNCIONARIO');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);

  const repository = useMemo(() => new MembershipRepositoryImpl(), []);
  const inviteUseCase = useMemo(() => new InviteUserToFazenda(repository), [repository]);

  const submit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const created = await inviteUseCase.execute(fazendaId, email, role);
      setInvite(created);
      return created;
    } catch (err: unknown) {
      setInvite(null);
      setError(humanizeError(err, 'Nao foi possivel enviar o convite.'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [email, fazendaId, inviteUseCase, role]);

  return {
    email,
    setEmail,
    role,
    setRole,
    loading,
    error,
    invite,
    inviteUser: submit,
  };
};

