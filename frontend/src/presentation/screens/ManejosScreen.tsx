import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useManejos } from '../viewmodels/useManejos';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { router, useFocusEffect } from 'expo-router';
import { Event } from '../../domain/events/entities/Event';
import { Button, Card, EmptyState, ErrorState, Loading } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { formatDate } from '../../core/utils/formatDate';
import { refreshOnReturn } from '../navigation/refreshOnReturn';

export const ManejosScreen: React.FC = () => {
  const { activeFarmId, activeFarm, loading: farmsLoading } = useActiveFarm();
  const { events, loading, error, refresh } = useManejos(activeFarmId);
  const hasFocusedOnceRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      refreshOnReturn(hasFocusedOnceRef, refresh);
    }, [refresh])
  );

  const renderManejoItem = ({ item }: { item: Event }) => (
    <Card
      marginBottom={16}
      onPress={() => router.push(AppRoutes.ANIMAL_DETAIL(item.animalId))}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text style={styles.dateText}>
          {formatDate(item.date)}{' '}
          {item.date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.animalIdText}>Animal ID: {item.animalId}</Text>
        <Text style={styles.obsText} numberOfLines={2}>
          💬 {item.description}
        </Text>
        <Text style={styles.cardCta}>Ver Animal &gt;</Text>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyState
      subtitle="Registre um manejo para começar a preencher o histórico."
      title="Nenhum manejo encontrado."
    />
  );

  if (farmsLoading) {
    return <Loading text="Carregando..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manejos</Text>
        <Text style={styles.subtitle}>
          {activeFarm
            ? `Histórico de ${activeFarm.nome}`
            : 'Histórico de atividades recentes'}
        </Text>
      </View>

      {loading && events.length === 0 ? (
        <Loading text="Carregando manejos..." variant="list" />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          renderItem={renderManejoItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}

      <Button
        onPress={() =>
          router.push(AppRoutes.SCANNER_WITH_FAZENDA(activeFarmId))
        }
        disabled={!activeFarmId}
        style={[
          styles.fab,
          !activeFarmId && styles.fabDisabled,
        ]}
        title={activeFarmId ? 'Novo Manejo' : 'Selecione Fazenda'}
      />
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
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm - 2,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.sm - 2,
  },
  typeText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.xs,
  },
  dateText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.xs,
  },
  cardContent: {
    gap: 4,
  },
  animalIdText: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xxs,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  obsText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xxs,
  },
  cardCta: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textAccent,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    elevation: 4,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabDisabled: {
    opacity: 0.6,
  },
});
