import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { useManejos } from '../viewmodels/useManejos';
import { useActiveFarm } from '../contexts/ActiveFarmContext';
import { router, useFocusEffect } from 'expo-router';
import { Event } from '../../domain/events/entities/Event';
import { Button, Card, EmptyState, ErrorState, Loading, PageHeader } from '../components';
import { theme } from '../../core/theme';
import { AppRoutes } from '../../core/routes/AppRoutes';
import { formatDate } from '../../core/utils/formatDate';
import { refreshOnReturn } from '../navigation/refreshOnReturn';
import { EVENT_TYPE_OPTIONS, EventType } from '../../domain/events/types';

const SAFE_TOP = Platform.select({ android: (StatusBar.currentHeight ?? 24), default: 0 });

const eventTypeLabels = EVENT_TYPE_OPTIONS.reduce<Record<EventType, string>>(
  (labels, option) => ({
    ...labels,
    [option.value]: option.label,
  }),
  {} as Record<EventType, string>
);

const getEventTypeLabel = (type: EventType): string => eventTypeLabels[type];

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
          <Text style={styles.typeText}>{getEventTypeLabel(item.type)}</Text>
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
        <Text style={styles.obsText} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.cardCta}>Ver animal →</Text>
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

  if (!activeFarmId) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
        <PageHeader
          title="Manejos"
          subtitle="Nenhuma fazenda ativa"
        />

        <View style={styles.emptyStateContainer}>
          <EmptyState
            buttonText="Selecionar Fazenda"
            onPress={() => router.push({ pathname: AppRoutes.FAZENDAS })}
            subtitle="Selecione uma fazenda para visualizar e registrar manejos."
            title="Nenhuma fazenda ativa"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: SAFE_TOP }]}>
      <PageHeader
        title="Manejos"
        subtitle={
          activeFarm
            ? `Histórico de ${activeFarm.nome}`
            : 'Histórico de atividades recentes'
        }
      />

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
        style={styles.fab}
        title="Escanear para Novo Manejo"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  emptyStateContainer: {
    flex: 1,
    padding: theme.spacing.lg,
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
  obsText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
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
});
