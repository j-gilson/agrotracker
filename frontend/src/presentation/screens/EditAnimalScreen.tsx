import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { useAnimalDetail } from '../viewmodels/useAnimalDetail';
import { useUpdateAnimal } from '../viewmodels/useUpdateAnimal';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, ErrorState, Input, useSnackbar } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { StatusAnimal } from '../../domain/entities/Animal';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

const STATUS_OPTIONS: StatusAnimal[] = ['ATIVO', 'VENDIDO', 'MORTO'];

const getParam = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : Array.isArray(value) ? value[0] ?? '' : '';

export const EditAnimalScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const animalId = getParam(params.id);

  const { animal, loading: loadingDetail } = useAnimalDetail(animalId);
  const { updateAnimal, loading: saving, error, success, resetState } = useUpdateAnimal();
  const { showSnackbar } = useSnackbar();

  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [peso, setPeso] = useState('');
  const [status, setStatus] = useState<StatusAnimal>('ATIVO');

  useEffect(() => {
    if (animal) {
      setNome(animal.nome || '');
      setRaca(animal.raca);
      setPeso(String(animal.peso));
      setStatus(animal.status);
    }
  }, [animal]);

  useEffect(() => {
    if (!success) return;

    showSnackbar({
      message: `${animal?.nome || animal?.codigoIdentificacao || 'Animal'} atualizado com sucesso.`,
      variant: 'success',
    });
    resetState();

    if (animalId) {
      router.replace(AppRoutes.ANIMAL_DETAIL(animalId));
    }
  }, [
    animal?.codigoIdentificacao,
    animal?.nome,
    animalId,
    resetState,
    showSnackbar,
    success,
  ]);

  const racaError =
    raca.length > 0 && raca.trim().length < 2
      ? 'Informe a raça do animal.'
      : undefined;
  const pesoError =
    peso.length > 0 && (Number.isNaN(Number(peso)) || Number(peso) <= 0)
      ? 'Digite um peso maior que zero.'
      : undefined;

  const hasChanges =
    nome !== (animal?.nome || '') ||
    raca !== animal?.raca ||
    peso !== String(animal?.peso) ||
    status !== animal?.status;

  const isFormValid =
    raca.trim().length >= 2 &&
    peso.trim().length > 0 &&
    !racaError &&
    !pesoError;

  const handleSave = async () => {
    if (saving || !isFormValid || !animalId) return;

    await updateAnimal(animalId, {
      nome: nome.trim() || null,
      raca: raca.trim(),
      peso: Number(peso),
      status,
    });
  };

  if (loadingDetail) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados do animal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!animal) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
        <ErrorState message="Animal não encontrado." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Editar Animal</Text>
            <Text style={styles.subtitle}>
              {animal?.codigoIdentificacao}
            </Text>
          </View>

          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        </View>

        <Card padding={20} shadow style={styles.card}>
          <Text style={styles.sectionTitle}>Campos somente leitura</Text>

          <View style={styles.readonlyRow}>
            <Text style={styles.readonlyLabel}>Código de Identificação</Text>
            <Text style={styles.readonlyValue}>{animal.codigoIdentificacao}</Text>
          </View>
          <View style={styles.readonlyRow}>
            <Text style={styles.readonlyLabel}>Data de Nascimento</Text>
            <Text style={styles.readonlyValue}>
              {animal.dataNascimento.toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View style={styles.readonlyRow}>
            <Text style={styles.readonlyLabel}>Fazenda</Text>
            <Text style={styles.readonlyValue}>{animal.fazendaId}</Text>
          </View>
        </Card>

        <Card padding={20} shadow style={styles.form}>
          <Text style={styles.sectionTitle}>Campos editáveis</Text>

          <Input
            label="Nome (opcional)"
            placeholder="Ex: Mimosa"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
          />

          <Input
            label="Raça"
            placeholder="Ex: Nelore"
            value={raca}
            onChangeText={setRaca}
            returnKeyType="next"
            error={racaError}
          />

          <Input
            label="Peso (kg)"
            placeholder="Ex: 450"
            value={peso}
            onChangeText={setPeso}
            keyboardType="decimal-pad"
            returnKeyType="next"
            error={pesoError}
          />

          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setStatus(option)}
                style={[
                  styles.statusOption,
                  status === option && styles.statusOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === option && styles.statusOptionTextActive,
                  ]}
                >
                  {option === 'ATIVO' ? 'Ativo' : option === 'VENDIDO' ? 'Vendido' : 'Morto'}
                </Text>
              </Pressable>
            ))}
          </View>

          {error ? <ErrorState message={error} /> : null}

          <Button
            fullWidth
            title="Salvar Alterações"
            onPress={handleSave}
            loading={saving}
            disabled={saving || !isFormValid || !hasChanges}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundMuted,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.borderSoft,
  },
  backText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  card: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundMuted,
    borderColor: theme.colors.border,
  },
  form: {
    elevation: 4,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  readonlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  readonlyLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.sm,
  },
  readonlyValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  statusLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statusOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  statusOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statusOptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  statusOptionTextActive: {
    color: theme.colors.textInverse,
  },
});
