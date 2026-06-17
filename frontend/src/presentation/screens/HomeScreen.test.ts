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
const normalHomeContent = content.slice(emptyHomeEnd);

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
    expect(content).toContain('actionLabel="Ver Inventário →"');
    expect(content).toContain('actionLabel="Ver Manejos →"');
    expect(content).toContain('actionLabel="Gerenciar →"');
  });

  it('nao altera a Home vazia', () => {
    expect(emptyHomeContent).toContain('<InvitesAccess />');
    expect(emptyHomeContent).toContain('<ProfileAccess />');
    expect(emptyHomeContent).not.toContain('<StatCard');
  });
});

describe('Sprint 7.4.4.1 — reorganizacao UX da Home', () => {
  it('usa acesso compacto ao perfil no header da Home com fazendas', () => {
    expect(normalHomeContent).toContain('<CompactProfileAccess />');
    expect(normalHomeContent).not.toContain('<ProfileAccess />');
    expect(content).toContain('accessibilityLabel="Abrir Meu Perfil"');
    expect(content).toContain('router.push(AppRoutes.PROFILE as Href)');
  });

  it('exibe bloco visual de Fazenda Ativa com acao de troca', () => {
    expect(normalHomeContent).toContain('styles.activeFarmCard');
    expect(normalHomeContent).toContain('Fazenda Ativa');
    expect(normalHomeContent).toContain('activeFarm?.nome');
    expect(normalHomeContent).toContain('Trocar Fazenda');
    expect(normalHomeContent).toContain('onPress={handleFazendasPress}');
  });

  it('remove chips horizontais e mantem troca de fazenda pelo bloco de contexto', () => {
    expect(normalHomeContent).toContain('styles.activeFarmCard');
    expect(normalHomeContent).toContain('Trocar Fazenda');
    expect(normalHomeContent).toContain('onPress={handleFazendasPress}');
    expect(normalHomeContent).not.toContain('styles.farmChipsContainer');
    expect(normalHomeContent).not.toContain('farms.map');
    expect(normalHomeContent).not.toContain('setActiveFarm');
  });

  it('reordena a Home com estatisticas antes do scanner', () => {
    const headerIndex = normalHomeContent.indexOf('styles.headerRow');
    const farmIndex = normalHomeContent.indexOf('styles.farmSelectorSection');
    const statsIndex = normalHomeContent.indexOf('styles.statsRow');
    const scannerIndex = normalHomeContent.indexOf('styles.scanButton');
    const latestEventsIndex = normalHomeContent.indexOf('<LatestEventsSection />');
    const quickActionsIndex = normalHomeContent.indexOf('Ações Rápidas');

    expect(headerIndex).toBeGreaterThan(-1);
    expect(farmIndex).toBeGreaterThan(headerIndex);
    expect(statsIndex).toBeGreaterThan(farmIndex);
    expect(scannerIndex).toBeGreaterThan(statsIndex);
    expect(latestEventsIndex).toBeGreaterThan(scannerIndex);
    expect(quickActionsIndex).toBeGreaterThan(latestEventsIndex);
  });

  it('remove o botao redundante Ver Todas as Fazendas', () => {
    expect(content).not.toContain('title="Ver Todas as Fazendas"');
    expect(content).not.toContain('styles.secondaryButton');
  });
});

describe('Sprint 7.4.4.2 — ultimos manejos na Home', () => {
  it('exibe a secao apos o scanner e antes das acoes rapidas', () => {
    expect(normalHomeContent).toContain('<LatestEventsSection />');
    expect(content).toContain('Últimos Manejos');
    expect(content).toContain('latestEvents.map');
    expect(content).toContain('formatDate(event.date)');
    expect(content).toContain('numberOfLines={2}');
  });

  it('usa tipos amigaveis e nao exibe IDs tecnicos dos eventos', () => {
    expect(content).toContain('EVENT_TYPE_OPTIONS');
    expect(content).toContain('getEventTypeLabel(event.type)');
    expect(content).not.toContain('Animal ID');
    expect(content).not.toContain('event.animalId');
    expect(content).not.toContain('event.fazendaId');
  });

  it('exibe estado vazio compacto e CTA para todos os manejos', () => {
    expect(content).toContain('Nenhum manejo registrado ainda.');
    expect(content).toContain('styles.latestEventsEmptyCard');
    expect(content).not.toContain('<EmptyState title="Nenhum manejo registrado ainda."');
    expect(content).toContain('Ver todos os manejos →');
    expect(content).toContain('onPress={handleManejosPress}');
  });
});

describe('Sprint 7.4.4.7.3 e 7.4.4.7.4 — ajustes finais da Home', () => {
  it('mantem a fazenda ativa clara sem chips duplicados', () => {
    expect(content).toContain('Fazenda Ativa');
    expect(content).toContain('activeFarm?.nome');
    expect(content).toContain('Trocar Fazenda');
    expect(content).not.toContain('styles.farmChip');
    expect(content).not.toContain('styles.farmChipActive');
    expect(content).not.toContain('styles.farmChipText');
  });

  it('transforma acoes rapidas em acoes de criacao', () => {
    expect(content).toContain('label="Cadastrar Animal"');
    expect(content).toContain('label="Registrar Manejo"');
    expect(content).toContain('label="Nova Fazenda"');
    expect(content).not.toContain('label="Inventário"');
  });

  it('preserva fluxos existentes nas acoes rapidas', () => {
    expect(content).toContain('const handleCadastrarAnimalPress = () => {');
    expect(content).toContain('pathname: AppRoutes.CREATE_ANIMAL');
    expect(content).toContain('params: activeFarmId ? { fazendaId: activeFarmId } : {}');
    expect(content).toContain('onPress={handleScanPress}');
    expect(content).toContain('onPress={handleNovaFazendaPress}');
  });

  it('usa cards horizontais com seta visual nas acoes rapidas', () => {
    expect(content).toContain('styles.quickActionsList');
    expect(content).toContain('styles.quickActionCta');
    expect(content).toContain('→');
    expect(content).not.toContain('styles.quickActionsRow');
  });
});
