import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const screenPath = path.resolve(
  process.cwd(),
  'src/presentation/screens/AnimalDetailScreen.tsx'
);
const content = readFileSync(screenPath, 'utf-8');

describe('Sprint 7.4.4.5.2 — melhorias UX da ficha do animal', () => {
  it('destaca nome, codigo e status na area principal', () => {
    expect(content).toContain('styles.headerContent');
    expect(content).toContain('styles.animalCode');
    expect(content).toContain(
      "{animal?.codigoIdentificacao ?? 'Código não informado'}"
    );
    expect(content).toContain('<StatusBadge status={animal.status} />');
    expect(content).not.toContain(
      '<InfoRow label="Código de Identificação"'
    );
    expect(content).not.toContain('<InfoRow label="Status"');
  });

  it('usa badge visual para cada status do animal', () => {
    expect(content).toContain('const StatusBadge');
    expect(content).toContain("status === 'ATIVO' && styles.badgeAtivo");
    expect(content).toContain("status === 'VENDIDO' && styles.badgeVendido");
    expect(content).toContain("status === 'MORTO' && styles.badgeMorto");
    expect(content).toContain('theme.colors.primary');
    expect(content).toContain('theme.colors.warning');
    expect(content).toContain('theme.colors.danger');
  });

  it('usa labels amigaveis nos eventos reaproveitando EVENT_TYPE_OPTIONS', () => {
    expect(content).toContain('EVENT_TYPE_OPTIONS');
    expect(content).toContain('getEventTypeLabel(m.type)');
    expect(content).not.toContain('<Text style={styles.timelineTitle}>{m.type}</Text>');
  });

  it('altera apenas o texto da acao principal de manejo', () => {
    expect(content).toContain('title="Registrar Manejo"');
    expect(content).toContain('AppRoutes.CREATE_EVENT');
    expect(content).not.toContain('title="Novo Manejo"');
  });
});
