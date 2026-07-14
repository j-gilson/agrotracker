import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const screenPath = path.resolve(
  process.cwd(),
  'src/presentation/screens/FazendaListScreen.tsx'
);
const content = readFileSync(screenPath, 'utf-8');

describe('Sprint 7 — identificacao e selecao da Fazenda Ativa', () => {
  it('consome activeFarmId do ActiveFarmContext', () => {
    expect(content).toContain('activeFarmId');
    expect(content).toContain('useActiveFarm()');
  });

  it('fazenda ativa exibe badge Fazenda Ativa', () => {
    expect(content).toContain('Fazenda Ativa');
    expect(content).toContain('styles.badge');
    expect(content).toContain('styles.badgeText');
  });

  it('fazenda ativa nao exibe botao Selecionar', () => {
    expect(content).toContain('!isActive ? (');
    expect(content).toContain('title="Selecionar"');
  });

  it('fazenda nao ativa exibe acao Selecionar', () => {
    expect(content).toContain('item.id && !isActive ?');
    expect(content).toContain('variant="secondary"');
  });

  it('selecao chama setActiveFarm com o id correto', () => {
    expect(content).toContain('handleSelectFarm');
    expect(content).toContain('await setActiveFarm(fazendaId)');
  });

  it('feedback de sucesso exibe Snackbar', () => {
    expect(content).toContain('Fazenda Ativa atualizada com sucesso.');
    expect(content).toContain("variant: 'success'");
  });

  it('tratamento de erro preserva estado anterior', () => {
    expect(content).toContain('catch');
    expect(content).toContain('Não foi possível atualizar a Fazenda Ativa.');
    expect(content).toContain("variant: 'error'");
  });

  it('loading impede selecoes duplicadas', () => {
    expect(content).toContain('selectingId');
    expect(content).toContain('if (selectingId) return');
    expect(content).toContain('disabled={selectingId !== null}');
    expect(content).toContain('loading={selectingId === item.id}');
  });

  it('fazenda ativa aplicac accessibilityState selected', () => {
    expect(content).toContain('accessibilityState={isActive ? { selected: true } : undefined}');
  });

  it('fazenda ativa usa accessibilityLabel com nome e Fazenda Ativa', () => {
    expect(content).toContain('${item.nome}. Fazenda Ativa.');
  });

  it('fazenda nao ativa usa accessibilityLabel Selecionar', () => {
    expect(content).toContain('`Selecionar ${item.nome} como Fazenda Ativa.`');
  });

  it('fazenda ativa aplica borda diferenciada via cardActive', () => {
    expect(content).toContain('styles.cardActive');
    expect(content).toContain('borderColor: theme.colors.primary');
  });

  it('preserva navigacao existente para ANIMAL_LIST', () => {
    expect(content).toContain('AppRoutes.ANIMAL_LIST');
    expect(content).toContain('params: { fazendaId }');
  });

  it('preserva navigacao existente para MANEJOS', () => {
    expect(content).toContain('AppRoutes.MANEJOS');
    expect(content).toContain('handleManejosPress');
  });

  it('preserva botao Nova Fazenda', () => {
    expect(content).toContain('Nova Fazenda');
    expect(content).toContain('AppRoutes.CREATE_FAZENDA');
  });

  it('preserva titulo Minhas Fazendas', () => {
    expect(content).toContain('Minhas Fazendas');
  });

  it('preserva botao Ver Manejos', () => {
    expect(content).toContain('Ver Manejos');
    expect(content).toContain('variant="ghost"');
  });
});
