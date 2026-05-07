import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AuditTimeline, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { useAuditByEntity } from '../viewmodels/useAudit';

export const AuditTimelineScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const entityType = typeof params.entityType === 'string' ? params.entityType : '';
  const entityId = typeof params.entityId === 'string' ? params.entityId : '';

  const { data, loading, error, refresh } = useAuditByEntity(entityType, entityId);

  if (!entityType || !entityId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>Timeline da entidade</Text>
        </View>
        <ErrorState message="Parâmetro obrigatório não informado: entityType ou entityId." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Timeline da entidade</Text>
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
          <EmptyState title="Nenhum registro encontrado." subtitle="Quando houver alterações, elas aparecerão aqui." />
        ) : (
          <AuditTimeline items={data.items} />
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
  content: {
    flex: 1,
  },
});
