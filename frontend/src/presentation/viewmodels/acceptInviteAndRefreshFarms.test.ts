import { describe, expect, it, vi } from 'vitest';
import { acceptInviteAndRefreshFarms } from './acceptInviteAndRefreshFarms';

describe('acceptInviteAndRefreshFarms', () => {
  it('aceita o convite antes de atualizar as fazendas', async () => {
    const calls: string[] = [];
    const acceptInvite = vi.fn(async () => {
      calls.push('accept');
    });
    const refreshFarms = vi.fn(async () => {
      calls.push('refresh');
    });

    await acceptInviteAndRefreshFarms({
      token: 'invite-token',
      acceptInvite,
      refreshFarms,
    });

    expect(acceptInvite).toHaveBeenCalledWith('invite-token');
    expect(refreshFarms).toHaveBeenCalledOnce();
    expect(calls).toEqual(['accept', 'refresh']);
  });

  it('nao atualiza fazendas quando o aceite falha', async () => {
    const acceptInvite = vi.fn(async () => {
      throw new Error('Falha no aceite');
    });
    const refreshFarms = vi.fn(async () => undefined);

    await expect(
      acceptInviteAndRefreshFarms({
        token: 'invite-token',
        acceptInvite,
        refreshFarms,
      })
    ).rejects.toThrow('Falha no aceite');

    expect(refreshFarms).not.toHaveBeenCalled();
  });

  it('propaga falha de sincronizacao depois do aceite', async () => {
    const acceptInvite = vi.fn(async () => undefined);
    const refreshFarms = vi.fn(async () => {
      throw new Error('Falha ao atualizar fazendas');
    });

    await expect(
      acceptInviteAndRefreshFarms({
        token: 'invite-token',
        acceptInvite,
        refreshFarms,
      })
    ).rejects.toThrow('Falha ao atualizar fazendas');

    expect(acceptInvite).toHaveBeenCalledOnce();
  });
});
