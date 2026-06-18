import { describe, expect, it, vi } from 'vitest';
import { acceptInviteAndRefreshFarms } from './acceptInviteAndRefreshFarms';

describe('acceptInviteAndRefreshFarms', () => {
  it('aceita o convite antes de atualizar as fazendas e retorna o fazendaId', async () => {
    const calls: string[] = [];
    const acceptInvite = vi.fn(async () => {
      calls.push('accept');
      return { fazendaId: 'farm-1' };
    });
    const refreshFarms = vi.fn(async () => {
      calls.push('refresh');
    });

    const fazendaId = await acceptInviteAndRefreshFarms({
      token: 'invite-token',
      acceptInvite,
      refreshFarms,
    });

    expect(acceptInvite).toHaveBeenCalledWith('invite-token');
    expect(refreshFarms).toHaveBeenCalledOnce();
    expect(calls).toEqual(['accept', 'refresh']);
    expect(fazendaId).toBe('farm-1');
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
    const acceptInvite = vi.fn(async () => ({ fazendaId: 'farm-1' }));
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
