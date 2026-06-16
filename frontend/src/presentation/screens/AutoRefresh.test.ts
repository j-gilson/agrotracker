import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();

const readScreen = (screen: string) =>
  readFileSync(
    path.resolve(projectRoot, 'src/presentation/screens', screen),
    'utf-8'
  );

describe('Sprint 7.4.2 — atualizacao automatica de telas', () => {
  it('FazendaList atualiza fazendas quando recupera foco', () => {
    const content = readScreen('FazendaListScreen.tsx');

    expect(content).toContain('useFocusEffect');
    expect(content).toContain('refreshOnReturn(hasFocusedOnceRef, refresh)');
    expect(content).toContain('refreshFarms: refresh');
  });

  it('Inventario preserva uma unica carga inicial e atualiza apenas ao retornar', () => {
    const screenContent = readScreen('InventarioScreen.tsx');
    const hookContent = readFileSync(
      path.resolve(projectRoot, 'src/presentation/viewmodels/useInventario.ts'),
      'utf-8'
    );

    expect(hookContent).toContain('useEffect(() =>');
    expect(hookContent).toContain('fetchAnimals();');
    expect(screenContent).toContain('useFocusEffect');
    expect(screenContent).toContain('refreshOnReturn(hasFocusedOnceRef, refresh)');
    expect(screenContent).not.toContain('      refresh();\n    }, [refresh])');
  });

  it('EditAnimalScreen declara as dependencias exigidas no efeito de sucesso', () => {
    const content = readScreen('EditAnimalScreen.tsx');

    expect(content).toContain('animal?.codigoIdentificacao');
    expect(content).toContain('animal?.nome');
    expect(content).toContain('animalId');
    expect(content).toContain('resetState');
    expect(content).toContain('showSnackbar');
    expect(content).toContain('success');
  });
});

describe('Sprint 7.4.3.2.3 — CTA explicito em cards navegaveis', () => {
  it('card da fazenda continua abrindo a fazenda e exibe CTA visual', () => {
    const content = readScreen('FazendaListScreen.tsx');

    expect(content).toContain('const handleFazendaPress = (fazendaId: string) => {');
    expect(content).toContain('pathname: AppRoutes.ANIMAL_LIST');
    expect(content).toContain('onPress={() => item.id && handleFazendaPress(item.id)}');
    expect(content).toContain('Abrir Fazenda &gt;');
    expect(content).toContain('styles.cardCta');
  });

  it('card de manejo continua abrindo o animal e exibe CTA visual', () => {
    const content = readScreen('ManejosScreen.tsx');

    expect(content).toContain('router.push(AppRoutes.ANIMAL_DETAIL(item.animalId))');
    expect(content).toContain('Ver Animal &gt;');
    expect(content).toContain('styles.cardCta');
  });
});
