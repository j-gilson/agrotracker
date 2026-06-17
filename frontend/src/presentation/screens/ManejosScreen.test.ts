import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const screenPath = path.resolve(
  process.cwd(),
  'src/presentation/screens/ManejosScreen.tsx'
);
const content = readFileSync(screenPath, 'utf-8');

describe('Sprint 7.4.4.4.2 — melhorias UX da tela de Manejos', () => {
  it('exibe estado sem fazenda com acao habilitada para selecionar fazenda', () => {
    expect(content).toContain('if (!activeFarmId)');
    expect(content).toContain('title="Nenhuma fazenda ativa"');
    expect(content).toContain(
      'subtitle="Selecione uma fazenda para visualizar e registrar manejos."'
    );
    expect(content).toContain('buttonText="Selecionar Fazenda"');
    expect(content).toContain(
      'onPress={() => router.push({ pathname: AppRoutes.FAZENDAS })}'
    );
    expect(content).not.toContain('disabled={!activeFarmId}');
    expect(content).not.toContain('title={activeFarmId ?');
  });

  it('mantem o fluxo atual do scanner com texto mais claro no botao principal', () => {
    expect(content).toContain(
      'router.push(AppRoutes.SCANNER_WITH_FAZENDA(activeFarmId))'
    );
    expect(content).toContain('title="Escanear para Novo Manejo"');
    expect(content).not.toContain("title={activeFarmId ? 'Novo Manejo'");
  });

  it('usa labels amigaveis para tipos de manejo reaproveitando o mapeamento existente', () => {
    expect(content).toContain('EVENT_TYPE_OPTIONS');
    expect(content).toContain('getEventTypeLabel(item.type)');
    expect(content).not.toContain('{item.type}</Text>');
  });

  it('remove IDs tecnicos dos cards mantendo tipo, data, descricao e CTA', () => {
    expect(content).not.toContain('Animal ID');
    expect(content).not.toContain('item.animalId}</Text>');
    expect(content).toContain('getEventTypeLabel(item.type)');
    expect(content).toContain('formatDate(item.date)');
    expect(content).toContain('{item.description}');
    expect(content).toContain('Ver animal →');
  });
});
