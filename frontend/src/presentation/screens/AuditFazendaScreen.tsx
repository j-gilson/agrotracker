import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AuditTimeline, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { useAuditByFazenda } from '../viewmodels/useAudit';

export const AuditFazendaScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const fazendaId = typeof params.fazendaId === 'string' ? params.fazendaId : '';
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  const { data, loading, error, refresh, setParams } = useAuditByFazenda(fazendaId);

  const applyFilter = (filter: 'all' | 'today' | '7days' | '30days') => {
    setActiveFilter(filter);
    const now = new Date();
    let startDate: string | undefined;

    if (filter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = today.toISOString();
    } else if (filter === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = sevenDaysAgo.toISOString();
    } else if (filter === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      startDate = thirtyDaysAgo.toISOString();
    }

    setParams((prev) => ({ ...prev, startDate }));
  };

  if (!fazendaId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico da Fazenda</Text>
          <Text style={styles.subtitle}>Atividades registradas</Text>
        </View>
        <ErrorState message="Parâmetro obrigatório não informado: fazendaId." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico da Fazenda</Text>
        <Text style={styles.subtitle}>Atividades registradas</Text>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterButton label="Tudo" active={activeFilter === 'all'} onPress={() => applyFilter('all')} />
          <FilterButton label="Hoje" active={activeFilter === 'today'} onPress={() => applyFilter('today')} />
          <FilterButton label="7 dias" active={activeFilter === '7days'} onPress={() => applyFilter('7days')} />
          <FilterButton label="30 dias" active={activeFilter === '30days'} onPress={() => applyFilter('30days')} />
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} colors={[theme.colors.primary]} />
        }
      >
        {loading && !data ? (
          <Loading text="Carregando histórico..." variant="list" />
        ) : error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="Nenhum registro encontrado." subtitle="Quando houver ações na fazenda, elas aparecerão aqui." />
        ) : (
          <AuditTimeline items={data.items} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const FilterButton = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
    <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primaryDark,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  filterRow: {
    marginBottom: theme.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.backgroundMuted,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  filterLabelActive: {
    color: theme.colors.textInverse,
  },
  content: {
    flex: 1,
  },
});
