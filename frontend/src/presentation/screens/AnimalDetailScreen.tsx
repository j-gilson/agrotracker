import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAnimalDetail } from '../viewmodels/useAnimalDetail';
import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { Card, EmptyState, ErrorState, Loading, Button } from '../components';
import { theme } from '../../core/theme';
import { formatDate } from '../../core/utils/formatDate';
import { formatWeight } from '../../core/utils/formatWeight';
import { AppRoutes } from '../../core/routes/AppRoutes';

export const AnimalDetailScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const animalId =
    typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { animal, events, loading, error, refresh } = useAnimalDetail(animalId);
  const hasFocusedOnceRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!hasFocusedOnceRef.current) {
        hasFocusedOnceRef.current = true;
        return;
      }

      refresh();
    }, [refresh])
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );

  if (loading && !animal) {
    return <Loading text="Carregando ficha do animal..." variant="detail" />;
  }

  if (!animalId) {
    return <ErrorState message="Parâmetro obrigatório não informado: animalId." />;
  }

  if (error && !animal) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} colors={[theme.colors.primary]} />
        }
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>
              {animal?.nome || animal?.codigoIdentificacao || 'Animal'}
            </Text>
            <Text style={styles.subtitle}>Ficha do animal</Text>
          </View>

          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        </View>



        <View style={styles.tabsRow}>
          <Pressable style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Dados</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Histórico</Text>
          </Pressable>
        </View>

        <Card marginBottom={24} shadow={false} style={styles.card}>
          <InfoRow label="Código de Identificação" value={animal?.codigoIdentificacao} />
          <InfoRow label="Status" value={animal?.status} />
          <InfoRow label="Raça" value={animal?.raca} />
          <InfoRow label="Peso Atual" value={formatWeight(animal?.peso)} />
          <InfoRow
            label="Idade"
            value={animal ? `${animal.idade} anos` : '-'}
          />
          <InfoRow label="Nascimento" value={formatDate(animal?.dataNascimento)} />
          <InfoRow label="Cadastrado em" value={formatDate(animal?.dataCriacao)} />
        </Card>

        <Text style={styles.sectionTitle}>Histórico de Manejos</Text>

        {animal?.fazendaId ? (
          <Button
            title="Novo Manejo"
            variant="secondary"
            onPress={() =>
              router.push(AppRoutes.CREATE_EVENT(animalId, animal.fazendaId) as unknown as Href)
            }
            style={styles.createEventButton}
          />
        ) : null}

        {events.length === 0 ? (
          <Card shadow={false} style={styles.emptyCard}>
            <EmptyState title="Nenhum registro de manejo encontrado." />
          </Card>
        ) : (
          events.map((m) => (
            <View key={m.id} style={styles.timelineItem}>
              <View style={styles.timelineIcon}>
                <Text style={styles.timelineIconText}>
                  {m.type.toUpperCase() === 'PESAGEM' ? '⚖️' : '💉'}
                </Text>
              </View>
              <Card padding={12} style={styles.timelineCard}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>{m.type}</Text>
                  <Text style={styles.timelineDate}>{formatDate(m.date)} {m.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <Text style={styles.timelineObs}>{m.description}</Text>
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs - 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.borderSoft,
  },
  badgeAtivo: {
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xs,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  tabTextActive: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  card: {
    backgroundColor: theme.colors.backgroundMuted,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSoft,
  },
  infoLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  infoValue: {
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  createEventButton: {
    marginBottom: theme.spacing.md,
  },
  emptyCard: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    borderStyle: 'dashed',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timelineIcon: {
    width: theme.sizes.timelineIcon,
    height: theme.sizes.timelineIcon,
    borderRadius: theme.sizes.timelineIcon / 2,
    backgroundColor: theme.colors.successSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  timelineIconText: {
    fontSize: theme.typography.fontSize.lg,
  },
  timelineCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xxs,
  },
  timelineTitle: {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.sm + 1,
    color: theme.colors.primary,
  },
  timelineDate: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
  },
  timelineText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  timelineObs: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing.xxs,
    fontStyle: 'italic',
  },
});
