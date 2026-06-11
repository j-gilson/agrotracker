import { describe, expect, it, vi } from 'vitest';
import { refreshOnReturn } from './refreshOnReturn';

describe('refreshOnReturn', () => {
  const expectRefreshAfterReturn = async () => {
    const focusState = { current: false };
    const refresh = vi.fn(async () => undefined);

    await refreshOnReturn(focusState, refresh);
    expect(refresh).not.toHaveBeenCalled();

    await refreshOnReturn(focusState, refresh);
    expect(refresh).toHaveBeenCalledOnce();
  };

  it('atualiza o historico do animal depois da criacao', async () => {
    await expectRefreshAfterReturn();
  });

  it('atualiza a lista de manejos depois da criacao', async () => {
    await expectRefreshAfterReturn();
  });

  it('atualiza as estatisticas quando a Home recupera foco', async () => {
    await expectRefreshAfterReturn();
  });
});
