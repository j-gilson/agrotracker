import { useCallback, useEffect, useMemo, useState } from 'react';
import { MembershipRepositoryImpl } from '../../data/repositories/MembershipRepositoryImpl';
import { Invite } from '../../domain/membership/entities/Invite';
import { AcceptInvite } from '../../domain/membership/usecases/AcceptInvite';
import { GetPendingInvites } from '../../domain/membership/usecases/GetPendingInvites';
import { RejectInvite } from '../../domain/membership/usecases/RejectInvite';
import { humanizeError } from '../../core/utils/humanizeError';
import { acceptInviteAndRefreshFarms } from './acceptInviteAndRefreshFarms';

export const useInvites = (refreshFarms: () => Promise<void>) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new MembershipRepositoryImpl(), []);
  const getPendingInvites = useMemo(
    () => new GetPendingInvites(repository),
    [repository]
  );
  const acceptInvite = useMemo(() => new AcceptInvite(repository), [repository]);
  const rejectInvite = useMemo(() => new RejectInvite(repository), [repository]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setInvites(await getPendingInvites.execute());
    } catch (err: unknown) {
      setError(
        humanizeError(err, 'Nao foi possivel carregar seus convites.')
      );
    } finally {
      setLoading(false);
    }
  }, [getPendingInvites]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const accept = useCallback(
    async (invite: Invite) => {
      try {
        setProcessingId(invite.id);
        setError(null);
        await acceptInviteAndRefreshFarms({
          token: invite.token,
          acceptInvite: (token) => acceptInvite.execute(token),
          refreshFarms,
        });
        setInvites((current) =>
          current.filter((item) => item.id !== invite.id)
        );
      } catch (err: unknown) {
        throw new Error(
          humanizeError(err, 'Nao foi possivel aceitar o convite.')
        );
      } finally {
        setProcessingId(null);
      }
    },
    [acceptInvite, refreshFarms]
  );

  const reject = useCallback(
    async (inviteId: string) => {
      try {
        setProcessingId(inviteId);
        setError(null);
        await rejectInvite.execute(inviteId);
        setInvites((current) =>
          current.filter((item) => item.id !== inviteId)
        );
      } catch (err: unknown) {
        throw new Error(
          humanizeError(err, 'Nao foi possivel recusar o convite.')
        );
      } finally {
        setProcessingId(null);
      }
    },
    [rejectInvite]
  );

  return {
    invites,
    loading,
    processingId,
    error,
    refresh,
    accept,
    reject,
  };
};
