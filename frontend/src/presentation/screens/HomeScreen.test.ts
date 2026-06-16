import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const homeScreenPath = path.resolve(
  process.cwd(),
  'src/presentation/screens/HomeScreen.tsx'
);
const content = readFileSync(homeScreenPath, 'utf-8');
const emptyStateStart = content.indexOf('if (farms.length === 0)');
const normalHomeStart = content.indexOf(
  'return (',
  emptyStateStart + 'if (farms.length === 0)'.length
);
const emptyHomeEnd = content.indexOf('\n  return (', normalHomeStart + 1);
const emptyHomeContent = content.slice(emptyStateStart, emptyHomeEnd);

describe('Sprint 7.3.2.3 — primeiro acesso sem fazendas', () => {
  it('Cenario 1: exibe Cadastrar fazenda sem fazendas', () => {
    expect(emptyHomeContent).toContain('buttonText="Cadastrar fazenda"');
  });

  it('Cenario 2: exibe Meus Convites sem fazendas', () => {
    expect(emptyHomeContent).toContain('<InvitesAccess />');
    expect(content).toContain('title="Meus Convites"');
  });

  it('Cenario 3: exibe Meu Perfil sem fazendas', () => {
    expect(emptyHomeContent).toContain('<ProfileAccess />');
    expect(content).toContain('title="Meu Perfil"');
  });

  it('Cenario 4: Convites navega para AppRoutes.INVITES', () => {
    expect(content).toContain('router.push(AppRoutes.INVITES as Href)');
  });

  it('Cenario 5: Perfil navega para AppRoutes.PROFILE', () => {
    expect(content).toContain('router.push(AppRoutes.PROFILE as Href)');
  });

  it('Cenario 6: criacao de fazenda permanece inalterada', () => {
    expect(content).toContain(
      'router.push({ pathname: AppRoutes.CREATE_FAZENDA })'
    );
    expect(emptyHomeContent).toContain('onPress={handleNovaFazendaPress}');
  });
});

describe('Sprint 7.4.2 — atualizacao automatica da Home', () => {
  it('sincroniza fazendas antes de atualizar as estatisticas ao recuperar foco', () => {
    const refreshFarmsIndex = content.indexOf('await refreshFarms();');
    const refreshStatsIndex = content.indexOf('await refresh();');

    expect(content).toContain('const refreshHome = useCallback(async () => {');
    expect(refreshFarmsIndex).toBeGreaterThan(-1);
    expect(refreshStatsIndex).toBeGreaterThan(refreshFarmsIndex);
    expect(content).toContain('refreshOnReturn(hasFocusedOnceRef, refreshHome)');
  });

  it('estado vazio da Home permite atualizacao manual por pull-to-refresh', () => {
    expect(emptyHomeContent).toContain('refreshControl={');
    expect(emptyHomeContent).toContain('onRefresh={refreshHome}');
    expect(emptyHomeContent).toContain('refreshing={farmsLoading || statsLoading}');
  });

  it('pull-to-refresh da Home com fazendas tambem sincroniza fazendas e estatisticas', () => {
    expect(content).toContain('onRefresh={refreshHome}');
    expect(content).not.toContain('onRefresh={refresh}\n');
  });
});

describe('Sprint 7.4.3.2.1 — estatisticas navegaveis da Home', () => {
  it('Animais navega para Inventario mantendo o valor da estatistica', () => {
    expect(content).toContain('const handleInventarioPress = () => {');
    expect(content).toContain('pathname: AppRoutes.INVENTARIO');
    expect(content).toContain('label="Animais"');
    expect(content).toContain('onPress={handleInventarioPress}');
    expect(content).toContain('value={stats.animais}');
  });

  it('Manejos navega para Manejos mantendo o valor da estatistica', () => {
    expect(content).toContain('const handleManejosPress = () => {');
    expect(content).toContain('pathname: AppRoutes.MANEJOS');
    expect(content).toContain('label="Manejos"');
    expect(content).toContain('onPress={handleManejosPress}');
    expect(content).toContain('value={stats.manejos}');
  });

  it('Fazendas navega para Lista de Fazendas mantendo o valor da estatistica', () => {
    expect(content).toContain('const handleFazendasPress = () => {');
    expect(content).toContain('pathname: AppRoutes.FAZENDAS');
    expect(content).toContain('label="Fazendas"');
    expect(content).toContain('onPress={handleFazendasPress}');
    expect(content).toContain('value={stats.fazendas}');
  });

  it('mantem affordance visual e acessibilidade dos cards de estatistica', () => {
    expect(content).toContain('accessibilityRole="button"');
    expect(content).toContain('accessibilityLabel={`${label}: ${value}. Abrir ${label}`}');
    expect(content).toContain('styles.statAffordance');
  });

  it('nao altera a Home vazia', () => {
    expect(emptyHomeContent).toContain('<InvitesAccess />');
    expect(emptyHomeContent).toContain('<ProfileAccess />');
    expect(emptyHomeContent).not.toContain('<StatCard');
  });
});
