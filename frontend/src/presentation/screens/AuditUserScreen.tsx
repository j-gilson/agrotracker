import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AuditTimeline, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { useAuditByUser } from '../viewmodels/useAudit';

export const AuditUserScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const userId = typeof params.userId === 'string' ? params.userId : '';

  const { data, loading, error, refresh } = useAuditByUser(userId);

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico do Usuário</Text>
          <Text style={styles.subtitle}>Ações registradas</Text>
        </View>
        <ErrorState message="Parâmetro obrigatório não informado: userId." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico do Usuário</Text>
        <Text style={styles.subtitle}>Ações registradas</Text>
      </View>

      {loading && !data ? (
        <Loading text="Carregando histórico..." variant="list" />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="Nenhum registro encontrado." subtitle="Quando houver ações, elas aparecerão aqui." />
      ) : (
        <AuditTimeline items={data.items} />
      )}
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
});
