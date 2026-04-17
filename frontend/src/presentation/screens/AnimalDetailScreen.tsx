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
import { useLocalSearchParams } from 'expo-router';
import { Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { formatDate } from '../../core/utils/formatDate';
import { formatWeight } from '../../core/utils/formatWeight';

export const AnimalDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { animal, manejos, loading, error, refresh } = useAnimalDetail(id || '');

  const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );

  if (loading && !animal) {
    return <Loading text="Carregando ficha do animal..." variant="detail" />;
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
            <Text style={styles.title}>Ficha do Animal</Text>
            <Text style={styles.subtitle}>{animal?.nome}</Text>
          </View>
          <View style={[styles.badge, styles.badgeAtivo]}>
            <Text style={styles.badgeText}>Ativo</Text>
          </View>
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
          <InfoRow label="ID / QR Code" value={animal?.id} />
          <InfoRow label="Raça" value={animal?.raca} />
          <InfoRow label="Peso Atual" value={formatWeight(animal?.peso)} />
          <InfoRow label="Idade" value={animal?.idade ? `${animal.idade} meses` : '-'} />
          <InfoRow label="Nascimento" value={formatDate(animal?.dataNascimento)} />
        </Card>

        <Text style={styles.sectionTitle}>Histórico de Manejos</Text>
        {manejos.length === 0 ? (
          <Card shadow={false} style={styles.emptyCard}>
            <EmptyState title="Nenhum registro de manejo encontrado." />
          </Card>
        ) : (
          manejos.map((m) => (
            <View key={m.id} style={styles.timelineItem}>
              <View style={styles.timelineIcon}>
                <Text style={styles.timelineIconText}>
                  {m.tipoEvento === 'Pesagem' ? '⚖️' : '💉'}
                </Text>
              </View>
              <Card padding={12} style={styles.timelineCard}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>{m.tipoEvento}</Text>
                  <Text style={styles.timelineDate}>{formatDate(m.dataHora)} {m.dataHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                {m.pesoKg ? <Text style={styles.timelineText}>Peso: {m.pesoKg} Kg</Text> : null}
                {m.vacina ? <Text style={styles.timelineText}>Vacina: {m.vacina}</Text> : null}
                {m.observacoes ? <Text style={styles.timelineObs}>{m.observacoes}</Text> : null}
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
    marginBottom: theme.spacing.xl,
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
